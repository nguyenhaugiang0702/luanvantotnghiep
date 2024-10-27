const express = require("express");
const authAdmin = require("../../../controllers/admin/auth.controller");
const router = express.Router();

router.route("/login").post(authAdmin.login);
router.route("/checkRole").get(authAdmin.checkRole);
router.route("/refreshToken").post(authAdmin.refreshToken); // RefreshToken

module.exports = router;
