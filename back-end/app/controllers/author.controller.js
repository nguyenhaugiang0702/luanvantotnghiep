const moment = require("moment-timezone");
const ApiError = require("../api-error");
const auhorService = require("../services/author.service");

exports.create = async (req, res, next) => {
  try {
    req.body.createAt = moment.tz("Asia/Ho_Chi_Minh").toDate();
    req.body.updatedAt = moment.tz("Asia/Ho_Chi_Minh").toDate();
    // const formattedDob = moment
    //   .tz(req.body.dob, "YYYY-MM-DD", "Asia/Ho_Chi_Minh")
    //   .format("DD/MM/YYYY");
    // req.body.dob = formattedDob;
    const newAuthor = await auhorService.createAuthor(req.body);
    return res.send({
      message: "Thêm tác giả thành công",
      newAuthor,
    });
  } catch (error) {
    return next(new ApiError(500, "Lỗi khi thêm mới tác giả"));
  }
};

exports.findAll = async (req, res, next) => {
  let authors = [];
  try {
    authors = await auhorService.getAllAuthors();
  } catch (error) {
    return next(new ApiError(500, "Lỗi khi lấy tất cả tác giả"));
  }
  return res.send(authors);
};

exports.update = async (req, res, next) => {
  try {
    const authorID = req.params.authorID;
    const author = await auhorService.updateAuthor(authorID, req.body);
    return res.send({
      message: "Cập nhật thành công tác giả",
      author,
    });
  } catch (error) {
    return next(new ApiError(500, "Lỗi khi lấy tất cả tác giả"));
  }
};

exports.delete = async (req, res, next) => {
  try {
    const authorID = req.params.authorID;
    const author = await auhorService.deleteAuthor(authorID);
    return res.send({
      message: "Xóa thành công tác giả",
      author,
    });
  } catch (error) {
    return next(new ApiError(500, "Lỗi khi lấy tất cả tác giả"));
  }
};
