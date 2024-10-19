const ApiError = require("../api-error");
const schema = require("../utils/schema.util");
const adminService = require("../services/admin.service");

exports.createAdminValidation = async (req, res, next) => {
  try {
    await schema.addAdminSchema.validate(req.body);
    if (req.body.method === "add") {
      await validateAddAdmin(req, next);
    } else {
      await validateEditAdmin(req, next);
    }
    next();
  } catch (err) {
    return next(new ApiError(400, err.message));
  }
};
// Hàm kiểm tra khi thêm mới nhân viên
const validateAddAdmin = async (req, next) => {
  
    // Kiểm tra trùng lặp email nhân viên
    const checkEmailAdmin = await adminService.checkEmailExist(
      req.body.email
    );
    if (checkEmailAdmin) {
      return next(new ApiError(400, "Đã tồn tại email nhân viên"));
    }
  
    // Kiểm tra trùng lặp số điện thoại nhân viên
    const checkPhoneNumberAdmin = await adminService.checkPhoneNumberExist(
      req.body.phoneNumber
    );
    if (checkPhoneNumberAdmin) {
      return next(new ApiError(400, "Đã tồn tại số điện thoại nhân viên"));
    }
  };
  
  // Hàm kiểm tra khi chỉnh sửa nhân viên
  const validateEditAdmin = async (req, next) => {
    const currentAdmin = await adminService.getAdminByID(
      req.params.adminID
    );
    if (!currentAdmin) {
      return next(new ApiError(404, "nhân viên không tồn tại"));
    }

    // Kiểm tra nếu email thay đổi thì kiểm tra trùng lặp email
    if (req.body.email && req.body.email !== currentAdmin.email) {
      const checkEmailAdmin = await adminService.checkEmailExist(
        req.body.email
      );
      if (checkEmailAdmin) {
        return next(new ApiError(400, "Đã tồn tại email nhân viên"));
      }
    }
  
    // Kiểm tra nếu số điện thoại thay đổi thì kiểm tra trùng lặp số điện thoại
    if (
      req.body.phoneNumber &&
      req.body.phoneNumber !== currentAdmin.phoneNumber
    ) {
      const checkPhoneNumberAdmin =
        await adminService.checkPhoneNumberExist(req.body.phoneNumber);
      if (checkPhoneNumberAdmin) {
        return next(new ApiError(400, "Đã tồn tại số điện thoại nhân viên"));
      }
    }
  };
  