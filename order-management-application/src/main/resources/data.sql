INSERT INTO customer (name, email, address) VALUES
('Arthur Morgan', 'MorganTest@gmail.com', 'Saint Denis City'),
('Peter Parker', 'SpiderMan@gmail.com', 'New York City'),
('Gumball Watterson', 'Gumball@gmail.com', 'Elmore Street');

INSERT INTO product (item_description, price, databaseId) VALUES
('power drill 800W', 100.50, 'E5XMZ2LC'),
('heavy-duty cordless power drill 200W', 170.50, 'RKXAM3GZ'),
('lightweight power drill 400W', 150.99, 'DSIGEM4N');

INSERT INTO customer_orders (customer_id, product_id, quantity, status) VALUES
(1, 1, 5, 'PENDING'),
(2, 2, 1, 'SHIPPED');

