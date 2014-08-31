'use strict';

var express = require('express');
var controller = require('./currentTask.controller');

var router = express.Router();

router.get('/', controller.index);
router.get('/findOne', controller.findOne);
router.get('/find', controller.find);
router.get('/:id', controller.show);
router.post('/', controller.create);
router.put('/:id', controller.update);
router.patch('/:id', controller.update);
router.delete('/:id', controller.destroy);

module.exports = router;
