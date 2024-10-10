const moment = require("moment-timezone");
const ApiError = require("../api-error");
const commentService = require("../services/comment.service");
const orderService = require("../services/order.service");
const fs = require("fs").promises;

exports.create = async (req, res, next) => {
  const userID = req.user.id;
  const bookID = req.params.bookID;
  let newComment;
  try {
    const { content, rating } = req.body;

    if (!content || !rating) {
      return next(new ApiError(400, "Nội dung và đánh giá là bắt buộc"));
    }

    // Kiểm tra xem người dùng có mua sách này chưa
    const hasPurchased = await orderService.hasUserPurchasedBook(
      userID,
      bookID
    );
    if (!hasPurchased) {
      return next(
        new ApiError(403, "Bạn cần mua sách này trước khi bình luận")
      );
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
    comments = await commentService.getComments({
      isAdminReply: false
    });
    return res.send(comments);
  } catch (error) {
    console.log(error);
    return next(new ApiError(500, "Lỗi khi bình luận mới"));
  }
};

exports.deleteComment = async (req, res, next) => {
  const { commentID } = req.params;
  try {
    const comment = await commentService.getCommentById(commentID);
    if (!comment) {
      return next(
        new ApiError(404, `Không tồn tại bình luận với ID = ${commentID}`)
      );
    }
    if (comment.images.length > 0) {
      // Tồn tại ảnh khi bình luận thì xóa ảnh đi
      comment.images.map(async (image) => {
        await fs.unlink(image.path);
      });
    }
    const deleteComment = await commentService.deleteCommentById(commentID);
    if (!deleteComment) {
      return next(new ApiError(400, "Lỗi khi xóa bình luận"));
    }
    return res.send({
      message: "Xóa thành công bình luận",
    });
  } catch (error) {
    console.log(error);
    return next(new ApiError(500, "Lỗi khi xóa bình luận"));
  }
};

exports.replyComment = async (req, res, next) => {
  try {
    const { commentID } = req.params;
    const { replyContent } = req.body;
    const parentComment = await commentService.getCommentById(commentID);
    if (!parentComment) {
      return next(
        new ApiError(404, `Không tồn tại bình luận với ID = ${commentID}`)
      );
    }
    const adminReply = await commentService.createComment({
      bookID: parentComment.bookID, // Giữ nguyên bookID từ bình luận gốc
      userID: parentComment.userID, // ID của admin (người đang trả lời)
      adminID: req.admin.id,
      content: replyContent, // Nội dung của reply
      isAdminReply: true, // Đánh dấu là bình luận của admin
      parentCommentID: commentID, // Gán bình luận cha
    });

    // Cập nhật mảng replies của bình luận gốc
    parentComment.replies.push(adminReply._id);
    await parentComment.save();

    return res.send({
      message: "Đã trả lời thành công",
      data: adminReply,
    });
  } catch (error) {
    console.log(error);
    return next(new ApiError(500, "Lỗi trả lời bình luận"));
  }
};
