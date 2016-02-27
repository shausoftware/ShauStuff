package com.shau.stuff.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.shau.stuff.domain.LinkContent;
import com.shau.stuff.service.ShauStuffService;

@RestController
public class LinksController {

    @Autowired
    private ShauStuffService shauStuffService;

    @RequestMapping(value = "/loadlinks", method = RequestMethod.GET)
    public List<LinkContent> loadAllLinks() {
        List<LinkContent> allLinks = shauStuffService.getAllLinkContent();
        return allLinks;
    }
}
