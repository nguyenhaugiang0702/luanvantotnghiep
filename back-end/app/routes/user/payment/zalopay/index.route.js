const express = require("express");
const jwt = require("../../../../middlewares/jwt.middleware");
const validation = require("../../../../middlewares/validateOrder.middelware");
const zalopay = require("../../../../controllers/user/payment/zalopay/paymentZalopay.controller");

const router = express.Router();

router
  .route("/createLink")
  .post(
    jwt.authenticateTokenFromHeader,
    validation.ordersValidation,
    zalopay.createLinkOrderByZaloPay
  );

router.route("/callback").post(zalopay.handleZaloPayIPN);

router
  .route("/transaction-status/:app_trans_id")
  .post(zalopay.handleZaloPayIPNTransactionStatus);

module.exports = router;
