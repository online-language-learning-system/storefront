import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";


export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: [
      // @ sẽ trỏ tới src trong dự án, không trỏ ra ngoài hệ thống
      { find: "@", replacement: path.resolve(__dirname, "src") },
    ],
  },
  server: {    
    port: 3000,          // port chạy trong container
    strictPort: true,    // nếu port bận sẽ báo lỗi
    open: false,         // không tự mở trình duyệt
    host: "0.0.0.0",     // cho phép truy cập từ bên ngoài container
    fs: {
      strict: false,     // cho phép Vite đọc file ngoài root nếu cần
    },
  },
  build: {
    outDir: "dist",      // thư mục build
  },
});
