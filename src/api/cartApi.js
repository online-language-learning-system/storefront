  // src/api/cartApi.js
  const BASE_URL = "http://localhost:8000/api/cart-service";

  function getAuthHeaders() {
    const accessToken = localStorage.getItem("accessToken");
    const token = accessToken || localStorage.getItem("token");
    return token ? { Authorization: `Bearer ${token}` } : {};
  }

  export async function getCart() {
    const headers = getAuthHeaders();
    if (!headers.Authorization) {

      return { items: [] };
    }
    const res = await fetch(`${BASE_URL}/storefront/cart/view`, {
      headers: {
        Accept: "application/json",
        ...headers,
      },
      credentials: "include",
    });
    if (!res.ok) {
      const txt = await safeText(res);
      throw new Error(txt || "Lỗi khi lấy giỏ hàng");
    }
    return res.json();
  }

  export async function addToCart(courseId, quantity = 1) {
    // Use getAuthHeaders() like getCart() and removeFromCart() for consistency
    const authHeaders = getAuthHeaders();
    
    if (!authHeaders.Authorization) {
      throw new Error("Bạn cần đăng nhập để thêm khóa học vào giỏ hàng");
    }

    const headers = {
      "Content-Type": "application/json",
      "Accept": "application/json",
      ...authHeaders,
    };

    // Validate courseId
    const courseIdNum = Number(courseId);
    if (isNaN(courseIdNum) || courseIdNum <= 0) {
      throw new Error(`Course ID không hợp lệ: ${courseId}`);
    }

    // Try multiple payload formats - backend might expect different field names
    const payloads = [
      // Format 1: snake_case with number (thử format này trước vì nhiều backend Java/Spring dùng snake_case)
      { course_id: courseIdNum, quantity: Number(quantity) || 1 },
      // Format 2: camelCase with number
      { courseId: courseIdNum, quantity: Number(quantity) || 1 },
      // Format 3: camelCase with string
      { courseId: String(courseId), quantity: Number(quantity) || 1 },
    ];

    // Start with snake_case format (common in Java/Spring Boot backends)
    let payload = payloads[0];
    let attempt = 0;
    const maxAttempts = payloads.length;

    console.log("Adding to cart - URL:", `${BASE_URL}/storefront/cart/items`);
    console.log("Adding to cart - Headers:", { ...headers, Authorization: "Bearer ***" });
    console.log("Adding to cart - Payload (JSON):", JSON.stringify(payload, null, 2));
    console.log("Adding to cart - Course ID type:", typeof courseIdNum, "Value:", courseIdNum);

    // Try different payload formats if first attempt fails
    for (attempt = 0; attempt < maxAttempts; attempt++) {
      payload = payloads[attempt];
      
      console.log(`\n🔄 Attempt ${attempt + 1}/${maxAttempts}:`, JSON.stringify(payload, null, 2));
      
      try {
        const res = await fetch(`${BASE_URL}/storefront/cart/items`, {
          method: "POST",
          headers,
          body: JSON.stringify(payload),
          credentials: "include",
        });

        console.log("Response status:", res.status, res.statusText);

        if (res.status === 409) {
          return { duplicated: true };
        }

        if (res.ok) {
          const responseData = await res.json();
          console.log("✅ Success with format:", Object.keys(payload)[0]);
          console.log("Success response:", responseData);
          return responseData;
        }

        // If not ok and not last attempt, try next format
        if (attempt < maxAttempts - 1) {
          const clonedRes = res.clone();
          let errorInfo = "";
          try {
            const errorData = await res.json();
            errorInfo = errorData.message || errorData.error || JSON.stringify(errorData);
          } catch {
            const text = await clonedRes.text();
            errorInfo = text || res.statusText;
          }
          console.warn(`⚠️ Attempt ${attempt + 1} failed (${res.status}):`, errorInfo);
          console.log(`   Trying next format...`);
          continue; // Try next format
        }

        // Last attempt failed - return detailed error
        const clonedRes = res.clone();
        let errorMessage = `HTTP ${res.status}: ${res.statusText}`;
        
        try {
          const errorData = await res.json();
          console.error("Error response JSON:", errorData);
          
          if (res.status === 400 || res.status === 422) {
            errorMessage = errorData.message || errorData.error || JSON.stringify(errorData);
          } else if (res.status === 500) {
            errorMessage = errorData.message || errorData.error || "Lỗi server. Có thể do format dữ liệu không đúng.";
            console.error("⚠️ Server error after trying all formats:");
            console.error("  1. Payload format mismatch (đã thử:", payloads.map(p => Object.keys(p)[0]).join(", "), ")");
            console.error("  2. Course ID không tồn tại trong database");
            console.error("  3. Backend có lỗi xử lý");
            console.error("  Last payload sent:", JSON.stringify(payload, null, 2));
          } else {
            errorMessage = errorData.message || errorData.error || errorData.details || errorData.path || JSON.stringify(errorData);
          }
        } catch (jsonError) {
          try {
            const responseText = await clonedRes.text();
            console.error("Error response text:", responseText);
            if (responseText) {
              try {
                const errorData = JSON.parse(responseText);
                errorMessage = errorData.message || errorData.error || errorData.details || errorData.path || responseText;
              } catch {
                errorMessage = responseText;
              }
            }
          } catch (textError) {
            console.error("Could not read error response:", textError);
          }
        }
        
        const fullErrorMessage = `[${res.status}] ${errorMessage}`;
        console.error("Full error message:", fullErrorMessage);
        throw new Error(fullErrorMessage);
        
      } catch (fetchError) {
        // If it's our formatted error, re-throw it
        if (fetchError.message && fetchError.message.includes("[")) {
          throw fetchError;
        }
        // Network or other errors - only throw on last attempt
        if (attempt === maxAttempts - 1) {
          throw new Error(fetchError.message || "Lỗi không xác định khi thêm vào giỏ hàng");
        }
        console.warn(`⚠️ Attempt ${attempt + 1} error:`, fetchError.message);
        console.log(`   Trying next format...`);
      }
    }
    
    // If we get here, all attempts failed (shouldn't happen due to throws above)
    throw new Error("Tất cả các format đều thất bại");
  }
  export async function removeFromCart(courseId) {
    const res = await fetch(`${BASE_URL}/storefront/cart/${courseId}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
      credentials: "include",
    });
    if (!res.ok) {
      const txt = await safeText(res);
      throw new Error(txt || "Lỗi khi gỡ khỏi giỏ");
    }
    return res.json();
  }

  async function safeText(res) {
    try {
      return await res.text();
    } catch (_) {
      return "";
    }
  }
