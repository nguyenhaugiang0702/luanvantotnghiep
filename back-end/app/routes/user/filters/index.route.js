const express = require("express");
const findAll = require("../../../controllers/user/filter/index.filter"); 

const router = express.Router();

router.route("/priceranges").get(findAll.findAllPriceRanges);
router.route("/publishers").get(findAll.findAllPublishers);
router.route("/categories").get(findAll.findAllCategories);
router.route("/authors").get(findAll.findAllAuthors);
router.route("/formalities").get(findAll.findAllFormalities);

module.exports = router;
