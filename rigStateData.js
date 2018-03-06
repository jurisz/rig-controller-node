
let rigState = {
	//how long to wait in waring, or restart state before next action 
	STATE_MINUTES: 15,
	
	GPU_HIGH_TEMPERATURE: 72,
	GPU_LOW_HASH: 27000,
	
	warningStartedTime: undefined,
	restartedTime: undefined,
	
	schedulerExecuteCounter: 0,
};

module.exports = rigState;
