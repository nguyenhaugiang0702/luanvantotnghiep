const Role = require("../models/role.model");

const createRole = async (roleData) => {
  const newRole = new Role(roleData);
  return await newRole.save();
};

const getRoleByID = async (roleID) => {
  return await Role.findById(roleID);
};

const getAllRoles = async (query) => {
  return await Role.find(query);
};

const updateRole = async (roleID, roleData) => {
  return await Role.findByIdAndUpdate(roleID, roleData, { new: true });
};

const deleteRole = async (roleID) => {
  return await Role.findByIdAndDelete(roleID);
};

const checkRoleExist = async (query) => {
  return await Role.findOne(query);
};

module.exports = {
  createRole,
  getRoleByID,
  getAllRoles,
  updateRole,
  deleteRole,
  checkRoleExist,
};
