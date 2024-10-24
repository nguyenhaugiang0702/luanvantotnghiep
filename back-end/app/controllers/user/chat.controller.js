const moment = require("moment-timezone");
const ApiError = require("../../api-error");
const chatRoomService = require("../../services/chatRoom.service");

exports.checkRoomChat = async (req, res, next) => {
  const userID = req.user ? req.user.id : null;
  if (!userID) {
    return next(new ApiError(400, "Vui lòng đăng nhập"));
  }
  try {
    const chatRoom = await chatRoomService.getChatRoomByUserID(userID);
    const hasNewMessage = chatRoom.messages.some(
      (msg) => !msg.isReaded && msg.sender === "admin"
    );
    if (!chatRoom) {
      let newChatRoom = await chatRoomService.createChatRoom({
        adminID: null,
        userID: userID,
        messages: [],
        createdAt: moment.tz("Asia/Ho_Chi_Minh"),
        updatedAt: moment.tz("Asia/Ho_Chi_Minh"),
      });
      if (!newChatRoom) {
        return next(new ApiError(400, "Lỗi khi tạo mới chat room"));
      }
      return res.send({
        chatRoomID: newChatRoom._id,
        hasNewMessage: hasNewMessage,
      });
    } else {
      return res.send({
        chatRoomID: chatRoom._id,
        hasNewMessage: hasNewMessage,
      });
    }
  } catch (error) {
    return next(new ApiError(500, "Lỗi khi lấy tất cả địa chỉ"));
  }
};


exports.updateChatRoom = async (req, res, next) => {
  try {
    const { chatRoomID } = req.params;
    const { isReaded } = req.body;
    const chatRoom = await chatRoomService.getMessageByChatRoomID(chatRoomID);
    const message = chatRoom.messages.find(
      (msg) => !msg.isReaded && msg.sender === "admin"
    );
    if (message) {
      message.isReaded = isReaded;
      await chatRoom.save();
    }
    return res.send({
      message: "Cập nhật thành công"
    });
  } catch (error) {
    console.log(error);
    return next(new ApiError(500, "Lỗi khi lấy tất cả tin nhắn"));
  }
};
