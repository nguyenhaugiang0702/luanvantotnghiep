const moment = require("moment-timezone");
const ApiError = require("../api-error");
const commentService = require("../services/comment.service");
const orderService = require("../services/order.service");
const fs = require("fs").promises;

exports.create = async (req, res, next) => {
  const userID = req.user ? req.user.id : null;
  if (!userID) {
    return next(new ApiError(400, "Vui lòng đăng nhập"));
  }
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

exports.findAllAdmin = async (req, res, next) => {
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

exports.findAll = async (req, res, next) => {
  let comments = [];
  const userID = req.user ? req.user.id : null;
  try {
    comments = await commentService.getComments({
      isAdminReply: false,
    });
    if (userID) {
      const commentsWithUserActions = comments.map((comment) => {
        const isLiked = comment.likedBy.includes(userID);
        const isDisliked = comment.disLikedBy.includes(userID);

        return {
          ...comment._doc,
          isLiked, // True nếu user đã like comment này
          isDisliked, // True nếu user đã dislike comment này
        };
      });
      return res.send(commentsWithUserActions);
    }
    return res.send(comments);
  } catch (error) {
    console.log(error);
    return next(new ApiError(500, "Lỗi khi lấy bình luận mới"));
  }
};

exports.findAllWithNoToken = async (req, res, next) => {
  let comments = [];
  try {
    comments = await commentService.getComments({
      isAdminReply: false,
    });
    return res.send(comments);
  } catch (error) {
    console.log(error);
    return next(new ApiError(500, "Lỗi khi lấy bình luận mới"));
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

exports.likeComment = async (req, res, next) => {
  const { commentID } = req.params;
  const { action } = req.body;
  const userID = req.user ? req.user.id : null;
  if (!userID) {
    return next(new ApiError(400, "Vui lòng đăng nhập"));
  }
  try {
    const comment = await commentService.getCommentById(commentID);
    if (action === "like") {
      if (!comment.likedBy.includes(userID)) {
        comment.likedBy.push(userID);
        comment.liked += 1;
      }

      if (comment.disLikedBy.includes(userID)) {
        const index = comment.disLikedBy.indexOf(userID);
        comment.disLikedBy.splice(index, 1);
        comment.disLiked -= 1;
      }
    } else if (action === "unlike") {
      const index = comment.likedBy.indexOf(userID);
      if (index > -1) {
        comment.likedBy.splice(index, 1);
        comment.liked -= 1;
      }
    }

    await comment.save();
    return res.send({
      message: "Đã like thành công",
    });
  } catch (error) {
    console.log(error);
    return next(new ApiError(500, "Lỗi khi thích bình luận"));
  }
};

exports.disLikeComment = async (req, res, next) => {
  const { commentID } = req.params;
  const { action } = req.body;
  const userID = req.user ? req.user.id : null;
  if (!userID) {
    return next(new ApiError(400, "Vui lòng đăng nhập"));
  }
  try {
    const comment = await commentService.getCommentById(commentID);

    if (action === "dislike") {
      if (!comment.disLikedBy.includes(userID)) {
        comment.disLikedBy.push(userID);
        comment.disLiked += 1;
      }

      if (comment.likedBy.includes(userID)) {
        const index = comment.likedBy.indexOf(userID);
        comment.likedBy.splice(index, 1);
        comment.liked -= 1;
      }
    } else if (action === "undislike") {
      const index = comment.disLikedBy.indexOf(userID);
      if (index > -1) {
        comment.disLikedBy.splice(index, 1);
        comment.disLiked -= 1;
      }
    }

    await comment.save();
    return res.send({
      message: "Đã dislike thành công",
    });
  } catch (error) {
    console.log(error);
    return next(new ApiError(500, "Lỗi khi không thích bình luận"));
  }
};
