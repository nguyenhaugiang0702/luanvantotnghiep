const ApiError = require("../api-error");
const publisherService = require("../services/publisher.service");
const schema = require("../utils/schema.util");

exports.createPublisherValidation = async (req, res, next) => {
  try {
    await schema.publisherSchema.validate(req.body);

    if (req.body.method === "add") {
      await validateAddPublisher(req, next);
    } else {
      await validateEditPublisher(req, next);
    }

    next();
  } catch (err) {
    return next(new ApiError(400, err.message));
  }
};

// Hàm kiểm tra khi thêm mới nhà xuất bản
const validateAddPublisher = async (req, next) => {
  // Kiểm tra trùng lặp tên nhà xuất bản
  const checkNamePublisher = await publisherService.checkNameExist(req.body.name);
  if (checkNamePublisher) {
    return next(new ApiError(400, "Đã tồn tại tên nhà xuất bản"));
  }

  // Kiểm tra trùng lặp email nhà xuất bản
  const checkEmailPublisher = await publisherService.checkEmailExist(req.body.email);
  if (checkEmailPublisher) {
    return next(new ApiError(400, "Đã tồn tại email nhà xuất bản"));
  }

  // Kiểm tra trùng lặp số điện thoại nhà xuất bản
  const checkPhoneNumberPublisher = await publisherService.checkPhoneNumberExist(req.body.phoneNumber);
  if (checkPhoneNumberPublisher) {
    return next(new ApiError(400, "Đã tồn tại số điện thoại nhà xuất bản"));
  }
};

// Hàm kiểm tra khi chỉnh sửa nhà xuất bản
const validateEditPublisher = async (req, next) => {
  const currentPublisher = await publisherService.getPublisherById(req.params.publisherID);
  if (!currentPublisher) {
    return next(new ApiError(404, "Nhà xuất bản không tồn tại"));
  }

  // Kiểm tra nếu tên thay đổi thì kiểm tra trùng lặp tên
  if (req.body.name && req.body.name !== currentPublisher.name) {
    const checkNamePublisher = await publisherService.checkNameExist(req.body.name);
    if (checkNamePublisher) {
      return next(new ApiError(400, "Đã tồn tại tên nhà xuất bản"));
    }
  }

  // Kiểm tra nếu email thay đổi thì kiểm tra trùng lặp email
  if (req.body.email && req.body.email !== currentPublisher.email) {
    const checkEmailPublisher = await publisherService.checkEmailExist(req.body.email);
    if (checkEmailPublisher) {
      return next(new ApiError(400, "Đã tồn tại email nhà xuất bản"));
    }
  }

  // Kiểm tra nếu số điện thoại thay đổi thì kiểm tra trùng lặp số điện thoại
  if (req.body.phoneNumber && req.body.phoneNumber !== currentPublisher.phoneNumber) {
    const checkPhoneNumberPublisher = await publisherService.checkPhoneNumberExist(req.body.phoneNumber);
    if (checkPhoneNumberPublisher) {
      return next(new ApiError(400, "Đã tồn tại số điện thoại nhà xuất bản"));
    }
  }
};
