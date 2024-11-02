const Comment = require("../models/comment.models");

const createComment = async (commentData) => {
  const newComment = new Comment(commentData);
  return await newComment.save();
};

const getComments = async (query, skip = 0, limit = 0) => {
  let commentsData = Comment.find(query)
    .populate("userID")
    .populate("bookID")
    .populate({
      path: "replies.commentID",
      match: { isAdminReply: true }, // Chỉ lấy các phản hồi của admin
      populate: [{ path: "userID" }],
    });
  if (skip || limit) {
    commentsData = commentsData.skip(skip).limit(limit);
  }
  return await commentsData;
};

const getCommentById = async (commentID) => {
  return await Comment.findById(commentID);
};

const deleteCommentById = async (commentID) => {
  return await Comment.findByIdAndDelete(commentID);
};

const countComments = async (query) => {
  return await Comment.countDocuments(query);
};

const deleteAdminReplies = async (commentID) => {
  return await Comment.deleteMany({
    parentCommentID: commentID,
    isAdminReply: true,
  });
};

const getAdminReply = async (commentID) => {
  return await Comment.findOne({
    parentCommentID: commentID,
    isAdminReply: true,
  });
};

module.exports = {
  createComment,
  getComments,
  getCommentById,
  deleteCommentById,
  countComments,
  deleteAdminReplies,
  getAdminReply,
};
