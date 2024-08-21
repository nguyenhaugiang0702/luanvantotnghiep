const yup = require("yup");
const ApiError = require("../api-error");
const supplierService = require("../services/supplier.service");
// Định nghĩa schema
const supplierSchema = yup.object({
  name: yup.string().required("Tên nhà cung cấp là bắt buộc"),
  email: yup.string().email("Email không hợp lệ").required("Email là bắt buộc"),
  address: yup.string().required("Địa chỉ nhà cung cấp là bắt buộc"),
  phoneNumber: yup
    .string()
    .required("Số điện thoại là bắt buộc")
    .matches(/^0\d{9}$/, "Số điện thoại không hợp lệ"),
});

exports.createSupplierValidation = async (req, res, next) => {
  try {
    await supplierSchema.validate(req.body);
    const checkNameSupplier = await supplierService.checkNameExist(req.body.name);
    if(checkNameSupplier){
        return next(new ApiError(400, "Đã tồn tại tên nhà cung cấp"));
    }

    const checkEmailSupplier = await supplierService.checkEmailExist(req.body.email);
    if(checkEmailSupplier){
        return next(new ApiError(400, "Đã tồn tại email nhà cung cấp"));
    }

    const checkPhoneNumberSupplier = await supplierService.checkPhoneNumberExist(req.body.phoneNumber);
    if(checkPhoneNumberSupplier){
        return next(new ApiError(400, "Đã tồn tại số điện thoại nhà cung cấp"));
    }
    next();
  } catch (err) {
    return next(new ApiError(400, err.message));
  }
};
