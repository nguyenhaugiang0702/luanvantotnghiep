const express = require('express');
const users = require('../controllers/user.controller');

const router = express.Router();

router.route('/')
    .get(users.findALL)
    .post(users.create)
    .delete(users.deleteALL);

router.route('/:id')
    .get(users.findOne)
    .put(users.update)
    .delete(users.delete);

module.exports = router;