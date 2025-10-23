import React, { useEffect, useState } from "react";
import { getCourseDetail } from "@/api/courseApi";
import Footer from "@/components/Footer";
import { CourseDetailSkeleton } from "@/components/LoadingComponents";
import { useParams, useNavigate } from "react-router-dom";

const CourseDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState([]);

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
    const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCart(storedCart);

    const handleCartUpdated = () => {
      const updatedCart = JSON.parse(localStorage.getItem("cart")) || [];
      setCart(updatedCart);
    };

    window.addEventListener("cartUpdated", handleCartUpdated);
    return () => window.removeEventListener("cartUpdated", handleCartUpdated);
  }, []);

  if (loading) return <CourseDetailSkeleton />;
  if (!course) return <p className="text-center mt-8">Không tìm thấy khóa học</p>;

  const isInCart = cart.some((item) => String(item.courseId) === String(course.id));

  const handleToggleCart = () => {
    const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
    const existing = storedCart.find((item) => String(item.courseId) === String(course.id));

    if (existing) {
      const newCart = storedCart.filter((item) => String(item.courseId) !== String(course.id));
      localStorage.setItem("cart", JSON.stringify(newCart));
    } else {
      storedCart.push({
        courseId: course.id,
        courseName: course.title,
        price: Number(course.price || 0),
        instructor: course.instructor || "Không rõ",
        quantity: 1,
        image: course.imageUrl || "",
      });
      localStorage.setItem("cart", JSON.stringify(storedCart));
    }

    setCart(JSON.parse(localStorage.getItem("cart")) || []);
    window.dispatchEvent(new Event("cartUpdated"));
  };

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col">
      <header className="relative w-full overflow-hidden pointer-events-none">
        <div
          className="absolute inset-0 w-full h-full bg-cover bg-center pointer-events-none"
          style={{ backgroundImage: `url(${course.imageUrl || "/img/japan-bg.jpg"})` }}
        />
        <div className="absolute inset-0 w-full h-full bg-black bg-opacity-50 pointer-events-none" />
        <div className="relative z-10 max-w-[1420px] mx-auto px-6 py-28 text-white">
          <h1 className="text-5xl font-extrabold mb-4 truncate">{course.title}</h1>
          {course.subtitle && <p className="text-xl text-gray-200">{course.subtitle}</p>}
        </div>
      </header>
      <main className="flex-1 w-full max-w-[1420px] mx-auto mt-10 grid grid-cols-1 lg:grid-cols-3 gap-10 px-6">
        <div className="lg:col-span-2 space-y-8">
          <section>
            <h2 className="text-2xl font-semibold mb-4 text-[#910c4e]">Mô tả khóa học</h2>
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
              {course.price === 0 ? "Miễn phí" : `${course.price.toLocaleString("vi-VN")} Đ`}
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
              className={`w-full py-3 rounded-lg font-semibold transition ${
                isInCart
                  ? "bg-red-100 text-red-600 hover:bg-red-200"
                  : "bg-gray-200 text-gray-800 hover:bg-gray-300"
              }`}
            >
              {isInCart ? "❌ Gỡ khỏi giỏ hàng" : "🛒 Thêm vào giỏ hàng"}
            </button>

            <div className="mt-6 text-sm text-gray-600 space-y-2">
              <p>✔ Truy cập trọn đời</p>
              <p>✔ Học trên mọi thiết bị</p>
              <p>✔ Chứng nhận hoàn thành</p>
            </div>
          </div>
        </div>
      </main>

      <div className="w-full border-t-4 border-[#910c4e]/60 mt-12"></div>
      <Footer />
    </div>
  );
};

export default CourseDetail;
