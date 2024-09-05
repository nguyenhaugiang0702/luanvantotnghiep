const ApiError = require("../api-error");
const authorService = require("../services/author.service");
const schema = require("../utils/schema.util");

exports.createAuthorValidation = async (req, res, next) => {
  try {
    await schema.authorSchema.validate(req.body);
    // const checkNameAuthor = await authorService.checkNameExist(
    //   req.body.name
    // );
    // if (checkNameAuthor) {
    //   return next(new ApiError(400, "Đã tồn tại tên tác giả"));
    // }
    next();
  } catch (err) {
    return next(new ApiError(400, err.message));
  }
};
