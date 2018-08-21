(function () {
  'use strict';

  angular
      .module('app.searchState')
      .controller('searchCtrl', searchCtrl);

  searchCtrl.$inject = [
    '$ionicPlatform',
    '$scope',
    '$timeout',
    'locationsSrvc',
    'speciesSrvc',
    'sightingsSrvc',
    '$state',
    '$stateParams',
    // from state.resolve
    'location',
    'postcode'
  ];

  function searchCtrl(
    $ionicPlatform,
    $scope,
    $timeout,
    locationsSrvc,
    speciesSrvc,
    sightingsSrvc,
    $state,
    $stateParams,
    location,
    postcode
  ) {

    console.log("\n\n•• searchCtrl: location, postcode - ",location,postcode);

    var vm = angular.extend(this, {
    });

    vm.hardwareBackButton = $ionicPlatform.registerBackButtonAction(function() {
        //called when hardware back button pressed
    }, 100);
    $scope.$on('$destroy', vm.hardwareBackButton);

/*    sightingsSrvc.registerSighting( "W1T2PR", {lat:1,lon:-0.2}, "2bbd8080-9636-11e8-96a2-632bdefa9a39" ).then(
      function registerSightingsSuccess( data ) {
        console.log("search.controller.js:registerSightingsSuccess", data );
      },
      function registerSightingsError( error ) {
        console.log("search.controller.js:registerSightingsError", error );
      }
    );

    sightingsSrvc.getSightings(  ).then(
      function gotSightings( data ) {
        console.log( data );
      },
      function failedGetSightings( error ) {
        console.log( error );
      }
    );
*/
    //Controller below
    var createMap = function( mapPosition ) {
      //var latlng = L.latLng(53.471528, -2.241224);
      console.log("createMap: position = ",mapPosition);
      var latlng =[ mapPosition.latitude, mapPosition.longitude ];

      var mymap = L.map('mymap', {center: latlng, zoom: 16});

      L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
        attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
        maxZoom: 18,
        id: 'mapbox.streets',
        accessToken: 'pk.eyJ1IjoiYWxpY2VkaWdpdGFsbGFicyIsImEiOiJjamF3YnA1a3UwbWliMnZta3B5b3NpbDBzIn0.39_7KL6gzUbNJEsbeYkpVg'
      }).addTo(mymap);

      return mymap;
    };

    var removeMarker = function(map, marker){
      map.removeLayer(marker);
    };
    var removeAllMarkers = function(){
      mymap.removeLayer(clusterMarkers);
      clusterMarkers = L.markerClusterGroup(); //re-new clusters 
    };

    vm.busy = false;

    console.log("CONTROLLER: location, postcode",location,postcode);

    var mymap = createMap( location );
    var clusterMarkers = L.markerClusterGroup();

    if( angular.isObject( postcode ) === true ) {
      vm.postcode = postcode[ 0 ].postcode;
    } else {
      vm.postcode = "W1T 2PR"; // central london tells us we have the wrong location
      // TRIGGER EXCEPTION / ERROR
    }
    vm.centerMap = function centerMap( location ){
        createMap( location );
    };

    vm.refreshMap = function(postcode) {
      vm.busy = true;
      removeAllMarkers();

      postcode = postcode.replace(/\s+/g, ''); //remove spaces

      locationsSrvc.getMarkers(postcode)
        .then(function(markersList){
          markersList.forEach(function(e,index){

            var marker = L.marker(new L.LatLng(e.location.lat, e.location.long));
            clusterMarkers.addLayer(marker);

          });
          mymap.addLayer(clusterMarkers)
          vm.busy = false;
        });

    };
    vm.clearMap = function(){
      removeAllMarkers();
    };
    vm.goHome = function() {
      $state.go("home");
    };
  }

})();
