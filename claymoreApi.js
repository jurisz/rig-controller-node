const NetcatClient = require('node-netcat').client;

let claymoreApi = {
	getRigData: (ip, successHandler, errorHandler) => {
		let client = NetcatClient(3333, ip, {timeout: 5000});
		client.on('error', errorHandler);
		client.on('data', successHandler);
		client.start();
		client.send('{"id":0,"jsonrpc":"2.0","method":"miner_getstat1"}', true);
	}
};

module.exports = claymoreApi;

