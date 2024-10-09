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

    const accessToken = jwt.sign(
      { id: admin._id },
      "my_jwt_secret_key_bookstore_admin",
      {
        expiresIn: "30s",
      }
    );

    const refreshToken = jwt.sign(
      { id: admin._id },
      "my_jwt_secret_key_bookstore_admin",
      {
        expiresIn: "1y",
      }
    );

    return res.send({
      isLoggedIn: true,
      message: "Đăng nhập thành công!",
      accessToken,
      refreshToken,
      admin: admin,
    });
  } catch (error) {
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
    const newAccessToken = jwt.sign(
      { id: adminID },
      "my_jwt_secret_key_bookstore_admin",
      {
        expiresIn: "30m",
      }
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
