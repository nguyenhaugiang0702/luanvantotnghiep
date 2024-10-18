const express = require("express");
const chat = require("../../../controllers/user/chat.controller");
const router = express.Router();
const jwt = require("../../../middlewares/jwt.middleware");

router.route("/checkRoomChat").get(jwt.authenticateTokenFromHeader, chat.checkRoomChat);
router.route("/chatrooms/:chatRoomID",).put(chat.updateChatRoom);

module.exports = router;


