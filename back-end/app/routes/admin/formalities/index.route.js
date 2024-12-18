const express = require("express");
const router = express.Router();
const formalities = require("../../../controllers/admin/formality.controller");

router.route("/").get(formalities.findAll).post(formalities.create);

router
  .route("/:formalityID")
  .put(formalities.update)
  .delete(formalities.delete);

module.exports = router;
