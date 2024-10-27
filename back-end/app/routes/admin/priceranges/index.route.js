const express = require("express");
const priceRanges = require("../../../controllers/admin/pricerange.controller");
const validation = require("../../../middlewares/validatePriceRange.middleware");

const router = express.Router();

router
  .route("/")
  .get(priceRanges.findAll)
  .post(validation.createPriceRangeValidation, priceRanges.create);

router
  .route("/:priceRangeID")
  .put(validation.createPriceRangeValidation, priceRanges.update)
  .delete(priceRanges.delete);

module.exports = router;