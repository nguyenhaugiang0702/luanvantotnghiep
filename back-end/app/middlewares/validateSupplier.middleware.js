const ApiError = require("../api-error");
const supplierService = require("../services/supplier.service");
const schema = require("../utils/schema.util");

exports.createSupplierValidation = async (req, res, next) => {
  try {
    await schema.supplierSchema.validate(req.body);

    if (req.body.method === "add") {
      await validateAddSupplier(req, next);
    } else {
      await validateEditSupplier(req, next);
    }

    next();
  } catch (err) {
    return next(new ApiError(400, err.message));
  }
};

// Hàm kiểm tra khi thêm mới nhà cung cấp
const validateAddSupplier = async (req, next) => {
  // Kiểm tra trùng lặp tên nhà cung cấp
  const checkNameSupplier = await supplierService.checkNameExist(req.body.name);
  if (checkNameSupplier) {
    return next(new ApiError(400, "Đã tồn tại tên nhà cung cấp"));
  }

  // Kiểm tra trùng lặp email nhà cung cấp
  const checkEmailSupplier = await supplierService.checkEmailExist(
    req.body.email
  );
  if (checkEmailSupplier) {
    return next(new ApiError(400, "Đã tồn tại email nhà cung cấp"));
  }

  // Kiểm tra trùng lặp số điện thoại nhà cung cấp
  const checkPhoneNumberSupplier = await supplierService.checkPhoneNumberExist(
    req.body.phoneNumber
  );
  if (checkPhoneNumberSupplier) {
    return next(new ApiError(400, "Đã tồn tại số điện thoại nhà cung cấp"));
  }
};

// Hàm kiểm tra khi chỉnh sửa nhà cung cấp
const validateEditSupplier = async (req, next) => {
  const currentSupplier = await supplierService.getSupplierById(
    req.params.supplierID
  );
  if (!currentSupplier) {
    return next(new ApiError(404, "Nhà cung cấp không tồn tại"));
  }

  // Kiểm tra nếu tên thay đổi thì kiểm tra trùng lặp tên
  if (req.body.name && req.body.name !== currentSupplier.name) {
    const checkNameSupplier = await supplierService.checkNameExist(
      req.body.name
    );
    if (checkNameSupplier) {
      return next(new ApiError(400, "Đã tồn tại tên nhà cung cấp"));
    }
  }

  // Kiểm tra nếu email thay đổi thì kiểm tra trùng lặp email
  if (req.body.email && req.body.email !== currentSupplier.email) {
    const checkEmailSupplier = await supplierService.checkEmailExist(
      req.body.email
    );
    if (checkEmailSupplier) {
      return next(new ApiError(400, "Đã tồn tại email nhà cung cấp"));
    }
  }

  // Kiểm tra nếu số điện thoại thay đổi thì kiểm tra trùng lặp số điện thoại
  if (
    req.body.phoneNumber &&
    req.body.phoneNumber !== currentSupplier.phoneNumber
  ) {
    const checkPhoneNumberSupplier =
      await supplierService.checkPhoneNumberExist(req.body.phoneNumber);
    if (checkPhoneNumberSupplier) {
      return next(new ApiError(400, "Đã tồn tại số điện thoại nhà cung cấp"));
    }
  }
};
