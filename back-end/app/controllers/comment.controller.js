const moment = require("moment-timezone");
const ApiError = require("../api-error");
const commentService = require("../services/comment.service");

exports.create = async (req, res, next) => {
  const userID = req.user.id;
  const bookID = req.params.bookID;
  let newComment;
  try {
    const { content, rating } = req.body;

    if (!content || !rating) {
      return next(new ApiError(400, "Nội dung và đánh giá là bắt buộc"));
    }
    const createdAt = moment.tz("Asia/Ho_Chi_Minh").toDate();
    if (!req.files) {
      newComment = await commentService.createComment({
        bookID: bookID,
        userID: userID,
        content: content,
        star: rating,
        createdAt: createdAt,
      });
    } else {
      const images = req.files.map((file) => ({
        path: file.path,
      }));
      newComment = await commentService.createComment({
        bookID: bookID,
        userID: userID,
        content: content,
        star: rating,
        createdAt: createdAt,
        images: images,
      });
    }
    return res.send({
      message: "Đăng đánh giá thành công",
      newComment,
    });
  } catch (error) {
    console.log(error);
    return next(new ApiError(500, "Lỗi khi bình luận mới"));
  }
};

exports.findAll = async (req, res, next) => {
  let comments = [];
  try {
    comments = await commentService.getComments();
    return res.send(comments);
  } catch (error) {
    console.log(error);
    return next(new ApiError(500, "Lỗi khi bình luận mới"));
  }
};
