const moment = require("moment-timezone");
const ApiError = require("../../api-error");
const commentService = require("../../services/comment.service");
const orderService = require("../../services/order.service");
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

exports.findAll = async (req, res, next) => {
  let comments = [];
  const userID = req.user ? req.user.id : null;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 3;
  const skip = (page - 1) * limit;
  try {
    comments = await commentService.getComments(
      {
        isAdminReply: false,
      },
      skip,
      limit
    );
    const totalComments = await commentService.countComments({
      isAdminReply: false,
    });
    const totalPages = Math.ceil(totalComments / limit);
    if (userID) {
      const commentsWithUserActions = comments.map((comment) => {
        const isLiked = comment.likedBy.some((comment) => comment.userID.toString() === userID);
        const isDisliked = comment.disLikedBy.some((comment) => comment.userID.toString() === userID);

        return {
          ...comment._doc,
          isLiked, // True nếu user đã like comment này
          isDisliked, // True nếu user đã dislike comment này
        };
      });
      return res.send({
        currentPage: page,
        totalPages: totalPages,
        totalComments: totalComments,
        comments: commentsWithUserActions,
      });
    }
    return res.send({
      currentPage: page,
      totalPages: totalPages,
      totalComments: totalComments,
      comments: comments,
    });
  } catch (error) {
    console.log(error);
    return next(new ApiError(500, "Lỗi khi lấy bình luận mới"));
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
      if (!comment.likedBy.some(user => user.userID.toString() === userID)) {
        comment.likedBy.push({ userID });
        comment.liked += 1;
      }

      const disLikeIndex = comment.disLikedBy.findIndex(user => user.userID.toString() === userID);
      if (disLikeIndex > -1) {
        comment.disLikedBy.splice(disLikeIndex, 1);
        comment.disLiked -= 1;
      }
    } else if (action === "unlike") {
      const likeIndex = comment.likedBy.findIndex(user => user.userID.toString() === userID);
      if (likeIndex > -1) {
        comment.likedBy.splice(likeIndex, 1);
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
      if (!comment.disLikedBy.some(user => user.userID.toString() === userID)) {
        comment.disLikedBy.push({ userID });
        comment.disLiked += 1;
      }

      const likeIndex = comment.likedBy.findIndex(user => user.userID.toString() === userID);
      if (likeIndex > -1) {
        comment.likedBy.splice(likeIndex, 1);
        comment.liked -= 1;
      }
    } else if (action === "undislike") {
      const disLikeIndex = comment.disLikedBy.findIndex(user => user.userID.toString() === userID);
      if (disLikeIndex > -1) {
        comment.disLikedBy.splice(disLikeIndex, 1);
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
