package com.example.order_management_application.model;

import com.fasterxml.jackson.annotation.JsonProperty;

public class DatabaseProducts {

    private String id;

    @JsonProperty("in_stock") // Json property because my stock variable would always be 0
    
    private int in_stock;

    private double price;

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public int getInStock() {
        return in_stock;
    }

    public void setInStock(int in_stock) {
        this.in_stock = in_stock;
    }

    public double getPrice() {
        return price;
    }

    public void setPrice(double price) {
        this.price = price;
    }

}
