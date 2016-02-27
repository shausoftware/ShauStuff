/**
 * A Slideshow
 */
var shauslider = function() {

    var SLIDESHOW_COLUMNS = 15;
    var SLIDESHOW_ROWS = 10;

    var shauSlideshowWidth = 620;
    var shauSlideshowHeight = 420;
    var shauSegmentWidth = 40;
    var shauSegmentHeight = 40;

    var SHAU_SLIDESHOW_BORDER = 10;
    var IMAGE_DISPLAY_TIME = 10000;

    var transitionFrame; // render frame
    var shauSlideshow; // canvas for slideshow
    var currentSlideshowThread;
    var currentTileRow;

    /**
     * Load slideshow images
     */
    var initSlideshow = function() {

        setSlideshowSize();

        var slideshowImages = [ "/images/IMG_0103.JPG", "/images/cat.JPG", "/images/anothercat.JPG", "/images/IMG_0036.JPG", "/images/CIMG0310.JPG", "/images/CIMG0702.JPG", "/images/CIMG0715.JPG", "/images/CIMG0707.JPG", "/images/CIMG0726.JPG", "/images/IMG_0033.JPG", "/images/20141225_105801.JPG" ];

        shauSlideshow = new ShauSlideshow();

        for (var i = 0; i < slideshowImages.length; i++) {

            var ssImg = new Image();
            ssImg.src = slideshowImages[i];
            ssImg.onload = function() {
                shauSlideshow.loadImage(this);
            };
        }
    };

    var setSlideshowSize = function() {

        var availableWidth = parseInt($("#home-panel-body").width() * 0.8); // Use
                                                                            // 80%
                                                                            // of
                                                                            // available
                                                                            // width
        var availableHeight = parseInt(availableWidth / 1.333);

        // Width
        var tmpSegmentWidth = parseInt(availableWidth / SLIDESHOW_COLUMNS);
        // get closest multiple of 4
        var mult = parseInt(tmpSegmentWidth / 4);

        // calculate canvas and column width
        shauSegmentWidth = mult * 4;
        shauSlideshowWidth = shauSegmentWidth * SLIDESHOW_COLUMNS;

        // Height
        var tmpSegmentHeight = parseInt(availableHeight / SLIDESHOW_ROWS);
        // get closest multiple of 4
        mult = parseInt(tmpSegmentHeight / 4);

        // calculate canvas and row height
        shauSegmentHeight = mult * 4;
        shauSlideshowHeight = shauSegmentHeight * SLIDESHOW_ROWS;

        document.getElementById("shauSlideshowCanvas").width = shauSlideshowWidth;
        document.getElementById("shauSlideshowCanvas").height = shauSlideshowHeight;
    };

    /**
     * Stop slideshow timer thread - in this instance when moving to another
     * page
     */
    var stopSlideshowThread = function() {
        clearTimeout(currentSlideshowThread);
    };

    var startTransition = function() {

        transitionFrame = 0;

        // current image draw it off screen
        generateOffscreenFromImage(shauSlideshow.getCurrentSlideshowImage());
        // next image draw it off screen
        generateOffscreenToImage(shauSlideshow.getNextSlideshowImage());

        // start render loop
        var transitionIndex = shauSlideshow.getNextTransitionIndex();

        if (transitionIndex === 0) {
            renderHorizontalSliderTransition();
        } else if (transitionIndex === 1) {
            renderVerticalSliderTransition();
        } else if (transitionIndex === 2) {
            currentTileRow = 0;
            renderRotatingTilesTransition();
        } else if (transitionIndex === 3) {
            renderVerticalRollerTransition();
        } else if (transitionIndex === 4) {
            renderTransparencyTransition();
        } else if (transitionIndex === 5) {
            renderHorizontalRollerTransition();
        }
    };

    /**
     * Generate offscreen context for image we are moving from
     */
    var generateOffscreenFromImage = function(img) {

        // draw black background on offscreen context
        shauSlideshow.getOffscreenFromCtx().fillRect(0, 0, shauSlideshowWidth, shauSlideshowHeight);
        // draw image on background of offscreen context
        shauSlideshow.getOffscreenFromCtx().drawImage(img.getImg(), img.getDisplayLeft(), img.getDisplayTop(), img.getDisplayWidth(), img.getDisplayHeight());
    };

    /**
     * Generate offscreen context for image we are moving to
     */
    var generateOffscreenToImage = function(img) {

        // draw black background on offscreen context
        shauSlideshow.getOffscreenCtx().fillRect(0, 0, shauSlideshowWidth, shauSlideshowHeight);
        // draw image on background of offscreen context
        shauSlideshow.getOffscreenCtx().drawImage(img.getImg(), img.getDisplayLeft(), img.getDisplayTop(), img.getDisplayWidth(), img.getDisplayHeight());
    };

    var renderTransparencyTransition = function() {

        var i;
        var j;
        var alpha;
        var imageData;
        var data;

        if (transitionFrame > 0) {

            if (transitionFrame < shauSlideshowWidth) {

                // fade image out
                imageData = shauSlideshow.getSlideshowCtx().getImageData(0, 0, shauSlideshowWidth, shauSlideshowHeight);
                data = imageData.data;

                for (i = 0; i < shauSlideshowHeight; i++) {
                    for (j = 0; j < shauSlideshowWidth; j++) {

                        alpha = 255;

                        if (j < transitionFrame) {
                            alpha -= 63;
                        }
                        if (j > (shauSlideshowWidth - transitionFrame)) {
                            alpha -= 63;
                        }

                        if (i < (transitionFrame)) {
                            alpha -= 63;
                        }
                        if (i > (shauSlideshowHeight - transitionFrame)) {
                            alpha -= 63;
                        }

                        data[(i * shauSlideshowWidth * 4) + (j * 4) + 3] = alpha;
                    }
                }
                shauSlideshow.getSlideshowCtx().putImageData(imageData, 0, 0);

            } else {

                // fade new image in
                imageData = shauSlideshow.getOffscreenCtx().getImageData(0, 0, shauSlideshowWidth, shauSlideshowHeight);
                data = imageData.data;

                for (i = 0; i < shauSlideshowHeight; i++) {
                    for (j = 0; j < shauSlideshowWidth; j++) {

                        alpha = 0;

                        if (j < (transitionFrame - shauSlideshowWidth)) {
                            alpha += 63;
                        }
                        if (j > (shauSlideshowWidth - (transitionFrame - shauSlideshowWidth))) {
                            alpha += 63;
                        }
                        if (i < (transitionFrame - shauSlideshowWidth)) {
                            alpha += 63;
                        }
                        if (i > (shauSlideshowHeight - (transitionFrame - shauSlideshowWidth))) {
                            alpha += 63;
                        }

                        data[(i * shauSlideshowWidth * 4) + (j * 4) + 3] = alpha;
                    }
                }
                shauSlideshow.getSlideshowCtx().putImageData(imageData, 0, 0);
            }
        }
        transitionFrame += 10;

        if (transitionFrame < (shauSlideshowWidth + shauSlideshowWidth)) {
            // draw next frame
            currentSlideshowThread = setTimeout(renderTransparencyTransition, 10);
        } else {
            // done
            // get whole image to draw from offscreen context
            // draw whole to on screen canvas
            shauSlideshow.getSlideshowCtx().drawImage(shauSlideshow.getOffscreenCanvas(), 0, 0);
            currentSlideshowThread = setTimeout(startTransition, IMAGE_DISPLAY_TIME);
        }
    };

    var renderVerticalRollerTransition = function() {

        var halfWay = shauSegmentWidth / 2; // segment width is multiple of 4 so
                                            // no need to parse

        for (var i = 0; i < SLIDESHOW_COLUMNS; i++) {

            shauSlideshow.getSlideshowCtx().fillRect((i * shauSegmentWidth) + SHAU_SLIDESHOW_BORDER, 0, shauSegmentWidth, shauSlideshowHeight);

            if (transitionFrame < halfWay) {
                // from image rotating away
                shauSlideshow.getSlideshowCtx().drawImage(shauSlideshow.getOffscreenFromCanvas(), (i * shauSegmentWidth) + SHAU_SLIDESHOW_BORDER, 0, shauSegmentWidth, shauSlideshowHeight, (i * shauSegmentWidth) + transitionFrame + SHAU_SLIDESHOW_BORDER, 0,
                        shauSegmentWidth - transitionFrame - transitionFrame, shauSlideshowHeight);
            } else {
                // to image rotating in
                shauSlideshow.getSlideshowCtx().drawImage(shauSlideshow.getOffscreenCanvas(), (i * shauSegmentWidth) + SHAU_SLIDESHOW_BORDER, 0, shauSegmentWidth, shauSlideshowHeight, (i * shauSegmentWidth) + (shauSegmentWidth - transitionFrame) + SHAU_SLIDESHOW_BORDER, 0,
                        shauSegmentWidth - (shauSegmentWidth - transitionFrame) - (shauSegmentWidth - transitionFrame), shauSlideshowHeight);
            }
        }

        transitionFrame++;

        if (transitionFrame < shauSegmentWidth + 1) {
            // draw next frame
            currentSlideshowThread = setTimeout(renderVerticalRollerTransition, 40);
        } else {
            // done
            // get whole image to draw from offscreen context
            // draw whole to onscreen canvas
            shauSlideshow.getSlideshowCtx().drawImage(shauSlideshow.getOffscreenCanvas(), 0, 0);
            currentSlideshowThread = setTimeout(startTransition, IMAGE_DISPLAY_TIME);
        }
    };

    var renderHorizontalRollerTransition = function() {

        var halfWay = shauSegmentHeight / 2; // segment height is multiple of
                                                // 4 so no need to parse

        for (var i = 0; i < SLIDESHOW_ROWS; i++) {

            shauSlideshow.getSlideshowCtx().fillRect(0, (i * shauSegmentHeight) + SHAU_SLIDESHOW_BORDER, shauSlideshowWidth, shauSegmentHeight);

            if (transitionFrame < halfWay) {
                // from image rotating away
                shauSlideshow.getSlideshowCtx().drawImage(shauSlideshow.getOffscreenFromCanvas(), 0, (i * shauSegmentHeight) + SHAU_SLIDESHOW_BORDER, shauSlideshowWidth, shauSegmentHeight, 0, (i * shauSegmentHeight) + transitionFrame + SHAU_SLIDESHOW_BORDER, shauSlideshowWidth,
                        shauSegmentHeight - transitionFrame - transitionFrame);
            } else {
                // to image rotating in
                shauSlideshow.getSlideshowCtx().drawImage(shauSlideshow.getOffscreenCanvas(), 0, (i * shauSegmentHeight) + SHAU_SLIDESHOW_BORDER, shauSlideshowWidth, shauSegmentHeight, 0, (i * shauSegmentHeight) + (shauSegmentHeight - transitionFrame) + SHAU_SLIDESHOW_BORDER, shauSlideshowWidth,
                        shauSegmentHeight - (shauSegmentHeight - transitionFrame) - (shauSegmentHeight - transitionFrame));
            }
        }

        transitionFrame++;

        if (transitionFrame < shauSegmentHeight + 1) {
            // draw next frame
            currentSlideshowThread = setTimeout(renderHorizontalRollerTransition, 40);
        } else {
            // done
            // get whole image to draw from offscreen context
            // draw whole to onscreen canvas
            shauSlideshow.getSlideshowCtx().drawImage(shauSlideshow.getOffscreenCanvas(), 0, 0);
            currentSlideshowThread = setTimeout(startTransition, IMAGE_DISPLAY_TIME);
        }
    };

    var renderRotatingTilesTransition = function() {

        var offset = transitionFrame;

        if (transitionFrame >= (shauSegmentWidth + 1)) {
            offset = transitionFrame % (shauSegmentWidth + 1);
            if (offset === 0) {
                currentTileRow += 1;
            }
        }

        var halfWay = shauSegmentWidth / 2;

        // rows
        for (var i = 0; i < SLIDESHOW_ROWS + 1; i++) {

            // columns
            for (var j = 0; j < SLIDESHOW_COLUMNS; j++) {

                if (currentTileRow == i) {

                    shauSlideshow.getSlideshowCtx().fillRect((j * shauSegmentWidth), (i * shauSegmentHeight), shauSegmentWidth, shauSegmentHeight);

                    if (offset < halfWay) {
                        // from image rotating away
                        shauSlideshow.getSlideshowCtx().drawImage(shauSlideshow.getOffscreenFromCanvas(), (j * shauSegmentWidth), (i * shauSegmentHeight), shauSegmentWidth, shauSegmentHeight, (j * shauSegmentWidth) + offset, (i * shauSegmentHeight), shauSegmentWidth - offset - offset,
                                shauSegmentHeight);
                    } else {
                        // to image rotating in
                        shauSlideshow.getSlideshowCtx().drawImage(shauSlideshow.getOffscreenCanvas(), (j * shauSegmentWidth), (i * shauSegmentHeight), shauSegmentWidth, shauSegmentHeight, (j * shauSegmentWidth) + (shauSegmentWidth - offset), (i * shauSegmentHeight),
                                shauSegmentWidth - (shauSegmentWidth - offset) - (shauSegmentWidth - offset), shauSegmentHeight);
                    }
                }
            }
        }

        transitionFrame++;

        if (transitionFrame < 500) { // magic 500 - as I said, magic!
            // draw next frame
            currentSlideshowThread = setTimeout(renderRotatingTilesTransition, 10);
        } else {
            // done
            // get whole image to draw from offscreen context
            // draw whole to onscreen canvas
            shauSlideshow.getSlideshowCtx().drawImage(shauSlideshow.getOffscreenCanvas(), 0, 0);
            currentSlideshowThread = setTimeout(startTransition, IMAGE_DISPLAY_TIME);
        }
    };

    var renderHorizontalSliderTransition = function() {

        if (transitionFrame > 0) {

            for (var i = 0; i < SLIDESHOW_ROWS; i++) {

                // alternate left right image direction
                if (i % 2 === 0) {
                    // image comes in from left
                    shauSlideshow.getSlideshowCtx().drawImage(shauSlideshow.getOffscreenCanvas(), 0, (shauSegmentHeight * i), shauSlideshowWidth, shauSegmentHeight, transitionFrame - shauSlideshowWidth, (shauSegmentHeight * i), shauSlideshowWidth, shauSegmentHeight);

                } else {
                    // image comes in from right
                    shauSlideshow.getSlideshowCtx().drawImage(shauSlideshow.getOffscreenCanvas(), 0, (shauSegmentHeight * i), shauSlideshowWidth, shauSegmentHeight, shauSlideshowWidth - transitionFrame, (shauSegmentHeight * i), shauSlideshowWidth, shauSegmentHeight);
                }
            }
        }

        transitionFrame += 2;

        if (transitionFrame < shauSlideshowWidth) {
            // draw next frame
            currentSlideshowThread = setTimeout(renderHorizontalSliderTransition, 10);
        } else {
            // done
            // get whole image to draw from offscreen context
            // draw whole to onscreen canvas
            shauSlideshow.getSlideshowCtx().drawImage(shauSlideshow.getOffscreenCanvas(), 0, 0);
            currentSlideshowThread = setTimeout(startTransition, IMAGE_DISPLAY_TIME);
        }
    };

    var renderVerticalSliderTransition = function() {

        if (transitionFrame > 0) {

            for (var i = 0; i < SLIDESHOW_COLUMNS; i++) {

                // alternate left right image direction
                if (i % 2 === 0) {
                    // image comes in from left
                    shauSlideshow.getSlideshowCtx().drawImage(shauSlideshow.getOffscreenCanvas(), (shauSegmentWidth * i), 0, shauSegmentWidth, shauSlideshowHeight, (shauSegmentWidth * i), transitionFrame - shauSlideshowHeight, shauSegmentWidth, shauSlideshowHeight);

                } else {
                    // image comes in from right
                    shauSlideshow.getSlideshowCtx().drawImage(shauSlideshow.getOffscreenCanvas(), (shauSegmentWidth * i), 0, shauSegmentWidth, shauSlideshowHeight, (shauSegmentWidth * i), shauSlideshowHeight - transitionFrame, shauSegmentWidth, shauSlideshowHeight);
                }
            }
        }

        transitionFrame += 2;

        if (transitionFrame < shauSlideshowHeight) {
            // draw next frame
            currentSlideshowThread = setTimeout(renderVerticalSliderTransition, 10);
        } else {
            // done
            // get whole image to draw from offscreen context
            // draw whole to onscreen canvas
            shauSlideshow.getSlideshowCtx().drawImage(shauSlideshow.getOffscreenCanvas(), 0, 0);
            currentSlideshowThread = setTimeout(startTransition, IMAGE_DISPLAY_TIME);
        }
    };

    var ShauSlideshow = function() {

        // off-screen canvas object. Content gets copied to visible canvas
        var offscreenCanvas = document.createElement('canvas');
        offscreenCanvas.width = shauSlideshowWidth;
        offscreenCanvas.height = shauSlideshowHeight;

        var offscreenCtx = offscreenCanvas.getContext('2d');

        var offscreenFromCanvas = document.createElement('canvas');
        offscreenFromCanvas.width = shauSlideshowWidth;
        offscreenFromCanvas.height = shauSlideshowHeight;

        var offscreenFromCtx = offscreenFromCanvas.getContext('2d');

        // images and display canvas
        var slideshowImages = [];
        var slideshowCanvas = document.getElementById("shauSlideshowCanvas");
        var slideshowCtx = slideshowCanvas.getContext('2d');

        var currentDisplayIndex;
        var currentTransitionIndex;

        // called for each image when it finishes loading
        this.loadImage = function(img) {

            var slideshowImage = new ShauSlideshowImage();
            slideshowImage.initImage(img);
            slideshowImages.push(slideshowImage);

            if (slideshowImages.length === 1) {
                // first loaded image start slideshow
                this.loadFirstImage();
            }
        };

        // current image
        this.getCurrentSlideshowImage = function() {
            return slideshowImages[currentDisplayIndex];
        };

        // next (different) image
        this.getNextSlideshowImage = function() {

            var nextImageIndex = Math.floor(Math.random() * slideshowImages.length);

            while (nextImageIndex == currentDisplayIndex) {
                // regenerate index if the same as current index
                nextImageIndex = Math.floor(Math.random() * slideshowImages.length);
            }

            currentDisplayIndex = nextImageIndex;

            return slideshowImages[nextImageIndex];
        };

        // next (different) transition
        this.getNextTransitionIndex = function() {

            var nextTransitionIndex = Math.floor(Math.random() * 6);

            while (nextTransitionIndex == currentTransitionIndex) {
                // regenerate index if the same as current index
                nextTransitionIndex = Math.floor(Math.random() * 6);
            }

            if (nextTransitionIndex === 6) {
                nextTransitionIndex = 5;
            }

            currentTransitionIndex = nextTransitionIndex;

            return nextTransitionIndex;
        };

        // get canvas and contexts
        this.getSlideshowCtx = function() {
            return slideshowCtx;
        };
        this.getOffscreenCtx = function() {
            return offscreenCtx;
        };
        this.getOffscreenFromCtx = function() {
            return offscreenFromCtx;
        };

        this.getOffscreenCanvas = function() {
            return offscreenCanvas;
        };
        this.getOffscreenFromCanvas = function() {
            return offscreenFromCanvas;
        };

        // load first image
        this.loadFirstImage = function() {

            currentDisplayIndex = 0;
            var slideshowImage = slideshowImages[0];

            // fill background?
            slideshowCtx.fillStyle = "rgba(0, 0, 0, 1)"; // black background
            slideshowCtx.fillRect(0, 0, shauSlideshowWidth, shauSlideshowHeight);

            slideshowCtx.drawImage(slideshowImage.getImg(), slideshowImage.getDisplayLeft(), slideshowImage.getDisplayTop(), slideshowImage.getDisplayWidth(), slideshowImage.getDisplayHeight());
            currentSlideshowThread = setTimeout(startTransition, IMAGE_DISPLAY_TIME);
        };
    };

    var ShauSlideshowImage = function() {

        var img;
        var imgWidth;
        var imgHeight;
        var displayWidth;
        var displayHeight;
        var displayLeft;
        var displayTop;

        var initImage = function(image) {

            img = image;
            imgWidth = img.width;
            imgHeight = img.height;

            // landscape - this assumes viewport is displayed with landscape
            // aspect
            var aspectRatio = imgWidth / imgHeight;

            if (aspectRatio > 1) {

                // landscape

                // 2 cases
                // first try expanding width to fit
                displayWidth = shauSlideshowWidth - SHAU_SLIDESHOW_BORDER - SHAU_SLIDESHOW_BORDER;
                displayHeight = parseInt(displayWidth / aspectRatio);
                displayLeft = SHAU_SLIDESHOW_BORDER;
                displayTop = parseInt((shauSlideshowHeight - displayHeight) / 2);

                // but check if scaled height exceeds bounds
                if (displayHeight > (shauSlideshowHeight - SHAU_SLIDESHOW_BORDER - SHAU_SLIDESHOW_BORDER)) {

                    // doesn't fit width so fit to height
                    displayHeight = shauSlideshowHeight - SHAU_SLIDESHOW_BORDER - SHAU_SLIDESHOW_BORDER;
                    displayWidth = parseInt(displayHeight * aspectRatio);
                    displayTop = SHAU_SLIDESHOW_BORDER;
                    displayLeft = parseInt((shauSlideshowWidth - displayWidth) / 2);
                }

            } else {

                // portrait

                displayHeight = shauSlideshowHeight - SHAU_SLIDESHOW_BORDER - SHAU_SLIDESHOW_BORDER;
                displayWidth = parseInt(displayHeight * aspectRatio);
                displayTop = SHAU_SLIDESHOW_BORDER;
                displayLeft = parseInt((shauSlideshowWidth - displayWidth) / 2);
            }
        };

        /* Accessors */

        var getImg = function() {
            return img;
        };

        var getImgWidth = function() {
            return imgWidth;
        };

        var getImgHeight = function() {
            return imgHeight;
        };

        var getDisplayWidth = function() {
            return displayWidth;
        };

        var getDisplayHeight = function() {
            return displayHeight;
        };

        var getDisplayTop = function() {
            return displayTop;
        };

        var getDisplayLeft = function() {
            return displayLeft;
        };

        return {
            initImage : initImage,
            getImg : getImg,
            getImgWidth : getImgWidth,
            getImgHeight : getImgHeight,
            getDisplayWidth : getDisplayWidth,
            getDisplayHeight : getDisplayHeight,
            getDisplayTop : getDisplayTop,
            getDisplayLeft : getDisplayLeft
        };
    };

    return {
        initSlideshow : initSlideshow,
        stopSlideshowThread : stopSlideshowThread
    };

}();