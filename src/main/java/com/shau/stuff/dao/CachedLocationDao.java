package com.shau.stuff.dao;

import java.net.URL;
import java.net.URLConnection;
import java.util.ArrayList;
import java.util.List;

import javax.xml.parsers.SAXParser;
import javax.xml.parsers.SAXParserFactory;

import org.hibernate.Criteria;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.hibernate.criterion.Restrictions;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;
import org.xml.sax.InputSource;
import org.xml.sax.XMLReader;

import com.shau.stuff.domain.CachedLocation;
import com.shau.stuff.domain.TransportStop;
import com.shau.stuff.parser.GeocodeParser;

@Component("cachedLocationDao")
@Transactional
public class CachedLocationDao {

    @Autowired
    private SessionFactory sessionFactory;

    public Session session() {
        return sessionFactory.getCurrentSession();
    }

    public List<TransportStop> geocodeSearch(String searchTerm) {

        searchTerm = searchTerm.toLowerCase();

        List<TransportStop> results = new ArrayList<TransportStop>();

        // check cache first
        List<CachedLocation> cachedLocations = searchCache(searchTerm);

        if (cachedLocations != null && cachedLocations.size() > 0) {

            // have cached results
            // do nothing

        } else {

            // no cached results
            // use google geocoder
            String geocodeUrl = "https://maps.googleapis.com/maps/api/geocode/xml?address=" + searchTerm + "&region=uk&components=country:GB&key=Your Google Geocode API Key";

            try {
                final URL url = new URL(geocodeUrl);
                final URLConnection conn = url.openConnection();
                conn.setReadTimeout(15000); // timeout for reading the kml data:
                                            // 15 secs
                conn.connect();

                SAXParserFactory spf = SAXParserFactory.newInstance();
                SAXParser sp = spf.newSAXParser();

                XMLReader xr = sp.getXMLReader();
                GeocodeParser geocodeParser = new GeocodeParser(searchTerm);
                xr.setContentHandler(geocodeParser);

                xr.parse(new InputSource((url.openStream())));

                cachedLocations = geocodeParser.getLocations();

                // DEBUG OUTPUT
                // System.out.println("DONE GEOCODE SIZE:" +
                // cachedLocations.size());
                /*
                 * BufferedReader br = new BufferedReader(new
                 * InputStreamReader(url.openStream())); String line; while
                 * ((line = br.readLine()) != null) { System.out.println(line);
                 * }
                 */

                // save new locations to cache
                saveNewLocationsToCache(cachedLocations);

            } catch (Exception e) {
                e.printStackTrace();
            }
        }

        for (CachedLocation cachedLocaction : cachedLocations) {
            results.add(cachedLocaction.generateTransportStop());
        }

        return results;
    }

    @SuppressWarnings("unchecked")
    private List<CachedLocation> searchCache(String searchTerm) {

        Criteria criteria = session().createCriteria(CachedLocation.class);
        criteria.add(Restrictions.like("searchTerm", searchTerm));

        return criteria.list();
    }

    private void saveNewLocationsToCache(List<CachedLocation> locations) {
        for (CachedLocation location : locations) {
            session().saveOrUpdate(location);
        }
    }
}
