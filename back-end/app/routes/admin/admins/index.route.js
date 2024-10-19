const express = require("express");
const admin = require("../../../controllers/admin/admin.controller");
const config = require("../../../config/index");
const router = express.Router();
const jwtAdmin = require("../../../middlewares/jwtAdmin.middleware");
const validation = require("../../../middlewares/validateAdmin.middleware");

router
  .route("/")
  .get(jwtAdmin.authenticateTokenFromHeader, admin.findALL)
  .post(validation.createAdminValidation, admin.create);

router
  .route("/:adminID")
  .put(validation.createAdminValidation, admin.update);

module.exports = router;
