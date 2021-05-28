let map;

function initMap() {
  map = new google.maps.Map(document.getElementById("map"), {
    center: { lat: -34.397, lng: 150.644 },
    zoom: 8,
  });
}

// Calculate and render direction on the map
const renderDirectionOnMap = (origin, destination) => {
  let directionService = new google.maps.DirectionService(),
    directionRenderer = new google.maps.DirectionRenderer(),
    request = {
      origin: origin,
      destination: destination,
      travelMode: "DRIVING",
    };
    directionRenderer.setMap(map);
    directionService.route(request, (result, status) => {
        if (status == "OK") {
            directionRenderer.setDirections(result);
        }
    })
};

