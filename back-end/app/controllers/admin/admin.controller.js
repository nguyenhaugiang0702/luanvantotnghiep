const adminService = require("../../services/admin.service");
const otpService = require("../../services/otp.service");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const config = require("../../config/index");
const sendEmail = require("../../utils/email.util");
const moment = require("moment-timezone");
const ApiError = require("../../api-error");

exports.findALL = async (req, res, next) => {
  let admins = [];
  try {
    admins = await adminService.getAllAdmin({});
    return res.send(admins);
  } catch (error) {
    return next(new ApiError(500, "Lỗi khi lấy tất nhân viên"));
  }
};

exports.findAdminInfo = async (req, res, next) => {
  try {
    const adminID = req.admin.id;
    const admin = await adminService.getAdminByID(adminID);
    return res.send(admin);
  } catch (error) {
    return next(new ApiError(500, "Lỗi khi lấy thông tin nhân viên"));
  }
};

exports.create = async (req, res, next) => {
  try {
    const { firstName, lastName, phoneNumber, email, role } = req.body;
    const randomPassword = Math.floor(10000000 + Math.random() * 90000000).toString();
    const hashedPassword = await bcrypt.hash(randomPassword, 10);
    req.body.password = hashedPassword;
    req.body.createdAt = moment.tz("Asia/Ho_Chi_Minh");
    req.body.updatedAt = moment.tz("Asia/Ho_Chi_Minh");
    const emailExist = await adminService.checkEmailExist(email);
    if (emailExist) {
      return next(new ApiError(400, "Email trên đã được sử dụng"));
    }
    const newAdmin = await adminService.createAdmin(req.body);
    try {
      await sendEmail({
        email: email,
        subject: "Thông tin tài khoản mới của bạn",
        text: `Xin chào ${firstName} ${lastName},
        
        Tài khoản của bạn đã được tạo thành công. Vui lòng không chia sẻ thông tin này với bất kỳ ai.

    - Họ tên: ${firstName} ${lastName}
    - Số điện thoại: ${phoneNumber}
    - Email: ${email}
    - Mật khẩu: ${randomPassword}
    - Vai trò: ${role}
        `,
      });
    } catch (error) {
      return next(new ApiError(500, "Lỗi khi gửi mail, vui lòng thử lại sau"));
    }
    return res.send({
      message: "Thêm thành công nhân viên",
      newAdmin,
    });
  } catch (error) {
    console.log(error);
    return next(new ApiError(500, "Lỗi khi thêm nhân viên"));
  }
};

exports.update = async (req, res, next) => {
  try {
    const { role, side } = req.body;
    const { adminID } = req.params;
    req.body.updatedAt = moment.tz("Asia/Ho_Chi_Minh");
    const updateAdmin = await adminService.updateAdmin(adminID, req.body);
    if (side !== "employee") {
      // admin cập nhât role thì gửi mail về cho nhân viên
      try {
        await sendEmail({
          email: updateAdmin.email,
          subject: "Thông tin tài khoản của bạn đã được cập nhật",
          text: `Xin chào ${updateAdmin.firstName} ${updateAdmin.lastName},
          
          Tài khoản của bạn đã được cập nhật. Vui lòng không chia sẻ thông tin này với bất kỳ ai.
  
      - Vai trò: ${updateAdmin.role}
          `,
        });
      } catch (error) {
        console.log(error);
        return next(
          new ApiError(500, "Lỗi khi gửi mail, vui lòng thử lại sau")
        );
      }
    }

    return res.send({
      message: "Cập nhật thành công nhân viên",
      updateAdmin,
    });
  } catch (error) {
    return next(new ApiError(500, "Lỗi khi lấy tất nhân viên"));
  }
};

exports.delete = async (req, res, next) => {
  try {
    const { adminID } = req.params;
    const deleteAdmin = await adminService.deleteAdmin(adminID);
    return res.send({
      message: "Xóa thành công nhân viên",
      deleteAdmin,
    });
  } catch (error) {
    return next(new ApiError(500, "Lỗi khi xóa nhân viên"));
  }
};
