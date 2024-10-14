const express = require("express");
const router = express.Router();

router.use("/momo", require("./momo/index.route"));
router.use("/paypal", require("./paypal/index.route"));
router.use("/zalopay", require("./zalopay/index.route"));

module.exports = router;
