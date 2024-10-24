const express = require("express");
const router = express.Router();
const statistics = require("../../../controllers/admin/statistics.controller");

router.route("/stock-products").get(statistics.findAllStockBooks);
router.route("/revenue").post(statistics.findRevenueWithDate);

module.exports = router;
