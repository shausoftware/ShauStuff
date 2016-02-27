package com.shau.stuff.service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.shau.stuff.dao.DownloadItemDao;
import com.shau.stuff.dao.LinkContentDao;
import com.shau.stuff.domain.DownloadItem;
import com.shau.stuff.domain.LinkContent;

@Service("shauStuffService")
public class ShauStuffService {

    @Autowired
    private LinkContentDao linkContentDao;

    @Autowired
    private DownloadItemDao downloadItemDao;

    private List<LinkContent> allLinks = new ArrayList<LinkContent>();

    public void loadAllLinkContent() {
        allLinks = linkContentDao.loadAllLinkContentItems();
    }

    public List<LinkContent> getAllLinkContent() {
        return allLinks;
    }

    public DownloadItem downloadDownloadItem(String searchKey) {
        return downloadItemDao.downloadDownloadItem(searchKey);
    }
}
