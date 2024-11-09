const express = require("express");
const chat = require("../../../controllers/admin/chat.controller");
const router = express.Router();

router.route("/chatrooms").get(chat.getChatRooms);
router.route("/checkMessages").get(chat.checkMessages);

router
  .route("/chatrooms/:chatRoomID")
  .get(chat.getChatRoom)
  .put(chat.updateChatRoom);

module.exports = router;
