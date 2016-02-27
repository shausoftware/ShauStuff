var shaustuff = function() {

    var css;
    var cssRed;
    var cssGreen;
    var cssBlue;

    var deviceSize = "lg";

    var currentContentPage = "/html/home.html";

    var initialiseSite = function() {

        // first check if canvas supported
        if (!isCanvasSupported()) {
            // no point in continuing as browser can't handle content
            location.replace("/html/oldbrowser.html");
        }

        // get bootstrap device size
        deviceSize = $('#device-size').find('div:visible').first().attr('id');

        // check if user has a page in session (if they refreshed page)
        var sessionPage = sessionStorage.getItem("CURRENT_PAGE");
        if (sessionPage !== null) {
            currentContentPage = sessionPage;
        }

        loadContent(currentContentPage);
        loadCurrentCssColour();
    };

    var isCanvasSupported = function() {
        var elem = document.createElement('canvas');
        return !!(elem.getContext && elem.getContext('2d'));
    };

    var getDeviceSize = function() {
        return deviceSize;
    };

    var loadCurrentCssColour = function() {

        css = $("#csscolour").val();
        cssRed = $("#cssred").val();
        cssGreen = $("#cssgreen").val();
        cssBlue = $("#cssblue").val();

        initColourPicker();
        setLogoColour();

        shauGL.init(cssRed, cssGreen, cssBlue);
    };

    var loadContent = function(htmlPage) {

        // if we are moving away from the homepage the we must stop slideshow
        // thread
        if ("/html/home.html" !== htmlPage) {
            if ("/html/home.html" === currentContentPage) {
                shauslider.stopSlideshowThread();
            }
        }

        sessionStorage.setItem("CURRENT_PAGE", htmlPage);
        currentContentPage = htmlPage;
        $("#content").load(htmlPage);
        updateMenu(htmlPage);
        shauGL.setCurrentPage(htmlPage);
    };

    var initColourPicker = function() {

        // hs colour map
        var hsMapCanvas = document.getElementById("hsmapcanvas");
        var hsMapContext = hsMapCanvas.getContext("2d");

        var hsGradientCanvas = document.getElementById("hsgradientcanvas");
        var hsGradientContext = hsGradientCanvas.getContext("2d");

        var colourButton = document.getElementById("colourbutton");
        var colourText = document.getElementById("colourvalue");

        // load colour map image
        var img = new Image();
        img.onload = function() {
            hsMapContext.drawImage(img, 0, 0);
        };
        img.src = "/images/hs.png";

        // gradient
        fillHSGradient(hsGradientContext, css);
        fillColourButton(colourText, colourButton, css);

        // get colour at pixel from colour map
        hsMapCanvas.onmousedown = function(event) {

            var rect = hsMapCanvas.getBoundingClientRect();
            var mouseX, mouseY;

            mouseX = event.clientX - rect.left;
            mouseY = event.clientY - rect.top;

            var c = hsMapContext.getImageData(mouseX, mouseY, 1, 1).data;

            // update gradient
            var hexColour = getHexColour(c[0], c[1], c[2]);

            // save to temporary values
            // they will be saved to web session when change colour button
            // clicked
            cssRed = c[0];
            cssGreen = c[1];
            cssBlue = c[2];

            fillHSGradient(hsGradientContext, hexColour);
            fillColourButton(colourText, colourButton, hexColour);
        };

        // get colour at pixel from gradient
        hsGradientCanvas.onmousedown = function(event) {

            var rect = hsGradientCanvas.getBoundingClientRect();
            var mouseX, mouseY;

            mouseX = event.clientX - rect.left;
            mouseY = event.clientY - rect.top;

            var c = hsGradientContext.getImageData(mouseX, mouseY, 1, 1).data;

            // update gradient
            var hexColour = getHexColour(c[0], c[1], c[2]);

            // save to temporary values
            // they will be saved to web session when change colour button
            // clicked
            cssRed = c[0];
            cssGreen = c[1];
            cssBlue = c[2];

            fillColourButton(colourText, colourButton, hexColour);
        };
    };

    var fillHSGradient = function(ctx, colour) {

        var gradient = ctx.createLinearGradient(0, 0, 0, 50);

        gradient.addColorStop(0, "white");
        gradient.addColorStop(0.5, colour);
        gradient.addColorStop(1, "black");

        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, 15, 50);
    };

    var fillColourButton = function(colourText, colourButton, colour) {

        colourButton.style.background = colour;
        colourText.value = colour;
    };

    var getHexColour = function(red, green, blue) {

        var hexColour = "#";
        var hr = red.toString(16);
        var hg = green.toString(16);
        var hb = blue.toString(16);

        while (hr.length < 2) {
            hr = "0" + hr;
        }
        while (hg.length < 2) {
            hg = "0" + hg;
        }
        while (hb.length < 2) {
            hb = "0" + hb;
        }

        hexColour += hr + hg + hb;

        return hexColour;
    };

    this.setLogoColour = function() {

        var shauLogoCanvas = document.getElementById("shaulogocanvas");
        var shauLogoContext = shauLogoCanvas.getContext("2d");
        var shauLogoImg = new Image();

        shauLogoImg.onload = function() {
            shauLogoContext.drawImage(shauLogoImg, 0, 0, 350, 90);
            var shauLogoImgData = shauLogoContext.getImageData(0, 0, 350, 90);
            var dataLength = shauLogoImgData.data.length;
            for (var i = 0; i < dataLength; i += 4) {
                if (shauLogoImgData.data[i] > 140 && shauLogoImgData.data[i + 1] > 140 && shauLogoImgData.data[i + 2] > 140) {
                    shauLogoImgData.data[i] = cssRed;
                    shauLogoImgData.data[i + 1] = cssGreen;
                    shauLogoImgData.data[i + 2] = cssBlue;
                }
            }
            shauLogoContext.putImageData(shauLogoImgData, 0, 0);
        };

        shauLogoImg.src = "/images/wabbit.png";
    };

    var updateMenu = function(htmlPage) {

        // reset active links
        $("#menuHome").removeAttr("class");
        $("#menuForm3D").removeAttr("class");
        $("#menuJuliaSet").removeAttr("class");
        $("#menuVirtualTrigger").removeAttr("class");
        $("#menuMap").removeAttr("class");
        $("#menuLinks").removeAttr("class");

        // set as active
        if ("/html/home.html" === htmlPage) {
            $("#menuHome").attr("class", "active");
        } else if ("/html/form3d.html" === htmlPage) {
            $("#menuForm3D").attr("class", "active");
        } else if ("/html/shaujulia.html" === htmlPage) {
            $("#menuJuliaSet").attr("class", "active");
        } else if ("/html/shauvt.html" === htmlPage) {
            $("#menuVirtualTrigger").attr("class", "active");
        } else if ("/html/map.html" === htmlPage) {
            $("#menuMap").attr("class", "active");
        } else if ("/html/links.html" === htmlPage) {
            $("#menuLinks").attr("class", "active");
        }
    };

    var updateSiteCss = function() {

        var colourVal = $("#colourvalue").val();

        // update page css and save to server session
        var updateCssUrl = "/updatecss?colourvalue=" + encodeURIComponent(colourVal);
        window.location = updateCssUrl;
    };

    return {
        loadContent : loadContent,
        initialiseSite : initialiseSite,
        updateSiteCss : updateSiteCss,
        getDeviceSize : getDeviceSize
    };

}();