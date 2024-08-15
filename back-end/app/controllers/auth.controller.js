const userService = require("../services/user.service");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const moment = require("moment-timezone");
const ApiError = require("../api-error");
const User = require("../models/user.model");
const sendOTP = require("../twilio");
const otpService = require("../services/otp.service");
const sendEmail = require("../utils/email.util");
const config = require("../config/index");

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

    const accessToken = jwt.sign({ id: user._id }, "my_jwt_secret_key_login", {
      expiresIn: "6h",
    });

    res.send({
      isLoggedIn: true,
      message: "Đăng nhập thành công!",
      accessToken,
      user: user,
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

    // Nếu tài khoản tồn tại và đã được kích hoạt qua OTP
    if (userExistWithPhoneNumber && userExistWithPhoneNumber.isActive == 1) {
      if (userExistWithPhoneNumber.phoneNumber == phoneNumber) {
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
    } else {
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
    }
  } catch (error) {
    return next(new ApiError(500, "Lỗi khi tạo OTP"));
  }
};

exports.signUpVerify = async (req, res, next) => {
  const { phoneNumber, otp } = req.body;
  try {
    const otpRecord = await otpService.findRecordByOTPAndPhoneNumber(
      phoneNumber,
      otp
    );

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

exports.sendEmailToActive = async (req, res, next) => {
  const userID = req.user.id;
  const { email } = req.body;

  try {
    const tokenWithEmail = jwt.sign(
      { id: userID, email: email },
      "my_secret_key_with_email_to_active"
    );
    const activeEmailUrl = `${config.app.appUrl}/api/v1/users/activeEmail/${tokenWithEmail}`;
    const message = `
          <p>Please click on the link below to activate your email</p>
          <a href="${activeEmailUrl}" target="_blank">Click Here</a>
      `;

    await sendEmail({
      email: email,
      subject: "Kích hoạt email",
      html: message,
    });

    return res.send({
      message: "Đã gửi email xác nhận",
    });
  } catch (error) {
    return next(new ApiError(500, "Lỗi khi cập nhật"));
  }
};
