package com.shau.stuff.dao;

import org.hibernate.Criteria;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.hibernate.criterion.Restrictions;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import com.shau.stuff.domain.DownloadItem;

@Component("downloadItemDao")
@Transactional
public class DownloadItemDao {

    @Autowired
    private SessionFactory sessionFactory;

    public Session session() {
        return sessionFactory.getCurrentSession();
    }

    public DownloadItem downloadDownloadItem(String searchKey) {

        Criteria criteria = session().createCriteria(DownloadItem.class);
        criteria.add(Restrictions.eq("searchKey", searchKey));

        return (DownloadItem) criteria.uniqueResult();
    }
}
