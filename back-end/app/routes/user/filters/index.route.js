const express = require("express");
const priceranges = require("../../../controllers/pricerange.controller");
const publishers = require("../../../controllers/publisher.controller");
const categories = require("../../../controllers/category.controller");
const authors = require("../../../controllers/author.controller");
const formalities = require("../../../controllers/formality.controller");

const router = express.Router();

router.route("/priceranges").get(priceranges.findAll);
router.route("/publishers").get(publishers.findAll);
router.route("/categories").get(categories.findAll);
router.route("/authors").get(authors.findAll);
router.route("/formalities").get(formalities.findAll);

module.exports = router;
