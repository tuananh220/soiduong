"use client";

/**
 * Hiển thị nguồn của một trích dẫn kèm liên kết tra cứu.
 * Mục tiêu: người đọc tự bấm kiểm chứng được, thay vì phải tin vào lời khẳng định
 * “đã kiểm duyệt” của trang.
 */
export default function QuoteSource({
  source,
  sourceUrl,
  className = "",
  linkClassName = "",
}: {
  source: string;
  sourceUrl?: string;
  className?: string;
  linkClassName?: string;
}) {
  return (
    <span className={className}>
      {source}
      {sourceUrl ? (
        <>
          {" "}
          <a
            href={sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={
              linkClassName ||
              "focus-ring font-medium text-burgundy underline decoration-burgundy/30 underline-offset-2 hover:decoration-burgundy"
            }
          >
            Xem nguồn ↗
          </a>
        </>
      ) : null}
    </span>
  );
}
