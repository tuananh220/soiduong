# Soi Đường — Website môn học Tư tưởng Hồ Chí Minh (3D tương tác)

Next.js 14 (App Router) + Tailwind CSS + React Three Fiber + Framer Motion.
Không cần database — toàn bộ nội dung nằm trong các file JSON ở `/data`.

## Cài đặt

```bash
npm install
npm run dev
```

Mở http://localhost:3000

## Cấu trúc thư mục

```
soiduong/
├── app/
│   ├── layout.tsx        # Font (Playfair Display + Inter), metadata
│   ├── page.tsx          # Ghép nối toàn bộ single-page
│   └── globals.css       # Token màu nền, reduced-motion, flip-card CSS
├── components/
│   ├── SiteHeader.tsx    # Thanh điều hướng cố định
│   ├── Hero3D.tsx        # SECTION 1 — biểu tượng búa và liềm 3D (R3F)
│   ├── GlobeSection.tsx  # SECTION 2 — quả địa cầu 3D + mốc lịch sử
│   ├── GenZCards.tsx     # SECTION 3 — thẻ tilt 3D bài học Gen Z
│   ├── ChallengeSection.tsx # Bọc QuizGame + QuoteGallery
│   ├── QuizGame.tsx      # SECTION 4a — mini quiz tình huống
│   └── QuoteGallery.tsx  # SECTION 4b — thẻ trích dẫn lật 3D
├── data/
│   ├── timeline.json     # 13 mốc lịch sử từ 1890 đến 1990
│   ├── genz-cards.json   # Nội dung 3 thẻ bài học
│   ├── quiz.json         # 5 câu hỏi tình huống
│   └── quotes.json       # Trích dẫn truyền cảm hứng
├── tailwind.config.ts    # Token màu: burgundy / cream / gold / charcoal
├── next.config.js
├── tsconfig.json
└── package.json
```

## Ghi chú kỹ thuật

- **Không dùng Spline**: Hero và Globe được dựng bằng hình học thủ tục
  (`three` + `@react-three/fiber` + `@react-three/drei`) để không phụ
  thuộc vào asset ngoài, tải nhẹ, và không cần API key. Có thể thay bằng
  scene Spline thật bằng cách nhúng `<iframe>` hoặc gói `@splinetool/react-spline`
  nếu muốn phong cách hoạt hình phức tạp hơn.
- **`dynamic(..., { ssr: false })`**: mọi Canvas 3D chỉ render phía client,
  tránh lỗi `window is not defined` khi build.
- **Lazy & Suspense**: `Hero3D` và `GlobeSection` được `dynamic import`,
  còn bên trong mỗi Canvas dùng Suspense để tải cảnh 3D dần với trạng thái
  chờ rõ ràng trên globe.
- **Reduced motion**: `globals.css` tắt toàn bộ animation/transition khi
  người dùng bật "prefers-reduced-motion" ở hệ điều hành.
- **Responsive**: chiều cao Canvas và cỡ chữ dùng breakpoint Tailwind
  (`sm:`, `md:`, `lg:`) để không giật lag trên di động — Canvas nhỏ hơn
  và `dpr={[1, 1.5]}` giới hạn độ phân giải render.
- **Cập nhật nội dung**: chỉ cần sửa file JSON trong `/data`, không đụng
  vào component.

## Có thể mở rộng thêm

- Thêm trang `/chuong/[slug]` nếu sau này cần đào sâu từng chương giáo trình.
- Nối `QuoteGallery` với API tạo ảnh (Canvas API hoặc `html-to-image`) để
  xuất file wallpaper thật thay vì chỉ chia sẻ text.
- Thêm i18n nếu cần bản tiếng Anh cho sinh viên quốc tế.
