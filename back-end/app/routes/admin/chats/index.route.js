const express = require("express");
const chat = require("../../../controllers/admin/chat.controller");
const router = express.Router();
const jwt = require("../../../middlewares/jwt.middleware");

router.route("/chatrooms",).get(chat.getChatRooms);
router.route("/chatrooms/:chatRoomID",).put(chat.updateChatRoom);

module.exports = router;


