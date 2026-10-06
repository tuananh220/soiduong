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
│   ├── layout.tsx          # Metadata, nạp font Playfair Display + Inter qua CSS
│   ├── page.tsx            # Ghép nối toàn bộ single-page
│   └── globals.css         # Token màu, font, reduced-motion, flip-card, style khi in
├── components/
│   ├── SiteHeader.tsx      # Thanh điều hướng cố định (5 mục)
│   ├── ScrollProgress.tsx  # Thanh tiến độ đọc + chấm điều hướng + nút về đầu trang
│   ├── Hero3D.tsx          # SECTION 1 — biểu tượng búa và liềm 3D (R3F)
│   ├── GlobeSection.tsx    # SECTION 2 — quả địa cầu 3D + mốc lịch sử
│   ├── ThoughtSection.tsx  # SECTION 3 — sáu chuyên đề tư tưởng + kiểm chứng trích dẫn
│   ├── ThoughtLab3D.tsx    #   3D: vòng xoay thẻ chuyên đề (CanvasTexture + Bloom)
│   ├── GenZCards.tsx       # SECTION 4 — thẻ tilt 3D bài học Gen Z (hỗ trợ cảm ứng)
│   ├── ChallengeSection.tsx# Bọc QuizGame + QuoteGallery
│   ├── QuizGame.tsx        # SECTION 5a — 7 câu hỏi tình huống
│   ├── QuoteGallery.tsx    # SECTION 5b — thẻ trích dẫn lật 3D, lọc theo chuyên đề
│   └── NotebookSection.tsx # SECTION 6 — sổ tay ôn tập, xuất Markdown / in PDF
├── lib/
│   ├── notebook.ts         # Store localStorage: trích dẫn, việc nhỏ, ghi chú, đã đọc
│   └── types.ts            # Type suy ra trực tiếp từ JSON
├── data/
│   ├── tu-tuong.json       # 6 chuyên đề: luận điểm, trích dẫn (có nguồn), ứng dụng, việc nhỏ
│   ├── citation-audit.json # 12 trích dẫn thường gặp: đúng nguồn, sai nguồn, dị bản
│   ├── nguon.json          # Chính sách nội dung, tư liệu đối chiếu, giấy phép tài sản
│   ├── timeline.json       # 13 mốc lịch sử từ 1890 đến 1990
│   ├── genz-cards.json     # Nội dung 3 thẻ bài học
│   ├── quiz.json           # 7 câu hỏi tình huống
│   └── quotes.json         # 8 trích dẫn đã kiểm nguồn
├── docs/
│   └── KIEM-DUYET-NOI-DUNG.md # Ghi chép quá trình kiểm chứng nội dung
├── tailwind.config.ts      # Token màu: burgundy / cream / gold / charcoal
├── next.config.js
├── tsconfig.json
└── package.json
```

## Nội dung đã kiểm chứng

- **Sáu chuyên đề cốt lõi** (`data/tu-tuong.json`) bám theo trật tự chương 3–6 của
  giáo trình: độc lập dân tộc gắn với chủ nghĩa xã hội; Đảng và Nhà nước của dân;
  đại đoàn kết; đoàn kết quốc tế và “dĩ bất biến, ứng vạn biến”; văn hóa – giáo dục
  – trồng người; đạo đức cách mạng và nêu gương. Mỗi chuyên đề gồm luận điểm, trích
  dẫn kèm nguồn, phần ứng dụng và một “việc nhỏ tuần này”.
- **Bảng kiểm chứng trích dẫn** (`data/citation-audit.json`) chỉ ra cả những câu
  thường bị gán sai cho Bác Hồ, ví dụ “Dễ trăm lần không dân cũng chịu…” (thơ của
  Thanh Tịnh, 1948) hay hai nguồn bị nhầm của câu “Học hỏi là một việc phải tiếp
  tục suốt đời” và “Một tấm gương sống…”.
- **Chính sách nội dung và giấy phép** (`data/nguon.json`) nêu rõ nguyên tắc biên
  soạn, tư liệu đối chiếu và giấy phép của ảnh, thư viện 3D.
- Quá trình đối chiếu được ghi lại trong `docs/KIEM-DUYET-NOI-DUNG.md`.

## Tương tác 3D và trải nghiệm người dùng

- **Vòng xoay chuyên đề 3D** (`ThoughtLab3D.tsx`): sáu thẻ xếp trên vòng tròn,
  kéo ngang để xoay (kéo dọc vẫn cuộn trang), chạm để mở, tự động xoay có nút tạm
  dừng — tự dừng khi bạn đang đọc cột chi tiết, khi tab bị ẩn hoặc khi bật giảm
  hiệu ứng. Hỗ trợ phím ← →, quầng sáng + Bloom nhấn thẻ đang chọn. Có nút tắt 3D;
  khi WebGL lỗi, error boundary tự chuyển sang lưới tĩnh.
- **Hero 3D** (`Hero3D.tsx`): kéo để xoay kèm quán tính, chạm để biểu tượng sáng
  lên một nhịp, kèm nhánh dự phòng cho thiết bị không có WebGL.
- **Chữ tiếng Việt trong WebGL**: thay vì nạp font 3D từ CDN, mỗi thẻ được vẽ
  bằng **Canvas API** rồi dùng làm `CanvasTexture` (font lấy từ token
  `--font-display` / `--font-body`), nên dấu tiếng Việt hiển thị đầy đủ và trang
  không phụ thuộc asset ngoài.
- **Thẻ tilt 3D** ở phần Góc Gen Z dùng Pointer Events nên hoạt động cả với chuột,
  bút cảm ứng và ngón tay.
- **Nút “Giảm hiệu ứng”** ở góc phải trang (`lib/prefs.ts`): tắt xoay tự động, hậu
  kỳ Bloom và các chuyển động trang trí; lưu lựa chọn vào `localStorage` và phản
  chiếu lên `<html data-reduce-effects>` để CSS tắt animation như khi hệ điều hành
  yêu cầu. Mặc định bật theo `prefers-reduced-motion` của thiết bị.
- **Sổ tay ôn tập**: lưu trích dẫn, việc nhỏ và ghi chú cá nhân vào `localStorage`,
  theo dõi tiến độ đọc, xuất file `.md`, sao chép Markdown hoặc in thành PDF. Toàn
  bộ dữ liệu nằm trên máy người đọc, không có backend.
- **Thanh tiến độ đọc** ở đầu trang, chấm điều hướng nhanh bên phải và nút về đầu
  trang; các phần nội dung đều có nhãn ARIA, trạng thái `aria-pressed`, hỗ trợ bàn
  phím và tôn trọng `prefers-reduced-motion`.

## Ghi chú kỹ thuật

- **Không dùng Spline**: các khung 3D được dựng bằng hình học thủ tục
  (`three` + `@react-three/fiber` + `@react-three/drei`) và hậu kỳ bằng
  `@react-three/postprocessing` (Bloom, Vignette). Có thể thay bằng scene Spline
  thật bằng cách nhúng `<iframe>` hoặc gói `@splinetool/react-spline` nếu muốn
  phong cách hoạt hình phức tạp hơn.
- **Font nạp qua `<link>` trong `app/layout.tsx`** thay vì `next/font`: build không
  phụ thuộc mạng (hữu ích trong CI hoặc môi trường sandbox chặn Google Fonts), còn
  trình duyệt người đọc vẫn tải Playfair Display + Inter như bình thường.
- **`dynamic(..., { ssr: false })`**: các Canvas 3D chỉ render phía client; phần chữ
  của `ThoughtSection` vẫn được render tĩnh để nội dung có trong HTML ban đầu và
  thân thiện với tìm kiếm.
- **Lazy & Suspense**: mỗi Canvas dùng Suspense với trạng thái chờ bằng tiếng Việt;
  `ThoughtLab3D` chỉ được gắn vào DOM khi khu vực đó sắp vào khung nhìn, và **giữ
  nguyên** sau đó (không tháo ra khi cuộn qua lại, tránh dựng lại texture và WebGL
  context).
- **Tạm dừng render theo tầm nhìn**: cả ba canvas đặt `frameloop={inView ? "always"
  : "never"}` qua `lib/useInViewState.ts` (IntersectionObserver) và
  `performance={{ min: 0.5 }}`, nên không vẽ 60 fps khi đã cuộn qua.
- **Texture địa cầu nạp bằng `TextureLoader` + `loadAsync`** trong `useEffect` thay
  vì `useLoader`: `useLoader` chạy qua `suspend-react`, tải lỗi sẽ ném lỗi trong
  render phase và có thể làm hỏng cả trang. Nay CDN lỗi chỉ khiến quả cầu chuyển
  sang bản dựng thủ tục, các mốc lịch sử vẫn hoạt động.
- **`touch-action: pan-y`** cho canvas địa cầu (OrbitControls mặc định đặt
  `touch-action: none` và chặn cuộn trang trên di động).
- **`dpr={[1, 1.5]}`** giới hạn độ phân giải render; `ContactShadows` dùng
  `resolution={256}`; hậu kỳ tự tắt khi người dùng bật giảm chuyển động.
- **Reduced motion**: `globals.css` tắt animation/transition khi người dùng bật
  “prefers-reduced-motion”; các scene 3D cũng dừng tự xoay và giảm hiệu ứng.
- **Trải nghiệm in**: `@media print` ẩn canvas và điều hướng, chuyển nội dung sang
  nền trắng để sổ tay in ra đọc được.
- **Cập nhật nội dung**: chỉ cần sửa file JSON trong `/data`, không đụng vào
  component (kiểu dữ liệu suy ra trực tiếp từ JSON trong `lib/types.ts`).

## Kiểm tra trước khi triển khai

```bash
npx tsc --noEmit    # kiểm tra kiểu
npm run build       # build production
npm run lint        # eslint
```
