const BASE_URL = "http://localhost:8000/api/course-service";

// Lấy danh sách khóa học
export async function getCourses({ courseTitle = "", pageNo = 0, pageSize = 10 }) {
  const res = await fetch(
    `${BASE_URL}/storefront/courses?courseTitle=${encodeURIComponent(courseTitle)}&pageNo=${pageNo}&pageSize=${pageSize}`
  );
  if (!res.ok) throw new Error("Lỗi khi lấy danh sách khóa học");
  return res.json(); 
}

// Lấy chi tiết khóa học
export async function getCourseById(id) {
  const res = await fetch(`${BASE_URL}/backoffice/courses/${id}`);
  if (!res.ok) throw new Error("Lỗi khi lấy chi tiết khóa học");
  return res.json();
}

// Lấy danh sách khóa học trial
export async function getTrialCourses({ pageNo = 0, pageSize = 10 }) {
  const res = await fetch(
    `${BASE_URL}/storefront/courses/trial?pageNo=${pageNo}&pageSize=${pageSize}`
  );
  if (!res.ok) throw new Error("Lỗi khi lấy khóa học trial");
  return res.json();
}
