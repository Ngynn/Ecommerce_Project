import axios from "axios";

const API_URL = "http://localhost:9000/store";
const PUBLISHABLE_KEY =
  "pk_f39b41d09e59ef35a32f1f1608cace1f3e6916954f0701c83aedc38ccf9912e4";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "x-publishable-api-key": PUBLISHABLE_KEY,
  },
  withCredentials: true, // cho phép gửi cookie (dùng cho session cart)
});

/* ---------------- SẢN PHẨM ---------------- */
export async function fetchProducts() {
  try {
    const res = await api.get("/products?limit=1000");
    return res.data.products;
  } catch (err) {
    console.error("fetchProducts error:", err);
    return [];
  }
}

export async function fetchProductById(id) {
  const res = await api.get(`/products/${id}`);
  return res.data.product;
}

/* ---------------- GIỎ HÀNG ---------------- */
export async function createCart() {
  const res = await api.post("/carts", {});
  return res.data.cart;
}

export async function fetchCartDetail(cartId) {
  const res = await api.get(`/carts/${cartId}`);
  return res.data.cart;
}

export async function addToCart(cartId, variantId, quantity = 1) {
  const res = await api.post(`/carts/${cartId}/line-items`, {
    variant_id: variantId,
    quantity,
  });
  return res.data.cart;
}

export async function updateCartItem(cartId, lineId, quantity) {
  const res = await api.put(`/carts/${cartId}/line-items/${lineId}`, {
    quantity,
  });
  return res.data.cart;
}

export async function removeCartItem(cartId, lineId) {
  const res = await api.delete(`/carts/${cartId}/line-items/${lineId}`);
  return res.data.cart;
}

/* ---------------- AUTH ---------------- */

// ✅ Đăng ký
export async function registerCustomer(data) {
  try {
    const res = await api.post("/auth/emailpass/register", data);
    return res.data.customer;
  } catch (err) {
    throw err.response?.data || err;
  }
}

// ✅ Đăng nhập
export async function loginCustomer(email, password) {
  try {
    const res = await api.post("/auth/emailpass", { email, password });
    return res.data.customer;
  } catch (err) {
    throw err.response?.data || err;
  }
}

// ✅ Lấy thông tin customer hiện tại
export async function getCurrentCustomer() {
  try {
    const res = await api.get("/customers/me");
    return res.data.customer;
  } catch (err) {
    throw err.response?.data || err;
  }
}

// ✅ Đăng xuất
export async function logoutCustomer() {
  try {
    await api.delete("/auth/session");
    return true;
  } catch (err) {
    throw err.response?.data || err;
  }
}

// ✅ Cập nhật profile
export async function updateCustomerProfile(data) {
  try {
    const res = await api.post("/customers/me", data);
    return res.data.customer;
  } catch (err) {
    throw err.response?.data || err;
  }
}

// ✅ Đổi mật khẩu
export async function changeCustomerPassword(oldPassword, newPassword) {
  try {
    const res = await api.post("/auth/emailpass/update", {
      old_password: oldPassword,
      new_password: newPassword,
    });
    return res.data.customer;
  } catch (err) {
    throw err.response?.data || err;
  }
}

/* ---------------- THANH TOÁN ---------------- */
export async function createPaymentCollection(cartId) {
  const res = await api.post(`/payment-collections`, { cart_id: cartId });
  return res.data.payment_collection;
}

export async function addPaymentSession(collectionId, providerId) {
  const res = await api.post(
    `/payment-collections/${collectionId}/payment-sessions`,
    { provider_id: providerId }
  );
  return res.data.payment_collection;
}

export async function completePayment(collectionId) {
  const res = await api.post(`/payment-collections/${collectionId}/complete`);
  return res.data.order;
}

/* ---------------- ORDERS ---------------- */
export async function fetchOrderById(orderId) {
  const res = await api.get(`/orders/${orderId}`);
  return res.data.order;
}

// ✅ Lấy danh sách đơn hàng (phải login)
export async function fetchOrders(customerToken) {
  const authApi = axios.create({
    baseURL: API_URL,
    headers: {
      "x-publishable-api-key": PUBLISHABLE_KEY,
      Authorization: `Bearer ${customerToken}`,
    },
  });

  const res = await authApi.get(`/orders`);
  return res.data.orders;
}
