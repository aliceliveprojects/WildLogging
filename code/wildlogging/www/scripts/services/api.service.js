// api interface module
// see https://trello.com/c/KOPeRLUa/67-api-module
//
(function() {
  'use strict';

  angular
    .module('app.api', [])
    .factory('speciesSrvc', speciesSrvc)
    .factory('sightingsSrvc', sightingsSrvc)
  //.factory('locationsSrvc', locationsSrvc)
  ;

  // speciesSrvc
  speciesSrvc.$inject = [
    '$ionicPlatform',
    '$q',
    '$timeout'
  ];
  function speciesSrvc(
    $ionicPlatform,
    $q,
    $timeout
  ) {
    var service = {};
    service.baseRestletUrl = "https://theurbanwild.restlet.net:443/v1/";

    // methods as per https://trello.com/c/3sLYXMgq/64-species-service

    service.getSuggestedSpeciesNames = function getSuggestedSpeciesNames( searchTerms ) {
      var requestUrl = "";

      var cleanedSearchTerms = searchTerms.replace(/\W/g,'') // regex out all non alphanumeric characters
 
      if( searchTerms.length>0 ) {
        requestUrl = "https://www.itis.gov/ITISWebService/jsonservice/searchForAnyMatch?srchKey=" + cleanedSearchTerms;
      }
      if( requestUrl !== "" ) {
        $http.get( requestUrl )
          .success( function (data, status, headers, config ) ) {
            console.log(data);
            // names can be extracted from data.commonNames[].commonName
            var names = data.commonNames.filter( function(value, index, array){
              return (value.language==="English");
            } ).map( function(item){
              return item.commonName;
            } );
          }
      };
      
    };

    service.getRegisteredSpecies = function getRegisteredSpecies( speciesName ) {
      var defer = $q.defer;

      var endpointUri = service.baseRestletURL + "thing/"+speciesName;

      $http( {
        method: "GET",
        url: endpointUri,
      } ).then(function getSpeciesSuccess(data, status, headers, config ) {
        console.log( "getSpeciesSuccess", data );
        defer.resolve( data );
      }, function getSpeciesFailure( error ) {
        console.log( "getSpeciesFailure", data );
        defer.reject( error )
      } );
      return defer.promise;
    };

    // inserts a species based on name. Should not create duplicate ites
    service.registerSpecies = function registerSpecies( speciesName ) {
      var defer = $q.defer;

      var endpointUri = service.baseRestletURL + "things/";
      var payload = {
        "name": speciesName
      };
      $http( {
        method: "POST",
        url: endpointUri,
        data: payload
      } ).then(function registerSpeciesSuccess(data, status, headers, config ) {
        console.log( "registerSpeciesSuccess", data );
        defer.resolve( data );
      }, function registerSpeciesFailure( error ) {
        console.log( "registerSpeciesFailure", data );
        defer.reject( error )
      } );
      return defer.promise;
    };

    //
    return service;
  }

  // sightingsSrvc
  sightingsSrvc.$inject = [
    '$ionicPlatform',
    '$q',
    '$timeout'
  ];
  function sightingsSrvc(
    $ionicPlatform,
    $q,
    $timeout
  ) {
    var service = {};

    service.getSightings = function ( postcode, dateFrom, dateTo, thingsReference ) {
      
    };

    service.registerSighting = function registerSighting( postcode, location, thingsRefrence ) {
      
    }

    //
    return service;
  }

})();
