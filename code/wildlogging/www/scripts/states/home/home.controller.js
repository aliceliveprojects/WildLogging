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
    'sightingsSrvc',
    '$state',
    '$ionicSideMenuDelegate',
    'toaster'
  ];

  function homeCtrl(
    $ionicPlatform,
    $scope,
    $timeout,
    $q,
    locationsSrvc,
    speciesSrvc,
    sightingsSrvc,
    $state,
    $ionicSideMenuDelegate,
    toaster
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

    vm.handleSearchIt = function handleSearchIt() {
      // this is 'search it'
      //window.alert("Search It\npostcode: "+vm.postcode+"\nspecies:"+vm.species);
      //vm.goSearch( vm.postcode );
      if( vm.postcode ) {
        $state.go('searchpostcode',{ "postcode": vm.postcode });
      }
    };

    vm.handleLogIt = function handleLogIt() {
      //window.alert("Log It\npostcode: "+vm.postcode+"\nspecies:"+vm.species);
      // has to perform https://trello.com/c/QAvEzIPT/57-logging-preparation-process
      // 1. prep the living thing
      // 2. invoke logging process
      //    1. postcode
      //    2. location
      //    3. date
      //    4. living thing reference UUID
      // 3. push to restlet
      // 4. fail?
      // 5. logging feedback
      //    1. postcode
      //    2. living thing reference
      //    3. date
      var livingThing = speciesSrvc.registerSpecies( vm.species ).then( // 1.
        function registeredSpeciesOk( confirmedLivingThing ) {
          console.log(confirmedLivingThing);
          sightingsSrvc.registerSighting( // 2.1 -> 2.4, 3
            vm.postcode,
            vm.location,
            confirmedLivingThing.id
          ).then(
            function registeredSpeciesOkAndPostedSightingOk(success){ // 5
              var now = new Date();
              var dateFromEpoch = now.getTime();
              /*
              dateFrom.setHours(0,0,0,0); // midnight
              var dateTo = new Date();
              dateTo.setHours(23,59,59,9999) */
              var dateToEpoch = dateFromEpoch - ( 24*60*60 );
              sightingsSrvc.getSightings( vm.postcode,
                                          dateFromEpoch,
                                          dateToEpoch,
                                          confirmedLivingThing.id ).then(
                                            function getSightingsOk( payload ) {
                                              // @TODO
                                              toaster.pop('success', "Sighting Logged", 'Your sighting of a <b>'+vm.species+'</b> was successful.',5000, 'trustedHtml', function(toaster) {
                                                //alert("click!");
                                                return true;
                                              } );                                            },
                                            function getSightingsError( error ) {
                                              // @TODO
                                              toaster.pop('error', "Error: Logging Error", 'There was a problem finding similar species recordings; please check <ul><li>You have provided all required information</li><li>You are connected to the internet</li><li>You are not stuck in a captive portal page</li></ul>',0, 'trustedHtml', function(toaster) {
                                                return true;
                                              } );

                                            }
                                          );
            },
            function registeredSpeciesOkButPostedSightingFail(error){ // 4
              toaster.pop('error', "Error: Logging Error", 'There was a problem uploading your sighting; please check <ul><li>You have provided all required information</li><li>You are connected to the internet</li><li>You are not stuck in a captive portal page</li></ul>',0, 'trustedHtml', function(toaster) {
                //alert("click!");
                return true;
              } );
           }
          );
        },
        function registeredSpeciesFail( error ) {
          console.log("registeredSpeciesFail: ",error);
          toaster.pop('error', "Error: Logging Error", 'There was a problem uploading your logging; please check <ul><li>You have provided all required information</li><li>You are connected to the internet</li><li>You are not stuck in a captive portal page</li></ul>',0, 'trustedHtml', function(toaster) {
            //alert("click!");
            return true;
          } );
       }
      );
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
          toaster.pop('error', "Error: Postcode Error", 'There was a problem accesing the Postcodes API; please check your intenet connection',0, 'trustedHtml', function(toaster) {
            //alert("click!");
            return true;
          } );

          return[];
        });
      return defer.promise;
    };

    vm.revalidateForm = function revalidateForm() {
      if(vm.homeForm.postcode.$invalid===true) {
        vm.searchItButtonDisabled=false;
      } else {
        vm.searchItButtonDisabled=true;
      }

      if( vm.myPostcode===vm.postcode) {
        vm.isMyLocation = true;
      } else {
        vm.isMyLocation = false;
      }

      if( ((vm.homeForm.species.$invalid===true)) && (vm.isMyLocation===true) ) {
        vm.logItButtonDisabled=false;
      } else {
        vm.logItButtonDisabled=true;
      }
    };

    ////

    vm.maybeSetPostcodeToHere = function maybeSetPostcodeToHere( newpostcode ) {
      //if(vm.postcode==="") {
      if(vm.homeForm.postcode.$pristine) {
        vm.myPostcode = newpostcode;
        vm.postcode = newpostcode;
        vm.homeForm.postcode.$setValidity( "postcode", true );
        vm.homeForm.postcode.$valid = true;
        vm.revalidateForm();
      }
    };

    vm.handleIsMyLocation = function handleIsMyLocation() {
      locationsSrvc.getBrowserLocation().then(
        function gotBrowserLocation( position ){
          locationsSrvc.locationToPostcode( position, 100, 1 ).then(
            function gotPostcodeFromPosition( results ) {
              // postcode is in result.postcode
              vm.location = {
                "lat":results.result[0].latitude,
                "lon": results.result[0].longitude
              };
              vm.maybeSetPostcodeToHere( results.result[0].postcode );
            },
            function errorPostcodeFromPosition( error ) {
              console.log(error);
            }
          );
        },
        function errorBrowserLocation( error ){
          // @TODO this is the user rejecting browser access
          toaster.pop({
            type: 'error',
            title: "Error: No Location Access",
            body: 'Please grant access to your location in this browser window before trying again.',
            bodyOutputType: 'trustedHtml',
            tapToDismiss: false,
            showCloseButton: true,
            timeout: 0,
            onHideCallback: function (toast) {
              //alert("click!");
              vm.handleIsMyLocation(); // try again!
              return true;
            }
          } );
        }
      );
    };

    this.$onInit = function onInit() {
      vm.initialiseView();
    };
  }
})();
