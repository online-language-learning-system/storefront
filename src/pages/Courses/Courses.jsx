import React, { useEffect, useState } from "react";
import { createCourse,getAllCourses } from "@/api/courseApi"; 
import { addToCart,getCart } from "@/api/cartApi";
import { useNavigate } from "react-router-dom"; 
import Footer from "@/components/Footer";

const Courses = () => {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const [showSuccess, setShowSuccess] = useState(false);
  const [showWarning, setShowWarning] = useState(false);
  const handleShowSuccess = () => {
  setShowSuccess(true);
  setTimeout(() => setShowSuccess(false), 2000); 
};
const handleShowWarning = () => {
  setShowWarning(true);
  setTimeout(() => setShowWarning(false), 2000);
};
  const token = localStorage.getItem("accessToken"); // 
  const navigate = useNavigate();
  const emptyResource = () => ({ resourceType: "TEXT", resourceUrl: "Content", file: null });

  console.log('Current user:', user);
  console.log('User role:', user.role);
  const [courses, setCourses] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [currentStep, setCurrentStep] = useState(1); 
  const [isCreating, setIsCreating] = useState(false);
  const [loading, setLoading] = useState(true);

  // Filter
  const [search, setSearch] = useState("");
  const [language, setLanguage] = useState("all");
  const [price, setPrice] = useState("all");
  const [freeOnly, setFreeOnly] = useState(false);

  // Pagination
  const [pageNo, setPageNo] = useState(0);
  const pageSize = 9;
  const [selectedFile, setSelectedFile] = useState(null); 
  const [newCourse, setNewCourse] = useState({
    title: "Khóa học demo",
    teachingLanguage: "VN",
    price: 0,
    categoryId: 1,
    description: "Mô tả khóa học demo",
    startDate: "",
    endDate: "",
    duration: 1,
    courseModules: [
      {
        title: "Chương 1",
        description: "Mô tả chương 1",
        orderIndex: 1,
        canFreeTrial: false,
        lessons: [
          {
            title: "Bài học 1",
            description: "Mô tả bài học 1",
            duration: 30,
            resources: [{ ...emptyResource() }],
          },
        ],
      },
    ],
  });
useEffect(() => {
  async function fetchCourses() {
    try {
      setLoading(true);
      const data = await getAllCourses();
      console.log("== getAllCourses response ==", data);
      const courseList = Array.isArray(data.courseInfo) ? data.courseInfo : [];
      setCourses(courseList);

    } catch (err) {
      console.error("Lỗi khi load khóa học:", err);
    } finally {
      setLoading(false);
    }
  }
  fetchCourses();
}, []);
  // Cover file input
  const handleCoverChange = (e) => {
    const f = e.target.files && e.target.files[0];
    setSelectedFile(f || null);
  };

  // Helpers
  const handleCourseFieldChange = (field, value) =>
    setNewCourse((prev) => ({ ...prev, [field]: value }));

  const handleModuleFieldChange = (modIndex, field, value) => {
    const modules = [...newCourse.courseModules];
    modules[modIndex][field] = value;
    setNewCourse({ ...newCourse, courseModules: modules });
  };

  const handleLessonFieldChange = (modIndex, lessonIndex, field, value) => {
    const modules = [...newCourse.courseModules];
    modules[modIndex].lessons[lessonIndex][field] = value;
    setNewCourse({ ...newCourse, courseModules: modules });
  };

  const handleResourceFieldChange = (
    modIndex,
    lessonIndex,
    resIndex,
    field,
    value
  ) => {
    const modules = [...newCourse.courseModules];
    modules[modIndex].lessons[lessonIndex].resources[resIndex][field] = value;
    setNewCourse({ ...newCourse, courseModules: modules });
  };

  const handleResourceFileChange = (modIndex, lessonIndex, resIndex, newFiles) => {
  const modules = [...newCourse.courseModules];
  const resource = modules[modIndex].lessons[lessonIndex].resources[resIndex];

  if (!resource.files) resource.files = [];
  resource.files = [...resource.files, ...newFiles];
  newFiles.forEach((file) => {
    const ext = file.name.split(".").pop().toLowerCase();
    if (ext === "pdf") resource.resourceType = "PDF";
    else if (["doc", "docx"].includes(ext)) resource.resourceType = "WORD";
    else if (["mp4", "avi", "mov"].includes(ext)) resource.resourceType = "VIDEO";
    else resource.resourceType = "OTHER";
  });

  setNewCourse({ ...newCourse, courseModules: modules });
};

  const handleAddModule = () => {
    setNewCourse((prev) => ({
      ...prev,
      courseModules: [
        ...prev.courseModules,
        {
          title: `Module ${prev.courseModules.length + 1}`,
          description: "",
          orderIndex: prev.courseModules.length + 1,
          canFreeTrial: false,
          lessons: [
            {
              title: "Bài học 1",
              description: "",
              duration: 30,
              resources: [{ ...emptyResource() }],
            },
          ],
        },
      ],
    }));
  };

  const handleAddLesson = (modIndex) => {
    const modules = [...newCourse.courseModules];
    modules[modIndex].lessons.push({
      title: `Bài học ${modules[modIndex].lessons.length + 1}`,
      description: "",
      duration: 30,
      resources: [{ ...emptyResource() }],
    });
    setNewCourse({ ...newCourse, courseModules: modules });
  };

  const handleAddResource = (modIndex, lessonIndex) => {
    const modules = [...newCourse.courseModules];
    modules[modIndex].lessons[lessonIndex].resources.push({ ...emptyResource() });
    setNewCourse({ ...newCourse, courseModules: modules });
  };

  const handleRemoveResource = (modIndex, lessonIndex, resIndex) => {
    const modules = [...newCourse.courseModules];
    modules[modIndex].lessons[lessonIndex].resources.splice(resIndex, 1);
    setNewCourse({ ...newCourse, courseModules: modules });
  };

  const validatePayload = (payload) => {
  if (!payload.title?.trim()) throw new Error("Title không được để trống");
  if (!payload.teachingLanguage?.trim())
    throw new Error("Teaching language không được để trống");
  if (!payload.categoryId) throw new Error("categoryId không được để trống");

  if (!Array.isArray(payload.courseModules) || payload.courseModules.length === 0)
    throw new Error("Phải có ít nhất 1 chương");

  payload.courseModules.forEach((mod, mi) => {
    if (!mod.title?.trim()) throw new Error(`Chương #${mi + 1} thiếu tựa đề`);

    if (!Array.isArray(mod.lessons) || mod.lessons.length === 0)
      throw new Error(`Chương #${mi + 1} phải có ít nhất 1 bài học`);

    mod.lessons.forEach((lesson, li) => {
      if (!lesson.title?.trim())
        throw new Error(`Bài học #${li + 1} của Chương #${mi + 1} thiếu tựa đề`);

      if (!Array.isArray(lesson.resources) || lesson.resources.length === 0)
        throw new Error(
          `Bài học #${li + 1} của Chương #${mi + 1} phải có ít nhất 1 tài nguyên`
        );

      lesson.resources.forEach((r, ri) => {
        if (!r.resourceType?.trim()) r.resourceType = "TEXT";
        if (!r.resourceUrl?.trim() && !r.files?.length) r.resourceUrl = "Content";
      });
    });
  });
};

const handleCreateCourse = async (e) => {
  e.preventDefault();
  if (!selectedFile)
    return alert("Vui lòng chọn ảnh đại diện khóa học (cover)");
  setIsCreating(true);

  try {
    const modules = newCourse.courseModules.map((mod, mi) => ({
      title: mod.title?.trim() || `Module ${mi + 1}`,
      description: mod.description || "",
      orderIndex: Number(mod.orderIndex) || mi + 1,
      canFreeTrial: !!mod.canFreeTrial,
      lessons: mod.lessons.map((lesson, li) => ({
        title: lesson.title?.trim() || `Bài học ${li + 1}`,
        description: lesson.description || "",
        duration: Number(lesson.duration) || 30,
        resources: lesson.resources.map((r) => ({
          resourceType: (r.resourceType || "TEXT").toUpperCase(),
          resourceUrl: r.resourceUrl?.trim() || "Content",
        })),
      })),
    }));
    const validCategoryIds = [1, 2, 3, 4, 5];
    const payload = {
  title: newCourse.title?.trim() || "Khóa học demo",
  teachingLanguage: newCourse.teachingLanguage || "VN",
  price: Number(newCourse.price) || 0.01,
  categoryId: validCategoryIds.includes(newCourse.categoryId)
    ? Number(newCourse.categoryId)
    : null, 
  description: newCourse.description || "Mô tả khóa học demo",
  startDate: newCourse.startDate
    ? new Date(newCourse.startDate).toISOString()
    : new Date().toISOString(),
  endDate: newCourse.endDate
    ? new Date(newCourse.endDate).toISOString()
    : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
  courseModules: modules,
  };
  if (!payload.categoryId) {
    return alert("Vui lòng chọn cấp độ hợp lệ từ N5 → N1");
  }
    validatePayload(payload);

    const resourceFiles = [];
    newCourse.courseModules.forEach((mod) =>
      mod.lessons.forEach((lesson) =>
        lesson.resources.forEach((r) => {
          if (r.files && r.files.length > 0) {
            resourceFiles.push(...r.files);
          }
        })
      )
    );

    console.log("Payload JSON:", JSON.stringify(payload, null, 2));
    console.log("Cover file:", selectedFile);
    console.log("Resource files:", resourceFiles);

    const response = await createCourse(payload, selectedFile, resourceFiles);
    console.log("API response:", response);

    alert("🎉 Tạo khóa học thành công!");
    handleShowSuccess();
    setShowForm(false);
    setCurrentStep(1);
    setSelectedFile(null);

    // Reset form
    setNewCourse({
      title: "Khóa học demo",
      teachingLanguage: "VN",
      price: 0,
      categoryId: 1,
      description: "Mô tả khóa học demo",
      startDate: "",
      endDate: "",
      duration: 1,
      courseModules: [
        {
          title: "Chương 1",
          description: "Mô tả chương 1",
          orderIndex: 1,
          canFreeTrial: false,
          lessons: [
            {
              title: "Bài học 1",
              description: "Mô tả bài học 1",
              duration: 30,
              resources: [{ ...emptyResource() }],
            },
          ],
        },
      ],
    });
  } catch (err) {
    console.error("❌ Lỗi tạo khóa học:", err);
    alert(err.message || "Có lỗi khi tạo khóa học");
  } finally {
    setIsCreating(false);
  }
};

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

const totalPages = Math.ceil(filteredCourses.length / pageSize);
const paginatedCourses = filteredCourses.slice(
  pageNo * pageSize,
  (pageNo + 1) * pageSize
);


  useEffect(() => setPageNo(0), [search, language, price, freeOnly]);


  const handleBuyNow = async (course) => {
  try {

    await addToCart(course.courseId || course.id);

    const newCart = await getCart();
    localStorage.setItem("cart", JSON.stringify(newCart));
    window.dispatchEvent(new Event("cartUpdated"));

  
    navigate("/payment");
  } catch (err) {
    console.error("❌ Lỗi khi mua ngay:", err);
    alert("Có lỗi khi mua ngay!");
  }
};
  const handleAddToCart = (course) => {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];

  const courseId = course.courseId || course.id;
  const existing = cart.find((item) => item.courseId === courseId);

  if (existing) {
    handleShowWarning();
  } else {
    cart.push({
      courseId,
      courseName: course.courseName || course.title,
      price: Number(course.price || 0),
      instructor: course.instructor || course.createdBy || "Không rõ",
      quantity: 1,
      imageUrl: course.imagePresignedUrl || course.imageUrl || course.image || "",
    });

    localStorage.setItem("cart", JSON.stringify(cart));
    window.dispatchEvent(new Event("cartUpdated"));

    handleShowSuccess();
  }
};


  const handleNextStep = (e) => {
    e.preventDefault(); 
    console.log("handleNextStep được gọi - currentStep:", currentStep);
    if (currentStep === 1) {
      if (!newCourse.title.trim()) {
        alert("Vui lòng nhập tên khóa học");
        return;
      }
      if (!selectedFile) {
        alert("Vui lòng chọn hình ảnh khóa học");
        return;
      }
    }
    setCurrentStep(prev => Math.min(prev + 1, 2));
  };

  const handlePrevStep = (e) => {
    e.preventDefault(); // Ngăn form submit
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };
const [activeModuleIndex, setActiveModuleIndex] = useState(
  newCourse.courseModules.length > 0 ? 0 : -1
);

const handleToggleModule = (modIdx) => {
  setActiveModuleIndex(prevIndex => (prevIndex === modIdx ? -1 : modIdx));
};

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            {/* Thông tin cơ bản */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-2xl border border-blue-100">
              <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-3">
                <div className="w-7 h-7 bg-blue-600 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                Thông tin cơ bản
              </h3>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="lg:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Tên khóa học *</label>
                  <input
                    type="text"
                    placeholder="Nhập tên khóa học của bạn"
                    value={newCourse.title} onChange={(e) => handleCourseFieldChange("title", e.target.value)
                    }
                    className="w-full border-2 border-gray-200 px-3 py-2.5 rounded-xl focus:ring-2 focus:ring-[#910c4e] focus:border-[#910c4e] transition-all duration-200 bg-white shadow-sm text-sm"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Ngôn ngữ giảng dạy</label>
                  <select
                    value={newCourse.teachingLanguage}
                    onChange={(e) =>
                      setNewCourse({ ...newCourse, teachingLanguage: e.target.value })
                    }
                    className="w-full border-2 border-gray-200 px-3 py-2.5 rounded-xl focus:ring-2 focus:ring-[#910c4e] focus:border-[#910c4e] transition-all duration-200 bg-white shadow-sm text-sm"
                  >
                    <option value="Tiếng Việt">🇻🇳 Tiếng Việt</option>
                    <option value="Tiếng Nhật">🇯🇵 Tiếng Nhật</option>
                    <option value="Tiếng Anh">🇺🇸 Tiếng Anh</option>
                  </select>
                </div>
                <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cấp độ (Level)
                </label>
                <select
                  value={newCourse.categoryId || ""}
                  onChange={(e) => {
                    const val = e.target.value === "" ? null : Number(e.target.value);
                    setNewCourse({ ...newCourse, categoryId: val });
                  }}
                  className="w-full border-2 border-gray-200 px-3 py-2.5 rounded-xl
                            focus:ring-2 focus:ring-[#910c4e] focus:border-[#910c4e]
                            transition-all duration-200 bg-white shadow-sm text-sm"
                >
                  <option value="">Chọn cấp độ</option>
                  <option value={1}>N5 - Sơ cấp</option>
                  <option value={2}>N4 - Sơ trung cấp</option>
                  <option value={3}>N3 - Trung cấp</option>
                  <option value={4}>N2 - Trung cao cấp</option>
                  <option value={5}>N1 - Cao cấp</option>
                </select>
              </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Giá khóa học (VND)</label>
                  <div className="relative">
                    <input
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      placeholder="Nhập giá khóa học"
                      value={newCourse.price === 0 ? '' : newCourse.price}
                      onChange={(e) => {
                        const value = e.target.value.replace(/[^0-9]/g, '');
                        setNewCourse({ ...newCourse, price: value === '' ? 0 : Number(value) });
                      }}
                      className="w-full border-2 border-gray-200 px-3 py-2.5 pl-12 rounded-xl focus:ring-2 focus:ring-[#910c4e] focus:border-[#910c4e] transition-all duration-200 bg-white shadow-sm text-sm [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    />
                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 font-medium text-sm">
                      ₫
                    </div>
                  </div>
                  <p className="text-sm text-gray-500 mt-2">Bỏ trống nếu khóa học miễn phí</p>
                </div>
              </div>
            </div>

            {/* Mô tả khóa học */}
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-2xl border border-green-100">
              <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-3">
                <div className="w-7 h-7 bg-green-600 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
                  </svg>
                </div>
                Mô tả khóa học
              </h3>
              <textarea
                placeholder="Mô tả chi tiết về nội dung, mục tiêu và lợi ích của khóa học..."
                value={newCourse.description}
                onChange={(e) =>
                  setNewCourse({ ...newCourse, description: e.target.value })
                }
                rows={2}
                className="w-full border-2 border-gray-200 px-3 py-2.5 rounded-xl focus:ring-2 focus:ring-[#910c4e] focus:border-[#910c4e] transition-all duration-200 bg-white shadow-sm resize-none text-sm"
              />
            </div>

            {/* Thời gian khóa học */}
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-2xl border border-purple-100">
              <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-3">
                <div className="w-7 h-7 bg-purple-600 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                Thời gian khóa học
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Thời lượng khóa học</label>
                  <select
                    value={newCourse.duration}
                    onChange={(e) => {
                      const duration = parseInt(e.target.value);
                      let endDate = '';
                      
                      if (newCourse.startDate) {
                        const startDate = new Date(newCourse.startDate);
                        startDate.setMonth(startDate.getMonth() + duration);
                        endDate = startDate.toISOString().split('T')[0];
                      }
                      
                      setNewCourse({ 
                        ...newCourse, 
                        duration: duration,
                        endDate: endDate
                      });
                    }}
                    className="w-full border-2 border-gray-200 px-3 py-2.5 rounded-xl focus:ring-2 focus:ring-[#910c4e] focus:border-[#910c4e] transition-all duration-200 bg-white shadow-sm text-sm"
                  >
                    {[1,2,3,4,5,6,7,8,9,10,11,12].map(month => (
                      <option key={month} value={month}>{month} tháng</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Ngày bắt đầu</label>
                  <input
                    type="date"
                    value={newCourse.startDate}
                    onChange={(e) => {
                      const startDate = e.target.value;
                      let endDate = '';
                      
                      if (startDate && newCourse.duration) {
                        const start = new Date(startDate);
                        start.setMonth(start.getMonth() + newCourse.duration);
                        endDate = start.toISOString().split('T')[0];
                      }
                      setNewCourse({ 
                        ...newCourse, 
                        startDate: startDate,
                        endDate: endDate
                      });
                    }}
                    className="w-full border-2 border-gray-200 px-3 py-2 rounded-xl focus:ring-2 focus:ring-[#910c4e] focus:border-[#910c4e] transition-all duration-200 bg-white shadow-sm text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Ngày kết thúc</label>
                  <input
                    type="date"
                    value={newCourse.endDate}
                    min={newCourse.startDate || undefined}
                    onChange={(e) => {
                      const endDate = e.target.value;
                      if (newCourse.startDate && endDate < newCourse.startDate) {
                        alert('Ngày kết thúc không thể nhỏ hơn ngày bắt đầu!');
                        return;
                      }
                      setNewCourse({ ...newCourse, endDate: endDate });
                    }}
                    className="w-full border-2 border-gray-200 px-3 py-2 rounded-xl focus:ring-2 focus:ring-[#910c4e] focus:border-[#910c4e] transition-all duration-200 bg-white shadow-sm text-sm"
                  />
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-3 flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Chọn thời lượng và ngày bắt đầu, ngày kết thúc sẽ được tự động tính toán
              </p>
            </div>

            {/* Hình ảnh khóa học */}
            <div className="bg-gradient-to-r from-orange-50 to-yellow-50 p-6 rounded-2xl border border-orange-100">
              <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-3">
                <div className="w-7 h-7 bg-orange-600 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                Hình ảnh khóa học
              </h3>
              <label className="block text-sm font-medium text-gray-700 mb-3">Hình ảnh đại diện</label>
              
              {/* File Upload Area */}
              <div className="relative">
                <input
                  type="file"
                  id="course-image-upload"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) {
                      // TODO(stagewise): Replace with actual file upload API call
                      const mockImageUrl = URL.createObjectURL(file);
                      setNewCourse({ ...newCourse, imageUrls: [mockImageUrl] });
                      setSelectedFile(file);
                    }
                  }}
                  className="hidden"
                />
                
                <label
                  htmlFor="course-image-upload"
                  className="flex flex-col items-center justify-center w-full h-24 border-2 border-dashed border-orange-300 rounded-xl cursor-pointer bg-orange-50/50 hover:bg-orange-50 transition-colors duration-200"
                >
                  {newCourse.imageUrls && newCourse.imageUrls[0] ? (
                    <div className="relative w-full h-full">
                      <img
                        src={newCourse.imageUrls[0]}
                        alt="Preview"
                        className="w-full h-full object-cover rounded-xl"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-30 transition-all duration-200 rounded-xl flex items-center justify-center">
                        <div className="opacity-0 hover:opacity-100 transition-opacity duration-200">
                          <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                          </svg>
                          <p className="text-white text-sm mt-2">Thay đổi ảnh</p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center">
                      <svg className="w-8 h-8 text-orange-400 mx-auto mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                      </svg>
                      <p className="text-gray-600 font-medium mb-1 text-sm">Tải lên hình ảnh khóa học</p>
                      <p className="text-xs text-gray-400">Kéo thả hoặc click để chọn file (PNG, JPG, GIF)</p>
                    </div>
                  )}
                </label>
              </div>

              <p className="text-sm text-gray-500 mt-3 flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Tỷ lệ khuyến nghị: 16:9 (1920x1080px) để hiển thị tốt nhất
              </p>
            </div>
          </div>
        );
      
      case 2:
      // Chỉ hiển thị bài học chi tiết của module đang mở
      const currentModule = activeModuleIndex !== -1 
        ? newCourse.courseModules[activeModuleIndex]
        : null;

      return (
        <div className="space-y-8">
          <div className="bg-gradient-to-r from-indigo-50 to-cyan-50 p-8 rounded-3xl border border-indigo-100">
            <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
              <div className="w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              Tạo Chương và Bài Học 📚
            </h3>

            {/* Layout 2 cột chính */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
              
              {/* Cột trái - Quản lý chương (Accordion: Gọn gàng, chỉ mở 1 chương) */}
              <div className="space-y-6">
                <div className="bg-white p-6 rounded-2xl border-2 border-gray-200 shadow-xl">
                  <h4 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                    Danh sách chương (Chỉnh sửa thông tin chung)
                  </h4>                
                  <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
                    {newCourse.courseModules.map((module, modIdx) => (
                      <div key={modIdx} className={`border-2 rounded-xl transition-all duration-300 ${modIdx === activeModuleIndex ? 'border-indigo-500 bg-indigo-50 shadow-lg' : 'border-gray-200 bg-gray-50 hover:bg-gray-100'}`}>                       
                        <div 
                          className="p-4 cursor-pointer flex items-center justify-between"
                          onClick={() => handleToggleModule(modIdx)} 
                        >
                          <div className="flex items-center gap-3">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm transition-colors ${modIdx === activeModuleIndex ? 'bg-indigo-700' : 'bg-indigo-500'}`}>
                              {modIdx + 1}
                            </div>
                            <span className="font-semibold text-gray-800">
                                {module.title || `Chương ${modIdx + 1} (Chưa đặt tên)`}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            {module.lessons.length} bài học

                            <svg className={`w-5 h-5 ml-2 transition-transform duration-300 ${modIdx === activeModuleIndex ? 'transform rotate-180 text-indigo-700' : 'text-gray-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                          </div>
                        </div>
                        
                        {modIdx === activeModuleIndex && (
                          <div className="p-4 pt-0 border-t border-indigo-200 space-y-3">

                            <input
                              type="text"
                              placeholder={`Tên chương ${modIdx + 1}`}
                              value={module.title}
                              onChange={(e) => {
                                const updated = [...newCourse.courseModules];
                                updated[modIdx].title = e.target.value;
                                setNewCourse({ ...newCourse, courseModules: updated });
                              }}
                              className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:ring-2 focus:ring-[#910c4e] focus:border-[#910c4e] transition-all duration-200 text-sm"
                            />
                          
                            <textarea
                              placeholder={`Mô tả chương ${modIdx + 1}...`}
                              value={module.description || ''}
                              onChange={(e) => {
                                const updated = [...newCourse.courseModules];
                                updated[modIdx].description = e.target.value;
                                setNewCourse({ ...newCourse, courseModules: updated });
                              }}
                              rows={2}
                              className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:ring-2 focus:ring-[#910c4e] focus:border-[#910c4e] transition-all duration-200 resize-none text-sm"
                            />
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <input
                                  type="checkbox"
                                  id={`freeTrial-${modIdx}`}
                                  checked={module.canFreeTrial || false}
                                  onChange={(e) => {
                                    const updated = [...newCourse.courseModules];
                                    updated[modIdx].canFreeTrial = e.target.checked;
                                    setNewCourse({ ...newCourse, courseModules: updated });
                                  }}
                                  className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                                />
                                <label htmlFor={`freeTrial-${modIdx}`} className="text-sm text-gray-700">
                                  Cho phép dùng thử
                                </label>
                              </div>
                              
                              <button
                                type="button"
                                onClick={() => handleAddLesson(modIdx)}
                                className="bg-blue-500 text-white px-3 py-1.5 rounded-lg hover:bg-blue-600 transition-all duration-200 text-sm flex items-center gap-1 font-medium"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                </svg>
                                Thêm bài
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                    
                    {newCourse.courseModules.length === 0 && (
                      <div className="text-center py-4 text-gray-500 border border-dashed border-gray-300 rounded-xl">
                        <p className="text-sm">Chưa có chương nào.</p>
                      </div>
                    )}
                  </div>                 
                  <button
                    type="button"
                    onClick={handleAddModule}
                    className="w-full mt-6 bg-gradient-to-r from-green-500 to-green-600 text-white px-4 py-3 rounded-xl hover:from-green-600 hover:to-green-700 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center gap-2 font-bold"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Thêm Chương Mới
                  </button>
                </div>
              </div>
              <div className="space-y-6">
                <div className="bg-white p-6 rounded-2xl border-2 border-gray-200 shadow-xl">
                  <h4 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Chi tiết Bài học: 
                    <span className="text-purple-600">
                      {currentModule ? currentModule.title || `Chương ${activeModuleIndex + 1}` : 'Vui lòng chọn Chương'}
                    </span>
                  </h4>
                  
                  <div className="max-h-[500px] overflow-y-auto pr-2 space-y-4">
                    {currentModule ? (
                      currentModule.lessons.map((lesson, lesIdx) => (
                        <div key={lesIdx} className="bg-gray-50 border border-gray-300 rounded-xl p-4 shadow-sm">
                          <div className="flex items-center justify-between gap-2 mb-3">
                            <div className="flex items-center gap-2">
                              <div className="w-6 h-6 bg-green-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                                {activeModuleIndex + 1}.{lesIdx + 1}
                              </div>
                              <span className="text-sm font-bold text-gray-800">Bài học {lesIdx + 1}</span>
                            </div>
                            {/* Nút Xóa Bài Học (Tùy chọn) */}
                            {/* <button type="button" onClick={() => handleRemoveLesson(activeModuleIndex, lesIdx)} className="text-red-500 hover:text-red-700 text-xs">Xóa</button> */}
                          </div>

                          <input
                            type="text"
                            placeholder={`Tên bài học ${lesIdx + 1}`}
                            value={lesson.title}
                            onChange={(e) => {
                              const updatedModules = [...newCourse.courseModules];
                              updatedModules[activeModuleIndex].lessons[lesIdx].title = e.target.value;
                              setNewCourse({ ...newCourse, courseModules: updatedModules });
                            }}
                            className="w-full border border-gray-300 px-2 py-1.5 rounded text-sm mb-2 focus:ring-1 focus:ring-purple-500 focus:border-purple-500"
                          />
                          
                          <textarea
                            placeholder="Mô tả nội dung bài học"
                            value={lesson.description}
                            onChange={(e) => {
                              const updatedModules = [...newCourse.courseModules];
                              updatedModules[activeModuleIndex].lessons[lesIdx].description = e.target.value;
                              setNewCourse({ ...newCourse, courseModules: updatedModules });
                            }}
                            rows={2}
                            className="w-full border border-gray-300 px-2 py-1.5 rounded text-sm mb-2 resize-none focus:ring-1 focus:ring-purple-500 focus:border-purple-500"
                          />
                          
                          <div className="flex items-center gap-2 mb-3">
                            <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <input
                              type="number"
                              placeholder="30"
                              value={lesson.duration}
                              onChange={(e) => {
                                const updatedModules = [...newCourse.courseModules];
                                updatedModules[activeModuleIndex].lessons[lesIdx].duration = Number(e.target.value);
                                setNewCourse({ ...newCourse, courseModules: updatedModules });
                              }}
                              className="w-16 border border-gray-300 px-2 py-1 rounded text-sm text-center focus:ring-1 focus:ring-purple-500 focus:border-purple-500"
                            />
                            <span className="text-sm text-gray-500">phút</span>
                          </div>
                          
                          {/* Tài liệu bài học */}
                          <div className="mt-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                            <div className="flex justify-between items-center mb-2">
                                <p className="text-xs text-blue-700 font-bold">Tài liệu bài học:</p>
                                <button 
                                    type="button" 
                                    onClick={() => handleAddResource(activeModuleIndex, lesIdx)}
                                    className="text-xs text-blue-500 hover:text-blue-700 font-semibold flex items-center gap-1"
                                >
                                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                                    Thêm tài liệu
                                </button>
                            </div>
                            
                            {lesson.resources.map((resource, resIdx) => (
                              <div key={resIdx} className="mb-2 p-2 border border-blue-100 rounded bg-white relative">
                                {/* Nút xóa tài liệu */}
                                <button 
                                    type="button" 
                                    onClick={() => handleRemoveResource(activeModuleIndex, lesIdx, resIdx)}
                                    className="absolute top-1 right-1 text-red-400 hover:text-red-600 text-xs p-1"
                                >
                                    ✕
                                </button>

   
                                <select
                                  value={resource.resourceType || "TEXT"}
                                  onChange={(e) =>
                                    handleResourceFieldChange(activeModuleIndex, lesIdx, resIdx, "resourceType", e.target.value)
                                  }
                                  className="w-full border border-gray-300 px-2 py-1 rounded text-xs mb-1 focus:ring-1 focus:ring-purple-500 focus:border-purple-500"
                                >
                                  <option value="TEXT"> Văn bản</option>
                                  <option value="VIDEO"> Video/URL</option>
                                  <option value="PDF"> PDF</option>
                                  <option value="WORD"> Word</option>
                                  <option value="QUIZ"> Bài kiểm tra</option>
                                </select>                              
                                {resource.resourceType === 'TEXT' ? (
                                    <textarea
                                        placeholder="Nhập nội dung bài học..."
                                        rows={2}
                                        className="w-full border border-gray-300 px-2 py-1 rounded text-xs resize-none focus:ring-1 focus:ring-purple-500 focus:border-purple-500"
                                        value={resource.content || ""}
                                        onChange={(e) =>
                                          handleResourceFieldChange(activeModuleIndex, lesIdx, resIdx, "content", e.target.value)
                                        }
                                    />
                                ) : resource.resourceType === 'VIDEO' ? (
                                    <input
                                      type="file"
                                      accept="video/*" 
                                      onChange={(e) =>
                                        handleResourceFieldChange(
                                          activeModuleIndex,
                                          lesIdx,
                                          resIdx,
                                          "resourceFile",
                                          e.target.files[0]
                                        )
                                      }
                                      className="w-full border border-gray-300 px-2 py-1 rounded text-xs focus:ring-1 focus:ring-purple-500 focus:border-purple-500"
                                    />
                                  ) : (
                                  <div className="border border-dashed border-gray-300 p-2 rounded text-center">
                                  <input
                                    type="file"
                                    id={`${resource.resourceType.toLowerCase()}-upload-${activeModuleIndex}-${lesIdx}-${resIdx}`}
                                    accept={
                                      resource.resourceType === 'VIDEO' ? 'video/*' :
                                      resource.resourceType === 'PDF' ? '.pdf' :
                                      '.doc,.docx'
                                    }
                                    multiple
                                    onChange={(e) =>
                                      handleResourceFileChange(activeModuleIndex, lesIdx, resIdx, Array.from(e.target.files))
                                    }
                                    className="hidden"
                                  />
                                  <label
                                    htmlFor={`${resource.resourceType.toLowerCase()}-upload-${activeModuleIndex}-${lesIdx}-${resIdx}`}
                                    className="cursor-pointer text-xs text-gray-600 hover:text-blue-600 font-medium"
                                  >
                                    {resource.files && resource.files.length > 0 ? (
                                      <div>
                                        <span className="text-green-600"> Đã tải {resource.files.length} tệp:</span>
                                        <ul className="text-left text-xs mt-1">
                                          {resource.files.map((f, idx) => (
                                            <li key={idx}>{f.name}</li>
                                          ))}
                                        </ul>
                                      </div>
                                    ) : (
                                      <span>Click để tải tệp {resource.resourceType}</span>
                                    )}
                                  </label>
                                </div>                                 
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8 text-gray-500">
                        <svg className="w-12 h-12 mx-auto mb-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.55 4.55a2 2 0 010 2.83l-1.41 1.41a2 2 0 01-2.83 0L10 15m0 0l-4.55 4.55a2 2 0 01-2.83 0l-1.41-1.41a2 2 0 010-2.83L5 10m0 0l4.55-4.55a2 2 0 012.83 0l1.41 1.41a2 2 0 010 2.83L15 10z" />
                        </svg>
                        <p>Vui lòng chọn một chương ở cột bên trái để hiển thị và chỉnh sửa chi tiết bài học.</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    default:
      return <div className="text-gray-400 text-center py-4">Chưa có nội dung cho bước này</div>;
    }
  };
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">

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

      {user.role !== "student" && (
  <div className="container mx-auto px-6 py-6 flex justify-end">
    <button
      onClick={() => setShowForm(true)}
      className="group relative bg-gradient-to-r from-[#910c4e] to-[#b91c5a] text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 ease-in-out overflow-hidden"
    >

      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000 ease-out"></div>
      
      <div className="relative flex items-center gap-2">
        <svg 
          className="w-5 h-5 transition-transform duration-300 group-hover:rotate-180" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
        <span className="tracking-wide">Tạo khóa học mới</span>
      </div>
      

      <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-[#910c4e] to-[#b91c5a] opacity-0 group-hover:opacity-50 blur-lg transition-opacity duration-300"></div>
    </button>
  </div>
)}

    {showForm && (
  <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
    <form
      onSubmit={handleCreateCourse}
      className="bg-white p-6 rounded-3xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-auto border border-gray-100"
    >
      <div className="sticky top-0 bg-white z-10 pb-4 mb-6 border-b-2 border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-r from-[#910c4e] to-[#b91c5a] rounded-xl flex items-center justify-center">
              <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <h2 className="text-3xl font-bold text-[#910c4e]">Tạo khóa học mới</h2>
          </div>
          <button
            type="button"
            onClick={() => {
              setShowForm(false);
              setCurrentStep(1);
              setNewCourse({
                title: "",
                teachingLanguage: "VN",
                price: 0,
                categoryId: 1,
                description: "",
                startDate: "",
                endDate: "",
                duration: 1,
                courseModules: [],
              });
              setSelectedFile(null);
            }}
            className="w-12 h-12 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors duration-200"
          >
            <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex items-center justify-center space-x-8">
          {[1, 2].map((step) => (
            <div key={step} className="flex items-center">
              <div className={`flex items-center justify-center w-12 h-12 rounded-full border-2 transition-all duration-300 ${
                currentStep >= step
                  ? 'bg-[#910c4e] border-[#910c4e] text-white shadow-lg'
                  : 'bg-white border-gray-300 text-gray-400'
              }`}>
                <span className="font-bold text-lg">{step}</span>
              </div>
              <div className="ml-4">
                <p className={`font-semibold text-lg ${
                  currentStep >= step ? 'text-[#910c4e]' : 'text-gray-400'
                }`}>
                  {step === 1 ? 'Thông tin cơ bản' : 'Tạo chương'}
                </p>
              </div>
              {step < 2 && (
                <div className={`w-16 h-1 mx-6 rounded-full transition-colors duration-300 ${
                  currentStep > step ? 'bg-[#910c4e]' : 'bg-gray-300'
                }`} />
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="mb-6">
        {renderStepContent() || <div className="text-gray-400 text-center py-4">Chưa có nội dung cho bước này</div>}
      </div>

      <div className="sticky bottom-0 bg-gradient-to-t from-white via-white to-transparent pt-6 pb-2">
        <div className="flex justify-between items-center">
          <button
            type="button"
            onClick={handlePrevStep}
            disabled={currentStep === 1}
            className={`px-8 py-4 rounded-xl font-semibold transition-all duration-200 shadow-md hover:shadow-lg flex items-center gap-2 text-lg ${
              currentStep === 1
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-white border-2 border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400'
            }`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Quay lại
          </button>

          <div className="flex gap-4">
            {/* Cancel */}
            <button
              type="button"
              onClick={() => {
                setShowForm(false);
                setCurrentStep(1);
                setNewCourse({
                  title: "",
                  teachingLanguage: "VN",
                  price: 0,
                  categoryId: 1,
                  description: "",
                  startDate: "",
                  endDate: "",
                  duration: 1,
                  courseModules: [],
                });
                setSelectedFile(null);
              }}
              className="px-8 py-4 rounded-xl border-2 border-gray-300 bg-white text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 font-semibold shadow-md hover:shadow-lg text-lg"
            >
              Hủy
            </button>

            {/* Next / Submit */}
            {currentStep < 2 ? (
              <button
                type="button"
                onClick={handleNextStep}
                className="px-8 py-4 rounded-xl bg-gradient-to-r from-[#910c4e] to-[#b91c5a] text-white hover:from-[#6d083b] hover:to-[#8a1544] transition-all duration-200 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 text-lg"
              >
                Tiếp theo
              </button>
            ) : (
              <button
                type="submit"
                disabled={isCreating}
                className={`px-8 py-4 rounded-xl text-white font-semibold text-lg transition-all duration-200 shadow-lg ${
                  isCreating
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 hover:shadow-xl transform hover:scale-105"
                }`}
              >
                <div className="flex items-center gap-2">
                  {isCreating ? (
                    <svg
                      className="animate-spin h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                  {isCreating ? "Khóa học đã được gửi chờ Admin phê duyệt" : "Hoàn thành khóa học!"}
                </div>
              </button>
            )}
          </div>
        </div>
      </div>
    </form>
  </div>
)}

{/* Success popup */}
{showSuccess && (
  <div
    className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 
               bg-green-600 text-white px-10 py-6 rounded-xl shadow-2xl 
               text-2xl font-bold animate-fade-in-out z-[9999] scale-105"
  >
    🎉 Tạo khóa học thành công!
  </div>
)}

      {/* Content */}
      <div className="container w-full mx-auto px-6 py-12 grid grid-cols-1 lg:grid-cols-[18rem_1fr] gap-6 flex-1">
        {/* Sidebar */}
        <aside className="bg-gradient-to-br from-white to-gray-50 rounded-3xl shadow-xl border border-gray-100 p-8 h-fit sticky top-24 backdrop-blur-sm">
          {/* Header */}
          <div className="flex items-center gap-3 mb-8 pb-6 border-b-2 border-gradient-to-r from-[#910c4e]/20 to-transparent">
            <div className="w-10 h-10 bg-gradient-to-r from-[#910c4e] to-[#b91c5a] rounded-2xl flex items-center justify-center shadow-lg">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-[#910c4e] to-[#b91c5a] bg-clip-text text-transparent">
              Bộ Lọc 
            </h2>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
              <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              Tìm kiếm
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="Nhập tên khóa học..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full px-4 py-3 pl-11 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#910c4e] focus:border-[#910c4e] transition-all duration-200 bg-white shadow-sm hover:shadow-md"
              />
              <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
              <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
              </svg>
              Ngôn ngữ giảng dạy
            </label>
            <div className="relative">
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="w-full px-4 py-3 pr-10 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#910c4e] focus:border-[#910c4e] transition-all duration-200 bg-white shadow-sm hover:shadow-md appearance-none cursor-pointer"
              >
                <option value="all">🌍 Tất cả ngôn ngữ</option>
                <option value="VN">🇻🇳 Tiếng Việt</option>
                <option value="JP">🇯🇵 Tiếng Nhật</option>
                <option value="EN">🇺🇸 Tiếng Anh</option>
              </select>
              <svg className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
              <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
              Mức giá
            </label>
            <div className="relative">
              <select
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full px-4 py-3 pr-10 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#910c4e] focus:border-[#910c4e] transition-all duration-200 bg-white shadow-sm hover:shadow-md appearance-none cursor-pointer"
              >
                <option value="all">💰 Tất cả mức giá</option>
                <option value="0-100"> Dưới 100.000 VND</option>
                <option value="100-200"> 100.000 - 200.000 VND</option>
                <option value="200+"> Trên 200.000 VND</option>
              </select>
              <svg className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
              <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
              </svg>
              Loại khóa học
            </label>
            <button
              onClick={() => setFreeOnly(!freeOnly)}
              className={`w-full py-3 px-4 rounded-xl font-semibold transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-[1.02] flex items-center justify-center gap-2 ${
                freeOnly
                  ? "bg-gradient-to-r from-green-500 to-green-600 text-white hover:from-green-600 hover:to-green-700"
                  : "bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 hover:from-gray-200 hover:to-gray-300 border-2 border-gray-300"
              }`}
            >
              <svg className={`w-5 h-5 transition-colors duration-200 ${
                freeOnly ? 'text-white' : 'text-gray-500'
              }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
              </svg>
              {freeOnly ? "✓ Chỉ khóa học miễn phí" : " Khóa học miễn phí"}
            </button>
          </div>

          <div className="pt-4 border-t border-gray-200">
            <button
              onClick={() => {
                setSearch("");
                setLanguage("all");
                setPrice("all");
                setFreeOnly(false);
              }}
              className="w-full bg-gradient-to-r from-[#910c4e] to-[#b91c5a] text-white py-3 px-4 rounded-xl font-semibold hover:from-[#6d083b] hover:to-[#8a1544] transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-[1.02] flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Xóa Tất Cả Bộ Lọc
            </button>
          </div>
        </aside>

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
            onClick={() => navigate(`/courses/${course.id}`)}
            className="cursor-pointer bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl hover:scale-[1.02] transition-transform min-h-[350px] flex flex-col"
          >
            <img
              src={course.imagePresignedUrl || "img/default-course.jpg"}
              alt={course.title}
              className="w-full h-44 object-cover"
            />

            <h3 className="font-bold text-lg mb-2 text-[#910c4e] truncate w-full overflow-hidden whitespace-nowrap px-3 mt-3">
              {course.title}
            </h3>
            <p className="text-sm text-gray-600 mb-1 px-3">
              Ngôn ngữ giảng dạy: {course.teachingLanguage || course.teaching_language}
            </p>

            <p className="text-lg font-semibold text-[#910c4e] mb-2 px-3">
              {course.price === 0
                ? "Miễn phí"
                : `${course.price.toLocaleString("vi-VN")} Đ`}
            </p>
            <p className="text-gray-700 text-sm flex-1 px-3 mb-3 line-clamp-2">
              {course.description}
            </p>
            <div className="flex gap-3 px-3 pb-3 mt-auto">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleBuyNow(course);
                }}
                className="flex-1 bg-[#910c4e] text-white py-2 rounded-lg font-semibold hover:bg-[#6d083b] transition"
              >
                Mua ngay
              </button>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleAddToCart(course);
                }}
                className="flex-1 bg-gray-200 text-gray-800 py-2 rounded-lg font-semibold hover:bg-gray-300 transition"
              >
                🛒 Thêm vào giỏ
              </button>
            </div>
          </div>
        ))}
        {showSuccess && (
          <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 
                          bg-green-600 text-white px-10 py-6 rounded-xl shadow-2xl 
                          text-2xl font-bold animate-fade-in-out z-[9999] scale-105">
            🎉 Đã thêm khóa học vào giỏ hàng!
          </div>
        )}

        {showWarning && (
          <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 
                          bg-yellow-500 text-white px-10 py-6 rounded-xl shadow-2xl 
                          text-2xl font-bold animate-fade-in-out z-[9999] scale-105">
            ⚠️ Khóa học đã có trong giỏ hàng!
          </div>
        )}
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
        <div className="col-span-3 flex justify-center items-center text-gray-600 text-lg min-h-[350px] border rounded-2xl bg-white shadow">
          Không tìm thấy khóa học nào.
        </div>
        <div className="invisible"></div>
        <div className="invisible"></div>
      </>
    )}
  </div>
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
      <div className="w-full border-t-4 border-[#910c4e]/60 mb-4"></div>
      <Footer />
    </div>
  );
};

export default Courses;