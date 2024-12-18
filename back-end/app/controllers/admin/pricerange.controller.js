const moment = require("moment-timezone");
const ApiError = require("../../api-error");
const priceRangeService = require("../../services/pricerange.service");
const { formatPrice } = require("../../utils/formatPrice.utils");

exports.create = async (req, res, next) => {
  try {
    const { startPrice, endPrice } = req.body;
    req.body.createdAt = moment.tz("Asia/Ho_Chi_Minh");
    req.body.updatedAt = moment.tz("Asia/Ho_Chi_Minh");
    req.body.name = `${formatPrice(startPrice)} - ${formatPrice(endPrice)}`;
    const checkExistPriceRange = await priceRangeService.getPriceRange({
      name: req.body.name,
    });
    if(checkExistPriceRange){
      return next(new ApiError(400, "Đã tồn tại kkhoản giá"))
    }
    const newPriceRange = await priceRangeService.createPriceRange(req.body);
    return res.send({
      message: "Thêm khoản giá thành công",
      newPriceRange,
    });
  } catch (error) {
    console.log(error);
    return next(new ApiError(500, "Lỗi khi thêm mới khoản giá"));
  }
};

exports.findAll = async (req, res, next) => {
  let priceRanges = [];
  try {
    priceRanges = await priceRangeService.getAllPriceRange({});
  } catch (error) {
    return next(new ApiError(500, "Lỗi khi lấy tất cả khoản giá"));
  }
  return res.send(priceRanges);
};

exports.update = async (req, res, next) => {
  try {
    const priceRangeID = req.params.priceRangeID;
    req.body.updatedAt = moment.tz("Asia/Ho_Chi_Minh");
    const priceRange = await priceRangeService.updatePriceRange(
      priceRangeID,
      req.body
    );
    return res.send({
      message: "Cập nhật thành công khoản giá",
      priceRange,
    });
  } catch (error) {
    return next(new ApiError(500, "Lỗi khi cập nhật khoản giá"));
  }
};

exports.delete = async (req, res, next) => {
  try {
    const priceRangeID = req.params.priceRangeID;
    const priceRange = await priceRangeService.deletePriceRange(priceRangeID);
    return res.send({
      message: "Xóa thành công khoản giá",
      priceRange,
    });
  } catch (error) {
    return next(new ApiError(500, "Lỗi khi xóa khoản giá"));
  }
};
