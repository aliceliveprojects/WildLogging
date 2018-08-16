(function() {
	'use strict';

	angular
		.module('app.searchState', [
			'ionic',
      'app.connectionError'
		])
		.config(function($stateProvider) {
			$stateProvider
        .state('searchpostcode', {
          url: '/search/postcode/:postcode',
					templateUrl: 'scripts/states/search/search.html',
					controller: 'searchCtrl as vm',
          params: {
            postcode:"W1T 2PR"
          },
          resolve: {
            location: ['$stateParams','locationsSrvc', function( $stateParams, locationsSrvc )  {
              console.log("HELLO", $stateParams);
              return locationsSrvc.getLocation( $stateParams.postcode );
            }],
            postcode: ['$stateParams','locationsSrvc', function( $stateParams, locationsSrvc )  {
              return;
            }]
          }
        })
        .state('search-latlong', {
          url: '/search/latitude/:latitude/longitude/:longitude',
					templateUrl: 'scripts/states/search/search.html',
					controller: 'searchCtrl as vm',
          params: {
            latitude:null,
            longiude:null
          },
          resolve: {
            postcode: function(locationsSrvc) {
              return locationsSrvc.getPostcodes( {
                latitude:  $state.params.latitude,
                longitude: $state.params.longitude
              }, 100 );
            }
          }
        })
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
                } )
                .catch( function(error) {
                  // this should catch exceptions
                  //alert(error);
                  //o$stateProvider.go('about'); // TODO: should be error
                  return(undefined);
                } )
              ;
            },
          },
					cache: false
				});
		});
})();
