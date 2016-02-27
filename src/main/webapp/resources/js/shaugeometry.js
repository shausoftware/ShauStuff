/**
 * This is a small snippet of a JavaScript mapping API that I have been working
 * on over the years
 */
var shaugeometry = function() {

    var SHAU_POINT = 1;
    var HIT_MARGIN = 5;
    var LARGE_HIT_MARGIN = 8;

    var mapWidth;
    var mapHeight;
    var currentBoundsMinX = 0;
    var currentBoundsMaxX = 0;
    var currentBoundsMinY = 0;
    var currentBoundsMaxY = 0;

    var points = [];

    var init = function(width, height) {
        mapWidth = width;
        mapHeight = height;
        clearGeometry();
    };

    var clearGeometry = function() {
        points = [];
    };

    var setCurrentBounds = function(minX, maxX, minY, maxY) {

        currentBoundsMinX = minX;
        currentBoundsMaxX = maxX;
        currentBoundsMinY = minY;
        currentBoundsMaxY = maxY;

        var vLength = points.length;
        for (var i = 0; i < vLength; i++) {
            points[i].changeBounds();
        }
    };

    var getPointGeometries = function() {
        return points;
    };

    var hitTest = function(lat, lng) {

        var hitGeometry = null;

        var tempVertex = new ShauVertex();
        tempVertex.setMapPosition(lng, lat);
        var x = tempVertex.getScreenX();
        var y = tempVertex.getScreenY();

        // check for hits on points
        var vLength = points.length;
        for (var i = 0; i < vLength; i++) {
            if (points[i].hitTest(x, y)) {
                hitGeometry = points[i];
                break;
            }
        }

        return hitGeometry;
    };

    var createPoint = function(id, x, y, metadata) {

        var xy = checkCollision(x, y);

        var newPoint = new ShauPoint();
        newPoint.createMapPoint(xy[0], xy[1]);

        newPoint.setMetadata(metadata);

        points.push(newPoint);
    };

    var checkCollision = function(x, y) {

        var xy = [ x, y ];

        var vLength = points.length;
        for (var i = 0; i < vLength; i++) {
            var vertex = points[i].getVertices();
            if (x == vertex.getMapX() && y == vertex.getMapY()) {
                // recursively check
                xy = checkCollision(x, parseFloat(y) + parseFloat(0.0003));
            }
        }

        return xy;
    };

    var ShauPoint = function() {

        /* SPECIAL CASE - NO VECTORS IN POINT, JUST A SINGLE VERTEX */
        var geometryType = SHAU_POINT;
        var geometry;
        var metadata;

        var getGeometryType = function() {
            return geometryType;
        };
        var getVertices = function() {
            return geometry;
        };

        var setMetadata = function(md) {
            metadata = md;
        };
        var getMetadata = function() {
            return metadata;
        };

        var createScreenPoint = function(screenX, screenY) {
            geometry = new ShauVertex();
            geometry.setScreenPosition(screenX, screenY);
        };
        var createMapPoint = function(mapX, mapY) {
            geometry = new ShauVertex();
            geometry.setMapPosition(mapX, mapY);
        };

        var hitTest = function(screenX, screenY) {
            return geometry.hitTest(screenX, screenY, LARGE_HIT_MARGIN);
        };

        var changeBounds = function() {
            geometry.boundsChanged();
        };

        return {
            getGeometryType : getGeometryType,
            getVertices : getVertices,
            setMetadata : setMetadata,
            getMetadata : getMetadata,
            createScreenPoint : createScreenPoint,
            createMapPoint : createMapPoint,
            hitTest : hitTest,
            changeBounds : changeBounds
        };
    };

    var ShauVertex = function() {

        var screenX = 0;
        var screenY = 0;
        var mapX = 0;
        var mapY = 0;

        // set position based on screen coordinates
        var setScreenPosition = function(x, y) {

            screenX = x;
            screenY = y;

            // calculate map coordinates
            mapX = currentBoundsMinX + ((screenX / mapWidth) * (currentBoundsMaxX - currentBoundsMinX));
            mapY = currentBoundsMinY + ((mapHeight - screenY) / mapHeight) * (currentBoundsMaxY - currentBoundsMinY);
        };

        // set position based on OS map coordinates
        var setMapPosition = function(x, y) {

            mapX = x;
            mapY = y;

            // calculate screen co-ordinates
            screenX = ((mapX - currentBoundsMinX) / (currentBoundsMaxX - currentBoundsMinX)) * mapWidth;
            screenY = mapHeight - (((mapY - currentBoundsMinY) / (currentBoundsMaxY - currentBoundsMinY)) * mapHeight);
        };

        // update screen positions when bounds changed
        var boundsChanged = function() {

            // map coordinates don't change so osX & osY stay as is
            // calculate new screen co-ordinates
            screenX = ((mapX - currentBoundsMinX) / (currentBoundsMaxX - currentBoundsMinX)) * mapWidth;
            screenY = mapHeight - (((mapY - currentBoundsMinY) / (currentBoundsMaxY - currentBoundsMinY)) * mapHeight);
        };

        // hit test
        var hitTest = function(x, y, margin) {

            if (x > (screenX - margin) && x < (screenX + margin)) {
                if (y > (screenY - margin) && y < (screenY + margin)) {
                    return true;
                }
            }

            return false;
        };

        var getScreenX = function() {
            return screenX;
        };
        var getScreenY = function() {
            return screenY;
        };

        var getMapX = function() {
            return mapX;
        };
        var getMapY = function() {
            return mapY;
        };

        var setScreenX = function(x) {
            screenX = x;
        };
        var setScreenY = function(y) {
            screenY = y;
        };

        var setMapX = function(x) {
            mapX = x;
        };
        var setMapY = function(y) {
            mapY = y;
        };

        return {
            setScreenPosition : setScreenPosition,
            setMapPosition : setMapPosition,
            boundsChanged : boundsChanged,
            hitTest : hitTest,
            getScreenX : getScreenX,
            getScreenY : getScreenY,
            getMapX : getMapX,
            getMapY : getMapY,
            setScreenX : setScreenX,
            setScreenY : setScreenY,
            setMapX : setMapX,
            setMapY : setMapY
        };
    };

    return {
        init : init,
        clearGeometry : clearGeometry,
        setCurrentBounds : setCurrentBounds,
        getPointGeometries : getPointGeometries,
        hitTest : hitTest,
        createPoint : createPoint,
        ShauPoint : ShauPoint,
        ShauVertex : ShauVertex
    };

}();