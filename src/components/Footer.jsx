import React from "react";

export default function Footer() {
  return (
    <footer className="w-full bg-gradient-to-r from-pink-300 to-pink-500 text-white flex flex-col">
      
      {/* Gạch ngang phân cách */}
      <div className="w-full border-t-2 border-white/40 mb-6"></div>

      <div className="flex-grow flex items-center">
        <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Cột giới thiệu */}
          <div>
            <h2 className="text-xl font-bold mb-4">J-Hajime</h2>
            <p>Website học tiếng Nhật từ N5 đến N1. Khóa học rõ ràng, giáo viên tận tâm.</p>
          </div>

          {/* Cột liên kết */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Liên kết nhanh</h3>
            <ul className="space-y-2">
              <li><a href="#" className="hover:underline">Trang chủ</a></li>
              <li><a href="#" className="hover:underline">Khóa học</a></li>
              <li><a href="#" className="hover:underline">Giáo viên</a></li>
              <li><a href="#" className="hover:underline">Liên hệ</a></li>
            </ul>
          </div>

          {/* Cột mạng xã hội */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Kết nối</h3>
            <div className="flex gap-4">
              <a href="#" className="hover:text-gray-200"><i className="fab fa-facebook text-2xl"></i></a>
              <a href="#" className="hover:text-gray-200"><i className="fab fa-youtube text-2xl"></i></a>
              <a href="#" className="hover:text-gray-200"><i className="fab fa-instagram text-2xl"></i></a>
            </div>
          </div>
        </div>
      </div>

      {/* Bản quyền */}
      <div className="py-4 text-center text-sm text-gray-100">
        © {new Date().getFullYear()} J-Hajime. All rights reserved.
      </div>
    </footer>
  );
}
