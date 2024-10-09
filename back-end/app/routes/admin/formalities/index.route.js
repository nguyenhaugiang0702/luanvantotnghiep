const express = require("express");
const router = express.Router();
const formalities = require("../../../controllers/formality.controller");
// const validateSupplier = require("../middlewares/validateAuthor.middleware");

router.route("/").get(formalities.findAll).post(formalities.create);

router
  .route("/:formalityID")
  .put(formalities.update)
  .delete(formalities.delete);

module.exports = router;
