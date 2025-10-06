const BASE_URL = "http://localhost:8000/api/user-service";

export async function getUserProfile() {
  const res = await fetch(`${BASE_URL}/storefront/user/profile`, {
    method: "GET",
    credentials: "include", 
    headers: { "Content-Type": "application/json" }
  });
  if (!res.ok) throw new Error(`Không thể lấy thông tin người dùng: ${res.status}`);
  return res.json();
}
