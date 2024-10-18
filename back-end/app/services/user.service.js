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

const blockUserAccount = async (userID) => {
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

const countUsers = async () => {
  return await User.countDocuments();
}

const countUsersByMonth = async (year) => {
  const monthlyUsers = [];

  // Lặp qua từng tháng (1 đến 12)
  for (let month = 0; month < 12; month++) {
    // Tính ngày bắt đầu và ngày kết thúc của tháng
    const startOfMonth = new Date(year, month, 1); // Ngày 1 của tháng
    const endOfMonth = new Date(year, month + 1, 0, 23, 59, 59); // Ngày cuối cùng của tháng

    // Đếm số lượng người dùng trong tháng
    const totalUsers = await User.countDocuments({
      createdAt: {
        $gte: startOfMonth,
        $lte: endOfMonth,
      },
    });

    // Thêm kết quả vào mảng monthlyUsers
    monthlyUsers.push(totalUsers);
  }

  return monthlyUsers; // Trả về mảng chứa số lượng user của từng tháng
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
  countUsers,
  countUsersByMonth
};
