
const BASE_URL = "http://localhost:8000/api";

function getAuthHeaders() {
  const token = localStorage.getItem("token") || localStorage.getItem("accessToken");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

function getUserIdFromToken() {
  const token = localStorage.getItem("token") || localStorage.getItem("accessToken");
  if (!token) return null;
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.sub;
  } catch {
    return null;
  }
}

export async function createConversation(level, topic) {
  const userId = getUserIdFromToken();
  if (!userId) throw new Error("Không lấy được user_id từ token");

  const res = await fetch(`${BASE_URL}/conversation`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      ...getAuthHeaders(),
    },
    body: JSON.stringify({ level, topic, user_id: userId }),
  });

  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function sendMessage(conversationId, message, responseTime = 2) {
  if (!conversationId) throw new Error("conversationId is required");

  const res = await fetch(`${BASE_URL}/conversation/${conversationId}/messages`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      ...getAuthHeaders(),
    },
    body: JSON.stringify({
      message,
      response_time: responseTime,
    }),
  });

  if (!res.ok) throw new Error("Gửi tin nhắn thất bại: " + await res.text());
  return res.json();
}

export async function translateText(japaneseText) {
  const res = await fetch(`${BASE_URL}/translation`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      ...getAuthHeaders(),
    },
    body: JSON.stringify({ text: japaneseText }),
  });

  if (!res.ok) throw new Error(await res.text());
  return res.json();
}
