import axios from "axios";

class BookService {
  constructor() {
    this.baseUrl = "http://localhost:3000/api/v1/books";
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
      "Content-Type": "multipart/form-data",
    };
    if (token != null) {
      headers["Authorization"] = "Bearer " + token;
    }
    return await axios.post(url, data, { headers });
  }

  async put(endpoint, data, token) {
    const url = this.baseUrl + endpoint;
    const headers = {
      "Content-Type": "multipart/form-data",
    };
    if (token != null) {
      headers["Authorization"] = "Bearer " + token;
    }
    return await axios.put(url, data, { headers });
  }

  async putBookEdit(endpoint, data, token) {
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

export default BookService;
