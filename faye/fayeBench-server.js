var http = require('http'),
	crypto = require('crypto'),
	utils = require('../utils/utils'),
	Faye = require('faye'),
	fayeBenchCommon = require('./fayeBench-common');

var server = http.createServer(),
	bayeux = new Faye.NodeAdapter({
		mount: '/',
		timeout: 20
	});

bayeux.attach(server);
server.listen(fayeBenchCommon.port);

var clients = {};

var serverClient = bayeux.getClient();

// subscribe
serverClient.subscribe('/private/**', function (message) {
	if (clients.hasOwnProperty(message.id)) {
		clients[message.id]++;
	} else {
		clients[message.id] = 0;
		// console.log('Client ' + message.id + ' connected');
	}

	// console.log('Server: Got a message: ' + message.text);

	/*
	 serverClient.publish('/messages/client', {
	 text: 'Hello from server, I got your message'
	 });
	 */
});

// keep sending
var run = 0;
setInterval(function () {
		serverClient.publish('/public', {
			text: crypto.createHash('sha1').update(crypto.randomBytes(20)).digest('hex'),
			run: run
		});

		var clientCount = Object.keys(clients).length,
			sumMessages = utils.objReduce(clients, function (buf, messages, id) {
				return buf + messages;
			}, 0);

		console.log(run + ' Broadcasting, ' + clientCount + ' clients shown up, ' + utils.round2(sumMessages / clientCount) + ' messages from client (avg)');
		run++;
	},
	1000
);