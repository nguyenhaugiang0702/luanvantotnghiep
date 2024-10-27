const express = require("express");
const admin = require("../../../controllers/admin/admin.controller");
const router = express.Router();
const validation = require("../../../middlewares/validateAdmin.middleware");

router
  .route("/")
  .get(admin.findALL)
  .post(validation.createAdminValidation, admin.create);
router.route("/infoAdmin").get(admin.findAdminInfo);
router.route("/:adminID").put(validation.createAdminValidation, admin.update);

module.exports = router;
