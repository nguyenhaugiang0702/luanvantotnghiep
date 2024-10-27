const express = require("express");
const chat = require("../../../controllers/user/chat.controller");
const router = express.Router();

router.route("/checkRoomChat").get(chat.checkRoomChat);
router.route("/chatrooms/:chatRoomID",).put(chat.updateChatRoom);

module.exports = router;


