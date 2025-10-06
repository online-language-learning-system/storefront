import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getCourseModules, getModuleLessons } from "@/api/courseApi";
import {
  PlayIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  BookOpenIcon,
} from "@heroicons/react/24/outline";
import { PlayIcon as PlayIconSolid } from "@heroicons/react/24/solid";
import Footer from "@/components/Footer";

// Resource Viewer
function ResourceViewer({ resource }) {
  const [textContent, setTextContent] = useState("");

  useEffect(() => {
    const loadText = async () => {
      if (!resource?.resourceUrl) return;
      const pathname = resource.resourceUrl.split("?")[0];
      const ext = pathname.split(".").pop().toLowerCase();
      if (ext === "txt") {
        try {
          const res = await fetch(resource.resourceUrl);
          if (!res.ok) throw new Error("File not found");
          const txt = await res.text();
          setTextContent(txt);
        } catch {
          setTextContent("Error loading text file.");
        }
      }
    };
    loadText();
  }, [resource]);

  if (!resource?.resourceUrl) return <p>File not found.</p>;

  const pathname = resource.resourceUrl.split("?")[0]; // bỏ query string
  const extension = pathname.split(".").pop().toLowerCase();

  // Office documents
  if (["doc", "docx", "ppt", "pptx", "xls", "xlsx"].includes(extension)) {
    const officeUrl = `https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(
      resource.resourceUrl
    )}`;
    return (
      <div className="mt-4 border border-gray-200 rounded-lg shadow-sm flex flex-col">
        <iframe
          src={officeUrl}
          width="100%"
          height="800px"
          frameBorder="0"
          className="rounded-b"
        />
      </div>
    );
  }

  // PDF files
  if (extension === "pdf") {
    return (
      <div className="mt-4 border border-gray-200 rounded-lg shadow-sm flex flex-col">
        <iframe
          src={resource.resourceUrl}
          width="100%"
          height="800px"
          frameBorder="0"
          className="rounded-b"
        />
      </div>
    );
  }

  // TXT files
  if (extension === "txt") {
    return (
      <div className="mt-4 border border-gray-200 rounded-lg shadow-sm flex flex-col min-h-[600px] p-4 overflow-auto bg-gray-50">
        <pre className="whitespace-pre-wrap">{textContent}</pre>
      </div>
    );
  }

  return (
    <div className="mt-4 border border-gray-200 rounded-lg shadow-sm flex flex-col min-h-[600px] p-4">
      <p>Cannot preview this file type: .{extension}</p>
      {["docx", "pdf"].includes(extension) && (
        <p className="mt-2 text-sm text-red-500">
          Cannot preview this file type: .{extension}?x-amz-algorithm=...
        </p>
      )}
    </div>
  );
}

// TryCourse Component
export default function TryCourse() {
  const { id: courseId } = useParams();
  const [courseTitle, setCourseTitle] = useState("Loading...");
  const [modules, setModules] = useState([]);
  const [lessons, setLessons] = useState({});
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [expandedModule, setExpandedModule] = useState(null);

  useEffect(() => {
    if (!courseId) return;

    fetch(`/api/courses/${courseId}`)
      .then((res) => res.json())
      .then((data) => setCourseTitle(data.title || "Untitled Course"))
      .catch(() => setCourseTitle("Google Project Management Certificate"));

    getCourseModules(courseId)
      .then((data) => setModules(data))
      .catch(() =>
        setModules([
          {
            id: 1,
            title: "Ngữ pháp và hội thoại",
            canFreeTrial: true,
            duration: "45 min",
            lessonsCount: 8,
          },
          {
            id: 2,
            title: "Ngữ pháp JLPT N4",
            canFreeTrial: true,
            duration: "2 hours",
            lessonsCount: 12,
          },
          {
            id: 3,
            title: "Hội thoại nâng cao",
            canFreeTrial: false,
            duration: "3 hours",
            lessonsCount: 15,
          },
        ])
      );
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
        setLessons((prev) => ({
          ...prev,
          [module.id]: [
            {
              id: 1,
              title: "Các cấu trúc ngữ pháp cần thiết cho trình độ N4.",
              description:
                "Ôn tập các điểm ngữ pháp quan trọng để chuẩn bị cho kỳ thi JLPT N4. Nắm vững cách dùng và luyện tập qua các ví dụ thực tế.",
              type: "document",
              resources: [
                {
                  id: 1,
                  resourceType: "Word",
                  resourceUrl:
                    "/files/grammar_n4.docx?x-amz-algorithm=...&signature=...",
                },
                {
                  id: 2,
                  resourceType: "PDF",
                  resourceUrl:
                    "/files/grammar_n4.pdf?x-amz-algorithm=...&signature=...",
                },
                {
                  id: 3,
                  resourceType: "Text",
                  resourceUrl: "/files/grammar_notes.txt",
                },
              ],
            },
          ],
        }));
      }
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 h-16 flex items-center px-6 shadow-sm flex-shrink-0">
        <h1 className="text-lg font-semibold text-gray-900">{courseTitle}</h1>
      </nav>

      {/* Main layout */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <div className="w-80 border-r border-gray-200 overflow-y-auto p-4 bg-gray-50 flex-shrink-0">
          {modules.map((module) => (
            <div key={module.id} className="border border-gray-200 rounded-lg overflow-hidden mb-2">
              <div
                className={`p-3 cursor-pointer hover:bg-gray-100 transition-colors ${
                  !module.canFreeTrial ? "opacity-60" : ""
                }`}
                onClick={() => handleToggleModule(module)}
              >
                <div className="flex justify-between items-center">
                  <h3 className="text-sm font-medium text-gray-900">{module.title}</h3>
                  {module.canFreeTrial &&
                    (expandedModule === module.id ? (
                      <ChevronDownIcon className="h-4 w-4 text-gray-400" />
                    ) : (
                      <ChevronRightIcon className="h-4 w-4 text-gray-400" />
                    ))}
                </div>
              </div>

              {module.canFreeTrial &&
                expandedModule === module.id &&
                lessons[module.id]?.map((lesson) => (
                  <div
                    key={lesson.id}
                    className={`p-2 cursor-pointer hover:bg-blue-50 border-l-4 ${
                      selectedLesson?.id === lesson.id
                        ? "border-blue-500 bg-blue-50"
                        : "border-transparent"
                    }`}
                    onClick={() => setSelectedLesson(lesson)}
                  >
                    {lesson.title}
                  </div>
                ))}
            </div>
          ))}
        </div>

        {/* Content + Footer Container */}
        <div className="flex-1 flex flex-col overflow-y-auto">
          {/* Content chính */}
          <div className="flex-grow flex flex-col p-8 space-y-6">
            {!selectedLesson ? (
              <div className="flex-1 flex flex-col items-center justify-center text-gray-500 h-full min-h-[500px]">
                <PlayIconSolid className="h-20 w-20 opacity-50" />
                <p className="mt-4 text-lg">Select a lesson to start learning</p>
              </div>
            ) : (
              <div className="flex flex-col space-y-6">
                <div className="relative bg-black w-full h-96 rounded-lg flex items-center justify-center">
                  {selectedLesson.type === "video" ? (
                    <button className="group flex items-center justify-center w-28 h-28 bg-blue-600 hover:bg-blue-700 rounded-full transition-colors">
                      <PlayIconSolid className="h-12 w-12 text-white" />
                    </button>
                  ) : (
                    <BookOpenIcon className="h-20 w-20 text-white opacity-60" />
                  )}
                </div>

                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <h2 className="text-2xl font-bold mb-2">{selectedLesson.title}</h2>
                  <p className="text-gray-700">{selectedLesson.description}</p>
                </div>

                {selectedLesson.resources?.length > 0 && (
                  <div className="flex flex-col gap-6">
                    {selectedLesson.resources.map((r) => (
                      <div key={r.id}>
                        <ResourceViewer resource={r} />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
               <Footer />
        </div>
      </div>
    </div>
  );
}
