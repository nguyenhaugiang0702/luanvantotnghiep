const config = require("../config/index");
const moment = require("moment-timezone");
const ApiError = require("../api-error");
const receiptService = require("../services/receipt.service");

exports.create = async (req, res, next) => {
  try {
    req.body.createdAt = moment.tz("Asia/Ho_Chi_Minh").toDate();
    req.body.updatedAt = moment.tz("Asia/Ho_Chi_Minh").toDate();
    const newReceipt = await receiptService.createReceipt(req.body);
    return res.send({
      message: "Thêm nhập hàng thành công",
      newReceipt,
    });
  } catch (error) {
    console.log(error);
    return next(new ApiError(500, "Lỗi khi thêm nhập hàng mới!"));
  }
};

exports.findAll = async (req, res, next) => {
  let receipts = [];
  try {
    receipts = await receiptService.getAllReceipts();
  } catch (error) {
    console.log(error);
    return next(new ApiError(500, "Lỗi khi lấy nhập!"));
  }
  return res.send(receipts);
};
