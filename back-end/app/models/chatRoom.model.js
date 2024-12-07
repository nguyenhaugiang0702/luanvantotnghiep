const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Tạo schema cho tin nhắn
const messageSchema = new Schema({
  sender: { type: String },
  message: { type: String },
  isReaded: { type: Boolean, default: false }, 
  createdAt: Date,
  updatedAt: Date,
});

// Tạo schema cho phòng chat
const chatRoomSchema = new Schema({
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
