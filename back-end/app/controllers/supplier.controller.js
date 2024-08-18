const supplierService = require("../services/supplier.service");
const otpService = require("../services/otp.service");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const config = require("../config/index");
const sendEmail = require("../utils/email.util");
const moment = require("moment-timezone");
const ApiError = require("../api-error");
const User = require("../models/user.model");
const ValidateService = require("../utils/validate.util");

exports.create = async (req, res, next) => {
  try {
    const newSupplier = await supplierService.createSupplier(req.body);
    return res.send({
      message: "Thêm thành công nhà cung cấp",
      newSupplier,
    });
  } catch (error) {
    console.log(error);
    return next(new ApiError(500, "Lỗi khi thêm nhà cung cấp mới!"));
  }
};

exports.findAll = async (req, res, next) => {
  let suppliers = [];
  try {
    suppliers = await supplierService.getAllSuplliers();
    return res.send({
      suppliers,
    });
  } catch (error) {
    console.log(error);
    return next(new ApiError(500, "Lỗi khi thêm nhà cung cấp mới!"));
  }
};
