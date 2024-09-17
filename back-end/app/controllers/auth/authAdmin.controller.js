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
        expiresIn: "1y",
      }
    );

    res.send({
      isLoggedIn: true,
      message: "Đăng nhập thành công!",
      accessToken,
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
