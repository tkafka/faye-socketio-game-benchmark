var http = require('http'),
	crypto = require('crypto'),
	utils = require('../utils/utils'),
	Faye = require('faye'),
	socketIoBenchCommon = require('./socketIoBench-common');

var io = require('socket.io').listen(socketIoBenchCommon.port);
io.set('log level',0);

var clients = {};

io.sockets.on('connection', function (socket) {

	socket.on('message', function (data) {
		if (clients.hasOwnProperty(data.id)) {
			clients[data.id].messages++;
			// console.log('Message from ' + data.id + ' received.');
		} else {
			clients[data.id] = {
				socket: socket,
				messages: 0
			};
			// console.log('Client ' + data.id + ' connected.');
		}
	});

	socket.on('disconnect', function (data) {
		// slow but so what
		var clientsDeleted = [];
		utils.objForEach(clients, function(client, id, clients) {
			if (client.socket == socket) {
				delete clients[id];
				clientsDeleted.push(id);
			}
		});

		// console.log('Client ' + clientsDeleted.join(', ') + ' disconnected, removed.');
	});
});


// keep sending
var run = 0;
setInterval(function () {
		io.sockets.emit('message', {
			text: crypto.createHash('sha1').update(crypto.randomBytes(20)).digest('hex'),
			run: run
		});

		var clientCount = Object.keys(clients).length,
			sumMessages = utils.objReduce(clients, function (buf, client, id) {
				return buf + client.messages;
			}, 0);

		console.log('Broadcasting, ' + clientCount + ' clients connected, ' + utils.round2(sumMessages / clientCount) + ' messages from client (avg)');
		run++;
	},
	1000
);