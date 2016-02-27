package com.shau.stuff.dao;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import org.hibernate.Criteria;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.hibernate.criterion.Restrictions;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import com.shau.stuff.domain.LastUpdate;
import com.shau.stuff.domain.TransportStop;

@Component("kmlDao")
@Transactional
public class KmlDao {

    @Autowired
    private SessionFactory sessionFactory;

    public Session session() {
        return sessionFactory.getCurrentSession();
    }

    @SuppressWarnings("unchecked")
    public List<TransportStop> loadTransportData(List<String> stopTypes, float minX, float minY, float maxX, float maxY) {

        List<TransportStop> results = new ArrayList<TransportStop>();

        for (String stopType : stopTypes) {

            Criteria criteria = session().createCriteria(TransportStop.class);
            criteria.add(Restrictions.eq("stopType", stopType));
            criteria.add(Restrictions.ge("latitude", minY));
            criteria.add(Restrictions.le("latitude", maxY));
            criteria.add(Restrictions.ge("longitude", minX));
            criteria.add(Restrictions.le("longitude", maxX));

            results.addAll(criteria.list());
        }

        return results;
    }

    @SuppressWarnings("unchecked")
    public List<TransportStop> searchTransportData(String searchParameter) {

        searchParameter = "%" + searchParameter;
        searchParameter += "%";

        Criteria criteria = session().createCriteria(TransportStop.class);
        criteria.add(Restrictions.or(Restrictions.like("stopRoute", searchParameter), Restrictions.like("stopName", searchParameter)));

        return criteria.list();
    }

    @SuppressWarnings("unchecked")
    public Date getLastDataUpdate() {

        Date lastUpdate = null;

        Criteria criteria = session().createCriteria(LastUpdate.class);
        List<LastUpdate> results = criteria.list();

        if (results != null && results.size() > 0) {
            lastUpdate = results.get(0).getLastUpdate();
        }

        return lastUpdate;
    }
}
