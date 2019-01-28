(function () {
  'use strict';

  angular
    .module('app.adminState')
    .controller('adminCtrl', adminCtrl)
    .controller('adminAuthCtrl', adminAuthCtrl)
  ;

  //-----------------------

  adminCtrl.$inject = [
    '$scope',
    '$state'
  ];

  function adminCtrl(
    $scope,
    $state
  ){
    var vm = angular.extend(this, {});
    vm.isAuthenticated = false;
    //--
    vm.login = function () {
      authenticationNotifyService.subscribe('auth0',callback);
      authenticationService.login();
    };

    function callback(){
      $log.log($scope.isAuthenticated());
      $scope.$apply();
    }

    vm.logout = function(){
      authenticationService.logout();
    };
  }

  //-----------------------

  adminAuthCtrl.$inject = [
    '$scope',
    '$state',
    'authenticationService',
    'authenticationNotifyService'
  ];

  function adminAuthCtrl(
    $scope,
    $state,
    authenticationService,
    authenticationNotifyService
  ){
    var vm = angular.extend(this, {});

    vm.isAuthenticated = authenticationService.isAuthenticated();
  }
})();
