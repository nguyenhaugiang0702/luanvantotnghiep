const moment = require("moment-timezone");
const ApiError = require("../../api-error");
const voucherService = require("../../services/vouchers/voucher.service");
const voucherCategoryService = require("../../services/vouchers/voucherCategory.service");
const voucherUsedsService = require("../../services/vouchers/voucherUseds.service");
const { v4: uuidv4 } = require("uuid");

// Voucher Category
exports.createVoucherCategory = async (req, res, next) => {
  try {
    const { discountType, value, minValue, maxValue } = req.body;
    req.body.createdAt = moment.tz("Asia/Ho_Chi_Minh");
    req.body.updatedAt = moment.tz("Asia/Ho_Chi_Minh");
    if (discountType === "percent") {
      req.body.name = `Giảm ${value} %`;
    } else if (discountType === "amount") {
      req.body.name = `Giảm ${value} VND`;
    } else {
      return next(new ApiError(400, "Vui lòng chọn đúng loại giảm giá"));
    }
    const newVoucherCategory =
      await voucherCategoryService.createVoucherCategory(req.body);
    return res.send({
      message: "Thêm thể loại mã giảm giá thành công",
      newVoucherCategory,
    });
  } catch (error) {
    console.log(error);
    return next(new ApiError(500, "Lỗi khi thêm mới thể loại mã giảm giá"));
  }
};

exports.findAllVouchersCategory = async (req, res, next) => {
  try {
    const vouchersCategory =
      await voucherCategoryService.getAllVouchersCategory();
    return res.send(vouchersCategory);
  } catch (error) {
    console.log(error);
    return next(new ApiError(500, "Lỗi khi lấy tất cả thể loại mã giảm giá"));
  }
};

exports.updateVoucherCategory = async (req, res, next) => {
  const { voucherCategoryID } = req.params;
  const { discountType, value, minValue, maxValue } = req.body;
  try {
    if (discountType === "percent") {
      req.body.name = `Giảm ${value} %`;
    } else if (discountType === "amount") {
      req.body.name = `Giảm ${value} VND`;
    } else {
      return next(new ApiError(400, "Vui lòng chọn đúng loại giảm giá"));
    }
    const updateVouchersCategory =
      await voucherCategoryService.updateVouchersCategory(
        voucherCategoryID,
        req.body
      );
    return res.send({
      message: "Cập nhật thành công thể loại mã giảm giá",
      updateVouchersCategory,
    });
  } catch (error) {
    console.log(error);
    return next(new ApiError(500, "Lỗi khi cập nhật thể loại mã giảm giá"));
  }
};

exports.deleteVoucherCategory = async (req, res, next) => {
  const { voucherCategoryID } = req.params;
  try {
    const deleteVoucherCategory =
      await voucherCategoryService.deleteVoucherCategory(voucherCategoryID);
    if (!deleteVoucherCategory) {
      return next(new ApiError(500, "Lỗi khi xóa loại mã giảm giá"));
    }
    return res.send({
      message: "Xóa thành công loại mã giảm giá",
      deleteVoucherCategory,
    });
  } catch (error) {
    console.log(error);
    return next(new ApiError(500, "Lỗi khi xóa loại mã giảm giá"));
  }
};

// Voucher
exports.createVoucher = async (req, res, next) => {
  try {
    const { startDate, endDate, quantity, voucherCategoryID } = req.body;

    // Chuyển đổi startDate và endDate từ định dạng DD/MM/YYYY sang YYYY-MM-DD
    const parsedStartDate = moment(startDate, "DD/MM/YYYY")
      .tz("Asia/Ho_Chi_Minh")
      .toDate();
    const parsedEndDate = moment(endDate, "DD/MM/YYYY")
      .tz("Asia/Ho_Chi_Minh")
      .toDate();
    const voucherCode = `NHG-${uuidv4().slice(0, 8)}`;

    const voucherData = {
      createdAt: moment.tz("Asia/Ho_Chi_Minh"),
      updatedAt: moment.tz("Asia/Ho_Chi_Minh"),
      startDate: parsedStartDate,
      endDate: parsedEndDate,
      quantity: quantity,
      voucherCategoryID: voucherCategoryID,
      code: voucherCode,
    };
    const newVoucher = await voucherService.createVoucher(voucherData);
    return res.send({
      message: "Thêm thể loại mã giảm giá thành công",
      newVoucher,
    });
  } catch (error) {
    return next(new ApiError(500, "Lỗi khi thêm mới mã giảm giá"));
  }
};

exports.findAllVouchers = async (req, res, next) => {
  try {
    let vouchers = await voucherService.getAllVouchers({});
    return res.send(vouchers);
  } catch (error) {
    console.log(error);
    return next(new ApiError(500, "Lỗi khi lấy tất cả thể loại mã giảm giá"));
  }
};

exports.updateVoucher = async (req, res, next) => {
  const { voucherID } = req.params;
  const { startDate, endDate, quantity, voucherCategoryID } = req.body;
  try {
    const parsedStartDate = moment(startDate, "DD/MM/YYYY")
      .tz("Asia/Ho_Chi_Minh")
      .toDate();
    const parsedEndDate = moment(endDate, "DD/MM/YYYY")
      .tz("Asia/Ho_Chi_Minh")
      .toDate();
    const voucherUpdateData = {
      startDate: parsedStartDate,
      endDate: parsedEndDate,
      updatedAt: moment.tz("Asia/Ho_Chi_Minh"),
      quantity: quantity,
      voucherCategoryID: voucherCategoryID,
    };
    const updateVoucher = await voucherService.updateVoucher(
      voucherID,
      voucherUpdateData
    );
    return res.send({
      message: "Cập nhật thành công mã giảm giá",
      updateVoucher,
    });
  } catch (error) {
    console.log(error);
    return next(new ApiError(500, "Lỗi khi cập nhật mã giảm giá"));
  }
};
