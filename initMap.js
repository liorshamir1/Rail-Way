window.initMap = initMap;
var service;
var map;

var autocompletePlace;

function searchOnClick() {
  if (markersArray.length == 0) {
    window.alert(`Press 'Find train stations' first!`);
    return;
  }
  var findIt = false;
  markersArray.forEach((marker) => {
    if (marker.placeId == autocompletePlace.place_id) {
      map.setCenter(marker.getPosition());
      map.setZoom(12);
      getDetailsOnMap(autocompletePlace, marker);
      findIt = true;
      return;
    }
  });
  if (!findIt) window.alert("We shows only train stations in IL");
}

function initMap() {
  const telaviv = { lat: 32.06306, lng: 34.784566 };
  const north = { lat: 32.68677579318805, lng: 35.29357881700995 };
  const beerSheva = { lat: 31.252234747279513, lng: 34.7934235632074 };
  const mitzpe = { lat: 30.61070216298595, lng: 34.80249395112934 };
  infowindow = new google.maps.InfoWindow();
  map = new google.maps.Map(document.getElementById("map"), {
    zoom: 8,
    center: telaviv,
  });

  var request = {
    location: telaviv,
    radius: 50000,
    query: "train",
  };
  var service = new google.maps.places.PlacesService(map);
  service.textSearch(request, callback);
  var request = {
    location: north,
    radius: 50000,
    query: "train",
  };
  service.textSearch(request, callback);
  var request = {
    location: beerSheva,
    radius: 50000,
    query: "train",
  };
  service.textSearch(request, callback);
  var request = {
    location: mitzpe,
    radius: 50000,
    query: "train",
  };
  service.textSearch(request, callback);
  try {
    google.maps.event.addDomListener(window, "load", initialize);
  } catch (e) {}
}
function callback(results, status, pagination) {
  if (status == google.maps.places.PlacesServiceStatus.OK) {
    for (var i = 0; i < results.length; i++) {
      var place = results[i];
      places.push(place);
      createStationList(results[i]);
    }
    if (pagination && pagination.hasNextPage) {
      pagination.nextPage();
    } else {
      document.getElementById("drop-button").disabled = false;
      document.getElementsByClassName("lds-ring")[0].style.visibility =
        "hidden";
      document.getElementById("loading").style.visibility = "hidden";
      document.getElementById("drop-button").style.marginTop = "30px";
      document.getElementById("clear-markers").style.marginTop = "30px";
      document.getElementById("my-location").style.marginTop = "30px";
    }
  }
}
