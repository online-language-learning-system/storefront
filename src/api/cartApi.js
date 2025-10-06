// src/api/cartApi.js
const BASE_URL = "http://localhost:8000/api/cart-service";

function getAuthHeaders() {
  const accessToken = localStorage.getItem("accessToken");
  const token = accessToken || localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}


export async function getCart() {
  const headers = getAuthHeaders();
  if (!headers.Authorization) {
    // chưa login thì trả về giỏ rỗng thay vì gọi API
    return { items: [] };
  }

  const res = await fetch(`${BASE_URL}/storefront/cart/view`, {
    headers: {
      Accept: "application/json",
      ...headers,
    },
    credentials: "include",
  });
  if (!res.ok) {
    const txt = await safeText(res);
    throw new Error(txt || "Lỗi khi lấy giỏ hàng");
  }
  return res.json();
}

export async function addToCart(courseId, quantity = 1) {
  const res = await fetch(`${BASE_URL}/storefront/cart/items`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
    },
    body: JSON.stringify({
      courseId: Number(courseId),
      quantity: Number(quantity), 
    }),
    credentials: "include",
  });

  if (res.status === 409) {
    return { duplicated: true };
  }
  if (!res.ok) {
    const txt = await safeText(res);
    throw new Error(txt || "Lỗi khi thêm vào giỏ");
  }
  return res.json();
}

export async function removeFromCart(courseId) {
  const res = await fetch(`${BASE_URL}/storefront/cart/${courseId}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
    credentials: "include",
  });
  if (!res.ok) {
    const txt = await safeText(res);
    throw new Error(txt || "Lỗi khi gỡ khỏi giỏ");
  }
  return res.json();
}

async function safeText(res) {
  try {
    return await res.text();
  } catch (_) {
    return "";
  }
}
