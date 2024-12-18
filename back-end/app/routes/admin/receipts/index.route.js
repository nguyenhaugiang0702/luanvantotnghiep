const express = require("express");
const receipts = require("../../../controllers/admin/receipt.controller");
const router = express.Router();

router.route("/").get(receipts.findAll).post(receipts.create);
router.route("/stockProducts").get(receipts.findAllStockProducts);
router.route("/:receiptID").get(receipts.findOne).put(receipts.update);

module.exports = router;
