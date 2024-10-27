const express = require("express");
const router = express.Router();
const comment = require("../../../controllers/admin/comment.controller");

router.route("/").get(comment.findAll);
router.route("/:commentID/reply").put(comment.replyComment);

router.route("/:commentID").delete(comment.deleteComment);

module.exports = router;
