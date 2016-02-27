package com.shau.stuff.controller;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;

import com.shau.stuff.domain.CssColour;
import com.shau.stuff.util.ShauConstants;

/**
 * 
 * @author SHAU Overrides Bootstrap CSS so that we can control it dynamically
 *
 */

@Controller
public class CssController implements ShauConstants {

    @RequestMapping("/updatecss")
    public String updateCss(HttpSession session, HttpServletRequest request, Model model) {

        String cssColourValue = request.getParameter("colourvalue");

        session.setAttribute(SESSION_CSS_COLOUR_KEY, cssColourValue);

        CssColour currentCssColour = new CssColour(cssColourValue);
        model.addAttribute("cssColour", currentCssColour);

        return "shaustuff";
    }

    @RequestMapping("/shaucss")
    public HttpEntity<byte[]> loadShauCss(HttpSession session) {

        String cssColour = null;
        String css = null;

        // see if css colour has been saved in current user session
        cssColour = (String) session.getAttribute(SESSION_CSS_COLOUR_KEY);
        if (cssColour == null) {
            // set it to initial colour WHITE
            cssColour = INITIAL_COLOUR;
        }

        css = generateCss(cssColour);

        HttpHeaders header = new HttpHeaders();
        header.setContentType(MediaType.parseMediaType("text/css"));
        header.setContentLength(css.getBytes().length);

        return new HttpEntity<byte[]>(css.getBytes(), header);
    }

    private String generateCss(String colour) {

        StringBuffer cssBuffer = new StringBuffer();

        /* generate foreground css colour to override bootstrap css */
        // general stuff
        cssBuffer.append("#shaubody {background-color:black; color:white;}");
        cssBuffer.append("h1 {color:white;}");
        cssBuffer.append(".panel {border-color:white!important;}");
        cssBuffer.append(".panel-heading {background-color:black!important; color:white!important; border-color:white!important;}");
        cssBuffer.append(".panel-body {background-color:black!important; color:white!important;}");
        cssBuffer.append(".shauheaderpartleft {float:left; margin-left:10px;}");
        cssBuffer.append(".shauheaderpartright {float:right;}");
        cssBuffer.append(".shaulink {color:#fff}");
        cssBuffer.append(".shaulink:hover, .shaulink:focus {color:white}");
        cssBuffer.append(".shauclosesearch {color:black;}");
        cssBuffer.append(".shauclosesearch:hover, .shauclosesearch:focus {color:black}");
        cssBuffer.append(".input-group-addon.primary {color:white; background-color:black; border-color:white;}");
        cssBuffer.append(".btn-primary {color:white; background-color:black; border-color:white;}");
        cssBuffer.append(".btn-primary:hover, .btn-primary:focus, .btn-primary:active, .btn-primary.active, .open > .dropdown-toggle.btn-primary {color:black; background-color:#fff; border-color:white;}");
        cssBuffer.append(".btn-primary:disabled {background:black; color:#777; border-color:white;}");
        cssBuffer.append(".table-striped > tbody > tr:nth-child(2n+1) > td, .table-striped > tbody > tr:nth-child(2n+1) > th {background-color:#222222;}");

        // navbar
        cssBuffer.append(".navbar-default {color:white!important; background-color:black!important; border-color:black!important;}");
        cssBuffer.append(".navbar-default .navbar-nav > li > a {color:#777;}");
        cssBuffer.append(".navbar-default .navbar-nav > li > a:hover,.navbar-default .navbar-nav > li > a:focus {color:white;}");
        cssBuffer.append(".navbar-default .navbar-nav > .active > a, .navbar-default .navbar-nav > .active > a:hover, .navbar-default .navbar-nav > .active > a:focus {color:black; background-color:white;}");
        cssBuffer.append(".navbar-default .navbar-nav > .open > a, .navbar-default .navbar-nav > .open > a:hover, .navbar-default .navbar-nav > .open > a:focus {color: black; background-color:white;}");
        cssBuffer.append(".navbar-default .navbar-brand {padding: 0;}");
        cssBuffer.append(".navbar-brand-canvas {margin-top: 7px; margin-left: 7px; margin-right: 7px;}");

        // pagination
        cssBuffer.append(".pagination {color:white!important; background-color:black!important; border-color:white!important;}");
        cssBuffer.append(".pagination > li > a {background:black; color:white; border-color:white;}");
        cssBuffer.append(".pagination > li > a:hover, .pagination > li > a:focus {background:#fff; color:black; border-color:white;}");
        cssBuffer.append(".pagination > li.active > a, .pagination > li.active > a:hover, .pagination > li.active > a:focus {background:white; color:black; border-color:white;}");
        cssBuffer.append(".pagination > li.disabled > a, .pagination > li.disabled > a:hover, .pagination > li.disabled > a:focus {background:black; color:#777; border-color:white;}");

        // content
        cssBuffer.append(".shaucontent {margin-left:20px; margin-right:20px;})");
        cssBuffer.append(".shaurow {width:100%; margin:2px;}");
        cssBuffer.append(".shauwebplayer {background-color:black; width:902px; height:650px; font-size:16px; text-align:center; border:2px solid white; margin-left:auto; margin-right:auto;}");
        cssBuffer.append(".maptoolbar {width: 100%; margin: 5px;}");
        cssBuffer.append(".mapsearch {width: 250px; margin: auto; padding 5px;}");

        // map
        cssBuffer.append(".gm-style-iw {width: 220px !important; height: 54px !important; top: 15px !important; left: 0 !important; background-color: black;  border: 1px solid white;border-radius: 4px 4px 4px 4px;}");
        cssBuffer.append(".iwcontainer {width: 216px; background-color: black;}");
        cssBuffer.append(".iwtitle {width: 216px; height: 26px; background-color: white; color: black; text-align: center; padding: 5px; margin: 2px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;}");
        cssBuffer.append(".iwtitlelink {color: black;}");
        cssBuffer.append(".iwtitlelink:hover, .iwtitlelink:focus {color: black;}");
        cssBuffer.append(".iwcontentlink {color: white;}");
        cssBuffer.append(".iwcontentlink:hover, .iwcontentlink:focus {color: #fff;}");

        cssBuffer.append(".shausearchresults {z-index:4; display:none; position:absolute; top:50px; left:30px; background-color:black; padding:2px; color:white; width:350px; border:2px solid white; border-radius:5px; text-align:center;}");
        cssBuffer.append(".shausearchresultsheader {width:100%; color:black; background-color:white; padding:3px;}");
        cssBuffer.append(".shauresultsrows {width:100%; text-align:left;}");
        cssBuffer.append(".shauresultsrow {width:100%; height: 38px; border:2px solid white; padding:2px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;}");
        cssBuffer.append(".juliasetwrapper {width:100%; text-align:center;}");

        // footer and colour picker
        cssBuffer.append(".footertext {float:left; width:calc(100% - 230px); text-align:center;}");
        cssBuffer.append(".footercolourpicker {float:right; margin:2px;}");
        cssBuffer.append(".colourpickercontrol {float:left; height:53px; width:102px; text-align:center;}");
        cssBuffer.append(".colourpickercontrolname {padding-top:10px;}");
        cssBuffer.append(".colourbutton {float:left; height:20px; width:98px; background-color:blue; border:solid 1px white; padding-bottom:10px;}");
        cssBuffer.append(".hsmappanel {float:left; width:120px; height:53px; display:block;}");
        cssBuffer.append(".hsmapcanvas {float:left; margin-left:4px; border:solid 1px white;}");
        cssBuffer.append(".hsgradientcanvas {float:left; margin-left:4px; border:solid 1px white;}");

        String css = cssBuffer.toString();
        css = css.replaceAll(COLOUR_REPLACEMENT_KEY, colour);

        // System.out.println(css);

        return css;
    }
}
