'use strict';

angular.module('core').controller('DemoTransmitController', ['$scope',
	function($scope) {
		var loadCount = 0;
		var loadScript = function (file) {
			var script = document.createElement('script');
			script.type = 'text/javascript';
			script.src = file;
			loadCount++;
			script.onload = function() {
				loadCount--;
				if(loadCount===0) {
					//appInit();
					start();
				}
			}
			document.body.appendChild(script);
		};

		loadScript('/modules/core/js/socket.io.js');
		loadScript('/modules/core/js/easyrtc/easyrtc.js');
		//loadScript('/modules/core/js/demo_multiparty.js');

		var rtcID = null;
		function success(e) {
			rtcID = e;
			console.log('success ' + e);
		}

		function failure(e) {
			console.log('failure: ' + e);
		}

		function start() {
			easyrtc.connect('gavy', success, failure);
		 	easyrtc.getRoomList(
				function(roomList) {
					for(var roomName in roomList){
						console.log("saw room " + roomName);
					}
					if(roomList.length > 0) {
						easyrtc.joinRoom(rootList[0], null, success, failure);
					}
					for(var roomName in roomList){
						console.log("saw room " + roomName);
					}
				},
				function(errorCode, errorText){
					console.log("ERROR" + errorText);
				}
			);
			/*easyrtc.setOnCall( function(easyrtcid, slot) {
				console.log("call with " + easyrtcid + "established");
			});
			easyrtc.setOnHangup( function(easyrtcid, slot) {
				console.log("call with " + easyrtcid + "ended");
			});*/
		}
	}
]);
