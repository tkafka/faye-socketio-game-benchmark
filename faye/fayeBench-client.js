var http = require('http'),
	Faye = require('faye'),
	domain = require('domain'),
	crypto = require('crypto'),
	utils = require('../utils/utils'),
	fayeBenchCommon = require('./fayeBench-common');

var clientCount = 5000;

var Clients = utils.createArray(clientCount, function () {
	var client = {
		client: null,
		id: crypto.createHash('sha1').update(crypto.randomBytes(20)).digest('hex'),
		lastRun: 0,
		connected: false,
		responses: 0,
		errors: []
	};

	var d = domain.create();
	d.on('error', function(e) {
		client.errors.push(e);
		console.log(e);
	});
	d.run(function() {
		client.client = new Faye.Client('http://localhost:' + fayeBenchCommon.port + '/', {
			timeout: 30 // should be larger than server timeout
		});

		client.client.subscribe('/public', function (message) {
			client.connected = true;
			client.responses++;
			client.lastRun = message.run;
		});


		// keep sending stuff
		setInterval(function () {
				if (client.connected) {
					client.client.publish('/private/' + client.id, {
						id: client.id,
						text: 'hello'
					});
				}
			},
			4000
		);
	});

	return client;
});

setInterval(function () {
	var result = Clients.reduce(function (buf, c) {
		buf.clientsConnected += (c.connected ? 1 : 0);
		buf.clientsWithResponse += (c.responses > 0 ? 1 : 0);
		buf.clientsWithError += (c.errors.length > 0 ? 1 : 0);
		buf.responses += c.responses;
		if (buf.lastRun.hasOwnProperty(c.lastRun)) {
			buf.lastRun[c.lastRun]++;
		} else {
			buf.lastRun[c.lastRun] = 1;
		}
		return buf;
	}, {
		clientsConnected: 0,
		clientsWithResponse: 0,
		clientsWithError: 0,
		responses: 0,
		lastRun: {}
	});
	console.log(result.clientsConnected + ' connected, ' + result.clientsWithResponse + ' saw response, ' + result.clientsWithError + ' had error, ' + utils.round2(result.responses / result.clientsWithResponse) + ' messages per client');
	console.log(result.lastRun);
}, 1000);
