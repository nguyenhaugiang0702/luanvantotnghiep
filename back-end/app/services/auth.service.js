const User = require("../models/user.model");
const { ObjectId } = require("mongodb");
const moment = require("moment");

const getUserByPhoneNumber = async (phoneNumber) => {
  return await User.findOne({phoneNumber: phoneNumber});
};

const checkEmailExist = async (email) => {
  return await User.findOne({ email: email });
};

const checkPhoneNumberExist = async (phoneNumber) => {
  return await User.findOne({ phoneNumber: phoneNumber });
};

module.exports = {
  checkEmailExist,
  checkPhoneNumberExist,
  getUserByPhoneNumber,
};
