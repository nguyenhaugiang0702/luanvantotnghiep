const ApiError = require("../api-error");
const schema = require("../utils/schema.util");
const adminService = require("../services/admin.service");
const userService = require("../services/user.service");

exports.createAdminValidation = async (req, res, next) => {
  try {
    const { method, role, side } = req.body;
    if (method === "add") {
      // admin them nhân viên
      await schema.addAdminSchema.validate(req.body);
      await validateAddAdmin(req, next);
    } else {
      // cập nhật nhân viên
      if (side === "employee") {
        // nhân viên tự cập nhật (không cập nhật role)
        await schema.updateEmployeeSchema.validate(req.body);
        await validateEditAdmin(req, next);
      } else {
        // admin câp nhật - cập nhật all
        await schema.updateAdminSchema.validate(req.body);
        await validateEditAdmin(req, next);
      }
    }
    next();
  } catch (err) {
    console.log(err);
    return next(new ApiError(400, err.message));
  }
};
// Hàm kiểm tra khi thêm mới nhân viên
const validateAddAdmin = async (req, next) => {
  // Kiểm tra trùng lặp email nhân viên trong Admin
  const checkEmailAdmin = await adminService.checkEmailExist(req.body.email);
  if (checkEmailAdmin) {
    return next(new ApiError(400, "Đã tồn tại email nhân viên"));
  }

  // Kiểm tra trùng lặp email nhân viên trong User
  const checkEmailUser = await userService.checkEmailExist(req.body.email);
  if (checkEmailUser) {
    return next(new ApiError(400, "Email này đã được sử dụng bởi người dùng"));
  }

  // Kiểm tra trùng lặp số điện thoại nhân viên trong Admin
  const checkPhoneNumberAdmin = await adminService.checkPhoneNumberExist(
    req.body.phoneNumber
  );
  if (checkPhoneNumberAdmin) {
    return next(new ApiError(400, "Đã tồn tại số điện thoại nhân viên"));
  }
  
  // Kiểm tra trùng lặp số điện thoại nhân viên trong User
  const checkPhoneNumberUser = await userService.checkPhoneNumberExist(
    req.body.phoneNumber
  );
  if (checkPhoneNumberUser) {
    return next(
      new ApiError(400, "Số điện thoại này đã được sử dụng bởi người dùng")
    );
  }
};

// Hàm kiểm tra khi chỉnh sửa nhân viên
const validateEditAdmin = async (req, next) => {
  const currentAdmin = await adminService.getAdminByID(req.params.adminID);
  if (!currentAdmin) {
    return next(new ApiError(404, "nhân viên không tồn tại"));
  }

  // Kiểm tra nếu email thay đổi thì kiểm tra trùng lặp email
  if (req.body.email && req.body.email !== currentAdmin.email) {
     // Kiểm tra trong Admin
    const checkEmailAdmin = await adminService.checkEmailExist(req.body.email);
    if (checkEmailAdmin) {
      return next(new ApiError(400, "Đã tồn tại email nhân viên"));
    }

    // Kiểm tra trong User
    const checkEmailUser = await userService.checkEmailExist(req.body.email);
    if (checkEmailUser) {
      return next(
        new ApiError(400, "Email này đã được sử dụng bởi người dùng")
      );
    }
  }

  // Kiểm tra nếu số điện thoại thay đổi thì kiểm tra trùng lặp số điện thoại
  if (
    req.body.phoneNumber &&
    req.body.phoneNumber !== currentAdmin.phoneNumber
  ) {
    // Kiểm tra trong Admin
    const checkPhoneNumberAdmin = await adminService.checkPhoneNumberExist(
      req.body.phoneNumber
    );
    if (checkPhoneNumberAdmin) {
      return next(new ApiError(400, "Đã tồn tại số điện thoại nhân viên"));
    }

    // Kiểm tra trong User
    const checkPhoneNumberUser = await userService.checkPhoneNumberExist(
      req.body.phoneNumber
    );
    if (checkPhoneNumberUser) {
      return next(
        new ApiError(400, "Số điện thoại này đã được sử dụng bởi người dùng")
      );
    }
  }
};


exports.loginAdminValidation = async (req, res, next) => {
  try {
    await schema.emailLoginUserSchema.validate(req.body);
    next();
  } catch (err) {
    console.log(err);
    return next(new ApiError(400, err.message));
  }
};