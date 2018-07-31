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
                  searchCtrl.errorModalShow=true;
                  return locationsSrvc.locationToPostcode(position);
                } )
                .catch( function(error) {
                  // this should catch exceptions
                  //alert(error);
                  //$stateProvider.go('about'); // TODO: should be error
                  return(undefined);
                } )
              ;
            }
          },
					cache: false
				});
		});
})();
