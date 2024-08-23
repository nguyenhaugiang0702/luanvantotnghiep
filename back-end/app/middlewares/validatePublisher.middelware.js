const ApiError = require("../api-error");
const publisherService = require("../services/publisher.service");
const schema = require("../utils/schema.util");

exports.createPublisherValidation = async (req, res, next) => {
  try {
    await schema.publisherSchema.validate(req.body);
    const checkNamePublisher = await publisherService.checkNameExist(
      req.body.name
    );
    if (checkNamePublisher) {
      return next(new ApiError(400, "Đã tồn tại tên nhà xuất bản"));
    }

    const checkEmailPublisher = await publisherService.checkEmailExist(
      req.body.email
    );
    if (checkEmailPublisher) {
      return next(new ApiError(400, "Đã tồn tại email nhà xuất bản"));
    }

    const checkPhoneNumberPublisher =
      await publisherService.checkPhoneNumberExist(req.body.phoneNumber);
    if (checkPhoneNumberPublisher) {
      return next(new ApiError(400, "Đã tồn tại số điện thoại nhà xuất bản"));
    }
    next();
  } catch (err) {
    return next(new ApiError(400, err.message));
  }
};
