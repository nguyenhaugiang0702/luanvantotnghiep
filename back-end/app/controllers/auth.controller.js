const userService = require("../services/user.service");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const moment = require("moment-timezone");
const ApiError = require("../api-error");
const User = require("../models/user.model");
const sendOTP = require("../twilio");
const otpService = require("../services/otp.service");

exports.login = async (req, res, next) => {
  const { phoneNumber, password } = req.body;
  try {
    const user = await User.findOne({ phoneNumber: phoneNumber });

    if (!user) {
      return next(new ApiError(404, "Tài khoản không tồn tại."));
    }

    if (user.isActive <= 0) {
      return next(new ApiError(404, "Tài khoản chưa được kích hoạt."));
    }

    if (user.isActive >= 2) {
      return next(new ApiError(404, "Tài khoản đã bị khóa"));
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return next(new ApiError(400, "Mật khẩu không chính xác."));
    }

    const accessToken = jwt.sign({ _id: user._id }, "your_jwt_secret_key", {
      expiresIn: "6h",
    });

    res.send({
      isLoggedIn: true,
      message: "Đăng nhập thành công!",
      accessToken,
    });
  } catch (error) {
    return next(new ApiError(500, "Lỗi khi đăng nhập"));
  }
};

exports.createOTP = async (req, res, next) => {
  const { phoneNumber } = req.body;
  try {
    const userExistWithPhoneNumber = await userService.checkPhoneNumberExist(
      phoneNumber
    );
    if (userExistWithPhoneNumber) {
      return next(new ApiError(400, "Số điện thoại này đã được sử dụng"));
    }
    const otpUser = await otpService.findRecordByPhoneNumber(phoneNumber);
    const otp = await sendOTP(phoneNumber);
    const expiresAt = moment()
      .tz("Asia/Ho_Chi_Minh")
      .add(45, "minutes")
      .toDate();

    if (!otpUser) {
      await otpService.createOTP({
        phoneNumber,
        otp,
        expiresAt,
      });
    }
    await otpService.updateOTPByPhoneNumber(phoneNumber, {
      otp: otp,
      expiresAt: expiresAt,
    });

    return res.send({
      message: "Mã OTP đã được gửi",
      otpCode: otp,
      otpSent: true,
    });
  } catch (error) {
    return next(new ApiError(500, "Lỗi khi tạo OTP"));
  }
};

exports.signUpVerify = async (req, res, next) => {
  const { phoneNumber, otp } = req.body;
  try {
    const otpRecord = await otpService.findRecordByOTPAndPhoneNumber(phoneNumber, otp);

    if (!otpRecord) {
      return next(new ApiError(400, "Mã OTP không chính xác hoặc đã hết hạn."));
    }

    const currentTime = moment().tz("Asia/Ho_Chi_Minh");

    if (currentTime.isAfter(moment(otpRecord.expiresAt))) {
      return next(new ApiError(400, "Mã OTP đã hết hạn."));
    }

    return res.send({
      message: "Xác thực OTP thành công!",
      otpVerified: true,
    });
  } catch (error) {
    return next(new ApiError(500, "Lỗi khi xác thực OTP"));
  }
};
