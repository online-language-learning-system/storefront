const BASE_URL = "http://localhost:8000/storefront/user";
//const BASE_URL = import.meta.env.USER_SERVICE_API;

export async function getUserProfile() {
  const res = await fetch(`${BASE_URL}/profile`, {
    method: "GET",
    credentials: "include", 
    headers: { "Content-Type": "application/json" }
  });
  if (!res.ok) throw new Error(`Không thể lấy thông tin người dùng: ${res.status}`);
  return res.json();
}
