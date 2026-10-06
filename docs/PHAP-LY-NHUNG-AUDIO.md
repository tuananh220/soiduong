# Nhúng thẳng audio/video tư liệu vào trang: có vi phạm gì không?

Tài liệu này trả lời câu hỏi "nếu nhúng thẳng vào trang thì có vi phạm gì không", kèm
căn cứ pháp lý và mẫu văn bản xin phép. **Đây là thông tin tham khảo, không phải tư vấn
pháp lý** — với dự án học tập, cách chắc chắn nhất là hỏi thẳng đơn vị lưu trữ (mẫu ở §5).

## 1. Trả lời ngắn

Có **bốn mức "nhúng"**, rủi ro khác nhau hoàn toàn. Nhầm giữa chúng là chỗ dễ vướng nhất:

| Mức | Cách làm | Rủi ro pháp lý | Kết luận |
|---|---|---|---|
| **1. Liên kết sâu** | Nút "Nghe tại kho lưu trữ ↗" mở tab mới | **Gần như bằng 0** — không sao chép, không truyền đạt lại | ✅ Đang dùng. Giữ nguyên |
| **2. Nhúng `iframe`** trang của họ | Nội dung vẫn nằm trên máy chủ của họ | **Thấp**, nhưng phụ thuộc điều khoản sử dụng + có thể bị chặn kỹ thuật | ⚠️ Nên xin phép trước |
| **3. Hotlink tệp** (`<audio src="…hochiminh.vn/…mp3">`) | Trình duyệt tải tệp từ máy chủ của họ | Trung bình: bản quyền có thể ổn với bản ghi cũ, nhưng **dùng băng thông/hạ tầng của họ mà chưa hỏi** | ⚠️ Không nên |
| **4. Tải về rồi host lại** (đưa vào `public/`) | Sao chép tệp sang máy chủ của mình | **Cao nhất**: là "sao chép" + "truyền đạt đến công chúng" | ❌ Không làm nếu chưa có văn bản đồng ý |

Điểm mấu chốt: **"nhúng" không đồng nghĩa với "sao chép"**. Mức 1 và 2 không tạo bản sao
nào; mức 3 và 4 có.

## 2. Căn cứ pháp lý

### 2.1 Ngoại lệ quyền tác giả — Điều 25 Luật SHTT (sửa đổi 2022, hiệu lực 1/1/2023)

Danh mục ngoại lệ là **danh mục đóng**: chỉ những hành vi được liệt kê mới không phải xin
phép. Hai điểm liên quan trực tiếp tới trang học tập:

- **Tự sao chép một bản** để nghiên cứu/học tập của **cá nhân**, không thương mại —
  nhưng quy định **không áp dụng khi sao chép bằng thiết bị sao chép**. Tức là ngoại lệ
  này dành cho việc học của một người, không dành cho việc phát hành lại.
- **Sử dụng hợp lý để minh họa trong bài giảng** (điểm c) — bao gồm cả việc cung cấp qua
  mạng, **nhưng chỉ trong "mạng máy tính nội bộ"** và phải có biện pháp kỹ thuật bảo đảm
  **chỉ người học, người dạy trong buổi học đó** truy cập được.

👉 Đây là chỗ quyết định: **một website công khai không phải "mạng máy tính nội bộ"**. Nếu
bạn đưa tệp lên trang public, bạn không nằm trong ngoại lệ giảng dạy — dù dự án phi thương
mại. (Nếu bạn nhúng trong LMS của trường, có đăng nhập, thì lại là câu chuyện khác.)

Mọi ngoại lệ đều kèm điều kiện: **phải ghi tên tác giả và nguồn gốc, xuất xứ**; không được
mâu thuẫn với việc khai thác bình thường và không gây thiệt hại bất hợp lý.

### 2.2 Thời hạn bảo hộ — Điều 27 và Điều 34

| Đối tượng | Thời hạn | Hệ quả cho tư liệu của chúng ta |
|---|---|---|
| Văn bản, bài nói của Bác (quyền tài sản) | Suốt cuộc đời tác giả + 50 năm. Bác mất 1969 → hết hạn 31/12/2019 | Phần **chữ** đã hết thời hạn bảo hộ về quyền tài sản |
| Quyền **nhân thân** (đứng tên, bảo vệ toàn vẹn) | **Vô thời hạn** | Dù hết hạn, **vẫn phải ghi đúng tên và không được cắt ghép sai ý** |
| Bản ghi âm (quyền liên quan của nhà sản xuất) | 50 năm tính từ năm tiếp theo năm công bố | Bản ghi 1946 → hết hạn 1996; bản ghi 1966 → 2016; bản cuối 1969 → 2019 |
| Chương trình phát sóng | 50 năm tính từ năm tiếp theo năm thực hiện | Các chương trình phát sóng cũ cũng đã hết hạn |
| Phim tài liệu (tác phẩm điện ảnh) | 75 năm từ khi công bố | Phim 1974 → còn tới **2049**; phim 1990 → còn tới **2065** |

👉 Nghĩa là: các **bản ghi âm tiếng nói** trong kho (1946–1969) nhiều khả năng đã hết thời
hạn bảo hộ về quyền liên quan; nhưng **phim tài liệu 1974 và 1990 thì còn bảo hộ** — nhóm
này rõ ràng phải xin phép nếu muốn sao chép. Đây là lý do mình tách `"kind": "audio"` và
`"kind": "video"` trong `data/audio-goc.json`.

### 2.3 Luật Lưu trữ — lớp nghĩa vụ thứ hai, hay bị bỏ quên

Hết hạn bản quyền **không** có nghĩa là muốn dùng thế nào cũng được. Tài liệu đang nằm
trong kho lưu trữ nhà nước chịu thêm quy định về khai thác, sử dụng:

- **Luật Lưu trữ số 33/2024/QH15** (hiệu lực 1/7/2025) thu gọn thành **2 hình thức** sử
  dụng tài liệu: phục vụ độc giả sử dụng tại chỗ, và **cấp bản sao tài liệu lưu trữ** —
  việc cấp bản sao thuộc thẩm quyền cho phép của cơ quan lưu trữ.
- Quy định khai thác của các Trung tâm Lưu trữ quốc gia yêu cầu: khi công bố, giới thiệu
  tài liệu, người sử dụng **phải trích dẫn nguồn cung cấp (số lưu văn bản, số hồ sơ, tên
  phông, cơ quan quản lý tài liệu)** và **tôn trọng tính nguyên văn**, đồng thời nộp phí
  khai thác theo quy định.

👉 Vì vậy, dù bản ghi đã hết hạn bản quyền, đường đi đúng vẫn là: **xin phép cơ quan lưu
trữ**, và khi được phép thì **ghi rõ nguồn theo mẫu của họ**.

### 2.4 Điều khoản của chính trang nguồn

Chân trang hochiminh.vn ghi rõ cơ quan chủ quản (Văn phòng Trung ương Đảng) và bản quyền
thuộc Cục Chuyển đổi số – Cơ yếu. Các cổng thông tin của cơ quan nhà nước thường yêu cầu
**ghi rõ nguồn khi phát hành lại thông tin** — nghĩa là việc trích dẫn lại được khuyến
khích, nhưng phải theo cách họ quy định, không phải theo cách mình tự chọn.

## 3. Vậy làm gì cho đúng?

**Giữ nguyên như hiện tại là phương án an toàn nhất và đã đủ tốt:** liên kết sâu, mở tab
mới, ghi rõ tên kho và cơ quan chủ quản, có ghi chú kiểm chứng cho từng mục. Không có bản
sao nào được tạo ra, nên không có gì để vi phạm.

Nếu vẫn muốn "trông như được nhúng ngay trong trang", đây là thứ tự nên làm:

1. **Xin phép bằng văn bản** (§5) — gửi Cục Chuyển đổi số – Cơ yếu (chủ quản hochiminh.vn),
   hoặc VOV / Bảo tàng Hồ Chí Minh nếu muốn dùng bản gốc. Nêu rõ: dự án học tập, phi
   thương mại, chỉ dùng trong trang, ghi nguồn đầy đủ, cam kết không chỉnh sửa nội dung.
2. **Được đồng ý thì mới nhúng.** Ưu tiên `iframe` trỏ tới trang của họ (không tạo bản sao)
   hơn là hotlink tệp, và tránh hẳn việc tải về host lại.
3. **Kiểm tra kỹ thuật trước khi hứa với người xem**: nếu trang của họ có `X-Frame-Options`
   hoặc `Content-Security-Policy: frame-ancestors` chặn, iframe sẽ trắng trơn. Phải thử thật
   trên môi trường triển khai, không chỉ trên máy mình.
4. **Nếu không xin được**: giữ liên kết + giữ **bản chữ (transcript)** trên trang. Bản chữ
   là hợp pháp (đã hết hạn quyền tài sản, và mình ghi đúng nguồn), lại còn tốt hơn về mặt
   tiếp cận: người khiếm thính, người đọc trên lớp, và máy tìm kiếm đều dùng được.

## 4. Ba quy tắc đang được mã hoá trong mã nguồn

Các quy tắc này không chỉ là ghi chú — `npm run verify:content` **chặn** nếu vi phạm:

1. `data/audio-goc.json` chỉ được trỏ tới nguồn chính thức (`hochiminh.vn`,
   `dangcongsan.vn`, `vov.vn`, `nhandan.vn`, `baotanghochiminh.vn`, hoặc `*.gov.vn`).
   Đã thử phá bằng cách trỏ sang youtube.com → script báo lỗi ngay.
2. **Không sao chép tệp gốc về** `public/` — chỉ có 2 clip thử nghiệm do mình tự tạo bằng
   giọng tổng hợp, và trên giao diện ghi rõ "không phải giọng Người".
3. Mỗi mục phải có `note`, và phải phân biệt `"voice": "giong-nguoi"` (tiếng nói của Người)
   với `"voice": "co-trich-doan"` (phim tài liệu có trích đoạn, phần còn lại là lời bình) —
   để không ai trích dẫn nhầm lời bình thành lời Bác.

## 5. Mẫu văn bản xin phép (điền vào là gửi được)

> **Kính gửi:** Cục Chuyển đổi số – Cơ yếu (đơn vị quản lý Trang thông tin điện tử
> hochiminh.vn) — hoặc đơn vị lưu trữ tương ứng.
>
> Em tên là …………, sinh viên lớp …………, Trường ……………………
>
> Em đang thực hiện dự án học tập **“Soi Đường”** — trang web học liệu tương tác phục vụ
> môn học Tư tưởng Hồ Chí Minh. Trang **không có mục đích thương mại**, không đặt quảng
> cáo, không thu phí, mã nguồn mở cho mục đích học tập.
>
> Trang hiện đang **liên kết** tới các tư liệu trong mục “Tư liệu Audio” và “Tư liệu
> video” trên hochiminh.vn. Em viết thư này để **xin phép được nhúng (embed) trực tiếp**
> các tư liệu sau vào trang, cụ thể là:
>
> 1. Bản ghi âm: ………………………… (ngày …/…/……)
> 2. Phim tài liệu: …………………………
>
> Nếu được chấp thuận, em xin cam kết:
> - Chỉ **nhúng** nội dung nguyên bản, **không tải về máy chủ của mình**, không chỉnh sửa,
>   không cắt ghép, không lồng tiếng thay thế.
> - Ghi rõ nguồn theo đúng yêu cầu của Quý cơ quan (ví dụ: *“Nguồn: hochiminh.vn — Văn
>   phòng Trung ương Đảng”*), kèm ngày truy cập.
> - Không sử dụng cho mục đích thương mại, không cấp lại cho bên thứ ba.
> - Gỡ bỏ ngay khi có yêu cầu của Quý cơ quan.
>
> Em rất mong nhận được hướng dẫn về thủ tục (kể cả trường hợp cần đăng ký khai thác, sử
> dụng tài liệu theo quy định của pháp luật về lưu trữ).
>
> Em xin chân thành cảm ơn.
>
> …………, ngày … tháng … năm ……
> ……………… (họ tên, email, điện thoại)

**Địa chỉ liên hệ gợi ý:** Cục Chuyển đổi số – Cơ yếu (cơ quan chủ quản hochiminh.vn);
Đài Tiếng nói Việt Nam (VOV) nếu dùng bản ghi do Đài thực hiện; Viện phim Việt Nam nếu dùng
thước phim tài liệu; Bảo tàng Hồ Chí Minh nếu dùng hiện vật, ảnh.
