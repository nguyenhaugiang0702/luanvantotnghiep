const express = require("express");
const router = express.Router();
const priceRanges = require("../controllers/pricerange.controller");
const validation = require("../middlewares/validatePriceRange.middleware");

router
  .route("/")
  .get(priceRanges.findAll)
  .post(validation.createPriceRangeValidation, priceRanges.create);

router
  .route("/:priceRangeID")
  .put(validation.createPriceRangeValidation, priceRanges.update)
  .delete(priceRanges.delete);

module.exports = router;
