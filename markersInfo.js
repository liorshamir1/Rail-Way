var firstInit = false;

function setPlacesInfoArray() {
  markersArray.forEach((marker, index) => {
    places.forEach((place) => {
      if (
        place.geometry.location.lng() == marker.position.lng() &&
        place.geometry.location.lat() == marker.position.lat()
      ) {
        marker.placeId = place.place_id;
        var request = {
          placeId: place.place_id,
          fields: ["opening_hours"],
        };
        if (placesInfo[place.place_id] == undefined) {
          var service = new google.maps.places.PlacesService(map);
          setTimeout(() => {
            service.getDetails(request, (place, status) => {
              if (
                status === google.maps.places.PlacesServiceStatus.OK &&
                place &&
                place.opening_hours
              ) {
                placesInfo[marker.placeId] = place;
              } else if (status == "OVER_QUERY_LIMIT") {
                console.log(status);
              } else if (!place.opening_hours) {
                console.log("this place has not opening_hours");
                console.log(marker.placeId);
                placesInfo[marker.placeId] = false;
              } else if (!place) {
                console.log("place undefined");
                placesInfo[marker.placeId] = false;
              }
            });
          }, 3000);
        }
      }
    });
  });
}

function setMarkersDetails() {
  markersArray.forEach((marker) => {
    places.forEach((place) => {
      if (
        place.geometry.location.lng() == marker.position.lng() &&
        place.geometry.location.lat() == marker.position.lat()
      ) {
        marker.placeId = place.place_id;
      }
    });
  });
}

function dropStationList() {
  if (firstInit) {
    markersArray.forEach((marker) => {
      marker.setVisible(true);
      marker.setAnimation(google.maps.Animation.DROP);
    });

    document.getElementById("clear-markers").disabled = false;
    document.getElementById("favorites").disabled = false;
    document.getElementById("filter").disabled = false;
    document.getElementById("favorites").style.filter = "none";
    document.getElementById("filter").style.filter = "none";
    document.getElementById("drop-button").disabled = true;
    return;
  }
  document.getElementById("drop-button").disabled = true;
  var i = 0;
  stationList.forEach((location) => {
    i++;
    setTimeout(() => {
      var newMarker = new google.maps.Marker({
        position: { lat: location["x"], lng: location["y"] },
        map: map,
        icon: image,
        animation: google.maps.Animation.DROP,
      });
      if (!markersArray.includes(newMarker)) markersArray.push(newMarker);
      places.forEach((place) => {
        var placeID;
        if (
          place.geometry.location.lng() == newMarker.position.lng() &&
          place.geometry.location.lat() == newMarker.position.lat()
        ) {
          placeID = place.place_id;
          var request = {
            placeId: placeID,
            fields: ["ALL"],
          };
          newMarker.addListener("click", () => {
            map.setZoom(12);
            map.setCenter(newMarker.getPosition());
            var service = new google.maps.places.PlacesService(map);
            service.getDetails(request, (place, status) => {
              if (
                status === google.maps.places.PlacesServiceStatus.OK &&
                place &&
                place.geometry &&
                place.geometry.location
              ) {
                getDetailsOnMap(place, newMarker);
              }
            });
          });
        }
      });
    }, i * 50);
  });
  setTimeout(() => {
    document.getElementById("clear-markers").disabled = false;
    document.getElementById("favorites").disabled = false;
    document.getElementById("filter").disabled = false;
    document.getElementById("favorites").style.filter = "none";
    document.getElementById("filter").style.filter = "none";
    setMarkersDetails();
  }, stationList.size * 50);
  firstInit = true;
}

function getDetailsOnMap(place, marker) {
  jQuery("#left-sidebar").empty();
  const content = document.createElement("div");
  content.classList.add("info-box");
  const nameElement = document.createElement("h2");
  nameElement.classList.add("info-title", "txt");
  nameElement.textContent = place.name;
  content.appendChild(nameElement);
  //title
  if (currentLocationObj.hasOwnProperty("lat")) {
    var distFrom = document.createElement("h3");
    distFrom.classList.add("dist-from", "txt");
    distFrom.innerText = `${getDistance(currentLocationObj, {
      lat: place.geometry.location.lat(),
      lng: place.geometry.location.lng(),
    })} km from you!`;
    content.appendChild(distFrom);
  }

  setDetails(place);
  setAddress(place);

  var heartText = document.createElement("div");
  heartText.classList.add("txt");
  heartText.innerText = "Add To Favorites";
  var heartContainer = document.createElement("div");
  heartContainer.classList.add("center-on-page");
  var heartEl = document.createElement("img");
  heartEl.id = "heart";
  heartEl.src = "./Love_Heart_symbol.svg.png";
  if (favoriteStationList.includes(marker)) heartEl.style.filter = "none";
  heartEl.addEventListener(
    "click",
    function () {
      heartOnClick(marker);
    },
    false
  );
  heartContainer.append(heartEl);
  heartContainer.append(heartText);
  content.append(heartContainer);
  infowindow.setContent(content);
  infowindow.open(map, marker);
}

function setAddress(place) {
  if (!place.formatted_address) return;
  if (document.querySelector(".address")) {
    addressEl = document.querySelector(".address");
  } else {
    var addressEl = document.createElement("div");
    addressEl.classList.add("txt", "address");
  }
  addressEl.innerText = "Address: " + place.formatted_address + "\n\n";
  if (!document.querySelector(".address"))
    document.querySelector("#left-sidebar").append(addressEl);
}

function setDetails(place) {
  if (!place) return;
  var clickHereDecreption = document.createElement("div");
  clickHereDecreption.classList.add("txt");
  clickHereDecreption.innerText = "click here";
}
