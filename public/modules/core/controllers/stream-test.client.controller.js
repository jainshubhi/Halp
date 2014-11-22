'use strict';

angular.module('core').controller('StreamTestController', ['$scope',
	function($scope) {
		var loadCount = 0;
		var loadScript = function (file) {
        var script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = file;
				loadCount++;
				script.onload = function() {
					loadCount--;
					if(loadCount==0) {
						connect();
					}
				}
        document.body.appendChild(script);
    }

		var selfEasyrtcid = "";


		function connect() {
		  easyrtc.setVideoDims(640,480);
		  easyrtc.setRoomOccupantListener(convertListToButtons);
		  easyrtc.easyApp("easyrtc.audioVideoSimple", "selfVideo", ["callerVideo"], loginSuccess, loginFailure);
		 }


		function clearConnectList() {
		  var otherClientDiv = document.getElementById("otherClients");
		  while (otherClientDiv.hasChildNodes()) {
		    otherClientDiv.removeChild(otherClientDiv.lastChild);
		  }
		}


		function convertListToButtons (roomName, data, isPrimary) {
		  clearConnectList();
		  var otherClientDiv = document.getElementById("otherClients");
		  for(var easyrtcid in data) {
		    var button = document.createElement("button");
		    button.onclick = function(easyrtcid) {
		      return function() {
		        performCall(easyrtcid);
		      };
		    }(easyrtcid);

		    var label = document.createTextNode(easyrtc.idToName(easyrtcid));
		    button.appendChild(label);
		    otherClientDiv.appendChild(button);
		  }
		}


		function performCall(otherEasyrtcid) {
		  easyrtc.hangupAll();

		  var successCB = function() {};
		  var failureCB = function() {};
		  easyrtc.call(otherEasyrtcid, successCB, failureCB);
		}


		function loginSuccess(easyrtcid) {
		  selfEasyrtcid = easyrtcid;
		  document.getElementById("iam").innerHTML = "I am " + easyrtc.cleanId(easyrtcid);
		}


		function loginFailure(errorCode, message) {
		  easyrtc.showError(errorCode, message);
		}


		loadScript('/modules/core/js/socket.io.js');
		loadScript('/modules/core/js/easyrtc/easyrtc.js');
		loadScript('/modules/core/js/demo_audio_video_simple.js');

		connect();
		// Stream test controller logic
		// ...
	}
]);
