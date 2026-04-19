A robust RESTful web service built with **Java** and **Spring Boot**, designed for a drop-shipping retail environment. This project manages the full lifecycle of product orders, customer data, and administrative pricing, integrating with an external wholesaler's stock service.

Project Overview
Developed as an assignment, this application demonstrates the practical application of REST design principles in a distributed system. 

The service acts as a bridge between customers, a drop-shipping operator, and a third-party wholesaler, handling real-time price fluctuations and stock availability.

Features

Customer Interface
Product Discovery: List all products currently available for sale.
Order Management: Place orders for specific products and quantities.
Order Tracking: View history and real-time status (e.g., "Pending", "Shipped").
Cancellations: Cancel orders that have not yet been processed for shipping.

Operator (Admin) Dashboard
Order Fulfillment: Review customer details and update order statuses to "Shipped" or "Out of Stock."
Dynamic Pricing: Adjust retail prices (GBP) to respond to market changes.
Revenue Analytics: View total revenue generated per customer to identify high-value clients.
Secure Access: Protected endpoints ensuring only authorized operators can modify retail data.

Backend Logic
Wholesaler Integration: Consumes an external Stock Service API to track wholesale prices and inventory levels.
Automated Validation: Logic to handle out-of-stock scenarios and price volatility.

Tech Stack
Backend: Java 17+, Spring Boot
Data Persistence: Spring Data JPA (H2/PostgreSQL)
Frontend: HTML5, CSS3, JavaScript (Fetch API)
API Testing: Postman, cURL
Build Tool: Maven
