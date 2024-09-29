const ApiError = require("../api-error");
const schema = require("../utils/schema.util");

exports.registerUserValidation = async (req, res, next) => {
  try {
    await schema.registerUserSchema.validate(req.body);
    next();
  } catch (err) {
    return next(new ApiError(400, err.message));
  }
};

exports.loginUserValidation = async (req, res, next) => {
  try {
    await schema.loginUserSchema.validate(req.body);
    next();
  } catch (err) {
    return next(new ApiError(400, err.message));
  }
};

exports.forgotPasswordValidation = async (req, res, next) => {
  try {
    await schema.forgotPasswordSchema.validate(req.body);
    next();
  } catch (err) {
    return next(new ApiError(400, err.message));
  }
};
