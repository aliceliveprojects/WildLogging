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

    service.NO_GEOLOCATION_OBJECT = "No access to geolocation";

    service.getBrowserLocation = function getBrowserLocation() {
      var defer = $q.defer();

      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position){
          defer.resolve(position);
        },function(error){
          defer.reject(error);
        },{timeout:10000});
      } else {
        throw service.NO_GEOLOCATION_OBJECT;
      }

    };

    service.getPostcodes = function getPostcodes(location, radius_m) {

    };

    service.getLocation = function getLocation(postcode) {

    };

    /////

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
        );
      }, 3000);

      return deferred.promise;
    };
    return service;
  }
})();
