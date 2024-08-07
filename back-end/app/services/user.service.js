const User = require('../models/user.model'); 

const createUser = async (userData) => {
  try {
    const user = new User(userData);
    return await user.save();
  } catch (error) {
    throw new Error('Error while creating user: ' + error.message);
  }
};

const getUserById = async (userId) => {
  try {
    return await User.findById(userId);
  } catch (error) {
    throw new Error('Error while fetching user: ' + error.message);
  }
};

const updateUser = async (userId, updateData) => {
  try {
    return await User.findByIdAndUpdate(userId, updateData, { new: true });
  } catch (error) {
    throw new Error('Error while updating user: ' + error.message);
  }
};

const deleteUser = async (userId) => {
  try {
    return await User.findByIdAndDelete(userId);
  } catch (error) {
    throw new Error('Error while deleting user: ' + error.message);
  }
};

module.exports = {
  createUser,
  getUserById,
  updateUser,
  deleteUser
};
