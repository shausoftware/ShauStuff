package com.shau.stuff.domain;

import java.io.Serializable;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "cached_location")
public class CachedLocation implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @Column(name = "id")
    private Integer id;

    @Column(name = "search_term")
    private String searchTerm;

    @Column(name = "stop_type")
    private String stopType;

    @Column(name = "stop_name")
    private String stopName;

    @Column(name = "stop_route")
    private String stopRoute;

    @Column(name = "stop_id")
    private String stopId;

    @Column(name = "latitude")
    private float latitude;

    @Column(name = "longitude")
    private float longitude;

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public TransportStop generateTransportStop() {
        TransportStop transportStop = new TransportStop();
        transportStop.setStopName(stopName);
        transportStop.setStopRoute(stopRoute);
        transportStop.setStopId(stopId);
        transportStop.setStopType(stopType);
        transportStop.setLatitude(latitude);
        transportStop.setLongitude(longitude);
        return transportStop;
    }

    public String getSearchTerm() {
        return searchTerm;
    }

    public void setSearchTerm(String searchTerm) {
        this.searchTerm = searchTerm;
    }

    public String getStopType() {
        return stopType;
    }

    public void setStopType(String stopType) {
        this.stopType = stopType;
    }

    public String getStopName() {
        return stopName;
    }

    public void setStopName(String stopName) {
        this.stopName = stopName;
    }

    public String getStopRoute() {
        return stopRoute;
    }

    public void setStopRoute(String stopRoute) {
        this.stopRoute = stopRoute;
    }

    public String getStopId() {
        return stopId;
    }

    public void setStopId(String stopId) {
        this.stopId = stopId;
    }

    public float getLatitude() {
        return latitude;
    }

    public void setLatitude(float latitude) {
        this.latitude = latitude;
    }

    public float getLongitude() {
        return longitude;
    }

    public void setLongitude(float longitude) {
        this.longitude = longitude;
    }
}
