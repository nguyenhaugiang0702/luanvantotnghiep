import axios from "axios";
import Swal from "sweetalert2";

class AuthAdminService {
  constructor() {
    this.baseUrl = "http://localhost:3000/api/v1/auth/admin";
  }

  async get(endpoint, token) {
    const url = this.baseUrl + endpoint;
    const headers = {
      "Content-Type": "application/json",
    };
    if (token) {
      headers["Authorization"] = "Bearer " + token;
    }
    return await axios.get(url, { headers });
  }

  async post(endpoint, data, token) {
    const url = this.baseUrl + endpoint;
    const headers = {
      "Content-Type": "application/json",
    };
    if (token != null) {
      headers["Authorization"] = "Bearer " + token;
    }
    return await axios.post(url, data, { headers });
  }

  async put(endpoint, data, token) {
    const url = this.baseUrl + endpoint;
    const headers = {
      "Content-Type": "application/json",
    };
    if (token != null) {
      headers["Authorization"] = "Bearer " + token;
    }
    return await axios.put(url, data, { headers });
  }

  async delete(endpoint, token) {
    const url = this.baseUrl + endpoint;
    const headers = {
      "Content-Type": "application/json",
    };
    if (token) {
      headers["Authorization"] = "Bearer " + token;
    }
    return await axios.delete(url, { headers });
  }
}

export default AuthAdminService;
