const Admin = require("../../models/admin.model");

const getAdminByEmail = async (email) => {
  return await Admin.findOne({email: email});
};

const checkEmailExist = async (email) => {
  return await Admin.findOne({ email: email });
};

const checkPhoneNumberExist = async (phoneNumber) => {
  return await Admin.findOne({ phoneNumber: phoneNumber });
};

module.exports = {
  checkEmailExist,
  checkPhoneNumberExist,
  getAdminByEmail,
};
