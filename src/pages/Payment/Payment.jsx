import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Footer from "@/components/Footer";
import { useCart } from "@/context/CartContext";
import { getCourseDetail } from "@/api/courseApi";
import { createOrder } from "@/api/orderApi";
import { getPaymentUrl } from "@/api/paymentApi"; // <-- API cũ

export default function Payment() {
  const { cart, removeFromCart } = useCart();
  const [creators, setCreators] = useState({});
  const [selectedItems, setSelectedItems] = useState([]);
  const [method, setMethod] = useState("vnpay"); // Payment method
  const navigate = useNavigate();

  // Fetch creator info
  useEffect(() => {
    let isCancelled = false;
    async function enrichCreators() {
      const missing = (cart || []).filter(
        (item) =>
          !(
            item.createdBy ||
            item.created_by ||
            item.instructor ||
            item.instructorName
          )
      );
      if (!missing.length) return;
      try {
        const results = await Promise.all(
          missing.map(async (item) => {
            try {
              const detail = await getCourseDetail(item.id);
              return [item.id, detail.createdBy];
            } catch {
              return [item.id, undefined];
            }
          })
        );
        if (isCancelled) return;
        const map = {};
        results.forEach(([id, name]) => { if (name) map[id] = name; });
        setCreators((prev) => ({ ...prev, ...map }));
      } catch (err) {
        console.error(err);
      }
    }
    enrichCreators();
    return () => { isCancelled = true; };
  }, [cart]);

  const total = (cart || [])
    .filter((item) => selectedItems.includes(String(item.id)))
    .reduce((sum, item) => sum + Number(item.price || 0), 0);

  const toggleSelect = (id) => {
    const idStr = String(id);
    setSelectedItems((prev) =>
      prev.includes(idStr)
        ? prev.filter((x) => x !== idStr)
        : [...prev, idStr]
    );
  };
const handlePayment = async () => {
  if (!selectedItems || !selectedItems.length) {
    alert("Vui lòng chọn khóa học để thanh toán!");
    return;
  }

  try {
    // Tạo danh sách order items hợp lệ
    const orderItemPostDtos = selectedItems
      .map(id => {
        const course = cart.find(c => String(c.id) === String(id));
        if (!course) return null;
        return {
          courseId: Number(course.id ?? course.courseId),
          courseTitle: course.courseName || "",
          coursePrice: Number(course.price || 0),
          discountAmount: 0,
          quantity: 1 
        };
      })
      .filter(Boolean);

    if (!orderItemPostDtos.length) {
      alert("Không có khóa học hợp lệ để tạo đơn hàng!");
      return;
    }

    const payload = {
      discount: 0,
      totalPrice: orderItemPostDtos.reduce((sum, item) => sum + item.coursePrice, 0),
      orderItemPostDtos,
      paymentMethod: method
    };

    // Tạo order
    const order = await createOrder(payload);

    if (!order.orderId) {
      alert("Tạo đơn hàng thất bại! Không có orderId.");
      return;
    }

    // Poll API paymentUrl
    let paymentUrl;
    const maxRetries = 10; // số lần thử
    const delay = 1000; // ms giữa các lần thử
    for (let i = 0; i < maxRetries; i++) {
      const data = await getPaymentUrl(order.orderId);
      if (data.paymentUrl) {
        paymentUrl = data.paymentUrl;
        break;
      }
      await new Promise(r => setTimeout(r, delay)); // đợi 1 giây
    }

    if (paymentUrl) {
      window.location.href = paymentUrl; // redirect sang VNPay
    } else {
      alert(
        "Đơn hàng đã tạo thành công! Link thanh toán chưa sẵn sàng, vui lòng thử lại sau."
      );
    }

  } catch (err) {
    console.error("Order error:", err);
    alert("Tạo đơn hàng thất bại!");
  }
};

  return (
    <div className="flex flex-col min-h-screen bg-[#fcc7e7]">
      <div className="flex-1 pt-24 pb-8 px-4">
        <div className="max-w-7xl mx-auto px-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-[#910c4e] to-[#b91c5a] bg-clip-text text-transparent mb-2">
              Thanh toán
            </h1>
            <p className="text-gray-700 text-lg">Hoàn tất đơn hàng của bạn</p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Giỏ hàng */}
            <div className="lg:col-span-2">
              <div className="bg-white border-2 border-gray-200 rounded-3xl p-6 mb-6 shadow-sm">
                {!cart.length ? (
                  <div className="text-center py-12">
                    <div className="w-20 h-20 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <span className="text-4xl">🛒</span>
                    </div>
                    <p className="text-gray-500 text-lg mb-4">
                      Chưa có khóa học nào trong giỏ hàng
                    </p>
                    <button
                      onClick={() => navigate("/courses")}
                      className="bg-gradient-to-r from-[#910c4e] to-[#b91c5a] text-white px-6 py-3 rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105"
                    >
                      Khám phá khóa học
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {cart.map((item, index) => {
                      const isSelected = selectedItems.includes(String(item.id));
                      return (
                        <div
                          key={item.id}
                          className={`flex items-center justify-between p-4 border-2 rounded-3xl transition-all duration-200 min-h-[96px] ${
                            isSelected
                              ? "border-[#910c4e] bg-gradient-to-r from-[#910c4e]/5 to-[#b91c5a]/5"
                              : "border-gray-200 hover:border-[#910c4e]"
                          }`}
                        >
                          <div className="flex items-center flex-1">
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => toggleSelect(item.id)}
                              className="mr-4 w-5 h-5 accent-[#b91c5a] cursor-pointer"
                            />
                            <div className="w-12 h-12 bg-gradient-to-r from-[#910c4e] to-[#b91c5a] rounded-2xl flex items-center justify-center text-white font-bold mr-4 shadow-lg">
                              {index + 1}
                            </div>
                            <img
                              src={item.imageUrl || "img/default-course.jpg"}
                              alt={item.courseName}
                              className="w-16 h-16 object-cover rounded-xl mr-4 border"
                            />
                            <div className="flex-1">
                              <p className="text-xs text-gray-400 mb-1">Khóa học:</p>
                              <h3 className="font-semibold text-gray-900 mb-1">{item.courseName}</h3>
                              <p className="text-xs text-gray-500 mb-1">
                                Giảng viên: {item.createdBy || item.instructor || creators[String(item.id)] || "Không rõ"}
                              </p>
                            </div>
                          </div>
                          <div className="text-right min-w-[100px]">
                            <p className="font-bold text-gray-900">
                              {Number(item.price || 0).toLocaleString()} đ
                            </p>
                          </div>
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="p-2 text-red-500 hover:bg-red-50 rounded-2xl transition-all duration-200 border-2 border-transparent hover:border-red-200 ml-4"
                            title="Xóa khỏi giỏ hàng"
                          >
                            🗑️
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* Tóm tắt và thanh toán */}
            <div className="lg:col-span-1">
              <div className="bg-white border-2 border-gray-200 rounded-3xl p-6 shadow-sm sticky top-4 min-w-[300px]">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Tóm tắt đơn hàng</h2>
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
                      <span>{total.toLocaleString()} đ</span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={handlePayment}
                  disabled={!selectedItems.length}
                  className={`w-full py-4 rounded-2xl font-semibold text-lg transition-all duration-200 ${
                    selectedItems.length
                      ? "bg-gradient-to-r from-[#910c4e] to-[#b91c5a] text-white hover:from-[#6d083b] hover:to-[#8a1544] shadow-lg hover:shadow-xl transform hover:scale-105"
                      : "bg-gray-300 text-gray-500 cursor-not-allowed"
                  }`}
                >
                  {selectedItems.length ? "Thanh toán ngay" : "Chọn khóa học"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
