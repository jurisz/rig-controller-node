var express = require('express');
var router = express.Router();
var rigState = require('../rigStateData');

/* GET home page. */
router.get('/', function (req, res, next) {
	res.render('index', {
		title: 'Mining rig monitoring',
		schedulerExecuteCounter: rigState.schedulerExecuteCounter,
		rigState: rigState
	});
});

module.exports = router;
