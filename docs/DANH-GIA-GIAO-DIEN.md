# Đánh giá giao diện tổng thể & kế hoạch nội dung kèm âm thanh

Bản rà soát ngày 07-10-2026, thực hiện trên mã nguồn tại commit sau lượt nén trang
(`refactor(độ dài trang)`).

## 1. Cách đánh giá

- Đọc trực tiếp token thiết kế: `tailwind.config.ts`, `app/globals.css`, `app/layout.tsx`.
- **Đo tương phản màu** theo công thức WCAG 2.1 (ngưỡng 4,5:1 cho chữ thường,
  3,0:1 cho chữ lớn và ranh giới chức năng) — có cộng độ mờ alpha trước khi đo.
- Đếm thang chữ, bán kính bo góc, khoảng cách dọc, mức phủ `focus-ring`, vùng chạm.
- Kiểm tra HTML render thật qua `curl` (id trùng, thứ tự mục, aria, alt).
- **Giới hạn:** môi trường này không cài được trình duyệt headless (tải Chromium
  thất bại), nên phần "cảm giác thị giác" (nhịp thở, độ cân bằng bố cục) dựa trên mã
  và số đo, không dựa trên ảnh chụp. Cần mắt người xem bản preview để chốt.

## 2. Kết luận nhanh

| Hạng mục | Điểm | Ghi chú |
|---|---|---|
| Bản sắc thị giác | 9/10 | Bảng màu và phân vai sáng/tối rất rõ, có cá tính |
| Điều hướng | 8/10 | Sau khi thêm mục lục dùng chung + rail/thanh dưới |
| Khả dụng & tiếp cận | 7/10 | Nền tảng tốt, còn lỗi tương phản và vùng chạm (đã vá P0) |
| Tính hệ thống (chữ, bo góc, tiêu đề) | 6/10 | Thang chữ và bo góc còn tuỳ hứng, cần chuẩn hoá |
| Hiệu năng | 7/10 | 3D đã tối ưu theo viewport; hero canvas vẫn là chi phí lớn nhất |

**Tổng kết: đã ổn về bản sắc và cấu trúc, chưa ổn về tính hệ thống.** Người dùng mới
sẽ thấy trang "đẹp và có gu"; nhưng khi soi kỹ thì các chi tiết nhỏ (cỡ chữ, bo góc,
màu chữ phụ) chưa theo một quy tắc thống nhất — đây là việc của một lượt "hệ thống
hoá" chứ không phải làm lại giao diện.

## 3. Đang tốt — nên giữ nguyên

1. **Phân vai màu theo chức năng.** Kem (`#FDFBF7`/`#F4EFE4`) = vùng đọc; than đá
   (`#1C1A17`/`#2B2723`) = vùng trải nghiệm/3D; mận cho nhấn mạnh; vàng cho nhãn và
   đường viền. Nhịp sáng–tối xen kẽ giữa các mục tạo cảm giác "từng chương" rõ ràng.
2. **Cặp font có chủ đích.** Playfair Display cho tiêu đề + Inter cho nội dung, có
   token `--font-display`/`--font-body` dùng chung cả cho texture chữ trong WebGL.
   Cả hai đều có bộ ký tự tiếng Việt.
3. **3D có mục đích sư phạm**, không phải trang trí: búa–liềm (mở đầu), địa cầu theo
   mốc lịch sử, vòng xoay chuyên đề, thẻ nghiêng theo chuột. Kèm ba lưới an toàn:
   `ErrorBoundary`, `frameloop` theo viewport, và nút "Giảm hiệu ứng" toàn trang.
4. **Nền tảng tiếp cận đã có:** `aria-label`, `aria-expanded`, `aria-current`,
   `aria-live`, `role="progressbar"`, `role="tablist"`, `focus-visible` màu vàng,
   `prefers-reduced-motion`, nhãn `alt` đầy đủ (không có `<img>` thiếu `alt`).
5. **Chi tiết nhỏ được chăm:** `::selection` màu vàng, `scroll-behavior`, lớp
   `.no-scrollbar` cho dải cuộn ngang, `-webkit-backface-visibility` cho thẻ lật,
   quy tắc in cho sổ tay.

## 4. Chưa ổn — số đo cụ thể

### 4.1 Đã vá trong lượt này (P0)

| Vấn đề | Bằng chứng | Cách vá |
|---|---|---|
| Chữ vàng trên nền kem không đạt tương phản | `#D4AF37` trên `#FDFBF7` = **2,03:1** (cần 4,5:1) — nhãn "Đúng nguyên văn" trong bảng kiểm chứng | Thêm token `gold.deep = #7A5C12` → **5,63:1** trên nền pill thật (đã kiểm trong CSS biên dịch) |
| Chữ chân trang quá mờ | `charcoal/55` trên kem = **3,86:1** ở cỡ 12px | Nâng lên `charcoal/65` = **5,30:1** |
| Vùng chạm thanh điều hướng điện thoại nhỏ | Nút `py-1.5` + chữ 11px ≈ 26–28 px | Nâng lên `min-h-[36px]`, đệm ngang rộng hơn |

### 4.2 Nên làm tiếp (P1)

1. **Thang chữ đang có 16 cỡ**, trong đó 6 cỡ đặt tay (10/11/12/13/15/17px) và 10 cỡ
   theo thang Tailwind. Đề xuất rút về 8 bậc và chỉ dùng 8 bậc đó:
   `11` nhãn nhỏ · `12` chú thích · `13/14` giao diện · `16` thân bài · `20` tiêu đề phụ
   · `24` tiêu đề mục nhỏ · `32` tiêu đề mục · `40/56` hero.
   *Cách làm:* đổi dần theo mục, không đổi một lượt để tránh vỡ bố cục.
2. **9 chỗ dùng chữ 10px.** Trên điện thoại nên nâng tối thiểu **11px**; 10px chỉ nên
   dùng cho nhãn viết hoa ngắn (và hiện đang đúng như vậy, nhưng vẫn nên rà lại).
3. **Bo góc có 5 mức** (`rounded-full` 71 lần, `2xl` 21, `xl` 16, `lg` 6, `md` 1).
   Quy tắc đề xuất: pill/chip = `full` · thẻ = `2xl` · ô nhập & nút phụ = `xl` ·
   tag nhỏ trong thẻ = `lg` · bỏ hẳn `md` (chỉ 1 chỗ dùng).
4. **Cỡ tiêu đề không đồng nhất giữa 7 mục**: `text-3xl` ×7, `text-2xl` ×7, `text-xl` ×6.
   Nên chốt: mỗi mục dùng đúng một cỡ tiêu đề (`3xl`, lên `4xl` ở màn hình lớn), các
   tiêu đề *bên trong* mục mới dùng `2xl`/`xl`.
5. **Chưa có "chế độ đọc"**: ngoài "Giảm hiệu ứng", nên có nút tăng cỡ chữ (110/125%)
   và nền dịu (kem đậm thay vì trắng) — hữu ích cho người đọc lâu, người lớn tuổi.
6. **Mục "Thách thức" có 3 khối lớn liền nhau trên cùng nền than**, dễ bị "lẫn" thành
   một khối dài. Gợi ý: chèn một dải kem mỏng hoặc vạch phân cách vàng giữa các khối.
7. **Ranh giới chức năng mờ.** Một số viền dùng `border-cream/15` (≈1,5:1). Chấp nhận
   được nếu chỉ để trang trí, nhưng nếu viền là thứ duy nhất phân tách hai vùng bấm
   được thì cần ≥3:1.

### 4.3 Tuỳ chọn (P2)

- Dark mode thật (đảo kem ↔ than). Tốn công vì phải soát lại toàn bộ 3D và ảnh; chỉ
  nên làm nếu có thời gian và nếu người dùng thực sự đọc ban đêm.
- Minigame 3D mới (kính lúp trên bản đồ hành trình 1890–1990). Vui nhưng tăng pin/CPU;
  nếu làm thì phải sau nút "Giảm hiệu ứng" và tải theo yêu cầu.

## 5. Nội dung kèm âm thanh — gợi ý

### 5.1 Sáu phương án

| # | Phương án | Công nghệ | Ưu | Nhược | Chi phí |
|---|---|---|---|---|---|
| A | Nghe từng trích dẫn (22 câu) | TTS tạo sẵn mp3 | Giọng ổn định, nghe đúng tên riêng/năm tháng, chạy mọi thiết bị | Phải tạo lại khi sửa nội dung | ~1–1,5 MB tĩnh |
| B | Đọc nội dung động | Web Speech API (`speechSynthesis`) | 0 KB tài nguyên, đọc được cả ghi chú của người dùng | Giọng tuỳ thiết bị, có máy không có giọng tiếng Việt | 0 |
| C | Bản giới thiệu 60–90 giây ở hero | TTS tạo sẵn, 1 file | "Nghe thay vì đọc" — đúng nỗi đau người lười đọc | Chỉ là điểm vào, không thay được nội dung | ~150 KB |
| D | Ôn tập bằng tai theo lộ trình 7 ngày | TTS tạo sẵn, 7 file 2–3 phút | Học khi đi đường, giá trị thật cho sinh viên | Nhiều nội dung phải soát lại | ~2–3 MB |
| E | Âm phản hồi trong game (đúng/sai, lật thẻ) | file sfx ngắn | Tăng cảm giác "game", rất nhẹ | Dễ gây khó chịu nếu bật mặc định | ~50 KB |
| F | Podcast 3 phút, 2 giọng, mỗi chuyên đề | TTS đa giọng + kịch bản mới | Hấp dẫn nhất, khác biệt | Tốn công biên tập, kịch bản mới phải kiểm duyệt lại | Lớn |

Phương án **G — nhạc nền** không khuyến nghị: tốn pin, gây mất tập trung, và trong
lớp học thì gần như luôn bị tắt.

### 5.2 Khuyến nghị: lai (hybrid), 3 giai đoạn

- **Giai đoạn 1 (một buổi):** **C** + **A cho 4–6 trích dẫn tiêu biểu** + một nút "Nghe"
  dùng chung. Đây là phần đem lại cảm nhận mới ngay, và đủ để đánh giá chất lượng giọng.
- **Giai đoạn 2:** **D** (ôn tập bằng tai) + **B** cho sổ tay người dùng + **E** (âm
  phản hồi, tắt mặc định).
- **Giai đoạn 3:** **F** nếu muốn làm "podcast" — cần kịch bản riêng và một lượt kiểm
  duyệt nội dung mới.

Lý do chọn lai: nội dung **đã kiểm duyệt** thì nên đọc bằng giọng tạo sẵn (ổn định,
soát được tên riêng, năm tháng, không phụ thuộc máy người dùng); còn nội dung **do
người dùng tạo** (ghi chú, sổ tay) thì chỉ Web Speech API mới đọc được.

### 5.3 Kiến trúc kỹ thuật

- `data/audio.json`: mảng `{ id, file, seconds, voice, scriptVersion, note }`.
  `scriptVersion` trỏ tới phiên bản dữ liệu nguồn để biết khi nào cần tạo lại clip.
- `components/ListenButton.tsx`: một thẻ `<audio preload="none">` dùng chung, chỉ phát
  một clip tại một thời điểm, có `aria-pressed`, hiện thời lượng, không tự phát.
- **Tôn trọng "Giảm hiệu ứng"**: không tự phát, không hiệu ứng nhấp nháy khi đang phát.
- **Luôn có bản chữ** (transcript): chính là nội dung đang hiển thị trên trang, nên
  không phát sinh thêm khối chữ nào — điều này cũng bảo đảm tiếp cận cho người khiếm thính.
- **Dung lượng:** mp3 mono 64–96 kbps; thoại 30 giây ≈ 120–180 KB. `preload="none"`
  nên không ảnh hưởng LCP hay First Load JS.
- **Kiểm chứng tự động:** bổ sung vào `scripts/verify-content.mjs` điều kiện "mọi mục
  trong `audio.json` phải có file thật trong `public/` và có `scriptVersion`".
- **Kiểm duyệt:** kịch bản audio lấy nguyên văn từ dữ liệu đã duyệt; sau khi tạo phải
  **nghe lại** để soát tên riêng và năm tháng (TTS có thể đọc sai "Nhà Rồng",
  "Vệ Quốc đoàn", "Nghệ An", "Versailles"…).

### 5.4 Pilot đã dựng

Để bạn nghe thử trong bối cảnh thật trước khi quyết định làm cả bộ:

| Clip | Nội dung | Thời lượng | Dung lượng | Đường dẫn |
|---|---|---|---|---|
| Giới thiệu trang | 5 mốc: 1890, 1911, 1919, 1930, 1945 | 42,4 giây | 331 KB (≈64 kbps) | `public/audio/gioi-thieu.mp3` |
| Mẫu trích dẫn | Nguyên văn thư gửi đồng bào Nam Bộ 1946 + đọc nguồn | 15,9 giây | 125 KB (≈64 kbps) | `public/audio/mau-nam-bo-1946.mp3` |

Cách dùng: hai nút nghe nằm ngay dưới mục lục ở đầu trang (khối "Nghe thay vì đọc —
bản thử nghiệm"). Cả hai đều `preload="none"`, không tự phát, phát xong tự dừng và
chỉ một clip phát tại một thời điểm.

Việc cần bạn quyết sau khi nghe:

1. **Giọng và tốc độ** đã ổn chưa (nhanh/chậm, giọng nam/nữ, có cần ngắt nghỉ nhiều hơn)?
2. **Phạm vi mở rộng**: chỉ A (nghe từng trích dẫn) · A + C (giới thiệu) · hay tới D
   (ôn tập bằng tai theo lộ trình 7 ngày)?
3. **Cách đọc số và tên riêng**: bản hiện tại đọc "ngày một tháng sáu năm một nghìn
   chín trăm bốn mươi sáu" — có muốn giữ cách này (rõ, dài) hay đọc tắt theo dạng số?
