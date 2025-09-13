import React, { useEffect, useState } from "react";
import Footer from "@/components/Footer";

const Courses = () => {
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  // Bộ lọc
  const [search, setSearch] = useState("");
  const [language, setLanguage] = useState("all");
  const [price, setPrice] = useState("all");
  const [freeOnly, setFreeOnly] = useState(false);

  // Phân trang
  const [pageNo, setPageNo] = useState(0);
  const pageSize = 9;

  // Modal tạo khóa học
  const [showForm, setShowForm] = useState(false);
  const [newCourse, setNewCourse] = useState({
    title: "",
    teachingLanguage: "VN",
    price: 0,
    description: "",
    startDate: "",
    endDate: "",
  });

  // Lấy danh sách khóa học
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await fetch(
          `http://localhost:8000/api/course-service/storefront/courses?pageNo=${pageNo}&pageSize=${pageSize}`
        );
        if (!res.ok) throw new Error("API lỗi: " + res.status);
        const data = await res.json();
        setCourses(data.courseContent ?? []);
      } catch (err) {
        console.error("Lỗi khi gọi API:", err);
        setCourses([]);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, [pageNo]);

  // Lọc client-side
  const filteredCourses = courses.filter((course) => {
    const matchSearch = search
      ? course.title.toLowerCase().includes(search.toLowerCase())
      : true;

    const matchLang =
      language === "all"
        ? true
        : (course.teachingLanguage || course.teaching_language) === language;

    const matchPrice =
      price === "all"
        ? true
        : price === "0-100"
        ? course.price < 100
        : price === "100-200"
        ? course.price >= 100 && course.price <= 200
        : price === "200+"
        ? course.price > 200
        : true;

    const matchFree = freeOnly ? course.price === 0 : true;

    return matchSearch && matchLang && matchPrice && matchFree;
  });

  // Phân trang client-side
  const totalPages = Math.ceil(filteredCourses.length / pageSize);
  const paginatedCourses = filteredCourses.slice(
    pageNo * pageSize,
    (pageNo + 1) * pageSize
  );

  // Reset page khi filter thay đổi
  useEffect(() => {
    setPageNo(0);
  }, [search, language, price, freeOnly]);

  // Gửi API tạo khóa học
  const handleCreateCourse = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(
        "http://localhost:8000/api/course-service/backoffice/courses",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...newCourse,
            startDate: newCourse.startDate
              ? new Date(newCourse.startDate).toISOString()
              : null,
            endDate: newCourse.endDate
              ? new Date(newCourse.endDate).toISOString()
              : null,
            createdBy: user.firstName || "system",
            lastModifiedBy: user.lastName || "system",
          }),
        }
      );

      if (!res.ok) throw new Error("Tạo khóa học thất bại");

      const created = await res.json();
      alert("Tạo khóa học thành công!");
      setCourses((prev) => [created, ...prev]);
      setShowForm(false);
    } catch (err) {
      console.error(err);
      alert("Có lỗi khi tạo khóa học");
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Banner */}
      <div className="relative h-64 w-full">
        <img
          src="img/jp.jpg"
          alt="Banner"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white drop-shadow-lg text-center">
            Khám phá các khóa học tiếng Nhật
          </h1>
        </div>
      </div>

      {/* Nút tạo khóa học */}
      {user.role !== "student" && (
  <div className="container mx-auto px-6 py-6 flex justify-end">
    <button
      onClick={() => setShowForm(true)}
      className="bg-[#910c4e] text-white px-4 py-2 rounded-lg hover:bg-[#6d083b]"
    >
      + Tạo khóa học
    </button>
  </div>
)}

      {/* Form tạo khóa học */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <form
            onSubmit={handleCreateCourse}
            className="bg-white p-6 rounded-2xl shadow-lg w-96"
          >
            <h2 className="text-xl font-bold mb-4 text-[#910c4e]">
              Tạo khóa học mới
            </h2>

            <input
              type="text"
              placeholder="Tên khóa học"
              value={newCourse.title}
              onChange={(e) =>
                setNewCourse({ ...newCourse, title: e.target.value })
              }
              className="w-full border px-3 py-2 rounded mb-3"
              required
            />

            <select
              value={newCourse.teachingLanguage}
              onChange={(e) =>
                setNewCourse({ ...newCourse, teachingLanguage: e.target.value })
              }
              className="w-full border px-3 py-2 rounded mb-3"
            >
              <option value="VN">Tiếng Việt</option>
              <option value="JP">Tiếng Nhật</option>
              <option value="EN">Tiếng Anh</option>
            </select>

            <input
              type="number"
              placeholder="Giá"
              value={newCourse.price}
              onChange={(e) =>
                setNewCourse({ ...newCourse, price: Number(e.target.value) })
              }
              className="w-full border px-3 py-2 rounded mb-3"
            />

            <textarea
              placeholder="Mô tả"
              value={newCourse.description}
              onChange={(e) =>
                setNewCourse({ ...newCourse, description: e.target.value })
              }
              className="w-full border px-3 py-2 rounded mb-3"
            />

            <label className="block mb-1">Ngày bắt đầu</label>
            <input
              type="date"
              value={newCourse.startDate}
              onChange={(e) =>
                setNewCourse({ ...newCourse, startDate: e.target.value })
              }
              className="w-full border px-3 py-2 rounded mb-3"
            />

            <label className="block mb-1">Ngày kết thúc</label>
            <input
              type="date"
              value={newCourse.endDate}
              onChange={(e) =>
                setNewCourse({ ...newCourse, endDate: e.target.value })
              }
              className="w-full border px-3 py-2 rounded mb-4"
            />

            <div className="flex justify-between">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-4 py-2 rounded-lg border bg-gray-200 hover:bg-gray-300"
              >
                Hủy
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-lg bg-[#910c4e] text-white hover:bg-[#6d083b]"
              >
                Lưu
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Content */}
      <div className="container w-full mx-auto px-6 py-12 grid grid-cols-1 lg:grid-cols-[18rem_1fr] gap-6 flex-1">
        {/* Sidebar */}
        <aside className="bg-white rounded-2xl shadow-lg p-6 h-fit sticky top-24">
          <h2 className="text-xl font-bold text-[#910c4e] mb-6 border-b pb-2">
            Bộ lọc khóa học
          </h2>

          <input
            type="text"
            placeholder="Tìm khóa học..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg mb-4 focus:ring-2 focus:ring-[#910c4e]"
          />

          <label className="block font-medium mb-2">Ngôn ngữ giảng dạy</label>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg mb-6"
          >
            <option value="all">Tất cả</option>
            <option value="VN">Tiếng Việt</option>
            <option value="JP">Tiếng Nhật</option>
            <option value="EN">Tiếng Anh</option>
          </select>

          <label className="block font-medium mb-2">Mức giá</label>
          <select
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg mb-6"
          >
            <option value="all">Tất cả</option>
            <option value="0-100">Dưới 100 VND</option>
            <option value="100-200">100 - 200 VND</option>
            <option value="200+">Trên 200 VND</option>
          </select>

          <button
            onClick={() => setFreeOnly(!freeOnly)}
            className={`w-full py-2 rounded-lg font-semibold mb-4 transition ${
              freeOnly
                ? "bg-green-600 text-white hover:bg-green-700"
                : "bg-gray-200 text-gray-800 hover:bg-gray-300"
            }`}
          >
            {freeOnly ? "Đang lọc miễn phí" : "Khóa học miễn phí"}
          </button>

          <button
            onClick={() => {
              setSearch("");
              setLanguage("all");
              setPrice("all");
              setFreeOnly(false);
            }}
            className="w-full bg-[#910c4e] text-white py-2 rounded-lg font-semibold hover:bg-[#6d083b] transition"
          >
            Reset bộ lọc
          </button>
        </aside>

        {/* Main content */}
        <main className="flex-1">
  <h2 className="text-2xl font-bold text-gray-800 mb-8">
    Danh sách Khóa học
  </h2>

  {loading ? (
    <p className="text-center text-gray-600 text-lg">Đang tải dữ liệu...</p>
  ) : (
    <>
       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 min-h-[300px]">
        {filteredCourses.length > 0 ? (
          <>
            {filteredCourses.map((course) => (
              <div
                key={course.id}
                className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl hover:scale-[1.02] transition-transform min-h-[350px] flex flex-col"
              >
                <img
                  src={course.image || "img/default-course.jpg"}
                  alt={course.title}
                  className="w-full h-44 object-cover"
                />
                <div className="p-5 flex flex-col flex-1">
                  <h3 className="font-bold text-lg mb-2 text-[#910c4e]">
                    {course.title}
                  </h3>
                  <p className="text-sm text-gray-600 mb-1">
                    Ngôn ngữ giảng dạy:{" "}
                    {course.teachingLanguage || course.teaching_language}
                  </p>
                  <p className="text-lg font-semibold text-[#910c4e] mb-2">
                    {course.price === 0 ? "Miễn phí" : `${course.price} VND`}
                  </p>
                  <p className="text-gray-700 text-sm flex-1">
                    {course.description}
                  </p>
                  <button className="w-full mt-3 bg-[#910c4e] text-white py-2 rounded-lg font-semibold hover:bg-[#6d083b] transition">
                    Đăng ký ngay
                  </button>
                </div>
              </div>
            ))}

            {/* Giữ layout đủ 3 cột */}
            {Array.from({ length: (3 - (filteredCourses.length % 3)) % 3 }).map(
              (_, idx) => (
                <div
                  key={`placeholder-${idx}`}
                  className="invisible min-h-[350px]"
                ></div>
              )
            )}
          </>
        ) : (
          <>
            {/* Khi không có khóa học vẫn render 3 cột để giữ layout */}
            <div className="col-span-3 flex justify-center items-center text-gray-600 text-lg min-h-[350px] border rounded-2xl bg-white shadow">
              Không tìm thấy khóa học nào.
            </div>
            <div className="invisible"></div>
            <div className="invisible"></div>
          </>
        )}
      </div>

      {/* Pagination */}
      <div className="flex justify-center mt-8 gap-4">
        <button
          disabled={pageNo === 0}
          onClick={() => setPageNo((prev) => Math.max(prev - 1, 0))}
          className="px-4 py-2 rounded-lg border bg-white hover:bg-gray-100 disabled:opacity-50"
        >
          Trang trước
        </button>
        <button
          onClick={() => setPageNo((prev) => prev + 1)}
          className="px-4 py-2 rounded-lg border bg-white hover:bg-gray-100"
        >
          Trang tiếp theo
        </button>
      </div>
    </>
  )}
</main>

      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Courses;
