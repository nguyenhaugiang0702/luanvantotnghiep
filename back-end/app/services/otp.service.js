const OTP = require("../models/otp.model");
const { ObjectId } = require("mongodb");
const moment = require("moment");

const createOTP = async (userData) => {
  try {
    const otp = new OTP(userData);
    return await otp.save();
  } catch (error) {
    throw new Error("Lỗi khi tạo người dùng: " + error.message);
  }
};

const updateOTPByPhoneNumber = async (phoneNumber, data) => {
  return await OTP.findOneAndUpdate({ phoneNumber: phoneNumber }, data, {
    new: true,
  });
};

const findRecordByPhoneNumber = async (phoneNumber) => {
  return await OTP.findOne({ phoneNumber: phoneNumber });
};

const findRecordByOTPAndPhoneNumber = async (phoneNumber, otp) => {
  return await OTP.findOne({ phoneNumber: phoneNumber, otp: otp });
};

module.exports = {
  createOTP,
  updateOTPByPhoneNumber,
  findRecordByPhoneNumber,
  findRecordByOTPAndPhoneNumber
};
