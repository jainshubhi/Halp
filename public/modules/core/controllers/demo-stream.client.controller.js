'use strict';

var easyrtc = require('/modules/core/js/easyrtc/easyrtc.js');

angular.module('core').controller('DemoStreamController', ['$scope',
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
			console.log(easyrtc.getRoomFields('default'));
			console.log(easyrtc.getRoomOccupantsAsMap('default'));
			console.log('Here');
		}

		function roomFailure(e, f) {
			console.log('Unable to connect to room: ' + JSON.stringify(e) + ' ' + JSON.stringify(f));
		}

		function start() {
			easyrtc.connect('gavy', connectSuccess, connectFailure);
			/*easyrtc.setOnCall( function(easyrtcid, slot) {
			console.log("call with " + easyrtcid + "established");
			});
			easyrtc.setOnHangup( function(easyrtcid, slot) {
			console.log("call with " + easyrtcid + "ended");
		});*/
		}
	}
]);
