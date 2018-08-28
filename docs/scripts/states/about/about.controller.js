(function () {
  'use strict';

  angular
      .module('app.aboutState')
      .controller('aboutCtrl', aboutCtrl);

  aboutCtrl.$inject = [
      '$ionicPlatform',
      '$scope',
      '$timeout',
      '$state'
      ];


  function aboutCtrl(
      $ionicPlatform,
      $scope,
      $timeout,
      $state
  ) {
    var vm = angular.extend(this, {});

    vm.hardwareBackButton = $ionicPlatform.registerBackButtonAction(function() {
        //called when hardware back button pressed
        //vm.cancel();
    }, 100);
    $scope.$on('$destroy', vm.hardwareBackButton);

    //Controller below
    vm.goHome = function(){
        $state.go('home');
    }

}
})();
