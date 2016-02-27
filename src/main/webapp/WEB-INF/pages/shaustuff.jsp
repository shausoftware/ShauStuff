<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>

<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    
    <meta name="description" content="SHAUSTUFF is a platform for my experiments in HTML5, Javascript, WebGL, Java, Spring, Map APIs and Unity. All of the source code for this site is shared on GitHub.">
    
    <!-- The above 3 meta tags *must* come first in the head; any other head content must come *after* thes tags -->
    <title>SHAU Stuff</title>

    <!-- Bootstrap -->
    <link href="/css/bootstrap.min.css" rel="stylesheet">
                        
    <!-- HTML5 shim and Respond.js for IE8 support of HTML5 elements and media queries -->
    <!-- WARNING: Respond.js doesn't work if you view the page via file:// -->
    <!--[if lt IE 9]>
    <script src="https://oss.maxcdn.com/html5shiv/3.7.2/html5shiv.min.js"></script>
    <script src="https://oss.maxcdn.com/respond/1.4.2/respond.min.js"></script>
    <![endif]-->
    
    <!-- Customise Bootstrap -->
    <link href="/shaucss" rel="stylesheet">
    
    <!-- Unity Loader -->
    <script type="text/javascript">
    <!--
        var unityObjectUrl = "http://webplayer.unity3d.com/download_webplayer-3.x/3.0/uo/UnityObject2.js";
        if (document.location.protocol == 'https:')
        unityObjectUrl = unityObjectUrl.replace("http://", "https://ssl-");
        document.write('<script type="text/javascript" src="' + unityObjectUrl + '"></script>');
    -->
    </script>
    
    <!-- WebGL Fragment shader program -->
    <script id="shader-fs" type="x-shader/x-fragment">
      varying highp vec2 vTextureCoord;
      varying highp vec3 vLighting;

      uniform sampler2D uSampler;

      void main(void) {
        highp vec4 texelColor = texture2D(uSampler, vec2(vTextureCoord.s, vTextureCoord.t));

        gl_FragColor = vec4(texelColor.rgb * vLighting, texelColor.a);
      }
    </script>

    <!-- WebGL Vertex shader program -->
    <script id="shader-vs" type="x-shader/x-vertex">
      attribute highp vec3 aVertexNormal;
      attribute highp vec3 aVertexPosition;
      attribute highp vec2 aTextureCoord;

      uniform highp mat4 uNormalMatrix;
      uniform highp mat4 uMVMatrix;
      uniform highp mat4 uPMatrix;
      
      uniform vec3 uAmbientColor;
      uniform vec3 uLightingDirection;
      uniform vec3 uDirectionalColor;
      uniform vec3 uPointLightingLocation;
      uniform vec3 uPointLightingColor;

      varying highp vec2 vTextureCoord;
      varying highp vec3 vLighting;

      void main(void) {
        
        vec4 mvPosition = uMVMatrix * vec4(aVertexPosition, 1.0);
        gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition, 1.0);
        vTextureCoord = aTextureCoord;
        vec3 lightDirection = normalize(uPointLightingLocation - mvPosition.xyz);
        highp vec4 transformedNormal = uNormalMatrix * vec4(aVertexNormal, 1.0);

        //Positional
        highp float positional = max(dot(transformedNormal.xyz, lightDirection), 0.0);

        //Directional
        highp float directional = max(dot(transformedNormal.xyz, uLightingDirection), 0.0);

        //combine
        //vLighting = uAmbientColor + (uPointLightingColor * positional) + (uDirectionalColor * directional);
        vLighting = uAmbientColor + (uPointLightingColor * positional);
      }
    </script>
    
    <!-- Google Maps Javascript API -->
    <script type="text/javascript" src="https://maps.googleapis.com/maps/api/js?key=Your Google Maps JavaScript API Key"></script>
    
  </head>
  
  <body id="shaubody">
  
    <input type="hidden" id="csscolour" value="${cssColour.css}">
    <input type="hidden" id="cssred" value="${cssColour.red}">
    <input type="hidden" id="cssgreen" value="${cssColour.green}">
    <input type="hidden" id="cssblue" value="${cssColour.blue}">
  
    <div class="container">
    
        <div class="row">

            <span class="shauheaderpartleft">
                <h1>More stuff on the Internet</h1>
            </span>
        
            <span class="shauheaderpartright">
                <canvas id="shaulogocanvas" width="350px" height="90px" ></canvas>
            </span>

        </div>
        
        <div class="row">

            <nav class="navbar navbar-default">
                <div class="container-fluid">
                    <!-- Brand and toggle get grouped for better mobile display -->
                    <div class="navbar-header">
                        <button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#bs-example-navbar-collapse-1" aria-expanded="false">
                            <span class="sr-only">Toggle navigation</span>
                            <span class="icon-bar"></span>
                            <span class="icon-bar"></span>
                            <span class="icon-bar"></span>
                        </button>
                        <a class="navbar-brand" href="#">
                        <canvas id="glcanvas" width="48px" height="38px" class="navbar-brand-canvas"></canvas>
                        </a>
                    </div>
                    
                    <!-- Collect the nav links, forms, and other content for toggling -->
                    <div class="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
                        <ul class="nav navbar-nav">
                            <li id="menuHome"class="active"><a href="#" onclick="shaustuff.loadContent('/html/home.html');">Home <span class="sr-only">(current)</span></a></li>
                            <li id="menuForm3D"><a href="#" onclick="shaustuff.loadContent('/html/form3d.html');">Form 3D</a></li>
                            <li id="menuJuliaSet"><a href="#" onclick="shaustuff.loadContent('/html/shaujulia.html');">Julia Set</a></li>
                            <li id="menuVirtualTrigger"><a href="#" onclick="shaustuff.loadContent('/html/shauvt.html');">Virtual Trigger</a></li>
                            <li id="menuMap"><a href="#" onclick="shaustuff.loadContent('/html/map.html');">Map</a></li>
                            <li id="menuLinks"><a href="#" onclick="shaustuff.loadContent('/html/links.html');">Links</a></li>
                        </ul>
                    </div><!-- /.navbar-collapse -->
                </div><!-- /.container-fluid -->
            </nav>

        </div>

        <div class="row">
            <div id="content" class="shaucontent">
                Undefined
            </div>
        </div>
        
        <div class="row">
        
            <p class="text-center">         
                The user interface for this site has been implemented using the marvelous Bootstrap CSS toolkit.
                You can change the colour scheme of this site by using the colour picker and colour gradient picker, then click the "Update Css" 
                links to override the Bootstrap CSS.
            </p>
            
        </div>

        <div class="row">
            
            <div class="footertext">
                
                <p>
                    <b>SHAU - Software Development since the Dark Ages</b> <br>
                    Contact: info@shaustuff.com
                </p>
                               
            </div>
    
            <div class="footercolourpicker">
                <div class="colourpickercontrol">
                    <div id="colourbutton" class="colourbutton" onclick="shaustuff.updateSiteCss();" title="Click to update CSS"></div>
                    <div id="updatecss" class="colourpickercontrolname"><a href="#" onclick="shaustuff.updateSiteCss();" class="shaulink">Update CSS</a></div>
                    <input id="colourvalue" type="hidden" />
                </div>
                <div id="hsmappanel" class="hsmappanel">
                    <canvas id="hsmapcanvas" class="hsmapcanvas" width="90px" height="50px"></canvas>
                    <canvas id="hsgradientcanvas" class="hsgradientcanvas" width="15px" height="50px"></canvas>
                </div>
            </div>      

        </div>
            
    </div>
    
    <div id="device-size">
        <div id="xs" class="visible-xs"></div>
        <div id="sm" class="visible-sm"></div>
        <div id="md" class="visible-md"></div>
        <div id="lg" class="visible-lg"></div>
    </div>
        
    <!-- jQuery (necessary for Bootstrap's JavaScript plugins) -->
    <script src="/js/jquery.js"></script>
    <!-- Include all compiled plugins (below), or include individual files as needed -->
    <script src="/js/bootstrap.min.js"></script>
    <script src="/js/sylvester.js"></script>
    <script src="/js/glUtils.js"></script>
    <script src="/js/glMatrix-0.9.5.min.js"></script>

    <script src="/js/shaustuffsite.min.js"></script>
<!--  
    <script src="/js/webgl.js"></script>
    <script src="/js/shaustuff.js"></script>
    <script src="/js/shauslideshow.js"></script>
    <script src="/js/shaujuliaset.js"></script>
    <script src="/js/form3d.js"></script>
    <script src="/js/shaugeometry.js"></script>
    <script src="/js/shaumap.js"></script>
    <script src="/js/shaulinks.js"></script>
-->

    <script>
        $(document).ready(shaustuff.initialiseSite());
    </script>

  </body>

</html>