let selectedBreweryArr = [];
function getBreweries() {
    fetch(
        "https://api.openbrewerydb.org/breweries/search?query=" +
            $("#search").val()
    )
        .then(function (response) {
            return response.json();
        })
        .then(function (response) {
            // initialize variables
            let breweryName, breweryStreet, breweryCity, breweryState;

            // populate variables with corrosponding JSON property values
            let breweryPool = [...response];
            
            // debugger;
            for (var i = 0; i < 6 - selectedBreweryArr.length; i++) {
                let randomArrIndex = Math.floor(
                    Math.random() * breweryPool.length
                );
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
                            id: `breweryCard`,
                        })
                            .append(
                                $("<span>", {
                                    text: breweryName,
                                    class: `breweryName`,
                                })
                            )

                            .append(
                                $("<a/>", {
                                    class: "btn-floating halfway-fab waves-effect waves-light red",
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
                                            id: `breweryStreet`,
                                            text: breweryStreet,
                                        })
                                    )
                                    .append(
                                        $("<span/>", {
                                            id: `breweryCity`,
                                            text: breweryCity,
                                        }),
                                        $("<span/>", {
                                            id: `breweryState`,
                                            text: breweryState,
                                        })
                                    )
                            )
                    )
                );
                breweryPool.splice(randomArrIndex, 1);
                console.log(breweryPool);
            }
            $("#selections-container").on(
                "click",
                ".material-icons",
                function () {
                    if ($(this).text() === "add") {
                        let breweryObject = {
                            name: $(this)
                                .parent()
                                .siblings(".breweryName")
                                .text(),
                            street: $(this)
                                .parent()
                                .siblings("#breweryAddress")
                                .children("#breweryStreet")
                                .text(),
                            city: $(this)
                                .parent()
                                .siblings("#breweryAddress")
                                .children("#breweryCity")
                                .text(),
                            state: $(this)
                                .parent()
                                .siblings("#breweryAddress")
                                .children("#breweryState")
                                .text(),
                        };
                        selectedBreweryArr.push(breweryObject);
                        $(this).text("check").addClass("checkMark");
                        localStorage.setItem(
                            "breweries",
                            JSON.stringify(selectedBreweryArr)
                        );
                    } else {
                        for (var i = 0; i < selectedBreweryArr.length; i++) {
                            if (
                                $(this)
                                    .parent()
                                    .siblings(".breweryName")
                                    .text() === selectedBreweryArr[i].name
                            ) {
                                selectedBreweryArr.splice(i, 1);
                                localStorage.setItem(
                                    "breweries",
                                    JSON.stringify(selectedBreweryArr)
                                );
                            }
                        }
                        $(this).text("add").removeClass("checkMark");
                    }
                }
            );
        });
}
function savedBreweryLoad() {
    let storage = JSON.parse(localStorage.getItem("breweries"));
    selectedBreweryArr = storage;
    $("#selections-container").empty();
    if (storage !== null) {
        for (var i = 0; i < storage.length; i++) {
            $("#selections-container").append(
                $("<div/>", {
                    class: "col s12 m6",
                }).append(
                    $("<div/>", {
                        class: "card carSel addHover col s12",
                        id: `breweryCard`,
                    })
                        .append(
                            $("<span>", {
                                text: storage[i].name,
                                class: `breweryName`,
                            })
                        )

                        .append(
                            $("<a/>", {
                                class: "btn-floating halfway-fab waves-effect waves-light red",
                            }).append(
                                $("<i/>", {
                                    class: "material-icons checkMark",
                                    text: "check",
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
                                        id: `breweryStreet`,
                                        text: storage[i].street,
                                    })
                                )
                                .append(
                                    $("<span/>", {
                                        id: `breweryCity`,
                                        text: storage[i].city,
                                    }),
                                    $("<span/>", {
                                        id: `breweryState`,
                                        text: storage[i].state,
                                    })
                                )
                        )
                )
            );
        }
    }
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
    savedBreweryLoad();

    getBreweries();
    // startingInput = $("#startingInput").val();
    // destinationInput = $("#destinationInput").val();

    // renderDirectionOnMap(startingInput, destinationInput);
});
savedBreweryLoad();
