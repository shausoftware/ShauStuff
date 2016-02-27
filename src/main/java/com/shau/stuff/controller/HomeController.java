package com.shau.stuff.controller;

import javax.servlet.http.HttpSession;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import com.shau.stuff.domain.CssColour;
import com.shau.stuff.service.ShauStuffService;
import com.shau.stuff.util.ShauConstants;

@Controller
public class HomeController implements ShauConstants {

    @Autowired
    private ShauStuffService shauStuffService;

    @RequestMapping(value = "/", method = RequestMethod.GET)
    public String loadShauStuff(HttpSession session, Model model) {

        // initialise link content
        shauStuffService.loadAllLinkContent();

        // default CSS - white
        CssColour currentCssColour = new CssColour("#FFFFFF");

        String sessionCss = (String) session.getAttribute(SESSION_CSS_COLOUR_KEY);
        if (sessionCss != null && sessionCss.length() > 0) {
            currentCssColour = new CssColour(sessionCss);
        }

        model.addAttribute("cssColour", currentCssColour);

        return "shaustuff";
    }
}
