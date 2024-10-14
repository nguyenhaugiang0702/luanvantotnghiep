const supplierService = require("../../services/supplier.service");
const config = require("../../config/index");
const moment = require("moment-timezone");
const ApiError = require("../../api-error");

exports.create = async (req, res, next) => {
  const { name, email, phoneNumber, address } = req.body;
  // Kiểm tra các trường bắt buộc
  if (!name || !email || !phoneNumber || !address) {
    return next(new ApiError(404, "Vui lòng kiểm tra lại các trường"));
  }

  // Validate email bằng regex
  const emailRegex = /\S+@\S+\.\S+/;
  if (!emailRegex.test(email)) {
    return next(new ApiError(400, "Email không hợp lệ"));
  }

  // Validate số điện thoại bằng regex
  const phoneRegex = /^0\d{9}$/; // Số điện thoại Việt Nam với 10 chữ số và bắt đầu bằng số 0
  if (!phoneRegex.test(phoneNumber)) {
    return next(new ApiError(400, "Số điện thoại không hợp lệ"));
  }
  try {
    req.body.createdAt = moment.tz("Asia/Ho_Chi_Minh");
    req.body.updatedAt = moment.tz("Asia/Ho_Chi_Minh");
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
    const { name } = req.query;
    if (name) {
      suppliers = await supplierService.getAllSuppliersByName(name);
    } else {
      suppliers = await supplierService.getAllSuppliers();
    }
  } catch (error) {
    console.log(error);
    return next(new ApiError(500, "Lỗi khi thêm nhà cung cấp mới!"));
  }
  return res.send(suppliers);
};

exports.findOne = async (req, res, next) => {
  try {
    const supplierID = req.params.supplierID;
    const supplier = await supplierService.getSupplierById(supplierID);
    return res.send(supplier);
  } catch (error) {
    console.log(error);
    return next(new ApiError(500, "Lỗi khi thêm nhà cung cấp mới!"));
  }
};

exports.update = async (req, res, next) => {
  try {
    const supplierID = req.params.supplierID;
    const supplier = await supplierService.updateSupplier(supplierID, req.body);
    return res.send({
      message: "Cập nhât thành công",
      supplier,
    });
  } catch (error) {
    console.log(error);
    return next(new ApiError(500, "Lỗi khi thêm nhà cung cấp mới!"));
  }
};

exports.delete = async (req, res, next) => {
  try {
    const supplierID = req.params.supplierID;
    const supplier = await supplierService.deleteSupplier(supplierID);
    return res.send({
      message: "Xóa thành công",
      supplier,
    });
  } catch (error) {
    console.log(error);
    return next(new ApiError(500, "Lỗi khi thêm nhà cung cấp mới!"));
  }
};
