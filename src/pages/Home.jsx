import React, { useState, useEffect } from "react";
import Footer from "@/components/Footer";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Typography,
  Input,
  Textarea,
} from "@material-tailwind/react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

// ==== API SERVICE ==== //
const BASE_URL = "http://localhost:8000/api/course-service";

async function getCourses({ pageNo = 0, pageSize = 10 }) {
  const res = await fetch(
    `${BASE_URL}/storefront/courses?pageNo=${pageNo}&pageSize=${pageSize}`
  );
  if (!res.ok) throw new Error("Lỗi khi lấy danh sách khóa học");
  return res.json(); // backend return { courseContent, pageNo, totalPages, ... }
}

// ==== DỮ LIỆU TĨNH ==== //
const teachersData = [
  { name: "Nguyễn Lan", position: "Giảng viên JLPT N1", img: "/img/team-2.jpg", degree: "Thạc sĩ Ngôn ngữ Nhật", rating: "4.9" },
  { name: "Trần Minh", position: "Chuyên gia JLPT N2", img: "/img/team-3.jpg", degree: "Cử nhân Nhật Bản học", rating: "4.8" },
  { name: "Lê Hương", position: "Giáo viên JLPT N3", img: "/img/team-4.jpg", degree: "Thạc sĩ Giáo dục", rating: "4.7" },
  { name: "Phạm Tuấn", position: "Giảng viên JLPT N5, N4", img: "/img/team-5.jpg", degree: "Cử nhân Ngôn ngữ Nhật", rating: "4.6" },
  { name: "Mai Anh", position: "Giáo viên JLPT N1", img: "/img/team-1.jpg", degree: "Tiến sĩ Nhật Bản học", rating: "5.0" },
];

const testimonialsData = [
  { name: "Hoàng Nam", text: "Khóa học N5 rất dễ hiểu, thầy cô nhiệt tình, mình đã đậu JLPT N5 sau 3 tháng!", img: "/img/team-1.jpg" },
  { name: "Mai Anh", text: "Cảm ơn trung tâm, giờ mình tự tin giao tiếp với người Nhật khi đi du lịch.", img: "/img/team-2.jpg" },
];

export default function Home() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const data = await getCourses({ pageNo: 0, pageSize: 10 });
        console.log("Data API:", data); // debug
        setCourses(data.courseContent || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  return (
    <div>
      {/* HERO SECTION */}
      <div className="relative flex h-[90vh] items-center justify-center text-center">
        <div className="absolute top-0 h-full w-full bg-[url('/img/japan-bg.jpg')] bg-cover bg-center" />
        <div className="absolute top-0 h-full w-full bg-black/60" />
        <div className="relative z-10 px-6">
          <Typography variant="h1" color="white" className="mb-6 font-black">
            Học tiếng Nhật dễ dàng cùng J-Hajime
          </Typography>
          <Typography color="white" className="mb-8 opacity-90 text-lg">
            Từ N5 đến N1 – Lộ trình rõ ràng, giáo viên tận tâm, học để thi và đi Nhật!
          </Typography>
          <Button size="lg" color="red" className="rounded-full">
            Đăng ký ngay
          </Button>
        </div>
      </div>

      {/* KHÓA HỌC TIÊU BIỂU */}
      <section className="bg-white py-20 px-6">
        <div className="container mx-auto">
          <Typography variant="h2" className="text-center font-bold mb-12">
            Khóa học tiêu biểu
          </Typography>

          {loading ? (
            <p className="text-center text-gray-500">Đang tải khóa học...</p>
          ) : courses.length === 0 ? (
            <p className="text-center text-gray-500">Chưa có khóa học nào.</p>
          ) : (
            <Swiper
              modules={[Navigation, Pagination, Autoplay]}
              spaceBetween={20}
              slidesPerView={1}
              navigation
              pagination={{ clickable: true }}
              autoplay={{ delay: 4000 }}
              breakpoints={{ 640: { slidesPerView: 1 }, 768: { slidesPerView: 2 }, 1024: { slidesPerView: 3 } }}
            >
              {courses.map((course) => (
                <SwiperSlide key={course.id}>
                  <Card className="shadow-lg rounded-xl overflow-hidden">
                    <CardHeader floated={false} className="h-48">
                      <img
                        src={course.imageUrl || "https://picsum.photos/600/400"}
                        alt={course.title}
                        className="h-full w-full object-cover"
                      />
                    </CardHeader>
                    <CardBody>
                      <Typography variant="h5" className="font-bold">{course.title}</Typography>
                      <Typography className="my-2 text-gray-600 text-sm">{course.description}</Typography>
                      <Typography color="red" className="font-bold">
                        {course.price ? `${course.price.toLocaleString("vi-VN")} VND` : "Miễn phí"}
                      </Typography>
                      <Button size="sm" color="red" className="mt-4">Đăng ký ngay</Button>
                    </CardBody>
                  </Card>
                </SwiperSlide>
              ))}
            </Swiper>
          )}
        </div>
      </section>

      {/* GIÁO VIÊN TIÊU BIỂU */}
      <section className="px-6 py-20 bg-gray-50">
        <div className="container mx-auto">
          <Typography variant="h2" className="text-center font-bold mb-12">Giáo viên tiêu biểu</Typography>
          <Swiper
            modules={[Navigation, Pagination, Autoplay]}
            spaceBetween={20}
            slidesPerView={1}
            navigation
            pagination={{ clickable: true }}
            autoplay={{ delay: 5000 }}
            breakpoints={{ 640: { slidesPerView: 1 }, 768: { slidesPerView: 2 }, 1024: { slidesPerView: 4 } }}
          >
            {teachersData.map((teacher) => (
              <SwiperSlide key={teacher.name}>
                <div className="relative group overflow-hidden rounded-2xl shadow-lg">
                  <img src={teacher.img} alt={teacher.name} className="w-full h-80 object-cover transform transition-transform duration-500 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-black/70 flex flex-col justify-center items-center opacity-0 group-hover:opacity-100 transition-opacity duration-500 text-white p-6">
                    <h3 className="text-xl font-bold">{teacher.name}</h3>
                    <p>{teacher.position}</p>
                    <p className="mt-2 text-sm">🎓 {teacher.degree}</p>
                    <p className="mt-1 text-sm flex items-center">⭐ {teacher.rating}/5</p>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </section>

      {/* FEEDBACK HỌC VIÊN */}
      <section className="bg-white py-20 px-6">
        <div className="container mx-auto">
          <Typography variant="h2" className="text-center font-bold mb-12">Học viên nói gì về chúng tôi</Typography>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {testimonialsData.map((t) => (
              <Card key={t.name} className="p-6 shadow-md rounded-xl flex items-center gap-6">
                <img src={t.img} alt={t.name} className="w-20 h-20 rounded-full object-cover" />
                <div>
                  <Typography variant="h6" className="font-bold">{t.name}</Typography>
                  <Typography className="text-gray-600">{t.text}</Typography>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FORM LIÊN HỆ */}
      <section className="bg-gray-100 py-20 px-6">
        <div className="container mx-auto text-center">
          <Typography variant="h2" className="font-bold mb-6">Liên hệ tư vấn miễn phí</Typography>
          <form className="mx-auto mt-8 max-w-xl bg-white shadow-md rounded-xl p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <Input label="Họ và tên" />
              <Input label="Số điện thoại" />
            </div>
            <Input label="Email" className="mb-6" />
            <Textarea label="Lời nhắn" rows={5} />
            <Button size="lg" color="red" className="mt-6 w-full rounded-full">Gửi thông tin</Button>
          </form>
        </div>
      </section>

      <Footer />
    </div>
  );
}
