package com.shau.stuff.controller;

import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import javax.servlet.http.HttpServletRequest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

import com.shau.stuff.domain.TransportStop;
import com.shau.stuff.service.KmlService;

/**
 * 
 * @author SHAU Map data is accessed from the Web (this site), iOS and Android
 *         Apps
 *
 */

@Controller
public class KmlController {

    private SimpleDateFormat dateFormat = new SimpleDateFormat("dd-MM-yyyy hh:mm:ss");

    @Autowired
    private KmlService kmlService;

    @RequestMapping(value = "/kml/**")
    public HttpEntity<byte[]> loadGeometry(HttpServletRequest request) {

        // request URL in form
        // /servletmapping/layer1key/layer2key/query?BBOX.....
        // this data is consumed by web and mobile
        String servletPath = request.getServletPath();
        String kml = null;

        try {

            String bbox = request.getParameter("BBOX");
            String searchParameter = request.getParameter("SEARCH_PARAMETER");

            if (bbox != null && bbox.length() > 0) {

                // KML MAP SEARCH
                List<String> stopTypes = getStopTypesFromUrl(servletPath);

                String[] splitbbox = bbox.split(",");
                Float west = Float.valueOf(splitbbox[0]);
                Float south = Float.valueOf(splitbbox[1]);
                Float east = Float.valueOf(splitbbox[2]);
                Float north = Float.valueOf(splitbbox[3]);

                // DO QUERY
                List<TransportStop> searchResults = kmlService.loadTransportData(stopTypes, west, south, east, north);
                Date lastUpdate = kmlService.getLastDataUpdate();

                if (searchResults.size() > 100) {
                    // throttle results
                    searchResults = new ArrayList<TransportStop>();
                }

                kml = generateKml(searchResults, lastUpdate);

            } else if (searchParameter != null && searchParameter.length() > 0) {

                // SEARCH SEARCH
                // DO QUERY
                List<TransportStop> searchResults = kmlService.searchTransportData(searchParameter);

                if (searchResults.size() > 50) {
                    // throttle results
                    searchResults = searchResults.subList(0, 50);
                }

                kml = generateKml(searchResults, new Date());
            }

        } catch (Exception e) {
            e.printStackTrace();
        }

        HttpHeaders header = new HttpHeaders();
        header.setContentType(MediaType.parseMediaType("application/vnd.google-earth.kml+xml"));
        header.setContentLength(kml.getBytes().length);

        return new HttpEntity<byte[]>(kml.getBytes(), header);
    }

    private List<String> getStopTypesFromUrl(String servletPath) {

        List<String> stopTypes = new ArrayList<String>();

        String rawtypes = servletPath.substring(servletPath.lastIndexOf("kml") + 4);

        String[] split = rawtypes.split("/");

        for (int i = 0; i < split.length; i++) {
            stopTypes.add(split[i]);
        }

        return stopTypes;
    }

    private String generateKml(List<TransportStop> geometries, Date lastUpdateDate) {

        StringBuffer kml = new StringBuffer();

        String sLastUpdate = dateFormat.format(lastUpdateDate);

        kml.append("<?xml version=\"1.0\" encoding=\"UTF-8\"?>");
        kml.append("<kml xmlns=\"http://www.google.com/earth/kml/2\">");

        kml.append("<Document>");
        kml.append("<name>SHAU Map</name>");
        kml.append("<description>SHAU MAP Geometries</description>");
        kml.append("<LastDataUpdate>" + sLastUpdate + "</LastDataUpdate>");

        for (TransportStop geometry : geometries) {

            kml.append("<Placemark>");
            kml.append("<name>" + geometry.getId() + "</name>");

            // Geometry
            kml.append("<Point>");

            Float latitude = geometry.getLatitude();
            Float longitude = geometry.getLongitude();

            kml.append("<coordinates>" + latitude + "," + longitude + "</coordinates>");
            kml.append("</Point>");

            // Metadata - order is important
            kml.append("<ExtendedData>");
            kml.append("<Data name=\"stopType\">");
            kml.append("<value>" + geometry.getStopType() + "</value>");
            kml.append("</Data>");
            kml.append("<Data name=\"stopName\">");
            kml.append("<value>" + geometry.getStopName() + "</value>");
            kml.append("</Data>");
            kml.append("<Data name=\"stopRoute\">");
            kml.append("<value>" + geometry.getStopRoute() + "</value>");
            kml.append("</Data>");
            kml.append("<Data name=\"stopId\">");
            kml.append("<value>" + geometry.getStopId() + "</value>");
            kml.append("</Data>");

            kml.append("</ExtendedData>");
            kml.append("</Placemark>");
        }

        kml.append("</Document>");
        kml.append("</kml>");

        // System.out.println("kml:" + kml.toString());

        return cleanUpXml(kml.toString());
    }

    private String cleanUpXml(String xml) {
        String result = xml.replaceAll("&", "and");
        return result;
    }
}
