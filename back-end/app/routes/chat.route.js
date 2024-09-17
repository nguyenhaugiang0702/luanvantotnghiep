const express = require("express");
const chat = require("../controllers/chat.controller");
const router = express.Router();
const jwt = require("../middlewares/jwt.middleware");

router.route("/checkRoomChat").get(jwt.authenticateTokenFromHeader, chat.checkRoomChat);

module.exports = router;


