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
