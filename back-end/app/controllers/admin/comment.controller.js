const moment = require("moment-timezone");
const ApiError = require("../../api-error");
const commentService = require("../../services/comment.service");
const orderService = require("../../services/order.service");
const fs = require("fs").promises;

exports.findAll = async (req, res, next) => {
  let comments = [];
  try {
    comments = await commentService.getComments({
      isAdminReply: false,
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