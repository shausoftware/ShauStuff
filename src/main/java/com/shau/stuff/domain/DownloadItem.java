package com.shau.stuff.domain;

import java.io.Serializable;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Lob;
import javax.persistence.Table;

@Entity
@Table(name = "download_item")
public class DownloadItem implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @Column(name = "id")
    private Integer id;

    @Column(name = "search_key")
    private String searchKey;

    @Lob
    @Column(name = "download_item")
    private byte[] downloadItem;

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getSearchKey() {
        return searchKey;
    }

    public void setSearchKey(String searchKey) {
        this.searchKey = searchKey;
    }

    public byte[] getDownloadItem() {
        return downloadItem;
    }

    public void setDownloadItem(byte[] downloadItem) {
        this.downloadItem = downloadItem;
    }
}
