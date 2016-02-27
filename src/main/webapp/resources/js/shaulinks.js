var shaulinks = function() {

    var LINKS_PER_PAGE = 5;
    var linksData;
    var nLinks = 0;
    var nPages = 0;

    var loadLinks = function() {

        $.ajax({
            type : "GET",
            url : "/loadlinks",
            dataType : 'json',
            timeout : 300000,
            success : function(data) {

                initLinkData(data);
                loadPage(1);
            },
            error : function(e) {
                alert("ERROR: ", e);
            },
            done : function(e) {
                alert("DONE");
            }
        });

    };

    var initLinkData = function(data) {

        linksData = data;
        nLinks = data.length;

        nPages = parseInt(nLinks / LINKS_PER_PAGE);
        if ((nLinks / LINKS_PER_PAGE) > nPages) {
            nPages = nPages + 1;
        }
    };

    var loadPage = function(page) {

        var pageHTML = "";
        var nStart = LINKS_PER_PAGE * (page - 1); // lists 0 based
        var nEnd = nStart + LINKS_PER_PAGE;

        for (var i = nStart; i < nEnd; i++) {

            if (i < nLinks) {
                var link = linksData[i];
                if (link.embeddedLink) {
                    pageHTML = pageHTML + generateEmbeddedLinkPanel(link);
                } else {
                    pageHTML = pageHTML + generateLinkPanel(link);
                }
            }
        }

        $("#linkscontainer").html(pageHTML);

        updatePagination(page);
    };

    var updatePagination = function(currentPage) {

        var paginationHTML = "<nav><ul class='pagination'>";

        // previous page
        if (currentPage === 1) {
            // disabled
            paginationHTML += "<li id='pagePrevious' class='disabled'><a href='#' aria-label='Previous'><span aria-hidden='true'>&laquo;</span></a></li>";
        } else {
            paginationHTML += "<li id='pagePrevious'><a href='#' aria-label='Previous' onclick='shaulinks.loadPage(" + (currentPage - 1) + ");'><span aria-hidden='true'>&laquo;</span></a></li>";
        }

        // page links
        for (var i = 0; i < nPages; i++) {
            if (currentPage === (i + 1)) {
                // selected
                paginationHTML += "<li class='active' id='page" + (i + 1) + "'><a href='#' onclick='shaulinks.loadPage(" + (i + 1) + ");'>" + (i + 1) + "</a></li>";
            } else {
                paginationHTML += "<li id='page" + (i + 1) + "'><a href='#' onclick='shaulinks.loadPage(" + (i + 1) + ");'>" + (i + 1) + "</a></li>";
            }
        }

        // next page
        if (currentPage === (nPages)) {
            // disabled
            paginationHTML += "<li id='pageNext' class='disabled'><a href='#' aria-label='Next'><span aria-hidden='true'>&raquo;</span></a></li>";
        } else {
            paginationHTML += "<li id='pageNext'><a href='#' aria-label='Next' onclick='shaulinks.loadPage(" + (currentPage + 1) + ");'><span aria-hidden='true'>&raquo;</span></a></li>";
        }

        paginationHTML += "</ul></nav>";

        $("#paginationcontainer").html(paginationHTML);
    };

    /**
     * Normal Link
     */
    var generateLinkPanel = function(link) {

        var listPanelHTML = '<div class="panel panel-default">';

        listPanelHTML = listPanelHTML + '<div class="panel-heading">';
        listPanelHTML = listPanelHTML + link.title;
        listPanelHTML = listPanelHTML + '</div>';

        listPanelHTML = listPanelHTML + '<div class="panel-body">';
        listPanelHTML = listPanelHTML + '<p class="text-center">';
        listPanelHTML = listPanelHTML + link.prose;
        listPanelHTML = listPanelHTML + '</p>';
        listPanelHTML = listPanelHTML + '<p class="text-center">';
        listPanelHTML = listPanelHTML + '<a href="#" onclick="window.open(\'' + link.linkUrl + '\');" class="shaulink" >';
        listPanelHTML = listPanelHTML + link.linkText;
        listPanelHTML = listPanelHTML + '</a>';
        listPanelHTML = listPanelHTML + '</p>';
        listPanelHTML = listPanelHTML + '</div>';

        listPanelHTML = listPanelHTML + '</div>';

        return listPanelHTML;
    };

    /**
     * SoundCloud Link
     */
    var generateEmbeddedLinkPanel = function(link) {

        var listPanelHTML = '<div class="panel panel-default">';

        listPanelHTML = listPanelHTML + '<div class="panel-heading">';
        listPanelHTML = listPanelHTML + link.title;
        listPanelHTML = listPanelHTML + '</div>';

        listPanelHTML = listPanelHTML + '<div class="panel-body">';
        listPanelHTML = listPanelHTML + '<p class="text-center">';
        listPanelHTML = listPanelHTML + link.prose;
        listPanelHTML = listPanelHTML + '</p>';

        listPanelHTML = listPanelHTML
                + '<iframe width="100%" height="450" scrolling="no" frameborder="no" src="https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/73786781&amp;auto_play=false&amp;hide_related=false&amp;show_comments=true&amp;show_user=true&amp;show_reposts=false&amp;visual=true">';
        listPanelHTML = listPanelHTML + '</iframe>';

        listPanelHTML = listPanelHTML + '</div>';

        listPanelHTML = listPanelHTML + '</div>';

        return listPanelHTML;
    };

    loadLinks();

    return {
        loadPage : loadPage
    };

}();