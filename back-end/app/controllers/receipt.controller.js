const config = require("../config/index");
const moment = require("moment-timezone");
const ApiError = require("../api-error");
const receiptService = require("../services/receipt.service");

exports.create = async (req, res, next) => {
  try {
    const newSupplier = await receiptService.createReceipt(req.body);
    req.body.createAt = moment.tz("Asia/Ho_Chi_Minh").toDate();
    req.body.updatedAt = moment.tz("Asia/Ho_Chi_Minh").toDate();
    return res.send({
      message: "Thêm nhập hàng thành công",
      newSupplier,
    });
  } catch (error) {
    console.log(error);
    return next(new ApiError(500, "Lỗi khi thêm nhà cung cấp mới!"));
  }
};

exports.findAll = async (req, res, next) => {
  try {
    console.log("find All");
  } catch (error) {
    console.log(error);
    return next(new ApiError(500, "Lỗi khi thêm nhà cung cấp mới!"));
  }
};
