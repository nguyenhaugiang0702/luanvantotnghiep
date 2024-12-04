const userService = require("../../services/user.service");
const adminService = require("../../services/admin.service");
const otpService = require("../../services/otp.service");
const moment = require("moment-timezone");
const ApiError = require("../../api-error");
const fs = require("fs").promises;

exports.findOne = async (req, res, next) => {
  try {
    const userID = req.user ? req.user.id : null;
    if (!userID) {
      return next(new ApiError(400, "Vui lòng đăng nhập"));
    }
    const user = await userService.getUserById(userID);
    return res.send(user);
  } catch (error) {
    return next(new ApiError(500, "Lỗi khi tìm thông tin của người dùng"));
  }
};

exports.update = async (req, res, next) => {
  const userID = req.user ? req.user.id : null;
  if (!userID) {
    return next(new ApiError(400, "Vui lòng đăng nhập"));
  }
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

      // Kiểm tra số điện thoại trùng lặp
      const existingPhoneInUser = await userService.checkPhoneNumberExist(
        newPhoneNumber
      );
      const existingPhoneInAdmin = await adminService.checkPhoneNumberExist(
        newPhoneNumber
      );

      if (existingPhoneInUser || existingPhoneInAdmin) {
        return next(new ApiError(400, "Số điện thoại đã được sử dụng"));
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

      // Kiểm tra email trùng lặp
      const existingEmailInUser = await userService.checkEmailExist(
        newPhoneNumber
      );
      const existingEmailInAdmin = await adminService.checkEmailExist(
        newPhoneNumber
      );

      if (existingEmailInUser || existingEmailInAdmin) {
        return next(new ApiError(400, "Email đã được sử dụng"));
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
  const userID = req.user ? req.user.id : null;
  if (!userID) {
    return next(new ApiError(400, "Vui lòng đăng nhập"));
  }
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
