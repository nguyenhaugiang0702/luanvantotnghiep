const adminService = require("../../services/admin.service");
const otpService = require("../../services/otp.service");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const config = require("../../config/index");
const sendEmail = require("../../utils/email.util");
const moment = require("moment-timezone");
const ApiError = require("../../api-error");

exports.findALL = async (req, res) => {
  let admins = [];
  try {
    admins = await adminService.getAllAdmin({});
    return res.send(admins);
  } catch (error) {
    return next(new ApiError(500, "Lỗi khi lấy tất nhân viên"));
  }
};

exports.findAdminInfo = async (req, res) => {
  try {
    const adminID = req.admin.id;
    const admin = await adminService.getAdminByID(adminID);
    return res.send(admin);
  } catch (error) {
    return next(new ApiError(500, "Lỗi khi lấy thông tin nhân viên"));
  }
};

exports.create = async (req, res) => {
  try {
    const { firstName, lastName, phoneNumber, email, password, role } =
      req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    req.body.password = hashedPassword;
    req.body.createdAt = moment.tz("Asia/Ho_Chi_Minh");
    req.body.updatedAt = moment.tz("Asia/Ho_Chi_Minh");
    const newAdmin = await adminService.createAdmin(req.body);

    return res.send({
      message: "Thêm thành công nhân viên",
      newAdmin,
    });
  } catch (error) {
    return next(new ApiError(500, "Lỗi khi thêm nhân viên"));
  }
};

exports.update = async (req, res) => {
  try {
    const { firstName, lastName, phoneNumber, email, password, role } =
      req.body;
    const { adminID } = req.params;
    req.body.updatedAt = moment.tz("Asia/Ho_Chi_Minh");
    const updateAdmin = await adminService.updateAdmin(adminID, req.body);
    return res.send({
      message: "Cập nhật thành công nhân viên",
      updateAdmin,
    });
  } catch (error) {
    return next(new ApiError(500, "Lỗi khi lấy tất nhân viên"));
  }
};
