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

/*    vm.homeForm={
      postcode:"",
      species:""
      };*/

    vm.postcode="";
    vm.species="";

    vm.logItButtonDisabled=true;
    vm.searchItButtonDisabled=true;
    vm.isMyLocation = false;
    vm.myPostcode = "";
    vm.postcodeValidator = locationsSrvc.POSTCODE_VALIDATION_REGEX;

    vm.hardwareBackButton = $ionicPlatform.registerBackButtonAction(function() {
        //called when hardware back button pressed
    }, 100);

    $scope.$on( '$stateChangeSuccess', vm.initialiseView );

    $scope.$on( '$destroy', vm.hardwareBackButton);
/*
    $scope.$watch('vm.postcode', function(o,n){
      console.log("postcode CHANGED!!!!!",o,n);
      vm.revalidateForm();
    });
    $scope.$watch('vm.species', function(o,n){
      console.log("species CHANGED!!!!!",o,n);
      vm.revalidateForm();
    });
*/
    //Controller below
    vm.initialiseView = function initialiseView() {
      console.log("INITIALISING VIEW");
      vm.handleIsMyLocation();
    };

    vm.setform = function setform(f){
      console.log("vm.setform - got ",f);
    };

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
      vm.handleSearchIt();
    };

    vm.handleSearchIt = function handleSearchIt() {
      // this is 'search it'
      window.alert("Search It\npostcode: "+vm.postcode+"\nspecies:"+vm.species);
      console.log("e:",e);
    };

    vm.handleLogIt = function handleLogIt() {
      window.alert("Log It\npostcode: "+vm.postcode+"\nspecies:"+vm.species);
    };

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

    vm.revalidateForm = function revalidateForm() {
      console.log("REVALIDATING!", vm.homeForm);
      // search
      console.log(" postcode.$valid==="+vm.homeForm.postcode.$valid);
      if(vm.homeForm.postcode.$valid===true) {
        vm.searchItButtonDisabled=false;
      } else {
        vm.searchItButtonDisabled=true;
      }

      if( vm.myPostcode===vm.postcode) {
        vm.isMyLocation = true;
      } else {
        vm.isMyLocation = false;
      }

      // log
      console.log(" species.$valid==="+vm.homeForm.species.$valid);
      if( (vm.homeForm.species.$valid===true) && (vm.isMyLocation===true) ) {
        vm.logItButtonDisabled=false;
      } else {
        vm.logItButtonDisabled=true;
      }
    };

    ////


    vm.maybeSetPostcodeToHere = function maybeSetPostcodeToHere( newpostcode ) {
      //      if ( !angular.isDefined( vm.postcode ) || ( !vm.homeForm.postcode ) ) {
      //if(vm.postcode.$dirty===false) {
      //if(vm.postcode==="") {
//      if(vm.homeForm.postcode.$pristine) {
//        console.log("homeform pristine");
      vm.myPostcode = newpostcode;
      vm.postcode = newpostcode;
      vm.homeForm.postcode.$setValidity( "postcode", true );
      vm.homeForm.postcode.$valid = true;
      vm.revalidateForm();
      //}
    };

    vm.handleIsMyLocation = function handleIsMyLocation() {
      locationsSrvc.getBrowserLocation().then(
        function gotBrowserLocation( position ){
          console.log("handleIsMyLocation: position = ",position);
          locationsSrvc.locationToPostcode( position, 100, 1 ).then(
            function gotPostcodeFromPosition( results ) {
              console.log( results.result[0] );
              // postcode is in result.postcode
              vm.maybeSetPostcodeToHere( results.result[0].postcode );
            },
            function errorPostcodeFromPosition( error ) {
              console.log(error);
            }
          );
        },
        function errorBrowserLocation( error ){
          alert("errorBrowserLocation:",error);
        }
      );
    };


    ////
/*    function showPosition(position) {
      window.alert("Latitude: " + position.coords.latitude +
      " Longitude: " + position.coords.longitude);
      }*/

    this.$onInit = function onInit() {
      console.log("*******onInit!**********");
      vm.initialiseView();
    };
  }
})();
