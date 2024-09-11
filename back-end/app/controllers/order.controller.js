const orderService = require("../services/order.service");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const config = require("../config/index");
const moment = require("moment-timezone");
const ApiError = require("../api-error");

exports.create = async (req, res, next) => {
  try {
    const userID = req.user.id;
    console.log(`handle create user order ${userID}`);
  } catch (error) {
    console.log(error);
    return next(new ApiError(500, "Lỗi khi thêm mua hang mới!"));
  }
};
