const express = require("express");
const accounts = require("../controllers/account.controller");
const authenticateToken = require("../middlewares/jwt.middleware");
const router = express.Router();

router.route("/").get(accounts.findALL).delete(accounts.deleteALL);

router.route("/login").post(accounts.login);
router
  .route("/activeAccount/:token")
  .get(
    authenticateToken.authenticateTokenFromParamsWithEmail,
    accounts.activeAccount
  );

router.route("/blockAccount/:accountID").put(accounts.blockAccount);

router
  .route("/:accountID")
  .get(accounts.findOne)
  .put(accounts.update)
  .delete(accounts.delete);

module.exports = router;
