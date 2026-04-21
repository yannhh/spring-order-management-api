// API route
const api_URL = "http://localhost:8080/api";

// Automatically attach the adminKey required by OrderController
const DEFAULT_HEADERS = {
  "Content-Type": "application/json",
  adminKey: "Ryan!23",
};

// Mock authentication; developing this later!
export const currentUser = async () => {
  const savedId = localStorage.getItem("userId");
  const savedRole = localStorage.getItem("userRole");

  // If no data exists, the user is not logged in
  if (!savedId) return null;

  try {
    const response = await fetch(`${api_URL}/customers/${savedId}`, {
      headers: DEFAULT_HEADERS,
    });

    if (!response.ok) throw new Error("User not found");

    const customer = await response.json();

    return {
      id: savedId,
      name: savedRole === "admin" ? "Admin Ryan" : "Customer User",
      email: `customer${savedId}@email.com`,
      role: savedRole || "Customer",
    };
  } catch (error) {
    return {
      id: savedId,
      name: savedRole === "admin" ? "Admin Ryan" : "Customer User",
      email: `customer${savedId}@email.com`,
      role: savedRole || "Customer",
    };
  }
};

// Fetching Products
export const fetchProducts = async () => {
  const response = await fetch(`${api_URL}/products`, {
    method: "GET",
    headers: DEFAULT_HEADERS,
  });

  if (!response.ok) throw new Error("Failed to get the products");

  const data = await response.json();

  const productList = data._embedded
    ? data._embedded.productList
    : Array.isArray(data)
      ? data
      : [data];

  return productList.map((p) => ({
    id: p.id,
    name: p.itemDesc,
    sku: p.sku || `SKU-${p.id}`,
    retail_price: p.price,
    wholesale_price: p.wholesalePrice || p.price * 0.7, // Mock if missing
    category: p.category || "other",
    stock_status: p.stockStatus || "in_stock",
    is_active: p.isActive !== undefined ? p.isActive : true,
    image_url:
      p.imageUrl ||
      "https://thetoolshedinc.com/wp-content/uploads/2014/11/tsinterior1.jpg",
  }));
};

// Creating product
export const createProduct = async (productData) => {
  const payload = {
    itemDesc: productData.name,
    price: productData.retail_price,
    imageUrl: productData.image_url,
    sku: productData.sku,
    category: productData.category,
    stockStatus: productData.stock_status,
  };
  const response = await fetch(`${api_URL}/products`, {
    method: "POST",
    headers: DEFAULT_HEADERS,
    body: JSON.stringify(payload),
  });
  if (!response.ok) throw new Error("Failed to create product");

  return response.text();
};

// Updating a product
export const updateProduct = async (id, productData) => {
  const payload = {
    itemDesc: productData.name,
    price: productData.retail_price,
    imageUrl: productData.image_url,
    sku: productData.sku,
    category: productData.category,
    stockStatus: productData.stock_status,
  };

  const response = await fetch(`${api_URL}/products/${id}`, {
    method: "PUT",
    headers: DEFAULT_HEADERS,
    body: JSON.stringify(payload),
  });
  if (!response.ok) throw new Error("Failed to update product");

  return response.text();
};

// Fetching Order
export const fetchOrders = async () => {
  const response = await fetch(`${api_URL}/orders`, {
    method: "GET",
    headers: DEFAULT_HEADERS,
  });

  if (!response.ok) throw new Error("Failed to get the orders");
  const data = await response.json();

  // Map order fields to the dashboard UI
  return data.map((o) => ({
    id: o.id,
    status: o.status.toLowerCase(),
    total_amount: o.quantity * 100,
    customer_email: `customer${o.customerId}@email.com`,
  }));
};

// Creating order
export const createOrder = async (orderData) => {
  const response = await fetch(`${api_URL}/orders`, {
    method: "POST",
    headers: DEFAULT_HEADERS,
    body: JSON.stringify(orderData),
  });
  if (!response.ok) throw new Error("Failed to create order");
  return response.json();
};

// Cancelling the order
export const cancelOrder = async () => {
  const response = await fetch(`${api_URL}/orders/cancel`, {
    method: "POST",
    headers: DEFAULT_HEADERS,
  });

  if (!response.ok) throw new Error("Failed to cancel the order");
  return true;
};

// Updating Orders
export const updateOrder = async (id, data) => {
  const response = await fetch(`${api_URL}/orders/${id}`, {
    method: "PUT",
    headers: DEFAULT_HEADERS,
    body: JSON.stringify(data),
  });

  if (!response.ok) throw new Error("Failed to update the order");
  return response.json();
};

// Deleting product
export const deleteProduct = async (id) => {
  const response = await fetch(`${api_URL}/products/${id}`, {
    method: "DELETE",
    headers: DEFAULT_HEADERS,
  });

  if (!response.ok) throw new Error("Failed to delete the product");
  return true;
};
