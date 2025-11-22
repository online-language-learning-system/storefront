// utils/Auth.js
export function getCurrentUser() {
  const token = localStorage.getItem("accessToken");
  if (!token) return null;

  try {
    // 1. Lấy payload của JWT
    const payload = JSON.parse(atob(token.split(".")[1]));

    // 2. Lấy username
    const username = payload.preferred_username || payload.sub || "";

    // 3. Lấy roles
    const realmRoles = payload.realm_access?.roles || [];
    const resourceRoles = Object.values(payload.resource_access || {})
      .flatMap(r => r.roles || []);

    const roles = Array.from(new Set([...realmRoles, ...resourceRoles])); // remove duplicates

    // 4. Kiểm tra lecturer
    const isLecturer = roles.includes("lecturer");

    return { username, roles, isLecturer, payload };
  } catch (err) {
    console.error("Invalid token", err);
    return null;
  }
}
