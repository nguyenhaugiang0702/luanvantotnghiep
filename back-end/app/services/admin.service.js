const Admin = require("../models/admin.model");

const getAdminByID = async (adminID) => {
  return await Admin.findById(adminID);
};

const createAdmin = async (adminData) => {
  const newAdmin = new Admin(adminData);
  return await newAdmin.save();
};

const getAllAdmin = async (query) => {
  return await Admin.find(query);
};

const checkEmailExist = async (email) => {
  return await Admin.findOne({ email: email });
};

const checkPhoneNumberExist = async (phoneNumber) => {
  return await Admin.findOne({ phoneNumber: phoneNumber });
};

const updateAdmin = async (adminID, adminData) => {
  return await Admin.findByIdAndUpdate(adminID, adminData, { new: true });
};

module.exports = {
  checkEmailExist,
  checkPhoneNumberExist,
  getAdminByID,
  getAllAdmin,
  createAdmin,
  updateAdmin,
};
