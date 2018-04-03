const claymoreApi = require('./claymoreApi');
let rigState = require('./rigStateData');

const log4js = require('./logger');
const log = log4js.getLogger('rigWatchdog');
const rpiGpio = require('rpi-gpio');

let rigWatchdog = {
	currentGpuStats: []
};

const MILIS_IN_MIN = 60 * 1000;

hardRestartRig = () => {
	rpiGpio.setup(rigState.POWER_GPIO_PIN, rpiGpio.DIR_OUT, () => {
		rpiGpio.write(rigState.POWER_GPIO_PIN, true);
	});

	setTimeout(() => {
			rpiGpio.write(rigState.POWER_GPIO_PIN, false);
		},
		rigState.POWER_OFF_MINUTES * MILIS_IN_MIN
	);
};

softRestartRig = () => {
	claymoreApi.softRestartRig(rigState.IP);
};

warningProcessor = (softRestartPossible) => {
	log.info("Rig went WARNING state");

	if (rigState.warningStartedTime) {
		let warningStateMins = Math.round((new Date() - rigState.warningStartedTime) / MILIS_IN_MIN);
		if (warningStateMins >= rigState.STATE_MINUTES) {
			rigState.warningStartedTime = null;

			if (rigState.softRestartTime == null && softRestartPossible) {
				log.info("Have warning state for %s mins, going to make soft restart", warningStateMins);
				rigState.softRestartTime = new Date();
				rigState.softRestartCount++;
				rigState.addLogMessage("soft restart", rigWatchdog.gpuStats);
				softRestartRig();
			} else {
				log.info("Have warning state for %s mins, need to make hard restart", warningStateMins);
				rigState.softRestartTime = null;
				rigState.restartCount++;
				rigState.restartedTime = new Date();
				rigState.addLogMessage("hard restart", rigWatchdog.gpuStats);
				hardRestartRig();
			}
		}
	} else {
		rigState.warningStateCount++;
		rigState.warningStartedTime = new Date();
		rigState.addLogMessage("warning state", rigWatchdog.gpuStats);
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
	let gpuStats = [];
	rigWatchdog.currentGpuStats = [];
	try {
		let jsonRpc = JSON.parse(data.toString());
		let hashRates = jsonRpc.result[3].split(';');
		if (hashRates.length === rigState.GPU_COUNT) {
			let badHashCount = 0;
			for (let i = 0; i < hashRates.length; i++) {
				let currentHash = Number(hashRates[i]);
				if (currentHash < rigState.GPU_LOW_HASH) {
					rigState.incrementGpuLowHashCount(i);
					badHashCount++;
				}
				gpuStats[i] = {hash: currentHash};
			}
			if (badHashCount == 0) {
				stateOk = true;
			}

			let tempFan = jsonRpc.result[6].split(';');
			if (tempFan.length === 2 * rigState.GPU_COUNT) {
				for (let i = 0; i < rigState.GPU_COUNT; i++) {
					let x = i * 2;
					gpuStats[i].temp = tempFan[x];
					gpuStats[i].fan = tempFan[x + 1];
				}
			}

			if (gpuStats.length == rigState.GPU_COUNT) {
				rigState.writeStats(gpuStats);
				rigWatchdog.gpuStats = gpuStats;
			}
		}
	} catch (error) {
	}

	let softRestartPossible = gpuStats.length > 0;
	if (stateOk) {
		successProcessor();
	} else {
		warningProcessor(softRestartPossible);
	}

};

rigWatchdog.process = () => {
	function isInRestartState() {
		if (rigState.restartedTime) {
			return Math.round((new Date() - rigState.restartedTime) / MILIS_IN_MIN) <= rigState.POWER_OFF_MINUTES * 2;
		}
		if (rigState.softRestartTime) {
			return Math.round((new Date() - rigState.softRestartTime) / MILIS_IN_MIN) <= rigState.POWER_OFF_MINUTES * 2;
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

