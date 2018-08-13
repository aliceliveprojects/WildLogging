(function () {
  'use strict';

  angular
    .module('app.homeState')
    .controller('homeCtrl', homeCtrl);

  homeCtrl.$inject = [
    '$ionicPlatform',
    '$scope',
    '$timeout',
    '$q',
    'locationsSrvc',
    'speciesSrvc',
    '$state',
    '$ionicSideMenuDelegate'
  ];

  function homeCtrl(
      $ionicPlatform,
      $scope,
    $timeout,
    $q,
    locationsSrvc,
    speciesSrvc,
      $state,
      $ionicSideMenuDelegate
  ) {
    var vm = angular.extend(this, {
    });

    vm.homeForm={};//{postcode:""};
    vm.postcodeValidator = locationsSrvc.POSTCODE_VALIDATION_REGEX;

    vm.hardwareBackButton = $ionicPlatform.registerBackButtonAction(function() {
        //called when hardware back button pressed
    }, 100);

    $scope.$on('$destroy', vm.hardwareBackButton);

    //Controller below
    vm.toggleLeftMenu = function() {
      $ionicSideMenuDelegate.toggleLeft();
    };

    vm.goSearch = function() {
      $state.go('search');
    };

    vm.goAbout = function() {
      $state.go('about');
    };

    vm.getLocation = function() {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
      }
    };

    vm.handleFormSubmit = function handleFormSubmit(e) {
      window.alert("postcode: "+vm.homeForm.postcode);
      console.log("e:",e);
      //e.event.preventDefault();
    };

    //    vm.speciesList = ["aaa","bbb","ccc"];

    vm.getSpecies = function getSpecies(partial) {
      var defer = $q.defer();
      speciesSrvc.getSuggestedSpeciesNames( partial ).then(
        function gotSpeciesNames( results ) {
          defer.resolve(results);
        },
        function gotSpeciesNamesError( error ) {
          console.log( "error, somehow" );
          defer.reject( error );
        }
      );
      return defer.promise;
    };

    vm.postcodeChange = function postcodeChange() {
      console.log("postcode errors: ", vm.homeForm );
      console.log("postcode now "+vm.homeForm.postcode);
    };

    vm.getPostcodes = function getPostcodes(partial) {
      var defer = $q.defer();
      locationsSrvc.getPostcodesFromPartial( partial ).then(
        function gotPostcodes( results ) {
            defer.resolve( results );
          },
          function error( error ) {
            console.log("getPostcodes: error ",error);
            defer.reject( error );
          }
        ).catch(function(e){
          console.log("EXCEPTION",e);
          return[];
        });
      return defer.promise;
    };

//    vm.validatePostcodeKeypress = function validatePostcodeKeypress(a,b,c) {
//      console.log(a,b,c);
//    };

    ////
    function showPosition(position) {
      window.alert("Latitude: " + position.coords.latitude +
      " Longitude: " + position.coords.longitude);
    }
  }
})();
