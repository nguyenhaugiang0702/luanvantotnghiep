const express = require("express");
const validation = require("../../../../middlewares/validateOrder.middelware");
const paypal = require("../../../../controllers/user/payment/paypal/paymentPaypal.controller");

const router = express.Router();

router
  .route("/createLink")
  .post(
    validation.ordersValidation,
    paypal.createLinkOrderByPayPal
  );

router.route("/success").get(paypal.handlePayPalSuccess);

router.route("/cancel").get(paypal.handlePayPalCancel);

module.exports = router;
