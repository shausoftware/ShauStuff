/**
 * Spinning cube for Bootstrap NavBar
 */
var shauGL = function() {

    var canvas;
    var gl;

    var cssRed = 1.0;
    var cssGreen = 1.0;
    var cssBlue = 1.0;

    var cubeVerticesBuffer;
    var cubeVerticesTextureCoordBuffer;
    var cubeVerticesIndexBuffer;
    var cubeRotation = 0.0;
    var lastCubeUpdateTime = 0;

    var cubeImage;
    var cubeTexture;

    var mvMatrixStack = [];
    var mvMatrix;
    var shaderProgram;
    var perspectiveMatrix;

    var lightPosition;
    var currentPage = "/html/home.html";

    var setCurrentPage = function(page) {
        currentPage = page;
    };

    var init = function(red, green, blue) {

        cssRed = red / 255;
        cssGreen = green / 255;
        cssBlue = blue / 255;

        canvas = document.getElementById("glcanvas");

        initWebGL(canvas); // Initialize the GL context

        // Only continue if WebGL is available and working
        if (gl) {
            gl.clearColor(0.0, 0.0, 0.0, 1.0); // Clear to black, fully opaque
            gl.clearDepth(1.0); // Clear everything
            gl.enable(gl.DEPTH_TEST); // Enable depth testing
            gl.depthFunc(gl.LEQUAL); // Near things obscure far things

            // Initialize the shaders; this is where all the lighting for the
            // vertices and so forth is established.
            initShaders();

            // Here's where we call the routine that builds all the objects
            // we'll be drawing.
            initBuffers();

            // Next, load and set up the textures we'll be using.
            initTextures();

            // Set up to draw the scene periodically.
            setInterval(drawScene, 15);
        }
    };

    var initWebGL = function() {

        gl = null;

        try {
            gl = canvas.getContext("experimental-webgl");
        } catch (e) {
            // no point in continuing as browser can't handle content
            location.replace("/html/oldbrowser.html");
        }

        // If we don't have a GL context, give up now
        if (!gl) {
            // no point in continuing as browser can't handle content
            location.replace("/html/oldbrowser.html");
        }
    };

    var initBuffers = function() {

        // Initialise light position
        lightPosition = [ -5.0, -5.0, -5.0, 1.0 ];

        // Create a buffer for the plus's vertices.
        cubeVerticesBuffer = gl.createBuffer();

        // Select the cubeVerticesBuffer as the one to apply vertex
        // operations to from here out.
        gl.bindBuffer(gl.ARRAY_BUFFER, cubeVerticesBuffer);

        // Now create an array of vertices for the plus.
        var vertices = [
        // TOP CUBE
        // Front face
        -1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 3.0, 1.0, -1.0, 3.0, 1.0,
        // Back face
        -1.0, 1.0, -1.0, -1.0, 3.0, -1.0, 1.0, 3.0, -1.0, 1.0, 1.0, -1.0,
        // Top face
        -1.0, 3.0, -1.0, -1.0, 3.0, 1.0, 1.0, 3.0, 1.0, 1.0, 3.0, -1.0,
        // Right face
        1.0, 1.0, -1.0, 1.0, 3.0, -1.0, 1.0, 3.0, 1.0, 1.0, 1.0, 1.0,
        // Left face
        -1.0, 1.0, -1.0, -1.0, 1.0, 1.0, -1.0, 3.0, 1.0, -1.0, 3.0, -1.0,
        // LEFT CUBE
        // Front face
        -3.0, -1.0, 1.0, -1.0, -1.0, 1.0, -1.0, 1.0, 1.0, -3.0, 1.0, 1.0,
        // Back face
        -3.0, -1.0, -1.0, -3.0, 1.0, -1.0, -1.0, 1.0, -1.0, -1.0, -1.0, -1.0,
        // Top face
        -3.0, 1.0, -1.0, -3.0, 1.0, 1.0, -1.0, 1.0, 1.0, -1.0, 1.0, -1.0,
        // Bottom face
        -3.0, -1.0, -1.0, -1.0, -1.0, -1.0, -1.0, -1.0, 1.0, -3.0, -1.0, 1.0,
        // Left face
        -3.0, -1.0, -1.0, -3.0, -1.0, 1.0, -3.0, 1.0, 1.0, -3.0, 1.0, -1.0,
        // BOTTOM CUBE
        // Front face
        -1.0, -3.0, 1.0, 1.0, -3.0, 1.0, 1.0, -1.0, 1.0, -1.0, -1.0, 1.0,
        // Back face
        -1.0, -3.0, -1.0, -1.0, -1.0, -1.0, 1.0, -1.0, -1.0, 1.0, -3.0, -1.0,
        // Bottom face
        -1.0, -3.0, -1.0, 1.0, -3.0, -1.0, 1.0, -3.0, 1.0, -1.0, -3.0, 1.0,
        // Right face
        1.0, -3.0, -1.0, 1.0, -1.0, -1.0, 1.0, -1.0, 1.0, 1.0, -3.0, 1.0,
        // Left face
        -1.0, -3.0, -1.0, -1.0, -3.0, 1.0, -1.0, -1.0, 1.0, -1.0, -1.0, -1.0,
        // RIGHT CUBE
        // Front face
        1.0, -1.0, 1.0, 3.0, -1.0, 1.0, 3.0, 1.0, 1.0, 1.0, 1.0, 1.0,
        // Back face
        1.0, -1.0, -1.0, 1.0, 1.0, -1.0, 3.0, 1.0, -1.0, 3.0, -1.0, -1.0,
        // Top face
        1.0, 1.0, -1.0, 1.0, 1.0, 1.0, 3.0, 1.0, 1.0, 3.0, 1.0, -1.0,
        // Bottom face
        1.0, -1.0, -1.0, 3.0, -1.0, -1.0, 3.0, -1.0, 1.0, 1.0, -1.0, 1.0,
        // Right face
        3.0, -1.0, -1.0, 3.0, 1.0, -1.0, 3.0, 1.0, 1.0, 3.0, -1.0, 1.0,
        // FRONT CUBE
        // Front face
        -1.0, -1.0, 3.0, 1.0, -1.0, 3.0, 1.0, 1.0, 3.0, -1.0, 1.0, 3.0,
        // Top face
        -1.0, 1.0, 1.0, -1.0, 1.0, 3.0, 1.0, 1.0, 3.0, 1.0, 1.0, 1.0,
        // Bottom face
        -1.0, -1.0, 1.0, 1.0, -1.0, 1.0, 1.0, -1.0, 3.0, -1.0, -1.0, 3.0,
        // Right face
        1.0, -1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 3.0, 1.0, -1.0, 3.0,
        // Left face
        -1.0, -1.0, 1.0, -1.0, -1.0, 3.0, -1.0, 1.0, 3.0, -1.0, 1.0, 1.0,
        // BACK CUBE
        // Back face
        -1.0, -1.0, -3.0, -1.0, 1.0, -3.0, 1.0, 1.0, -3.0, 1.0, -1.0, -3.0,
        // Top face
        -1.0, 1.0, -3.0, -1.0, 1.0, -1.0, 1.0, 1.0, -1.0, 1.0, 1.0, -3.0,
        // Bottom face
        -1.0, -1.0, -3.0, 1.0, -1.0, -3.0, 1.0, -1.0, -1.0, -1.0, -1.0, -1.0,
        // Right face
        1.0, -1.0, -3.0, 1.0, 1.0, -3.0, 1.0, 1.0, -1.0, 1.0, -1.0, -1.0,
        // Left face
        -1.0, -1.0, -3.0, -1.0, -1.0, -1.0, -1.0, 1.0, -1.0, -1.0, 1.0, -3.0 ];

        // Now pass the list of vertices into WebGL to build the shape. We
        // do this by creating a Float32Array from the JavaScript array,
        // then use it to fill the current vertex buffer.
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

        // Set up the normals for the vertices, so that we can compute lighting.
        cubeVerticesNormalBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, cubeVerticesNormalBuffer);

        var vertexNormals = [
        // TOP CUBE
        // Front
        0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0,
        // Back
        0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0,
        // Top
        0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0,
        // Right
        1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0,
        // Left
        -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0,
        // LEFT CUBE
        // Front
        0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0,
        // Back
        0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0,
        // Top
        0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0,
        // Bottom
        0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0,
        // Left
        -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0,
        // BOTTOM CUBE
        // Front
        0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0,
        // Back
        0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0,
        // Bottom
        0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0,
        // Right
        1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0,
        // Left
        -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0,
        // RIGHT CUBE
        // Front
        0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0,
        // Back
        0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0,
        // Top
        0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0,
        // Bottom
        0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0,
        // Right
        1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0,
        // FRONT CUBE
        // Front
        0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0,
        // Top
        0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0,
        // Bottom
        0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0,
        // Right
        1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0,
        // Left
        -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0,
        // BACK CUBE
        // Back
        0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0,
        // Top
        0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0,
        // Bottom
        0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0,
        // Right
        1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0,
        // Left
        -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0 ];

        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexNormals), gl.STATIC_DRAW);

        // Map the texture onto the plus's faces.
        cubeVerticesTextureCoordBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, cubeVerticesTextureCoordBuffer);

        var textureCoordinates = [
        // TOP CUBE
        // Front
        0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0,
        // Back
        0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0,
        // Top
        0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0,
        // Right
        0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0,
        // Left
        0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0,
        // LEFT CUBE
        // Front
        0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0,
        // Back
        0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0,
        // Top
        0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0,
        // Bottom
        0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0,
        // Left
        0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0,
        // BOTTOM CUBE
        // Front
        0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0,
        // Back
        0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0,
        // Bottom
        0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0,
        // Right
        0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0,
        // Left
        0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0,
        // RIGHT CUBE
        // Front
        0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0,
        // Back
        0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0,
        // Top
        0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0,
        // Bottom
        0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0,
        // Right
        0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0,
        // FRONT CUBE
        // Front
        0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0,
        // Top
        0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0,
        // Bottom
        0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0,
        // Right
        0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0,
        // Left
        0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0,
        // BACK CUBE
        // Back
        0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0,
        // Top
        0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0,
        // Bottom
        0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0,
        // Right
        0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0,
        // Left
        0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0 ];

        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(textureCoordinates), gl.STATIC_DRAW);

        // Build the element array buffer; this specifies the indices
        // into the vertex array for each face's vertices.
        cubeVerticesIndexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, cubeVerticesIndexBuffer);

        // This array defines each face as two triangles, using the
        // indices into the vertex array to specify each triangle's
        // position.
        var cubeVertexIndices = [
        // TOP CUBE
        0, 1, 2, 0, 2, 3, // front
        4, 5, 6, 4, 6, 7, // back
        8, 9, 10, 8, 10, 11, // top
        12, 13, 14, 12, 14, 15, // right
        16, 17, 18, 16, 18, 19, // left
        // LEFT CUBE
        20, 21, 22, 20, 22, 23, // front
        24, 25, 26, 24, 26, 27, // back
        28, 29, 30, 28, 30, 31, // top
        32, 33, 34, 32, 34, 35, // bottom
        36, 37, 38, 36, 38, 39, // left
        // BOTTOM CUBE
        40, 41, 42, 40, 42, 43, // front
        44, 45, 46, 44, 46, 47, // back
        48, 49, 50, 48, 50, 51, // bottom
        52, 53, 54, 52, 54, 55, // right
        56, 57, 58, 56, 58, 59, // left
        // RIGHT CUBE
        60, 61, 62, 60, 62, 63, // front
        64, 65, 66, 64, 66, 67, // back
        68, 69, 70, 68, 70, 71, // top
        72, 73, 74, 72, 74, 75, // bottom
        76, 77, 78, 76, 78, 79, // right
        // FRONT CUBE
        80, 81, 82, 80, 82, 83, // front
        84, 85, 86, 84, 86, 87, // top
        88, 89, 90, 88, 90, 91, // bottom
        92, 93, 94, 92, 94, 95, // right
        96, 97, 98, 96, 98, 99, // left
        // BACK CUBE
        100, 101, 102, 100, 102, 103, // back
        104, 105, 106, 104, 106, 107, // top
        108, 109, 110, 108, 110, 111, // bottom
        112, 113, 114, 112, 114, 115, // right
        116, 117, 118, 116, 118, 119 // left
        ];

        // Now send the element array to GL
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(cubeVertexIndices), gl.STATIC_DRAW);
    };

    var initTextures = function() {
        cubeTexture = gl.createTexture();
        cubeImage = new Image();
        cubeImage.onload = function() {
            handleTextureLoaded(cubeImage, cubeTexture);
        };
        cubeImage.src = "/images/plus.png";
    };

    var handleTextureLoaded = function(image, texture) {
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_NEAREST);
        gl.generateMipmap(gl.TEXTURE_2D);
        gl.bindTexture(gl.TEXTURE_2D, null);
    };

    var drawScene = function() {

        // Clear the canvas before we start drawing on it.
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        // Establish the perspective with which we want to view the
        // scene. Our field of view is 45 degrees, with a width/height
        // ratio of 48:38, and we only want to see objects between 0.1 units
        // and 100 units away from the camera.
        perspectiveMatrix = makePerspective(45, 48.0 / 38.0, 0.1, 100.0);

        // Set the drawing position to the "identity" point, which is
        // the center of the scene.
        loadIdentity();

        // Now move the drawing position a bit to where we want to start
        // drawing the plus.
        mvTranslate([ 0.0, 0.0, -9.0 ]);

        // Save the current matrix, then rotate before we draw.
        mvPushMatrix();

        if ("/html/home.html" === currentPage) {
            mvRotate(cubeRotation, [ 0, 1, 0 ]);
        } else if ("/html/form3d.html" === currentPage) {
            mvRotate(-cubeRotation, [ 0, 1, 1 ]);
        } else if ("/html/shaujulia.html" === currentPage) {
            mvRotate(cubeRotation, [ 1, 1, 1 ]);
        } else if ("/html/shauvt.html" === currentPage) {
            mvRotate(cubeRotation, [ 1, 1, 0 ]);
        } else if ("/html/map.html" === currentPage) {
            mvRotate(cubeRotation, [ 1, 0, 1 ]);
        } else if ("/html/links.html" === currentPage) {
            mvRotate(-cubeRotation, [ 1, 1, 1 ]);
        } else {
            // default same as home
            mvRotate(cubeRotation, [ 0, 1, 0 ]);
        }

        // Draw the plus by binding the array buffer to the plus's vertices
        // array, setting attributes, and pushing it to GL.
        gl.bindBuffer(gl.ARRAY_BUFFER, cubeVerticesBuffer);
        gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, 3, gl.FLOAT, false, 0, 0);

        // Set the texture coordinates attribute for the vertices.
        gl.bindBuffer(gl.ARRAY_BUFFER, cubeVerticesTextureCoordBuffer);
        gl.vertexAttribPointer(shaderProgram.textureCoordAttribute, 2, gl.FLOAT, false, 0, 0);

        // Bind the normals buffer to the shader attribute.
        gl.bindBuffer(gl.ARRAY_BUFFER, cubeVerticesNormalBuffer);
        gl.vertexAttribPointer(shaderProgram.vertexNormalAttribute, 3, gl.FLOAT, false, 0, 0);

        // Specify the texture to map onto the faces.
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, cubeTexture);
        gl.uniform1i(gl.getUniformLocation(shaderProgram, "uSampler"), 0);

        // Lighting

        // Uniform
        gl.uniform1i(shaderProgram.useLightingUniform, true);
        gl.uniform3f(shaderProgram.ambientColorUniform, 0.25, 0.25, 0.45); // grey
                                                                            // -
                                                                            // blue

        // Directional
        var lightingDirection = [ 5.0, 5.0, 5.0 ];
        var adjustedLD = vec3.create();
        vec3.normalize(lightingDirection, adjustedLD);
        vec3.scale(adjustedLD, -1);
        gl.uniform3fv(shaderProgram.lightingDirectionUniform, adjustedLD);
        gl.uniform3f(shaderProgram.directionalColorUniform, 5.0, 5.0, 5.0);

        // Positional
        gl.uniform3f(shaderProgram.pointLightingLocationUniform, lightPosition[0], lightPosition[1], lightPosition[2]);
        gl.uniform3f(shaderProgram.pointLightingColorUniform, cssRed, cssGreen, cssBlue);

        // Draw the plus.
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, cubeVerticesIndexBuffer);
        setMatrixUniforms();
        gl.drawElements(gl.TRIANGLES, 180, gl.UNSIGNED_SHORT, 0);

        // Restore the original matrix
        mvPopMatrix();

        // Update the rotation for the next draw, if it's time to do so.
        var currentTime = (new Date).getTime();
        if (lastCubeUpdateTime) {
            // rotate cube
            var delta = currentTime - lastCubeUpdateTime;
            cubeRotation += (30 * delta) / 1000.0;

            // rotate light position
            // first create rotation matrix
            var rotationMatrix = mat4.create();
            mat4.identity(rotationMatrix);
            mat4.rotate(rotationMatrix, Math.PI / 90, [ 1.0, 0.0, 1.0 ]);
            // now perform rotation
            mat4.multiplyVec3(rotationMatrix, lightPosition, lightPosition);
        }

        lastCubeUpdateTime = currentTime;
    };

    var initShaders = function() {

        var fragmentShader = getShader(gl, "shader-fs");
        var vertexShader = getShader(gl, "shader-vs");

        // Create the shader program
        shaderProgram = gl.createProgram();
        gl.attachShader(shaderProgram, vertexShader);
        gl.attachShader(shaderProgram, fragmentShader);
        gl.linkProgram(shaderProgram);

        // If creating the shader program failed, alert
        if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
            alert("Unable to initialize the shader program.");
        }

        gl.useProgram(shaderProgram);

        shaderProgram.vertexPositionAttribute = gl.getAttribLocation(shaderProgram, "aVertexPosition");
        gl.enableVertexAttribArray(shaderProgram.vertexPositionAttribute);

        shaderProgram.textureCoordAttribute = gl.getAttribLocation(shaderProgram, "aTextureCoord");
        gl.enableVertexAttribArray(shaderProgram.textureCoordAttribute);

        shaderProgram.vertexNormalAttribute = gl.getAttribLocation(shaderProgram, "aVertexNormal");
        gl.enableVertexAttribArray(shaderProgram.vertexNormalAttribute);

        // lighting
        shaderProgram.ambientColorUniform = gl.getUniformLocation(shaderProgram, "uAmbientColor");
        shaderProgram.lightingDirectionUniform = gl.getUniformLocation(shaderProgram, "uLightingDirection");
        shaderProgram.directionalColorUniform = gl.getUniformLocation(shaderProgram, "uDirectionalColor");
        shaderProgram.pointLightingLocationUniform = gl.getUniformLocation(shaderProgram, "uPointLightingLocation");
        shaderProgram.pointLightingColorUniform = gl.getUniformLocation(shaderProgram, "uPointLightingColor");
    };

    var getShader = function(gl, id) {

        var shaderScript = document.getElementById(id);

        // Didn't find an element with the specified ID; abort.
        if (!shaderScript) {
            return null;
        }

        // Walk through the source element's children, building the
        // shader source string.
        var theSource = "";
        var currentChild = shaderScript.firstChild;

        while (currentChild) {
            if (currentChild.nodeType == 3) {
                theSource += currentChild.textContent;
            }

            currentChild = currentChild.nextSibling;
        }

        // Now figure out what type of shader script we have,
        // based on its MIME type.
        var shader;

        if (shaderScript.type == "x-shader/x-fragment") {
            shader = gl.createShader(gl.FRAGMENT_SHADER);
        } else if (shaderScript.type == "x-shader/x-vertex") {
            shader = gl.createShader(gl.VERTEX_SHADER);
        } else {
            return null; // Unknown shader type
        }

        // Send the source to the shader object
        gl.shaderSource(shader, theSource);

        // Compile the shader program
        gl.compileShader(shader);

        // See if it compiled successfully
        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            alert("An error occurred compiling the shaders: " + gl.getShaderInfoLog(shader));
            return null;
        }

        return shader;
    };

    var loadIdentity = function() {
        mvMatrix = Matrix.I(4);
    };

    var multMatrix = function(m) {
        mvMatrix = mvMatrix.x(m);
    };

    var mvTranslate = function(v) {
        multMatrix(Matrix.Translation($V([ v[0], v[1], v[2] ])).ensure4x4());
    };

    var setMatrixUniforms = function() {
        var pUniform = gl.getUniformLocation(shaderProgram, "uPMatrix");
        gl.uniformMatrix4fv(pUniform, false, new Float32Array(perspectiveMatrix.flatten()));

        var mvUniform = gl.getUniformLocation(shaderProgram, "uMVMatrix");
        gl.uniformMatrix4fv(mvUniform, false, new Float32Array(mvMatrix.flatten()));

        var normalMatrix = mvMatrix.inverse();
        normalMatrix = normalMatrix.transpose();
        var nUniform = gl.getUniformLocation(shaderProgram, "uNormalMatrix");
        gl.uniformMatrix4fv(nUniform, false, new Float32Array(normalMatrix.flatten()));
    };

    var mvPushMatrix = function(m) {
        if (m) {
            mvMatrixStack.push(m.dup());
            mvMatrix = m.dup();
        } else {
            mvMatrixStack.push(mvMatrix.dup());
        }
    };

    var mvPopMatrix = function() {
        if (!mvMatrixStack.length) {
            throw ("Can't pop from an empty matrix stack.");
        }
        mvMatrix = mvMatrixStack.pop();
        return mvMatrix;
    };

    var mvRotate = function(angle, v) {
        var inRadians = angle * Math.PI / 180.0;
        var m = Matrix.Rotation(inRadians, $V([ v[0], v[1], v[2] ])).ensure4x4();
        multMatrix(m);
    };

    return {
        init : init,
        setCurrentPage : setCurrentPage
    };

}();