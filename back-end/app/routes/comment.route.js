const express = require("express");
const router = express.Router();
const comment = require("../controllers/user/comment.controller");
const validation = require("../middlewares/validateAddress.middleware");
const jwt = require("../middlewares/jwt.middleware");

router.route("/:bookID").put(jwt.authenticateTokenFromHeader, comment.create);

module.exports = router;
