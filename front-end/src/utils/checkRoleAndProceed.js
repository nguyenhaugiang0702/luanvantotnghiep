import Cookies from "js-cookie";
import AuthAdminService from "@/service/auth/authAdmin.service";
import AuthUserService from "@/service/auth/authUser.service";


// Hàm kiểm tra quyền admin và cho phép truy cập nếu đúng quyền
const checkAdminAccess = async (to, from, next) => {
  // const token = Cookies.get("accessToken");
  const isLoggedIn = Cookies.get("isLoggedIn");

  if (isLoggedIn) {
    const authAdminService = new AuthAdminService();
    try {
      const response = await authAdminService.get("/checkRole");

      if (response.data.role === "admin") {
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
    const authUserService = new AuthUserService();
    try {
      const response = await authUserService.get("/checkRole");

      if (response.data.role === "customer") {
        console.log(1);
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
