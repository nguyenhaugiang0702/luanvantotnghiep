const ApiError = require("../api-error");
const schema = require("../utils/schema.util");

exports.ordersValidation = async (req, res, next) => {
  try {
    await schema.orderSchema.validate(req.body);
    next();
  } catch (err) {
    return next(new ApiError(400, err.message));
    // return next(new ApiError(400, 'Đặt hàng thất bại. Vui lòng kiểm tra lại thông tin.'));
  }
};
