package com.example.order_management_application.service;

import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import com.example.order_management_application.model.DatabaseProducts;

@Service
public class DatabaseService {

    private final RestTemplate restTemplate;

    // The curl command for access to wholesaler database
    private final String db = "https://pmaier.eu.pythonanywhere.com/wss/product/";

    public DatabaseService(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    // RestTemplate so I can map the wholesaler
    // database product id to the java object
    public DatabaseProducts stockAvailable(String databaseId) {
        // Makes a get request to the db URL to check fr the product ID
        return restTemplate.getForObject(db + databaseId, DatabaseProducts.class);
    }
}
