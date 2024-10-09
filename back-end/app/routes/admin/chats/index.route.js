const express = require("express");
const chat = require("../../../controllers/chat.controller");
const router = express.Router();
const jwt = require("../../../middlewares/jwt.middleware");

router.route("/chatrooms",).get(chat.getChatRooms);

module.exports = router;


