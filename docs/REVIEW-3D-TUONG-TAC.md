# Review tương tác 3D — Soi Đường

Ngày rà soát: 06/10/2026 · Phạm vi: `Hero3D`, `GlobeSection`, `ThoughtLab3D`,
`GenZCards`, `QuoteGallery` (phần lật thẻ) và hạ tầng Canvas dùng chung.

Cách rà: đọc code hiện tại **và** kiểm tra hành vi thật của thư viện trong
`node_modules` (three, three-stdlib, @react-three/fiber, suspend-react) để phân
biệt lỗi thật với phỏng đoán.

## 1. Hiện trạng — đang có gì

| Khu vực | Tương tác hiện có | Đánh giá |
| --- | --- | --- |
| `Hero3D` (búa & liềm) | Parallax theo con trỏ + tự xoay quanh trục Z | Trên máy tính thì ổn; trên cảm ứng gần như tĩnh |
| `GlobeSection` | OrbitControls (xoay/zoom), chọn mốc bằng thẻ cờ hoặc danh sách, tự xoay, zoom ±, nút tập trung/toàn cảnh, autoplay 4 s | Nhiều đường điều khiển nhất, nhưng có bẫy cuộn trên di động |
| `ThoughtLab3D` (6 chuyên đề) | Kéo ngang để xoay, chạm để mở, tự xoay 7 s, phím ← →, nút chọn nhanh, nút tắt 3D, lưới tĩnh dự phòng | Phần tương tác tốt nhất; còn 3 điểm cần sửa |
| `GenZCards` | Thẻ nghiêng theo con trỏ (Pointer Events) | Nghiêng cả khi cuộn trên cảm ứng, không tôn trọng reduced-motion |
| `QuoteGallery` | Lật thẻ CSS 3D, lọc theo chuyên đề, chia sẻ/lưu | Lỗi HTML: nút lồng trong nút |

Điểm mạnh đã có: mọi khung 3D đều có nhánh dự phòng cho thiết bị không hỗ trợ
WebGL (`fallback` của `<Canvas>` / lưới tĩnh), `dpr={[1, 1.5]}`, `Suspense` có
trạng thái chờ bằng tiếng Việt, và phần chữ của mọi mục vẫn render tĩnh nên vẫn
đọc được nếu 3D hỏng.

## 2. Phát hiện cụ thể

### P0 — Trang có thể hỏng hẳn khi CDN texture lỗi

`GlobeSection.tsx` nạp 4 texture địa cầu từ `threejs.org` (dòng 15, 17, 19, 21)
qua `useLoader(TextureLoader, …)` (dòng 158–161). Trong R3F, `useLoader` chạy qua
`suspend-react`; khi promise bị reject, thư viện **ném lỗi ngay trong render phase**
để "bubble vào error-boundary" (xem `node_modules/suspend-react/index.js`).

`GlobeSection` **không có ErrorBoundary** nào, cũng không có `errorElement`. Hệ quả:
nếu mạng chặn/không tải được `threejs.org` (một số mạng di động, wifi công cộng,
hoặc CDN tạm lỗi), lỗi sẽ lan lên error boundary của Next → **cả trang một-page
hiển thị màn hình lỗi**, mất toàn bộ nội dung đã kiểm duyệt. Đây là rủi ro cao
nhất vì trang phụ thuộc một tên miền bên ngoài chỉ để lấy ảnh nền quả cầu.

Hướng xử lý: (a) thêm ErrorBoundary quanh phần Canvas địa cầu với nhánh dự phòng
"danh sách mốc thời gian" đã có sẵn, và (b) tự host 4 texture trong `/public`
(hoặc sinh texture bằng Canvas 2D) để bỏ hẳn phụ thuộc ngoài.

### P1 — Bẫy cuộn trên di động ở khung địa cầu

`three-stdlib/controls/OrbitControls.js:300` đặt `domElement.style.touchAction = "none"`
("disable touch scroll"), và drei dùng đúng lớp này. Khung địa cầu cao
360–480 px nằm giữa trang, nên khi người dùng đặt ngón tay vào đó và vuốt lên,
**trang không cuộn** — cảm giác như web bị "đơ". Đây là lỗi trải nghiệm phổ biến
nhất của các trang có OrbitControls.

Hướng xử lý: cho container nhận `touch-action: pan-y` và chỉ bật xoay khi người
dùng chủ động (nút "Bật xoay", hoặc chạm-giữ 150 ms rồi mới bật `enableRotate`);
cách này giữ được cả cuộn dọc lẫn xoay quả cầu.

### P1 — Ba canvas render liên tục 60 fps kể cả khi đã cuộn qua

Không component nào đặt `frameloop` (mặc định `"always"` của R3F), nên `Hero3D`,
`GlobeSection` và `ThoughtLab3D` đều vẽ lại mỗi khung hình dù người dùng đang ở
cuối trang. Trên điện thoại tầm trung, đây là nguyên nhân tốn pin và giật khi cuộn.

Hướng xử lý: `IntersectionObserver` cho từng khung, đặt `frameloop={inView ? "always" : "never"}`
(R3F hỗ trợ đổi prop này động), kèm `performance={{ min: 0.5 }}` để tự hạ chất lượng
khi khung hình tụt.

### P1 — `ThoughtLab3D` bị tháo ra rồi dựng lại khi cuộn

`ThoughtSection.tsx:508` dùng `useInView(labRef, { margin: "320px 0px" })` **không**
có `once: true`, và dòng 620 chỉ gắn `<ThoughtLab3D>` khi `labInView` đúng. Nghĩa là
mỗi lần cuộn qua lại, React gỡ Canvas (mất WebGL context) rồi dựng lại kèm **vẽ lại
6 texture 600×820** — vừa tốn thời gian, vừa tạo/nhả WebGL context liên tục (trên
iOS, vượt hạn mức context sẽ khiến canvas khác bị "mất ngữ cảnh").

Hướng xử lý: gắn một lần rồi giữ (sticky mount) + chỉ tạm dừng render theo mục P1
phía trên; chỉ dựng lại texture khi đổi font hoặc đổi dữ liệu.

### P1 — Autoplay đổi nội dung trong lúc người dùng đang đọc

Bảng chi tiết của `ThoughtSection` khá dài (đoạn tóm tắt + 4–5 gạch đầu dòng +
3–4 trích dẫn kèm nguồn), nhưng autoplay ở `ThoughtSection.tsx:534–539` cứ **7 giây**
đổi chuyên đề một lần và chỉ tạm dừng khi người dùng bấm chọn. Người đang đọc bị
"giật" nội dung, nhất là khi con trỏ/khoá focus đang ở cột chi tiết.

Hướng xử lý: tạm dừng khi rê chuột vào khu vực chi tiết, khi có focus bàn phím
trong đó, và khi `document.hidden`; đồng thời **mặc định tắt autoplay khi OS bật
`prefers-reduced-motion`** (hiện `useReducedMotion` chỉ được dùng trong khung 3D,
không dùng cho autoplay).

### P2 — `Hero3D` gần như không tương tác trên cảm ứng

Tương tác duy nhất là parallax theo `useThree().pointer` (`Hero3D.tsx:11–18`). Trên
thiết bị cảm ứng, `pointer` không đổi khi người dùng không di chuột ⇒ ngoài vòng
xoay Z, khối búa & liềm đứng yên. Khung này cũng thiếu `fallback` (hai khung còn lại
đều có).

Hướng xử lý: kéo để xoay theo quán tính (dùng lại logic kéo của `ThoughtLab3D`),
chạm để bật một nhịp sáng nhẹ; thêm nhánh dự phòng là huy hiệu SVG/CSS.

### P2 — Thẻ nghiêng ở nơi không nên nghiêng

`GenZCards.tsx` xử lý `onPointerMove` mà không kiểm tra thiết bị hay chế độ giảm
chuyển động: (a) khi cuộn bằng ngón tay, thẻ vẫn nghiêng theo hướng vuốt; (b) khi
OS bật `prefers-reduced-motion`, hiệu ứng nghiêng vẫn chạy.

Hướng xử lý: chỉ bật nghiêng khi `matchMedia("(hover: hover) and (pointer: fine)")`
đúng và bỏ qua khi `useReducedMotion()` là true.

### P2 — Lỗi HTML/trợ năng ở thẻ trích dẫn

`QuoteGallery.tsx`: cả thẻ là một `<button>` (dòng 39–139) nhưng bên trong lại có
hai `<span role="button">` (dòng 78, 96) cho "Chia sẻ" và "Lưu sổ tay". Nút lồng
trong nút là HTML không hợp lệ và làm trình đọc màn hình khó xác định hành động.

Hướng xử lý: đổi thẻ lật thành `<div>` với nút lật riêng phủ nền, hai nút hành động
là phần tử anh em (sibling); thêm `-webkit-backface-visibility` cho iOS cũ.

### P2 — Thiếu thông báo cho trình đọc màn hình khi nội dung 3D đổi

Khi người dùng xoay vòng chuyên đề hoặc autoplay chuyển mốc, chỉ có chữ trên màn
hình thay đổi, không có vùng `aria-live` nào thông báo. Người dùng trình đọc màn
hình không biết nội dung vừa đổi.

Hướng xử lý: thêm `<p aria-live="polite">` tóm tắt ("Đang xem chuyên đề 3/6: …")
ở cả `ThoughtSection` và `GlobeSection`.

### P3 — Chi tiết nhỏ, dễ làm

- Vòng xoay chuyên đề chưa nhận `wheel`/trackpad ngang; `handlePointerMove`
  (`ThoughtLab3D.tsx:447`) chưa `setPointerCapture` nên kéo ra ngoài vùng là dừng.
- Marker trên địa cầu có bán kính chạm 0.12 đơn vị thế giới — hơi nhỏ cho ngón tay;
  nên tăng lên ~0.18 khi thiết bị cảm ứng.
- `Stars` (900 ngôi sao) và `Sparkles` vẫn chạy khi `prefers-reduced-motion`; nên
  giảm hoặc đứng yên hoàn toàn.
- Nên có một công tắc "giảm hiệu ứng" chung trong trang (hiện chỉ có nút tắt 3D ở
  mục Tư tưởng), tiện cho cả người dùng máy yếu lẫn người dị ứng chuyển động.

## 3. Đề xuất theo thứ tự ưu tiên

| # | Việc | Vì sao trước | Công sức |
| --- | --- | --- | --- |
| 1 | ErrorBoundary + tự host texture địa cầu | Chặn kịch bản cả trang trắng vì một CDN bên ngoài | ~1–2 giờ |
| 2 | Sửa bẫy cuộn OrbitControls trên di động | Ảnh hưởng trực tiếp phần lớn người xem (điện thoại) | ~1 giờ |
| 3 | `frameloop` theo tầm nhìn + mount một lần cho lab | Pin, độ mượt cuộn, ổn định WebGL trên iOS | ~1–2 giờ |
| 4 | Autoplay thông minh (hover/focus/hidden/reduced-motion) | Bảo vệ trải nghiệm đọc — vấn đề người dùng cảm nhận rõ nhất | ~1 giờ |
| 5 | Tương tác cho `Hero3D` (kéo xoay + tap) + fallback | Biến khung mở đầu thành tương tác thật trên di động | ~2 giờ |
| 6 | Tilt đúng đối tượng + tôn trọng reduced-motion | Sửa hành vi sai trên cảm ứng | ~30 phút |
| 7 | Sửa cấu trúc nút trong `QuoteGallery` | Tính hợp lệ HTML + trợ năng | ~45 phút |
| 8 | `aria-live` cho nội dung 3D đổi | Trợ năng cho trình đọc màn hình | ~30 phút |
| 9 | Công tắc "giảm hiệu ứng" chung + chi tiết P3 | Hoàn thiện, chi phí thấp | ~1 giờ |

Gợi ý triển khai: làm **1–4** trong một đợt (đều là sửa nền tảng, không đổi thiết
kế), sau đó **5–7** (nâng cấp tương tác), cuối cùng **8–9** (trợ năng và tinh chỉnh).

## 4. Ghi chú kiểm chứng

- `three-stdlib/controls/OrbitControls.js:300` — `scope.domElement.style.touchAction = "none"`.
- `suspend-react/index.js` — "Store caught errors, they will be thrown in the
  render-phase to bubble into an error-boundary".
- `@react-three/fiber` không đặt `touch-action` cho canvas của chính nó; nguyên
  nhân bẫy cuộn nằm ở OrbitControls, không phải ở R3F.
- Không set `frameloop` ở bất kỳ `<Canvas>` nào trong dự án (đã grep toàn bộ
  `components/`).
