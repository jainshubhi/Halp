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
					if(loadCount===0) {
						connect1();
						connect2();
					}
				}
        document.body.appendChild(script);
    };

		loadScript('/modules/core/js/socket.io.js');
		loadScript('/modules/core/js/easyrtc/easyrtc.js');
		loadScript('/modules/core/js/demo_instant_messaging.js');
		loadScript('/modules/core/js/demo_audio_video_simple.js');

		// Stream test controller logic
		// ...
	}
]);
