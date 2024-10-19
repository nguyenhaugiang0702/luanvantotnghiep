import Cookies from "js-cookie";
import ApiAdmin from "@/service/admin/apiAdmin.service";
import ApiUser from "@/service/user/apiUser.service";

// Hàm kiểm tra quyền admin và cho phép truy cập nếu đúng quyền
const checkAdminAccess = async (to, from, next) => {
  const isLoggedIn = Cookies.get("isLoggedIn");

  if (isLoggedIn) {
    const apiAdmin = new ApiAdmin();
    try {
      const response = await apiAdmin.get("/auth/checkRole");

      if (response.data.role === "admin" || response.data.role === "sale") {
        return next(); // Cho phép truy cập nếu role là admin
      } else {
        return next({ name: "notfound" }); // Nếu không phải admin, chuyển hướng tới trang notfound
      }
    } catch (error) {
      return next({ name: "admin-login" }); // Nếu có lỗi, chuyển hướng tới trang login
    }
  } else {
    return next({ name: "admin-login" }); // Nếu chưa đăng nhập, chuyển hướng tới trang login
  }
};

// Hàm kiểm tra đăng nhập và điều hướng đến trang admin nếu đúng quyền
const checkLoginAndRedirect = async (to, from, next) => {
  // const token = Cookies.get("accessToken");
  const isLoggedIn = Cookies.get("isLoggedIn");

  if (isLoggedIn) {
    const apiUser = new ApiUser();
    try {
      const response = await apiUser.get("/auth/checkRole");

      if (response.data.role === "customer") {
        next();
      } else {
        next({ name: "notfound" });
      }
    } catch (error) {
      next({ name: "login" });
    }
  } else {
    next({ name: "login" });
  }
};

export { checkAdminAccess, checkLoginAndRedirect };
