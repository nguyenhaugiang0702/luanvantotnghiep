const userService = require("../services/user.service");
const Account = require("../models/account.model");
const bcrypt = require("bcrypt");
const ApiError = require("../api-error");

exports.create = async (req, res) => {
  try {
    const newUser = await userService.createUser(req.body);
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const newAccount = new Account({
      userID: newUser._id,
      email: req.body.email,
      password: hashedPassword,
      isActive: false,
    });
    await newAccount.save();
    res.status(201).json({
      user: newUser,
      account: newAccount,
    });
  } catch (error) {
    return next(new ApiError(500, "Lỗi khi đăng ký tài khoản"));
  }
};

exports.findALL = async (req, res) => {
  res.send({ message: "handle findALL" });
};

exports.findOne = async (req, res) => {
  res.send({ message: "handle findOne" });
};

exports.update = async (req, res) => {
  res.send({ message: "handle update" });
};

exports.delete = async (req, res) => {
  res.send({ message: "handle delete" });
};

exports.deleteALL = async (req, res) => {
  res.send({ message: "handle deleteALL" });
};
