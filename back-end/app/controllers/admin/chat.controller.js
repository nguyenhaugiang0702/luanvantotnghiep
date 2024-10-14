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
