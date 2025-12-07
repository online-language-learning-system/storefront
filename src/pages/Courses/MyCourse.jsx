import React, { useState, useEffect } from "react";
import Footer from "@/components/Footer";
import { Progress } from "@material-tailwind/react";
import { BookOpenIcon } from "@heroicons/react/24/solid";
import { getProgressById } from "@/api/progressApi"; // import API của bạn
import { useNavigate } from "react-router-dom";

const PersonalCourse = () => {
  const [filter, setFilter] = useState("learning");
  const [currentPage, setCurrentPage] = useState(1);
  const [courses, setCourses] = useState([]);
  const itemsPerPage = 3;
  const navigate = useNavigate();

  useEffect(() => {
    // giả lập fetch từ API enrollment/progress
    const fetchCourses = async () => {
      try {
        const courseIds = [1,2,3,4,5,6,7,8,9,10,11,12,13];
        const promises = courseIds.map(id => getProgressById(id));
        const results = await Promise.all(promises);
        setCourses(results);
      } catch (err) {
        console.error("Không lấy được dữ liệu courses:", err);
      }
    };
    fetchCourses();
  }, []);

  const filteredCourses = courses.filter(course => {
    if (filter === "learning") return course.progress > 0 && course.progress < 100;
    if (filter === "completed") return course.progress === 100;
    if (filter === "purchased") return course.status === "purchased" || course.progress === 0;
    return true;
  });

  const totalPages = Math.ceil(filteredCourses.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedCourses = filteredCourses.slice(startIndex, startIndex + itemsPerPage);

  const handlePrev = () => currentPage > 1 && setCurrentPage(currentPage - 1);
  const handleNext = () => currentPage < totalPages && setCurrentPage(currentPage + 1);

  return (
    <div className="flex flex-col min-h-screen pt-24 bg-[#7D1B4E]">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-semibold text-white mb-2">Khóa học của bạn</h1>
        <p className="text-gray-200 text-lg">
          Quản lý tiến độ và truy cập nhanh các khóa học đã mua
        </p>
      </div>

      {/* Nút lọc */}
      <div className="flex justify-center mb-10 space-x-4">
        <button
          onClick={() => { setFilter("learning"); setCurrentPage(1); }}
          className={`px-5 py-2 rounded-full font-medium transition-all ${
            filter === "learning"
              ? "bg-white text-[#7D1B4E]"
              : "bg-[#910c4e] text-white hover:bg-[#b31763]"
          }`}
        >
          Đang học
        </button>
        <button
          onClick={() => { setFilter("completed"); setCurrentPage(1); }}
          className={`px-5 py-2 rounded-full font-medium transition-all ${
            filter === "completed"
              ? "bg-white text-[#7D1B4E]"
              : "bg-[#910c4e] text-white hover:bg-[#b31763]"
          }`}
        >
          Đã học
        </button>
        <button
          onClick={() => { setFilter("purchased"); setCurrentPage(1); }}
          className={`px-5 py-2 rounded-full font-medium transition-all ${
            filter === "purchased"
              ? "bg-white text-[#7D1B4E]"
              : "bg-[#910c4e] text-white hover:bg-[#b31763]"
          }`}
        >
          Đã mua
        </button>
      </div>

      {/* Danh sách khóa học */}
      <div className="flex flex-col gap-6 max-w-6xl mx-auto px-4 mb-16">
        {paginatedCourses.length === 0 ? (
          <p className="text-center text-gray-200">
            Không có khóa học nào phù hợp với bộ lọc.
          </p>
        ) : (
          paginatedCourses.map(course => (
            <div
              key={course.id}
              className="bg-white flex flex-col sm:flex-row rounded-lg shadow-md hover:shadow-lg transition-all p-4 sm:p-5 min-h-[200px]"
            >
              <img
                src={course.image}
                alt={course.title}
                className="rounded-lg w-full sm:w-1/4 h-48 sm:h-52 object-cover mb-3 sm:mb-0 sm:mr-4 flex-shrink-0"
              />

              <div className="flex flex-col justify-between w-full">
                <div>
                  <div className="flex items-center mb-1">
                    <BookOpenIcon className="w-6 h-6 text-[#910c4e] mr-2" />
                    <h2 className="text-lg font-semibold text-gray-800">{course.title}</h2>
                  </div>
                  <p className="text-gray-600 text-sm mb-2">
                    {course.progress === 0
                      ? "Khóa học đã mua, hãy bắt đầu học ngay!"
                      : course.progress < 100
                      ? "Bạn đang học khóa này."
                      : "Bạn đã hoàn thành khóa học này."}
                  </p>
                </div>

                <div className="flex flex-col gap-2">
                  <div className="flex justify-between text-xs text-gray-600 mb-1">
                    <span>Tiến độ học</span>
                    <span>{course.progress}%</span>
                  </div>
                  <Progress value={course.progress} color="green" className="h-2 w-full" />

                  <div className="flex gap-2 mt-2">
                    {course.progress < 100 && (
                      <button
                        onClick={() => navigate(`/courses/${course.id}`)}
                        className={`px-4 py-2 rounded-full font-medium bg-[#910c4e] text-white hover:bg-[#b31763]`}
                      >
                        {course.progress === 0 ? "Bắt đầu" : "Tiếp tục"}
                      </button>
                    )}
                    <button
                      onClick={() => navigate(`/courses/${course.id}`)}
                      className="px-4 py-2 rounded-full font-medium bg-gray-200 text-[#7D1B4E] hover:bg-gray-300"
                    >
                      Chi tiết
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Phân trang */}
      {totalPages > 1 && (
        <div className="flex justify-center mb-16 space-x-4">
          <button
            onClick={handlePrev}
            disabled={currentPage === 1}
            className={`px-4 py-2 rounded-full font-medium ${
              currentPage === 1
                ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                : "bg-[#910c4e] text-white hover:bg-[#b31763]"
            }`}
          >
            Trang trước
          </button>
          <button
            onClick={handleNext}
            disabled={currentPage === totalPages}
            className={`px-4 py-2 rounded-full font-medium ${
              currentPage === totalPages
                ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                : "bg-[#910c4e] text-white hover:bg-[#b31763]"
            }`}
          >
            Trang sau
          </button>
        </div>
      )}

      <div className="w-full border-t-4 border-[#910c4e]/60 mb-4"></div>
      <Footer />
    </div>
  );
};

export default PersonalCourse;
