const User = require("../models/user.model");
const { ObjectId } = require("mongodb");
const moment = require("moment");

const createUser = async (userData) => {
  try {
    const user = new User(userData);
    return await user.save();
  } catch (error) {
    throw new Error("Error while creating user: " + error.message);
  }
};

const getUserById = async (userId) => {
  try {
    return await User.findById(userId);
  } catch (error) {
    throw new Error("Error while fetching user: " + error.message);
  }
};

const activeUserAccount = async (userData) => {
  try {
    const user = await User.findOne(userData);

    if (user && user.isActive <= 0) {
      user.isActive = 1;
      user.updatedAt = moment().format("HH:mm:ss DD/MM/YYYY");
      user.save();
    }
    return user;
  } catch (error) {
    throw new Error("Error while activing account user: " + error.message);
  }
};

const blockUserAccount = async (id) => {
  try {
    const userID = {
      _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
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
  } catch (error) {
    throw new Error("Error while activing account user: " + error.message);
  }
};

const unBlockUserAccount = async (id) => {
  try {
    const userID = {
      _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
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
  } catch (error) {
    throw new Error("Error while activing account user: " + error.message);
  }
};

const getAllUser = async () => {
  try {
    return await User.find();
  } catch (error) {
    throw new Error("Error while deleting user: " + error.message);
  }
};

const updateUser = async (userId, updateData) => {
  try {
    return await User.findByIdAndUpdate(userId, updateData, { new: true });
  } catch (error) {
    throw new Error("Error while updating user: " + error.message);
  }
};

const deleteUserAccount = async (userId) => {
  try {
    const userID = {
      _id: ObjectId.isValid(userId) ? new ObjectId(userId) : null,
    };
    return await User.findByIdAndDelete(userID);
  } catch (error) {
    throw new Error("Error while deleting user: " + error.message);
  }
};

const checkEmailExist = async (emailUser) => {
  return await User.findOne({ email: emailUser });
};

const checkPhoneNumberExist = async (phoneNumber) => {
  return await User.findOne({ phoneNumber: phoneNumber });
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
};
