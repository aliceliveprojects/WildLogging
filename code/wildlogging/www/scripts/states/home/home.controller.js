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
      
    vm.hardwareBackButton = $ionicPlatform.registerBackButtonAction(function() {
        //called when hardware back button pressed
    }, 100);
    $scope.$on('$destroy', vm.hardwareBackButton);

    //Controller below
    vm.toggleLeftMenu = function() {
      $ionicSideMenuDelegate.toggleLeft();
    }
    vm.goSearch = function() {
      $state.go('search')
    }
    vm.goAbout = function() {
      $state.go('about')
    }
    vm.getLocation = function() {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
      } 
    }
    function showPosition(position) {
      window.alert("Latitude: " + position.coords.latitude + 
      " Longitude: " + position.coords.longitude); 
    }
  }
})();
