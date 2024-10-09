const express = require("express");
const priceRanges = require("../../../controllers/pricerange.controller");
const validation = require("../../../middlewares/validatePriceRange.middleware");
const jwtAdmin = require("../../../middlewares/jwtAdmin.middleware");

const router = express.Router();
router.use(jwtAdmin.authenticateTokenFromHeader);

router
  .route("/")
  .get(priceRanges.findAll)
  .post(validation.createPriceRangeValidation, priceRanges.create);

router
  .route("/:priceRangeID")
  .put(validation.createPriceRangeValidation, priceRanges.update)
  .delete(priceRanges.delete);

module.exports = router;