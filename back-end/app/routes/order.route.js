const express = require("express");
const order = require("../controllers/order.controller");
const momo = require("../controllers/momo/paymentMomo.controller");
const zalopay = require("../controllers/zalopay/paymentZalopay.controller");
const paypal = require("../controllers/paypal/paymentPaypal.controller");
const jwt = require("../middlewares/jwt.middleware");
const validateSupplier = require("../middlewares/validateSupplier.middleware");

const router = express.Router();

router.route("/").post(jwt.authenticateTokenFromHeader, order.create);
router
  .route("/detail/:orderID")
  .get(jwt.authenticateTokenFromHeader, order.findOne);
router
  .route("/:token")
  .get(jwt.authenticateTokenFromParams, order.findAllOrdersByUserID);
router
  .route("/cancelOrder/:orderID")
  .put(jwt.authenticateTokenFromHeader, order.cancelOrder);

// MOMO
router
  .route("/momo/createLink")
  .post(jwt.authenticateTokenFromHeader, momo.createLinkOrderByMomo);

router.route("/momo/callback").post(momo.handleMomoIPN);

router
  .route("/momo/transaction-status")
  .post(momo.handleMomoIPNTransactionStatus);

// End MOMO

// ZALOPAY
router
  .route("/zalopay/createLink")
  .post(jwt.authenticateTokenFromHeader, zalopay.createLinkOrderByZaloPay);

router.route("/zalopay/callback").post(zalopay.handleZaloPayIPN);

router
  .route("/zalopay/transaction-status/:app_trans_id")
  .post(zalopay.handleZaloPayIPNTransactionStatus);

// End ZALOPAY

// PAYPAL
router
  .route("/paypal/createLink")
  .post(jwt.authenticateTokenFromHeader, paypal.createLinkOrderByPayPal);

router.route("/paypal/success").get(paypal.handlePayPalSuccess);

router.route("/paypal/cancel").post(paypal.handlePayPalCancel);

// End PAYPAL

module.exports = router;
