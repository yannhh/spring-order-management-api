from flask import Flask, jsonify, abort

app = Flask(__name__)

# Simulated Wholesaler Database
wholesaler_products = {
    "p1": {"id": "1", "in_stock": 50, "price": 10.00},
    "p2": {"id": "2", "in_stock": 5, "price": 25.50},
    "p3": {"id": "3", "in_stock": 0, "price": 15.00}
}

@app.route('/wss/product/<product_id>', methods=['GET'])
def get_product(product_id):

    product = wholesaler_products.get(product_id)
    
    if product:
        return jsonify(product)
    
    # Returns 404 if the product ID is not in the mock dictionary
    abort(404, description="Product not found in wholesaler database")

if __name__ == '__main__':
    print("Initializing Mock Service for Wholesaler Database")

    print("Accessible at: http://localhost:5000/wss/product/")

    app.run(host='0.0.0.0', port=5000, debug=True)