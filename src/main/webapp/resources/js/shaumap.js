var shaumap = function() {

    var mapDiv;
    var gmap;
    var mapIcons;
    var searchResults;
    var transportStops = [];
    var infoWindowOpening = false;

    var initGMap = function() {

        loadMapIcons();

        var stylesArray = [ {
            featureType : 'poi',
            elementType : 'labels',
            stylers : [ {
                visibility : 'off'
            } ]
        }, {
            featureType : 'transport',
            elementType : 'labels',
            stylers : [ {
                visibility : 'off'
            } ]
        } ];

        var mapOptions = {
            scaleControl : true,
            streetViewControl : false,
            keyboardShortcuts : false,
            center : {
                lat : 51.5072,
                lng : 0.1275
            },
            zoom : 16,
            styles : stylesArray
        };

        mapDiv = document.getElementById('map-div');
        gmap = new google.maps.Map(mapDiv, mapOptions);

        google.maps.event.addListener(gmap, 'idle', gmapIdle);
    };

    var gmapIdle = function() {
        // don't reload map data if event is caused by info window opening
        // it's really annoying especially on mobile
        if (!infoWindowOpening) {
            loadMapData();
        }
    };

    var loadMapData = function() {

        // get current map bounds
        var bounds = gmap.getBounds();
        var boundsWest = bounds.getSouthWest().lng();
        var boundsSouth = bounds.getSouthWest().lat();
        var boundsEast = bounds.getNorthEast().lng();
        var boundsNorth = bounds.getNorthEast().lat();

        // generate kml search url
        var kmlUrl = "/kml/Train%20Station/Bus%20Stop/Hail%20and%20Ride/River%20Boat/Tube%20Station/query?BBOX=";
        kmlUrl = kmlUrl + boundsWest + "," + boundsSouth + "," + boundsEast + "," + boundsNorth;

        $.ajax({
            type : "GET",
            url : kmlUrl,
            dataType : 'xml',
            timeout : 300000,
            success : function(xml) {

                clearGeometry();

                $(xml).find('kml Document Placemark').each(function() {

                    var id = $(this).find('name').text();
                    var coordinates = $(this).find('coordinates').text();
                    var splitCoordinates = coordinates.split(","); // lat,lng
                    var latLng = getMarkerPosition(splitCoordinates[0], splitCoordinates[1]);

                    // geometry metadata
                    var transportStop = new TransportStop();
                    transportStop.setGeometryId(id);
                    transportStop.setLat(latLng[0]);
                    transportStop.setLng(latLng[1]);

                    var extendedData = $(this).find('ExtendedData Data').each(function() {
                        var dataType = $(this).attr('name');
                        if ("stopType" == dataType) {
                            transportStop.setStopType($(this).text());
                        } else if ("stopName" == dataType) {
                            transportStop.setStopName($(this).text());
                        } else if ("stopRoute" == dataType) {
                            transportStop.setStopRoute($(this).text());
                        } else if ("stopId" == dataType) {
                            transportStop.setStopId($(this).text());
                        }
                    });

                    createMarker(latLng[0], latLng[1], transportStop);
                });
            },
            error : function(e) {
                alert("ERROR: ", e);
            },
            done : function(e) {
                alert("DONE");
            }
        });
    };

    var createMarker = function(lat, lng, transportStop) {

        // create marker
        var latLng = new google.maps.LatLng(lat, lng);
        var iconImg = "/images/" + transportStop.getIconKey();
        var marker = new google.maps.Marker({
            position : latLng,
            icon : iconImg
        });

        // create info window
        var infoContent = "<div class='iwcontainer'><div class='iwtitle'><a class='iwtitlelink' href='#' onclick='window.open(\"" + transportStop.getLinkUrl() + "\");' ><b>" + transportStop.getStopName() + "</b></a></div>"
                + "<p class='text-center'><a class='iwcontentlink' href='#' onclick='window.open(\"" + transportStop.getLinkUrl() + "\");'>" + transportStop.getStopRoute() + "</a></p></div>";

        var infowindow = new google.maps.InfoWindow({
            content : infoContent
        });

        marker.addListener('click', function() {
            // stop map data reloading and closing info window
            infoWindowOpening = true;
            setTimeout(function() {
                infoWindowOpening = false;
            }, 1000);
            infowindow.open(gmap, marker);
        });

        // override Google info window css
        // TODO doesn't work too well on mobile and brittle to Google API
        // changes
        // taken from
        // http://en.marnoto.com/2014/09/5-formas-de-personalizar-infowindow.html
        google.maps.event.addListener(infowindow, 'domready', function() {
            var iwOuter = $('.gm-style-iw');
            var iwBackground = iwOuter.prev();
            // Remove the background shadow DIV
            iwBackground.children(':nth-child(2)').css({
                'display' : 'none'
            });
            // Remove the white background DIV
            iwBackground.children(':nth-child(4)').css({
                'display' : 'none'
            });
            // The outline of the tail is composed of two descendants of div
            // which contains the tail.
            // The .find('div').children() method refers to all the div which
            // are direct descendants of the previous div.
            iwBackground.children(':nth-child(3)').find('div').children().css({
                'background-color' : 'black',
                'z-index' : '1'
            });
            // Taking advantage of the already established reference to
            // div .gm-style-iw with iwOuter variable.
            // You must set a new variable iwCloseBtn.
            // Using the .next() method of JQuery you reference the following
            // div to .gm-style-iw.
            // Is this div that groups the close button elements.
            var iwCloseBtn = iwOuter.next();
            iwCloseBtn.css({
                'left' : '200px',
                'top' : '22px'
            });
        });

        marker.setMap(gmap);
        transportStop.setMarker(marker);
        transportStops.push(transportStop);
    };

    var getMarkerPosition = function(lat, lng) {

        var latLng = [ lat, lng ];

        var tsLength = transportStops.length;
        for (var i = 0; i < tsLength; i++) {
            if (transportStops[i].getLat() == lat && transportStops[i].getLng() == lng) {
                // position clashes with another marker - recurse with a new
                // offset
                latLng = getMarkerPosition(parseFloat(lat) + parseFloat(0.00015), lng);
            }
        }

        return latLng;
    };

    var clearGeometry = function() {
        while (transportStops.length) {
            transportStops.pop().getMarker().setMap(null);
        }
    };

    var search = function() {

        var searchParameter = $("#searchParameter").val();

        if (searchParameter !== null && searchParameter.length > 0) {

            // generate kml search url
            var kmlUrl = "/kml/Train%20Station/Bus%20Stop/Hail%20and%20Ride/River%20Boat/Tube%20Station/query?SEARCH_PARAMETER=" + encodeURIComponent(searchParameter);

            $.ajax({
                type : "GET",
                url : kmlUrl,
                dataType : 'xml',
                timeout : 300000,
                success : function(xml) {

                    searchResults = [];

                    $(xml).find('kml Document Placemark').each(function() {

                        var id = $(this).find('name').text();
                        var coordinates = $(this).find('coordinates').text();
                        var splitCoordinates = coordinates.split(","); // lat,
                                                                        // lng

                        // geometry metadata
                        var transportStop = new TransportStop();
                        transportStop.setGeometryId(id);

                        var extendedData = $(this).find('ExtendedData Data').each(function() {
                            var dataType = $(this).attr('name');
                            if ("stopType" == dataType) {
                                transportStop.setStopType($(this).text());
                            } else if ("stopName" == dataType) {
                                transportStop.setStopName($(this).text());
                            } else if ("stopRoute" == dataType) {
                                transportStop.setStopRoute($(this).text());
                            } else if ("stopId" == dataType) {
                                transportStop.setStopId($(this).text());
                            }
                        });

                        var point = new shaugeometry.ShauPoint();
                        // lat = y, lng = x
                        point.createMapPoint(splitCoordinates[1], splitCoordinates[0]);
                        point.setMetadata(transportStop);

                        searchResults.push(point);
                    });

                    displaySearchResults();
                },
                error : function(e) {
                    alert("ERROR: ", e);
                },
                done : function(e) {
                    alert("DONE");
                }
            });
        }
    };

    var displaySearchResults = function() {

        var srLength = searchResults.length;
        if (srLength > 0) {

            var searchResultsHTML = "";

            // reset
            $("#shauresultsrows").css("height", "");
            $("#shauresultsrows").css("overflow-y", "");

            for (var i = 0; i < srLength; i++) {
                var point = searchResults[i];
                var vertex = point.getVertices();
                searchResultsHTML = searchResultsHTML + '<div class="shauresultsrow">';
                searchResultsHTML = searchResultsHTML + '<input type="button" value="Find" class="btn btn-primary btn-sm" onclick="shaumap.findOnMap(' + vertex.getMapY() + ',' + vertex.getMapX() + ');"></input> &nbsp;';
                searchResultsHTML = searchResultsHTML + '<img src="/images/' + point.getMetadata().getIconKey() + '"/> &nbsp;';
                searchResultsHTML = searchResultsHTML + point.getMetadata().getStopName();
                searchResultsHTML = searchResultsHTML + '</div>';
            }

            // height
            $("#shauresultsrows").html(searchResultsHTML);
            if (srLength > 10) {
                $("#shauresultsrows").css("height", "500px");
                $("#shauresultsrows").css("overflow-y", "scroll");
            }

            // width
            var resultsDisplayWidth = "350px";
            var mapWidth = $("#map-div").width();
            if (mapWidth < 410) { // magic 410 = 350 + 30 + 30 borders
                resultsDisplayWidth = parseInt(mapWidth - 60) + "px"; // magic
                                                                        // 60 =
                                                                        // 30 +
                                                                        // 30
                                                                        // borders
            }
            $("#shausearchresults").width(resultsDisplayWidth);

            $("#shausearchresults").css("display", "block");
        }
    };

    var closeSearchResults = function() {
        $("#shausearchresults").css("display", "none");
    };

    var findOnMap = function(lat, lng) {
        gmap.setCenter(new google.maps.LatLng(lat, lng));
        gmap.setZoom(17);
        closeSearchResults();
    };

    var TransportStop = function() {

        var geometryId;
        var lat;
        var lng;
        var marker;
        var stopType;
        var stopName = "";
        var stopRoute = "";
        var stopId;

        var getGeometryId = function() {
            return geometryId;
        };
        var setGeometryId = function(data) {
            geometryId = data;
        };

        var getLat = function() {
            return lat;
        };
        var setLat = function(latitude) {
            lat = latitude;
        };

        var getLng = function() {
            return lng;
        };
        var setLng = function(longitude) {
            lng = longitude;
        };

        var getMarker = function() {
            return marker;
        };
        var setMarker = function(googleMarker) {
            marker = googleMarker;
        };

        var getStopType = function() {
            return stopType;
        };
        var setStopType = function(data) {
            stopType = data;
        };

        var getStopName = function() {
            return stopName;
        };
        var setStopName = function(data) {
            stopName = data;
        };

        var getStopRoute = function() {
            if ("Train Station" == stopType) {
                return "National Rail";
            }
            return stopRoute;
        };
        var setStopRoute = function(data) {
            stopRoute = data;
        };

        var getStopId = function() {
            return stopId;
        };
        var setStopId = function(data) {
            stopId = data;
        };

        var getIconKey = function() {

            var iconKey = "ic_postcode.png"; // default

            if ("Train Station" == stopType) {
                // Overland Train Station
                iconKey = "ic_britishrail.png";
            } else if ("Bus Stop" == stopType) {
                // Bus Stop
                iconKey = "ic_bus.png";
            } else if ("Hail and Ride" == stopType) {
                // Hail and Ride Bus Stop
                iconKey = "ic_hailandride.png";
            } else if ("River Boat" == stopType) {
                // River Boat
                iconKey = "ic_riverboat.png";
            } else if ("Tube Station" == stopType) {
                // Tube Station
                if ("bakerloo" == stopRoute) {
                    iconKey = "ic_bakerloo.png";
                } else if ("central" == stopRoute) {
                    iconKey = "ic_central.png";
                } else if ("circle" == stopRoute) {
                    iconKey = "ic_circle.png";
                } else if ("district" == stopRoute) {
                    iconKey = "ic_district.png";
                } else if ("hammersmith-city" == stopRoute) {
                    iconKey = "ic_hammersmithcity.png";
                } else if ("jubilee" == stopRoute) {
                    iconKey = "ic_jubilee.png";
                } else if ("metropolitan" == stopRoute) {
                    iconKey = "ic_metropolitan.png";
                } else if ("northern" == stopRoute) {
                    iconKey = "ic_northern.png";
                } else if ("piccadilly" == stopRoute) {
                    iconKey = "ic_piccadilly.png";
                } else if ("victoria" == stopRoute) {
                    iconKey = "ic_victoria.png";
                } else if ("dlr" == stopRoute) {
                    iconKey = "ic_dlr.png";
                } else if ("waterloo-city" == stopRoute) {
                    iconKey = "ic_dlr.png";
                }
            }

            return iconKey;
        };

        var getLinkUrl = function() {

            var linkUrl;

            if ("Train Station" === stopType) {
                // Overland Train Station
                // different url for mobile and desktop
                if ("xs" == shaustuff.getDeviceSize() || "sm" == shaustuff.getDeviceSize()) {
                    linkUrl = "http://m.nationalrail.co.uk/pj/ldbboard/dep/" + stopId;
                } else {
                    linkUrl = "http://ojp.nationalrail.co.uk/service/ldbboard/dep/" + stopId;
                }
            } else if ("Bus Stop" === stopType) {
                // Bus Stop
                linkUrl = "http://m.countdown.tfl.gov.uk/arrivals/" + stopId;
            } else if ("Hail and Ride" === stopType) {
                // Hail and Ride Bus Stop
                linkUrl = "http://m.countdown.tfl.gov.uk/arrivals/" + stopId;
            } else if ("River Boat" === stopType) {
                // River Boat
                linkUrl = "http://m.countdown.tfl.gov.uk/arrivals/" + stopId;
            } else if ("Tube Station" === stopType) {
                // Tube Station
                linkUrl = "https://tfl.gov.uk/tube/timetable/" + stopRoute + "?FromId=" + stopId;
            }

            return linkUrl;
        };

        return {
            getGeometryId : getGeometryId,
            setGeometryId : setGeometryId,
            setLat : setLat,
            getLat : getLat,
            setLng : setLng,
            getLng : getLng,
            setMarker : setMarker,
            getMarker : getMarker,
            getStopType : getStopType,
            setStopType : setStopType,
            getStopName : getStopName,
            setStopName : setStopName,
            getStopRoute : getStopRoute,
            setStopRoute : setStopRoute,
            getStopId : getStopId,
            setStopId : setStopId,
            getIconKey : getIconKey,
            getLinkUrl : getLinkUrl
        };
    };

    var loadMapIcons = function() {

        mapIcons = {};

        loadMapIcon("ic_britishrail.png");
        loadMapIcon("ic_bus.png");
        loadMapIcon("ic_hailandride.png");
        loadMapIcon("ic_riverboat.png");
        loadMapIcon("ic_bakerloo.png");
        loadMapIcon("ic_central.png");
        loadMapIcon("ic_circle.png");
        loadMapIcon("ic_district.png");
        loadMapIcon("ic_hammersmithcity.png");
        loadMapIcon("ic_jubilee.png");
        loadMapIcon("ic_metropolitan.png");
        loadMapIcon("ic_northern.png");
        loadMapIcon("ic_piccadilly.png");
        loadMapIcon("ic_victoria.png");
        loadMapIcon("ic_dlr.png");
        loadMapIcon("ic_postcode.png");
    };

    var loadMapIcon = function(iconKey) {

        var pathPrefix = "/images/";

        var icon = new Image();
        icon.onload = function() {
            mapIcons[iconKey] = icon;
        };
        icon.src = pathPrefix + iconKey;
    };

    return {
        initGMap : initGMap,
        search : search,
        closeSearchResults : closeSearchResults,
        findOnMap : findOnMap
    };

}();