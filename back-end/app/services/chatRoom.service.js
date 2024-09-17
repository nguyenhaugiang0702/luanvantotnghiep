const ChatRoom = require("../models/chatRoom.model");
const moment = require("moment-timezone");
const mongoose = require("mongoose");

const createChatRoom = async (chatRoomData) => {
  const newChatRoom = new ChatRoom(chatRoomData);
  return await newChatRoom.save();
};

const getMessageByChatRoomID = async (chatRoomId) => {
  return await ChatRoom.findById(chatRoomId);
};

const getChatRoomByUserID = async (userID) => {
  return await ChatRoom.findOne({ userID: userID });
};

// Kiểm tra sự tồn tại của phòng chat và tạo mới nếu không tồn tại
const getOrCreateChatRoom = async (chatRoomId, adminID, clientID) => {
  let chatRoom = await ChatRoom.findById(chatRoomId);

  if (!chatRoom) {
    chatRoom = new ChatRoom({
      adminID: adminID,
      clientID: clientID,
      messages: [],
    });
    await chatRoom.save();
  }

  return chatRoom;
};

const updateMessage = async (chatRoomId, sender, message) => {
  return await ChatRoom.findByIdAndUpdate(
    chatRoomId,
    {
      $push: {
        messages: {
          sender: sender,
          message: message,
          createdAt: moment.tz("Asia/Ho_Chi_Minh").toDate(),
          updatedAt: moment.tz("Asia/Ho_Chi_Minh").toDate(),
        },
      },
      updatedAt: moment.tz("Asia/Ho_Chi_Minh").toDate(),
    },
    { new: true } // Return the updated document
  );
};

module.exports = {
  getMessageByChatRoomID,
  updateMessage,
  getOrCreateChatRoom,
  getChatRoomByUserID,
  createChatRoom,
};
