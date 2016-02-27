package com.shau.stuff.controller;

import java.io.IOException;
import java.io.OutputStream;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

import com.shau.stuff.domain.DownloadItem;
import com.shau.stuff.service.ShauStuffService;

/**
 * 
 * @author SHAU Download VirtualTrigger audio unit
 *
 */

@Controller
public class DownloadItemController {

    @Autowired
    ShauStuffService shauStuffService;

    @RequestMapping("/shaufileview/**")
    public void downloadDownloadItem(HttpServletRequest request, HttpServletResponse response) {

        String searchKey = request.getParameter("searchKey");

        DownloadItem downloadItem = shauStuffService.downloadDownloadItem(searchKey);

        // os x gzip
        response.setCharacterEncoding("x-gzip");
        response.setContentType("application/x-tar");

        try {
            OutputStream os = response.getOutputStream();
            os.write(downloadItem.getDownloadItem());
            os.flush();
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}
