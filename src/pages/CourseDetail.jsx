// src/pages/CourseDetail.jsx
import React, { useEffect, useState } from "react";
import { getCourseDetail } from "@/api/courseApi";
import { getCart, addToCart, removeFromCart } from "@/api/cartApi";
import Footer from "@/components/Footer";
import { useParams, useNavigate } from "react-router-dom";

const CourseDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState([]);
  const [cartLoading, setCartLoading] = useState(false);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const data = await getCourseDetail(id);
        setCourse(data);
      } catch (err) {
        console.error("Lỗi khi load chi tiết khóa học:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCourse();
  }, [id]);


  useEffect(() => {
    getCart()
      .then((data) => setCart(data.items || []))
      .catch((err) => console.error("Lỗi khi lấy giỏ hàng:", err));
  }, []);

  if (loading) {
    return <p className="text-center mt-8">Đang tải chi tiết...</p>;
  }
  if (!course) {
    return <p className="text-center mt-8">Không tìm thấy khóa học</p>;
  }

  const isInCart = cart.some((item) => String(item.id) === String(id));

  const handleToggleCart = async () => {
    setCartLoading(true);
    try {
      if (isInCart) {
        await removeFromCart(id);
        setCart((prev) => prev.filter((item) => String(item.id) !== String(id)));
      } else {
        await addToCart(id);
        setCart((prev) => [...prev, { id, title: course.title }]); 
      }
    } catch (err) {
      console.error("Lỗi khi cập nhật giỏ hàng:", err);
    } finally {
      setCartLoading(false);
    }
  };
  const handleTrial = () => {

  const trialModules = course.courseModules?.filter((m) => m.canFreeTrial);

  if (!trialModules || trialModules.length === 0) {
    alert("Khóa học này chưa có bài học miễn phí nào.");
    return;
  }

  // Lấy tất cả bài học trong module free trial
  const trialLessons = trialModules.flatMap((m) => m.lessons || []);

  if (trialLessons.length === 0) {
    alert("Module miễn phí chưa có bài học.");
    return;
  }

  console.log("Danh sách bài học dùng thử:", trialLessons);

};
  return (
    <div className="flex flex-col bg-gray-50 min-h-screen">
      {/* Banner — đẩy xuống để tránh navbar */}
      <div className="bg-gray-900 text-white pt-20 pb-12 px-6 md:px-16">
        <h1 className="text-3xl md:text-4xl font-extrabold mb-4">
          {course.title}
        </h1>
        {course.subtitle && (
          <p className="text-lg text-gray-300 max-w-3xl mb-4">
            {course.subtitle}
          </p>
        )}
        <div className="flex flex-wrap gap-6 text-sm text-gray-400">
        <div>Ngôn ngữ: {course.teachingLanguage || "N/A"}</div>
        {course.level && <div>Trình độ: {course.level}</div>}
        {course.enrolledCount != null && (
          <div>{course.enrolledCount} học viên</div>
        )}
        {course.createOn && (
          <div>
            Ngày tạo:{" "}
            {new Date(course.createOn).toLocaleDateString("vi-VN", {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
            })}
          </div>
        )}
      </div>
      </div>
      <div className="flex-1 max-w-6xl mx-auto mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8 px-6 md:px-0">
        {/* Nội dung mô tả, syllabus, giảng viên */}
        <div className="lg:col-span-2 space-y-8">
          <section>
            <h2 className="text-2xl font-semibold mb-4">Mô tả khóa học</h2>
            <p className="text-gray-700 leading-relaxed">
              {course.longDescription ||
                course.description ||
                "Không có mô tả chi tiết."}
            </p>
          </section>
         {/* 
<section>
  <h2 className="text-2xl font-semibold mb-4">Nội dung khóa học</h2>
  {course.courseModules && course.courseModules.length > 0 ? (
    <div className="space-y-4">
      {course.courseModules.map((mod, mIdx) => (
        <div key={mIdx} className="bg-white p-4 rounded-lg shadow-sm">
          <h3 className="font-semibold text-lg mb-2">{mod.title}</h3>
          {mod.lessons && (
            <ul className="list-disc pl-5 space-y-1">
              {mod.lessons.map((les, lIdx) => (
                <li key={lIdx}>
                  {les.title} {les.duration ? `– ${les.duration} phút` : ""}
                </li>
              ))}
            </ul>
          )}
        </div>
      ))}
    </div>
  ) : (
    <p className="text-gray-500">Nội dung đang cập nhật.</p>
  )}
</section>
*/}
          {course.instructor && (
            <section className="pt-8">
              <h2 className="text-2xl font-semibold mb-4">Giảng viên</h2>
              <div className="flex items-center gap-4 bg-white p-6 rounded-lg shadow-sm">
                <div>
                  <h3 className="text-lg font-semibold">
                    {course.instructor}
                  </h3>
                </div>
              </div>
            </section>
          )}
        </div>

        {/* Sidebar đăng ký / mua khóa học */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl shadow-md p-6 sticky top-24">
            <img
              className="w-full h-48 object-cover rounded-lg mb-4"
              src={course.imageUrl || "/img/default-course.jpg"}
              alt={course.title}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "/img/default-course.jpg";
              }}
            />

            <div className="text-2xl font-bold text-[#910c4e] mb-4">
              {course.price === 0
                ? "Miễn phí"
                : `${course.price.toLocaleString("vi-VN")} Đ`}
            </div>

            <button className="w-full bg-[#910c4e] text-white py-3 rounded-lg font-semibold hover:bg-[#6d083b] transition mb-3">
              {course.price === 0 ? "Bắt đầu học" : "Đăng ký khóa học"}
            </button>
             {/* Nút Học thử */}
            <button
              onClick={() => navigate(`/courses/${course.id}/trial`)}
              className="w-full border border-[#910c4e] text-[#910c4e] py-3 rounded-lg font-semibold hover:bg-[#910c4e] hover:text-white transition mb-3"
            >
              Học thử
            </button>
            {/* Nút thêm/gỡ giỏ hàng */}
            <button
              onClick={handleToggleCart}
              disabled={cartLoading}
              className={`w-full py-3 rounded-lg font-semibold transition ${
                isInCart
                  ? "bg-red-100 text-red-600 hover:bg-red-200"
                  : "bg-gray-200 text-gray-800 hover:bg-gray-300"
              }`}
            >
              {cartLoading
                ? "Đang xử lý..."
                : isInCart
                ? "❌ Gỡ khỏi giỏ hàng"
                : "🛒 Thêm vào giỏ hàng"}
            </button>

            <div className="mt-6 text-sm text-gray-600 space-y-2">
              <p>✔ Truy cập trọn đời</p>
              <p>✔ Học trên mọi thiết bị</p>
              <p>✔ Chứng nhận hoàn thành</p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default CourseDetail;
