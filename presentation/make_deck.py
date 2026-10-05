#!/usr/bin/env python3
"""
Sinh file slide PowerPoint cho bài thuyết trình về website "Soi Đường"
(môn Tư tưởng Hồ Chí Minh).

Chạy:  python presentation/make_deck.py
Kết quả: presentation/Soi-Duong-bao-cao-tu-tuong-HCM.pptx

Toàn bộ nội dung lấy trực tiếp từ /data và /components của repo nên slide
luôn khớp với website thật. Muốn đổi tên người trình bày thì sửa các biến
PRESENTER_* bên dưới rồi chạy lại.
"""

from __future__ import annotations

import json
from pathlib import Path

from pptx import Presentation
from pptx.dml.color import RGBColor
from pptx.enum.shapes import MSO_SHAPE
from pptx.enum.text import MSO_ANCHOR, PP_ALIGN
from pptx.util import Emu, Inches, Pt

ROOT = Path(__file__).resolve().parents[1]
OUT = Path(__file__).resolve().parent / "Soi-Duong-bao-cao-tu-tuong-HCM.pptx"

# --- Thông tin người trình bày (sửa ở đây) ---------------------------------
PRESENTER_NAME = "[Họ và tên / Nhóm …]"
PRESENTER_CLASS = "[Lớp …]"
PRESENTER_MSSV = "[MSSV …]"
PRESENTER_LECTURER = "[Giảng viên hướng dẫn …]"

# --- Bảng màu lấy từ tailwind.config.ts ------------------------------------
BURGUNDY = RGBColor(0x8B, 0x00, 0x00)
BURGUNDY_DEEP = RGBColor(0x5E, 0x00, 0x00)
BURGUNDY_LIGHT = RGBColor(0xA8, 0x23, 0x2A)
CREAM = RGBColor(0xFD, 0xFB, 0xF7)
CREAM_DIM = RGBColor(0xF4, 0xEF, 0xE4)
GOLD = RGBColor(0xD4, 0xAF, 0x37)
GOLD_SOFT = RGBColor(0xE7, 0xCD, 0x7A)
CHARCOAL = RGBColor(0x1C, 0x1A, 0x17)
CHARCOAL_SOFT = RGBColor(0x2B, 0x27, 0x23)
GREY = RGBColor(0x6B, 0x65, 0x5E)

SERIF = "Georgia"
SANS = "Segoe UI"
MONO = "Consolas"

SW = 13.333  # slide width (inch)
SH = 7.5

# --- Dữ liệu thật của website ---------------------------------------------
timeline = json.loads((ROOT / "data/timeline.json").read_text(encoding="utf-8"))
genz = json.loads((ROOT / "data/genz-cards.json").read_text(encoding="utf-8"))
quiz = json.loads((ROOT / "data/quiz.json").read_text(encoding="utf-8"))
quotes = json.loads((ROOT / "data/quotes.json").read_text(encoding="utf-8"))


# ============================ helpers =====================================
def new_slide(prs: Presentation, bg=CREAM):
    slide = prs.slides.add_slide(prs.slide_layouts[6])
    bg_shape = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, 0, 0, Inches(SW), Inches(SH))
    bg_shape.fill.solid()
    bg_shape.fill.fore_color.rgb = bg
    bg_shape.line.fill.background()
    bg_shape.shadow.inherit = False
    return slide


def rect(slide, x, y, w, h, fill=None, line=None, line_w=1.0, rounded=False, adj=0.06):
    shape_type = MSO_SHAPE.ROUNDED_RECTANGLE if rounded else MSO_SHAPE.RECTANGLE
    shp = slide.shapes.add_shape(shape_type, Inches(x), Inches(y), Inches(w), Inches(h))
    if rounded:
        try:
            shp.adjustments[0] = adj
        except Exception:
            pass
    if fill is None:
        shp.fill.background()
    else:
        shp.fill.solid()
        shp.fill.fore_color.rgb = fill
    if line is None:
        shp.line.fill.background()
    else:
        shp.line.color.rgb = line
        shp.line.width = Pt(line_w)
    shp.shadow.inherit = False
    return shp


def oval(slide, x, y, w, h, fill=None, line=None, line_w=1.0):
    shp = slide.shapes.add_shape(MSO_SHAPE.OVAL, Inches(x), Inches(y), Inches(w), Inches(h))
    if fill is None:
        shp.fill.background()
    else:
        shp.fill.solid()
        shp.fill.fore_color.rgb = fill
    if line is None:
        shp.line.fill.background()
    else:
        shp.line.color.rgb = line
        shp.line.width = Pt(line_w)
    shp.shadow.inherit = False
    return shp


def text(slide, x, y, w, h, runs, align=PP_ALIGN.LEFT, anchor=MSO_ANCHOR.TOP,
         space_after=4, line_spacing=1.12):
    """runs: list of paragraphs; each paragraph is a list of (txt, size, color, bold, font, italic)."""
    tb = slide.shapes.add_textbox(Inches(x), Inches(y), Inches(w), Inches(h))
    tf = tb.text_frame
    tf.word_wrap = True
    tf.margin_left = tf.margin_right = tf.margin_top = tf.margin_bottom = 0
    tf.vertical_anchor = anchor
    for i, para in enumerate(runs):
        p = tf.paragraphs[0] if i == 0 else tf.add_paragraph()
        p.alignment = align
        p.space_after = Pt(space_after)
        p.line_spacing = line_spacing
        for item in para:
            txt, size, color = item[0], item[1], item[2]
            bold = item[3] if len(item) > 3 else False
            font = item[4] if len(item) > 4 else SANS
            italic = item[5] if len(item) > 5 else False
            r = p.add_run()
            r.text = txt
            r.font.size = Pt(size)
            r.font.color.rgb = color
            r.font.bold = bold
            r.font.name = font
            r.font.italic = italic
    return tb


def kicker(slide, label, x=0.9, y=0.62, color=BURGUNDY_LIGHT, dark=False):
    text(slide, x, y, 10.0, 0.3,
         [[(label.upper(), 12.5, GOLD if dark else color, True)]], space_after=0)


def title(slide, txt, x=0.9, y=0.95, size=34, color=CHARCOAL, w=11.4):
    # Georgia đậm rộng hơn trung bình; tự co cỡ chữ để tiêu đề luôn nằm 1 dòng.
    max_by_width = int((w * 72) / (0.58 * max(1, len(txt))))
    size = max(20, min(size, max_by_width))
    text(slide, x, y, w, 0.9, [[(txt, size, color, True, SERIF)]], space_after=0)


def rule(slide, x=0.9, y=1.62, w=1.1, color=GOLD, h=0.045):
    rect(slide, x, y, w, h, fill=color)


def footer(slide, idx, total, dark=False):
    c = RGBColor(0xBF, 0xB8, 0xAE) if dark else GREY
    text(slide, 0.9, 6.98, 8.0, 0.3,
         [[("Soi Đường · Tư tưởng Hồ Chí Minh cho thế hệ trẻ", 9.5, c)]], space_after=0)
    text(slide, 11.2, 6.98, 1.25, 0.3,
         [[(f"{idx:02d} / {total}", 9.5, c)]], align=PP_ALIGN.RIGHT, space_after=0)


def chip(slide, x, y, label, w=None, dark=False, active=False):
    w = w or (0.24 + 0.105 * len(label))
    fill = GOLD if active else (CHARCOAL_SOFT if dark else CREAM_DIM)
    col = CHARCOAL if active else (CREAM if dark else CHARCOAL)
    rect(slide, x, y, w, 0.34, fill=fill, rounded=True, adj=0.5)
    text(slide, x, y + 0.055, w, 0.24, [[(label, 10.5, col, active)]],
         align=PP_ALIGN.CENTER, space_after=0)
    return x + w + 0.16


def clip(txt: str, n: int) -> str:
    """Cắt theo ranh giới từ để không vỡ câu giữa chừng."""
    return txt if len(txt) <= n else txt[:n].rsplit(" ", 1)[0] + "…"


def notes(slide, body: str):
    slide.notes_slide.notes_text_frame.text = body.strip()


def est_lines(txt: str, width_in: float, size_pt: float, factor: float = 0.56) -> int:
    """Ước lượng số dòng khi xuống dòng ở width_in với cỡ chữ size_pt."""
    chars_per_line = max(1, int((width_in * 72) / (factor * size_pt)))
    return max(1, -(-len(txt) // chars_per_line))


def est_height(txt: str, width_in: float, size_pt: float, factor: float = 0.56) -> float:
    """Chiều cao thật (inch) mà đoạn chữ sẽ chiếm khi render."""
    return est_lines(txt, width_in, size_pt, factor) * size_pt * 1.22 * 1.12 / 72.0


def bullets(slide, x, y, w, items, size=14, gap=0.08, dot_color=BURGUNDY,
            text_color=CHARCOAL, bold_lead=True):
    """items: list of (lead, rest)."""
    cy = y
    for lead, rest in items:
        oval(slide, x, cy + 0.115, 0.09, 0.09, fill=dot_color)
        runs = [[(lead, size, text_color, bold_lead, SANS),
                 (rest, size, text_color, False, SANS)]]
        text(slide, x + 0.28, cy, w - 0.28, 0.6, runs, space_after=0)
        cy += est_height(lead + rest, w - 0.28, size) + gap
    return cy


# ============================ deck ========================================
prs = Presentation()
prs.slide_width = Inches(SW)
prs.slide_height = Inches(SH)

TOTAL = 18

# ---------------------------------------------------------------- 1. Bìa
s = new_slide(prs, BURGUNDY)
rect(s, 0, 0, SW, SH, fill=BURGUNDY)
rect(s, 0, 0, SW, 0.16, fill=GOLD)
rect(s, 0, 7.34, SW, 0.16, fill=GOLD)
# ngôi sao vàng trang trí
star = s.shapes.add_shape(MSO_SHAPE.STAR_5_POINT, Inches(0.9), Inches(1.05), Inches(0.62), Inches(0.62))
star.fill.solid(); star.fill.fore_color.rgb = GOLD; star.line.fill.background(); star.shadow.inherit = False
text(s, 1.75, 1.14, 8.0, 0.5,
     [[("MÔN HỌC TƯ TƯỞNG HỒ CHÍ MINH — BÁO CÁO SẢN PHẨM HỌC LIỆU SỐ", 12, GOLD_SOFT, True)]],
     space_after=0)
text(s, 0.9, 2.05, 11.5, 1.3, [[("SOI ĐƯỜNG", 68, CREAM, True, SERIF)]], space_after=0)
text(s, 0.9, 3.35, 10.5, 0.8,
     [[("Tư tưởng Hồ Chí Minh trong một trải nghiệm web tương tác 3D cho thế hệ trẻ", 24, GOLD_SOFT, False, SERIF)]],
     space_after=0)
rect(s, 0.9, 4.35, 2.2, 0.035, fill=GOLD)
text(s, 0.9, 4.7, 6.5, 1.6, [
    [("Người trình bày: ", 14, GOLD_SOFT, True), (PRESENTER_NAME, 14, CREAM)],
    [("Lớp / MSSV: ", 14, GOLD_SOFT, True), (f"{PRESENTER_CLASS}  ·  {PRESENTER_MSSV}", 14, CREAM)],
    [("Giảng viên: ", 14, GOLD_SOFT, True), (PRESENTER_LECTURER, 14, CREAM)],
], space_after=7)
text(s, 8.0, 4.7, 4.4, 1.6, [
    [("Next.js 14 · React Three Fiber", 12, GOLD_SOFT)],
    [("Framer Motion · Tailwind CSS", 12, GOLD_SOFT)],
    [("13 mốc lịch sử · 3 bài học Gen Z", 12, GOLD_SOFT)],
    [("5 tình huống · 4 trích dẫn", 12, GOLD_SOFT)],
], space_after=6)
notes(s, f"""
[0:00 – 0:40 | MỞ ĐẦU]

Kính thưa thầy/cô {PRESENTER_LECTURER} và các bạn,

Em/mình là {PRESENTER_NAME}, lớp {PRESENTER_CLASS}. Hôm nay em xin trình bày
một sản phẩm học liệu số mà em đã tự xây dựng cho môn Tư tưởng Hồ Chí Minh:
website có tên là "Soi Đường".

Ý tưởng rất ngắn gọn: thay vì chỉ đọc giáo trình, em thử trả lời một câu hỏi —
nếu tư tưởng Hồ Chí Minh được trình bày bằng ngôn ngữ của một website hiện đại,
có 3D, có tương tác, có câu hỏi tình huống, thì người trẻ hôm nay sẽ tiếp cận
nó khác đi như thế nào?

Trong khoảng 12–15 phút, em sẽ đi qua: vì sao làm, website có gì, công nghệ ra sao,
và quan trọng nhất là những bài học tư tưởng nào được chuyển hoá thành hành vi
cụ thể cho sinh viên. Cuối bài em sẽ demo trực tiếp trên trình duyệt.
""")

# ------------------------------------------------- 2. Vấn đề đặt ra
s = new_slide(prs)
kicker(s, "1 · Vấn đề đặt ra")
title(s, "Học để thi, hay học để dùng?")
rule(s)
text(s, 0.9, 1.95, 6.6, 0.5,
     [[("Ba quan sát khiến em bắt tay làm sản phẩm này:", 14, GREY)]], space_after=0)
bullets(s, 0.9, 2.5, 6.4, [
    ("Giáo trình 6 chương ", "dày về khái niệm, hệ thống, lịch sử — cần thiết nhưng khó "
     "\"chạm\" vào đời sống hằng ngày của sinh viên."),
    ("Cách học phổ biến ", "là học thuộc để làm bài kiểm tra, ít khi đặt câu hỏi "
     "\"mình dùng tư tưởng này vào việc gì ngày mai?\""),
    ("Thói quen tiếp nhận của Gen Z ", "là trực quan, tương tác, có phản hồi ngay — "
     "không phải văn bản dài một chiều."),
], size=14)
rect(s, 7.85, 1.95, 4.55, 4.35, fill=CREAM_DIM, rounded=True, adj=0.04)
rect(s, 7.85, 1.95, 4.55, 0.09, fill=BURGUNDY, rounded=False)
text(s, 8.2, 2.25, 3.9, 0.4, [[("CÂU HỎI NGHIÊN CỨU", 11, BURGUNDY, True)]], space_after=0)
text(s, 8.2, 2.7, 3.9, 2.2,
     [[("Làm thế nào để chuyển giá trị cốt lõi của tư tưởng Hồ Chí Minh "
        "thành một trải nghiệm mà người trẻ ", 15, CHARCOAL, False, SERIF),
       ("chủ động khám phá", 15, BURGUNDY, True, SERIF),
       (" thay vì bị động tiếp nhận?", 15, CHARCOAL, False, SERIF)]], space_after=0)
text(s, 8.2, 5.05, 3.9, 1.0,
     [[("Không thay giáo trình — mà làm một \"lối vào\" khác, dẫn người học quay lại "
        "giáo trình với câu hỏi rõ hơn.", 12.5, GREY, False, SANS, True)]], space_after=0)
notes(s, """
[0:40 – 2:10 | VẤN ĐỀ]

Trước khi nói về công nghệ, em xin nói về lý do.

Em quan sát ba điều. Thứ nhất, giáo trình môn Tư tưởng Hồ Chí Minh có sáu chương,
rất hệ thống về khái niệm, về cơ sở hình thành, về các nội dung tư tưởng. Nó cần
thiết, nhưng với sinh viên năm nhất, năm hai thì khoảng cách giữa trang sách và
đời sống khá xa.

Thứ hai, cách học phổ biến là học để làm bài kiểm tra. Ít ai tự hỏi: "vậy mai mình
dùng tư tưởng này vào việc gì?".

Thứ ba, thế hệ chúng em tiếp nhận thông tin theo cách rất khác: trực quan, có
tương tác, có phản hồi ngay lập tức.

Từ đó em đặt một câu hỏi nghiên cứu rất cụ thể, nằm ở khung bên phải: làm thế nào
để chuyển giá trị cốt lõi của tư tưởng Hồ Chí Minh thành một trải nghiệm mà người
trẻ chủ động khám phá, chứ không phải bị động tiếp nhận.

Và em muốn nhấn mạnh ngay từ đầu: website này không thay giáo trình. Nó là một
"lối vào" khác, để sau khi xem xong, người học quay lại giáo trình với câu hỏi
rõ ràng hơn.
""")

# ------------------------------------------------- 3. Ý tưởng chủ đạo
s = new_slide(prs)
kicker(s, "2 · Ý tưởng chủ đạo")
title(s, "\"Kim chỉ nam cho thế hệ trẻ\"")
rule(s)
text(s, 0.9, 1.95, 11.4, 0.5,
     [[("Nguyên văn câu định vị trên trang chủ của website:", 13, GREY)]], space_after=0)
rect(s, 0.9, 2.45, 11.53, 1.25, fill=CREAM_DIM, rounded=True, adj=0.06)
rect(s, 0.9, 2.45, 0.09, 1.25, fill=GOLD)
text(s, 1.25, 2.72, 10.9, 0.9,
     [[("\"Không phải sáu chương giáo trình dàn trải — mà là những giá trị cốt lõi, "
        "được kể lại theo cách một người trẻ hôm nay có thể mang vào đời sống của mình.\"",
        16, CHARCOAL, False, SERIF, True)]], space_after=0)
cards = [
    ("Chọn lọc, không dàn trải",
     "Không kể lại toàn bộ tiểu sử. Website chọn 13 mốc tiêu biểu, mỗi mốc rút thành "
     "một bài học có thể hành động."),
    ("Lịch sử → Bài học → Việc hôm nay",
     "Mỗi mốc đều đi theo cùng một khung: Sự kiện → Vì sao quan trọng → Gợi ý hôm nay "
     "→ Ghi chú tư liệu."),
    ("Tư tưởng là để thực hành",
     "Phần kết không phải danh ngôn để ngắm, mà là câu hỏi tình huống buộc người học "
     "phải chọn và chịu trách nhiệm với lựa chọn."),
]
cw = 3.68
for i, (h, b) in enumerate(cards):
    x = 0.9 + i * (cw + 0.24)
    rect(s, x, 4.05, cw, 2.5, fill=CREAM, line=RGBColor(0xE0, 0xD9, 0xCC), line_w=1.0, rounded=True, adj=0.05)
    rect(s, x, 4.05, cw, 0.075, fill=BURGUNDY if i != 1 else GOLD)
    text(s, x + 0.32, 4.35, cw - 0.64, 0.5, [[(f"0{i+1}", 13, GOLD, True)]], space_after=0)
    text(s, x + 0.32, 4.72, cw - 0.64, 0.7, [[(h, 16, CHARCOAL, True, SERIF)]], space_after=0)
    text(s, x + 0.32, 5.5, cw - 0.64, 1.0, [[(b, 11, GREY)]], space_after=0)
notes(s, """
[2:10 – 3:20 | Ý TƯỞNG CHỦ ĐẠO]

Câu định vị nằm ngay trên trang chủ, em xin đọc nguyên văn: "Không phải sáu chương
giáo trình dàn trải — mà là những giá trị cốt lõi, được kể lại theo cách một người
trẻ hôm nay có thể mang vào đời sống của mình."

Từ câu đó, em đặt ra ba nguyên tắc thiết kế.

Một là chọn lọc, không dàn trải. Em không kể lại toàn bộ tiểu sử. Em chọn mười ba
mốc tiêu biểu, và mỗi mốc phải rút ra được một bài học có thể hành động.

Hai là một khung nhất quán: lịch sử, rồi bài học, rồi việc hôm nay. Người học đi
từ sự kiện thật, đến ý nghĩa của nó, đến một gợi ý áp dụng, và cuối cùng là ghi chú
về tư liệu.

Ba là tư tưởng là để thực hành. Nên phần cuối website không phải những câu danh
ngôn để ngắm, mà là các tình huống buộc người học phải chọn — và thấy ngay hệ quả
của lựa chọn đó.
""")

# ------------------------------------------------- 4. Cấu trúc 4 trạm
s = new_slide(prs, CHARCOAL)
kicker(s, "3 · Kiến trúc nội dung", dark=True)
title(s, "Một trang duy nhất, bốn \"trạm\" trải nghiệm", color=CREAM, size=32)
rule(s)
text(s, 0.9, 1.95, 11.4, 0.4,
     [[("Single-page: người học đi một mạch từ cảm xúc → tri thức → vận dụng → chiêm nghiệm.",
        13.5, RGBColor(0xBF, 0xB8, 0xAE))]], space_after=0)
stations = [
    ("HÀNH TRÌNH", "Quả địa cầu 3D + 13 mốc lịch sử 1890–1990", "Cảm xúc & bối cảnh", BURGUNDY_LIGHT),
    ("GÓC GEN Z", "3 thẻ bài học: tư tưởng → thói quen", "Tri thức vận dụng", GOLD),
    ("TRẠM THÁCH THỨC", "Quiz 5 tình huống có giải thích", "Ra quyết định", GOLD),
    ("TRÍCH DẪN", "4 thẻ lật 3D, kèm nguồn & bài học", "Chiêm nghiệm", BURGUNDY_LIGHT),
]
cw = 2.82
for i, (tag, h, sub, col) in enumerate(stations):
    x = 0.9 + i * (cw + 0.24)
    rect(s, x, 2.65, cw, 2.9, fill=CHARCOAL_SOFT, rounded=True, adj=0.06)
    rect(s, x, 2.65, cw, 0.08, fill=col)
    oval(s, x + 0.32, 3.0, 0.5, 0.5, fill=col)
    text(s, x + 0.32, 3.08, 0.5, 0.34, [[(str(i + 1), 14, CHARCOAL if col == GOLD else CREAM, True)]],
         align=PP_ALIGN.CENTER, space_after=0)
    text(s, x + 0.32, 3.72, cw - 0.64, 0.35, [[(tag, 11, GOLD, True)]], space_after=0)
    text(s, x + 0.32, 4.1, cw - 0.64, 1.0, [[(h, 15.5, CREAM, True, SERIF)]], space_after=0)
    text(s, x + 0.32, 5.1, cw - 0.64, 0.4, [[(sub, 11.5, RGBColor(0xA9, 0xA2, 0x98), False, SANS, True)]],
         space_after=0)
    if i < 3:
        ar = s.shapes.add_shape(MSO_SHAPE.RIGHT_ARROW, Inches(x + cw + 0.015), Inches(3.85),
                                Inches(0.21), Inches(0.24))
        ar.fill.solid(); ar.fill.fore_color.rgb = GOLD; ar.line.fill.background(); ar.shadow.inherit = False
text(s, 0.9, 5.95, 11.5, 0.5,
     [[("Điều hướng cố định ở đầu trang: ", 12.5, RGBColor(0xA9, 0xA2, 0x98)),
       ("Hành trình  ·  Góc Gen Z  ·  Thách thức", 12.5, GOLD, True),
       ("   —  toàn bộ cuộn mượt, không tải lại trang.", 12.5, RGBColor(0xA9, 0xA2, 0x98))]],
     space_after=0)
notes(s, """
[3:20 – 4:20 | CẤU TRÚC]

Về cấu trúc, toàn bộ website là một trang duy nhất, chia thành bốn "trạm", được
sắp theo một dụng ý sư phạm chứ không phải ngẫu nhiên.

Trạm một là Hành trình: quả địa cầu ba chiều với mười ba mốc lịch sử. Nhiệm vụ của
nó là tạo cảm xúc và bối cảnh.

Trạm hai là Góc Gen Z: ba thẻ bài học chuyển tư tưởng thành thói quen. Đây là phần
tri thức vận dụng.

Trạm ba là Trạm thách thức: năm câu hỏi tình huống có giải thích. Ở đây người học
phải ra quyết định.

Trạm bốn là bộ sưu tập trích dẫn: bốn thẻ lật ba chiều, mặt trước là câu nói, mặt
sau là nguồn và bài học. Đây là phần chiêm nghiệm, để người học giữ lại một điều gì đó.

Bốn trạm này tạo một đường đi: cảm xúc, tri thức, ra quyết định, rồi chiêm nghiệm.
""")

# ------------------------------------------------- 5. Trạm 1 - Globe
s = new_slide(prs, CHARCOAL)
kicker(s, "4 · Trạm Hành trình", dark=True)
title(s, "Quả địa cầu 3D: hành trình 30 năm tìm đường", color=CREAM, size=32)
rule(s)
# mock globe
rect(s, 0.9, 2.0, 5.6, 4.35, fill=RGBColor(0x10, 0x0F, 0x0D), rounded=True, adj=0.05)
oval(s, 2.15, 2.6, 3.1, 3.1, fill=RGBColor(0x14, 0x2A, 0x3A), line=RGBColor(0x2C, 0x4A, 0x5E), line_w=1.2)
for k in range(1, 4):
    oval(s, 2.15 + 0.28 * k, 2.6, 3.1 - 0.56 * k, 3.1, line=RGBColor(0x33, 0x55, 0x68), line_w=0.75)
for yy in (3.15, 3.7, 4.25, 4.8):
    rect(s, 2.2, yy, 3.0, 0.012, fill=RGBColor(0x33, 0x55, 0x68))
for (mx, my) in ((3.0, 3.25), (3.75, 3.95), (4.35, 3.35), (2.75, 4.35), (4.0, 4.85)):
    oval(s, mx, my, 0.13, 0.13, fill=BURGUNDY_LIGHT, line=GOLD, line_w=1.0)
rect(s, 3.55, 5.55, 0.9, 0.3, fill=CHARCOAL_SOFT, rounded=True, adj=0.5)
text(s, 3.55, 5.6, 0.9, 0.22, [[("⏸ Tự động", 9.5, GOLD, True)]], align=PP_ALIGN.CENTER, space_after=0)
text(s, 1.05, 6.05, 5.3, 0.3,
     [[("Sơ đồ minh hoạ giao diện — không phải ảnh chụp màn hình.", 9.5,
        RGBColor(0x7E, 0x77, 0x6E), False, SANS, True)]], space_after=0)
feats = [
    ("Tự xoay & tự chuyển mốc mỗi 4 giây", "— không cần thao tác, lớp vẫn theo được khi trình chiếu."),
    ("13 cột cờ đỏ sao vàng", "gắn đúng toạ độ địa lý thật của từng địa danh."),
    ("Lọc theo 8 giai đoạn", "Khởi nguồn · Khởi đầu · Tìm đường · Tổ chức · Độc lập · Xây dựng · Di sản · Kỷ niệm."),
    ("Tương tác chủ động", "kéo xoay, phóng to, \"Tập trung mốc\", \"Toàn cảnh\" — chạm vào mốc là tự tạm dừng 3,5 giây."),
    ("Ảnh tư liệu Wikimedia", "kèm chú thích và ghi chú nguồn cho từng mốc; ảnh lỗi có khung dự phòng."),
]
cy = 2.05
for lead, rest in feats:
    oval(s, 6.85, cy + 0.11, 0.1, 0.1, fill=GOLD)
    text(s, 7.1, cy, 5.3, 0.9,
         [[(lead, 13.5, CREAM, True), (rest, 13, RGBColor(0xC9, 0xC2, 0xB8))]], space_after=0)
    cy += est_height(lead + rest, 5.3, 13.5) + 0.14
notes(s, """
[4:20 – 6:00 | TRẠM HÀNH TRÌNH]

Đây là phần em tâm đắc nhất và cũng là phần em sẽ demo kỹ.

Một quả địa cầu ba chiều, tự xoay, và cứ bốn giây thì tự chuyển sang mốc tiếp theo.
Em cố tình làm tính năng tự chạy này, vì khi trình chiếu trên lớp, thầy cô và các
bạn vẫn theo dõi được mà em không phải bấm liên tục.

Trên quả địa cầu có mười ba cột cờ đỏ sao vàng, được đặt đúng toạ độ địa lý thật
của từng địa danh — từ Kim Liên, Nghệ An, đến Bến Nhà Rồng, Versailles, Tours,
Quảng Châu, Hồng Kông, Pác Bó, Ba Đình, Điện Biên Phủ. Người xem thấy ngay một điều
rất trực quan: hành trình của Bác là một hành trình vòng quanh thế giới, chứ
không nằm gọn trong một địa phương.

Người học có thể lọc theo tám giai đoạn, kéo xoay, phóng to, bấm "Tập trung mốc"
hoặc "Toàn cảnh". Mỗi khi chạm vào một mốc, quả địa cầu tự tạm dừng ba giây rưỡi
để đọc.

Mỗi mốc có ảnh tư liệu lấy từ Wikimedia Commons, kèm chú thích và ghi chú nguồn.
Nếu ảnh không tải được, giao diện tự hiện một khung dự phòng và phần chữ vẫn đọc
được bình thường.

Lưu ý nhỏ: hình bên trái là sơ đồ minh hoạ do em vẽ lại, không phải ảnh chụp
màn hình — phần thật em sẽ demo ở cuối bài.
""")

# ------------------------------------------------- 6. Bảng 13 mốc
s = new_slide(prs)
kicker(s, "4 · Trạm Hành trình (tiếp)")
title(s, "13 mốc, mỗi mốc một bài học có thể dùng ngay", size=30)
rule(s)
rows = len(timeline) + 1
tbl_shape = s.shapes.add_table(rows, 4, Inches(0.9), Inches(1.85), Inches(11.53), Inches(4.9))
tbl = tbl_shape.table
tbl.columns[0].width = Inches(1.05)
tbl.columns[1].width = Inches(3.85)
tbl.columns[2].width = Inches(1.75)
tbl.columns[3].width = Inches(4.88)
heads = ["Năm", "Địa danh", "Giai đoạn", "Bài học rút ra (nguyên văn trên website)"]
for c, htxt in enumerate(heads):
    cell = tbl.cell(0, c)
    cell.fill.solid(); cell.fill.fore_color.rgb = BURGUNDY
    cell.margin_left = Inches(0.09); cell.margin_right = Inches(0.05)
    cell.margin_top = Inches(0.03); cell.margin_bottom = Inches(0.03)
    p = cell.text_frame.paragraphs[0]
    r = p.add_run(); r.text = htxt
    r.font.size = Pt(11.5); r.font.bold = True; r.font.color.rgb = CREAM; r.font.name = SANS
for ri, m in enumerate(timeline, start=1):
    vals = [str(m["year"]), m["place"], m["period"], m["lesson"]]
    for ci, v in enumerate(vals):
        cell = tbl.cell(ri, ci)
        cell.fill.solid()
        cell.fill.fore_color.rgb = CREAM_DIM if ri % 2 == 0 else CREAM
        cell.margin_left = Inches(0.09); cell.margin_right = Inches(0.05)
        cell.margin_top = Inches(0.01); cell.margin_bottom = Inches(0.01)
        p = cell.text_frame.paragraphs[0]
        r = p.add_run(); r.text = v
        r.font.size = Pt(10.5 if ci != 3 else 10.5)
        r.font.bold = (ci == 0)
        r.font.color.rgb = BURGUNDY if ci == 0 else (CHARCOAL if ci != 2 else GREY)
        r.font.name = SANS
notes(s, """
[6:00 – 7:00 | 13 MỐC]

Đây là toàn bộ mười ba mốc trên website, từ năm 1890 ở Kim Liên đến năm 1990, kỷ
niệm một trăm năm ngày sinh của Người.

Em xin phép không đọc hết, chỉ nhấn mạnh cách chọn: mỗi mốc phải rút ra được một
bài học viết bằng ngôn ngữ của hôm nay. Ví dụ năm 1911 ở Bến Nhà Rồng, bài học là
"dấn thân và bước ra vùng an toàn". Năm 1930 ở Hồng Kông là "tổ chức và tìm điểm
chung". Năm 1954 ở Điện Biên Phủ là "kiên định mục tiêu và phát huy sức dân".

Tức là lịch sử vẫn được giữ đúng, nhưng đầu ra của nó là một kỹ năng sống.
Đó chính là cách em hiểu câu "tư tưởng là kim chỉ nam": kim chỉ nam thì phải chỉ
được hướng cho một quyết định cụ thể.
""")

# ------------------------------------------------- 7. Cấu trúc 1 mốc
m1930 = next(m for m in timeline if m["year"] == 1930)
s = new_slide(prs)
kicker(s, "4 · Trạm Hành trình (tiếp)")
title(s, "Bên trong một mốc: ví dụ 1930 — Hồng Kông", size=30)
rule(s)
rect(s, 0.9, 1.95, 5.5, 4.5, fill=CHARCOAL, rounded=True, adj=0.04)
text(s, 1.25, 2.25, 4.8, 0.3, [[(m1930["period"].upper(), 11, GOLD, True)]], space_after=0)
text(s, 1.25, 2.6, 4.8, 0.35, [[(m1930["place"], 13, GOLD_SOFT)]], space_after=0)
text(s, 1.25, 3.05, 4.8, 1.0, [[(m1930["lesson"], 22, CREAM, True, SERIF)]], space_after=0)
rect(s, 1.25, 4.25, 1.5, 0.03, fill=GOLD)
text(s, 1.25, 4.45, 4.8, 1.6,
     [[("GHI CHÚ TƯ LIỆU", 9.5, GOLD, True)],
      [(m1930["sourceNote"], 12, RGBColor(0xC9, 0xC2, 0xB8), False, SANS, True)]], space_after=6)
right = [
    ("SỰ KIỆN", m1930["historicalContext"]),
    ("VÌ SAO QUAN TRỌNG", m1930["whyItMatters"]),
    ("GỢI Ý HÔM NAY", m1930["modernApplication"]),
]
cy = 1.95
for h, b in right:
    rect(s, 6.7, cy, 5.73, 1.42, fill=CREAM_DIM, rounded=True, adj=0.07)
    rect(s, 6.7, cy, 0.07, 1.42, fill=GOLD)
    text(s, 7.0, cy + 0.2, 5.2, 0.3, [[(h, 10.5, BURGUNDY, True)]], space_after=0)
    text(s, 7.0, cy + 0.52, 5.2, 0.85, [[(b, 12.5, CHARCOAL)]], space_after=0)
    cy += 1.58
notes(s, """
[7:00 – 8:10 | CẤU TRÚC MỘT MỐC]

Em xin phóng to một mốc để thầy cô thấy cấu trúc bên trong. Đây là mốc năm 1930
tại Hồng Kông, Trung Quốc.

Mục "Sự kiện" ghi đúng lịch sử: đầu năm 1930, Nguyễn Ái Quốc chủ trì hội nghị hợp
nhất các tổ chức cộng sản, dẫn tới sự ra đời của Đảng Cộng sản Việt Nam.

Mục "Vì sao quan trọng" nâng lên thành nguyên lý: một mục tiêu chung chỉ trở thành
sức mạnh khi được chuyển thành tổ chức, nguyên tắc phối hợp và trách nhiệm cụ thể.

Và mục "Gợi ý hôm nay" hạ xuống đời sống sinh viên: đoàn kết không có nghĩa là xoá
khác biệt; một nhóm làm việc tốt cần mục tiêu chung, nguyên tắc trao đổi và một
người chịu trách nhiệm kết nối các góc nhìn.

Điểm em muốn thầy cô chú ý là khung nhỏ bên trái: "Ghi chú tư liệu". Ở đó website
ghi rõ mốc tổ chức là tháng Hai năm 1930, hội nghị diễn ra tại khu vực Cửu Long,
Hồng Kông. Mọi mốc trong mười ba mốc đều có dòng ghi chú như vậy. Em sẽ nói kỹ
hơn về tính trung thực tư liệu ở phần sau.
""")

# ------------------------------------------------- 8. Góc Gen Z
s = new_slide(prs)
kicker(s, "5 · Góc Gen Z")
title(s, "Từ tư tưởng đến thói quen: 3 thẻ bài học", size=32)
rule(s)
text(s, 0.9, 1.95, 11.4, 0.4,
     [[("Thẻ nghiêng 3D theo con trỏ; bấm \"Đọc thêm\" để mở phần phân tích đầy đủ.",
        13, GREY)]], space_after=0)
cw = 3.68
for i, c in enumerate(genz):
    x = 0.9 + i * (cw + 0.24)
    rect(s, x, 2.5, cw, 4.2, fill=CREAM, line=RGBColor(0xE0, 0xD9, 0xCC), line_w=1.0, rounded=True, adj=0.05)
    rect(s, x, 2.5, cw, 0.075, fill=GOLD if i == 1 else BURGUNDY)
    rect(s, x + 0.3, 2.8, 1.6 + 0.075 * len(c["tag"]), 0.32, fill=RGBColor(0xF6, 0xE9, 0xE9), rounded=True, adj=0.5)
    text(s, x + 0.3, 2.86, 1.6 + 0.075 * len(c["tag"]), 0.22,
         [[(c["tag"], 10, BURGUNDY, True)]], align=PP_ALIGN.CENTER, space_after=0)
    text(s, x + 0.3, 3.35, cw - 0.6, 0.9, [[(c["title"], 16.5, CHARCOAL, True, SERIF)]], space_after=0)
    text(s, x + 0.3, 4.35, cw - 0.6, 1.0, [[(c["excerpt"], 12, GREY, False, SANS, True)]], space_after=0)
    rect(s, x + 0.3, 5.5, 1.0, 0.03, fill=GOLD)
    snippet = c["body"][:150].rsplit(" ", 1)[0] + "…"
    text(s, x + 0.3, 5.62, cw - 0.6, 1.0, [[(snippet, 10.5, CHARCOAL)]], space_after=0)
notes(s, """
[8:10 – 9:20 | GÓC GEN Z]

Sang trạm thứ hai: Góc Gen Z, với ba thẻ bài học. Ba thẻ này là phần em cho là
"chất" nhất về mặt tư tưởng, vì nó làm đúng việc chuyển hoá.

Thẻ thứ nhất: "Dĩ bất biến, ứng vạn biến" thời 4.0. Cái bất biến ở đây là giá trị
nghề nghiệp cốt lõi và năng lực tư duy độc lập; cái vạn biến là công cụ — hôm nay
là AI, ngày mai là thứ khác.

Thẻ thứ hai: Cần, Kiệm, Liêm, Chính thời Gen Z. Bốn chữ rất quen, nhưng em diễn
dịch lại thành bốn thói quen rất mới.

Thẻ thứ ba: Tự học theo chân Bác — không chờ một môi trường lý tưởng, mà chủ động
biến hoàn cảnh thành bài học.

Về mặt giao diện, ba thẻ này nghiêng ba chiều theo con trỏ chuột và có nút "Đọc
thêm" để mở phần phân tích. Em làm vậy vì không muốn bắt người đọc nuốt một khối
chữ ngay từ đầu.
""")

# ------------------------------------------------- 9. Cần Kiệm Liêm Chính
s = new_slide(prs)
kicker(s, "5 · Góc Gen Z (tiếp)")
title(s, "Cần – Kiệm – Liêm – Chính trong đời sống số", size=32)
rule(s)
four = [
    ("CẦN", "Kỷ luật với thời gian", "Tự chủ thời gian biểu cá nhân, không để thuật toán mạng xã hội quyết định một ngày của mình."),
    ("KIỆM", "Chi tiêu có kế hoạch", "Không chạy theo áp lực tiêu dùng; nhìn thẳng vào số liệu chi tiêu thật trước khi quyết định."),
    ("LIÊM", "Tôn trọng bản quyền số", "Tôn trọng công sức trí tuệ của người khác — ghi nguồn, xin phép, không \"xào\" nội dung."),
    ("CHÍNH", "Tử tế nhất quán", "Giữ sự tử tế kể cả khi ẩn danh sau màn hình; nhất quán giữa con người online và ngoài đời."),
]
cw = 2.82
for i, (word, sub, body) in enumerate(four):
    x = 0.9 + i * (cw + 0.24)
    rect(s, x, 2.05, cw, 3.55, fill=CREAM_DIM, rounded=True, adj=0.05)
    rect(s, x, 2.05, cw, 0.72, fill=BURGUNDY if i % 2 == 0 else BURGUNDY_DEEP)
    text(s, x, 2.2, cw, 0.45, [[(word, 20, GOLD_SOFT, True, SERIF)]], align=PP_ALIGN.CENTER, space_after=0)
    text(s, x + 0.26, 3.0, cw - 0.52, 0.5, [[(sub, 14, BURGUNDY, True)]], space_after=0)
    text(s, x + 0.26, 3.6, cw - 0.52, 1.8, [[(body, 12, CHARCOAL)]], space_after=0)
rect(s, 0.9, 5.85, 11.53, 0.75, fill=CHARCOAL, rounded=True, adj=0.12)
text(s, 1.25, 6.05, 10.9, 0.5,
     [[("Vì sao em chọn bốn chữ này: ", 12.5, GOLD, True),
       ("đây là bộ giá trị đạo đức ngắn nhất, dễ nhớ nhất, và cũng là bộ dễ \"kiểm tra\" "
        "nhất trong đời sống hằng ngày của một sinh viên.", 12.5, CREAM)]], space_after=0)
notes(s, """
[9:20 – 10:20 | CẦN KIỆM LIÊM CHÍNH]

Em xin đi sâu một chút vào thẻ thứ hai, vì đây là chỗ tư tưởng chạm vào đời sống
số rõ nhất.

Cần, em hiểu là kỷ luật với thời gian. Trong thời đại mà thuật toán mạng xã hội
được thiết kế để giữ chân mình, thì tự chủ được thời gian biểu đã là một hình thức
của chữ Cần.

Kiệm là chi tiêu có kế hoạch, không chạy theo áp lực tiêu dùng.

Liêm, em chuyển thành tôn trọng bản quyền nội dung số: ghi nguồn, xin phép, không
xào lại bài của người khác rồi nhận là của mình.

Chính là giữ sự tử tế một cách nhất quán, kể cả khi mình đang ẩn danh sau màn hình.

Em chọn bốn chữ này vì đây là bộ giá trị đạo đức ngắn nhất, dễ nhớ nhất, và cũng
dễ kiểm tra nhất: cuối ngày mình tự hỏi là biết ngay hôm nay mình có sống đúng
bốn chữ đó hay không.
""")

# ------------------------------------------------- 10. Quiz
s = new_slide(prs, CHARCOAL)
kicker(s, "6 · Trạm thách thức", dark=True)
title(s, "Quiz 5 tình huống: chọn rồi mới được giải thích", color=CREAM, size=30)
rule(s)
cy = 1.95
for i, q in enumerate(quiz, start=1):
    correct = next(o for o in q["options"] if o["correct"])
    rect(s, 0.9, cy, 11.53, 0.84, fill=CHARCOAL_SOFT, rounded=True, adj=0.1)
    oval(s, 1.12, cy + 0.22, 0.38, 0.38, fill=GOLD)
    text(s, 1.12, cy + 0.29, 0.38, 0.26, [[(str(i), 12, CHARCOAL, True)]], align=PP_ALIGN.CENTER, space_after=0)
    prompt = clip(q["prompt"], 112)
    text(s, 1.72, cy + 0.14, 10.4, 0.32, [[(prompt, 11, CREAM, True)]], space_after=0)
    text(s, 1.72, cy + 0.5, 10.4, 0.26,
         [[("Đáp án đúng: ", 10, RGBColor(0xA9, 0xA2, 0x98)),
           (correct["id"].upper() + " — " + correct["text"], 10, GOLD_SOFT)]], space_after=0)
    cy += 0.93
text(s, 0.9, 6.62, 11.5, 0.35,
     [[("Mỗi câu đều có phần giải thích nối về một sự kiện lịch sử hoặc một giá trị — "
        "không có câu nào chỉ \"đúng/sai\".", 11.5, RGBColor(0xA9, 0xA2, 0x98), False, SANS, True)]],
     space_after=0)
notes(s, """
[10:20 – 11:20 | QUIZ]

Trạm thứ ba là phần em nghĩ sẽ khiến lớp tham gia nhiều nhất: năm câu hỏi tình huống.

Ví dụ câu một: bạn vừa mất một cơ hội việc làm mơ ước vì thiếu một kỹ năng nhỏ —
bạn làm gì? Đáp án đúng là xác định đúng kỹ năng còn thiếu và tự học trong ba mươi
ngày tới. Phần giải thích nhắc rằng Bác từng tự học tiếng Anh, tiếng Pháp, tiếng
Nga ngay trong lúc làm những công việc chân tay vất vả nhất.

Câu em thích nhất là câu năm, rất thời sự: AI có thể viết giúp bạn gần như trọn
vẹn một bài luận, vậy theo tinh thần "dĩ bất biến, ứng vạn biến" thì nên làm gì?
Đáp án không phải là dùng AI rồi nộp nguyên văn, cũng không phải tẩy chay AI, mà
là dùng AI như công cụ hỗ trợ nhưng tự mình tư duy, kiểm chứng và chịu trách nhiệm
với nội dung cuối cùng.

Điểm quan trọng về mặt sư phạm: không câu nào chỉ nói "đúng" hay "sai". Câu nào
cũng có phần giải thích nối về một sự kiện lịch sử hoặc một giá trị cụ thể.
""")

# ------------------------------------------------- 11. Quotes
s = new_slide(prs)
kicker(s, "6 · Trạm thách thức (tiếp)")
title(s, "Thẻ trích dẫn lật 3D: câu nói, nguồn, bài học", size=30)
rule(s)
cw, chh = 5.65, 2.28
for i, q in enumerate(quotes):
    x = 0.9 + (i % 2) * (cw + 0.23)
    y = 2.0 + (i // 2) * (chh + 0.22)
    rect(s, x, y, cw, chh, fill=BURGUNDY, rounded=True, adj=0.06)
    rect(s, x, y, cw, chh, fill=None, line=GOLD, line_w=1.0, rounded=True, adj=0.06)
    text(s, x + 0.35, y + 0.3, cw - 0.7, 1.2,
         [[("\u201c" + q["front"] + "\u201d", 15.5, CREAM, True, SERIF)]], space_after=0)
    text(s, x + 0.35, y + 1.55, cw - 0.7, 0.5, [[(q["source"], 10.5, GOLD_SOFT)]], space_after=0)
    text(s, x + 0.35, y + 1.9, cw - 0.7, 0.3,
         [[("Lật thẻ → bài học ứng dụng", 9.5, RGBColor(0xE8, 0xC9, 0xC9), False, SANS, True)]], space_after=0)
notes(s, """
[11:20 – 12:00 | TRÍCH DẪN]

Phần cuối cùng của website là bốn thẻ trích dẫn, thiết kế theo kiểu thẻ lật ba
chiều. Mặt trước là câu nói, ví dụ: "Không có việc gì khó, chỉ sợ lòng không bền",
hoặc "Học hỏi là một việc phải tiếp tục suốt đời", hay câu về đại đoàn kết.

Khi lật ra mặt sau, người xem thấy hai thứ: nguồn của câu nói — ví dụ thơ tặng
thanh niên xung phong năm 1950, hay thư gửi học viên trường Nguyễn Ái Quốc năm
1949 — và một đoạn bài học ứng dụng.

Có cả nút "Chia sẻ / Lưu câu nói": trên điện thoại thì mở hộp chia sẻ của hệ điều
hành, trên máy tính thì copy vào clipboard. Mục đích rất thực dụng: để một câu
nói hay có thể đi tiếp ra khỏi trang web, vào story hoặc vào nhóm lớp.
""")

# ------------------------------------------------- 12. Công nghệ
s = new_slide(prs)
kicker(s, "7 · Công nghệ")
title(s, "Dựng bằng công cụ mã nguồn mở, chi phí 0 đồng", size=30)
rule(s)
stack = [
    ("Giao diện & render", "Next.js 14 (App Router) · React 18 · TypeScript 5.5"),
    ("Đồ hoạ 3D", "three.js 0.165 · React Three Fiber 8.16 · drei 9.108"),
    ("Chuyển động", "Framer Motion 11 (cuộn tới đâu, hiện tới đó)"),
    ("Thiết kế", "Tailwind CSS 3.4 + bảng màu burgundy · gold · cream"),
    ("Dữ liệu", "4 file JSON tĩnh — không cần database"),
    ("Kiểu chữ", "Playfair Display + Inter (subset tiếng Việt)"),
]
cy = 2.0
for h, b in stack:
    rect(s, 0.9, cy, 7.3, 0.66, fill=CREAM_DIM, rounded=True, adj=0.16)
    text(s, 1.15, cy + 0.19, 2.35, 0.3, [[(h, 11.5, BURGUNDY, True)]], space_after=0)
    text(s, 3.55, cy + 0.19, 4.5, 0.3, [[(b, 11, CHARCOAL)]], space_after=0)
    cy += 0.78
rect(s, 8.55, 2.0, 3.88, 4.5, fill=CHARCOAL, rounded=True, adj=0.04)
text(s, 8.9, 2.28, 3.2, 0.3, [[("VÌ SAO KHÔNG DÙNG SPLINE?", 11, GOLD, True)]], space_after=0)
text(s, 8.9, 2.7, 3.25, 3.5, [
    [("Hero và quả địa cầu được dựng bằng ", 12, CREAM), ("hình học thủ tục", 12, GOLD_SOFT, True),
     (" trong code, không dùng file cảnh 3D bên ngoài.", 12, CREAM)],
    [("→ Không phụ thuộc asset ngoài, không cần API key, không lo link hết hạn.", 11.5, RGBColor(0xA9, 0xA2, 0x98))],
    [("→ Tải nhẹ hơn và chạy được cả trên máy cấu hình thấp.", 11.5, RGBColor(0xA9, 0xA2, 0x98))],
    [("→ Toàn bộ ~1.450 dòng TS/TSX nằm trong 9 file, dễ đọc, dễ sửa, dễ chấm.", 11.5, RGBColor(0xA9, 0xA2, 0x98))],
], space_after=8)
notes(s, """
[12:00 – 13:00 | CÔNG NGHỆ]

Về phần kỹ thuật, em xin trình bày rất nhanh vì trọng tâm của môn học là tư tưởng.

Website dựng bằng Next.js phiên bản mười bốn với App Router, React mười tám và
TypeScript. Đồ hoạ ba chiều dùng three.js kết hợp React Three Fiber. Chuyển động
dùng Framer Motion. Giao diện dùng Tailwind CSS với một bảng màu riêng: đỏ đô,
kem, vàng gold và than — gợi cảm giác trang trọng, không giống một trang giải trí.

Điểm em muốn nhấn mạnh là toàn bộ đều là mã nguồn mở, miễn phí, nên bất kỳ trường
nào cũng có thể nhân bản mô hình này.

Còn khung bên phải trả lời một câu hỏi kỹ thuật: vì sao không dùng Spline — một
công cụ làm 3D kéo thả rất phổ biến? Vì em dựng quả địa cầu và biểu tượng bằng
hình học thủ tục ngay trong code. Lợi thế là không phụ thuộc asset bên ngoài,
không cần API key, không lo link hết hạn sau hai năm, và tải nhẹ hơn.
""")

# ------------------------------------------------- 13. Data-driven
s = new_slide(prs)
kicker(s, "7 · Công nghệ (tiếp)")
title(s, "Kiến trúc data-driven: sửa JSON là đổi nội dung", size=30)
rule(s)
rect(s, 0.9, 2.0, 6.0, 4.45, fill=CHARCOAL, rounded=True, adj=0.04)
tree = [
    "soiduong/",
    "├── app/",
    "│   ├── layout.tsx      font + metadata",
    "│   ├── page.tsx        ghép 4 trạm",
    "│   └── globals.css     màu, reduced-motion, flip-card",
    "├── components/         7 component",
    "│   ├── Hero3D.tsx      búa – liềm 3D",
    "│   ├── GlobeSection.tsx  quả địa cầu + mốc (709 dòng)",
    "│   ├── GenZCards.tsx   3 thẻ nghiêng 3D",
    "│   ├── QuizGame.tsx    quiz 5 câu",
    "│   └── QuoteGallery.tsx thẻ lật 3D",
    "└── data/               NỘI DUNG NẰM Ở ĐÂY",
    "    ├── timeline.json   13 mốc × 14 trường",
    "    ├── genz-cards.json 3 bài học",
    "    ├── quiz.json       5 câu hỏi",
    "    └── quotes.json     4 trích dẫn",
]
text(s, 1.2, 2.28, 5.5, 4.0, [[(ln, 11.5, GOLD_SOFT if "data" in ln or "NỘI DUNG" in ln else CREAM,
                               "data" in ln, MONO)] for ln in tree], space_after=3, line_spacing=1.06)
right = [
    ("Nội dung tách khỏi giao diện",
     "Muốn thêm mốc lịch sử mới? Chỉ cần thêm một khối JSON. Không phải mở file giao diện, không sợ làm hỏng bố cục."),
    ("Mỗi mốc là một cấu trúc 14 trường",
     "year, period, place, lat, lng, lesson, historicalContext, whyItMatters, modernApplication, sourceNote, ảnh + chú thích."),
    ("Ý nghĩa sư phạm",
     "Một giảng viên hoặc một nhóm sinh viên khác có thể tiếp quản, bổ sung mốc, chỉnh lời khuyên — dự án sống tiếp sau khi em nộp bài."),
]
cy = 2.0
for h, b in right:
    rect(s, 7.2, cy, 5.23, 1.42, fill=CREAM_DIM, rounded=True, adj=0.06)
    rect(s, 7.2, cy, 0.07, 1.42, fill=GOLD)
    text(s, 7.5, cy + 0.18, 4.7, 0.35, [[(h, 13.5, BURGUNDY, True)]], space_after=0)
    text(s, 7.5, cy + 0.58, 4.75, 0.8, [[(b, 11.5, CHARCOAL)]], space_after=0)
    cy += 1.55
notes(s, """
[13:00 – 13:50 | KIẾN TRÚC]

Về cách tổ chức mã nguồn, em tách nội dung ra khỏi giao diện.

Bên trái là cây thư mục. Toàn bộ chữ nghĩa, mốc lịch sử, câu hỏi, trích dẫn đều
nằm trong bốn file JSON ở thư mục data. Các file component chỉ lo hiển thị.

Điều đó có nghĩa là: muốn thêm một mốc lịch sử mới, em chỉ cần thêm một khối JSON,
không phải đụng vào giao diện. Mỗi mốc là một cấu trúc mười bốn trường — năm, giai
đoạn, địa danh, toạ độ, bài học, bối cảnh, ý nghĩa, gợi ý hôm nay, ghi chú nguồn,
và ảnh kèm chú thích.

Em muốn nhấn mạnh ý nghĩa sư phạm của việc này: đây là một dự án có thể tiếp quản.
Một nhóm sinh viên khoá sau hoàn toàn có thể bổ sung mốc, chỉnh lại lời khuyên cho
hợp với bối cảnh mới, mà không cần biết lập trình ba chiều.
""")

# ------------------------------------------------- 14. UX & tiếp cận
s = new_slide(prs)
kicker(s, "8 · Trải nghiệm & tiếp cận")
title(s, "Không chỉ đẹp — mà ai cũng phải dùng được", size=30)
rule(s)
items = [
    ("Tôn trọng người nhạy cảm với chuyển động",
     "Bật \"prefers-reduced-motion\" ở hệ điều hành là toàn bộ animation tự tắt, quả địa cầu ngừng tự xoay."),
    ("Hiệu năng trên máy yếu và điện thoại",
     "Giới hạn độ phân giải render (dpr 1–1.5), Canvas thu nhỏ theo breakpoint, ảnh tải lazy."),
    ("Không chặn lần tải đầu",
     "Hai cảnh 3D nặng được nạp động, chỉ render phía client, có khung chờ sẵn chỗ."),
    ("Truy cập bằng bàn phím",
     "Mọi nút có khung focus màu vàng và nhãn aria — không có chuột vẫn thao tác được."),
    ("Không bao giờ \"chết\" vì ảnh",
     "Ảnh tư liệu lỗi mạng thì tự thay bằng khung thông báo, nội dung chữ vẫn đầy đủ."),
    ("Ngôn ngữ nhất quán",
     "html lang=\"vi\", tiêu đề và mô tả trang viết tiếng Việt đầy đủ dấu, dùng cho chia sẻ và tìm kiếm."),
]
cw, chh = 5.65, 1.36
for i, (h, b) in enumerate(items):
    x = 0.9 + (i % 2) * (cw + 0.23)
    y = 2.0 + (i // 2) * (chh + 0.18)
    rect(s, x, y, cw, chh, fill=CREAM, line=RGBColor(0xE0, 0xD9, 0xCC), line_w=1.0, rounded=True, adj=0.08)
    oval(s, x + 0.28, y + 0.34, 0.16, 0.16, fill=GOLD)
    text(s, x + 0.62, y + 0.2, cw - 0.95, 0.35, [[(h, 12.5, BURGUNDY, True)]], space_after=0)
    text(s, x + 0.62, y + 0.58, cw - 0.95, 0.7, [[(b, 11, CHARCOAL)]], space_after=0)
notes(s, """
[13:50 – 14:40 | TRẢI NGHIỆM VÀ TIẾP CẬN]

Phần này em nói ngắn, nhưng em coi đây là tiêu chí đánh giá một sản phẩm học liệu
có trách nhiệm.

Thứ nhất, tôn trọng người nhạy cảm với chuyển động: nếu hệ điều hành đang bật chế
độ giảm chuyển động, toàn bộ animation tự tắt, quả địa cầu ngừng tự xoay.

Thứ hai, hiệu năng: em giới hạn độ phân giải render, thu nhỏ Canvas trên điện
thoại, và tải ảnh theo kiểu lazy để máy yếu vẫn chạy được — vì em biết không phải
bạn nào trong lớp cũng có laptop mạnh.

Thứ ba, hai cảnh ba chiều nặng được nạp động và chỉ render ở trình duyệt, nên
trang vẫn hiện chữ ngay lập tức.

Thứ tư, mọi nút đều có khung focus và nhãn aria, nghĩa là người dùng bàn phím hoặc
công cụ đọc màn hình vẫn thao tác được.

Và thứ năm, nếu ảnh tư liệu không tải được, website tự thay bằng một khung thông
báo chứ không hiện biểu tượng ảnh vỡ.
""")

# ------------------------------------------------- 15. Trung thực tư liệu
s = new_slide(prs)
kicker(s, "9 · Tính học thuật")
title(s, "Trung thực tư liệu: \"lời Bác\" hay \"tinh thần của Bác\"?", size=28)
rule(s)
rect(s, 0.9, 2.0, 11.53, 1.25, fill=BURGUNDY, rounded=True, adj=0.06)
text(s, 1.25, 2.2, 10.9, 0.35, [[("GHI CHÚ LỊCH SỬ HIỂN THỊ NGAY TRÊN TRANG CHỦ", 10.5, GOLD_SOFT, True)]], space_after=0)
text(s, 1.25, 2.58, 10.9, 0.6,
     [[("\"Một số câu nói và bài học ở đây được rút ra từ tư tưởng, lời nói và hành động "
        "của Người, không phải lúc nào cũng là trích dẫn nguyên văn.\"", 13.5, CREAM, False, SERIF, True)]],
     space_after=0)
three = [
    ("Mọi mốc có dòng \"Ghi chú tư liệu\"",
     "Nêu rõ mốc thời gian và địa điểm được ghi nhận, để người đọc biết website dựa trên cứ liệu nào."),
    ("Mọi trích dẫn có nguồn cụ thể",
     "Thơ tặng thanh niên xung phong 1950, thư gửi học viên trường Nguyễn Ái Quốc 1949, diễn văn 1961…"),
    ("Ảnh tư liệu có ghi rõ nơi lưu trữ",
     "Ảnh lấy từ Wikimedia Commons, kèm chú thích ngữ cảnh, không dùng ảnh không rõ nguồn."),
]
cw = 3.68
for i, (h, b) in enumerate(three):
    x = 0.9 + i * (cw + 0.24)
    rect(s, x, 3.5, cw, 2.05, fill=CREAM_DIM, rounded=True, adj=0.06)
    rect(s, x, 3.5, cw, 0.07, fill=GOLD)
    text(s, x + 0.3, 3.78, cw - 0.6, 0.65, [[(h, 13, BURGUNDY, True)]], space_after=0)
    text(s, x + 0.3, 4.5, cw - 0.6, 1.0, [[(b, 11.5, CHARCOAL)]], space_after=0)
rect(s, 0.9, 5.8, 11.53, 0.8, fill=CREAM, line=BURGUNDY, line_w=1.2, rounded=True, adj=0.12)
text(s, 1.2, 6.0, 11.0, 0.5,
     [[("Giới hạn em tự nhận: ", 12.5, BURGUNDY, True),
       ("đây là sản phẩm học liệu do sinh viên thực hiện, phần \"gợi ý hôm nay\" là cách "
        "diễn giải của em, cần được thầy cô và giáo trình kiểm chứng thêm.", 12.5, CHARCOAL)]],
     space_after=0)
notes(s, """
[14:40 – 15:40 | TÍNH HỌC THUẬT]

Phần này em xin phép nói chậm hơn một chút, vì em nghĩ đây là chỗ một sản phẩm về
tư tưởng Hồ Chí Minh dễ mắc lỗi nhất: gán cho Bác những câu nói không có thật,
hoặc trích dẫn sai nguồn.

Ngay trên trang chủ, em đặt một khung "Ghi chú lịch sử", nói rõ rằng một số câu nói
và bài học ở đây được rút ra từ tư tưởng, lời nói và hành động của Người, và không
phải lúc nào cũng là trích dẫn nguyên văn.

Cụ thể hơn: mỗi mốc đều có dòng "Ghi chú tư liệu" ghi rõ mốc thời gian và địa điểm
được ghi nhận. Bốn câu trích dẫn đều có nguồn cụ thể — thơ tặng thanh niên xung
phong năm 1950, thư gửi học viên trường Nguyễn Ái Quốc năm 1949, diễn văn năm 1961.
Ảnh tư liệu đều lấy từ Wikimedia Commons và có chú thích.

Và cuối cùng, em xin tự nhận giới hạn: đây là sản phẩm học liệu của một sinh viên.
Phần "gợi ý hôm nay" là cách diễn giải của em. Em rất mong nhận được góp ý của
thầy cô để phần đó bám sát giáo trình hơn.
""")

# ------------------------------------------------- 16. Hạn chế & hướng phát triển
s = new_slide(prs)
kicker(s, "10 · Hạn chế & hướng phát triển")
title(s, "Còn thiếu gì, và có thể đi tới đâu?", size=32)
rule(s)
rect(s, 0.9, 2.0, 5.6, 4.35, fill=CREAM_DIM, rounded=True, adj=0.04)
rect(s, 0.9, 2.0, 5.6, 0.09, fill=BURGUNDY)
text(s, 1.2, 2.3, 5.0, 0.35, [[("HẠN CHẾ HIỆN TẠI", 11.5, BURGUNDY, True)]], space_after=0)
bullets(s, 1.2, 2.8, 5.0, [
    ("Chưa đối chiếu giáo trình chương nào ", "ứng với mốc nào một cách tường minh."),
    ("Phần \"gợi ý hôm nay\" ", "là diễn giải cá nhân, chưa qua phản biện học thuật."),
    ("Cảnh 3D và ảnh tư liệu cần mạng ", "texture Trái Đất tải từ threejs.org, ảnh từ Wikimedia — mạng yếu thì quả địa cầu có thể không hiện."),
    ("Chưa có bản tiếng Anh ", "cho sinh viên quốc tế hoặc lớp liên kết."),
    ("Chưa đo được hiệu quả ", "vì chưa khảo sát người học trước và sau khi dùng."),
], size=12.5, dot_color=BURGUNDY)
rect(s, 6.85, 2.0, 5.58, 4.35, fill=CHARCOAL, rounded=True, adj=0.04)
rect(s, 6.85, 2.0, 5.58, 0.09, fill=GOLD)
text(s, 7.15, 2.3, 5.0, 0.35, [[("HƯỚNG PHÁT TRIỂN", 11.5, GOLD, True)]], space_after=0)
bullets(s, 7.15, 2.8, 5.0, [
    ("Thêm trang chi tiết theo chương ", "/chuong/[slug] để bám sát 6 chương giáo trình."),
    ("Xuất ảnh wallpaper thật ", "từ thẻ trích dẫn (Canvas API) để lan toả tốt hơn."),
    ("Bổ sung chế độ cho giảng viên: ", "bật/tắt câu hỏi, chiếu từng mốc theo giáo án."),
    ("Đóng gói tư liệu nguồn ", "kèm mục tham khảo đầy đủ cho phần kiểm chứng."),
    ("Khảo sát thử ở 1–2 lớp ", "để có số liệu đánh giá tác động thật."),
], size=12.5, dot_color=GOLD, text_color=CREAM)
notes(s, """
[15:40 – 16:30 | HẠN CHẾ VÀ HƯỚNG PHÁT TRIỂN]

Em xin trình bày thẳng thắn phần hạn chế, vì em nghĩ một báo cáo học thuật cần
phần này.

Thứ nhất, em chưa đối chiếu một cách tường minh mốc nào ứng với chương nào trong
giáo trình. Thứ hai, phần "gợi ý hôm nay" là diễn giải của cá nhân em, chưa qua
phản biện. Thứ ba, cảnh 3D và ảnh tư liệu vẫn phụ thuộc nguồn ngoài — texture Trái
Đất tải từ threejs.org, ảnh từ Wikimedia — nên mạng yếu thì quả địa cầu có thể
không hiện. Thứ tư, chưa có bản tiếng Anh. Và thứ năm — quan trọng nhất — em chưa
có số liệu về hiệu quả, vì chưa khảo sát người học trước và sau khi dùng.

Về hướng phát triển: em muốn thêm trang chi tiết theo từng chương để bám sát sáu
chương giáo trình; cho phép xuất ảnh wallpaper từ thẻ trích dẫn; bổ sung một chế
độ dành riêng cho giảng viên để chiếu theo giáo án; và quan trọng là khảo sát thử
ở một hai lớp để có số liệu thật.
""")

# ------------------------------------------------- 17. Demo
s = new_slide(prs, CHARCOAL)
kicker(s, "11 · Demo trực tiếp", dark=True)
title(s, "Chạy thử trong 90 giây", color=CREAM)
rule(s)
rect(s, 0.9, 2.0, 5.5, 2.3, fill=RGBColor(0x10, 0x0F, 0x0D), rounded=True, adj=0.05)
text(s, 1.2, 2.28, 5.0, 1.8, [
    [("$ npm install", 13, GOLD_SOFT, False, MONO)],
    [("$ npm run dev", 13, GOLD_SOFT, False, MONO)],
    [("▲ Next.js 14.2.5", 11.5, RGBColor(0xA9, 0xA2, 0x98), False, MONO)],
    [("- Local: http://localhost:3000", 11.5, RGBColor(0xA9, 0xA2, 0x98), False, MONO)],
], space_after=7)
text(s, 0.9, 4.5, 5.5, 1.5, [
    [("Không cần database. Không cần API key.", 12.5, CREAM)],
    [("Chỉ cần Node.js và hai lệnh trên.", 12.5, CREAM)],
], space_after=6)
steps = [
    ("Trang chủ", "để biểu tượng búa – liềm xoay theo con trỏ; đọc câu định vị và ghi chú lịch sử."),
    ("Quả địa cầu", "để tự chạy 2–3 mốc, rồi bấm lọc \"Tổ chức\" và phóng to mốc 1930."),
    ("Góc Gen Z", "nghiêng thẻ, bấm \"Đọc thêm\" ở thẻ Cần – Kiệm – Liêm – Chính."),
    ("Quiz", "mời 1 bạn trong lớp trả lời câu hỏi về AI, cho hiện phần giải thích."),
    ("Trích dẫn", "lật 1 thẻ, chỉ vào nguồn, rồi bấm nút chia sẻ."),
]
cy = 2.0
for i, (h, b) in enumerate(steps, start=1):
    oval(s, 6.75, cy + 0.03, 0.34, 0.34, fill=GOLD)
    text(s, 6.75, cy + 0.09, 0.34, 0.24, [[(str(i), 11, CHARCOAL, True)]], align=PP_ALIGN.CENTER, space_after=0)
    text(s, 7.25, cy, 5.15, 0.8, [[(h + " — ", 12.5, CREAM, True), (b, 12, RGBColor(0xC9, 0xC2, 0xB8))]],
         space_after=0)
    cy += 0.87
notes(s, """
[16:30 – 18:00 | DEMO]

Bây giờ em xin phép chuyển sang demo trực tiếp.

Trang chủ: em di chuột để mọi người thấy biểu tượng búa – liềm xoay theo con trỏ.
Đây là biểu tượng của giai cấp công nhân và nông dân, cũng là hình ảnh mở đầu cho
toàn bộ hành trình.

Quả địa cầu: em để nó tự chạy hai, ba mốc. Mọi người thấy nó tự chuyển và phần
thông tin bên phải tự cập nhật. Bây giờ em lọc theo giai đoạn "Tổ chức" và phóng
to mốc 1930 ở Hồng Kông.

Góc Gen Z: em nghiêng thẻ theo chuột, và bấm "Đọc thêm".

Quiz: ở đây em xin mời một bạn trả lời giúp câu hỏi về AI… (chờ bạn trả lời)
Đúng rồi, và đây là phần giải thích.

Cuối cùng là thẻ trích dẫn: em lật thẻ, chỉ vào nguồn, và bấm nút chia sẻ.

Đó là toàn bộ website. Em xin quay lại phần kết luận.
""")

# ------------------------------------------------- 18. Kết luận
s = new_slide(prs, BURGUNDY)
rect(s, 0, 0, SW, 0.16, fill=GOLD)
rect(s, 0, 7.34, SW, 0.16, fill=GOLD)
text(s, 0.9, 0.9, 11.4, 0.4, [[("KẾT LUẬN", 12.5, GOLD_SOFT, True)]], space_after=0)
text(s, 0.9, 1.35, 11.5, 1.5,
     [[("Tư tưởng không nằm yên trong trang sách.", 32, CREAM, True, SERIF)],
      [("Nó sống khi người trẻ biết biến nó thành một lựa chọn cụ thể.", 26, GOLD_SOFT, True, SERIF)]],
     space_after=4)
rect(s, 0.9, 3.15, 2.2, 0.035, fill=GOLD)
take = [
    ("Một cách học mới",
     "Lịch sử → bài học → việc hôm nay. Cùng một nội dung, nhưng đầu ra là hành vi."),
    ("Một sản phẩm có thể tiếp quản",
     "Toàn bộ nội dung nằm trong file JSON; nhóm sau có thể bổ sung và phát triển tiếp."),
    ("Một lời tự nhắc",
     "Kim chỉ nam chỉ có ý nghĩa khi nó đổi được một quyết định thật của ngày mai."),
]
cw = 3.68
for i, (h, b) in enumerate(take):
    x = 0.9 + i * (cw + 0.24)
    rect(s, x, 3.55, cw, 2.15, fill=RGBColor(0x75, 0x00, 0x00), rounded=True, adj=0.06)
    rect(s, x, 3.55, cw, 0.07, fill=GOLD)
    text(s, x + 0.3, 3.85, cw - 0.6, 0.5, [[(h, 15, GOLD_SOFT, True, SERIF)]], space_after=0)
    text(s, x + 0.3, 4.45, cw - 0.6, 1.1, [[(b, 12, CREAM)]], space_after=0)
text(s, 0.9, 6.05, 11.5, 0.5,
     [[("Em xin trân trọng cảm ơn thầy/cô và các bạn đã lắng nghe — em rất mong nhận được góp ý.",
        15, CREAM, False, SERIF, True)]], space_after=0)
notes(s, """
[18:00 – 19:00 | KẾT LUẬN]

Em xin kết lại bằng ba điều.

Thứ nhất, website này thử nghiệm một cách học: đi từ lịch sử, đến bài học, rồi đến
việc của hôm nay. Cùng một nội dung tư tưởng, nhưng đầu ra không phải một khái
niệm để thuộc, mà là một hành vi để làm.

Thứ hai, đây là một sản phẩm mở: toàn bộ nội dung nằm trong file JSON, nên một
nhóm sinh viên khác hoàn toàn có thể tiếp quản và phát triển tiếp.

Thứ ba, và cũng là điều em tự nhắc mình: kim chỉ nam chỉ thực sự có ý nghĩa khi nó
đổi được một quyết định thật của ngày mai — một cách mình dùng thời gian, một cách
mình tiêu tiền, một cách mình ghi nguồn bài của người khác, một cách mình dùng AI.

Em xin trân trọng cảm ơn thầy/cô và các bạn đã lắng nghe. Em rất mong nhận được
góp ý để hoàn thiện sản phẩm này.
""")

prs.save(OUT)
print(f"Đã tạo: {OUT}")
print(f"Số slide: {len(prs.slides.__iter__.__self__._sldIdLst)}")
