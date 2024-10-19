const express = require("express");
const router = express.Router();
const upload = require("../../utils/multer.util");

router.use("/authors", require("./authors/index.route"));
router.use("/auth", require("./auth/index.route"));
router.use("/books", upload.array("images"), require("./books/index.route"));
router.use("/categories", require("./categories/index.route"));
router.use("/chats", require("./chats/index.route"));
router.use("/orders", require("./orders/index.route"));
router.use("/priceranges", require("./priceranges/index.route"));
router.use("/publishers", require("./publishers/index.route"));
router.use("/receipts", require("./receipts/index.route"));
router.use("/suppliers", require("./suppliers/index.route"));
router.use("/users", require("./users/index.route"));
router.use("/vouchers", require("./vouchers/index.route"));
router.use("/formalities", require("./formalities/index.route"));
router.use("/comments", require("./comments/index.route"));
router.use("/home-page", require("./home/index.route"));
router.use("/roles", require("./roles/index.route"));
router.use("/admins", require("./admins/index.route"));

module.exports = router;
