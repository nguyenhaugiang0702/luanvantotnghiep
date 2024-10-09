const express = require("express");
const authAdmin = require("../../../controllers/auth/authAdmin.controller");
const config = require("../../../config/index");
const router = express.Router();
const jwtAdmin = require("../../../middlewares/jwtAdmin.middleware");

router.route("/login").post(authAdmin.login);
router.route("/checkRole").get(jwtAdmin.authenticateTokenFromHeader, authAdmin.checkRole);
router
  .route("/refreshToken")
  .post(jwtAdmin.authenticateTokenFromHeader, authAdmin.refreshToken); // RefreshToken


module.exports = router;
