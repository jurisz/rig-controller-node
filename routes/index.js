var express = require('express');
var router = express.Router();
var rigState = require('../rigStateData');

/* GET home page. */
router.get('/', function (req, res, next) {
	let x = 1111;
	res.render('index', {
		title: 'Sensor server on node.js',
		schedulerExecuteCounter: rigState.schedulerExecuteCounter, 
		xxx: x
	});
});

module.exports = router;
