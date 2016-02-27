package com.shau.stuff.service;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.shau.stuff.dao.CachedLocationDao;
import com.shau.stuff.dao.KmlDao;
import com.shau.stuff.domain.TransportStop;

@Service("kmlService")
public class KmlService {

    @Autowired
    private KmlDao kmlDao;

    @Autowired
    private CachedLocationDao cachedLocationDao;

    // kml search for map
    public List<TransportStop> loadTransportData(List<String> stopTypes, float minX, float minY, float maxX, float maxY) {

        List<TransportStop> results = kmlDao.loadTransportData(stopTypes, minX, minY, maxX, maxY);

        return results;
    }

    // search
    public List<TransportStop> searchTransportData(String searchParameter) {

        List<TransportStop> results = new ArrayList<TransportStop>();

        String locationSearchTerm = searchParameter.replaceAll("%20", "");
        locationSearchTerm = locationSearchTerm.replaceAll(" ", "");
        locationSearchTerm = locationSearchTerm.replaceAll("&", "and");
        locationSearchTerm = locationSearchTerm.replaceAll("'", "");

        results.addAll(cachedLocationDao.geocodeSearch(locationSearchTerm));

        String transportSearchTerm = searchParameter.replaceAll("%20", " ");
        transportSearchTerm = transportSearchTerm.replaceAll("&", "and");
        transportSearchTerm = transportSearchTerm.replaceAll("'", "");

        results.addAll(kmlDao.searchTransportData(transportSearchTerm));

        return results;
    }

    public Date getLastDataUpdate() {
        return kmlDao.getLastDataUpdate();
    }
}
