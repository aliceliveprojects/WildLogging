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
    //
    return service;
  }

})();
