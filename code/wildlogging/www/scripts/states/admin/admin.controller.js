(function () {
  'use strict';

  angular
    .module('app.adminState')
    .controller('adminCtrl', adminCtrl)
    .controller('adminAuthCtrl', adminAuthCtrl)
    .controller('adminEventsCtrl', adminEventsCtrl)
  ;

  //-----------------------

  adminCtrl.$inject = [
    '$scope',
    '$state',
    '$log',
    'authenticationService',
    'authenticationNotifyService'
  ];

  function adminCtrl(
    $scope,
    $state,
    $log,
    authenticationService,
    authenticationNotifyService
  ){
    var vm = angular.extend(this, {});
    vm.isAuthenticated = authenticationService.isAuthenticated();
    //--
    vm.login = function () {
      authenticationNotifyService.subscribe('auth0',callback);
      authenticationService.login();
    };

    function callback(){
      $log.log($scope.isAuthenticated);
      //$scope.$apply();
      $state.reload();
    }

    vm.logout = function(){
      authenticationService.logout();
      $state.reload();
    };

    vm.admin = function admin(itemType) {
      console.log("admin a ",itemType);
      $state.go('admin'+itemType.toLowerCase() );
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

  //-----------------------

  adminEventsCtrl.$inject = [
    '$scope',
    '$state',
    'authenticationService',
    'authenticationNotifyService'
  ];

  function adminEventsCtrl(
    $scope,
    $state,
    authenticationService,
    authenticationNotifyService
  ){
    var vm = angular.extend(this, {});

    vm.isAuthenticated = authenticationService.isAuthenticated();

    vm.events = [ ];

    vm.busy = false;

    var updateSightings = function updateSightings(postcode, datafrom, dateto, thingsName) {
      vm.busy = true;
      sightingsSrvc.getSightings().then(
        function updateSightingsSuccess(data) {
          console.log("updateSightingsSuccess: got ",data);
          vm.events.merge(vm.events, data);
          // now remove items in vm.events that were not in vm.data
          // @TODO:
          vm.busy = false;
        },
        function updateSightingsError(error) {
          console.log("updateSightingsError: ", error);
          vm.busy = false;
        }
      );
    }

  }

})();
