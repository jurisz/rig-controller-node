let rigState = {
	//how long to wait in waring, or restart state before next action 
	IP: '192.168.2.129',
	GPU_COUNT: 2,
	SCHEDULER_RUN_MINUTES: 5,
	POWER_GPIO_PIN: 12,
	STATE_MINUTES: 15,
	POWER_OFF_MINUTES: 5,

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
	}
};

rigState.initGpuLowHashCount();

module.exports = rigState;
