const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const commentSchema = new Schema({
  bookID: {
    type: Schema.Types.ObjectId,
    ref: "Book",
  },
  userID: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  content: {
    type: String,
  },
  star: {
    type: Number,
  },
  images: [
    {
      path: {
        type: String,
        default: null,
      },
    },
  ],
  isAdminReply: {
    type: Boolean,
    default: false,
  },
  parentCommentID: {
    type: Schema.Types.ObjectId,
    ref: "Comment",
    default: null,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  replies: [
    {
      type: Schema.Types.ObjectId,
      ref: "Comment",
      default: null,
    },
  ],
});
const Comment = mongoose.model("Comment", commentSchema);

module.exports = Comment;
