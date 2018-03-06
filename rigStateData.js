
let rigState = {
	//how long to wait in waring, or restart state before next action 
	IP: '192.168.2.109',
	GPU_COUNT: 2,
	
	STATE_MINUTES: 15,
	
	GPU_HIGH_TEMPERATURE: 72,
	GPU_LOW_HASH: 27000,
	
	warningStartedTime: undefined,
	restartedTime: undefined,
	
	schedulerExecuteCounter: 0,
	gpuLowHashesCount: []
};

module.exports = rigState;
