const ApiError = require("../api-error");
const schema = require("../utils/schema.util");

exports.createAddressValidation = async (req, res, next) => {
  try {
    const { isDefault, ...restBody } = req.body;

    // Nếu req.body chỉ chứa isDefault, bỏ qua validate 
    if (isDefault !== undefined && Object.keys(restBody).length === 0) {
      return next();
    }
    await schema.addressSchema.validate(req.body);
    next();
  } catch (err) {
    return next(new ApiError(400, err.message));
  }
};
