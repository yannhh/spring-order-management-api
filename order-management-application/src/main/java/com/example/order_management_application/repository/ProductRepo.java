package com.example.order_management_application.repository;

import org.springframework.jdbc.core.*;
import org.springframework.stereotype.Repository;

import com.example.order_management_application.model.Product;

import java.util.List;
import java.util.Optional; // Mitigate null pointer exceptions  

@Repository
public class ProductRepo {

    private final JdbcTemplate jdbcTemplate;

    public ProductRepo(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    // Row mapper to convert the result into product object
    private final RowMapper<Product> productRowMapper = (result, rowNum) -> {
    Product p = new Product();
    p.setId(result.getInt("id"));
    p.setItemDesc(result.getString("item_description"));
    p.setPrice(result.getDouble("price"));
    p.setDatabaseId(result.getString("databaseId"));
    p.setImageUrl(result.getString("image_url")); 
    p.setCategory(result.getString("category"));
    p.setSku(result.getString("sku"));
    p.setStockStatus(result.getString("stock_status"));
    return p;
};

    // Return all products from database
    public List<Product> findAllProducts() {
        String sql = "SELECT * FROM product";
        return jdbcTemplate.query(sql, productRowMapper);
    }

    // Find a single product using the id
    public Optional<Product> findProductId(int id) {
        String sql = "SELECT * FROM product WHERE id = ?";
        try {
            Product product = jdbcTemplate.queryForObject(sql, productRowMapper, id);
            return Optional.of(product);
        } catch (org.springframework.dao.EmptyResultDataAccessException e) {
            return Optional.empty();
        }
    }

    // To update price of a product
    public int updatePrice(Integer id, Double updatedPrice) {
        String sql = "UPDATE product SET price = ? WHERE id = ?";
        return jdbcTemplate.update(sql, updatedPrice, id);
    }

    // To update product information
    public int updateProduct(Integer id, Product product) {
        String sql = "UPDATE product SET item_description = ?, price = ?, image_url = ?, category = ?, sku = ?, stock_status = ? WHERE id = ?";
        return jdbcTemplate.update(sql, 
            product.getItemDesc(), 
            product.getPrice(), 
            product.getImageUrl(), 
            product.getCategory(), 
            product.getSku(), 
            product.getStockStatus(), 
            id
        );
    }

    // Add new product
    public int addProduct(Product product) {
        String sql = "INSERT INTO product (item_description, price, databaseId, image_url, category, sku, stock_status) VALUES (?, ?, ?, ?, ?, ?, ?)";
        return jdbcTemplate.update(sql, 
            product.getItemDesc(), 
            product.getPrice(), 
            product.getDatabaseId(),
            product.getImageUrl(),
            product.getCategory(),
            product.getSku(),
            product.getStockStatus()
        );
    }

    // delete product using product id
    public int deleteProduct(int id) {
        String sql = "DELETE FROM product WHERE id = ?";
        return jdbcTemplate.update(sql, id);
    }

}
