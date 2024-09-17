const moment = require("moment-timezone");
const ApiError = require("../api-error");
const chatRoomService = require("../services/chatRoom.service");

exports.checkRoomChat = async (req, res, next) => {
  const userID = req.user.id;
  try {
    const chatRoom = await chatRoomService.getChatRoomByUserID(userID);
    if (!chatRoom) {
      let newChatRoom = await chatRoomService.createChatRoom({
        adminID: null,
        userID: userID,
        messages: [],
        createdAt: moment.tz("Asia/Ho_Chi_Minh").toDate(),
        updatedAt: moment.tz("Asia/Ho_Chi_Minh").toDate(),
      });
      console.log(newChatRoom);
      if (!newChatRoom) {
        return next(new ApiError(400, "Lỗi khi tạo mới chat room"));
      }
      return res.send({ chatRoomID: newChatRoom._id });
    } else {
      return res.send({ chatRoomID: chatRoom._id });
    }
  } catch (error) {
    return next(new ApiError(500, "Lỗi khi lấy tất cả địa chỉ"));
  }
};
