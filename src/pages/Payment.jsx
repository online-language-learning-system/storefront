import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Footer from "@/components/Footer";
import { useCart } from "@/context/CartContext";
import { getCourseDetail } from "@/api/courseApi";

export default function Payment() {
  const { cart, removeFromCart, updateQuantity } = useCart();
  const [method, setMethod] = useState("vnpay");
  const navigate = useNavigate();

  const [creators, setCreators] = useState({});

  useEffect(() => {
    let isCancelled = false;
    async function enrichCreators() {
      const missing = cart.filter(
        (item) => !(item.createdBy || item.created_by || item.created_By || item.instructor || item.instructorName)
      );
      if (missing.length === 0) return;
      try {
        const results = await Promise.all(
          missing.map(async (item) => {
            try {
              const detail = await getCourseDetail(item.id);
              return [item.id, detail.createdBy];
            } catch (e) {
              return [item.id, undefined];
            }
          })
        );
        if (isCancelled) return;
        const map = {};
        results.forEach(([id, name]) => {
          if (name) map[id] = name;
        });
        setCreators((prev) => ({ ...prev, ...map }));
      } catch {}
    }
    enrichCreators();
    return () => {
      isCancelled = true;
    };
  }, [cart]);

  const total = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const handlePayment = () => {
    if (cart.length === 0) {
      alert("Giỏ hàng đang trống!");
      return;
    }

    window.location.href = "http://localhost:5000/api/payment/vnpay";
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#fcc7e7]">
      <div className="flex-1 pt-24 pb-8 px-4">
        {/* Overlay để tạo contrast cho navbar */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-transparent pointer-events-none"></div>
        <div className="relative z-10">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-[#910c4e] to-[#b91c5a] bg-clip-text text-transparent mb-2">
              Thanh toán
            </h1>
            <p className="text-gray-700 text-lg">Hoàn tất đơn hàng của bạn</p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Giỏ hàng - Cột trái */}
            <div className="lg:col-span-2">
              <div className="bg-white border-2 border-gray-200 rounded-3xl p-6 mb-6 shadow-sm">
                <div className="flex items-center mb-6">
                  <div className="w-10 h-10 bg-gradient-to-r from-[#910c4e] to-[#b91c5a] rounded-3xl flex items-center justify-center mr-3 shadow-lg">
                    <span className="text-white text-lg">🛒</span>
                  </div>
                  <h2 className="text-xl font-semibold text-gray-900">
                    Giỏ hàng của bạn
                  </h2>
                  {cart.length > 0 && (
                    <span className="ml-auto bg-gradient-to-r from-[#910c4e] to-[#b91c5a] text-white text-sm px-3 py-1 rounded-full">
                      {cart.length} khóa học
                    </span>
                  )}
                </div>

                {cart.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="w-20 h-20 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <span className="text-4xl">🛒</span>
                    </div>
                    <p className="text-gray-500 text-lg mb-4">
                      Chưa có khóa học nào trong giỏ hàng
                    </p>
                    <button
                      onClick={() => navigate("/courses")}
                      className="bg-gradient-to-r from-[#910c4e] to-[#b91c5a] text-white px-6 py-3 rounded-2xl hover:from-[#6d083b] hover:to-[#8a1544] transition-all duration-200 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105"
                    >
                      Khám phá khóa học
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {cart.map((item, index) => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between p-4 border-2 border-gray-200 rounded-3xl hover:border-[#910c4e] hover:shadow-md transition-all duration-200"
                      >
                        <div className="flex items-center flex-1">
                          <div className="w-12 h-12 bg-gradient-to-r from-[#910c4e] to-[#b91c5a] rounded-2xl flex items-center justify-center text-white font-bold mr-4 shadow-lg">
                            {index + 1}
                          </div>
                          <img
                            src={item.imageUrl|| "img/default-course.jpg"}
                            alt={item.title}
                            className="w-16 h-16 object-cover rounded-xl mr-4 border"
                          />
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-900 mb-1">
                              {item.title}
                            </h3>
                            <p className="text-xs text-gray-500 mb-1">
                              Giảng Viên: {item.createdBy || item.created_by || item.created_By || item.instructor || item.instructorName || creators[item.id] || "Không rõ"}
                            </p>
                            <p className="text-sm text-gray-500">
                              <p className="text-sm text-gray-500">Giá: {item.price.toLocaleString()} đ × {item.quantity || 1}</p>
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-4">
                          {/* Quantity Controls */}
                          <div className="flex items-center border-2 border-gray-200 rounded-2xl">
                            <button
                              onClick={() =>
                                updateQuantity(item.id, item.quantity - 1)
                              }
                              className="px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-l-2xl transition-all duration-200"
                            >
                              −
                            </button>
                            <span className="px-4 py-2 border-x-2 border-gray-200 bg-gray-50 font-medium">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() =>
                                updateQuantity(item.id, item.quantity + 1)
                              }
                              className="px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-r-2xl transition-all duration-200"
                            >
                              +
                            </button>
                          </div>

                          {/* Price */}
                          <div className="text-right min-w-[100px]">
                            <p className="font-bold text-gray-900">
                              {(item.price * item.quantity).toLocaleString()} đ
                            </p>
                          </div>

                          {/* Remove Button */}
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="p-2 text-red-500 hover:bg-red-50 rounded-2xl transition-all duration-200 border-2 border-transparent hover:border-red-200"
                            title="Xóa khỏi giỏ hàng"
                          >
                            🗑️
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Thanh toán - Cột phải */}
            <div className="lg:col-span-1">
              <div className="bg-white border-2 border-gray-200 rounded-3xl p-6 shadow-sm sticky top-4">
                <div className="flex items-center mb-6">
                  <div className="w-10 h-10 bg-gradient-to-r from-[#910c4e] to-[#b91c5a] rounded-3xl flex items-center justify-center mr-3 shadow-lg">
                    <span className="text-white text-lg">💰</span>
                  </div>
                  <h2 className="text-xl font-semibold text-gray-900">
                    Tóm tắt đơn hàng
                  </h2>
                </div>

                {/* Order Summary */}
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-gray-600">
                    <span>Tạm tính:</span>
                    <span>{total.toLocaleString()} đ</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Phí xử lý:</span>
                    <span className="text-green-600 font-medium">Miễn phí</span>
                  </div>
                  <div className="border-t-2 border-gray-200 pt-3">
                    <div className="flex justify-between text-lg font-bold text-gray-900">
                      <span>Tổng cộng:</span>
                      <span className="bg-gradient-to-r from-[#910c4e] to-[#b91c5a] bg-clip-text text-transparent">
                        {total.toLocaleString()} đ
                      </span>
                    </div>
                  </div>
                </div>

                {/* Payment Methods */}
                <div className="mb-6">
                  <h3 className="font-semibold text-gray-900 mb-4">
                    Phương thức thanh toán
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center p-4 border-2 rounded-3xl border-[#910c4e] bg-gradient-to-r from-[#910c4e]/5 to-[#b91c5a]/5 shadow-md">
                      <div className="flex items-center flex-1">
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center mr-3 shadow-lg overflow-hidden">
                          <img 
                            src="https://cdn.haitrieu.com/wp-content/uploads/2022/10/Logo-VNPAY-QR.png" 
                            alt="VNPay" 
                            className="w-full h-full object-contain"
                          />
                        </div>
                        <span className="font-medium">VNPay</span>
                      </div>
                      <div className="w-5 h-5 bg-gradient-to-r from-[#910c4e] to-[#b91c5a] rounded-full flex items-center justify-center shadow-lg">
                        <span className="text-white text-xs">✓</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-3">
                  <button
                    onClick={handlePayment}
                    disabled={cart.length === 0}
                    className={`w-full py-4 rounded-2xl font-semibold text-lg transition-all duration-200 ${
                      cart.length === 0
                        ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                        : "bg-gradient-to-r from-[#910c4e] to-[#b91c5a] text-white hover:from-[#6d083b] hover:to-[#8a1544] shadow-lg hover:shadow-xl transform hover:scale-105"
                    }`}
                  >
                    {cart.length === 0 ? "Giỏ hàng trống" : "Thanh toán ngay"}
                  </button>

                  <button
                    onClick={() => navigate("/courses")}
                    className="w-full py-3 border-2 border-gray-200 text-gray-700 rounded-3xl font-medium hover:border-[#910c4e] hover:bg-gradient-to-r hover:from-[#910c4e]/5 hover:to-[#b91c5a]/5 hover:shadow-sm transition-all duration-200"
                  >
                    ← Tiếp tục mua sắm
                  </button>
                </div>

                {/* Security Badge */}
                <div className="mt-6 p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-3xl border-2 border-gray-200">
                  <div className="flex items-center justify-center text-sm text-gray-600">
                    <span className="mr-2">🔒</span>
                    <span className="font-medium">Thanh toán an toàn & bảo mật</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}