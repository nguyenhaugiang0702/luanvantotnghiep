const ApiError = require("../api-error");
const schema = require("../utils/schema.util");

exports.createPriceRangeValidation = async (req, res, next) => {
  try {
    await schema.priceRangeSchema.validate(req.body);
    next();
  } catch (err) {
    return next(new ApiError(400, err.message));
  }
};
