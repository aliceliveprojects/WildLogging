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
          defer.resolve(position);
        },function(error){
          defer.reject(error);
        },{timeout:10000});
      } else {
        throw service.NO_GEOLOCATION_OBJECT;
      }

    };

    service.locationToPostcode = function locationToPostcode( location ) {
      var defer  =$q.defer();
      
      var requestUrl = "";
      if( angular.isObject(location)===true  ) {
        if( (location.hasOwnProperty("lat"))&&(location.hasOwnProperty("lon")) ) {
          requestUrl = "api.postcodes.io/postcodes?lon="+location.lon+"&lat="+location.lat;
        }
      }
      if(requestUrl !== "") {
        $http.get( requestUrl )
          .success(function (data, status, headers, config ) {
            console.log('locationsSrvc.locationToPostcode: success, got ',data);
            defer.resolve( data );
          })
          .error(function ( data, status, header, config ) {
            console.log('locationsSrvc.locationToPostcode: FAILED, ', data, status, header );
            throw( status );
            defer.reject( status );
          });
        return defer.promise;
      };
      throw( service.BAD_LOCATION_OBJECT, location);
    }


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
