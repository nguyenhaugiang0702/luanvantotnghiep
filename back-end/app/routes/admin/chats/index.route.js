const express = require("express");
const chat = require("../../../controllers/admin/chat.controller");
const router = express.Router();

router.route("/chatrooms",).get(chat.getChatRooms);
router.route("/chatrooms/:chatRoomID",).put(chat.updateChatRoom);

module.exports = router;


