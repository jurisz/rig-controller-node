//run node gipo-test.js

const fs = require('fs');
const rpiGpio = require('rpi-gpio');

fs.watch('./', () => {
	console.log("do not exit");
});

const PIN = 12;

pinOn = () => {
	rpiGpio.setup(PIN, rpiGpio.DIR_OUT, () => {
		rpiGpio.write(PIN, true);
	});
};

pinOff = () => {
	rpiGpio.write(PIN, false);
};

pinOnOffFor1Min = () => {
	pinOn();
	setTimeout(() => {
			pinOff();
			setTimeout(() => {
					pinOnOffFor1Min();
				},
				60 * 1000);
		},
		60 * 1000
	);
};

pinOnOffFor1Min();
