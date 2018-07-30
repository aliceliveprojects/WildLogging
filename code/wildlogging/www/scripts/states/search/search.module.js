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
              return locationsSrvc.getBrowserLocation();
            },
            postcode: function(locationsSrvc) {
              locationsSrvc.getBrowserLocation()
                .then(function (position){
                  return locationsSrvc.locationToPostcode(position);
                } );
            }
          },
					cache: false
				});
		});
})();
