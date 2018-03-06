const claymoreApi = require('./claymoreApi');
let rigState = require('./rigStateData');

const log4js = require('./logger');
const log = log4js.getLogger('rigWatchdog');

let rigWatchdog = {};

warningProcessor = () => {
	log.info("Rig went WARNING state");
};

successProcessor = () => {
	log.info("Rig state OK");
	// rigState.success	
};

let claymoreErrorHandler = () => {
	log.error('rig can\'t be queried');
	warningProcessor();
};

let claymoreSuccessHandler = data => {
	let stateOk = true;
	try {
		let jsonRpc = JSON.parse(data.toString());
		let hashRates = jsonRpc.result[3].split(';');
		if (hashRates.length === rigState.GPU_COUNT) {
			for (i = 0; i < hashRates.length; i++) {
				if (Number(hashRates[i]) < rigState.GPU_LOW_HASH) {
					rigState.gpuLowHashesCount[i]++;
					stateOk = false;
				}
			}
		} else {
			stateOk = false;
		}

		//by some unknown reason no TEMP:FAN data from api 

	} catch (error) {
		stateOk = false;
	}

	if (stateOk) {
		successProcessor();
	} else {
		warningProcessor();
	}

};

rigWatchdog.process = () => {
	//todo check state, may be restarted? 


	claymoreApi.getRigData(rigState.IP, claymoreSuccessHandler, claymoreErrorHandler);

};

module.exports = rigWatchdog;

