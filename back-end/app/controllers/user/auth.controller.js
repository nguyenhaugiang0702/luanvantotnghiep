const userService = require("../../services/user.service");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const moment = require("moment-timezone");
const ApiError = require("../../api-error");
const User = require("../../models/user.model");
const sendOTP = require("../../sendOTP");
const otpService = require("../../services/otp.service");
const authUserService = require("../../services/auth/authUser.service");
const sendEmail = require("../../utils/email.util");
const config = require("../../config/index");
const token = require("../../services/token.service");

exports.login = async (req, res, next) => {
  try {
    const { loginMethod, email, phoneNumber, password } = req.body;
    let user;
    if(loginMethod === 'phone'){
      user = await authUserService.getUserByPhoneNumber(phoneNumber);
      if (!user) {
        return next(new ApiError(404, "Tài khoản không tồn tại."));
      }
    }else{
      user = await authUserService.getUserByEmail(email);
      if (!user) {
        return next(new ApiError(404, "Không tìm thấy email."));
      }
    }

    if (user.isActive >= 2) {
      return next(new ApiError(404, "Tài khoản đã bị khóa"));
    }

    const isMatch = bcrypt.compare(password, user.password);

    if (!isMatch) {
      return next(new ApiError(400, "Mật khẩu không chính xác."));
    }

    const accessToken = token.createAccessToken(user._id, user.role);
    const refreshToken = token.createRefreshToken(user._id, user.role);

    await userService.saveRefreshToken(user._id, refreshToken);
    return res.send({
      isLoggedIn: true,
      message: "Đăng nhập thành công!",
      accessToken,
      refreshToken,
      user: user,
    });
  } catch (error) {
    console.log(error);
    return next(new ApiError(500, "Lỗi khi đăng nhập"));
  }
};

exports.register = async (req, res, next) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    req.body.password = hashedPassword;
    req.body.createdAt = moment().tz("Asia/Ho_Chi_Minh");
    req.body.updatedAt = moment().tz("Asia/Ho_Chi_Minh");
    req.body.isActive = 1;
    req.body.role = "customer";
    const newUser = await userService.createUser(req.body);

    return res.send({
      message: "Đăng ký thành công!",
      newUser,
    });
  } catch (error) {
    console.log(error);
    return next(new ApiError(500, "Lỗi khi đăng ký tài khoản!"));
  }
};

exports.forgotPassword = async (req, res, next) => {
  try {
    const { phoneNumber, password, cfpassword } = req.body;
    const userExistWithPhoneNumber = await authUserService.getUserByPhoneNumber(
      phoneNumber
    );
    if (!userExistWithPhoneNumber) {
      return next(new ApiError(400, "Vui lòng kiểm tra lại số điện thoại"));
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    userExistWithPhoneNumber.password = hashedPassword;
    userExistWithPhoneNumber.updatedAt = moment().tz("Asia/Ho_Chi_Minh");
    await userExistWithPhoneNumber.save();
    return res.send({
      message: "Cập nhật mật khẩu thành công!",
      userExistWithPhoneNumber,
    });
  } catch (error) {
    console.log(error);
    return next(
      new ApiError(
        500,
        "Đã xảy ra lỗi khi cập nhật mật khẩu. Vui lòng thử lại sau!"
      )
    );
  }
};

exports.changePassword = async (req, res, next) => {
  const userID = req.user.id;
  const { currentPassword, newPassword, cfNewPassword } = req.body;
  try {
    const user = await userService.getUserById(userID);
    const isMatch = await bcrypt.compare(currentPassword, user.password);

    if (!isMatch) {
      return next(new ApiError(400, "Mật khẩu hiện tại không đúng"));
    }
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    await userService.updateUser(userID, {
      password: hashedNewPassword,
    });
    return res.send({
      message: "Đổi mật khẩu thành công",
    });
  } catch (error) {
    return next(new ApiError(500, "Lỗi khi đổi mật khẩu"));
  }
};

exports.createOTP = async (req, res, next) => {
  const { phoneNumber, email, method } = req.body;
  const phoneRegex = /^0\d{9}$/;

  if (phoneNumber && !phoneRegex.test(phoneNumber)) {
    return next(new ApiError(400, "Số điện thoại không hợp lệ"));
  }
  try {
    if (phoneNumber) {
      // Gửi mã OTP qua số điện thoại
      const userExistWithPhoneNumber = await userService.checkPhoneNumberExist(
        phoneNumber
      );

      // Nếu tài khoản tồn tại và đã được kích hoạt qua OTP
      if (userExistWithPhoneNumber && userExistWithPhoneNumber.isActive == 1) {
        if (method !== "forgotPassword") {
          if (userExistWithPhoneNumber.phoneNumber == phoneNumber) {
            return next(new ApiError(400, "Số điện thoại này đã được sử dụng"));
          }
        }

        const otpUser = await otpService.findRecordByPhoneNumber(phoneNumber);
        const otpSMS = await sendOTP(phoneNumber);
        const expiresAt = moment().tz("Asia/Ho_Chi_Minh").add(2, "minutes");

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
        const expiresAt = moment().tz("Asia/Ho_Chi_Minh").add(2, "minutes");

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
      const otpCode = Math.floor(100000 + Math.random() * 900000);
      try {
        await sendEmail({
          email: email,
          subject: "Kích hoạt email",
          text: `Mã OTP của bạn là ${otpCode}`,
        });
      } catch (error) {
        return next(
          new ApiError(500, "Lỗi khi gửi mail, vui lòng thử lại sau")
        );
      }

      const expiresAt = moment().tz("Asia/Ho_Chi_Minh").add(2, "minutes");

      if (!otpUser) {
        await otpService.createOTP({
          email,
          otpEmail: otpCode,
          expiresAt,
        });
      }
      await otpService.updateOTPByEmail(email, {
        otpEmail: otpCode,
        expiresAt: expiresAt,
      });
      return res.send({
        message: "Mã OTP đã được gửi",
        otpCode: otpCode,
        otpSent: true,
      });
    }
  } catch (error) {
    return next(new ApiError(500, "Lỗi khi tạo OTP"));
  }
};

exports.verifyOTP = async (req, res, next) => {
  const { phoneNumber, otpSMS } = req.body;
  const phoneRegex = /^0\d{9}$/;
  const otpSMSRegex = /^\d{6}$/;

  if (phoneNumber && !phoneRegex.test(phoneNumber)) {
    return next(new ApiError(400, "Số điện thoại không hợp lệ"));
  }
  if (otpSMS && !otpSMSRegex.test(otpSMS)) {
    return next(new ApiError(400, "Mã OTP không hợp lệ"));
  }
  try {
    const otpRecord = await otpService.findRecordByOTPAndPhoneNumber(
      phoneNumber,
      otpSMS
    );

    if (!otpRecord) {
      return next(
        new ApiError(400, "Vui lòng kiểm tra lại số điện thoại và mã OTP")
      );
    }

    const currentTime = moment().tz("Asia/Ho_Chi_Minh");

    if (currentTime.isAfter(otpRecord.expiresAt)) {
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
