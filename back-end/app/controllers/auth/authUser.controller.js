const userService = require("../../services/user.service");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const moment = require("moment-timezone");
const ApiError = require("../../api-error");
const User = require("../../models/user.model");
const sendOTP = require("../../twilio");
const otpService = require("../../services/otp.service");
const authUserService = require("../../services/auth/authUser.service");
const sendEmail = require("../../utils/email.util");
const config = require("../../config/index");
const token = require("../../services/token.service");

exports.login = async (req, res, next) => {
  const { phoneNumber, password } = req.body;
  const phoneRegex = /^0\d{9}$/;

  // Kiểm tra nếu `phoneNumber` tồn tại và hợp lệ
  if (phoneNumber && !phoneRegex.test(phoneNumber)) {
    return next(new ApiError(400, "Số điện thoại không hợp lệ"));
  }
  try {
    const user = await authUserService.getUserByPhoneNumber(phoneNumber);

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

    const accessToken = token.createAccessToken(user._id);
    const refreshToken = token.createRefreshToken(user._id);

    await userService.saveRefreshToken(user._id, refreshToken);
    return res.send({
      isLoggedIn: true,
      message: "Đăng nhập thành công!",
      accessToken,
      refreshToken,
      user: user,
    });
  } catch (error) {
    return next(new ApiError(500, "Lỗi khi đăng nhập"));
  }
};

exports.createOTP = async (req, res, next) => {
  const { phoneNumber, email } = req.body;
  try {
    if (phoneNumber) {
      // Gửi mã OTP qua số điện thoại
      const userExistWithPhoneNumber = await userService.checkPhoneNumberExist(
        phoneNumber
      );

      // Nếu tài khoản tồn tại và đã được kích hoạt qua OTP
      if (userExistWithPhoneNumber && userExistWithPhoneNumber.isActive == 1) {
        if (userExistWithPhoneNumber.phoneNumber == phoneNumber) {
          return next(new ApiError(400, "Số điện thoại này đã được sử dụng"));
        }
        const otpUser = await otpService.findRecordByPhoneNumber(phoneNumber);
        const otpSMS = await sendOTP(phoneNumber);
        const expiresAt = moment()
          .tz("Asia/Ho_Chi_Minh")
          .add(2, "minutes")
          .toDate();

        if (!otpUser) {
          await otpService.createOTP({
            phoneNumber,
            otpSMS,
            expiresAt,
          });
        }
        await otpService.updateOTPByPhoneNumber(phoneNumber, {
          otpSMS: otpSMS,
          expiresAt: expiresAt,
        });

        return res.send({
          message: "Mã OTP đã được gửi",
          otpCode: otpSMS,
          otpSent: true,
        });
      } else {
        if (userExistWithPhoneNumber) {
          return next(new ApiError(400, "Số điện thoại này đã được sử dụng"));
        }

        const otpUser = await otpService.findRecordByPhoneNumber(phoneNumber);
        const otpSMS = await sendOTP(phoneNumber);
        const expiresAt = moment()
          .tz("Asia/Ho_Chi_Minh")
          .add(2, "minutes")
          .toDate();

        if (!otpUser) {
          await otpService.createOTP({
            phoneNumber,
            otpSMS,
            expiresAt,
          });
        }
        await otpService.updateOTPByPhoneNumber(phoneNumber, {
          otpSMS: otpSMS,
          expiresAt: expiresAt,
        });
        return res.send({
          message: "Mã OTP đã được gửi",
          otpCode: otpSMS,
          otpSent: true,
        });
      }
    } else if (email) {
      // Gửi mã OTP qua email
      const otpUser = await otpService.findRecordByEmail(email);
      const otpEmail = await sendEmail({
        email: email,
        subject: "Kích hoạt email",
      });
      const expiresAt = moment()
        .tz("Asia/Ho_Chi_Minh")
        .add(45, "minutes")
        .toDate();

      if (!otpUser) {
        await otpService.createOTP({
          email,
          otpEmail,
          expiresAt,
        });
      }
      await otpService.updateOTPByEmail(email, {
        otpEmail: otpEmail,
        expiresAt: expiresAt,
      });
      return res.send({
        message: "Mã OTP đã được gửi",
        otpCode: otpEmail,
        otpSent: true,
      });
    }
  } catch (error) {
    return next(new ApiError(500, "Lỗi khi tạo OTP"));
  }
};

exports.signUpVerify = async (req, res, next) => {
  const { phoneNumber, otpSMS } = req.body;
  try {
    const otpRecord = await otpService.findRecordByOTPAndPhoneNumber(
      phoneNumber,
      otpSMS
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

exports.loginByAdmin = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const admin = await authUserService.getUserByPhoneNumber(phoneNumber);

    if (!admin) {
      return next(new ApiError(404, "Tài khoản không tồn tại."));
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return next(new ApiError(400, "Mật khẩu không chính xác."));
    }

    const accessToken = jwt.sign(
      { id: user._id },
      "my_jwt_secret_key_bookstore",
      {
        expiresIn: "1y",
      }
    );

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

exports.checkRole = async (req, res, next) => {
  const userID = req.user.id;
  try {
    const user = await userService.getUserById(userID);
    if (!user) {
      return next(new ApiError(404, "Không tồn tại userID"));
    }
    return res.send({ role: user.role });
  } catch (error) {
    return next(new ApiError(500, "Lỗi khi đăng nhập"));
  }
};

exports.refreshToken = async (req, res, next) => {
  const userID = req.user.id;
  const refreshToken = req.user.token;

  try {
    const user = await userService.getUserById(userID);

    if (!user) {
      return next(new ApiError(404, "Tài khoản không tồn tại."));
    }
    const newAccessToken = token.createAccessToken(userID);
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
