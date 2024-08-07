const ApiError = require("../api-error");
const accountService = require("../services/account.service");
const Account = require("../models/account.model");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


exports.create = async (req, res, next) => {
  res.send({ message: "handle create" });
};

exports.login = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const account = await Account.findOne({ email });

    if (!account) {
      return next(new ApiError(404, "Tài khoản không tồn tại."));
    }

    if (!account.isActive) {
      return next(new ApiError(404, "Tài khoản chưa được kích hoạt."));
    }

    const isMatch = await bcrypt.compare(password, account.password);

    if (!isMatch) {
      return next(new ApiError(400, "Mật khẩu không chính xác."));
    }

    const accessToken = jwt.sign({ id: account._id }, "your_jwt_secret_key", {
      expiresIn: "1h",
    });

    res.send({
      message: "Đăng nhập thành công",
      accessToken,
    });
  } catch (error) {
    return next(new ApiError(500, "Lỗi khi đăng nhập!"));
  }
};

exports.findALL = async (req, res, next) => {
  res.send({ message: "handle findALL" });
};

exports.findOne = async (req, res, next) => {
  res.send({ message: "handle findOne" });
};

exports.update = async (req, res, next) => {
  res.send({ message: "handle update" });
};

exports.delete = async (req, res, next) => {
  res.send({ message: "handle delete" });
};

exports.deleteALL = async (req, res, next) => {
  res.send({ message: "handle deleteALL" });
};
