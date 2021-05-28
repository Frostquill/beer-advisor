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
  console.log("click worked");
//   push the waypoints as an object into a new arr
  waypnts.push({
    location: waypointInput,
    stopover: true,
  });
});
$("#searchBtn").on("click", function () {
  startingInput = $("#startingInput").val();
  destinationInput = $("#destinationInput").val();

  console.log(startingInput, destinationInput);
  renderDirectionOnMap(startingInput, destinationInput);
});
