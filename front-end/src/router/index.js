import { createWebHistory, createRouter } from "vue-router";
import admin from "./admin.js";
import client from "./client.js";
import Cookies from "js-cookie";
import {
  checkAdminAccess,
  checkLoginAndRedirect,
} from "@/utils/checkRoleAndProceed";

const routes = [...admin, ...client];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

// Guard toàn cục
router.beforeEach(async (to, from, next) => {
  const isLoggedIn = Cookies.get("isLoggedIn");
  const token = Cookies.get("accessToken");
  // Nếu người dùng đã đăng nhập và cố gắng truy cập trang login hoặc register
  if (isLoggedIn && (to.name === "login" || to.name === "register")) {
    return next({ name: "home" });
  }

  if (isLoggedIn && to.name === "admin-login") {
    return next({ name: "admin" });
  }
  // Kiểm tra nếu route yêu cầu quyền admin
  if (to.meta.requiresAuth && to.meta.requiresAdmin) {
    // Gọi hàm kiểm tra quyền admin
    await checkAdminAccess(to, from, next);
  } else if (to.meta.requiresAuth && !to.meta.requiresAdmin) {
    // Nếu chỉ yêu cầu đăng nhập nhưng không yêu cầu quyền admin (cho client)
    await checkLoginAndRedirect(to, from, next);
  } else {
    next(); // Nếu route không yêu cầu đăng nhập hoặc quyền, tiếp tục điều hướng
  }
});

export default router;
