import { api } from "./authService";

const UserServices = {
  async getUser() {
    const response = await api.get("/users/me");
    return response.data;
  },

  async updateUser(data) {
    const response = await api.put("/users/me", data);
    return response.data;
  },
};

export default UserServices;
