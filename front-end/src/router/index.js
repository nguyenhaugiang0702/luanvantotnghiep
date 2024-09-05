import { createWebHistory, createRouter } from "vue-router";
import admin from "./admin.js";
import client from "./client.js";
import Cookies from 'js-cookie';

const routes = [...admin, ...client];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

// Guard để kiểm tra token trước khi truy cập vào trang đăng nhập
router.beforeEach((to, from, next) => {
  const token = Cookies.get('accessToken');
  const isLoggedIn = Cookies.get('isLoggedIn');
  if (token && isLoggedIn && to.name === 'login') {
    next({ path: '/' });
  } else {
    next();
  }
});

export default router;
