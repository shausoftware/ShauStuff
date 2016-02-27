package com.shau.stuff.domain;

import java.io.Serializable;

public class CssColour implements Serializable {

    private static final long serialVersionUID = 1L;

    private String css;
    private Integer red;
    private Integer green;
    private Integer blue;

    public CssColour(String cssColour) {

        this.css = cssColour;

        cssColour = cssColour.substring(1);

        red = Integer.parseInt(cssColour.substring(0, 2), 16);
        green = Integer.parseInt(cssColour.substring(2, 4), 16);
        blue = Integer.parseInt(cssColour.substring(4), 16);
    }

    public String getCss() {
        return css;
    }

    public void setCss(String css) {
        this.css = css;
    }

    public Integer getRed() {
        return red;
    }

    public void setRed(Integer red) {
        this.red = red;
    }

    public Integer getGreen() {
        return green;
    }

    public void setGreen(Integer green) {
        this.green = green;
    }

    public Integer getBlue() {
        return blue;
    }

    public void setBlue(Integer blue) {
        this.blue = blue;
    }
}
