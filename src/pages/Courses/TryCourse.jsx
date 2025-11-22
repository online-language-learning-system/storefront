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
import Footer from "@/components/Footer";
import "./try-course.css";

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
      <div className="resource-viewer">
        <div className="video-container">
          <video
            controls
            className="video-element"
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
      <div className="iframe-container">
        <iframe
          src={officeUrl}
          width="100%"
          height="900px"
          frameBorder="0"
          className="iframe-element"
        />
      </div>
    );
  }

  if (extension === "pdf") {
    return (
      <div className="iframe-container">
        <iframe
          src={resource.resourceUrl}
          width="100%"
          height="900px"
          frameBorder="0"
          className="iframe-element"
        />
      </div>
    );
  }

  if (extension === "txt") {
    return (
      <div className="text-viewer">
        <div className="text-content">
          <pre className="text-pre">{textContent}</pre>
        </div>
      </div>
    );
  }

  return (
    <div className="file-preview-error">
      <div className="file-preview-container">
        <div className="file-preview-content">
          <div className="file-preview-icon">
            <BookOpenIcon />
          </div>
          <p className="file-preview-title">
            Không thể xem trước tệp: .{extension}
          </p>
          <p className="file-preview-subtitle">
            Hãy tải xuống để xem nội dung chi tiết
          </p>
        </div>
      </div>
    </div>
  );
}

const isVideoResource = (r) => {
  if (!r) return false;
  const t = String(r.type || r.resourceType || "").toLowerCase();
  if (t.includes("video")) return true;
  const url = String(r.resourceUrl || "");
  const ext = url.split("?")[0].split(".").pop().toLowerCase();
  return ["mp4", "webm", "ogg"].includes(ext);
};

const sortResourcesVideoFirst = (resources = []) =>
  [...resources].sort((a, b) => {
    const aVid = isVideoResource(a) ? 1 : 0;
    const bVid = isVideoResource(b) ? 1 : 0;
    return bVid - aVid;
  });

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

  const handleSelectLesson = (lesson) => {
    if (!lesson) return setSelectedLesson(null);
    const sorted = {
      ...lesson,
      resources: sortResourcesVideoFirst(lesson.resources || []),
    };
    setSelectedLesson(sorted);
    if (lesson.moduleId) setExpandedModule(lesson.moduleId);
  };

  return (
    <div className="try-course-container">
      {/* Header removed */}

      <div className="try-course-title-section">
        <div className="try-course-title-container">
          <h1 className="try-course-title">{courseTitle}</h1>
        </div>
      </div>

      <div className="try-course-main">
        <div className="try-course-sidebar">
          <div className="sidebar-content">
            <h2 className="sidebar-title">
              <PlayIcon className="sidebar-title-icon" />
              Bài học
            </h2>
            <div className="modules-list">
              {modules.map((module) => (
                <div key={module.id} className="module-item">
                  <div
                    className={`module-header ${
                      !module.canFreeTrial ? "disabled" : ""
                    }`}
                    onClick={() => handleToggleModule(module)}
                  >
                    <div className="module-header-content">
                      <div className="module-title-section">
                        <div
                          className={`module-status-dot ${
                            module.canFreeTrial ? "available" : "unavailable"
                          }`}
                        />
                        <h3 className="module-title">{module.title}</h3>
                      </div>
                      {module.canFreeTrial &&
                        (expandedModule === module.id ? (
                          <ChevronDownIcon className="module-chevron" />
                        ) : (
                          <ChevronRightIcon className="module-chevron" />
                        ))}
                    </div>
                  </div>

                  {module.canFreeTrial &&
                    expandedModule === module.id &&
                    lessons[module.id]?.map((lesson) => (
                      <div
                        key={lesson.id}
                        className={`lesson-item ${
                          selectedLesson?.id === lesson.id ? "selected" : ""
                        }`}
                        onClick={() => handleSelectLesson(lesson)}
                      >
                        <div className="lesson-content">
                          <PlayIcon
                            className={`lesson-icon ${
                              selectedLesson?.id === lesson.id
                                ? "selected"
                                : "default"
                            }`}
                          />
                          <span className="lesson-title">{lesson.title}</span>
                        </div>
                      </div>
                    ))}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="main-content">
          <div className="content-area">
            {!selectedLesson ? (
              <div className="empty-state">
                <div className="empty-state-icon"></div>
                <h3 className="empty-state-title">
                  Bạn đã sẵn sàng để học?
                </h3>
                <p className="empty-state-description">
                  Chọn một bài học để bắt đầu học
                </p>
              </div>
            ) : (
              <div className="lesson-content-area">
                <div className="lesson-header">
                  <div className="lesson-header-content">
                    <div className="lesson-header-icon">
                      <BookOpenIcon />
                    </div>
                    <div className="lesson-header-text">
                      <h2 className="lesson-header-title">
                        {selectedLesson.title}
                      </h2>
                      <p className="lesson-header-description">
                        {selectedLesson.description}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="resources-list">
                  {[...(selectedLesson.resources || [])].map((r) => (
                    <div key={r.id} className="resource-item">
                      <ResourceViewer resource={r} />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="footer-separator"></div>
          <Footer />
        </div>
      </div>
    </div>
  );
}
