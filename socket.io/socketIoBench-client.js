var http = require('http'),
	crypto = require('crypto'),
	domain = require('domain'),
	utils = require('../utils/utils'),
	socketIoBenchCommon = require('./socketIoBench-common'),
	io = require('socket.io-client');

var Clients = utils.createArray(socketIoBenchCommon.clientCount, function () {
	var client = {
		socket: io.connect('localhost', {
			port: socketIoBenchCommon.port,
			'force new connection': true
		}),
		id: crypto.createHash('sha1').update(crypto.randomBytes(20)).digest('hex'),
		lastRun: 0,
		connected: false,
		responses: 0,
		intervalId: null,
		errors: []
	};

	var d = domain.create();
	d.on('error', function (e) {
		client.errors.push(e);
		console.log(e);
	});
	d.run(function () {
		client.socket.on('connect', function () {
			client.connected = true;

			clearInterval(client.intervalId);

			// keep sending stuff
			client.intervalId = setInterval(function () {
					client.socket.emit('message', {
						id: client.id,
						text: 'hello'
					});
				},
				4000
			);
		});
		client.socket.on('disconnect', function () {
			client.connected = false;
			clearInterval(client.intervalId);
		});

		client.socket.on('message', function (data) {
			client.lastRun = data.run;
			client.responses++;
		});
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
