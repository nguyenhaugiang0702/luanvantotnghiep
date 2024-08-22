const ApiError = require("../api-error");
const supplierService = require("../services/supplier.service");
const schema = require("../utils/schema.util");

exports.createSupplierValidation = async (req, res, next) => {
  try {
    await schema.supplierSchema.validate(req.body);
    const checkNameSupplier = await supplierService.checkNameExist(
      req.body.name
    );
    if (checkNameSupplier) {
      return next(new ApiError(400, "Đã tồn tại tên nhà cung cấp"));
    }

    const checkEmailSupplier = await supplierService.checkEmailExist(
      req.body.email
    );
    if (checkEmailSupplier) {
      return next(new ApiError(400, "Đã tồn tại email nhà cung cấp"));
    }

    const checkPhoneNumberSupplier =
      await supplierService.checkPhoneNumberExist(req.body.phoneNumber);
    if (checkPhoneNumberSupplier) {
      return next(new ApiError(400, "Đã tồn tại số điện thoại nhà cung cấp"));
    }
    next();
  } catch (err) {
    return next(new ApiError(400, err.message));
  }
};
