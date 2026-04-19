package com.example.order_management_application.model;

import java.util.Objects;

public class Product {

    // [AI] AI suggested I change these to wrapper classes because the primitive
    // data types have problems parsing and handling null values from database
    private Integer id;
    private String item_description;
    private Double price;
    private String databaseId;

    public Product() {
    }

    public Product(Integer id, String item_description, Double price, String databaseId) {
        this.id = id;
        this.item_description = item_description;
        this.price = price;
        this.databaseId = databaseId;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getItemDesc() {
        return item_description;
    }

    public void setItemDesc(String item_description) {
        this.item_description = item_description;
    }

    public Double getPrice() {
        return price;
    }

    public void setPrice(Double price) {
        this.price = price;
    }

    public String getDatabaseId() {
        return databaseId;
    }

    public void setDatabaseId(String databaseId) {
        this.databaseId = databaseId;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o)
            return true;
        if (o == null || getClass() != o.getClass())
            return false;
        Product product = (Product) o;
        return Objects.equals(price, product.price) &&
                Objects.equals(id, product.id) &&
                Objects.equals(item_description, product.item_description);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, item_description, price);
    }

    @Override
    public String toString() {
        return "Product{id=" + id + ", desc='" + item_description + "', price=" + price + ", extId='" + databaseId
                + "'}";
    }
}