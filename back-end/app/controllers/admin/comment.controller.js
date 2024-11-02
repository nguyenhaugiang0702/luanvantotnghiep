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
    return next(new ApiError(500, "Lỗi khi lấy tất cả bình luận"));
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

    // Xóa các bình luận của admin liên quan đến bình luận này
    const deleteAdminReplies = await commentService.deleteAdminReplies(
      commentID
    );
    if (!deleteAdminReplies) {
      return next(new ApiError(400, "Lỗi khi xóa bình luận của admin"));
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
    const adminID = req.admin ? req.admin.id : null;
    const parentComment = await commentService.getCommentById(commentID);
    if (!parentComment) {
      return next(
        new ApiError(404, `Không tồn tại bình luận với ID = ${commentID}`)
      );
    }
    if (!adminID) {
      return next(new ApiError(403, "Quyền truy cập bị từ chối"));
    }
    if (!replyContent) {
      return next(new ApiError(404, "Vui lòng nhập nội dung trả lời"));
    }
    // Kiểm tra xem đã có phản hồi của admin chưa
    let adminReply = await commentService.getAdminReply(commentID);
    if (adminReply) {
      // Cập nhật nội dung nếu đã có phản hồi của admin
      adminReply.content = replyContent;
      adminReply.updatedAt = moment.tz("Asia/Ho_Chi_Minh");
      await adminReply.save();
    } else {
      // Tạo phản hồi mới nếu chưa có
      adminReply = await commentService.createComment({
        bookID: parentComment.bookID,
        userID: parentComment.userID,
        content: replyContent,
        isAdminReply: true,
        parentCommentID: commentID,
        createdAt: moment.tz("Asia/Ho_Chi_Minh"),
        updatedAt: moment.tz("Asia/Ho_Chi_Minh"),
      });

      // Cập nhật mảng replies của bình luận gốc
      parentComment.replies.push({ commentID: adminReply._id });
      await parentComment.save();
    }

    return res.send({
      message: "Đã trả lời thành công",
      data: adminReply,
    });
  } catch (error) {
    console.log(error);
    return next(new ApiError(500, "Lỗi trả lời bình luận"));
  }
};
