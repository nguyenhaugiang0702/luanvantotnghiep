const express = require("express");
const jwt = require("../../../../middlewares/jwt.middleware");
const validation = require("../../../../middlewares/validateOrder.middelware");
const momo = require("../../../../controllers/user/payment/momo/paymentMomo.controller");

const router = express.Router();

router
  .route("/createLink")
  .post(
    jwt.authenticateTokenFromHeader,
    validation.ordersValidation,
    momo.createLinkOrderByMomo
  );

router.route("/callback").post(momo.handleMomoIPN);

router
  .route("/transaction-status")
  .post(momo.handleMomoIPNTransactionStatus);

module.exports = router;
