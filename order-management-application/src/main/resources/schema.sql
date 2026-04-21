DROP TABLE IF EXISTS customer_orders;
DROP TABLE IF EXISTS product;
DROP TABLE IF EXISTS customer;

CREATE TABLE customer (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    address VARCHAR(255)    
);

CREATE TABLE product (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    item_description VARCHAR(255) NOT NULL, 
    price DECIMAL(10, 2) NOT NULL,
    databaseId VARCHAR (255),
    image_url VARCHAR (255)
);

CREATE TABLE customer_orders (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    customer_id BIGINT NOT NULL,
    product_id BIGINT NOT NULL,
    quantity INT NOT NULL,
    status VARCHAR(50) NOT NULL,
    FOREIGN KEY (customer_id) REFERENCES customer(id),
    FOREIGN KEY (product_id) REFERENCES product(id)
);