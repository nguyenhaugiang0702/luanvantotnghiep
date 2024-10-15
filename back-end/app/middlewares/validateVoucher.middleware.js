const ApiError = require("../api-error");
const schema = require("../utils/schema.util");
const voucherService = require("../services/vouchers/voucher.service");
const voucherUsedService = require("../services/vouchers/voucherUseds.service");

// admin create VoucherCategory
exports.createVoucherCategoryValidation = async (req, res, next) => {
  try {
    await schema.voucherCategorySchema.validate(req.body);
    next();
  } catch (err) {
    return next(new ApiError(400, err.message));
  }
};

// admin create Voucher
exports.createVoucherValidation = async (req, res, next) => {
  try {
    await schema.voucherSchema.validate(req.body);
    next();
  } catch (err) {
    return next(new ApiError(400, err.message));
  }
};

// user collect Voucher
exports.collectVoucherValidation = async (req, res, next) => {
  try {
    const { voucherID } = req.body;
    const userID = req.user.id;
    const voucher = await voucherService.getVoucherByID(voucherID);
    // Kiểm tra số lượng mã giảm giá khi user lấy
    if (voucher.quantityUsed === voucher.quantity) {
      return next(new ApiError(400, "Mã giảm giá đã hết số lượng"));
    }
    // Kiểm tra tồn tại mã giảm giá
    const voucherExisted = await voucherUsedService.getOneVoucherUsed({
      userID: userID,
      voucherID: voucherID,
    });
    if (voucherExisted) {
      return next(new ApiError(400, "Mã giảm giá đã được lấy"));
    }

    next();
  } catch (err) {
    return next(new ApiError(400, err.message));
  }
};
