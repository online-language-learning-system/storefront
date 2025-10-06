const BASE_URL = "http://localhost:8000/api/course-service";

function getAuthHeaders() {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function getAllCourses() {
  const res = await fetch(`${BASE_URL}/storefront/courses/all`);
  if (!res.ok) throw new Error("Lỗi khi lấy tất cả khóa học");
  return res.json();
}
export async function getCourseDetail(id) {
  const res = await fetch(`${BASE_URL}/storefront/${id}/detail`, {
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error("Lỗi khi lấy chi tiết khóa học");
  return res.json();
}
export async function searchCourses({
  pageNo = 0,
  pageSize = 9,
  courseTitle = "",
  categoryId,
  startPrice,
  endPrice,
}) {
  const params = new URLSearchParams();
  params.append("pageNo", pageNo);
  params.append("pageSize", pageSize);
  if (courseTitle) params.append("courseTitle", courseTitle);
  if (categoryId != null) params.append("categoryId", categoryId);
  if (startPrice != null) params.append("startPrice", startPrice);
  if (endPrice != null) params.append("endPrice", endPrice);

  const res = await fetch(`${BASE_URL}/storefront/courses?${params.toString()}`);
  if (!res.ok) throw new Error("Lỗi khi tìm kiếm khóa học");
  return res.json();
}

export async function getCourseModules(id) {
  const res = await fetch(`${BASE_URL}/storefront/${id}/modules`, {
    headers: {
      Accept: "application/json",
      ...getAuthHeaders(),
    },
  });
  if (!res.ok) {
    const txt = await res.text();
    throw new Error(txt || "Lỗi khi lấy module của khóa học");
  }
  return res.json();
}


export async function getModuleLessons(id) {
  const res = await fetch(`${BASE_URL}/storefront/${id}/lessons`, {
    headers: {
      Accept: "application/json",
      ...getAuthHeaders(),
    },
  });
  if (!res.ok) {
    const txt = await res.text();
    throw new Error(txt || "Lỗi khi lấy bài học của module");
  }
  return res.json();
}
// ======= BACKOFFICE =======

export async function createCourse(courseData, coverFile, resourceFiles = []) {
  if (!coverFile) throw new Error("Ảnh khóa học bắt buộc");
  const payload = {
    ...courseData,
    categoryId: Number(courseData.categoryId),
    price: Number(courseData.price),
  };

  const fd = new FormData();

  // Append JSON payload as Blob (application/json)
  fd.append(
    "coursePostDto",
    new Blob([JSON.stringify(payload)], { type: "application/json;charset=UTF-8" })
  );

  // Append cover image
  fd.append("courseImageFile", coverFile);

  // Nếu không có resourceFiles thì gửi dummy file (tránh null bên BE)
  const realFiles = Array.isArray(resourceFiles) ? resourceFiles.filter(f => f instanceof File) : [];
  if (realFiles.length === 0) {
    const dummy = new File([""], ".empty", { type: "application/octet-stream" });
    fd.append("resourceFiles", dummy);
  } else {
    realFiles.forEach((file) => {
      fd.append("resourceFiles", file);
    });
  }

  // Debug log
  console.log("== createCourse: about to send multipart/form-data ==");
  console.log("Headers (auth only):", getAuthHeaders(true));
  for (const [k, v] of fd.entries()) {
    if (v instanceof File) console.log(k, "=> File:", v.name, v.type, v.size);
    else if (v instanceof Blob) {
      try {
        v.text().then(txt => console.log(k, "=> Blob(JSON):", txt));
      } catch (err) {
        console.log(k, "=> Blob (cannot read in debug)", err);
      }
    } else console.log(k, "=>", v);
  }
  console.log("== end debug ==");

  const res = await fetch(`${BASE_URL}/backoffice/courses`, {
    method: "POST",
    headers: getAuthHeaders(true),
    body: fd,
  });

  if (!res.ok) {
    const txt = await res.text();
    throw new Error("Tạo khóa học thất bại: " + txt);
  }

  return res.json();
  
}
