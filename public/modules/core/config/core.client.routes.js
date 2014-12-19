'use strict';

// Setting up route
angular.module('core').config(['$stateProvider', '$urlRouterProvider',
	function($stateProvider, $urlRouterProvider) {
		// Redirect to home view when route not found
		$urlRouterProvider.otherwise('/');

		// Home state routing
		$stateProvider.
		state('room-test', {
			url: '/room-test',
			templateUrl: 'modules/core/views/room-test.client.view.html'
		}).
		state('demo-stream', {
			url: '/demo-stream',
			templateUrl: 'modules/core/views/demo-stream.client.view.html'
		}).
		state('demo-transmit', {
			url: '/demo-transmit',
			templateUrl: 'modules/core/views/demo-transmit.client.view.html'
		}).
		state('stream-test', {
			url: '/stream-test',
			templateUrl: 'modules/core/views/stream-test.client.view.html'
		}).
		state('home', {
			url: '/',
			templateUrl: 'modules/core/views/home.client.view.html'
		});
	}
]);
