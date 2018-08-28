(function() {
	'use strict';

	angular
		.module('app.homeState', [
			'ionic',
      'toaster',
      'ngAnimate'
		])
		.config(function($stateProvider) {
			$stateProvider
				.state('home', {
					url: '/home',
					templateUrl: 'scripts/states/home/home.html',
					controller: 'homeCtrl as vm',
					cache: false
				});
		});
})();
