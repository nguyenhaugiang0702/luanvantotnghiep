const Comment = require("../models/comment.models");

const createComment = async (commentData) => {
  const newComment = new Comment(commentData);
  return await newComment.save();
};

const getComments = async () => {
  return await Comment.find({}).populate("userID");
};

module.exports = {
  createComment,
  getComments,
};
