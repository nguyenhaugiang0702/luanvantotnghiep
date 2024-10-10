const express = require("express");
const router = express.Router();
const comment = require("../../../controllers/comment.controller");
const validation = require("../../../middlewares/validateAddress.middleware");
const jwtAdmin = require("../../../middlewares/jwtAdmin.middleware");

router.route("/").get(comment.findAll);
router
  .route("/:commentID/reply")
  .put(jwtAdmin.authenticateTokenFromHeader, comment.replyComment);

router.route("/:commentID").delete(comment.deleteComment);

module.exports = router;
