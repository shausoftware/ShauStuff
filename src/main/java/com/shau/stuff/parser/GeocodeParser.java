package com.shau.stuff.parser;

import java.util.ArrayList;
import java.util.List;

import org.xml.sax.Attributes;
import org.xml.sax.SAXException;
import org.xml.sax.helpers.DefaultHandler;

import com.shau.stuff.domain.CachedLocation;
import com.shau.stuff.util.ShauConstants;

public class GeocodeParser extends DefaultHandler implements ShauConstants {

    private boolean inResult = false;
    private boolean inFormattedResult = false;
    private boolean inGeometry = false;
    private boolean inLocation = false;
    private boolean inLatitude = false;
    private boolean inLongitude = false;

    private String searchTerm = null;
    private List<CachedLocation> results = new ArrayList<CachedLocation>();
    private CachedLocation currentLocation;

    public GeocodeParser(String searchTerm) {
        this.searchTerm = searchTerm;
    }

    public List<CachedLocation> getLocations() {

        List<CachedLocation> ukLocations = new ArrayList<CachedLocation>();

        // check if locations are in UK
        for (CachedLocation location : results) {
            if (location.getLatitude() > 49.871159f && location.getLatitude() < 55.811741f) {
                if (location.getLongitude() > -6.379880 && location.getLongitude() < 1.768960) {
                    ukLocations.add(location);
                }
            }
        }

        return ukLocations;
    }

    @Override
    public void startDocument() throws SAXException {
        results = new ArrayList<CachedLocation>();
    }

    @Override
    public void endDocument() throws SAXException {
    }

    @Override
    public void startElement(String namespaceURI, String localName, String qName, Attributes atts) throws SAXException {

        if (ELEM_RESULT.equals(qName)) {

            // create new geometry for list
            currentLocation = new CachedLocation();
            currentLocation.setStopType(CATEGORY_LOCATION);
            currentLocation.setStopId(searchTerm);
            currentLocation.setSearchTerm(searchTerm);
            inResult = true;

        } else if (ELEM_FORMATTED_ADDRESS.equals(qName)) {
            inFormattedResult = true;
        } else if (ELEM_GEOMETRY.equals(qName)) {
            inGeometry = true;
        } else if (ELEM_LOCATION.equals(qName)) {
            inLocation = true;
        } else if (ELEM_LATITUDE.equals(qName)) {
            inLatitude = true;
        } else if (ELEM_LONGITUDE.equals(qName)) {
            inLongitude = true;
        }
    }

    @Override
    public void endElement(String namespaceURI, String localName, String qName) throws SAXException {

        if (ELEM_RESULT.equals(qName)) {

            // finished with current geometry
            results.add(currentLocation);
            inResult = false;

        } else if (ELEM_FORMATTED_ADDRESS.equals(qName)) {
            inFormattedResult = false;
        } else if (ELEM_GEOMETRY.equals(qName)) {
            inGeometry = false;
        } else if (ELEM_LOCATION.equals(qName)) {
            inLocation = false;
        } else if (ELEM_LATITUDE.equals(qName)) {
            inLatitude = false;
        } else if (ELEM_LONGITUDE.equals(qName)) {
            inLongitude = false;
        }
    }

    @Override
    public void characters(char ch[], int start, int length) {

        if (inResult) {

            if (inFormattedResult) {

                String formattedAddress = new String(ch, start, length);
                currentLocation.setStopName(formattedAddress);
                currentLocation.setStopRoute(formattedAddress);

            } else if (inGeometry) {

                if (inLocation) {

                    if (inLatitude) {
                        currentLocation.setLatitude(Float.valueOf(new String(ch, start, length)));
                    } else if (inLongitude) {
                        currentLocation.setLongitude(Float.valueOf(new String(ch, start, length)));
                    }
                }
            }
        }
    }
}
