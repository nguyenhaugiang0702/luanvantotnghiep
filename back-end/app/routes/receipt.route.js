const express = require("express");
const receipts = require("../controllers/receipt.controller");
const authenticateToken = require("../middlewares/jwt.middleware");

const router = express.Router();

router
    .route("/")
    .get(receipts.findAll)
    .post(receipts.create);

// router
//   .route("/:receiptID")
//   .get(receipts.findOne)
//   .put(receipts.update)
//   .delete(receipts.delete);
module.exports = router;
