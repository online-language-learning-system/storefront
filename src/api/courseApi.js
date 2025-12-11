const BASE_URL = "http://localhost:8000/api/course-service";

// read token from param or localStorage (support both keys)
function getAuthHeaders(token) {
  const t = token || localStorage.getItem("accessToken") || localStorage.getItem("token");
  return t ? { Authorization: `Bearer ${t}` } : {};
}

// safe JWT payload parse (returns object or null)
export function getTokenClaims(token) {
  try {
    const t = token || localStorage.getItem("accessToken") || localStorage.getItem("token");
    if (!t) return null;
    const parts = t.split(".");
    if (parts.length < 2) return null;
    const payload = parts[1].replace(/-/g, "+").replace(/_/g, "/");
    const json = decodeURIComponent(
      atob(payload)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    return JSON.parse(json);
  } catch (e) {
    console.warn("getTokenClaims: failed to decode token", e);
    return null;
  }
}

export async function getAllCourses(token) {
  const res = await fetch(`${BASE_URL}/storefront/courses/all`, {
    headers: {
      Accept: "application/json",
      ...getAuthHeaders(token),
    },
  });
  if (!res.ok) {
    const txt = await res.text().catch(() => res.statusText);
    throw new Error(txt || "Lỗi khi lấy tất cả khóa học");
  }
  return res.json();
}

export async function getCourseDetail(id, token) {
  const res = await fetch(`${BASE_URL}/storefront/${id}/detail`, {
    headers: {
      Accept: "application/json",
      ...getAuthHeaders(token),
    },
  });
  if (!res.ok) {
    const txt = await res.text().catch(() => res.statusText);
    throw new Error(txt || "Lỗi khi lấy chi tiết khóa học");
  }
  return res.json();
}

// other functions keep using getAuthHeaders(token) similarly
export async function searchCourses({ pageNo = 0, pageSize = 9, courseTitle = "", categoryId, startPrice, endPrice, token } = {}) {
  const params = new URLSearchParams();
  params.append("pageNo", pageNo);
  params.append("pageSize", pageSize);
  if (courseTitle) params.append("courseTitle", courseTitle);
  if (categoryId != null) params.append("categoryId", categoryId);
  if (startPrice != null) params.append("startPrice", startPrice);
  if (endPrice != null) params.append("endPrice", endPrice);

  const res = await fetch(`${BASE_URL}/storefront/courses?${params.toString()}`, {
    headers: {
      Accept: "application/json",
      ...getAuthHeaders(token),
    },
  });
  if (!res.ok) {
    const txt = await res.text().catch(() => res.statusText);
    throw new Error(txt || "Lỗi khi tìm kiếm khóa học");
  }
  return res.json();
}
export async function getCoursesByTag({ tagName, pageNo = 0, pageSize = 9, token }) {
  const params = new URLSearchParams();
  params.append("tagName", tagName);
  params.append("pageNo", pageNo);
  params.append("pageSize", pageSize);

  const res = await fetch(`${BASE_URL}/storefront/courses/by-tag?${params.toString()}`, {
    headers: {
      Accept: "application/json",
      ...getAuthHeaders(token),
    },
  });

  if (!res.ok) {
    const txt = await res.text().catch(() => res.statusText);
    throw new Error(txt || "Lỗi khi lấy khóa học theo tagName");
  }

  return res.json();
}

export async function getCourseModules(id, token) {
  const res = await fetch(`${BASE_URL}/storefront/${id}/modules`, {
    headers: {
      Accept: "application/json",
      ...getAuthHeaders(token),
    },
  });
  if (!res.ok) {
    const txt = await res.text();
    throw new Error(txt || "Lỗi khi lấy module của khóa học");
  }
  return res.json();
}
export async function getModuleLessons(id, token) {
  const res = await fetch(`${BASE_URL}/storefront/${id}/lessons`, {
    headers: {
      Accept: "application/json",
      ...getAuthHeaders(token),
    },
  });
  if (!res.ok) {
    const txt = await res.text();
    throw new Error(txt || "Lỗi khi lấy bài học của module");
  }
  return res.json();
}

// createCourse unchanged, but ensure it uses getAuthHeaders(token) if you pass token
export async function createCourse(courseData, coverFile, resourceFiles = [], tagDto, token) {
  if (!coverFile) throw new Error("Ảnh khóa học bắt buộc");
  if (!tagDto) throw new Error("Thiếu tagPostDto");

  const payload = {
    ...courseData,
    categoryId: Number(courseData.categoryId),
    price: Number(courseData.price),
  };

  const fd = new FormData();

  fd.append(
    "coursePostDto",
    new Blob([JSON.stringify(payload)], { type: "application/json;charset=UTF-8" })
  );

  fd.append("courseImageFile", coverFile);
  if (Array.isArray(resourceFiles)) {
    resourceFiles.forEach((file) => {
      if (file instanceof File) fd.append("resourceFiles", file);
    });
  }
  fd.append(
    "tagPostDto", 
    new Blob([JSON.stringify(tagDto)], { type: "application/json;charset=UTF-8" })
  );

  const res = await fetch(`${BASE_URL}/backoffice/courses`, {
    method: "POST",
    headers: getAuthHeaders(token),
    body: fd,
  });

  if (!res.ok) {
    const txt = await res.text().catch(() => res.statusText);
    throw new Error("Tạo khóa học thất bại: " + txt);
  }

  return res.json();
}
