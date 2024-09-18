const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const commentSchema = new Schema({
  bookID: {
    type: Schema.Types.ObjectId,
    ref: 'Book', // Reference tới sách mà comment thuộc về
    required: true,
  },
  userID: {
    type: Schema.Types.ObjectId,
    ref: 'User', // Reference tới user comment
    required: true,
  },
  content: {
    type: String,
    required: true,
    trim: true,
  },
  isAdminReply: {
    type: Boolean,
    default: false, // Admin reply sẽ có isAdminReply = true
  },
  parentCommentID: {
    type: Schema.Types.ObjectId,
    ref: 'Comment', // Nếu là reply, thì lưu id comment cha
    default: null,  // Nếu không phải reply, để là null
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  replies: [{
    type: Schema.Types.ObjectId,
    ref: 'Comment', // Danh sách các replies (comment trả lời)
  }],
});
const Comment = mongoose.model("Comment", commentSchema);

module.exports = Comment;
