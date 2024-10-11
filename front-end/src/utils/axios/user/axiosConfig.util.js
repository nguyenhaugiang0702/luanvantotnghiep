import axios from "axios";
import Cookies from "js-cookie";
import ApiUser from "../../../service/user/apiUser.service";

const instance = axios.create({
  baseURL: "http://localhost:3000/api/v1",
});

instance.interceptors.request.use(
  function (config) {
    const accessToken = Cookies.get("accessToken");
    const isLoggedIn = Cookies.get("isLoggedIn");
    const refreshToken = Cookies.get("refreshToken");
    if (config.url.includes("/auth/refreshToken")) {
      config.headers.Authorization = `Bearer ${refreshToken}`;
    } else {
      if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
      }
    }
    // Kiểm tra nếu config.data là FormData
    if (config.data instanceof FormData) {
      // Không thiết lập Content-Type vì axios sẽ tự động làm điều đó
      delete config.headers["Content-Type"];
    }
    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

instance.interceptors.response.use(
  function (response) {
    return response;
  },
  async function (error) {
    const originalRequest = error.config;

    // Nếu gặp lỗi 401 và chưa thử làm mới token
    if (error.response?.status === 401 && !originalRequest._retry) {
      console.log("Token hết hạn, đang làm mới token...");
      // Cookies.set("isLoggedIn", false);
      originalRequest._retry = true; // Đánh dấu rằng đã thử làm mới token
      try {
        const apiUser = new ApiUser();
        const data = await apiUser.refreshAccessToken();
        const newAccessToken = data.accessToken;
        Cookies.set("accessToken", newAccessToken);
        Cookies.set("refreshToken", data.refreshToken);
        Cookies.set("isLoggedIn", data.isLoggedIn);
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`; // Cập nhật lại token
        return axios(originalRequest); // Thử lại yêu cầu ban đầu
      } catch (refreshError) {
        console.error("Không thể làm mới token:", refreshError);
        // Xử lý nếu không thể làm mới token (đăng xuất người dùng chẳng hạn)
        return Promise.reject(refreshError);
      }
    }
    console.log(error);
    return Promise.reject(error);
  }
);

export default instance;
