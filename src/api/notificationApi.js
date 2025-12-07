const BASE_URL = "http://localhost:8000/api/notification-service";

function getAuthHeaders() {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function getNotifications(userId) {
  const res = await fetch(`${BASE_URL}/storefront/notifications?recipient=${userId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
    },
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error("Lấy thông báo thất bại: " + errText);
  }

  return res.json();
}
