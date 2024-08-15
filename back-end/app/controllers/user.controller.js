const userService = require("../services/user.service");
const otpService = require("../services/otp.service");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const config = require("../config/index");
const sendEmail = require("../utils/email.util");
const moment = require("moment-timezone");
const ApiError = require("../api-error");
const User = require("../models/user.model");
const ValidateService = require("../utils/validate.util");

exports.create = async (req, res, next) => {
  try {
    // const validateService = new ValidateService();
    // const errors = await validateService.validateUser(req.body);
    // if (errors.length > 0) {
    //   return next(new ApiError(400, errors))
    // }
    console.log(req.body);

    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    req.body.password = hashedPassword;
    req.body.createdAt = moment().tz("Asia/Ho_Chi_Minh").toDate();
    req.body.updatedAt = moment().tz("Asia/Ho_Chi_Minh").toDate();
    req.body.isActive = 1;
    req.body.typeLogin = "SMS";
    const newUser = await userService.createUser(req.body);
    const accessToken = jwt.sign(
      { _id: newUser._id },
      "my_secret_key_with_email_to_active"
    );

    // const activeAccountUrl = `${config.app.appUrl}/api/v1/users/activeAccount/${accessTokenWithEmail}`;
    // const message = `
    //     <p>Please click on the link below to activate your account</p>
    //     <a href="${activeAccountUrl}" target="_blank">Click Here</a>
    // `;
    // await sendEmail({
    //   email: newUser.email,
    //   subject: "Kích hoạt tài khoản",
    //   html: message,
    // });
    res.send({
      message: "Đăng ký thành công!",
      newUser,
      accessToken,
    });
  } catch (error) {
    console.log(error);
    return next(new ApiError(500, "Lỗi khi đăng ký tài khoản!"));
  }
};

exports.signIn = async (req, res, next) => {
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
      message: "Đăng nhập thành công!",
      accessToken,
    });
  } catch (error) {
    return next(new ApiError(500, "Lỗi khi đăng nhập"));
  }
};

exports.activeAccount = async (req, res, next) => {
  const userID = req.user._id;
  const userEmail = req.user.email;
  try {
    const userEmailExist = await userService.activeUserAccount({
      _id: userID,
      email: userEmail,
    });
    res.send({
      message: "Tài khoản được kích hoạt!",
      userEmailExist,
    });
  } catch (error) {
    return next(new ApiError(500, "Lỗi khi kích hoạt tài khoản"));
  }
};

exports.activeEmail = async (req, res, next) => {
  const userID = req.user.id;
  const userEmail = req.user.email;
  try {
    await userService.updateUser(userID, userEmail);
    res.redirect(`${config.viteApp.viteURL}/customer/account/edit/`);
  } catch (error) {
    return next(new ApiError(500, "Lỗi khi kích hoạt tài khoản"));
  }
};

exports.blockAccount = async (req, res, next) => {
  try {
    await userService.blockUserAccount(req.params.userID);
    res.send({
      message: "Tài khoản đã bị khóa!",
    });
  } catch (error) {
    return next(new ApiError(500, "Lỗi khi khóa tài khoản"));
  }
};

exports.unBlockAccount = async (req, res, next) => {
  try {
    await userService.unBlockUserAccount(req.params.userID);
    res.send({
      message: "Tài khoản đã được mở khóa!",
    });
  } catch (error) {
    return next(new ApiError(500, "Lỗi khi mở khóa tài khoản"));
  }
};

exports.findALL = async (req, res) => {
  let usersData = [];
  try {
    usersData = await userService.getAllUser();
    return res.send(usersData);
  } catch (error) {
    return next(new ApiError(500, "Lỗi khi lấy tất cả người dùng"));
  }
};

exports.findOne = async (req, res, next) => {
  try {
    const user = await userService.getUserById(req.user.id);
    return res.send(user);
  } catch (error) {
    return next(new ApiError(500, "Lỗi khi tìm thông tin của người dùng"));
  }
};

exports.update = async (req, res, next) => {
  const userID = req.user.id;
  const { newPhoneNumber, otp, userData, email } = req.body;
  try {
    // Update Phone Number
    if (newPhoneNumber && otp) {
      const otpRecord = await otpService.findRecordByOTPAndPhoneNumber(
        newPhoneNumber,
        otp
      );

      if (!otpRecord) {
        return next(new ApiError(400, "OTP không hợp lệ hoặc đã hết hạn."));
      }
      req.body.phoneNumber = newPhoneNumber;
      const userUpdate = await userService.updateUser(userID, req.body);
      return res.send({
        message: "Cập nhật thành công",
        userUpdate,
      });
    } else if (userData) {
      // Update firstName, lastName, gender and dob
      const userUpdate = await userService.updateUser(userID, userData);
      return res.send({
        message: "Cập nhât thành công",
        userUpdate,
      });
    } else if (email) {
      res.send({
        message: "Cập nhât thành công",
      });
    }
  } catch (error) {
    return next(new ApiError(500, "Lỗi khi cập nhật"));
  }
};

exports.activeEmail = async (req, res, next) => {
  console.log(req.user.id);
  console.log(req.user.email);

}

exports.delete = async (req, res, next) => {
  const userID = req.params.userID;
  try {
    await userService.deleteUserAccount(userID);
    res.send({ message: "Đã xóa thành công!" });
  } catch (error) {
    return next(
      new ApiError(500, `Lỗi khi xóa tài khoản với ID = ${accountID}`)
    );
  }
};

exports.deleteALL = async (req, res) => {
  res.send({ message: "handle deleteALL" });
};
