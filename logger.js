const log4js = require('log4js');

let logLevel = process.env.NODE_ENV === 'dev' ? 'debug' : 'info'

log4js.configure({
	appenders: { 
		out: { type: 'stdout', layout: { type: 'basic' } },
		app: { type: 'file', filename: process.cwd() + '/app.log' }
	},
	categories: { default: { appenders: ['out', 'app'], level: logLevel } }
});

module.exports = log4js;