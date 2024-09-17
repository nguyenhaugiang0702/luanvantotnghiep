const Admin = require("../models/admin.model");

const getAdminByID = async (adminID) => {
  return await Admin.findById(adminID).exec();
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
  getAdminByID,
};
