let selectedBreweryArr = [];
let waypnts = [];
let duplicate = false;
function getBreweries() {
    fetch(
        "https://api.openbrewerydb.org/breweries/search?query=" +
            $("#search").val()
    )
        .then(function (response) {
            return response.json();
        })
        .then(function (response) {
            console.log(response[0]);
            if (response[0] !== undefined) {
                // initialize variables
                let breweryName, breweryStreet, breweryCity, breweryState;

                // populate variables with corrosponding JSON property values
                let breweryPool = [...response];

                // debugger;

                for (var i = 0; i < 6 - selectedBreweryArr.length; i++) {
                    let randomArrIndex = Math.floor(
                        Math.random() * breweryPool.length
                    );
                    if (breweryPool[randomArrIndex].street !== null) {
                        breweryName = breweryPool[randomArrIndex].name;
                        breweryStreet = breweryPool[randomArrIndex].street;
                        breweryCity = breweryPool[randomArrIndex].city;
                        breweryState = breweryPool[randomArrIndex].state;
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
                    } else {
                        i--;
                    }
                }
            } else {
                $("#search").val("No Breweries Found! Try Again!");
                setTimeout(function () {
                    $("#search").val("");
                    return;
                }, 3000);
            }
        });
}
// show modal
$("body").on("click", "#next", function () {
    $("#myModal").css("display", "inherit");
});
// hide modal
$("body").on("click", "#close", function () {
    $("#myModal").css("display", "none");
});
$("#checkbox").change(function () {
    if ($(this).is(":checked")) {
        $("#end").css("display", "none");
    } else {
        $("#end").css("display", "inherit");
    }
});
$("#nextTwo").on("click", function () {
    auditCheckMark();
    $("#myModal").css("display", "none");
});
$("#selections-container").on("click", ".material-icons", function () {
    if ($(this).text() === "add") {
        let breweryObject = {
            name: $(this).parent().siblings(".breweryName").text(),
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
        loadWaypoints($(this));
        selectedBreweryArr.push(breweryObject);
        $(this).text("check").addClass("checkMark");
        localStorage.setItem("breweries", JSON.stringify(selectedBreweryArr));
    } else {
        for (var i = 0; i < selectedBreweryArr.length; i++) {
            if (
                $(this).parent().siblings(".breweryName").text() ===
                selectedBreweryArr[i].name
            ) {
                selectedBreweryArr.splice(i, 1);

                localStorage.setItem(
                    "breweries",
                    JSON.stringify(selectedBreweryArr)
                );
            }
        }
        for (var i = 0; i < waypnts.length; i++) {
            let locationString = `${$(this)
                .parent()
                .siblings("#breweryAddress")
                .children("#breweryStreet")
                .text()} ${$(this)
                .parent()
                .siblings("#breweryAddress")
                .children("#breweryCity")
                .text()} ${$(this)
                .parent()
                .siblings("#breweryAddress")
                .children("#breweryState")
                .text()}`;
            if (locationString === waypnts[i].location) {
                waypnts.splice(i, 1);
            }
        }
        $(this).text("add").removeClass("checkMark");
    }
    return;
});
function loadWaypoints(card) {
    duplicate = false;
    let waypoint = {
        // name: $(this).parent().siblings(".breweryName").text(),
        location: `${$(card)
            .parent()
            .siblings("#breweryAddress")
            .children("#breweryStreet")
            .text()} ${$(card)
            .parent()
            .siblings("#breweryAddress")
            .children("#breweryCity")
            .text()} ${$(card)
            .parent()
            .siblings("#breweryAddress")
            .children("#breweryState")
            .text()}`,
        stopover: true,
    };
    verifyNoDup(waypoint);
    if (!duplicate) {
        waypnts.push(waypoint);
    }
}
function verifyNoDup(waypoint) {
    for (let i = 0; i < waypnts.length; i++) {
        if (waypnts[i].location === waypoint.location) {
            return (duplicate = true);
        } else {
            duplicate = false;
        }
    }
}
function savedBreweryLoad() {
    duplicate = false;
    let storage = JSON.parse(localStorage.getItem("breweries"));
    $("#selections-container").empty();
    if (storage !== null) {
        selectedBreweryArr = storage;
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
            let locationObj = {
                location: `${storage[i].street} ${storage[i].city} ${storage[i].state}`,
                stopover: true,
            };
            verifyNoDup(locationObj);
            if (!duplicate) {
                waypnts.push(locationObj);
            }
        }
    }
}
let map;
// initial the map on DOM
function initMap() {
    map = new google.maps.Map(document.getElementById("map"), {
        center: { lat: 34.0523523, lng: -118.2435731 },
        zoom: 8,
    });
}
// routing map
let startingInput, destinationInput, waypointInput;

// pull out objects from array
function auditCheckMark() {
    if ($("#checkbox").is(":checked")) {
        renderDirectionOnMap($("#start").val(), $("#start").val());
    } else {
        renderDirectionOnMap($("#start").val(), $("#end").val());
    }
}

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
    duplicate = false;
    savedBreweryLoad();

    getBreweries();
    // startingInput = $("#startingInput").val();
    // destinationInput = $("#destinationInput").val();

    // renderDirectionOnMap(startingInput, destinationInput);
});
savedBreweryLoad();
