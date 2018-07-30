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
    '$http',
    '$timeout'
  ];
  function locationsSrvc(
    $ionicPlatform,
    $q,
    $http,
    $timeout
  ) {
    var service = {};

    service.NO_GEOLOCATION_OBJECT = "No access to geolocation";
    service.BAD_LOCATION_OBJECT = "Bad location object";

    service.getBrowserLocation = function getBrowserLocation() {
      var defer = $q.defer();

      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position){
          defer.resolve(position.coords);
        },function(error){
          defer.reject(error);
        },{timeout:10000});
      } else {
        console.log("locationsSrvc.getBrowserLocation: exception");
        throw service.NO_GEOLOCATION_OBJECT;
      }
      return defer.promise;
    };

    service.locationToPostcode = function locationToPostcode( coords ) {
      var defer  =$q.defer();

      var requestUrl = "";
      if( angular.isObject( coords ) === true  ) {
        if( ( coords.latitude ) && ( coords.longitude ) ) {
          requestUrl = "https://api.postcodes.io/postcodes?lon="+coords.longitude+"&lat="+coords.latitude;
        }
      }
      if(requestUrl !== "") {
        $http.get( requestUrl )
          .success(function (data, status, headers, config ) {
            defer.resolve( data );
          })
          .error(function ( data, status, header, config ) {
            throw( status );
            defer.reject( status );
          });
        return defer.promise;
      };
      throw( service.BAD_LOCATION_OBJECT, coords );
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
