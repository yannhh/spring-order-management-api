package com.example.order_management_application.repository;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;
import com.example.order_management_application.model.Order;
import com.example.order_management_application.model.OrderStatus;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.List;
import java.util.Optional;

@Repository
public class OrderRepo {

    private final JdbcTemplate jdbcTemplate;

    public OrderRepo(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    private final RowMapper<Order> orderRowMapper = new RowMapper<Order>() {
        @Override
        public Order mapRow(ResultSet result, int rowNum) throws SQLException {
            Order order = new Order();
            order.setId(result.getInt("id"));
            order.setCustomerId(result.getInt("customer_id"));
            order.setProductId(result.getInt("product_id"));
            order.setQuantity(result.getInt("quantity"));

            String statusStr = result.getString("status");
            if (statusStr != null) {
                order.setStatus(OrderStatus.valueOf(statusStr.toUpperCase()));
            }
            return order;
        }
    };

    // Finding the order using the customer id
    public Optional<Order> findOrderById(int id) {
        String sql = "SELECT * FROM customer_orders WHERE id = ?";
        try {
            Order order = jdbcTemplate.queryForObject(sql, orderRowMapper, id);
            return Optional.of(order);
        } catch (org.springframework.dao.EmptyResultDataAccessException e) {
            return Optional.empty();
        }
    }

    // Finding a customer using their id
    public List<Order> findOrderByCustomerId(int customerId) {
        String sql = "SELECT * FROM customer_orders WHERE customer_id = ?";
        return jdbcTemplate.query(sql, orderRowMapper, customerId);
    }

    // Select all query to get all orders from all customers
    public List<Order> findAllOrders() {
        String sql = "SELECT * FROM customer_orders";
        return jdbcTemplate.query(sql, orderRowMapper);
    }

    // SQL query to save the order
    public int saveOrder(Order order) {
        String sql = "INSERT INTO customer_orders (customer_id, product_id, quantity, status) VALUES (?, ?, ?, ?)";
        return jdbcTemplate.update(sql,
                order.getCustomerId(), order.getProductId(), order.getQuantity(), order.getStatus().name());
    }

    // Updates status field
    public int updateStatus(int orderId, OrderStatus updatedStatus) {
        String sql = "UPDATE customer_orders SET status = ? WHERE id = ?";
        return jdbcTemplate.update(sql, updatedStatus.name(), orderId);
    }
}