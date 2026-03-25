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
export async function getRecommendations(conversationId) {
  if (!conversationId) {
    throw new Error("conversationId is required to fetch recommendations.");
  }

  console.log("Fetching recommendations with conversationId:", conversationId);

  try {
    const res = await fetch(
      `${BASE_URL}/conversation/${conversationId}/recommendations`,
      {
        headers: {
          Accept: "application/json",
          ...getAuthHeaders(),
        },
      }
    );

    console.log("Response status:", res.status);
    console.log("Response headers:", res.headers);
    console.log("Full response body:", await res.clone().text());

    if (!res.ok) {
      const errorText = await res.text();
      console.error("Failed to fetch recommendations. Error:", errorText);
      throw new Error(`Failed to fetch recommendations: ${errorText}`);
    }

    const data = await res.json();
    console.log("Recommendations response data:", data);
    return data;
  } catch (error) {
    console.error("Error in getRecommendations:", error);
    throw error;
  }
}
export async function evaluateConversation(conversationId, jlptTarget) {
  const res = await fetch(`${BASE_URL}/v1/ai/evaluate`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders()
    },
    body: JSON.stringify({
      conversation_id: conversationId,
      jlpt_target: jlptTarget
    })
  });

  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

