const authAdminService = require("../../services/auth/authAdmin.service");
const adminService = require("../../services/admin.service");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const moment = require("moment-timezone");
const ApiError = require("../../api-error");
const sendOTP = require("../../twilio");
const otpService = require("../../services/otp.service");
const sendEmail = require("../../utils/email.util");
const config = require("../../config/index");
const tokenService = require("../../services/token.service");

exports.login = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const admin = await authAdminService.getAdminByEmail(email);

    if (!admin) {
      return next(new ApiError(404, "Tài khoản không tồn tại."));
    }

    const isMatch = await bcrypt.compare(password, admin.password);

    if (!isMatch) {
      return next(new ApiError(400, "Mật khẩu không chính xác."));
    }

    const accessToken = tokenService.createAdminAccessToken(
      admin._id,
      admin.role
    );

    const refreshToken = tokenService.createAdminRefreshToken(
      admin._id,
      admin.role
    );

    return res.send({
      isLoggedIn: true,
      message: "Đăng nhập thành công!",
      accessToken,
      refreshToken,
      success: true,
      admin: admin,
    });
  } catch (error) {
    console.log(error);
    return next(new ApiError(500, "Lỗi khi đăng nhập"));
  }
};

exports.checkRole = async (req, res, next) => {
  const adminID = req.admin.id;
  try {
    const admin = await adminService.getAdminByID(adminID);
    if (!admin) {
      return next(new ApiError(404, "Không tồn tại adminID"));
    }
    return res.send({ role: admin.role });
  } catch (error) {
    return next(new ApiError(500, "Lỗi khi đăng nhập"));
  }
};

exports.refreshToken = async (req, res, next) => {
  const adminID = req.admin.id;
  const refreshToken = req.admin.token;

  try {
    const admin = await adminService.getAdminByID(adminID);

    if (!admin) {
      return next(new ApiError(404, "Tài khoản không tồn tại."));
    }
    const newAccessToken = tokenService.createAdminAccessToken(
      adminID,
      admin.role
    );
    return res.send({
      accessToken: newAccessToken,
      isLoggedIn: true,
      refreshToken: refreshToken,
    });
  } catch (error) {
    return next(
      new ApiError(403, "Refresh token không hợp lệ hoặc đã hết hạn.")
    );
  }
};

exports.changePassword = async (req, res, next) => {
  const adminID = req.admin ? req.admin.id : null;
  if (!adminID) {
    return next(new ApiError(400, "Vui lòng đăng nhập"));
  }
  const { currentPassword, newPassword, cfNewPassword } = req.body;
  try {
    const admin = await adminService.getAdminByID(adminID);
    const isMatch = await bcrypt.compare(currentPassword, admin.password);
    if (!isMatch) {
      return next(new ApiError(400, "Mật khẩu hiện tại không đúng"));
    }
    if (newPassword !== cfNewPassword) {
      return next(
        new ApiError(400, "Mật khẩu mới và nhập lại mật khẩu phải giống nhau")
      );
    }
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    const updateAdmin = await adminService.updateAdmin(adminID, {
      password: hashedNewPassword,
    });
    if (!updateAdmin) {
      return next(new ApiError(400, "Lỗi khi đổi mật khẩu"));
    }
    return res.send({
      message: "Đổi mật khẩu thành công",
    });
  } catch (error) {
    return next(new ApiError(500, "Lỗi khi đổi mật khẩu"));
  }
};
