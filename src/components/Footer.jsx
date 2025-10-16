import React from "react";

export default function Footer() {
  return (
    <footer className="w-full h-full bg-gradient-to-br from-pink-700 via-pink-800 to-pink-900 text-white relative flex-1">
      <div className="container mx-auto px-6 py-12 flex flex-col justify-center h-full">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          
          {/* Company Info */}
          <div className="lg:col-span-2">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-gradient-to-r from-pink-600 to-pink-700 rounded-lg flex items-center justify-center mr-3">
                <span className="text-white font-bold text-xl">J</span>
              </div>
              <h2 className="text-2xl font-bold text-white">J-Hajime</h2>
            </div>
            <p className="text-pink-200 mb-6 leading-relaxed max-w-md">
              Trung tâm học tiếng Nhật hàng đầu Việt Nam. Chúng tôi cung cấp các khóa học từ N5 đến N1 
              với phương pháp giảng dạy hiện đại, giáo viên tận tâm và môi trường học tập chuyên nghiệp.
            </p>
            
            {/* Contact Info */}
            <div className="space-y-3">
              <div className="flex items-center text-pink-200">
                <i className="fas fa-map-marker-alt w-5 text-pink-400 mr-3" aria-hidden="true"></i>
                <span>75/63 Hẻm 75, Hiệp Bình Chánh, Thủ Đức, HCM.</span>
              </div>
              <div className="flex items-center text-pink-200">
                <i className="fas fa-phone w-5 text-pink-400 mr-3" aria-hidden="true"></i>
                <span>+84384571828</span>
              </div>
              <div className="flex items-center text-pink-200">
                <i className="fas fa-envelope w-5 text-pink-400 mr-3" aria-hidden="true"></i>
                <span>jhajime@j-hajime.edu.vn</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-6 text-white relative">
              Liên kết nhanh
              <div className="absolute -bottom-2 left-0 w-8 h-0.5 bg-gradient-to-r from-pink-500 to-pink-600"></div>
            </h3>
            <ul className="space-y-3">
              {["Trang chủ","Khóa học","Giáo viên","Về chúng tôi","Liên hệ"].map((item, idx) => (
                <li key={idx}>
                  <a href="#" className="text-pink-200 hover:text-pink-400 transition-colors duration-300 flex items-center group">
                    <i className="fas fa-chevron-right text-xs mr-2 text-pink-400 opacity-0 group-hover:opacity-100 transition-opacity" aria-hidden="true"></i>
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-lg font-semibold mb-6 text-white relative">
              Dịch vụ
              <div className="absolute -bottom-2 left-0 w-8 h-0.5 bg-gradient-to-r from-pink-500 to-pink-600"></div>
            </h3>
            <ul className="space-y-3">
              {["Khóa học JLPT N5-N1","Giao tiếp tiếng Nhật","Tiếng Nhật doanh nghiệp","Luyện thi du học Nhật","Tư vấn du học"].map((item, idx) => (
                <li key={idx}>
                  <a href="#" className="text-pink-200 hover:text-pink-400 transition-colors duration-300 flex items-center group">
                    <i className="fas fa-chevron-right text-xs mr-2 text-pink-400 opacity-0 group-hover:opacity-100 transition-opacity"></i>
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Social Media & Newsletter */}
        <div className="border-t border-pink-600 pt-8 mb-8">
          <div className="flex flex-col lg:flex-row justify-between items-center">
            
            {/* Social Media */}
            <div className="mb-6 lg:mb-0">
              <h4 className="text-lg font-semibold mb-4 text-center lg:text-left">Kết nối với chúng tôi</h4>
              <div className="flex justify-center lg:justify-start gap-4">
                {["facebook","youtube","instagram","twitter","whatsapp"].map((s, idx) => (
                  <a key={idx} href="#" className="w-10 h-10 bg-pink-600 rounded-full flex items-center justify-center hover:scale-110 transition-transform duration-300">
                    <i className={`fab fa-${s} text-white`} aria-hidden="true"></i>
                  </a>
                ))}
              </div>
            </div>

            {/* Newsletter */}
            <div className="text-center lg:text-right">
              <h4 className="text-lg font-semibold mb-4">Nhận thông tin khóa học mới</h4>
              <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto lg:mx-0">
                <input 
                  type="email" 
                  placeholder="Nhập email của bạn..."
                  className="flex-1 px-4 py-2 rounded-lg bg-pink-700 border border-pink-600 text-white placeholder-pink-300 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-300"
                />
                <button className="px-6 py-2 bg-gradient-to-r from-pink-600 to-pink-700 text-white rounded-lg hover:from-pink-700 hover:to-pink-800 transition-all duration-300 font-semibold whitespace-nowrap">
                  Đăng ký
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-pink-600 pt-6">
          <div className="flex flex-col lg:flex-row justify-between items-center text-sm text-pink-200">
            <div className="mb-4 lg:mb-0 text-center lg:text-left">
              <p>© {new Date().getFullYear()} <span className="text-pink-400 font-semibold">J-Hajime</span>. Bảo lưu mọi quyền.</p>
              <p className="mt-1">Giấy phép đào tạo số: 123/GP-SGDĐT</p>
            </div>
            <div className="flex flex-wrap justify-center lg:justify-end gap-6 text-center">
              <a href="#" className="hover:text-pink-400 transition-colors duration-300">Chính sách bảo mật</a>
              <a href="#" className="hover:text-pink-400 transition-colors duration-300">Điều khoản sử dụng</a>
              <a href="#" className="hover:text-pink-400 transition-colors duration-300">Quy chế hoạt động</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
