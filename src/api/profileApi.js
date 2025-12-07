const BASE_URL = "http://localhost:8000/api/user-service";
function getAuthHeaders() {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}
export async function getUserProfile() {
  const res = await fetch(`${BASE_URL}/storefront/user/profile`, {
    method: "GET",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders()
    }
  });

  if (!res.ok) throw new Error(`Không thể lấy thông tin người dùng: ${res.status}`);
  return res.json();
}
export async function getUserRole() {
  const res = await fetch(`${BASE_URL}/storefront/user/role`, {
    method: "GET",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders()
    }
  });

  if (!res.ok) {
    throw new Error(`Không thể lấy role người dùng: ${res.status}`);
  }
  return res.text();
}

