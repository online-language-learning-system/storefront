const BASE_URL = "http://localhost:8000/api";

/* ================================
    Lấy token Authorization header
================================ */
function getAuthHeaders() {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

/* ================================
    Lấy userId trực tiếp từ token
================================ */
function getUserIdFromToken() {
  const token =
    localStorage.getItem("token") || localStorage.getItem("accessToken");

  if (!token) return null;

  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.sub;
  } catch (err) {
    console.error("Token decode error:", err);
    return null;
  }
}

/* ================================
    Tạo cuộc hội thoại
================================ */
export async function createConversation(level, topic) {
  const userId = getUserIdFromToken();
  if (!userId) {
    throw new Error("Không lấy được user_id từ token");
  }

  const res = await fetch(`${BASE_URL}/conversation`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
    },
    body: JSON.stringify({
      level,
      topic,
      user_id: userId,
    }),
  });

  if (!res.ok) {
    const t = await res.text();
    throw new Error("Không tạo được hội thoại: " + t);
  }

  const data = await res.json();

  // Chuyển dữ liệu về dạng chuẩn để FE dễ dùng
  return {
    id: data.id,
    topic: data.topic,
    level: data.level,
    messages: data.messages || [],
    overall_score: data.overall_score || {},
    recommendations: data.recommendations || [],
    created_at: data.created_at,
    updated_at: data.updated_at,
    user_id: data.user_id,
  };
}
export async function sendMessage(conversationId, message, responseTime) {
  const res = await fetch(`${BASE_URL}/conversation/${conversationId}/messages`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
    },
    body: JSON.stringify({
      message,
      response_time: responseTime,
    }),
  });

  if (!res.ok) {
    const t = await res.text();
    throw new Error("Gửi tin nhắn thất bại: " + t);
  }

  return res.json();
}

/* ================================
    Gửi âm thanh (voice)
================================ */
export async function sendVoice(conversationId, audioBlob, responseTime) {
  const fd = new FormData();
  fd.append("audio", audioBlob, "voice.wav");
  fd.append("response_time", responseTime);

  const res = await fetch(`${BASE_URL}/conversation/${conversationId}/messages`, {
    method: "POST",
    headers: {
      ...getAuthHeaders(), // Không đặt Content-Type => fetch tự tạo boundary
    },
    body: fd,
  });

  if (!res.ok) {
    const t = await res.text();
    throw new Error("Gửi giọng nói thất bại: " + t);
  }

  return res.json();
}

/* ================================
    API dịch tiếng Nhật
================================ */
export async function translateText(japaneseText) {
  const res = await fetch(`${BASE_URL}/translation`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
    },
    body: JSON.stringify({ text: japaneseText }),
  });

  if (!res.ok) {
    const t = await res.text();
    throw new Error("Không dịch được: " + t);
  }

  return res.json();
}
