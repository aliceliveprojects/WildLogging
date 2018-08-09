// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('starter', [
  'ionic',
  'ngAnimate',
  'mgcrea.ngStrap',
  'ng-datalist',
  'ui-notification',
  'app.homeState',
  'app.searchState',
  'app.aboutState',
  'app.locations',
  'app.api',
  'restlet.sdk'
])
//  .config(function($httpProvider) {
//    //Enable cross domain calls
//    $httpProvider.defaults.useXDomain = true;
//  } )
  .config(function($sceDelegateProvider){
    $sceDelegateProvider.resourceUrlWhitelist([
      'self',
      "https://www.itis.gov/**"
    ]);
  })
  .run(function($ionicPlatform, $state, $rootScope, Notification) {



    $rootScope.$on('$stateChangeError', function (event, toState, toParams, fromState, fromParams, error) {
      event.preventDefault();

      $state.get('about').error = { code: 123, description: 'Exception stack trace' }
      return $state.go('about');
    });

    $ionicPlatform.ready(function() {
      if(window.cordova && window.cordova.plugins.Keyboard) {
        // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
        // for form inputs)
        cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

        // Don't remove this line unless you know what you are doing. It stops the viewport
        // from snapping when text inputs are focused. Ionic handles this internally for
        // a much nicer keyboard experience.
        cordova.plugins.Keyboard.disableScroll(true);
      }
      if(window.StatusBar) {
        StatusBar.styleDefault();
      }

      $state.go("home");
    });
  });

