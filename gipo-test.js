//run node gipo-test.js

const fs = require('fs');
const rpiGpio = require('rpi-gpio');

fs.watch('./', () => {
	console.log("do not exit");
});

const PIN = 12;

rpiGpio.setup(PIN, rpiGpio.DIR_OUT, () => {
	rpiGpio.write(PIN, true);
});

//switch off relay after 1 min
setTimeout(() => {
		rpiGpio.write(PIN, false);
	},
	60 * 1000
);