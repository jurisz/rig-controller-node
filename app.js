var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
let laterCron = require('later');

const log4js = require('./logger');
const log = log4js.getLogger();

let rigState = require('./rigStateData');
let rigWatchdog = require('./rigWatchdog');

var index = require('./routes/index');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
	var err = new Error('Not Found');
	err.status = 404;
	next(err);
});

// error handler
app.use(function (err, req, res, next) {
	// set locals, only providing error in development
	res.locals.message = err.message;
	res.locals.error = req.app.get('env') === 'development' ? err : {};

	// render the error page
	res.status(err.status || 500);
	res.render('error');
});

scheduleLoop = () => {
	rigState.schedulerExecuteCounter++;
	log.info("scheduler executed times %s", rigState.schedulerExecuteCounter);
	rigWatchdog.process();
};

let schedule = laterCron.parse.recur().every(rigState.SCHEDULER_RUN_MINUTES).minute();
let scheduleTimer = laterCron.setInterval(scheduleLoop, schedule);

log.info("app started");

module.exports = app;
