const User = require("../../models/user.model");

const getUserByPhoneNumber = async (phoneNumber) => {
  return await User.findOne({phoneNumber: phoneNumber});
};

const getUserByEmail = async (email) => {
  return await User.findOne({email: email});
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
  getUserByEmail
};
