package com.example.order_management_application.controller;

import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.order_management_application.model.Order;
import com.example.order_management_application.model.OrderStatus;
import com.example.order_management_application.model.Product;
import com.example.order_management_application.repository.CustomerRepo;
import com.example.order_management_application.repository.OrderRepo;
import com.example.order_management_application.repository.ProductRepo;

// External database connection
import com.example.order_management_application.service.DatabaseService;
import com.example.order_management_application.model.DatabaseProducts;

import jakarta.servlet.http.HttpServletRequest;

@RestController
@RequestMapping("/api")
public class OrderController {

    // adminKey password for the HTTP prompt onclick
    private static final String adminKey = "Ryan!23";

    private final ProductRepo productRepository;
    private final CustomerRepo customerRepository;
    private final OrderRepo orderRepository;
    private final DatabaseService databaseService;

    // Constructor for product repository and the external wholesale database
    // service
    public OrderController(ProductRepo productRepository, CustomerRepo customerRepository, OrderRepo orderRepository,
            DatabaseService databaseService) {
        this.productRepository = productRepository;
        this.customerRepository = customerRepository;
        this.orderRepository = orderRepository;
        this.databaseService = databaseService;
    }

    // Security check for admin access
    private boolean adminAccess(HttpServletRequest request) {
        String key = request.getHeader("adminKey");
        return adminKey.equals(key);
    }

    // Show all products to the customer
    @GetMapping("/products")
    public List<Product> showProducts() {
        return productRepository.findAllProducts();
    }

    // Create order to also check the stock of wholesaler database and
    // then calculating profitability
    // customer can create order
    @PostMapping("/orders")
    public ResponseEntity<?> createOrder(@RequestBody Order newOrder) {

        // Checking if the product exists in my database
        Optional<Product> productOptional = productRepository.findProductId(newOrder.getProductId());

        if (productOptional.isEmpty()) {
            return new ResponseEntity<>("Product not found", HttpStatus.NOT_FOUND);
        }

        Product product = productOptional.get();

        // If the product has database id, it will check the wholesaler database
        if (product.getDatabaseId() != null) {
            System.out.println("Checking product ID in Database: " + product.getDatabaseId());
        }

        // This will get the stock and price from the external database
        DatabaseProducts externalInformation = databaseService.stockAvailable(product.getDatabaseId());

        // If the wholesaler price in the external database is higher compared to my
        // price it will stop order
        if (externalInformation.getPrice() > product.getPrice()) {
            System.out.println("Price too high." + externalInformation.getPrice() + "> Retail: " + product.getPrice());
            return new ResponseEntity<>("Unprofitable Order because the price is too high.", HttpStatus.BAD_REQUEST);
        }

        // Terminal print just to check how much stock there currently is because I
        // didnt implement that in the web pages
        System.out.println("STOCK LEVEL IS: " + externalInformation.getInStock());

        // Checking stock when creating order, this ensures there actually is enough
        // stock
        // I would probably set a threshold stock here in the future
        if (externalInformation.getInStock() < newOrder.getQuantity()) {
            return new ResponseEntity<>("Order Failed: Out of Stock", HttpStatus.BAD_REQUEST);
        }

        // If all check statements are good, the status will update to pending and save
        // to
        // my database
        newOrder.setStatus(OrderStatus.PENDING);
        orderRepository.saveOrder(newOrder);
        return new ResponseEntity<>(newOrder, HttpStatus.CREATED);
    }

    // Customers can view their order
    @GetMapping("/customers/{id}/orders")
    public ResponseEntity<List<Order>> getCustomerOrder(@PathVariable int id) {

        // Validation if the customer exists, this will just find the id
        if (customerRepository.findCustomerId(id).isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        List<Order> orders = orderRepository.findOrderByCustomerId(id);
        return new ResponseEntity<>(orders, HttpStatus.OK);
    }

    // Customer can cancel their order, IF it hasn't been shipped
    @PostMapping("/orders/{id}/cancel")
    public ResponseEntity<String> cancelOrder(@PathVariable int id) {
        Optional<Order> orderOptional = orderRepository.findOrderById(id);

        if (orderOptional.isEmpty()) {
            return new ResponseEntity<>("Error: Order was not found.", HttpStatus.NOT_FOUND);
        }

        Order order = orderOptional.get();

        // Logic handler, in case the customer tries to cancel an order thats already
        // shipped
        if (order.getStatus() == OrderStatus.SHIPPED) {
            return new ResponseEntity<>("Order has been shipped. Cannot Cancel Order.", HttpStatus.BAD_REQUEST);
        }

        orderRepository.updateStatus(id, OrderStatus.CANCELLED);
        return new ResponseEntity<>("Order " + id + " Cancelled", HttpStatus.OK);
    }

    // Operator add product
    @PostMapping("/products")
    public ResponseEntity<String> addProduct(@RequestBody Product newProduct, HttpServletRequest request) {

        // API key check
        if (!adminAccess(request)) {
            return new ResponseEntity<>("Error: Admin Key not Found", HttpStatus.UNAUTHORIZED);
        }

        productRepository.addProduct(newProduct);
        return new ResponseEntity<>("Success. Product has been added", HttpStatus.CREATED);
    }

    // Operator remove product
    @DeleteMapping("/products/{id}")
    public ResponseEntity<String> deleteProduct(@PathVariable int id, HttpServletRequest request) {
        if (!adminAccess(request)) {
            return new ResponseEntity<>("Error: Admin Key not Found", HttpStatus.UNAUTHORIZED);
        }

        int rows = productRepository.deleteProduct(id);
        if (rows > 0) {
            return new ResponseEntity<>("Success! Product Deleted", HttpStatus.OK);
        } else {
            return new ResponseEntity<>("Error: Product was not found.", HttpStatus.NOT_FOUND);
        }
    }

    // Operator view all orders from customers
    @GetMapping("/orders")
    public ResponseEntity<?> getAllOrders(HttpServletRequest request) {
        if (!adminAccess(request)) {
            return new ResponseEntity<>("Error: Admin Key not Found", HttpStatus.UNAUTHORIZED);
        }
        return new ResponseEntity<>(orderRepository.findAllOrders(), HttpStatus.OK);
    }

    // Operator change customer order status
    @PutMapping("/orders/{id}/status")
    public ResponseEntity<String> updateOrderStatus(@PathVariable int id,
            @RequestBody Map<String, String> statusUpdate, HttpServletRequest request) {

        if (!adminAccess(request)) {
            return new ResponseEntity<>("Error: Admin Key not Found", HttpStatus.UNAUTHORIZED);
        }

        Optional<Order> orderOptional = orderRepository.findOrderById(id);

        if (orderOptional.isEmpty()) {
            return new ResponseEntity<>("Order was not found", HttpStatus.NOT_FOUND);
        }

        try { // Converting the string to eNUM because it was returning null and parse errors
            String updatedStatus = statusUpdate.get("status");
            OrderStatus newStatus = OrderStatus.valueOf(updatedStatus.toUpperCase());

            orderRepository.updateStatus(id, newStatus);
            return new ResponseEntity<>("Order " + id + " status updated to " + newStatus, HttpStatus.OK);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>("Invalid status", HttpStatus.BAD_REQUEST);
        }
    }

    // Operator update prices
    @PutMapping("/products/{id}/price")
    public ResponseEntity<String> updatePrice(@PathVariable int id, @RequestBody Map<String, Double> priceUpdate,
            HttpServletRequest request) {
        if (!adminAccess(request)) {
            return new ResponseEntity<>("Error: Admin Key not Found", HttpStatus.UNAUTHORIZED);
        }

        if (productRepository.findProductId(id).isEmpty()) {
            return new ResponseEntity<>("Product not found", HttpStatus.NOT_FOUND);
        }

        Double updatedPrice = priceUpdate.get("price");
        if (updatedPrice == null || updatedPrice < 0) {
            return new ResponseEntity<>("Invalid Price", HttpStatus.BAD_REQUEST);
        }

        productRepository.updatePrice(id, updatedPrice);
        return new ResponseEntity<>("Product " + id + " price updated", HttpStatus.OK);
    }

    // Calculate the revenue using SQL query in CustomerRepo
    // class
    // Operator view customer revenue
    @GetMapping("/customers/{id}/revenue")
    public ResponseEntity<?> getRevenue(@PathVariable int id, HttpServletRequest request) {
        if (!adminAccess(request)) {
            return new ResponseEntity<>("Error: Admin Key not Found", HttpStatus.UNAUTHORIZED);
        }

        if (customerRepository.findCustomerId(id).isEmpty()) {
            return new ResponseEntity<>("Customer ID was not found", HttpStatus.NOT_FOUND);
        }

        double revenue = customerRepository.calculateRevenue(id);

        return new ResponseEntity<>(Map.of("customerId", id, "totalRevenue", revenue), HttpStatus.OK);
    }

}
