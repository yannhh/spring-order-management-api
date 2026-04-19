package com.example.order_management_application.repository;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.Optional;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import com.example.order_management_application.model.Customer;

@Repository
public class CustomerRepo {

    private final JdbcTemplate jdbcTemplate;

    public CustomerRepo(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    private final RowMapper<Customer> customerRowMapper = new RowMapper<Customer>() {
        @Override
        public Customer mapRow(ResultSet result, int rowNum) throws SQLException {
            Customer customer = new Customer();
            customer.setId(result.getInt("id"));
            customer.setName(result.getString("name"));
            customer.setEmail(result.getString("email"));
            customer.setAddress(result.getString("address"));
            return customer;
        }
    };

    public Optional<Customer> findCustomerId(int id) {
        String sql = "SELECT * FROM customer WHERE id = ?";
        try {
            Customer customer = jdbcTemplate.queryForObject(sql, customerRowMapper, id);
            return Optional.of(customer);
        } catch (org.springframework.dao.EmptyResultDataAccessException e) {
            return Optional.empty();
        }
    }

    public double calculateRevenue(int customerId) {
        String sql = "SELECT SUM(p.price * o.quantity) " +
                "FROM customer_orders o " +
                "JOIN product p on o.product_id = p.id " +
                "WHERE o.customer_id = ? AND o.status = 'SHIPPED'";

        // double class handles cases if value returned is null
        Double total = jdbcTemplate.queryForObject(sql, Double.class, customerId);
        return (total == null) ? 0.0 : total;
    }

}
