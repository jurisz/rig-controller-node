const fs = require('fs');
const log4js = require('./logger');
const log = log4js.getLogger('rigWatchdog');

let rigState = {
	//how long to wait in waring, or restart state before next action 
	IP: '192.168.2.160',
	GPU_COUNT: 2,
	SCHEDULER_RUN_MINUTES: 5,
	POWER_GPIO_PIN: 12,
	STATE_MINUTES: 15,
	POWER_OFF_MINUTES: 5,
	STATS_FILE: 'gpu-stats.data',

	GPU_HIGH_TEMPERATURE: 72,
	GPU_LOW_HASH: 27000,

	warningStartedTime: null,
	restartedTime: null,

	schedulerExecuteCounter: 0,
	gpuLowHashCount: [],
	warningStateCount: 0,
	restartCount: 0,

	stateOk: () => {
		rigState.warningStartedTime = null;
		rigState.restartedTime = null;
	},

	incrementGpuLowHashCount: gpuId => {
		if (rigState.gpuLowHashCount[gpuId]) {
			rigState.gpuLowHashCount[gpuId]++;
		} else {
			rigState.gpuLowHashCount[gpuId] = 1;
		}
	},

	initGpuLowHashCount: () => {
		for (let i = 0; i < rigState.GPU_COUNT; i++) {
			rigState.gpuLowHashCount[i] = 0;
		}
	},

	initStatsFile: () => {
		let file = __dirname + "/" + rigState.STATS_FILE;
		fs.access(file, (err) => {
			if (err) {
				let header = 'time';
				for (let i = 0; i < rigState.GPU_COUNT; i++) {
					header += ',hash' + i + ',temp' + i + ',fan' + i;
				}
				fs.appendFile(file, header, function (err) {
					if (err) {
						log.error('error on writing file:' + err);
					}
				});
			}

		});
	},

	writeStats: gpuStats => {
		if (gpuStats.length != rigState.GPU_COUNT) {
			log.error('unexpected data length: %d', gpuStats.length);
			return;
		}
		let line = new Date().toISOString();
		for (let stat of gpuStats) {
			line += ',' + stat.hash + ',' + stat.temp + ',' + stat.fan;
		}

		let file = __dirname + "/" + rigState.STATS_FILE;
		fs.appendFile(file, '\n' + line, function (err) {
			if (err) {
				log.error('error on writing file:' + err);
			}
		});
	}

};

rigState.initGpuLowHashCount();
rigState.initStatsFile();

module.exports = rigState;
