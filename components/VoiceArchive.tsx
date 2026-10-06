"use client";

import audioGoc from "@/data/audio-goc.json";
import type { AudioGoc } from "@/lib/types";

/**
 * Danh sách tư liệu gốc có tiếng nói của Bác Hồ.
 *
 * Nguyên tắc: trang CHỈ liên kết tới kho lưu trữ chính thức, không sao chép file.
 * Lý do kép: tôn trọng bản quyền của đơn vị lưu trữ, và tránh các bản "giọng Bác"
 * do AI nhái hoặc gán sai sự kiện đang lan truyền trên mạng.
 *
 * Đặt trong <details> để không kéo dài trang — mở ra mới thấy danh sách.
 */
export default function VoiceArchive() {
  const entries = audioGoc as AudioGoc[];
  const audioItems = entries.filter((entry) => entry.kind === "audio");
  const videoItems = entries.filter((entry) => entry.kind === "video");

  function renderGroup(title: string, items: AudioGoc[], verb: string) {
    return (
      <div className="mt-5 first:mt-0">
        <h3 className="font-sans text-[11px] font-semibold uppercase tracking-wideish text-burgundy/80">
          {title} ({items.length})
        </h3>
        <ul className="mt-3 space-y-3">
          {items.map((entry) => (
            <li
              key={entry.id}
              className="rounded-xl border border-charcoal/10 bg-cream p-4"
            >
              <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                <h4 className="font-serif text-[15px] font-medium leading-snug text-charcoal">
                  {entry.title}
                </h4>
                <span className="rounded-full border border-charcoal/15 px-2 py-0.5 text-[10px] uppercase tracking-wideish text-charcoal/60">
                  {entry.date}
                </span>
              </div>

              <p className="mt-2 text-[13px] leading-relaxed text-charcoal/75">
                {entry.event}
              </p>

              {entry.note ? (
                <p className="mt-2 rounded-lg border-l-2 border-gold/60 bg-gold/[0.07] px-3 py-2 text-[11px] leading-relaxed text-charcoal/70">
                  {entry.note}
                </p>
              ) : null}

              <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-2">
                <a
                  href={entry.referenceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="focus-ring inline-flex items-center gap-1.5 rounded-full border border-burgundy/40 px-3.5 py-2 text-[11px] font-medium text-burgundy transition-colors hover:bg-burgundy/10"
                >
                  <span aria-hidden="true">{entry.kind === "audio" ? "🎧" : "🎬"}</span>
                  {verb} tại kho lưu trữ
                  <span aria-hidden="true">↗</span>
                  <span className="sr-only">(mở tab mới)</span>
                </a>
                <span className="text-[10px] text-charcoal/50">{entry.archive}</span>
              </div>
            </li>
          ))}
        </ul>
      </div>
    );
  }

  return (
    <details className="mt-3 w-full max-w-2xl rounded-2xl border border-burgundy/20 bg-burgundy/[0.04] px-4 py-3 text-left">
      <summary className="focus-ring cursor-pointer list-none">
        <span className="flex flex-wrap items-center gap-x-2 gap-y-1">
          <span aria-hidden="true">🎧</span>
          <span className="text-[13px] font-medium text-burgundy">
            Tiếng nói thật của Bác Hồ — {entries.length} tư liệu gốc
          </span>
          <span className="text-[11px] text-charcoal/55">
            nghe/xem tại kho lưu trữ chính thức
          </span>
        </span>
        <span className="mt-1 block text-[11px] text-charcoal/60">
          ▸ Bấm để mở danh sách
        </span>
      </summary>

      <div className="mt-4">
        <p className="text-[11px] leading-relaxed text-charcoal/70">
          Trang chỉ <strong className="font-semibold">liên kết</strong> tới kho lưu trữ
          của cơ quan chủ quản, không sao chép tệp về đây: vừa tôn trọng bản quyền của
          đơn vị lưu trữ, vừa tránh những bản “giọng Bác” do AI nhái hoặc gán sai sự
          kiện đang lan truyền. Hai clip ở trên là{" "}
          <strong className="font-semibold">giọng tổng hợp đọc lại</strong> kịch bản đã
          kiểm duyệt — không phải giọng Người.
        </p>

        {renderGroup("Bản ghi âm tiếng nói", audioItems, "Nghe")}
        {renderGroup("Phim tư liệu", videoItems, "Xem")}

        <p className="mt-5 text-[11px] text-charcoal/60">
          Xem toàn bộ kho:{" "}
          <a
            href="https://hochiminh.vn/tu-lieu-audio"
            target="_blank"
            rel="noopener noreferrer"
            className="focus-ring font-medium text-burgundy underline decoration-burgundy/30 underline-offset-2"
          >
            Tư liệu Audio ↗
          </a>{" "}
          ·{" "}
          <a
            href="https://hochiminh.vn/tu-lieu-video"
            target="_blank"
            rel="noopener noreferrer"
            className="focus-ring font-medium text-burgundy underline decoration-burgundy/30 underline-offset-2"
          >
            Tư liệu video ↗
          </a>{" "}
          (hochiminh.vn, do Văn phòng Trung ương Đảng quản lý).
        </p>
      </div>
    </details>
  );
}
