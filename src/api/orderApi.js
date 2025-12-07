const BASE_URL = "http://localhost:8000/api/order-service"; 

function getAuthHeaders() {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function createOrder(orderData) {
  try {
    const res = await fetch(`${BASE_URL}/storefront/order`, { 
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeaders(),
      },
      body: JSON.stringify(orderData),
    });

    if (!res.ok) {
      const errText = await res.text();
      throw new Error("Tạo order thất bại: " + errText);
    }

    return await res.json();
  } catch (error) {
    console.error("❌ createOrder error:", error);
    throw error;
  }
}
