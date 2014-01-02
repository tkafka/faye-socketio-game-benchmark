var http = require('http'),
	Faye = require('faye');

var port = 8000;

var server = http.createServer(),
	bayeux = new Faye.NodeAdapter({mount: '/'});

bayeux.attach(server);
server.listen(port);

var serverClient = bayeux.getClient();

var client = new Faye.Client('http://localhost:' + port + '/');

// subscribe

serverClient.subscribe('/messages/server', function (message) {
	console.log('Server: Got a message: ' + message.text);

	serverClient.publish('/messages/client', {
		text: 'Hello from server, I got your message'
	});
});

client.subscribe('/messages/client', function (message) {
	console.log('Client: Got a message: ' + message.text);
});

// send stuff
client.publish('/messages/server', {
	text: 'Hello from client'
});


