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
                                                    text: breweryCity + ", ",
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
// check to see if starting and ending are the same
$("#checkbox").change(function () {
    if ($(this).is(":checked")) {
        $("#end").css("display", "none");
    } else {
        $("#end").css("display", "inherit");
    }
});
// Check to see if they'd like to select order of waypoint
$("#checkboxOrder").change(function () {
    if ($(this).is(":checked")) {
        $("#orderModal").css("display", "inherit");
        arrangeArrStart();
        makeSortable();
    } else {
        $("#orderModal").css("display", "none");
    }
});
$("#doneArrange").on("click", function () {
    $("#orderModal").css("display", "none");
    setWaypoints();
});
$("#nextTwo").on("click", function () {
    auditCheckMark();
    $("#myModal").css("display", "none");
    localStorage.removeItem("breweries");
    savedBreweryLoad();

    let map = document.querySelector("#map");
    map.scrollIntoView();
    waypnts = [];
    selectedBreweryArr = [];
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
        selectedBreweryArr.push(breweryObject);
        $(this).text("check").addClass("checkMark");
        saveBreweries();
        setWaypoints();
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
        setWaypoints();
        $(this).text("add").removeClass("checkMark");
    }
    return;
});
function saveBreweries() {
    localStorage.setItem("breweries", JSON.stringify(selectedBreweryArr));
}
function makeSortable() {
    $("#listGroup").sortable({
        // enable dragging across lists
        scroll: false,
        tolerance: "pointer",
        helper: "clone",
        activate: function (event, ui) {
            $(this).addClass("dropover");
            $(".bottom-trash").addClass("bottom-trash-drag");
        },
        deactivate: function (event, ui) {
            $(this).removeClass("dropover");
            $(".bottom-trash").removeClass("bottom-trash-drag");
        },
        over: function (event) {
            $(event.target).addClass("dropover-active");
        },
        out: function (event) {
            $(event.target).removeClass("dropover-active");
        },
        update: function () {
            var tempArr = [];

            // loop over current set of children in sortable list
            $("#listGroup")
                .children()
                .each(function () {
                    // save values in temp array
                    tempArr.push({
                        name: $(this).children("#bName").text().trim(),
                        street: $(this).children("#bStreet").text().trim(),
                        city: $(this).children("#bCity").text().trim(),
                        state: $(this).children("#bState").text().trim(),
                    });
                    console.log($(this));
                });
            console.log(tempArr);

            // update array on tasks object and save
            selectedBreweryArr = tempArr;
            saveBreweries();
            arrangeArrStart();
        },
    });
}
function setWaypoints() {
    waypnts = [];
    let tempLocal = JSON.parse(localStorage.getItem("breweries"));
    if (!tempLocal) {
        tempLocal = [];
    } else {
        for (let i = 0; i < tempLocal.length; i++) {
            let tempStreet = tempLocal[i].street;
            let tempCity = tempLocal[i].city;
            let tempState = tempLocal[i].state;
            let tempString = tempStreet + " " + tempCity + " " + tempState;
            let waypointObj = {
                location: tempString,
                stopover: true,
            };
            waypnts.push(waypointObj);
        }
    }
}
function arrangeArrStart() {
    $("#listGroup").empty();
    for (let i = 0; i < selectedBreweryArr.length; i++) {
        arrangeArr(
            selectedBreweryArr[i].name,
            selectedBreweryArr[i].street,
            selectedBreweryArr[i].city,
            selectedBreweryArr[i].state,
            i
        );
    }
}
function arrangeArr(bName, bStreet, bCity, bState, index) {
    $("#listGroup").append(
        $("<li>", {
            class: "listGroupItem",
        })
            .append(
                $("<p>", {
                    text: index + 1,
                })
            )
            .append(
                $("<span>", {
                    text: bName,
                    id: "bName",
                })
            )
            .append(
                $("<span>", {
                    text: bStreet,
                    id: "bStreet",
                })
            )
            .append(
                $("<span>", {
                    text: bCity,
                    id: "bCity",
                })
            )
            .append(
                $("<span>", {
                    text: bState,
                    id: "bState",
                })
            )
    );
}

function savedBreweryLoad() {
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
                                        text: storage[i].city + ", ",
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
    let directionService = new google.maps.DirectionsService(),
        directionRenderer = new google.maps.DirectionsRenderer(),
        // what we are sending
        request;
    if ($("#checkboxOrder").is(":checked")) {
        request = {
            origin: origin,
            destination: destination,
            waypoints: waypnts,
            travelMode: "DRIVING",
        };
    } else {
        request = {
            origin: origin,
            destination: destination,
            waypoints: waypnts,
            optimizeWaypoints: true,
            travelMode: "DRIVING",
        };
    }
    directionRenderer.setMap(map);
    directionService.route(request, (result, status) => {
        if (status == "OK") {
            directionRenderer.setDirections(result);
        }
    });
};

$("#search-btn").on("click", function () {
    duplicate = false;
    savedBreweryLoad();

    getBreweries();
    // startingInput = $("#startingInput").val();
    // destinationInput = $("#destinationInput").val();

    // renderDirectionOnMap(startingInput, destinationInput);
});
savedBreweryLoad();
setWaypoints();
