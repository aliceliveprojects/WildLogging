(function () {
  'use strict';

  angular
    .module('app.homeState')
    .controller('homeCtrl', homeCtrl);

  homeCtrl.$inject = [
    '$ionicPlatform',
    '$scope',
    '$timeout',
    'locationsSrvc',
    '$state',
    '$ionicSideMenuDelegate'
  ];

  function homeCtrl(
      $ionicPlatform,
      $scope,
      $timeout,
      locationsSrvc,
      $state,
      $ionicSideMenuDelegate
  ) {
    var vm = angular.extend(this, {
    });

    vm.homeForm={postcode:""};
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

    vm.postcodeChange = function postcodeChange() {
      console.log("postcode errors: ", vm.homeForm );
      console.log("postcode now "+vm.homeForm.postcode);
    };

    vm.getPostcodes = function getPostcodes(partial) {
      return ["aaa","bbb","ccc","ddd","eee","fff","ggg"];
      console.log("getting postcodes for "+partial);
      locationsSrvc.getPostcodesFromPartial( partial ).then(
        function gotPostcodes( payload ) {
          console.log("got postcode payload of ",payload);
          console.log("returning ",payload.data.result);



          return payload.data.result
            .reduce( function(acc,obj){console.log("acc:",acc); return acc.concat(obj.postcode);}, [] );
        },
        function error( error ) {
          console.log("getPostcodes: error ",error);
        }
      );
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
