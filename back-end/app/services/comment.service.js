const Comment = require("../models/comment.models");

const createComment = async (commentData) => {
  const newComment = new Comment(commentData);
  return await newComment.save();
};

const getComments = async (filter) => {
  return await Comment.find(filter).populate("userID").populate({
    path: "replies",
    match: { isAdminReply: true }, // Chỉ lấy các phản hồi của admin
    populate: { path: "userID" }, // Lấy thông tin người dùng cho mỗi phản hồi
  });
};

const getCommentById = async (commentID) => {
  return await Comment.findById(commentID);
};

const deleteCommentById = async (commentID) => {
  return await Comment.findByIdAndDelete(commentID);
};

module.exports = {
  createComment,
  getComments,
  getCommentById,
  deleteCommentById,
};
