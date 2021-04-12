const express = require('express');
const viewController = require('./view.controller');

const router = express.Router();

router.get('/', viewController.checkUser);

module.exports = router;
