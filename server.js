'use strict';
/**
 * Module dependencies.
 */
var init = require('./config/init')(),
	config = require('./config/config'),
	mongoose = require('mongoose'),
	easyrtc = require('easyrtc');

/**
 * Main application entry file.
 * Please note that the order of loading is important.
 */

// Bootstrap db connection
var db = mongoose.connect(config.db, function(err) {
	if (err) {
		console.error('\x1b[31m', 'Could not connect to MongoDB!');
		console.log(err);
	}
});

// Init the express application
var app = require('./config/express')(db);

var server = require('http').createServer(app);

var io = require('socket.io')(server);


// Bootstrap passport config
require('./config/passport')();

// Start EasyRTC server
var rtc = easyrtc.listen(app, io);

// Start the app by listening on <port>
server.listen(config.port);


// Expose app
exports = module.exports = app;

// Logging initialization
console.log('MEAN.JS application started on port ' + config.port);

var WebSocketServer = require('websocket').server;
var http = require('http');

//var server = http.createServer(function(request, response) {
//    console.log((new Date()) + ' Received request for ' + request.url);
//    response.writeHead(404);
//    response.end();
//});
//server.listen(8080, function() {
//    console.log((new Date()) + ' Server is listening on port 8080');
//});

var wsServer = new WebSocketServer({
    httpServer: server,
    // You should not use autoAcceptConnections for production
    // applications, as it defeats all standard cross-origin protection
    // facilities built into the protocol and the browser.  You should
    // *always* verify the connection's origin and decide whether or not
    // to accept it.
    autoAcceptConnections: false
});

function originIsAllowed(origin) {
  // put logic here to detect whether the specified origin is allowed.
  return true;
}

var numConnection = 0;
var connection_list = [];
wsServer.on('request', function(request) {
    if (!originIsAllowed(request.origin)) {
      // Make sure we only accept requests from an allowed origin
      request.reject();
      console.log((new Date()) + ' Connection from origin ' + request.origin + ' rejected.');
      return;
    }

    var connection = request.accept('echo-protocol', request.origin);
    numConnection = numConnection + 1;
    connection_list.push(connection);
    console.log((new Date()) + ' Connection accepted. (' + numConnection.toString() + ' Connections)');
    connection.on('message', function(message) {
        if (message.type === 'utf8') {
            //console.log('Received Message: ' + message.utf8Data);
            connection.sendUTF(message.utf8Data);
        }
        else if (message.type === 'binary') {
            //console.log('Received Binary Message of ' + message.binaryData.length + ' bytes');
            connection.sendBytes(message.binaryData);
        }
        else {
            //console.log('Received Unknown Message of ' + message.binaryData.length + ' bytes');
            connection.sendBytes(message.binaryData);
        }
    });
    connection.on('close', function(reasonCode, description) {
        numConnection = numConnection - 1;
        console.log((new Date()) + ' Peer ' + connection.remoteAddress + ' disconnected. (' + numConnection.toString() + ' Connections)');
        var index = connection_list.indexOf(connection);
        if (index > -1) {
            connection_list.splice(index, 1);
        }
    });
});
