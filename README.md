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
│   ├── SiteHeader.tsx      # Thanh điều hướng cố định (7 mục, đọc từ lib/sections.ts)
│   ├── SectionNav.tsx      # Mục lục thông minh: rail bên phải (máy tính) / thanh dưới (điện thoại)
│   ├── ScrollProgress.tsx  # Thanh tiến độ đọc + nút "giảm hiệu ứng" / về đầu trang
│   ├── Hero3D.tsx          # SECTION 1 — biểu tượng búa và liềm 3D (R3F)
│   ├── GlobeSection.tsx    # SECTION 2 — quả địa cầu 3D + mốc lịch sử
│   ├── ThoughtSection.tsx  # SECTION 3 — sáu chuyên đề + kiểm chứng trích dẫn
│   ├── ThoughtLab3D.tsx    #   3D: vòng xoay thẻ chuyên đề (CanvasTexture + Bloom)
│   ├── QuoteSource.tsx     #   Nguồn trích dẫn + link tra cứu
│   ├── ListenButton.tsx    #   Nút nghe dùng chung (không tự phát, chỉ một clip phát một lúc)
│   ├── VoiceArchive.tsx    #   Tiếng nói thật của Bác Hồ: 11 liên kết tới kho lưu trữ chính thức
│   ├── KnowledgeCards.tsx  # SECTION 4 — 12 thẻ kiến thức nền (hiện 6 thẻ, có nút xem thêm)
│   ├── GenZCards.tsx       # SECTION 5 — thẻ tilt 3D bài học Gen Z
│   ├── ChallengeSection.tsx# Bọc QuizGame + CitationGame + QuoteGallery
│   ├── QuizGame.tsx        # SECTION 6a — 7 câu hỏi tình huống
│   ├── CitationGame.tsx    # SECTION 6b — trò chơi "Câu này của ai?"
│   ├── QuoteGallery.tsx    # SECTION 6c — thẻ trích dẫn lật 3D (hiện 4 thẻ, có nút xem thêm)
│   ├── RoadmapSection.tsx  # SECTION 7 — lộ trình 7 ngày dạng dải chọn ngày, 1 ngày mở mỗi lúc
│   └── NotebookSection.tsx # SECTION 8 — sổ tay ôn tập, xuất Markdown / in PDF
├── lib/
│   ├── sections.ts         # Nguồn duy nhất cho mục lục: header, rail điều hướng, mục lục ở hero
│   ├── prefs.ts            # Tuỳ chọn người dùng: giảm hiệu ứng, phát hiện thiết bị có chuột
│   ├── notebook.ts         # Store localStorage: trích dẫn, việc nhỏ, ghi chú, đã đọc
│   └── types.ts            # Type suy ra trực tiếp từ JSON
├── data/
│   ├── tu-tuong.json       # 6 chuyên đề: luận điểm, trích dẫn (nguồn + link), ứng dụng, việc nhỏ
│   ├── citation-audit.json # 12 trích dẫn thường gặp: đúng nguồn, sai nguồn, dị bản
│   ├── trot-choi.json      # 14 câu cho trò chơi "Câu này của ai?" + 6 nhãn tác giả
│   ├── kien-thuc-nen.json  # 12 thẻ flashcard: định nghĩa, cơ sở, 5 thời kỳ, giá trị
│   ├── lo-trinh.json       # Lộ trình 7 ngày (mỗi ngày 1 chuyên đề + việc nhỏ)
│   ├── audio.json          # 2 clip thử nghiệm: file, thời lượng, scriptVersion để biết khi nào thu lại
│   ├── audio-goc.json      # 11 tư liệu gốc có tiếng nói của Người (chỉ liên kết, không sao chép tệp)
│   ├── nguon.json          # Chính sách nội dung, tư liệu đối chiếu, giấy phép tài sản
│   ├── timeline.json       # 13 mốc lịch sử từ 1890 đến 1990
│   ├── genz-cards.json     # Nội dung 3 thẻ bài học
│   ├── quiz.json           # 7 câu hỏi tình huống
│   └── quotes.json         # 8 trích dẫn đã kiểm nguồn
├── scripts/
│   └── verify-content.mjs  # Kiểm chứng tự động: nguồn, link, số trang, topicId
├── .github/workflows/
│   └── verify-content.yml  # CI: kiểm chứng nội dung → tsc → lint → build
├── docs/
│   ├── KIEM-DUYET-NOI-DUNG.md # Ghi chép quá trình kiểm chứng nội dung
│   ├── REVIEW-3D-TUONG-TAC.md # Rà soát và sửa lỗi tương tác 3D
│   ├── DANH-GIA-GIAO-DIEN.md  # Đánh giá giao diện theo số đo + kế hoạch âm thanh
│   └── PHAP-LY-NHUNG-AUDIO.md # 4 mức nhúng tư liệu: rủi ro pháp lý + mẫu xin phép
├── public/audio/           # Clip mp3 tạo sẵn (thoại, không nhạc nền)
├── tailwind.config.ts      # Token màu: burgundy / cream / gold / charcoal (+ gold.deep cho chữ trên nền sáng)
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

## Nội dung kèm âm thanh (bản thử nghiệm)

- `data/audio.json` + `components/ListenButton.tsx`: nút nghe **không tự phát**,
  chỉ một clip phát tại một thời điểm, có `aria-pressed`, thanh tiến độ và thời lượng.
- Kịch bản audio lấy **nguyên văn** từ dữ liệu đã kiểm duyệt, mỗi clip ghi
  `scriptVersion` (ví dụ `tu-tuong.json#doc-lap-cnxh/quotes[1]`) để biết khi nào nội
  dung nguồn đổi thì phải thu lại.
- **Không có nội dung nào chỉ tồn tại dưới dạng âm thanh**: bản chữ luôn nằm trên trang,
  nên người khiếm thính và trình đọc màn hình không mất thông tin.
- `npm run verify:content` kiểm luôn: file trong `public/` phải tồn tại, có
  `scriptVersion`, thời lượng hợp lệ và bitrate tối thiểu 32 kbps.
- Lộ trình mở rộng (ôn tập bằng tai, âm phản hồi trong game, podcast nhiều giọng) và
  số đo giao diện đầy đủ: xem `docs/DANH-GIA-GIAO-DIEN.md`.

### Tiếng nói thật của Bác Hồ — chỉ liên kết, không sao chép

`data/audio-goc.json` + `components/VoiceArchive.tsx` liệt kê **11 tư liệu gốc** do
Người trực tiếp nói, kèm liên kết tới kho lưu trữ chính thức (hochiminh.vn — Văn
phòng Trung ương Đảng):

- **Bản ghi âm tiếng nói** (7): Tuyên ngôn Độc lập, Lời kêu gọi toàn quốc kháng chiến
  1946, Lời kêu gọi chống Mỹ cứu nước 17/7/1966, Diễn văn Đại hội III 1960, mít tinh
  31/12/1959, chúc Tết Mậu Thân 1968 và Kỷ Dậu 1969.
- **Phim tư liệu** (4): *Hình ảnh về đời hoạt động của Hồ Chủ tịch* (1960),
  *Nguyễn Ái Quốc – Hồ Chí Minh* (1974), *Hồ Chí Minh – Chân dung một con người* (1990),
  *Những giờ phút cuối đời Bác Hồ* (1990).

Ba nguyên tắc bắt buộc:

1. **Không sao chép tệp về máy chủ của trang** — chỉ mở tại nguồn: tôn trọng bản quyền
   của đơn vị lưu trữ và tránh các bản gán sai sự kiện, bản AI nhái giọng đang lan truyền.
2. **Không tạo giọng AI nhái giọng Bác Hồ** dưới bất kỳ hình thức nào. Hai clip trong
   `public/audio/` là giọng tổng hợp đọc lại kịch bản đã kiểm duyệt, và được ghi nhãn
   rõ như vậy ngay trên giao diện.
3. **Chỉ liên kết, không nhúng thẳng**: phân tích đầy đủ về bốn mức "nhúng" (liên kết /
   iframe / hotlink / tải về host lại), căn cứ pháp lý theo Điều 25, 27, 34 Luật SHTT và
   Luật Lưu trữ 2024, kèm **mẫu văn bản xin phép**: xem `docs/PHAP-LY-NHUNG-AUDIO.md`.
4. **Phân biệt rõ hai loại**: `"voice": "giong-nguoi"` (bản ghi âm tiếng nói của Người)
   và `"voice": "co-trich-doan"` (phim tài liệu có trích đoạn, phần còn lại là lời bình).
   `npm run verify:content` chặn mọi liên kết không thuộc danh sách nguồn chính thức.

## Trang gọn để dễ đọc

Trang cố tình giữ **mọi nội dung đã kiểm duyệt vẫn tới được**, nhưng không bắt người
đọc cuộn hết một lần:

- **Mục lục ở hero** (`lib/sections.ts`): 7 mục, chạm là tới thẳng.
- **`SectionNav`**: rail bên phải trên máy tính (nhãn mục đang xem) và thanh dưới cùng
  trên điện thoại (`‹`, `Mục n/7`, `›` + mở mục lục + "giảm hiệu ứng" + về đầu trang).
- **Hiện dần (progressive disclosure)**: 6 chuyên đề tư tưởng là accordion đóng sẵn;
  phần kiểm chứng trích dẫn hiện 4/12 trường hợp; thẻ kiến thức nền hiện 6/12;
  thư viện trích dẫn hiện 4/8; lộ trình chỉ mở một ngày mỗi lúc.
- **Giảm hiệu ứng**: nút bật/tắt 3D, tilt, marquee, parallax (`lib/prefs.ts`,
  `soiduong.reduce-effects.v1`).

Ước lượng sau khi nén: khoảng **8.400 px** (≈ 10,6 màn hình máy tính / ≈ 29 màn hình
điện thoại), giảm khoảng **37%** so với ~13.350 px trước đó. Mọi nút "xem thêm" đều
dùng `aria-expanded`, lộ trình dùng `role="tablist"` + `aria-selected`.

## Kiểm tra trước khi triển khai

```bash
npm run verify:content   # kiểm chứng nội dung (nguồn, link, số trang, topicId)
npm run verify:links     # kiểm tra các link nguồn còn truy cập được
npx tsc --noEmit         # kiểm tra kiểu
npm run lint             # eslint
npm run build            # build production
```

`verify:content` chạy trong GitHub Actions (`.github/workflows/verify-content.yml`)
ở mỗi lần push và pull request, nên nội dung sai nguồn không lọt vào repo. Các bất
biến được kiểm tra:

1. Mọi trích dẫn đều có `source` và `sourceUrl` để người đọc tự tra cứu.
2. Không nêu số trang (vì số trang thay đổi giữa các lần in của Hồ Chí Minh toàn tập).
3. Trích dẫn không phải “Nguyên văn” thì phải có `note` giải thích.
4. Mỗi mục trong bảng kiểm chứng phải có bằng chứng, cách dùng đúng và link đối chiếu.
5. Mọi `topicId` trong trích dẫn, trò chơi và lộ trình phải tồn tại trong `tu-tuong.json`.

## Học tập & ôn thi

- **Thẻ kiến thức nền**: 12 flashcard về định nghĩa tư tưởng Hồ Chí Minh, ba cơ sở
  hình thành (khách quan, lý luận, nhân tố chủ quan), năm thời kỳ phát triển và giá
  trị tư tưởng; lọc theo nhóm, lưu thẻ vào sổ tay.
- **Trò chơi “Câu này của ai?”**: 14 câu thuộc 6 nhãn tác giả (Hồ Chí Minh, Thanh
  Tịnh, Minh Huệ, Lê-nin, Khổng Tử, ca dao). Mỗi vòng 8 câu, lưu kỷ lục trong
  `localStorage`, sau mỗi câu hiện giải thích kèm link tư liệu đối chiếu.
- **Lộ trình 7 ngày**: mỗi ngày gắn với một chuyên đề, có việc nhỏ và tự đánh dấu
  hoàn thành; tiến độ lưu trên máy người đọc.
- **Link nguồn bấm được**: mọi trích dẫn (30 câu trong chuyên đề và gallery) đều có
  nút “Xem nguồn ↗”, và mỗi mục kiểm chứng có “Tra cứu tư liệu đối chiếu ↗”. Toàn bộ
  23 tên miền nguồn được liệt kê trong `verify:content`.  
