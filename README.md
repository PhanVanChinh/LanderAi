# LanderAI - AI Landing Page Generator

Ứng dụng tạo Landing Page thông minh sử dụng AI (Gemini 3 Flash).

## Tính năng
- Tạo Landing Page từ mô tả văn bản.
- Xem trước thời gian thực (Desktop/Mobile).
- Xuất mã HTML hoàn chỉnh (đã tích hợp Tailwind CSS & Fonts).
- Lưu lịch sử tạo trang.

## Hướng dẫn cài đặt và chạy trên máy cá nhân

### 1. Yêu cầu hệ thống
- Đã cài đặt **Node.js** (phiên bản 18 trở lên).
- Một trình duyệt web hiện đại.

### 2. Cài đặt
1. Tải mã nguồn về máy (Sử dụng tính năng **Export ZIP** trong menu Settings của AI Studio).
2. Giải nén thư mục.
3. Mở terminal (Command Prompt hoặc PowerShell) tại thư mục dự án.
4. Chạy lệnh sau để cài đặt các thư viện:
   ```bash
   npm install
   ```

### 3. Cấu hình API Key
1. Tạo một file tên là `.env` ở thư mục gốc của dự án (dựa trên file `.env.example`).
2. Thêm API Key của Gemini vào file `.env`:
   ```env
   GEMINI_API_KEY=your_api_key_here
   ```
   *(Bạn có thể lấy API Key tại [Google AI Studio](https://aistudio.google.com/app/apikey))*

### 4. Chạy ứng dụng
Chạy lệnh sau để khởi động server phát triển:
```bash
npm run dev
```
Sau đó, mở trình duyệt và truy cập: `http://localhost:3000`

## Công nghệ sử dụng
- **Frontend:** React 19, Tailwind CSS 4, Motion, Lucide Icons.
- **Backend:** Express, Vite Middleware.
- **AI:** Google Gemini 3 Flash.
