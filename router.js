var express = require('express');
var fileController = require('./controllers/file-controller');

var router = express.Router();

router.use('/', fileController);

module.exports = router;
