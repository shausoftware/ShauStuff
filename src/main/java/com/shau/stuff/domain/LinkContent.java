package com.shau.stuff.domain;

import java.io.Serializable;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "link_item")
public class LinkContent implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @Column(name = "id")
    private Integer id;

    @Column(name = "display_order")
    private Integer displayOrder;

    @Column(name = "title")
    private String title;

    @Column(name = "prose")
    private String prose;

    @Column(name = "link_url")
    private String linkUrl;

    @Column(name = "link_text")
    private String linkText;

    @Column(name = "local_link")
    private Boolean localLink;

    @Column(name = "detail_page")
    private String detailPage;

    @Column(name = "embedded_link")
    private Boolean embeddedLink;

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public Integer getDisplayOrder() {
        return displayOrder;
    }

    public void setDisplayOrder(Integer displayOrder) {
        this.displayOrder = displayOrder;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getProse() {
        return prose;
    }

    public void setProse(String prose) {
        this.prose = prose;
    }

    public String getLinkUrl() {
        return linkUrl;
    }

    public void setLinkUrl(String linkUrl) {
        this.linkUrl = linkUrl;
    }

    public String getLinkText() {
        return linkText;
    }

    public void setLinkText(String linkText) {
        this.linkText = linkText;
    }

    public Boolean getLocalLink() {
        return localLink;
    }

    public void setLocalLink(Boolean localLink) {
        this.localLink = localLink;
    }

    public String getDetailPage() {
        return detailPage;
    }

    public void setDetailPage(String detailPage) {
        this.detailPage = detailPage;
    }

    public Boolean getEmbeddedLink() {
        return embeddedLink;
    }

    public void setEmbeddedLink(Boolean embeddedLink) {
        this.embeddedLink = embeddedLink;
    }
}
