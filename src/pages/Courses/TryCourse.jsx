import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  getCourseDetail,
  getCourseModules,
  getModuleLessons,
} from "@/api/courseApi";
import {
  PlayIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  BookOpenIcon,
} from "@heroicons/react/24/outline";
import { PlayIcon as PlayIconSolid } from "@heroicons/react/24/solid";
import Footer from "@/components/Footer";

function ResourceViewer({ resource }) {
  const [textContent, setTextContent] = useState("");

  useEffect(() => {
    if (!resource?.resourceUrl) return;
    const pathname = resource.resourceUrl.split("?")[0];
    const ext = pathname.split(".").pop().toLowerCase();
    if (ext === "txt") {
      fetch(resource.resourceUrl)
        .then((res) => (res.ok ? res.text() : "Error loading text file."))
        .then(setTextContent)
        .catch(() => setTextContent("Error loading text file."));
    }
  }, [resource]);

  if (!resource?.resourceUrl) return <p>File not found.</p>;

  const pathname = resource.resourceUrl.split("?")[0];
  const extension = pathname.split(".").pop().toLowerCase();

  if (extension === "mp4") {
    return (
      <div className="p-8 w-full">
        <div
          className="w-full rounded-2xl overflow-hidden relative shadow-lg"
          style={{ paddingTop: "56.25%" }}
        >
          <video
            controls
            className="absolute top-0 left-0 w-full h-full"
            src={resource.resourceUrl}
          />
        </div>
      </div>
    );
  }

  if (["doc", "docx", "ppt", "pptx", "xls", "xlsx"].includes(extension)) {
    const officeUrl = `https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(
      resource.resourceUrl
    )}`;
    return (
      <div className="p-8">
        <iframe
          src={officeUrl}
          width="100%"
          height="900px"
          frameBorder="0"
          className="w-full rounded-2xl border shadow-md"
        />
      </div>
    );
  }

  if (extension === "pdf") {
    return (
      <div className="p-8">
        <iframe
          src={resource.resourceUrl}
          width="100%"
          height="900px"
          frameBorder="0"
          className="w-full rounded-2xl border shadow-md"
        />
      </div>
    );
  }

  if (extension === "txt") {
    return (
      <div className="p-8">
        <div className="border border-gray-200 rounded-2xl shadow-sm min-h-[700px] p-8 overflow-auto bg-pink-50">
          <pre className="whitespace-pre-wrap text-gray-800 font-mono text-base leading-relaxed">
            {textContent}
          </pre>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="border border-gray-200 rounded-2xl shadow-sm min-h-[700px] p-8 flex items-center justify-center bg-pink-50">
        <div className="text-center">
          <div className="bg-pink-200 p-4 rounded-full mb-4 inline-block">
            <BookOpenIcon className="h-8 w-8 text-pink-600" />
          </div>
          <p className="text-gray-600 font-medium">
            Không thể xem trước tệp: .{extension}
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Hãy tải xuống để xem nội dung chi tiết
          </p>
        </div>
      </div>
    </div>
  );
}

export default function TryCourse() {
  const { id: courseId } = useParams();
  const [courseTitle, setCourseTitle] = useState("Loading...");
  const [modules, setModules] = useState([]);
  const [lessons, setLessons] = useState({});
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [expandedModule, setExpandedModule] = useState(null);

  useEffect(() => {
    if (!courseId) return;
    getCourseDetail(courseId)
      .then((data) => {
        const title =
          data.title || data.courseTitle || data.name || "Untitled Course";
        setCourseTitle(title);
      })
      .catch(() => setCourseTitle("Untitled Course"));

    getCourseModules(courseId)
      .then((data) => setModules(data))
      .catch(() => setModules([]));
  }, [courseId]);

  const handleToggleModule = async (module) => {
    if (!module.canFreeTrial) return;
    if (expandedModule === module.id) {
      setExpandedModule(null);
      return;
    }
    setExpandedModule(module.id);
    if (!lessons[module.id]) {
      try {
        const data = await getModuleLessons(module.id);
        setLessons((prev) => ({ ...prev, [module.id]: data }));
      } catch {
        setLessons((prev) => ({ ...prev, [module.id]: [] }));
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="sticky top-0 z-60 h-16 flex items-center px-6 shadow-lg backdrop-blur-sm flex-shrink-0 bg-[#910c4e] border-b border-[#6f0838]/40 text-white">
        <div className="flex items-center space-x-3">
        </div>
      </div>
      <div className="w-full bg-[#910c4e] text-white">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-extrabold truncate">
            {courseTitle}
          </h1>
        </div>
      </div>

      <div className="flex min-h-screen w-full relative z-0">
        <div className="w-80 border-r border-gray-200 overflow-y-auto bg-white shadow-lg flex-shrink-0">
          <div className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <PlayIcon className="h-5 w-5 mr-2 text-pink-500" />
              Bài học
            </h2>
            <div className="space-y-3">
              {modules.map((module) => (
                <div
                  key={module.id}
                  className="bg-gray-50 rounded-xl overflow-hidden border border-gray-200 hover:shadow-md transition-all duration-200"
                >
                  <div
                    className={`p-4 cursor-pointer hover:bg-gray-100 transition-colors ${
                      !module.canFreeTrial
                        ? "opacity-60 cursor-not-allowed"
                        : ""
                    }`}
                    onClick={() => handleToggleModule(module)}
                  >
                    <div className="flex justify-between items-center">
                      <div className="flex items-center space-x-2">
                        <div
                          className={`w-2 h-2 rounded-full ${
                            module.canFreeTrial ? "bg-green-500" : "bg-gray-400"
                          }`}
                        />
                        <h3 className="text-sm font-semibold text-gray-900">
                          {module.title}
                        </h3>
                      </div>
                      {module.canFreeTrial &&
                        (expandedModule === module.id ? (
                          <ChevronDownIcon className="h-4 w-4 text-gray-500" />
                        ) : (
                          <ChevronRightIcon className="h-4 w-4 text-gray-500" />
                        ))}
                    </div>
                  </div>

                  {module.canFreeTrial &&
                    expandedModule === module.id &&
                    lessons[module.id]?.map((lesson) => (
                      <div
                        key={lesson.id}
                        className={`px-4 py-3 cursor-pointer transition-all duration-200 border-l-4 ${
                          selectedLesson?.id === lesson.id
                            ? "border-pink-500 bg-pink-50 text-pink-800"
                            : "border-transparent hover:bg-gray-100 hover:border-gray-300"
                        }`}
                        onClick={() => setSelectedLesson(lesson)}
                      >
                        <div className="flex items-center space-x-2">
                          <PlayIcon
                            className={`h-4 w-4 ${
                              selectedLesson?.id === lesson.id
                                ? "text-pink-600"
                                : "text-gray-400"
                            }`}
                          />
                          <span className="text-sm font-medium">{lesson.title}</span>
                        </div>
                      </div>
                    ))}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Content (chiếm phần lớn chiều ngang) */}
        <div className="flex-1 flex flex-col">
          <div className="flex-grow p-8">
            {!selectedLesson ? (
              <div className="h-full flex flex-col items-center justify-center text-gray-500 min-h-[500px] bg-white rounded-2xl shadow-sm border border-gray-200">
                <div className="bg-gradient-to-br from-pink-100 to-purple-100 p-8 rounded-full mb-6">
                  <PlayIconSolid className="h-16 w-16 text-pink-500" />
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-2">
                  Ready to Learn?
                </h3>
                <p className="text-lg text-gray-600">
                  Select a lesson to start learning
                </p>
              </div>
            ) : (
              <div className="space-y-8">
                {/* Lesson Header */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
                  <div className="flex items-start space-x-4">
                    <div className="bg-gradient-to-br from-pink-500 to-purple-600 p-3 rounded-xl">
                      <BookOpenIcon className="h-6 w-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h2 className="text-2xl font-bold text-gray-900 mb-2">
                        {selectedLesson.title}
                      </h2>
                      <p className="text-gray-600 leading-relaxed">
                        {selectedLesson.description}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Resources */}
                <div className="space-y-6">
                  {[...(selectedLesson.resources || [])]
                    .sort((a, b) => {
                      if (a.type === "video" && b.type !== "video") return -1;
                      if (a.type !== "video" && b.type === "video") return 1;
                      return 0;
                    })
                    .map((r) => (
                      <div
                        key={r.id}
                        className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden"
                      >
                        <ResourceViewer resource={r} />
                      </div>
                    ))}
                </div>
              </div>
            )}
          </div>

          {/* Footer with proper spacing */}
          <div className="w-full border-t-4 border-[#910c4e]/60 mb-4"></div>
          <Footer />
        </div>
      </div>
    </div>
  );
}
