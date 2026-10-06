import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Soi Đường — Tư tưởng Hồ Chí Minh cho thế hệ trẻ",
  description:
    "Hành trình tương tác 3D khám phá tư tưởng Hồ Chí Minh qua các mốc lịch sử, sáu chuyên đề có nguồn kiểm chứng, bài học ứng dụng và thử thách tình huống dành cho Gen Z.",
  keywords: [
    "Tư tưởng Hồ Chí Minh",
    "học liệu tương tác",
    "Gen Z",
    "kiểm chứng trích dẫn",
  ],
  openGraph: {
    title: "Soi Đường — Tư tưởng Hồ Chí Minh cho thế hệ trẻ",
    description:
      "Sáu chuyên đề cốt lõi, mỗi trích dẫn đều ghi rõ nguồn; trải nghiệm 3D tương tác và sổ tay ôn tập ngay trên trình duyệt.",
    type: "website",
    locale: "vi_VN",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi">
      <head>
        {/*
          Font được nạp ở phía trình duyệt thay vì qua next/font: build không phụ
          thuộc mạng, và mọi bản triển khai (kể cả môi trường tách khỏi Internet
          lúc build) vẫn dựng được. Playfair Display + Inter đều có subset tiếng Việt.
        */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* eslint-disable-next-line @next/next/no-page-custom-font -- App Router:
            font toàn cục nằm trong layout gốc, không cần pages/_document. */}
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@500;600;700&family=Inter:wght@400;500;600&display=swap"
        />
      </head>
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
