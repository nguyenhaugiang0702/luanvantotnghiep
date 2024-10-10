const express = require("express");
const router = express.Router();
const comment = require("../../../controllers/comment.controller");
const validation = require("../../../middlewares/validateAddress.middleware");
const jwt = require("../../../middlewares/jwt.middleware");

router.route("/").get(comment.findAll);
router.route("/:bookID").put(jwt.authenticateTokenFromHeader, comment.create);

module.exports = router;
