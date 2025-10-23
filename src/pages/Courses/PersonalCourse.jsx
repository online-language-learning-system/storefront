import React, { useState } from "react";
    import Footer from "@/components/Footer";
    import { Progress } from "@material-tailwind/react";
    import { BookOpenIcon } from "@heroicons/react/24/solid";

const PersonalCourse = () => {
  const [filter, setFilter] = useState("learning");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;

  const courses = [
    { id: 1, title: "Khóa học tiếng Nhật N5 - Cơ bản", progress: 45, status: "learning", image: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=400&q=50" },
    { id: 2, title: "Luyện thi JLPT N4 - Ngữ pháp nâng cao", progress: 100, status: "completed", image: "https://images.unsplash.com/photo-1513258496099-48168024aec0?auto=format&fit=crop&w=400&q=50" },
    { id: 3, title: "Từ vựng tiếng Nhật N3 theo chủ đề", progress: 0, status: "purchased", image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=400&q=50" },
    { id: 4, title: "Nghe hiểu tiếng Nhật N5 cơ bản", progress: 20, status: "learning", image: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=400&q=50" },
    { id: 5, title: "Kanji N4 - Nhận diện và luyện viết", progress: 60, status: "learning", image: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=400&q=50" },
    { id: 6, title: "Ngữ pháp N3 nâng cao", progress: 80, status: "completed", image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=400&q=50" },
    { id: 7, title: "Từ vựng theo chủ đề Du lịch N5", progress: 10, status: "learning", image: "https://images.unsplash.com/photo-1529070538774-1843cb3265df?auto=format&fit=crop&w=400&q=50" },
    { id: 8, title: "Nghe hiểu N4 - Hội thoại cơ bản", progress: 50, status: "learning", image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=400&q=50" },
    { id: 9, title: "Luyện thi JLPT N3 - Từ vựng chuyên sâu", progress: 0, status: "purchased", image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=400&q=50" },
    { id: 10, title: "Kanji N5 - Cơ bản cho người mới bắt đầu", progress: 100, status: "completed", image: "https://images.unsplash.com/photo-1513258496099-48168024aec0?auto=format&fit=crop&w=400&q=50" },
    { id: 11, title: "Ngữ pháp N5 - Câu cơ bản", progress: 70, status: "learning", image: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=400&q=50" },
    { id: 12, title: "Hội thoại N3 - Tiếng Nhật giao tiếp", progress: 30, status: "learning", image: "https://images.unsplash.com/photo-1529070538774-1843cb3265df?auto=format&fit=crop&w=400&q=50" },
    { id: 13, title: "Từ vựng N4 theo chủ đề Công việc", progress: 0, status: "purchased", image: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=400&q=50" },
  ];

  const filteredCourses = courses.filter(course => {
    if (filter === "learning") return course.status === "learning";
    if (filter === "completed") return course.status === "completed";
    if (filter === "purchased") return course.status === "purchased";
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
        <h1 className="text-3xl font-semibold text-white mb-2">
          Khóa học của bạn
        </h1>
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
                    <h2 className="text-lg font-semibold text-gray-800">
                      {course.title}
                    </h2>
                  </div>
                  <p className="text-gray-600 text-sm mb-2">
                    {course.status === "learning"
                      ? "Bạn đang học khóa này."
                      : course.status === "completed"
                      ? "Bạn đã hoàn thành khóa học này."
                      : "Khóa học đã mua, hãy bắt đầu học ngay!"}
                  </p>
                </div>

                <div>
                  <div className="flex justify-between text-xs text-gray-600 mb-1">
                    <span>Tiến độ học</span>
                    <span>{course.progress}%</span>
                  </div>
                  <Progress
                    value={course.progress}
                    color="green"
                    className="h-2 w-full"
                  />
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
