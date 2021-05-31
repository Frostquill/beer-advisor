function getBreweries() {
  fetch(
    "https://api.openbrewerydb.org/breweries/search?query=" + $("#search").val()
  )
    .then(function (response) {
      return response.json();
    })
    .then(function (response) {
      // initialize variables
      let breweryName, breweryStreet, breweryCity, breweryState;

      // populate variables with corrosponding JSON property values
      let breweryPool = [...response];
      for (var i = 0; i < 6; i++) {
        let randomArrIndex = Math.floor(Math.random() * breweryPool.length);
        breweryName = response[randomArrIndex].name;
        breweryStreet = response[randomArrIndex].street;
        breweryCity = response[randomArrIndex].city;
        breweryState = response[randomArrIndex].state;
        $("#selections-container").append(
          $("<div/>", {
            class: "col s12 m6",
          }).append(
            $("<div/>", {
              class: "card carSel addHover col s12",
              id: `breweryCard${i}`,
            })
              .append(
                $("<span>", {
                  text: breweryName,
                  class: `breweryName${i}`,
                })
              )

              .append(
                $("<a/>", {
                  class:
                    "btn-floating halfway-fab waves-effect waves-light red",
                }).append(
                  $("<i/>", {
                    class: "material-icons",
                    text: "add",
                  })
                )
              )

              .append(
                $("<div/>", {
                  class: "card-content",
                  id: "breweryAddress",
                })
                  .append(
                    $("<p/>", {
                      id: `breweryStreet${i}`,
                      text: breweryStreet,
                    })
                  )
                  .append(
                    $("<span/>", {
                      id: `breweryCity${i}`,
                      text: breweryCity,
                    }),
                    $("<span/>", {
                      id: `breweryState${i}`,
                      text: breweryState,
                    })
                  )
              )
          )
        );
        breweryPool.splice(randomArrIndex, 1);
        console.log(breweryPool);
      }
    });
}
let map;
function initMap() {
  map = new google.maps.Map(document.getElementById("map"), {
    center: { lat: 34.0523523, lng: -118.2435731 },
    zoom: 8,
  });
}
let startingInput, destinationInput, waypointInput;
let waypnts = [];

// Calculate and render direction on the map
const renderDirectionOnMap = (origin, destination) => {
  // fetch the brewery api
  // fetch()
  let directionService = new google.maps.DirectionsService(),
    directionRenderer = new google.maps.DirectionsRenderer(),
    // what we are sending
    request = {
      origin: origin,
      destination: destination,
      waypoints: waypnts,
      travelMode: "DRIVING",
    };
  directionRenderer.setMap(map);
  directionService.route(request, (result, status) => {
    if (status == "OK") {
      directionRenderer.setDirections(result);
    }
  });
};

$("#waypointBtn").on("click", function () {
  waypointInput = $("#waypointInput").val();
  //   push the waypoints as an object into a new arr
  waypnts.push({
    location: waypointInput,
    stopover: true,
  });
  waypointInput = $("#waypointInput").val("");
});
$("#search-btn").on("click", function () {
  getBreweries();
  // startingInput = $("#startingInput").val();
  // destinationInput = $("#destinationInput").val();

  // renderDirectionOnMap(startingInput, destinationInput);
});
