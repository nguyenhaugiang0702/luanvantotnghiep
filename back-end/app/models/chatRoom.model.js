const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Tạo schema cho tin nhắn
const messageSchema = new Schema({
  sender: { type: String },
  message: { type: String },
  createdAt: Date,
  updatedAt: Date,
});

// Tạo schema cho phòng chat
const chatRoomSchema = new Schema({
  adminID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Admin",
  },
  userID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  messages: [messageSchema],
  createdAt: Date,
  updatedAt: Date,
});

const ChatRoom = mongoose.model("ChatRoom", chatRoomSchema);

module.exports = ChatRoom;