let rigState = require('./rigStateData');

const log4js = require('./logger');
const log = log4js.getLogger('fanController');
const request = require('request');

let fanController = {
	isFanOn: false
};

switchFanOn = (onOff) => {
	fanController.isFanOn = onOff;
	rpiGpio.setup(rigState.FAN_GPIO_PIN, rpiGpio.DIR_OUT, () => {
		rpiGpio.write(rigState.FAN_GPIO_PIN, onOff);
	});
};

fanController.process = () => {
	//read ThingSpeak last room temperature => {"field1":"21.40000","created_at":"2018-03-28T06:34:10Z","entry_id":5421}

	request(rigState.THING_SPEAK_TEMPERATURE_FIELD_URL, (err, res, body) => {
		if (err) {
			log.error("Thing speak query error: " + err);
			return
		}

		try {
			let data = JSON.parse(body);
			let roomTemp = Number(data.field1);
			log.info('Read TS room temperature: ' + roomTemp);

			if (fanController.isFanOn && roomTemp < rigState.FAN_STOP_TEMPERATURE) {
				switchFanOn(false);
			} else if (!fanController.isFanOn && roomTemp > rigState.FAN_START_TEMPERATURE) {
				switchFanOn(true);
			}
		} catch (error) {
			log.error('Error on processing TS response', error);
		}
	});
};

module.exports = fanController;
