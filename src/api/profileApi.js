const BASE_URL = "http://localhost:8000/storefront/user";

export async function getUserProfile() {
  const res = await fetch(`${BASE_URL}/profile`, {
    method: "GET",
    credentials: "include", 
    headers: { "Content-Type": "application/json" }
  });
  if (!res.ok) throw new Error(`Không thể lấy thông tin người dùng: ${res.status}`);
  return res.json();
}
