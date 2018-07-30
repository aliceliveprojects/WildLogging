(function() {
	'use strict';

	angular
		.module('app.searchState', [
			'ionic',
      'app.connectionError'
		])
		.config(function($stateProvider) {
			$stateProvider
				.state('search', {
					url: '/search',
					templateUrl: 'scripts/states/search/search.html',
					controller: 'searchCtrl as vm',
          resolve: {
            location: function(locationsSrvc) {
              locationsSrvc.getBrowserLocation();
            },
            postcode: function() {
              locationsSrvc.getBrowserLocation(locationsSrvc)
                .then(function (position){ locationsSrvc.locationToPostcode(position); } );
            }
          },
					cache: false
				});
		});
})();
