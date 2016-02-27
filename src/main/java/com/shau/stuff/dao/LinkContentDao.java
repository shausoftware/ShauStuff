package com.shau.stuff.dao;

import java.util.ArrayList;
import java.util.List;

import org.hibernate.Criteria;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.hibernate.criterion.Order;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import com.shau.stuff.domain.LinkContent;

@Component("linkContentDao")
@Transactional
public class LinkContentDao {

    @Autowired
    private SessionFactory sessionFactory;

    public Session session() {
        return sessionFactory.getCurrentSession();
    }

    @SuppressWarnings("unchecked")
    public List<LinkContent> loadAllLinkContentItems() {

        List<LinkContent> results = new ArrayList<LinkContent>();

        try {
            Criteria criteria = session().createCriteria(LinkContent.class);
            criteria.addOrder(Order.asc("displayOrder"));
            results = criteria.list();
        } catch (Exception e) {
            e.printStackTrace();
        }

        return results;
    }
}
