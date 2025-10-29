import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

const UserServices = {
  async getUser() {
    const response = await axios.get(`${API_URL}/me`, { withCredentials: true });
    return response.data;
  },

  async updateUser(data) {
    const response = await axios.put(API_URL, data, { withCredentials: true });
    return response.data;
  },
};

export default UserServices;
