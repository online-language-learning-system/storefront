const BASE_URL = "http://localhost:8000/api/enrollment-service";
function getAuthHeaders() {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}
export async function getProgressById(progressId) {
  try {
    const res = await fetch(`${BASE_URL}/${progressId}/progress`, {
      method: "GET",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
    });

    if (!res.ok) {
      throw new Error(`Không thể lấy progress: ${res.status}`);
    }

    return res.json();
  } catch (err) {
    console.error(err);
    throw err;
  }
}
export async function createProgress(progressPostDto) {
  try {
    const res = await fetch(`${BASE_URL}/progress`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(progressPostDto),
    });

    if (!res.ok) {
      throw new Error(`Không thể tạo progress: ${res.status}`);
    }

    return res.json();
  } catch (err) {
    console.error(err);
    throw err;
  }
}
export async function updateLessonProgress(progressId, lessonId, lessonProgressUpdateDto) {
  try {
    const res = await fetch(`${BASE_URL}/${progressId}/lesson-progress/${lessonId}`, {
      method: "PATCH",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(lessonProgressUpdateDto),
    });

    if (!res.ok) {
      throw new Error(`Không thể cập nhật lesson progress: ${res.status}`);
    }

    return true; // trả về true nếu thành công
  } catch (err) {
    console.error(err);
    throw err;
  }
}    