const express = require("express");
const router = express.Router();
const comment = require("../../../controllers/user/comment.controller");

router.route("/").get(comment.findAll);

router.route("/:bookID").put(comment.create);
router.route("/:commentID/like").put(comment.likeComment);
router.route("/:commentID/dislike").put(comment.disLikeComment);

module.exports = router;
