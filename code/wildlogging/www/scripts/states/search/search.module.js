(function() {
	'use strict';

	angular
		.module('app.searchState', [
			'ionic'
		])
		.config(function($stateProvider) {
			$stateProvider
				.state('search', {
					url: '/search',
					templateUrl: 'scripts/states/search/search.html',
					controller: 'searchCtrl as vm',
					cache: false
				})
		});
})();