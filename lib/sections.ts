/**
 * Danh sách mục của trang, dùng chung cho header, thanh điều hướng nhanh và
 * "mục lục" ở hero — để không phải sửa nhiều nơi khi thêm/bớt mục.
 */
export type SectionInfo = {
  id: string;
  label: string;
  /** Nhãn rất ngắn, hiện trên thanh điều hướng khi màn hình hẹp. */
  short: string;
  /** Một dòng mô tả mục này có gì. */
  blurb: string;
};

export const SECTIONS: SectionInfo[] = [
  {
    id: "hanh-trinh",
    label: "Hành trình",
    short: "13 mốc",
    blurb: "Quả cầu 3D với 13 mốc từ 1890 đến 1990.",
  },
  {
    id: "tu-tuong",
    label: "Sáu chuyên đề",
    short: "Chuyên đề",
    blurb: "Luận điểm, trích dẫn có nguồn, bảng kiểm chứng 12 trường hợp hay bị gán sai.",
  },
  {
    id: "kien-thuc-nen",
    label: "Ôn tập nền tảng",
    short: "Ôn tập",
    blurb: "12 thẻ flashcard: định nghĩa, cơ sở hình thành, năm thời kỳ, giá trị.",
  },
  {
    id: "goc-genz",
    label: "Góc Gen Z",
    short: "Gen Z",
    blurb: "Ba cách chuyển giá trị cũ thành thói quen hôm nay.",
  },
  {
    id: "thach-thuc",
    label: "Thách thức",
    short: "Thách thức",
    blurb: "7 câu tình huống, trò chơi “Câu này của ai?”, 8 thẻ trích dẫn.",
  },
  {
    id: "lo-trinh",
    label: "Lộ trình 7 ngày",
    short: "Lộ trình",
    blurb: "Mỗi ngày một chuyên đề và một việc nhỏ, có theo dõi tiến độ.",
  },
  {
    id: "so-tay",
    label: "Sổ tay ôn tập",
    short: "Sổ tay",
    blurb: "Nơi lưu trích dẫn, ghi chú và xuất ra Markdown hoặc PDF.",
  },
];
