const Comment = require("../models/comment.models");

const createComment = async (commentData) => {
  const newComment = new Comment(commentData);
  return await newComment.save();
};

const getComments = async (query, skip = 0, limit = 0) => {
  let commentsData = Comment.find(query)
    .populate("userID")
    .populate({
      path: "replies",
      match: { isAdminReply: true }, // Chỉ lấy các phản hồi của admin
      populate: { path: "userID" }, // Lấy thông tin người dùng cho mỗi phản hồi
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

module.exports = {
  createComment,
  getComments,
  getCommentById,
  deleteCommentById,
  countComments
};
