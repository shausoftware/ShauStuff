var form3d = function() {

    var initForm3d = function() {

        var config = {
            width : 900,
            height : 600,
            params : {
                enableDebugging : "0"
            }
        };
        var u = new UnityObject2(config);
        u.observeProgress(function(progress) {
            var $missingScreen = jQuery(progress.targetEl).find(".missing");
            switch (progress.pluginStatus) {
            case "unsupported":
                showUnsupported();
                break;
            case "broken":
                alert("You will need to restart your browser after installation.");
                break;
            case "missing":
                $missingScreen.find("a").click(function(e) {
                    e.stopPropagation();
                    e.preventDefault();
                    u.installPlugin();
                    return false;
                });
                $missingScreen.show();
                break;
            case "installed":
                $missingScreen.remove();
                break;
            case "first":
                break;
            }
        });
        u.initPlugin(jQuery("#unityPlayer")[0], "/unity/Form3D_Release_1_2.unity3d");
    };

    return {
        initForm3d : initForm3d
    };

}();