import React, { useState, useEffect, useRef } from "react";
import { getAllCourses } from "@/api/courseApi"; 
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

const teachersData = [
  { name: "Nguyễn Lan", position: "Giảng viên JLPT N1", img: "/img/team-2.jpg", degree: "Thạc sĩ Ngôn ngữ Nhật", rating: "4.9" },
  { name: "Trần Minh", position: "Chuyên gia JLPT N2", img: "/img/team-3.jpg", degree: "Cử nhân Nhật Bản học", rating: "4.8" },
  { name: "Lê Hương", position: "Giáo viên JLPT N3", img: "/img/team-2.jpg", degree: "Thạc sĩ Giáo dục", rating: "4.7" },
  { name: "Phạm Tuấn", position: "Giảng viên JLPT N5, N4", img: "/img/team-3.jpg", degree: "Cử nhân Ngôn ngữ Nhật", rating: "4.6" },
  { name: "Mai Anh", position: "Giáo viên JLPT N1", img: "/img/team-1.jpg", degree: "Tiến sĩ Nhật Bản học", rating: "5.0" },
];

const testimonialsData = [
  { 
    name: "Hoàng Nam", 
    text: "Khóa học N5 rất dễ hiểu, thầy cô nhiệt tình, mình đã đậu JLPT N5 sau 3 tháng!", 
    img: "/img/team-1.jpg",
    rating: 5,
    course: "Khóa học N5"
  },
  { 
    name: "Mai Anh", 
    text: "Cảm ơn trung tâm, giờ mình tự tin giao tiếp với người Nhật khi đi du lịch.", 
    img: "/img/team-2.jpg",
    rating: 5,
    course: "Khóa giao tiếp"
  },
  { 
    name: "Minh Tuấn", 
    text: "Môi trường học tập tuyệt vời, giáo viên bản ngữ rất tận tâm. Mình đã cải thiện được khả năng nghe nói rất nhiều!", 
    img: "/img/team-3.jpg",
    rating: 5,
    course: "Khóa N4"
  },
  { 
    name: "Thu Hà", 
    text: "Phương pháp giảng dạy hiện đại, tài liệu phong phú. Đặc biệt là các hoạt động thực hành rất thú vị!", 
    img: "/img/team-3.jpg",
    rating: 5,
    course: "Khóa N3"
  },
];

export default function Home() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentSection, setCurrentSection] = useState(0);
  const containerRef = useRef(null);

  useEffect(() => {
  const fetchCourses = async () => {
    try {
      const data = await getAllCourses();
      console.log("Data API:", data); 
      setCourses(data.courseInfo || []); 
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  fetchCourses();
}, []);

  useEffect(() => {
    let isScrolling = false;
    
    const handleWheel = (e) => {
      if (isScrolling) return;
      
      e.preventDefault();
      isScrolling = true;
      
      const direction = e.deltaY > 0 ? 1 : -1;
      const newSection = Math.max(0, Math.min(5, currentSection + direction));
      
      if (newSection !== currentSection) {
        setCurrentSection(newSection);
        
        const targetElement = document.getElementById(`section-${newSection}`);
        if (targetElement) {
          targetElement.scrollIntoView({ 
            behavior: 'smooth',
            block: 'start'
          });
        }
      }
      
      setTimeout(() => {
        isScrolling = false;
      }, 800);
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener('wheel', handleWheel, { passive: false });
    }

    return () => {
      if (container) {
        container.removeEventListener('wheel', handleWheel);
      }
    };
  }, [currentSection]);

   return (
  <div ref={containerRef} className="overflow-hidden">
    <section
      id="section-0"
      className="h-screen flex items-center justify-center text-center relative"
    >
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
      >
        <source src="/videos/output_free.mp4" type="video/mp4" />
        Trình duyệt của bạn không hỗ trợ video nền.
      </video>
      <div className="relative z-10 px-6 transform transition-all duration-1000">
        <Typography
          variant="h1"
          color="white"
          className="mb-6 font-black text-3xl lg:text-5xl"
        >
          Học tiếng Nhật dễ dàng cùng J-Hajime
        </Typography>
        <Typography
          color="white"
          className="mb-8 opacity-90 text-lg lg:text-xl max-w-4xl mx-auto"
        >
          Từ N5 đến N1 – Lộ trình rõ ràng, giáo viên tận tâm, học để thi và đi
          Nhật!
        </Typography>
        <Button
          size="lg"
          color="red"
          className="rounded-3xl text-lg px-8 py-4 hover:scale-105 transition-transform"
        >
          Đăng ký ngay
        </Button>
      </div>
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white animate-bounce">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </section>
      <section id="section-1" className="h-screen flex items-center justify-center bg-white">
        <div className="container mx-auto px-6 text-center">
          <Typography variant="h2" className="font-bold mb-12 text-2xl lg:text-4xl">
            Khóa học tiêu biểu
          </Typography>

          {loading ? (
            <p className="text-center text-gray-500 text-lg">Đang tải khóa học...</p>
          ) : courses.length === 0 ? (
            <div className="text-center">
              <div className="w-32 h-32 mx-auto mb-8 bg-gray-100 rounded-full flex items-center justify-center">
                <span className="text-6xl">📚</span>
              </div>
              <p className="text-gray-500 text-xl">Chưa có khóa học nào.</p>
            </div>
          ) : (
            <Swiper
              modules={[Navigation, Pagination, Autoplay]}
              spaceBetween={30}
              slidesPerView={1}
              navigation
              pagination={{ clickable: true }}
              autoplay={{ delay: 4000 }}
              breakpoints={{ 
                640: { slidesPerView: 1 }, 
                768: { slidesPerView: 2 }, 
                1024: { slidesPerView: 3 } 
              }}
              className="max-w-7xl my-8 rounded-3xl overflow-hidden"
            >
              {courses.map((course) => (
                <SwiperSlide key={course.id}>
                  <Card className="shadow-2xl rounded-3xl overflow-hidden transform hover:scale-105 transition-transform duration-300 h-96">
                    <CardHeader floated={false} className="h-48">
                      <img
                        src={course.imagePresignedUrl || "/img/default-course.jpg"}
                        alt={course.title}
                        className="h-full w-full object-cover"
                      />
                    </CardHeader>
                    <CardBody className="p-6">
                      <Typography variant="h5" className="font-bold mb-2">{course.title}</Typography>
                      <Typography className="text-gray-600 text-sm mb-4">{course.description}</Typography>
                      <Typography color="red" className="font-bold text-xl mb-4">
                        {course.price ? `${course.price.toLocaleString("vi-VN")} VND` : "Miễn phí"}
                      </Typography>
                      <Button size="sm" color="red" className="rounded-2xl w-full">Đăng ký ngay</Button>
                    </CardBody>
                  </Card>
                </SwiperSlide>
              ))}
            </Swiper>
          )}
        </div>
      </section>
      <section id="section-2" className="h-screen flex items-center justify-center bg-gray-50">
        <div className="container mx-auto px-8">
          <Typography variant="h2" className="text-center font-bold mb-12 text-2xl lg:text-4xl">
            Giáo viên tiêu biểu
          </Typography>
          <Swiper
            modules={[Navigation, Pagination, Autoplay]}
            spaceBetween={30}
            slidesPerView={1}
            navigation
            pagination={{ clickable: true }}
            autoplay={{ delay: 5000 }}
            breakpoints={{ 
              640: { slidesPerView: 1 }, 
              768: { slidesPerView: 2 }, 
              1024: { slidesPerView: 4 } 
            }}
            className="max-w-7xl"
          >
            {teachersData.map((teacher) => (
              <SwiperSlide key={teacher.name}>
                <div className="relative group overflow-hidden shadow-2xl h-96 rounded-3xl">
                  <img 
                    src={teacher.img} 
                    alt={teacher.name} 
                    className="w-full h-full object-cover transform transition-transform duration-700 group-hover:scale-110" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-6 text-white">
                    <h3 className="text-2xl font-bold mb-2">{teacher.name}</h3>
                    <p className="text-lg mb-2">{teacher.position}</p>
                    <p className="text-sm mb-1">🎓 {teacher.degree}</p>
                    <p className="text-sm flex items-center">⭐ {teacher.rating}/5</p>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </section>
      <section id="section-3" className="h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-indigo-50 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-96 h-96 bg-blue-100 rounded-full mix-blend-multiply filter blur-2xl opacity-30 animate-pulse"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-indigo-100 rounded-full mix-blend-multiply filter blur-2xl opacity-30 animate-pulse delay-1000"></div>
        
        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center mb-12">
            <Typography variant="h2" className="font-bold mb-6 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent text-2xl lg:text-4xl">
              Học viên nói gì về chúng tôi
            </Typography>
            <Typography className="text-gray-600 max-w-3xl mx-auto text-lg">
              Những phản hồi chân thực từ học viên đã học tại trung tâm
            </Typography>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {testimonialsData.map((t, index) => (
              <Card 
                key={t.name} 
                className="group relative p-8 shadow-2xl hover:shadow-3xl rounded-3xl bg-white/90 backdrop-blur-sm border border-white/20 transition-all duration-500 hover:-translate-y-2 hover:scale-[1.02] overflow-hidden"
              >
                <div className="absolute top-6 right-6 text-blue-100 group-hover:text-blue-200 transition-colors duration-300">
                  <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h4v10h-10z"/>
                  </svg>
                </div>
                
                <div className="relative z-10">
                  <div className="flex items-center gap-1 mb-6">
                    {[...Array(t.rating)].map((_, i) => (
                      <svg key={i} className="w-6 h-6 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>           
                  <Typography className="text-gray-700 mb-6 leading-relaxed italic">
                    "{t.text}"
                  </Typography>
                  
                  <div className="flex items-center gap-4">
                    <img 
                      src={t.img} 
                      alt={t.name} 
                      className="w-16 h-16 rounded-full object-cover ring-4 ring-white shadow-lg" 
                    />
                    <div>
                      <Typography variant="h6" className="font-bold text-gray-800">
                        {t.name}
                      </Typography>
                      <Typography className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-2xl inline-block mt-1">
                        {t.course}
                      </Typography>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>
      <section id="section-4" className="h-screen flex items-center justify-center bg-gray-100">
        <div className="container mx-auto px-6 text-center">
          <Typography variant="h2" className="font-bold mb-12 text-2xl lg:text-3xl">
            Liên hệ tư vấn miễn phí
          </Typography>
          <form className="mx-auto mt-12 max-w-xl bg-white shadow-2xl rounded-3xl p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <Input label="Họ và tên" />
              <Input label="Số điện thoại" />
            </div>
            <Input label="Email" className="mb-4" />
            <Textarea label="Lời nhắn" rows={4} />
            <Button size="md" color="red" className="mt-6 w-full rounded-3xl hover:scale-105 transition-transform">
              Gửi thông tin
            </Button>
          </form>
        </div>
      </section>
      <section id="section-5" className="min-h-screen flex flex-col">
        <Footer />
      </section>
    </div>
  );
}