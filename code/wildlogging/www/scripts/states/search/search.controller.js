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
    '$state',
    // from state.resolve
    'location',
    'postcode'
  ];

  function searchCtrl(
    $ionicPlatform,
    $scope,
    $timeout,
    locationsSrvc,
    $state,
    location,
    postcode
  ) {

    console.log("searchCtrl: location, postcode - ",location,postcode);

    var vm = angular.extend(this, {
    });

    vm.hardwareBackButton = $ionicPlatform.registerBackButtonAction(function() {
        //called when hardware back button pressed
    }, 100);
    $scope.$on('$destroy', vm.hardwareBackButton);

    //Controller below
    var createMap = function( position ) {
      //var latlng = L.latLng(53.471528, -2.241224);
      console.log("createMap: position = ",position);
      var latlng = L.latLng( position.latitude, position.longitude );

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
    var mymap = createMap( location );
    var clusterMarkers = L.markerClusterGroup();

    //vm.postcode = M1 5GD";
    if( angular.isObject( postcode ) === true ) {
      vm.postcode = postcode[ 0 ].postcode;
    } else {
      vm.postcode = "W1T 2PR"; // central london tells us we have the wrong location
      // TRIGGER EXCEPTION / ERROR
    }

    vm.centerMap = function centerMap(){
        createMap(location);
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
