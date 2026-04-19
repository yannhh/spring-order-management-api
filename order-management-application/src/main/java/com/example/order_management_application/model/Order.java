package com.example.order_management_application.model;

import java.util.Objects;

public class Order {

    private Integer id;
    private Integer customerId;
    private Integer productId;
    private Integer quantity;
    private OrderStatus status;

    public Order() {
    }

    public Order(Integer id, Integer customerId, Integer productId, Integer quantity, OrderStatus status) {
        this.id = id;
        this.customerId = customerId;
        this.productId = productId;
        this.quantity = quantity;
        this.status = status;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public Integer getCustomerId() {
        return customerId;
    }

    public void setCustomerId(Integer customerId) {
        this.customerId = customerId;
    }

    public Integer getProductId() {
        return productId;
    }

    public void setProductId(Integer productId) {
        this.productId = productId;
    }

    public Integer getQuantity() {
        return quantity;
    }

    public void setQuantity(Integer quantity) {
        this.quantity = quantity;
    }

    public OrderStatus getStatus() {
        return status;
    }

    public void setStatus(OrderStatus status) {
        this.status = status;
    }

    @Override
    public boolean equals(Object o) {
        // Comparing the object to itself to ensure they are the same
        if (this == o)
            return true;

        // Checks if the other object is null or is of different type
        // if its true, they cannot be equal
        if (o == null || getClass() != o.getClass())
            return false;

        // Typecasting the object to order type
        Order order = (Order) o;

        // Using Objects.equals here because I was getting null pointer exceps if ID
        // is null
        // This is to check if the fields match
        return Objects.equals(quantity, order.quantity) &&
                Objects.equals(id, order.id) &&
                Objects.equals(customerId, order.customerId) &&
                Objects.equals(productId, order.productId) &&
                status == order.status;
    }

    @Override
    // This is also using override
    // Same fields are hashed for the hashmap
    public int hashCode() {
        return Objects.hash(id, customerId, productId, quantity, status);
    }

    // Debug method
    // Printing the ids here and the quantity for terminal
    @Override
    public String toString() {
        return "Order{id=" + id + ", customerId=" + customerId + ", quantity=" + quantity + "}";
    }
}