// import axios from "axios";
import Swal from "sweetalert2";
import axios from "../utils/axiosConfig.util";

class ChatsService {
  constructor() {
    this.baseUrl = "/chats";
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
    
    return await axios.post(url, data, { headers });
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
}

export default ChatsService;
