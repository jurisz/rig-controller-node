const claymoreApi = require('./claymoreApi');
let rigState = require('./rigStateData');

const log4js = require('./logger');
const log = log4js.getLogger('rigWatchdog');
const rpiGpio = require('rpi-gpio');

let rigWatchdog = {};

const MILIS_IN_MIN = 60 * 1000;


restartRig = () => {
	rpiGpio.setup(rigState.POWER_GPIO_PIN, gpio.DIR_OUT, () => {
		gpio.write(rigState.POWER_GPIO_PIN, true);
	});

	//switch off relay after 1 min
	setTimeout(() => {
			gpio.write(rigState.POWER_GPIO_PIN, false);
		},
		MILIS_IN_MIN
	);
};

warningProcessor = () => {
	log.info("Rig went WARNING state");
	if (rigState.warningStartedTime) {
		let warningStateMins = Math.round((new Date() - rigState.warningStartedTime) / MILIS_IN_MIN);
		if (warningStateMins >= rigState.STATE_MINUTES) {
			log.info("Have warning state for %s mins, need to restart", warningStateMins);
			rigState.warningStartedTime = undefined;
			rigState.restartCount++;
			rigState.restartedTime = new Date();
			//trigger restart
			//restartRig();
		}
	} else {
		rigState.warningStateCount++;
		rigState.warningStartedTime = new Date();
	}
};

successProcessor = () => {
	log.info("Rig state OK");
	rigState.stateOk();
};

let claymoreErrorHandler = () => {
	log.error('rig can\'t be queried');
	warningProcessor();
};

let claymoreSuccessHandler = data => {
	let stateOk = false;
	try {
		let jsonRpc = JSON.parse(data.toString());
		let hashRates = jsonRpc.result[3].split(';');
		if (hashRates.length === rigState.GPU_COUNT) {
			let badHashCount = 0;
			for (let i = 0; i < hashRates.length; i++) {
				if (Number(hashRates[i]) < rigState.GPU_LOW_HASH) {
					rigState.gpuLowHashesCount[i]++;
					badHashCount++;
				}
			}
			if (badHashCount == 0) {
				stateOk = true;
			}
		}
		//by some unknown reason no TEMP:FAN data from api 
	} catch (error) {
	}

	if (stateOk) {
		successProcessor();
	} else {
		warningProcessor();
	}

};

rigWatchdog.process = () => {
	function isInRestartState() {
		if (rigState.restartedTime) {
			return Math.round((new Date() - rigState.restartedTime) / MILIS_IN_MIN) <= rigState.STATE_MINUTES;
		}
		return false;
	}

	if (isInRestartState()) {
		log.info("In restart mode, lets wait");
		return;
	}

	claymoreApi.getRigData(rigState.IP, claymoreSuccessHandler, claymoreErrorHandler);

};

module.exports = rigWatchdog;

