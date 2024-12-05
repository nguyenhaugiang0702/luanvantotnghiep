const moment = require("moment-timezone");
const ApiError = require("../../api-error");
const chatRoomService = require("../../services/chatRoom.service");

exports.getChatRooms = async (req, res, next) => {
  try {
    const chatRooms = await chatRoomService.getChatRooms({});
    return res.send(chatRooms);
  } catch (error) {
    return next(new ApiError(500, "Lỗi khi lấy tất cả tin nhắn"));
  }
};

exports.getChatRoom = async (req, res, next) => {
  try {
    const { chatRoomID } = req.params;
    const chatRoom = await chatRoomService.getMessageByChatRoomID(chatRoomID);
    return res.send(chatRoom);
  } catch (error) {
    return next(new ApiError(500, "Lỗi khi lấy tất cả tin nhắn"));
  }
};

exports.updateChatRoom = async (req, res, next) => {
  try {
    const { chatRoomID } = req.params;
    const { isReaded } = req.body;
    const chatRoom = await chatRoomService.getMessageByChatRoomID(chatRoomID);
    // Duyệt qua tất cả các tin nhắn chưa đọc của người dùng và cập nhật
    chatRoom.messages.forEach((msg) => {
      if (msg.sender === "user" && !msg.isReaded) {
        msg.isReaded = isReaded;
      }
    });
    // Báo Mongoose rằng mảng messages đã thay đổi
    chatRoom.markModified("messages");
    // Lưu lại phòng chat với tin nhắn đã được cập nhật
    await chatRoom.save();
    return res.send({
      message: "Cập nhật thành công",
    });
  } catch (error) {
    console.log(error);
    return next(new ApiError(500, "Lỗi khi lấy tất cả tin nhắn"));
  }
};

exports.checkMessages = async (req, res, next) => {
  try {
    const chatRooms = await chatRoomService.getChatRooms({});
    const lastUserMessagesInfo = [];
    chatRooms.forEach((chatRoom) => {
      // Kiểm tra nếu có tin nhắn trong phòng
      if (chatRoom.messages.length > 0) {
        // Lấy tin nhắn cuối cùng
        const lastMessage = chatRoom.messages[chatRoom.messages.length - 1];

        // Kiểm tra nếu tin nhắn cuối cùng là từ user
        if (lastMessage.sender === "user" && !lastMessage.isReaded) {
          lastUserMessagesInfo.push({
            chatRoomID: chatRoom._id, // ID phòng chat
            lastMessage: lastMessage, // Tin nhắn cuối cùng từ user
            user:
              chatRoom.userID?.firstName +' '+ chatRoom.userID?.lastName ||
              "Không rõ",
          });
        }
      }
    });
    if (lastUserMessagesInfo.length > 0) {
      return res.send({
        message: "Tin nhắn mới từ",
        title: "Tin nhắn mới",
        data: lastUserMessagesInfo || [],
      });
    }
    return res.send({
      data: [],
    });
  } catch (error) {
    return next(new ApiError(500, "Lỗi khi lấy tất cả tin nhắn"));
  }
};
