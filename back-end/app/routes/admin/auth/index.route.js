const express = require("express");
const authAdmin = require("../../../controllers/admin/auth.controller");
const validation = require("../../../middlewares/validateAdmin.middleware");

const router = express.Router();

router.route("/login").post(validation.loginAdminValidation, authAdmin.login);
router.route("/checkRole").get(authAdmin.checkRole);
router.route("/refreshToken").post(authAdmin.refreshToken); // RefreshToken
router.route("/changePassword").put(authAdmin.changePassword);

module.exports = router;
