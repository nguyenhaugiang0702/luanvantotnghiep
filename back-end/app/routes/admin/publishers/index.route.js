const express = require("express");
const publishers = require("../../../controllers/publisher.controller");
const validation = require("../../../middlewares/validatePublisher.middelware");
const jwtAdmin = require("../../../middlewares/jwtAdmin.middleware");

const router = express.Router();
router.use(jwtAdmin.authenticateTokenFromHeader);

router
  .route("/")
  .get(publishers.findAll)
  .post(validation.createPublisherValidation, publishers.create);

router
  .route("/:publisherID")
  .get(publishers.findOne)
  .put(validation.createPublisherValidation, publishers.update)
  .delete(publishers.delete);

module.exports = router;
