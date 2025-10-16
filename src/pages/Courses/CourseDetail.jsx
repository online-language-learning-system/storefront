import React, { useEffect, useState } from "react";
import { getCourseDetail } from "@/api/courseApi";
import { getCart, addToCart, removeFromCart } from "@/api/cartApi";
import Footer from "@/components/Footer";
import Navbar from "@/widgets/layout/navbar"; // Navbar của bạn
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

  if (loading) return <p className="text-center mt-8">Đang tải chi tiết...</p>;
  if (!course) return <p className="text-center mt-8">Không tìm thấy khóa học</p>;

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

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col">

      <header className="relative w-full overflow-hidden pointer-events-none">
 
        <div
          className="absolute inset-0 w-full h-full bg-cover bg-center pointer-events-none"
          style={{ backgroundImage: `url(${course.imageUrl || "/img/japan-bg.jpg"})` }}
        />
        <div className="absolute inset-0 w-full h-full bg-black bg-opacity-50 pointer-events-none" />
    
        <div className="relative z-10 max-w-[1420px] mx-auto px-6 md:px-12 lg:px-16 py-28 md:py-32 lg:py-36 text-white">
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-extrabold mb-4 truncate">
            {course.title}
          </h1>
          {course.subtitle && (
            <p className="text-lg md:text-xl text-gray-200 max-w-4xl mb-3">
              {course.subtitle}
            </p>
          )}
          <div className="flex flex-wrap gap-6 text-sm md:text-base text-gray-300 mt-2">
            <div>Ngôn ngữ: {course.teachingLanguage || "N/A"}</div>
            {course.level && <div>Trình độ: {course.level}</div>}
            {course.enrolledCount != null && <div>{course.enrolledCount} học viên</div>}
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
      </header>

      {/* Main content */}
      <main className="flex-1 w-full max-w-[1420px] mx-auto mt-10 grid grid-cols-1 lg:grid-cols-3 gap-10 px-6 md:px-8">
        {/* Description & Instructor */}
        <div className="lg:col-span-2 space-y-8">
          <section>
            <h2 className="text-2xl font-semibold mb-4 text-[#910c4e]">
              Mô tả khóa học
            </h2>
            <p className="text-gray-700 leading-relaxed">
              {course.longDescription || course.description || "Không có mô tả chi tiết."}
            </p>
          </section>

          {course.instructor && (
            <section>
              <h2 className="text-2xl font-semibold mb-4 text-[#910c4e]">Giảng viên</h2>
              <div className="flex items-center gap-4 bg-white p-6 rounded-xl shadow-sm">
                <h3 className="text-lg font-semibold">{course.instructor}</h3>
              </div>
            </section>
          )}
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl shadow-xl p-6 sticky top-28 z-10">
            <img
              className="w-full h-52 object-cover rounded-lg mb-4"
              src={course.imageUrl || "/img/default-course.jpg"}
              alt={course.title}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "/img/default-course.jpg";
              }}
            />
            <div className="text-3xl font-bold text-[#910c4e] mb-4">
              {course.price === 0
                ? "Miễn phí"
                : `${course.price.toLocaleString("vi-VN")} Đ`}
            </div>

            <button
              onClick={() => navigate(`/courses/${course.id}/trial`)}
              className="w-full bg-[#910c4e] text-white py-3 rounded-lg font-semibold hover:bg-[#6d083b] transition mb-3"
            >
              {course.price === 0 ? "Bắt đầu học" : "Đăng ký khóa học"}
            </button>

            <button
              onClick={() => navigate(`/courses/${course.id}/trial`)}
              className="w-full border-2 border-[#910c4e] text-[#910c4e] py-3 rounded-lg font-semibold hover:bg-[#910c4e] hover:text-white transition mb-3"
            >
              Học thử
            </button>
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
      </main>

      {/* Footer */}
      <div className="w-full border-t-4 border-[#910c4e]/60 mt-12"></div>
      <Footer />
    </div>
  );
};

export default CourseDetail;
