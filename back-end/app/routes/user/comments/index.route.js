const express = require("express");
const router = express.Router();
const comment = require("../../../controllers/user/comment.controller");
const validation = require("../../../middlewares/validateAddress.middleware");
const jwt = require("../../../middlewares/jwt.middleware");

router.route("/").get(jwt.authenticateTokenFromHeader, comment.findAll);

router.route("/:bookID").put(jwt.authenticateTokenFromHeader, comment.create);
router
  .route("/:commentID/like")
  .put(jwt.authenticateTokenFromHeader, comment.likeComment);
router
  .route("/:commentID/dislike")
  .put(jwt.authenticateTokenFromHeader, comment.disLikeComment);

module.exports = router;
