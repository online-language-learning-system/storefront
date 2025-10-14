import React, { useMemo, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./my-course.css";
import Footer from "@/components/Footer";

const FALLBACK = [
  { id: 1,  title: "Khóa học tiếng Nhật N5 - Cơ bản",                     desc: "20 bài • 5 giờ",  progress: 45, status: "learning",  image: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=400&q=50" },
  { id: 2,  title: "Luyện thi JLPT N4 - Ngữ pháp nâng cao",                desc: "18 bài • 4 giờ",  progress: 100, status: "completed", image: "https://images.unsplash.com/photo-1513258496099-48168024aec0?auto=format&fit=crop&w=400&q=50" },
  { id: 3,  title: "Từ vựng tiếng Nhật N3 theo chủ đề",                    desc: "24 bài • 6 giờ",  progress: 0,  status: "purchased", image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=400&q=50" },
  { id: 4,  title: "Nghe hiểu tiếng Nhật N5 cơ bản",                        desc: "16 bài • 3 giờ",  progress: 20, status: "learning",  image: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=400&q=50" },
  { id: 5,  title: "Kanji N4 - Nhận diện và luyện viết",                   desc: "26 bài • 7 giờ",  progress: 60, status: "learning",  image: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=400&q=50" },
  { id: 6,  title: "Ngữ pháp N3 nâng cao",                                  desc: "22 bài • 5 giờ",  progress: 80, status: "completed", image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=400&q=50" },
  { id: 7,  title: "Từ vựng theo chủ đề Du lịch N5",                        desc: "14 bài • 2.5 giờ",progress: 10, status: "learning",  image: "https://images.unsplash.com/photo-1529070538774-1843cb3265df?auto=format&fit=crop&w=400&q=50" },
  { id: 8,  title: "Nghe hiểu N4 - Hội thoại cơ bản",                       desc: "20 bài • 4.5 giờ",progress: 50, status: "learning",  image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=400&q=50" },
  { id: 9,  title: "Luyện thi JLPT N3 - Từ vựng chuyên sâu",                desc: "28 bài • 7 giờ",  progress: 0,  status: "purchased", image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=400&q=50" },
  { id: 10, title: "Kanji N5 - Cơ bản cho người mới bắt đầu",               desc: "18 bài • 3.5 giờ",progress: 100, status: "completed", image: "https://images.unsplash.com/photo-1513258496099-48168024aec0?auto=format&fit=crop&w=400&q=50" },
  { id: 11, title: "Ngữ pháp N5 - Câu cơ bản",                              desc: "15 bài • 3 giờ",  progress: 70, status: "learning",  image: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=400&q=50" },
  { id: 12, title: "Hội thoại N3 - Tiếng Nhật giao tiếp",                   desc: "21 bài • 5 giờ",  progress: 30, status: "learning",  image: "https://images.unsplash.com/photo-1529070538774-1843cb3265df?auto=format&fit=crop&w=400&q=50" },
  { id: 13, title: "Từ vựng N4 theo chủ đề Công việc",                      desc: "19 bài • 4 giờ",  progress: 0,  status: "purchased", image: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=400&q=50" },
];


const PER_PAGE = 8;

function ProgressLine({ percent }) {
  return (
    <>
      <div className="progress" aria-label="Tiến trình học">
        <div className="progress__bar" style={{ width: `${percent}%` }} />
      </div>
      <div className="progress__text">{percent > 0 ? `${percent}%` : "Chưa bắt đầu"}</div>
    </>
  );
}

function CourseCard({ c }) {
  const hasProgress = c.progress > 0;

  // fallback nếu ảnh lỗi
  const handleImgError = (e) => {
    e.currentTarget.src =
      "data:image/svg+xml;utf8," +
      encodeURIComponent(
        `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 240'>
           <defs><linearGradient id='g' x1='0' x2='1'>
             <stop stop-color='#eee'/><stop offset='1' stop-color='#ddd'/>
           </linearGradient></defs>
           <rect width='100%' height='100%' fill='url(#g)'/>
           <text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle'
                 font-family='sans-serif' font-size='18' fill='#888'>
             No image
           </text>
         </svg>`
      );
  };

  return (
    <article className="course">
      {/* Ảnh */}
      <div className="course__thumb">
        <img
          src={c.image}
          alt={c.title}
          loading="lazy"
          sizes="(max-width: 640px) 100vw, 320px"
          onError={handleImgError}
        />
      </div>

      {/* Nội dung */}
      <div className="course__body">
        <div>
          <h3 className="course__title">{c.title}</h3>
          <p className="course__meta">{c.desc}</p>
          <p className="course__status">
            {hasProgress ? "Bạn đang học khóa này." : "Khóa học đã mua, hãy bắt đầu học ngay!"}
          </p>
          <ProgressLine percent={c.progress} />
        </div>

        <div className="course__actions">
          <button
            className="btn btn--primary"
            onClick={() => alert(`${hasProgress ? "Tiếp tục" : "Bắt đầu"}: ${c.title}`)}
          >
            {hasProgress ? "Tiếp tục" : "Bắt đầu"}
          </button>
          <button className="btn btn--outline">Chi tiết</button>
        </div>
      </div>
    </article>
  );
}


export default function MyCourse() {
  const navigate = useNavigate();
  const [filter, setFilter] = useState("learning");
  const [page, setPage] = useState(1);
  const [courses] = useState(FALLBACK);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "null");
    if (!user) navigate("/home", { replace: true });
  }, [navigate]);

  const homeCourses = useMemo(() => courses.filter(c => c.status !== "completed"), [courses]);

  const filtered = useMemo(() => {
    if (filter === "learning") return homeCourses.filter(c => c.progress > 0);
    if (filter === "not_started") return homeCourses.filter(c => c.progress === 0);
    return homeCourses;
  }, [filter, homeCourses]);

  const totalPages = Math.ceil(filtered.length / PER_PAGE) || 1;
  const pageItems = useMemo(() => {
    const start = (page - 1) * PER_PAGE;
    return filtered.slice(start, start + PER_PAGE);
  }, [page, filtered]);

  return (
    <main className="mc-shell">
      {/* <div className="mc-footer"> */}
      <section className="mc-panel">
        <header className="mc-header">
          <h1 className="mc-title">Khóa học của tôi</h1>

          <div className="mc-filters">
            <button
              className={`chip ${filter === "learning" ? "chip--ghost is-active" : "chip--ghost"}`}
              onClick={() => { setFilter("learning"); setPage(1); }}
            >
              Đang học
            </button>
            <button
              className={`chip ${filter === "not_started" ? "chip--solid is-active" : "chip--solid"}`}
              onClick={() => { setFilter("not_started"); setPage(1); }}
            >
              Chưa bắt đầu
            </button>
          </div>
        </header>

        <section id="courseList" className="course-list" aria-live="polite">
          {pageItems.length === 0 ? (
            <p className="empty">Không có khóa học phù hợp.</p>
          ) : (
            pageItems.map((c) => <CourseCard key={c.id} c={c} />)
          )}
        </section>

        {totalPages > 1 && (
          <nav id="pagination" className="pagination" aria-label="Phân trang">
            <button className="page-btn" disabled={page === 1} onClick={() => setPage(p => Math.max(1, p - 1))}>‹</button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button key={p} className={`page-btn ${p === page ? "active" : ""}`} onClick={() => setPage(p)}>
                {p}
              </button>
            ))}
            <button className="page-btn" disabled={page === totalPages} onClick={() => setPage(p => Math.min(totalPages, p + 1))}>›</button>
          </nav>
        )}
        
       
      </section>
      <footer className="mc-foorer">
            <Footer /> 
      </footer>
        
      
      {/* </div>   */}
    </main>
  );
 
}
