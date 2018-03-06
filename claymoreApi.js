const NetcatClient = require('node-netcat').client;

let claymoreApi = {
	getRigData: (ip, successHandler, errorHandler) => {
		let client = NetcatClient(3333, ip);
		client.on('error', errorHandler);
		client.send('{"id":0,"jsonrpc":"2.0","method":"miner_getstat1"}', true, successHandler);
		client.start();
	}
};

module.exports = claymoreApi;

