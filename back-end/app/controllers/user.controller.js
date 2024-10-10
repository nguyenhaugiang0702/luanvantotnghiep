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
const fs = require("fs").promises;

exports.blockAccount = async (req, res, next) => {
  try {
    const { userID } = req.params;
    await userService.updateUser(userID, {
      isActive: 2,
      updatedAt: moment.tz("Asia/Ho_Chi_Minh").toDate(),
    });
    return res.send({
      message: "Tài khoản đã bị khóa!",
    });
  } catch (error) {
    return next(new ApiError(500, "Lỗi khi khóa tài khoản"));
  }
};

exports.unBlockAccount = async (req, res, next) => {
  try {
    const { userID } = req.params;

    await userService.updateUser(userID, {
      isActive: 1,
      updatedAt: moment.tz("Asia/Ho_Chi_Minh").toDate(),
    });
    return res.send({
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
    const userID = req.user.id;
    const user = await userService.getUserById(userID);
    return res.send(user);
  } catch (error) {
    return next(new ApiError(500, "Lỗi khi tìm thông tin của người dùng"));
  }
};

exports.update = async (req, res, next) => {
  const userID = req.user.id;
  const { newPhoneNumber, otpSMS, otpEmail, email } = req.body;
  const phoneRegex = /^0\d{9}$/;
  const otpRegex = /^\d{6}$/;

  if (newPhoneNumber && !phoneRegex.test(newPhoneNumber)) {
    return next(new ApiError(400, "Số điện thoại không hợp lệ"));
  }
  if (
    (otpSMS && !otpRegex.test(otpSMS)) ||
    (otpEmail && !otpRegex.test(otpEmail))
  ) {
    return next(new ApiError(400, "Mã OTP không hợp lệ"));
  }
  try {
    if (newPhoneNumber && otpSMS) {
      // Update Phone Number
      const otpRecord = await otpService.findRecordByOTPAndPhoneNumber(
        newPhoneNumber,
        otpSMS
      );

      if (!otpRecord) {
        return next(new ApiError(400, "OTP không hợp lệ hoặc đã hết hạn."));
      }
      const currentTime = moment().tz("Asia/Ho_Chi_Minh");

      if (currentTime.isAfter(moment(otpRecord.expiresAt))) {
        return next(new ApiError(400, "Mã OTP đã hết hạn."));
      }
      req.body.phoneNumber = newPhoneNumber;
      const userUpdate = await userService.updateUser(userID, req.body);
      return res.send({
        message: "Cập nhật thành công",
        userUpdate,
      });
    } else if (email && otpEmail) {
      // Update email
      const otpRecord = await otpService.findRecordByOTPAndEmail(
        email,
        otpEmail
      );

      if (!otpRecord) {
        return next(new ApiError(400, "OTP không hợp lệ hoặc đã hết hạn."));
      }
      const currentTime = moment().tz("Asia/Ho_Chi_Minh");

      if (currentTime.isAfter(moment(otpRecord.expiresAt))) {
        return next(new ApiError(400, "Mã OTP đã hết hạn."));
      }
      const userUpdate = await userService.updateUser(userID, { email: email });
      return res.send({
        message: "Cập nhât thành công",
        userUpdate,
      });
    }
  } catch (error) {
    return next(new ApiError(500, "Lỗi khi cập nhật"));
  }
};

exports.updateProfile = async (req, res, next) => {
  const userID = req.user.id;
  let updatedUser;
  try {
    const { firstName, lastName, gender, dob, fileType } = req.body;
    if (!req.file) {
      updatedUser = await userService.updateUser(userID, {
        firstName: firstName,
        lastName: lastName,
        gender: gender,
        dob: dob,
      });
    } else {
      const user = await userService.getUserById(userID);
      if (user.avatar) {
        await fs.unlink(user.avatar);
      }

      const pathAvatar = req.file.path;

      updatedUser = await userService.updateUser(userID, {
        firstName: firstName,
        lastName: lastName,
        gender: gender,
        dob: dob,
        avatar: pathAvatar,
      });
    }
    if (!updatedUser) {
      return next(new ApiError(400, "Lỗi khi cập nhật profile"));
    }
    return res.send({
      message: "Cập nhật thành công",
    });
  } catch (error) {
    console.log(error);
    return next(new ApiError(500, "Lỗi khi cập nhật profile"));
  }
};

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
