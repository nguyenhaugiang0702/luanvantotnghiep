const User = require("../models/user.model");
const { ObjectId } = require("mongodb");
const moment = require("moment");

const createUser = async (userData) => {
  try {
    const user = new User(userData);
    return await user.save();
  } catch (error) {
    throw new Error("Lỗi khi tạo người dùng: " + error.message);
  }
};

const getUserById = async (userID) => {
  return await User.findById(userID);
};

const activeUserAccount = async (userData) => {
  const user = await User.findOne(userData);

  if (user && user.isActive <= 0) {
    user.isActive = 1;
    user.updatedAt = moment().format("HH:mm:ss DD/MM/YYYY");
    user.save();
  }
  return user;
};

const blockUserAccount = async (userId) => {
  const userID = {
    _id: ObjectId.isValid(userId) ? new ObjectId(userId) : null,
  };

  const user = await User.findByIdAndUpdate(
    userID,
    {
      isActive: 2,
      updatedAt: moment().format("HH:mm:ss DD/MM/YYYY"),
    },
    { new: true }
  );
  return user;
};

const unBlockUserAccount = async (userId) => {
  const userID = {
    _id: ObjectId.isValid(userId) ? new ObjectId(userId) : null,
  };

  const user = await User.findByIdAndUpdate(
    userID,
    {
      isActive: 1,
      updatedAt: moment().format("HH:mm:ss DD/MM/YYYY"),
    },
    { new: true }
  );
  return user;
};

const getAllUser = async () => {
  return await User.find();
};

const updateUser = async (userId, updateData) => {
  return await User.findByIdAndUpdate(userId, updateData, { new: true });
};

const deleteUserAccount = async (userId) => {
  const userID = {
    _id: ObjectId.isValid(userId) ? new ObjectId(userId) : null,
  };
  return await User.findByIdAndDelete(userID);
};

const checkEmailExist = async (emailUser) => {
  return await User.findOne({ email: emailUser });
};

const checkPhoneNumberExist = async (phoneNumber) => {
  return await User.findOne({ phoneNumber: phoneNumber });
};

const saveRefreshToken = async (userId, refreshToken) => {
  await User.findByIdAndUpdate(userId, { refreshToken });
};

module.exports = {
  createUser,
  getUserById,
  updateUser,
  getAllUser,
  activeUserAccount,
  blockUserAccount,
  unBlockUserAccount,
  deleteUserAccount,
  checkEmailExist,
  checkPhoneNumberExist,
  saveRefreshToken,
};
