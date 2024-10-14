const express = require("express");
const jwt = require("../../../../middlewares/jwt.middleware");
const validation = require("../../../../middlewares/validateOrder.middelware");
const paypal = require("../../../../controllers/user/payment/paypal/paymentPaypal.controller");

const router = express.Router();

router
  .route("/createLink")
  .post(
    jwt.authenticateTokenFromHeader,
    validation.ordersValidation,
    paypal.createLinkOrderByPayPal
  );

router.route("/success").get(paypal.handlePayPalSuccess);

router.route("/cancel").post(paypal.handlePayPalCancel);

module.exports = router;
