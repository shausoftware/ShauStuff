var shaujuliaset = function() {

    var MAX_ITERATIONS = 300;
    var SMALL_INCREMENT = 1;
    var LARGE_INCREMENT = 10;
    var MIN_ZOOM = 1;
    var MAX_ZOOM = 100;

    var zoom = 1;

    var initJuliaSet = function() {
        setControlState();
        renderJuliaSet();
    };

    var smallZoomOut = function() {
        zoom = zoom - SMALL_INCREMENT;
        if (zoom < MIN_ZOOM) {
            zoom = MIN_ZOOM;
        }
        setControlState();
        renderJuliaSet();
    };

    var largeZoomOut = function() {
        zoom = zoom - LARGE_INCREMENT;
        if (zoom < MIN_ZOOM) {
            zoom = MIN_ZOOM;
        }
        setControlState();
        renderJuliaSet();
    };

    var smallZoomIn = function() {
        zoom = zoom + SMALL_INCREMENT;
        if (zoom > MAX_ZOOM) {
            zoom = MAX_ZOOM;
        }
        setControlState();
        renderJuliaSet();
    };

    var largeZoomIn = function() {
        zoom = zoom + LARGE_INCREMENT;
        if (zoom > MAX_ZOOM) {
            zoom = MAX_ZOOM;
        }
        setControlState();
        renderJuliaSet();
    };

    var setControlState = function() {

        // display current zoom level
        $("#currentzoom").text(zoom);

        // reset controls
        $("#smallzoomout").removeAttr("disabled");
        $("#largezoomout").removeAttr("disabled");
        $("#smallzoomin").removeAttr("disabled");
        $("#largezoomin").removeAttr("disabled");

        // disable controls if zoom at extremes
        if (zoom === 1) {
            $("#smallzoomout").attr("disabled", "disabled");
            $("#largezoomout").attr("disabled", "disabled");
        }
        if (zoom === 100) {
            $("#smallzoomin").attr("disabled", "disabled");
            $("#largezoomin").attr("disabled", "disabled");
        }
    };

    var renderJuliaSet = function() {

        // get current width of client
        var wrapperWidth = $("#juliasetwrapper").width();
        var canvasHeight = parseInt(wrapperWidth / 1.333);

        // get the html canvas we are drawing on
        var canvas = $("#shauJuliaSetCanvas")[0];
        // set canvas width and height
        canvas.width = wrapperWidth;
        canvas.height = canvasHeight;

        var canvasCtx = canvas.getContext("2d");

        var imageData = canvasCtx.createImageData(canvas.width, canvas.height);
        var width = imageData.width;
        var height = imageData.height;

        var real;
        var complex;

        // Shape of the Julia Set
        real = -0.7;
        complex = 0.27015;

        var newReal = 0;
        var newComplex = 0;
        var oldReal = 0;
        var oldComplex = 0;

        for (var i = 0; i < height; i++) {
            for (var j = 0; j < width; j++) {

                // using pixel location calculate the initial real and imaginary
                // part of z
                newReal = 1.5 * (j - width / 2) / (0.5 * zoom * width);
                newComplex = (i - height / 2) / (0.5 * zoom * height);

                // julia set stuff
                var z = 0;
                for (z = 0; z < MAX_ITERATIONS; z++) {

                    // remember iteration values
                    oldReal = newReal;
                    oldComplex = newComplex;

                    // transform for real and complex parts
                    newReal = oldReal * oldReal - oldComplex * oldComplex + real;
                    newComplex = 2 * oldReal * oldComplex + complex;
                    // has point spun outside circle with radius 2
                    if ((newReal * newReal + newComplex * newComplex) > 4)
                        break;
                }

                // work out a pretty colour
                var rgb = [ 0, 0, 0 ]; // black
                if (z < MAX_ITERATIONS) {
                    var hue = (z % 256) / 256;
                    var rgbf = hsbToRgb(hue, 1, hue);
                    rgb[0] = parseInt(rgbf[0] * 127);
                    rgb[1] = parseInt(rgbf[1] * 127);
                    rgb[2] = parseInt(rgbf[2] * 127);
                }

                // draw pixel
                var index = (j + (i * width)) * 4;
                imageData.data[index + 0] = rgb[0];
                imageData.data[index + 1] = rgb[1];
                imageData.data[index + 2] = rgb[2];
                imageData.data[index + 3] = 255;
            }
        }

        canvasCtx.putImageData(imageData, 0, 0);
    };

    var hsbToRgb = function(hue, saturation, brightness) {

        var r = brightness;
        var g = brightness;
        var b = brightness;

        if (saturation !== 0) {

            var max = brightness;
            var dif = brightness * saturation;
            var min = brightness - dif;

            var h = hue * 360.0;

            if (h < 60.0) {
                r = max;
                g = h * dif / 60.0 + min;
                b = min;
            } else if (h < 120.0) {
                r = -(h - 120.0) * dif / 60.0 + min;
                g = max;
                b = min;
            } else if (h < 180.0) {
                r = min;
                g = max;
                b = (h - 120.0) * dif / 60.0 + min;
            } else if (h < 240.0) {
                r = min;
                g = -(h - 240.0) * dif / 60.0 + min;
                b = max;
            } else if (h < 300.0) {
                r = (h - 240.0) * dif / 60.0 + min;
                g = min;
                b = max;
            } else if (h <= 360.0) {
                r = max;
                g = min;
                b = -(h - 360.0) * dif / 60.0 + min;
            } else {
                r = 0;
                g = 0;
                b = 0;
            }
        }

        return [ r, g, b ];
    };

    return {
        initJuliaSet : initJuliaSet,
        smallZoomOut : smallZoomOut,
        largeZoomOut : largeZoomOut,
        smallZoomIn : smallZoomIn,
        largeZoomIn : largeZoomIn
    };

}();