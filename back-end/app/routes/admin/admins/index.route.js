const express = require("express");
const admin = require("../../../controllers/admin/admin.controller");
const router = express.Router();
const validation = require("../../../middlewares/validateAdmin.middleware");

router
  .route("/")
  .get(admin.findALL)
  .post(validation.createAdminValidation, admin.create);
router.route("/infoAdmin").get(admin.findAdminInfo);
router.route("/resetPassword/:adminID").put(admin.resetPassword);
router
  .route("/:adminID")
  .put(validation.createAdminValidation, admin.update)
  .delete(admin.delete);

module.exports = router;
