// import axios from "axios";
import Cookies from "js-cookie";
import axios from "../../utils/axiosConfig.util";

class AuthUserService {
  constructor() {
    this.baseUrl = "/auth/user";
  }

  async get(endpoint) {
    const url = this.baseUrl + endpoint;
    const headers = {
      "Content-Type": "application/json",
    };
    return await axios.get(url, { headers });
  }

  async post(endpoint, data) {
    const url = this.baseUrl + endpoint;
    const headers = {
      "Content-Type": "application/json",
    };
    return await axios.post(url, data);
  }

  async put(endpoint, data) {
    const url = this.baseUrl + endpoint;
    const headers = {
      "Content-Type": "application/json",
    };
    return await axios.put(url, data, { headers });
  }

  async delete(endpoint) {
    const url = this.baseUrl + endpoint;
    const headers = {
      "Content-Type": "application/json",
    };
    return await axios.delete(url, { headers });
  }

  async refreshAccessToken() {
    try {
      const refreshToken = Cookies.get("refreshToken");
      const endpoint = `${this.baseUrl}/refreshToken`;
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

export default AuthUserService;
