const log4js = require('log4js');

log4js.configure({
	appenders: { 
		out: { type: 'stdout', layout: { type: 'basic' } },
		app: { type: 'file', filename: process.cwd() + '/app.log' }
	},
	categories: { default: { appenders: ['out', 'app'], level: 'info' } }
});

module.exports = log4js;