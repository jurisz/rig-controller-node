let rigState = {
	//how long to wait in waring, or restart state before next action 
	IP: '192.168.2.109',
	GPU_COUNT: 2,
	SCHEDULER_RUN_MINUTES: 5,
	STATE_MINUTES: 15,
	POWER_GPIO_PIN: 12,

	GPU_HIGH_TEMPERATURE: 72,
	GPU_LOW_HASH: 27000,

	warningStartedTime: undefined,
	restartedTime: undefined,

	schedulerExecuteCounter: 0,
	gpuLowHashesCount: [],
	warningStateCount: 0,
	restartCount: 0,

	stateOk: () => {
		this.warningStartedTime = undefined;
		this.restartedTime = undefined;
	}
};

module.exports = rigState;
