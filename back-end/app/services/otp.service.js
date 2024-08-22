const OTP = require("../models/otp.model");
const { ObjectId } = require("mongodb");

const createOTP = async (userData) => {
  const otp = new OTP(userData);
  return await otp.save();
};

const updateOTPByPhoneNumber = async (phoneNumber, data) => {
  return await OTP.findOneAndUpdate({ phoneNumber: phoneNumber }, data, {
    new: true,
  });
};

const findRecordByPhoneNumber = async (phoneNumber) => {
  return await OTP.findOne({ phoneNumber: phoneNumber });
};

const findRecordByOTPAndPhoneNumber = async (phoneNumber, otpSMS) => {
  return await OTP.findOne({ phoneNumber: phoneNumber, otpSMS: otpSMS });
};

const findRecordByEmail = async (email) => {
  return await OTP.findOne({ email: email });
};

const findRecordByOTPAndEmail = async (email, otpEmail) => {
  return await OTP.findOne({ email: email, otpEmail: otpEmail });
};

const updateOTPByEmail = async (email, data) => {
  return await OTP.findOneAndUpdate({ email: email }, data, {
    new: true,
  });
};

module.exports = {
  createOTP,
  updateOTPByPhoneNumber,
  findRecordByPhoneNumber,
  findRecordByOTPAndPhoneNumber,
  findRecordByEmail,
  findRecordByOTPAndEmail,
  updateOTPByEmail,
};
