function filterBy() {
  jQuery("#left-sidebar").empty();
  var leftSideBarEl = document.getElementById("left-sidebar");
  var titleFilterBy = document.createElement("div");
  titleFilterBy.classList.add("txt", "title-filterby");
  titleFilterBy.innerText = "Filter by:";
  leftSideBarEl.appendChild(titleFilterBy);
  var byRadiusContainer = document.createElement("div");
  leftSideBarEl.append(byRadiusContainer);
  byRadiusContainer.id = "by-radius-container";
  var byRadius = document.createElement("input");
  byRadius.type = "range";
  byRadius.min = "1";
  byRadius.max = "250";
  byRadius.value = "125";
  byRadius.classList.add("slider");
  byRadius.id = "by-radius";
  var valueSlider = document.createElement("div");
  valueSlider.id = "value-slide";
  valueSlider.innerText = byRadius.value + "km from me";
  byRadius.oninput = function () {
    valueSlider.innerHTML = this.value + "km from me";
  };
  byRadiusContainer.append(valueSlider);
  byRadiusContainer.append(byRadius);
  var setRadiusButton = createButton("SET");
  setRadiusButton.addEventListener("click", setRadiusOnClick);
  byRadiusContainer.append(setRadiusButton);

  setOpenNowFilter(leftSideBarEl);

  var filterButton = createButton("FILTER");
  filterButton.id = "filter-button";
  filterButton.addEventListener("click", onClickFilterButton);
  leftSideBarEl.appendChild(filterButton);
}

function onClickFilterButton() {
  if (markersArray.length == 0) return;
  markersArray.forEach((marker) => {
    marker.setVisible(true);
  });
  if (filterByObj.radius) {
    markersArray.forEach((marker) => {
      if (filterByObj.radius) {
        var dist = getDistance(currentLocationObj, {
          lat: marker.internalPosition.lat(),
          lng: marker.internalPosition.lng(),
        });
        if (dist > filterByObj.radius) marker.setVisible(false);
      }
    });
  }
}

function windowOnClick(options) {
  // Close the dropdown menu if the user clicks outside of it
  window.onclick = function (event) {
    if (!event.target.matches("#drop-down-button")) {
      if (options.classList.contains("show")) {
        options.style.display = "none";
        options.classList.remove("show");
      }
    }
  };
}

function setOptionDropDown(text) {
  var option = document.createElement("a");
  option.classList.add("txt");
  option.href = "#";
  option.innerText = text;
  option.addEventListener("click", () => {
    var buttonEl = document.querySelector("#drop-down-button");
    buttonEl.innerText = option.innerText;
  });
  return option;
}

function setOpenNowFilter(leftSidebar) {
  var openNowContainer = document.createElement("div");
  openNowContainer.id = "by-opennow-container";
  leftSidebar.appendChild(openNowContainer);
}

function setRadiusOnClick() {
  if (!isAlreadySetCurrentLocation) {
    window.alert("must set current location first!");
    return;
  }
  filterByObj.radius = parseFloat(document.querySelector("#by-radius").value);
  if (jQuery("#by-radius-container .already-set").length > 0) {
    jQuery("#by-radius-container .already-set")[0].innerText =
      filterByObj.radius + "km has set!";
    return;
  }
  let radius = document.createElement("div");
  radius.classList.add("already-set", "txt");
  radius.innerText = filterByObj.radius + "km has set!";
  jQuery("#by-radius-container")[0].append(radius);
}
