'use strict';
var easyrtc = require('/modules/core/js/easyrtc/easyrtc.js');

angular.module('core').controller('DemoTransmitController', ['$scope',
	function($scope) {
		var rtcID = null;
		function connectSuccess(e) {
			rtcID = e;
			console.log('Connected to easyRTC Server (' + e + ')');

			easyrtc.getRoomList(
				function(roomList) {
					var rooms = [];
					for(var roomName in roomList) {
						console.log('Found Room: ' + roomName);
						rooms.push(roomName);
					}
					if(rooms.length > 0) {

						console.log('Connecting to Room: ' + 'room123');
						easyrtc.joinRoom('room123', null, roomSuccess, roomFailure);
					}
				},
				function(errorCode, errorText) {
					console.log('ERROR' + errorText);
				}
			);
		}

		function connectFailure(e) {
			console.log('Unable to connect to easyRTC Server: ' + e);
		}

		function roomSuccess(e) {
			console.log('Connected to Room: ' + e);
		}

		function roomFailure(e, f) {
			console.log('Unable to connect to room: ' + JSON.stringify(e) + ' ' + JSON.stringify(f));
		}

		function start() {
			easyrtc.connect('gavy', connectSuccess, connectFailure);
		}
	}
]);
