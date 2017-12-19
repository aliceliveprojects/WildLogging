//module definition
(function() {
	'use strict';

	angular
		.module('app.locations', [
		])
    .factory('locationsSrvc', locationsSrvc);

  locationsSrvc.$inject = [
    '$ionicPlatform',
    '$q',
    '$timeout'
  ];
  function locationsSrvc(
    $ionicPlatform,
    $q,
    $timeout
  ) {
    var service = {};
    

    service.getMarkers = function(postcode){
      var deferred = $q.defer();

      $timeout(function(){
        //after 3 seconds return an array of event items
        deferred.resolve(
          [
            {
              postcode: "M15GD",
              location: 
              {
                lat: 53.471528,
                long: -2.241224
              },
              date: '156687654356'
            },
            {
              postcode: "M15GD",
              location: 
              {
                lat: 53.473528,
                long: -2.243224
              },
              date: '156687654356'
            },
            {
              postcode: "M15GD",
              location: 
              {
                lat: 53.469528,
                long: -2.243224
              },
              date: '156687654356'
            },
            {
              postcode: "M15GD",
              location: 
              {
                lat: 53.469525,
                long: -2.243225
              },
              date: '156687654356'
            },
            {
              postcode: "M15GD",
              location: 
              {
                lat: 53.46952,
                long: -2.24322
              },
              date: '156687654356'
            },
            {
              postcode: "M15GD",
              location: 
              {
                lat: 53.46,
                long: -2.24
              },
              date: '156687654356'
            }
          ]
        )
      }, 3000)

      return deferred.promise
    }
    return service;
  }
})();