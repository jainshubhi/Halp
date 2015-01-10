'use strict';

angular.module('core').controller('RoomTestController', ['$scope',
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
                        connect();
                    }
                }
        document.body.appendChild(script);
    };

        loadScript('/modules/core/js/socket.io.js');
        loadScript('/modules/core/js/easyrtc/easyrtc.js');
        loadScript('/modules/core/js/roomtest.js');

        // Stream test controller logic
        // ...
    }
]);

