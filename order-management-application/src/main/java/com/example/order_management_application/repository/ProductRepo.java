package com.example.order_management_application.repository;

import org.springframework.jdbc.core.*;
import org.springframework.stereotype.Repository;

import com.example.order_management_application.model.Product;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.List;
import java.util.Optional; // mitigate null pointer exceptions  

@Repository
public class ProductRepo {

    private final JdbcTemplate jdbcTemplate;

    public ProductRepo(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    // row mapper to convert the result into product object
    private final RowMapper<Product> productRowMapper = new RowMapper<Product>() {
        @Override
        public Product mapRow(ResultSet result, int rowNum) throws SQLException {
            Product product = new Product();
            product.setId(result.getInt("id"));
            product.setItemDesc(result.getString("item_description"));
            product.setPrice(result.getDouble("price"));
            product.setDatabaseId(result.getString("databaseId"));
            return product;
        }
    };

    // return all products from database
    public List<Product> findAllProducts() {
        String sql = "SELECT * FROM product";
        return jdbcTemplate.query(sql, productRowMapper);
    }

    // find a single product using the id
    public Optional<Product> findProductId(int id) {
        String sql = "SELECT * FROM product WHERE id = ?";
        try {
            Product product = jdbcTemplate.queryForObject(sql, productRowMapper, id);
            return Optional.of(product);
        } catch (org.springframework.dao.EmptyResultDataAccessException e) {
            return Optional.empty();
        }
    }

    // to update price of a product
    public int updatePrice(Integer id, Double updatedPrice) {
        String sql = "UPDATE product SET price = ? WHERE id = ?";
        return jdbcTemplate.update(sql, updatedPrice, id);
    }

    // [AI] prompted ai for help here because my SQL value parameters were incorrect
    // and not passing values properly
    // add new product
    public int addProduct(Product product) {
        String sql = "INSERT INTO product (item_description, price, databaseId) VALUES (?, ?, ?)";
        return jdbcTemplate.update(sql, product.getItemDesc(), product.getPrice(), product.getDatabaseId());
    }

    // delete product using product id
    public int deleteProduct(int id) {
        String sql = "DELETE FROM product WHERE id = ?";
        return jdbcTemplate.update(sql, id);
    }

}
