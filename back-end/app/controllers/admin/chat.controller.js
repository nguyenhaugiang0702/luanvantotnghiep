const moment = require("moment-timezone");
const ApiError = require("../../api-error");
const chatRoomService = require("../../services/chatRoom.service");

exports.getChatRooms = async (req, res, next) => {
  try {
    const chatRooms = await chatRoomService.getChatRooms();
    return res.send(chatRooms);
  } catch (error) {
    return next(new ApiError(500, "Lỗi khi lấy tất cả tin nhắn"));
  }
};

exports.updateChatRoom = async (req, res, next) => {
  try {
    const { chatRoomID } = req.params;
    const { isReaded } = req.body;
    const chatRoom = await chatRoomService.getMessageByChatRoomID(chatRoomID);
    const message = chatRoom.messages.find(
      (msg) => !msg.isReaded && msg.sender === "user"
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
