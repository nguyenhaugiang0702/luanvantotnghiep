const express = require("express");
const router = express.Router();
const upload = require("../../utils/multer.util");

router.use("/auth", require("./auth/index.route"));
router.use("/books", require("./books/index.route"));
router.use("/orders", require("./orders/index.route"));
router.use("/profile", upload.single("avatar"), require("./users/index.route"));
router.use("/vouchers", require("./vouchers/index.route"));
router.use("/addresses", require("./addresses/index.route"));
router.use("/cart", require("./carts/index.route"));
router.use("/comments", upload.array("images"), require("./comments/index.route"));
router.use("/chats", require("./chats/index.route"));
router.use("/filters", require("./filters/index.route"));

module.exports = router;
