# Kịch bản thuyết trình — Website "Soi Đường"
### Môn: Tư tưởng Hồ Chí Minh · Sản phẩm học liệu số

> File slide đi kèm: **`Soi-Duong-bao-cao-tu-tuong-HCM.pptx`** (18 slide).
> Toàn bộ lời thoại bên dưới cũng đã được nhúng sẵn vào **Notes** của từng slide —
> mở PowerPoint → *View → Notes Page*, hoặc bấm *Presenter View* khi trình chiếu
> là thấy lời thoại ngay bên cạnh slide.

---

## 1. Thông tin nhanh

| Mục | Chi tiết |
|---|---|
| Thời lượng chuẩn | **18 phút nói + 3–5 phút hỏi đáp** |
| Thời lượng rút gọn | **5 phút** (xem mục 6) |
| Số slide | 18 |
| Phần cần demo | Slide 17 → mở website thật trên trình duyệt |
| Người trình bày | `[Họ và tên]` · Lớp `[...]` · MSSV `[...]` |

**Bố cục thời gian**

| Slide | Nội dung | Phút | Luỹ kế |
|---|---|---|---|
| 1 | Bìa — giới thiệu | 0:40 | 0:40 |
| 2 | Vấn đề đặt ra | 1:30 | 2:10 |
| 3 | Ý tưởng chủ đạo | 1:10 | 3:20 |
| 4 | Cấu trúc 4 trạm | 1:00 | 4:20 |
| 5 | Quả địa cầu 3D | 1:40 | 6:00 |
| 6 | Bảng 13 mốc | 1:00 | 7:00 |
| 7 | Bên trong một mốc (1930) | 1:10 | 8:10 |
| 8 | Góc Gen Z — 3 thẻ | 1:10 | 9:20 |
| 9 | Cần – Kiệm – Liêm – Chính | 1:00 | 10:20 |
| 10 | Quiz 5 tình huống | 1:00 | 11:20 |
| 11 | Trích dẫn lật thẻ | 0:40 | 12:00 |
| 12 | Công nghệ | 1:00 | 13:00 |
| 13 | Kiến trúc data-driven | 0:50 | 13:50 |
| 14 | Trải nghiệm & tiếp cận | 0:50 | 14:40 |
| 15 | Trung thực tư liệu | 1:00 | 15:40 |
| 16 | Hạn chế & hướng phát triển | 0:50 | 16:30 |
| 17 | **Demo trực tiếp** | 1:30 | 18:00 |
| 18 | Kết luận & cảm ơn | 1:00 | 19:00 |

---

## 2. Checklist trước giờ thuyết trình

- [ ] Mở sẵn website ở một tab riêng, **phóng to trình duyệt 110–125%** (Ctrl +).
- [ ] **Cần mạng internet**: quả địa cầu tải texture Trái Đất từ `threejs.org`,
      ảnh tư liệu tải từ Wikimedia Commons. Mất mạng thì quả địa cầu và ảnh có thể
      không hiện — các phần còn lại (thẻ bài học, quiz, trích dẫn) vẫn chạy bình
      thường vì dữ liệu nằm trong file JSON cục bộ.
- [ ] Chạy website từ trước, **không chạy `npm install` ngay trên bục** (mất 20–30 giây
      và dễ lỗi trước đám đông): `npm install` một lần ở nhà → `npm run dev` → mở
      `http://localhost:3000`.
- [ ] Tắt thông báo (Zalo/Messenger/mail), tắt các tab không liên quan.
- [ ] Mở file `.pptx` **trước** khi cắm máy chiếu để PowerPoint kịp nạp font
      (slide dùng Georgia + Segoe UI, đều có sẵn trên Windows/Mac).
- [ ] Thử **Presenter View** (Alt+F5) để thấy lời thoại ở màn hình của mình.
- [ ] Chuẩn bị phương án dự phòng: nếu máy chiếu không chạy được website,
      cứ thuyết trình theo slide 5–11 (đã mô tả đầy đủ từng tính năng).

---

## 3. Kịch bản chi tiết theo slide

### Slide 1 — Bìa  `0:00 → 0:40`

> Kính thưa thầy/cô `[tên giảng viên]` và các bạn,
>
> Em là `[họ tên]`, lớp `[lớp]`. Hôm nay em xin trình bày một sản phẩm học liệu số
> mà em đã tự xây dựng cho môn Tư tưởng Hồ Chí Minh: website có tên là **"Soi Đường"**.
>
> Ý tưởng rất ngắn gọn: thay vì chỉ đọc giáo trình, em thử trả lời một câu hỏi —
> nếu tư tưởng Hồ Chí Minh được trình bày bằng ngôn ngữ của một website hiện đại,
> có 3D, có tương tác, có câu hỏi tình huống, thì người trẻ hôm nay sẽ tiếp cận nó
> khác đi như thế nào?
>
> Trong khoảng mười lăm phút, em sẽ đi qua: vì sao làm, website có gì, công nghệ ra
> sao, và quan trọng nhất là những bài học tư tưởng nào được chuyển hoá thành hành
> vi cụ thể cho sinh viên. Cuối bài em sẽ demo trực tiếp trên trình duyệt.

**Việc tay:** đứng yên, nhìn thầy/cô khi nói câu chào; chỉ bấm chuyển slide sau khi
nói xong câu cuối.

---

### Slide 2 — Vấn đề đặt ra  `0:40 → 2:10`

> Trước khi nói về công nghệ, em xin nói về lý do.
>
> Em quan sát ba điều. **Thứ nhất**, giáo trình môn Tư tưởng Hồ Chí Minh có sáu
> chương, rất hệ thống về khái niệm, về cơ sở hình thành, về các nội dung tư tưởng.
> Nó cần thiết, nhưng với sinh viên năm nhất, năm hai thì khoảng cách giữa trang
> sách và đời sống khá xa.
>
> **Thứ hai**, cách học phổ biến là học để làm bài kiểm tra. Ít ai tự hỏi: "vậy mai
> mình dùng tư tưởng này vào việc gì?".
>
> **Thứ ba**, thế hệ chúng em tiếp nhận thông tin theo cách rất khác: trực quan, có
> tương tác, có phản hồi ngay lập tức.
>
> Từ đó em đặt một câu hỏi nghiên cứu rất cụ thể, nằm ở khung bên phải: làm thế nào
> để chuyển giá trị cốt lõi của tư tưởng Hồ Chí Minh thành một trải nghiệm mà người
> trẻ **chủ động khám phá**, chứ không phải bị động tiếp nhận.
>
> Và em muốn nhấn mạnh ngay từ đầu: website này **không thay giáo trình**. Nó là một
> "lối vào" khác, để sau khi xem xong, người học quay lại giáo trình với câu hỏi rõ
> ràng hơn.

**Việc tay:** khi nói "câu hỏi nghiên cứu", đưa tay về khung màu be bên phải.

---

### Slide 3 — Ý tưởng chủ đạo  `2:10 → 3:20`

> Câu định vị nằm ngay trên trang chủ, em xin đọc nguyên văn: *"Không phải sáu chương
> giáo trình dàn trải — mà là những giá trị cốt lõi, được kể lại theo cách một người
> trẻ hôm nay có thể mang vào đời sống của mình."*
>
> Từ câu đó, em đặt ra ba nguyên tắc thiết kế.
>
> **Một là chọn lọc, không dàn trải.** Em không kể lại toàn bộ tiểu sử. Em chọn mười
> ba mốc tiêu biểu, và mỗi mốc phải rút ra được một bài học có thể hành động.
>
> **Hai là một khung nhất quán:** lịch sử, rồi bài học, rồi việc hôm nay. Người học đi
> từ sự kiện thật, đến ý nghĩa của nó, đến một gợi ý áp dụng, và cuối cùng là ghi chú
> về tư liệu.
>
> **Ba là tư tưởng là để thực hành.** Nên phần cuối website không phải những câu danh
> ngôn để ngắm, mà là các tình huống buộc người học phải chọn — và thấy ngay hệ quả
> của lựa chọn đó.

---

### Slide 4 — Cấu trúc 4 trạm  `3:20 → 4:20`

> Về cấu trúc, toàn bộ website là một trang duy nhất, chia thành bốn "trạm", được sắp
> theo một dụng ý sư phạm chứ không phải ngẫu nhiên.
>
> **Trạm một là Hành trình:** quả địa cầu ba chiều với mười ba mốc lịch sử. Nhiệm vụ
> của nó là tạo cảm xúc và bối cảnh.
>
> **Trạm hai là Góc Gen Z:** ba thẻ bài học chuyển tư tưởng thành thói quen. Đây là
> phần tri thức vận dụng.
>
> **Trạm ba là Trạm thách thức:** năm câu hỏi tình huống có giải thích. Ở đây người
> học phải ra quyết định.
>
> **Trạm bốn là bộ sưu tập trích dẫn:** bốn thẻ lật ba chiều, mặt trước là câu nói,
> mặt sau là nguồn và bài học. Đây là phần chiêm nghiệm, để người học giữ lại một
> điều gì đó.
>
> Bốn trạm này tạo một đường đi: **cảm xúc → tri thức → ra quyết định → chiêm nghiệm**.

**Nhấn mạnh:** câu cuối là "câu ăn điểm" của slide này — nói chậm lại.

---

### Slide 5 — Quả địa cầu 3D  `4:20 → 6:00`

> Đây là phần em tâm đắc nhất và cũng là phần em sẽ demo kỹ.
>
> Một quả địa cầu ba chiều, tự xoay, và cứ **bốn giây** thì tự chuyển sang mốc tiếp
> theo. Em cố tình làm tính năng tự chạy này, vì khi trình chiếu trên lớp, thầy cô và
> các bạn vẫn theo dõi được mà em không phải bấm liên tục.
>
> Trên quả địa cầu có **mười ba cột cờ đỏ sao vàng**, được đặt đúng toạ độ địa lý thật
> của từng địa danh — từ Kim Liên, Bến Nhà Rồng, Versailles, Tours, Quảng Châu, Hồng
> Kông, Pác Bó, đến Ba Đình, Điện Biên Phủ. Người xem thấy ngay một điều rất trực
> quan: hành trình của Bác là một hành trình vòng quanh thế giới, chứ không nằm gọn
> trong một địa phương.
>
> Người học có thể lọc theo **tám giai đoạn**, kéo xoay, phóng to, bấm "Tập trung mốc"
> hoặc "Toàn cảnh". Mỗi khi chạm vào một mốc, quả địa cầu tự tạm dừng ba giây rưỡi để
> đọc.
>
> Mỗi mốc có **ảnh tư liệu từ Wikimedia Commons**, kèm chú thích và ghi chú nguồn. Nếu
> ảnh không tải được, giao diện tự hiện một khung dự phòng và phần chữ vẫn đọc được
> bình thường.
>
> *Lưu ý nhỏ:* hình bên trái là sơ đồ minh hoạ do em vẽ lại, không phải ảnh chụp màn
> hình — phần thật em sẽ demo ở cuối bài.

**Thành thật ngay từ đầu** về việc hình chỉ là sơ đồ: tạo độ tin cậy cho cả phần còn
lại của bài.

---

### Slide 6 — Bảng 13 mốc  `6:00 → 7:00`

> Đây là toàn bộ mười ba mốc trên website, từ năm 1890 ở Kim Liên đến năm 1990, kỷ niệm
> một trăm năm ngày sinh của Người.
>
> Em xin phép không đọc hết, chỉ nhấn mạnh **cách chọn**: mỗi mốc phải rút ra được một
> bài học viết bằng ngôn ngữ của hôm nay. Ví dụ năm 1911 ở Bến Nhà Rồng, bài học là
> *"dấn thân và bước ra vùng an toàn"*. Năm 1930 ở Hồng Kông là *"tổ chức và tìm điểm
> chung"*. Năm 1954 ở Điện Biên Phủ là *"kiên định mục tiêu và phát huy sức dân"*.
>
> Tức là lịch sử vẫn được giữ đúng, nhưng đầu ra của nó là một **kỹ năng sống**. Đó
> chính là cách em hiểu câu "tư tưởng là kim chỉ nam": kim chỉ nam thì phải chỉ được
> hướng cho một quyết định cụ thể.

---

### Slide 7 — Bên trong một mốc (1930)  `7:00 → 8:10`

> Em xin phóng to một mốc để thầy cô thấy cấu trúc bên trong. Đây là mốc **năm 1930 tại
> Hồng Kông**.
>
> Mục **"Sự kiện"** ghi đúng lịch sử: đầu năm 1930, Nguyễn Ái Quốc chủ trì hội nghị hợp
> nhất các tổ chức cộng sản, dẫn tới sự ra đời của Đảng Cộng sản Việt Nam.
>
> Mục **"Vì sao quan trọng"** nâng lên thành nguyên lý: một mục tiêu chung chỉ trở
> thành sức mạnh khi được chuyển thành tổ chức, nguyên tắc phối hợp và trách nhiệm cụ
> thể.
>
> Và mục **"Gợi ý hôm nay"** hạ xuống đời sống sinh viên: đoàn kết không có nghĩa là xoá
> khác biệt; một nhóm làm việc tốt cần mục tiêu chung, nguyên tắc trao đổi và một người
> chịu trách nhiệm kết nối các góc nhìn.
>
> Điểm em muốn thầy cô chú ý là khung nhỏ bên trái: **"Ghi chú tư liệu"**. Ở đó website
> ghi rõ mốc tổ chức là tháng Hai năm 1930, hội nghị diễn ra tại khu vực Cửu Long, Hồng
> Kông. Mọi mốc trong mười ba mốc đều có dòng ghi chú như vậy.

---

### Slide 8 — Góc Gen Z: 3 thẻ  `8:10 → 9:20`

> Sang trạm thứ hai: **Góc Gen Z**, với ba thẻ bài học. Đây là phần em cho là "chất"
> nhất về mặt tư tưởng, vì nó làm đúng việc chuyển hoá.
>
> **Thẻ thứ nhất: "Dĩ bất biến, ứng vạn biến" thời 4.0.** Cái bất biến ở đây là giá trị
> nghề nghiệp cốt lõi và năng lực tư duy độc lập; cái vạn biến là công cụ — hôm nay là
> AI, ngày mai là thứ khác.
>
> **Thẻ thứ hai: Cần – Kiệm – Liêm – Chính thời Gen Z.** Bốn chữ rất quen, nhưng em
> diễn dịch lại thành bốn thói quen rất mới.
>
> **Thẻ thứ ba: Tự học theo chân Bác** — không chờ một môi trường lý tưởng, mà chủ động
> biến hoàn cảnh thành bài học.
>
> Về giao diện, ba thẻ này nghiêng ba chiều theo con trỏ chuột và có nút "Đọc thêm" để
> mở phần phân tích. Em làm vậy vì không muốn bắt người đọc nuốt một khối chữ ngay từ
> đầu.

---

### Slide 9 — Cần – Kiệm – Liêm – Chính  `9:20 → 10:20`

> Em xin đi sâu vào thẻ thứ hai, vì đây là chỗ tư tưởng chạm vào đời sống số rõ nhất.
>
> **Cần**, em hiểu là kỷ luật với thời gian. Trong thời đại mà thuật toán mạng xã hội
> được thiết kế để giữ chân mình, thì tự chủ được thời gian biểu đã là một hình thức
> của chữ Cần.
>
> **Kiệm** là chi tiêu có kế hoạch, không chạy theo áp lực tiêu dùng.
>
> **Liêm**, em chuyển thành tôn trọng bản quyền nội dung số: ghi nguồn, xin phép, không
> xào lại bài của người khác rồi nhận là của mình.
>
> **Chính** là giữ sự tử tế một cách nhất quán, kể cả khi mình đang ẩn danh sau màn hình.
>
> Em chọn bốn chữ này vì đây là bộ giá trị đạo đức ngắn nhất, dễ nhớ nhất, và cũng dễ
> kiểm tra nhất: cuối ngày mình tự hỏi là biết ngay hôm nay mình có sống đúng bốn chữ
> đó hay không.

---

### Slide 10 — Quiz 5 tình huống  `10:20 → 11:20`

> Trạm thứ ba là phần em nghĩ sẽ khiến lớp tham gia nhiều nhất: **năm câu hỏi tình huống**.
>
> Ví dụ câu một: bạn vừa mất một cơ hội việc làm mơ ước vì thiếu một kỹ năng nhỏ — bạn
> làm gì? Đáp án đúng là xác định đúng kỹ năng còn thiếu và tự học trong ba mươi ngày
> tới. Phần giải thích nhắc rằng Bác từng tự học tiếng Anh, tiếng Pháp, tiếng Nga ngay
> trong lúc làm những công việc chân tay vất vả nhất.
>
> Câu em thích nhất là **câu năm**, rất thời sự: AI có thể viết giúp bạn gần như trọn
> vẹn một bài luận, vậy theo tinh thần "dĩ bất biến, ứng vạn biến" thì nên làm gì? Đáp
> án không phải là dùng AI rồi nộp nguyên văn, cũng không phải tẩy chay AI, mà là **dùng
> AI như công cụ hỗ trợ nhưng tự mình tư duy, kiểm chứng và chịu trách nhiệm với nội
> dung cuối cùng**.
>
> Điểm quan trọng về mặt sư phạm: không câu nào chỉ nói "đúng" hay "sai". Câu nào cũng
> có phần giải thích nối về một sự kiện lịch sử hoặc một giá trị cụ thể.

---

### Slide 11 — Trích dẫn lật thẻ  `11:20 → 12:00`

> Phần cuối cùng của website là **bốn thẻ trích dẫn**, thiết kế theo kiểu thẻ lật ba
> chiều. Mặt trước là câu nói, ví dụ: *"Không có việc gì khó, chỉ sợ lòng không bền"*,
> hoặc *"Học hỏi là một việc phải tiếp tục suốt đời"*, hay câu về đại đoàn kết.
>
> Khi lật ra mặt sau, người xem thấy hai thứ: **nguồn** của câu nói — ví dụ thơ tặng
> thanh niên xung phong năm 1950, hay thư gửi học viên trường Nguyễn Ái Quốc năm 1949 —
> và một đoạn **bài học ứng dụng**.
>
> Có cả nút "Chia sẻ / Lưu câu nói": trên điện thoại thì mở hộp chia sẻ của hệ điều hành,
> trên máy tính thì chép vào clipboard. Mục đích rất thực dụng: để một câu nói hay có
> thể đi tiếp ra khỏi trang web, vào story hoặc vào nhóm lớp.

---

### Slide 12 — Công nghệ  `12:00 → 13:00`

> Về phần kỹ thuật, em xin trình bày nhanh vì trọng tâm của môn học là tư tưởng.
>
> Website dựng bằng **Next.js 14** với App Router, **React 18** và **TypeScript**. Đồ hoạ
> ba chiều dùng **three.js** kết hợp **React Three Fiber**. Chuyển động dùng **Framer
> Motion**. Giao diện dùng **Tailwind CSS** với một bảng màu riêng: đỏ đô, kem, vàng
> gold và than — gợi cảm giác trang trọng, không giống một trang giải trí.
>
> Điểm em muốn nhấn mạnh là **toàn bộ đều là mã nguồn mở, miễn phí**, nên bất kỳ trường
> nào cũng có thể nhân bản mô hình này.
>
> Còn khung bên phải trả lời một câu hỏi kỹ thuật: vì sao không dùng Spline — một công
> cụ làm 3D kéo thả rất phổ biến? Vì em dựng quả địa cầu và biểu tượng bằng **hình học
> thủ tục** ngay trong code. Lợi thế là không phụ thuộc asset bên ngoài, không cần API
> key, không lo link hết hạn sau hai năm, và tải nhẹ hơn.

---

### Slide 13 — Kiến trúc data-driven  `13:00 → 13:50`

> Về cách tổ chức mã nguồn, em **tách nội dung ra khỏi giao diện**.
>
> Bên trái là cây thư mục. Toàn bộ chữ nghĩa, mốc lịch sử, câu hỏi, trích dẫn đều nằm
> trong bốn file JSON ở thư mục `data`. Các file component chỉ lo hiển thị.
>
> Điều đó có nghĩa là: muốn thêm một mốc lịch sử mới, em chỉ cần thêm một khối JSON,
> không phải đụng vào giao diện. Mỗi mốc là một cấu trúc **mười bốn trường** — năm, giai
> đoạn, địa danh, toạ độ, bài học, bối cảnh, ý nghĩa, gợi ý hôm nay, ghi chú nguồn, và
> ảnh kèm chú thích.
>
> Em muốn nhấn mạnh ý nghĩa sư phạm của việc này: **đây là một dự án có thể tiếp quản**.
> Một nhóm sinh viên khoá sau hoàn toàn có thể bổ sung mốc, chỉnh lại lời khuyên cho hợp
> với bối cảnh mới, mà không cần biết lập trình ba chiều.

---

### Slide 14 — Trải nghiệm & tiếp cận  `13:50 → 14:40`

> Phần này em nói ngắn, nhưng em coi đây là tiêu chí đánh giá một sản phẩm học liệu
> **có trách nhiệm**.
>
> **Thứ nhất**, tôn trọng người nhạy cảm với chuyển động: nếu hệ điều hành đang bật chế
> độ giảm chuyển động, toàn bộ animation tự tắt, quả địa cầu ngừng tự xoay.
>
> **Thứ hai**, hiệu năng: em giới hạn độ phân giải render, thu nhỏ Canvas trên điện
> thoại, và tải ảnh theo kiểu lazy để máy yếu vẫn chạy được — vì em biết không phải bạn
> nào trong lớp cũng có laptop mạnh.
>
> **Thứ ba**, hai cảnh ba chiều nặng được nạp động và chỉ render ở trình duyệt, nên trang
> vẫn hiện chữ ngay lập tức.
>
> **Thứ tư**, mọi nút đều có khung focus và nhãn `aria`, nghĩa là người dùng bàn phím
> hoặc công cụ đọc màn hình vẫn thao tác được.
>
> **Thứ năm**, nếu ảnh tư liệu không tải được, website tự thay bằng một khung thông báo
> chứ không hiện biểu tượng ảnh vỡ.

---

### Slide 15 — Trung thực tư liệu  `14:40 → 15:40`  ⭐ *slide quan trọng nhất về mặt học thuật*

> Phần này em xin phép nói chậm hơn một chút, vì em nghĩ đây là chỗ một sản phẩm về tư
> tưởng Hồ Chí Minh **dễ mắc lỗi nhất**: gán cho Bác những câu nói không có thật, hoặc
> trích dẫn sai nguồn.
>
> Ngay trên trang chủ, em đặt một khung **"Ghi chú lịch sử"**, nói rõ rằng một số câu nói
> và bài học ở đây được rút ra từ tư tưởng, lời nói và hành động của Người, và không phải
> lúc nào cũng là trích dẫn nguyên văn.
>
> Cụ thể hơn: mỗi mốc đều có dòng **"Ghi chú tư liệu"** ghi rõ mốc thời gian và địa điểm
> được ghi nhận. Bốn câu trích dẫn đều có nguồn cụ thể — thơ tặng thanh niên xung phong
> năm 1950, thư gửi học viên trường Nguyễn Ái Quốc năm 1949, diễn văn năm 1961. Ảnh tư
> liệu đều lấy từ Wikimedia Commons và có chú thích.
>
> Và cuối cùng, em xin **tự nhận giới hạn**: đây là sản phẩm học liệu của một sinh viên.
> Phần "gợi ý hôm nay" là cách diễn giải của em. Em rất mong nhận được góp ý của thầy cô
> để phần đó bám sát giáo trình hơn.

---

### Slide 16 — Hạn chế & hướng phát triển  `15:40 → 16:30`

> Em xin trình bày thẳng thắn phần hạn chế, vì em nghĩ một báo cáo học thuật cần phần này.
>
> **Thứ nhất**, em chưa đối chiếu một cách tường minh mốc nào ứng với chương nào trong
> giáo trình. **Thứ hai**, phần "gợi ý hôm nay" là diễn giải của cá nhân em, chưa qua
> phản biện. **Thứ ba**, cảnh 3D và ảnh tư liệu vẫn phụ thuộc nguồn ngoài, mạng yếu thì
> quả địa cầu có thể không hiện. **Thứ tư**, chưa có bản tiếng Anh. Và **thứ năm** — quan
> trọng nhất — em chưa có số liệu về hiệu quả, vì chưa khảo sát người học trước và sau
> khi dùng.
>
> Về hướng phát triển: em muốn thêm trang chi tiết theo từng chương để bám sát sáu chương
> giáo trình; cho phép xuất ảnh wallpaper từ thẻ trích dẫn; bổ sung một chế độ dành riêng
> cho giảng viên để chiếu theo giáo án; và quan trọng là khảo sát thử ở một hai lớp để có
> số liệu thật.

---

### Slide 17 — Demo trực tiếp  `16:30 → 18:00`

*(Chuyển sang tab trình duyệt đã mở sẵn. Chi tiết từng cú bấm ở mục 4.)*

> Bây giờ em xin phép chuyển sang demo trực tiếp.
>
> **Trang chủ:** em di chuột để mọi người thấy biểu tượng búa – liềm xoay theo con trỏ.
> Đây là biểu tượng của giai cấp công nhân và nông dân, cũng là hình ảnh mở đầu cho toàn
> bộ hành trình.
>
> **Quả địa cầu:** em để nó tự chạy hai, ba mốc. Mọi người thấy nó tự chuyển và phần
> thông tin bên phải tự cập nhật. Bây giờ em lọc theo giai đoạn "Tổ chức" và phóng to mốc
> 1930 ở Hồng Kông.
>
> **Góc Gen Z:** em nghiêng thẻ theo chuột, và bấm "Đọc thêm".
>
> **Quiz:** ở đây em xin mời một bạn trả lời giúp câu hỏi về AI… *(chờ bạn trả lời)*
> Đúng rồi, và đây là phần giải thích.
>
> **Cuối cùng** là thẻ trích dẫn: em lật thẻ, chỉ vào nguồn, và bấm nút chia sẻ.
>
> Đó là toàn bộ website. Em xin quay lại phần kết luận.

---

### Slide 18 — Kết luận  `18:00 → 19:00`

> Em xin kết lại bằng ba điều.
>
> **Thứ nhất**, website này thử nghiệm một cách học: đi từ lịch sử, đến bài học, rồi đến
> việc của hôm nay. Cùng một nội dung tư tưởng, nhưng đầu ra không phải một khái niệm để
> thuộc, mà là một hành vi để làm.
>
> **Thứ hai**, đây là một sản phẩm mở: toàn bộ nội dung nằm trong file JSON, nên một nhóm
> sinh viên khác hoàn toàn có thể tiếp quản và phát triển tiếp.
>
> **Thứ ba**, và cũng là điều em tự nhắc mình: kim chỉ nam chỉ thực sự có ý nghĩa khi nó
> đổi được một quyết định thật của ngày mai — một cách mình dùng thời gian, một cách mình
> tiêu tiền, một cách mình ghi nguồn bài của người khác, một cách mình dùng AI.
>
> Em xin trân trọng cảm ơn thầy/cô và các bạn đã lắng nghe. Em rất mong nhận được góp ý
> để hoàn thiện sản phẩm này.

**Kết thúc:** cúi đầu nhẹ, đứng yên 1 giây, đừng vội bấm tắt slide.

---

## 4. Kịch bản demo 90 giây (từng thao tác)

| # | Thao tác | Nói gì |
|---|---|---|
| 1 | Mở `localhost:3000`, **di chuyển chuột chậm** trên trang chủ | "Biểu tượng búa – liềm xoay theo con trỏ — không phải video, là đồ hoạ 3D chạy thật." |
| 2 | Chỉ vào khung "Ghi chú lịch sử" | "Đây là dòng cam kết về tư liệu em đã nói ở slide 15." |
| 3 | Cuộn xuống quả địa cầu, **để yên 8–10 giây** | "Nó tự chuyển mốc mỗi 4 giây, phần chữ bên phải tự cập nhật theo." |
| 4 | Bấm nút **"Tổ chức"** ở hàng lọc | "Lọc theo giai đoạn — còn 7 nhóm giai đoạn khác." |
| 5 | Bấm **"Tập trung mốc 1930"** | "Quả địa cầu tự xoay đúng về Hồng Kông và phóng to." |
| 6 | Đọc to mục **"Gợi ý hôm nay"** | "Đây là chỗ lịch sử biến thành kỹ năng làm việc nhóm." |
| 7 | Cuộn xuống **Góc Gen Z**, rê chuột qua thẻ | "Thẻ nghiêng 3D theo tay." → bấm **"Đọc thêm"** |
| 8 | Cuộn xuống **Quiz**, bấm câu 5, **mời 1 bạn chọn** | "Bạn chọn phương án nào? … Và đây là lý do." |
| 9 | Cuộn xuống **trích dẫn**, bấm lật 1 thẻ | "Mặt sau có nguồn và bài học. Nút này để chia sẻ." |
| 10 | Bấm nút **⏸ Tự động** trên globe (nếu còn thời gian) | "Em có thể tắt tự chạy khi muốn dừng lại nói kỹ." |

**Lưu ý khi demo:** rê chuột **chậm**, dừng lại 1–2 giây ở mỗi chỗ để người xem kịp nhìn.
Đừng cuộn liên tục. Nếu có gì không load được, nói thẳng: *"phần này cần mạng, em sẽ mô
tả bằng lời"* — xử lý bình tĩnh sẽ được đánh giá cao hơn là lúng túng.

---

## 5. Nếu bị cắt thời gian (bản 5 phút)

Giữ **5 slide**: 2 → 4 → 7 → 9 → 15, cộng demo 60 giây và kết luận.

> "Em xin trình bày thật ngắn. **[Slide 2]** Vấn đề em muốn giải quyết: sinh viên học tư
> tưởng Hồ Chí Minh để thi, chứ ít khi để dùng. **[Slide 4]** Nên em làm một website một
> trang, bốn trạm: hành trình lịch sử, bài học cho Gen Z, câu hỏi tình huống, và trích dẫn
> — đi từ cảm xúc đến ra quyết định. **[Slide 7]** Mỗi mốc lịch sử đều theo một khung:
> sự kiện, ý nghĩa, gợi ý hôm nay, và ghi chú tư liệu. Như mốc 1930 ở Hồng Kông: từ hội
> nghị hợp nhất các tổ chức cộng sản, rút ra bài học về tìm điểm chung trong làm việc
> nhóm. **[Slide 9]** Phần em tâm đắc nhất là chuyển 'Cần – Kiệm – Liêm – Chính' thành bốn
> thói quen số: kỷ luật thời gian, chi tiêu có kế hoạch, tôn trọng bản quyền, và tử tế
> khi ẩn danh. **[Slide 15]** Và điều em giữ nguyên tắc xuyên suốt: không gán cho Bác
> những câu nói không có thật — mọi trích dẫn có nguồn, mọi mốc có ghi chú tư liệu.
> *(Demo 60 giây.)* Kim chỉ nam chỉ có ý nghĩa khi nó đổi được một quyết định thật của
> ngày mai. Em cảm ơn thầy cô và các bạn."

---

## 6. Ngân hàng câu hỏi – đáp (Q&A)

**1. Vì sao em dùng biểu tượng búa – liềm làm hình ảnh mở đầu?**
> Vì đó là biểu tượng của liên minh công – nông, nền tảng của con đường mà Người đã chọn.
> Em đặt nó ở đầu trang như một lời nhắc: toàn bộ hành trình phía sau xuất phát từ một
> lựa chọn về con đường, chứ không chỉ là một chuyến đi.

**2. Giáo trình có sáu chương, website chỉ chọn 13 mốc — có bỏ sót nội dung không?**
> Dạ có, và em cố ý. Đây là một "lối vào", không phải bản thay thế. Em ưu tiên những mốc
> có thể rút ra bài học hành vi. Em đã ghi rõ hướng phát triển là thêm trang chi tiết theo
> từng chương để bám đủ sáu chương.

**3. Cơ sở nào để em rút ra "bài học" từ một sự kiện lịch sử?**
> Em dựa trên ý nghĩa đã được khẳng định của sự kiện trong giáo trình và tư liệu, rồi
> diễn giải sang bối cảnh sinh viên. Em ghi rõ phần diễn giải đó ở mục "Gợi ý hôm nay" và
> nhận rõ đó là cách hiểu của em ở slide 15.

**4. Em có lo việc trích dẫn sai lời Bác không?**
> Dạ có, nên em làm ba lớp bảo vệ: (1) khung "Ghi chú lịch sử" trên trang chủ nói rõ đâu
> là tinh thần rút ra, đâu là nguyên văn; (2) mỗi mốc có "Ghi chú tư liệu"; (3) mỗi câu
> trích dẫn đều ghi nguồn và thời điểm.

**5. Sinh viên không biết lập trình có dùng hoặc chỉnh sửa được không?**
> Dùng thì chỉ cần trình duyệt. Còn chỉnh nội dung thì chỉ cần sửa file JSON — không cần
> biết lập trình ba chiều. Em thiết kế tách nội dung khỏi giao diện là vì lý do đó.

**6. Website này có thay thế được việc đọc giáo trình?**
> Dạ không, và em không có ý đó. Nó là bước khởi động để người học quay lại giáo trình
> với câu hỏi rõ hơn.

**7. Vì sao chọn đối tượng Gen Z?**
> Vì đây là nhóm đang học môn này, và cũng là nhóm tiếp nhận thông tin bằng tương tác.
> Nếu sản phẩm không nói được ngôn ngữ của chính người học thì nó sẽ không được mở ra
> lần thứ hai.

**8. Điểm mới so với những trang web đã có về Chủ tịch Hồ Chí Minh?**
> Đa số trang hiện có là dạng tư liệu tĩnh hoặc bảo tàng ảo. Điểm em khác là **bắt người
> học ra quyết định**: quiz tình huống buộc chọn, và mỗi lựa chọn được giải thích bằng
> chính một sự kiện lịch sử.

**9. Em vận dụng nội dung tư tưởng nào là chủ đạo?**
> Chủ yếu là tư tưởng về đạo đức (Cần – Kiệm – Liêm – Chính), về tự học và học tập suốt
> đời, về đại đoàn kết, và về độc lập dân tộc gắn với chủ nghĩa xã hội — thể hiện qua
> biểu tượng và các mốc trên hành trình.

**10. Đáp án quiz có áp đặt người học không?**
> Mỗi câu đều có phần giải thích nêu lý do, nên người học có thể tranh luận lại. Em coi
> đó là điểm khởi đầu cho thảo luận trên lớp, không phải kết luận cuối cùng.

**11. Em mất bao lâu và bao nhiêu chi phí?**
> Toàn bộ công cụ là mã nguồn mở, chi phí bằng không. Thời gian chủ yếu dành cho việc
> chọn mốc, viết lại bài học và kiểm tra tư liệu — phần code chỉ chiếm một phần nhỏ.

**12. Nếu thầy/cô muốn dùng cho lớp khác thì cần gì?**
> Chỉ cần Node.js và hai lệnh `npm install`, `npm run dev`. Không cần database, không cần
> tài khoản dịch vụ nào.

**Câu hỏi "khó" có thể gặp — trả lời thế nào:**
- *"Sản phẩm này có tính học thuật hay chỉ là bài tập code?"* → Nhấn mạnh slide 15 và 16:
  em có nguyên tắc tư liệu và tự nhận giới hạn.
- *"Em có số liệu chứng minh hiệu quả không?"* → Trả lời thẳng: **chưa**, và đó là hạn
  chế lớn nhất em đã nêu; hướng phát triển là khảo sát trước/sau ở 1–2 lớp.
- *"AI có giúp em làm sản phẩm này không?"* → Trả lời đúng tinh thần câu quiz số 5: có
  dùng công cụ hỗ trợ, nhưng em chịu trách nhiệm về nội dung và đã kiểm chứng tư liệu.

---

## 7. Bảng tra số liệu (nhớ để trả lời nhanh)

| Số liệu | Giá trị |
|---|---|
| Số mốc lịch sử | **13** mốc, từ **1890** (Kim Liên) đến **1990** |
| Số giai đoạn | **8**: Khởi nguồn · Khởi đầu · Tìm đường · Tổ chức · Độc lập · Xây dựng · Di sản · Kỷ niệm |
| Thẻ bài học Gen Z | **3** |
| Câu hỏi tình huống | **5** |
| Thẻ trích dẫn | **4** |
| Số trường dữ liệu mỗi mốc | **14** |
| Quy mô mã nguồn | ~**1.450** dòng TS/TSX trong **9** file + **4** file JSON |
| Tốc độ tự chuyển mốc | **4 giây**; tạm dừng **3,5 giây** khi người dùng tương tác |
| Chi phí vận hành | **0 đồng** — không database, không API key |

---

## 8. Phiếu nhắc (in 1 mặt, cầm tay)

```
MỞ ĐẦU   : chào → tên/lớp → "Soi Đường" → câu hỏi: tư tưởng trong ngôn ngữ web?
VẤN ĐỀ   : 6 chương khó chạm · học để thi · Gen Z cần tương tác  → CÂU HỎI NGHIÊN CỨU
Ý TƯỞNG  : "Kim chỉ nam cho thế hệ trẻ" → 3 nguyên tắc: chọn lọc · khung nhất quán · thực hành
4 TRẠM   : cảm xúc → tri thức → quyết định → chiêm nghiệm
GLOBE    : 13 cờ đúng toạ độ · tự chạy 4s · lọc 8 giai đoạn · ảnh Wikimedia
13 MỐC   : KHÔNG đọc hết — chỉ đọc 1911, 1930, 1954
MỐC 1930 : Sự kiện → Vì sao → Gợi ý hôm nay → Ghi chú tư liệu
GEN Z    : Dĩ bất biến ứng vạn biến · Cần Kiệm Liêm Chính · Tự học
CKLC     : thời gian · tiền · bản quyền · tử tế khi ẩn danh
QUIZ     : kể câu 1 (tự học) + câu 5 (AI) → luôn có giải thích
TRÍCH DẪN: 4 thẻ, lật có nguồn + bài học + nút chia sẻ
CÔNG NGHỆ: Next.js 14 · three.js/R3F · Framer Motion · Tailwind · JSON, không DB
DATA-DRIVEN: sửa JSON = đổi nội dung → dự án tiếp quản được
A11Y     : reduced motion · dpr 1–1.5 · lazy · aria · ảnh lỗi có fallback
TƯ LIỆU  : KHÔNG gán câu nói sai · ghi chú lịch sử · nguồn cụ thể · tự nhận giới hạn  ⭐
HẠN CHẾ  : chưa map chương · diễn giải cá nhân · cần mạng · chưa có tiếng Anh · chưa đo hiệu quả
DEMO     : chuột → globe tự chạy → lọc "Tổ chức" → tập trung 1930 → Gen Z → quiz AI → lật thẻ
KẾT      : 3 điều → "kim chỉ nam phải đổi được một quyết định thật của ngày mai" → CẢM ƠN
```

**Ba câu phải nói được dù có chuyện gì xảy ra:**
1. "Website này không thay giáo trình — nó là một lối vào khác."
2. "Mọi mốc có ghi chú tư liệu; em không gán cho Bác những câu nói không có thật."
3. "Kim chỉ nam chỉ có ý nghĩa khi nó đổi được một quyết định thật của ngày mai."
