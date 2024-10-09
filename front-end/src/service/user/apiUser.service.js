import axios from "../../utils/axios/user/axiosConfig.util";
import Cookies from "js-cookie";

class ApiUserService {
  constructor() {
    this.baseUrl = "/user";
  }

  async get(endpoint, contentType = "application/json") {
    const url = this.baseUrl + endpoint;
    const headers = {
      "Content-Type": contentType,
    };

    return await axios.get(url, { headers });
  }

  async post(endpoint, data, contentType = "application/json") {
    const url = this.baseUrl + endpoint;
    const headers = {
      "Content-Type": contentType,
    };

    return await axios.post(url, data, { headers });
  }

  async put(endpoint, data, contentType = "application/json") {
    const url = this.baseUrl + endpoint;
    const headers = {
      "Content-Type": contentType,
    };

    return await axios.put(url, data, { headers });
  }

  async delete(endpoint, contentType = "application/json") {
    const url = this.baseUrl + endpoint;
    const headers = {
      "Content-Type": contentType,
    };

    return await axios.delete(url, { headers });
  }

  async refreshAccessToken() {
    try {
      const refreshToken = Cookies.get("refreshToken");
      const endpoint = `${this.baseUrl}/auth/refreshToken`;
      const response = await axios.post(endpoint, null, {
        headers: {
          Authorization: `Bearer ${refreshToken}`,
        },
      });
      if (response.status === 200) {
        return response.data;
      } else {
        throw new Error("Không thể làm mới token.");
      }
    } catch (error) {
      console.error("Lỗi khi làm mới access token:", error);
      throw error;
    }
  }
}

export default ApiUserService;
