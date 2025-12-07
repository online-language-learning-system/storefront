const PAYMENT_BASE_URL = "http://localhost:8000/api/payment-vnpay"; // endpoint của VnPayController

function getAuthHeaders() {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

/**
 * Lấy link thanh toán VNPay cho orderId
 * @param {number|string} orderId 
 * @returns {Promise<{paymentUrl?: string, paymentStatus?: string, error?: string}>}
 */
export async function getPaymentUrl(orderId) {
  try {
    const res = await fetch(`${PAYMENT_BASE_URL}/orders/${orderId}/payment-url`, {
      method: "GET",
      headers: getAuthHeaders(),
    });

    if (!res.ok) {
      const errText = await res.text();
      throw new Error("Lấy payment URL thất bại: " + errText);
    }

    return await res.json(); // { paymentUrl: "...", paymentStatus: "...", error: "..." }
  } catch (error) {
    console.error("❌ getPaymentUrl error:", error);
    throw error;
  }
}
