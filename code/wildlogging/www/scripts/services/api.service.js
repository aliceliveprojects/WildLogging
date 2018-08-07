// api interface module
// see https://trello.com/c/KOPeRLUa/67-api-module
//
(function() {
  'use strict';

  angular
    .module('app.api', [ 'restlet.sdk' ])
    .factory('speciesSrvc', speciesSrvc)
    .factory('sightingsSrvc', sightingsSrvc)
  //.factory('locationsSrvc', locationsSrvc)
  ;

  // speciesSrvc
  speciesSrvc.$inject = [
    '$ionicPlatform',
    '$q',
    '$timeout',
    '$sce',
    '$http',
    'theurbanwild'
  ];
  function speciesSrvc(
    $ionicPlatform,
    $q,
    $timeout,
    $sce,
    $http,
    theurbanwild
  ) {
    var service = {};

    service.baseRestletURL = "https://theurbanwild.restlet.net/v1/";

    theurbanwild.configureHTTP_BASICAuthentication( window.urbanwildcredentials.restlet.user, window.urbanwildcredentials.restlet.pass );

    // methods as per https://trello.com/c/3sLYXMgq/64-species-service

    service.getSuggestedSpeciesNames = function getSuggestedSpeciesNames( searchTerms ) {
      var defer = $q.defer();

      var requestUrl = "";

      var cleanedSearchTerms = searchTerms.replace(/\W/g,'') // regex out all non alphanumeric characters

      if( cleanedSearchTerms.length>0 ) {
        requestUrl = "https://www.itis.gov/ITISWebService/jsonservice/searchForAnyMatch?jsonP=JSON_CALLBACK&srchKey=" + cleanedSearchTerms;
      }
      console.log( "species lookup URL: "+requestUrl );
      if( requestUrl !== "" ) {
        console.log( "looking up species: " + searchTerms );
        $http.jsonp( requestUrl , { jsonpCallbackParam: "JSON_CALLBACK" } )
          .then( function (data, status, headers, config ) {
            var names = data.data.anyMatchList.map(
              function(item){
                return item.commonNameList.commonNames.map(
                  function(item){
                    return( item.commonName );
                  } ).reduce(
                    function(a,b) {
                      return( a.push(b) );
                    }
                  );
                  defer.resolve( names );
              } ).filter(
                function( value, index, self ){
                  return( (self.indexOf(value) === index) && (value!==null) );
                }
              );
            console.log( " REDUCED TO: ", names);
          }, function( error ) {
            console.log( "getSuggeestedSpeciesNames error: ", error );
            defer.reject( error );
          } );
      }
      return defer.promise;
    };

    // gets 0 or more species based on name.
/*    service.getRegisteredSpecies = function getRegisteredSpecies( speciesName ) {
      var config = {
        name: speciesName
      };
      console.log( "getRegisteredSpecies: using config of ", config );

      return ( //function xyz() {
        theurbanwild.getThings( config )
          .then(
            function(d){return d.data;},
            function(e){console.log("error:",e); return (e);}
          )
      //}
      );
      };*/
    service.getRegisteredSpecies = function getRegisteredSpecies( speciesName ) {
      var endpointUri = service.baseRestletURL + "things/?name="+speciesName;
      return($http({method:"GET",url:endpointUri}));


      var defer = $q.defer;

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
      var registerSpeciesDoesNotExist = function registerSpeciesDoesNotExist( error ) {
        return theurbanwild.postThings({
          "name": speciesName
        }).then(
          function registerSpeciesFinal( data ) {
            console.log("registerSpecies: created a new ", speciesName );
            return data.data;
          },
          function registerSpeciesFinalError( error ) {
            console.log( "registerSpeciesFinalError: ", error );
            return error;
          }
        );
      };

      return(
        service.getRegisteredSpecies( speciesName ).then(
          function registerSpeciesButExists( data ) {
            if( data.data.length>0 ) {
              console.log("registerSpecies: Species already exists! ", speciesName, data );
              return data.data;
            } else {
              // not in the database
              return registerSpeciesDoesNotExist( {} );
            }
          }
          // also request failure // registerSpeciesDoesNotExist( speciesName )
        )
      );
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
