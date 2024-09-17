import { defineStore } from "pinia";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    isAuthenticated: false,
    user: null,
  }),
  actions: {
    login(credentials) {
      // Xử lý đăng nhập ở đây
      this.isAuthenticated = true;
      // Lưu thông tin user nếu cần
    },
    logout() {
      this.isAuthenticated = false;
      this.user = null;
    },
  },
});
