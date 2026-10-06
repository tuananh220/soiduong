"use client";

import { useMemo, useState } from "react";
import quotes from "@/data/quotes.json";
import { removeFromNotebook, saveToNotebook, useNotebook } from "@/lib/notebook";

const FILTERS = ["Tất cả", ...Array.from(new Set(quotes.map((quote) => quote.topic)))];

function QuoteCard({ quote }: { quote: (typeof quotes)[number] }) {
  const [flipped, setFlipped] = useState(false);
  const [shared, setShared] = useState(false);
  const { items } = useNotebook();
  const itemId = `gallery-${quote.id}`;
  const saved = items.some((item) => item.id === itemId);

  async function handleShare() {
    const shareText = `“${quote.front}” — Hồ Chí Minh\n(${quote.source})`;
    if (navigator.share) {
      try {
        await navigator.share({ text: shareText, title: "Soi Đường" });
        return;
      } catch {
        // người dùng huỷ chia sẻ — không xử lý gì
      }
    }
    if (navigator.clipboard) {
      try {
        await navigator.clipboard.writeText(shareText);
        setShared(true);
        setTimeout(() => setShared(false), 2200);
      } catch {
        setShared(false);
      }
    }
  }

  return (
    <div className="flip-scene relative h-72 w-full">
      {/* Thẻ lật là <div>: bấm/kéo ở bất kỳ đâu cũng lật, còn các hành động bên
          trong là <button> thật (không lồng nút trong nút như trước). */}
      <div
        onClick={() => setFlipped((value) => !value)}
        className={`flip-card absolute inset-0 ${flipped ? "is-flipped" : ""}`}
      >
        {/* Mặt trước */}
        <div className="flip-face absolute inset-0 flex flex-col justify-between rounded-2xl border border-gold/30 bg-gradient-to-br from-burgundy to-burgundy-deep p-6 shadow-gold">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full border border-cream/25 px-2.5 py-0.5 text-[10px] uppercase tracking-wideish text-cream/70">
                {quote.topic}
              </span>
              <span className="rounded-full bg-cream/10 px-2.5 py-0.5 text-[10px] font-medium text-gold/90">
                {quote.level}
              </span>
            </div>
            <p className="mt-4 font-serif text-lg font-medium leading-snug text-cream sm:text-xl">
              “{quote.front}”
            </p>
          </div>
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              setFlipped(true);
            }}
            aria-expanded={flipped}
            className="focus-ring w-fit rounded-full border border-gold/50 px-3 py-1.5 text-[11px] font-medium text-gold transition-colors hover:bg-gold/10"
          >
            Xem nguồn &amp; bài học
          </button>
        </div>

        {/* Mặt sau */}
        <div className="flip-face flip-face-back absolute inset-0 flex flex-col justify-between rounded-2xl border border-gold/40 bg-charcoal p-6">
          <div className="overflow-y-auto pr-1">
            <p className="text-[10px] uppercase tracking-wideish text-gold/80">Nguồn</p>
            <p className="mt-1 text-xs leading-relaxed text-cream/70">{quote.source}</p>
            <p className="mt-3 text-sm leading-relaxed text-cream/85">{quote.back}</p>
          </div>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                handleShare();
              }}
              className="focus-ring w-fit rounded-full border border-gold/60 px-3 py-1.5 text-[11px] font-medium text-gold hover:bg-gold/10"
            >
              {shared ? "Đã sao chép ✓" : "Chia sẻ câu nói"}
            </button>
            <button
              type="button"
              aria-pressed={saved}
              onClick={(event) => {
                event.stopPropagation();
                if (saved) {
                  removeFromNotebook(itemId);
                  return;
                }
                saveToNotebook({
                  id: itemId,
                  kind: "quote",
                  title: quote.front,
                  source: quote.source,
                  topicTitle: quote.topic,
                });
              }}
              className={`focus-ring w-fit rounded-full border px-3 py-1.5 text-[11px] font-medium ${
                saved
                  ? "border-gold bg-gold/20 text-cream"
                  : "border-cream/25 text-cream/70 hover:border-cream/50"
              }`}
            >
              {saved ? "✓ Trong sổ tay" : "+ Sổ tay ôn tập"}
            </button>
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                setFlipped(false);
              }}
              className="focus-ring ml-auto text-[11px] text-cream/50 underline decoration-cream/20 underline-offset-4 hover:text-cream"
            >
              Lật lại
            </button>
          </div>
        </div>
      </div>

      {/* Thông báo cho trình đọc màn hình khi thẻ được lật. */}
      <span className="sr-only" aria-live="polite">
        {flipped ? `Đã lật thẻ trích dẫn. Nguồn: ${quote.source}` : ""}
      </span>
    </div>
  );
}

export default function QuoteGallery() {
  const [filter, setFilter] = useState("Tất cả");
  const visible = useMemo(
    () => quotes.filter((quote) => filter === "Tất cả" || quote.topic === filter),
    [filter],
  );

  return (
    <div className="mt-8">
      <div
        className="flex flex-wrap justify-center gap-2"
        role="group"
        aria-label="Lọc trích dẫn theo chuyên đề"
      >
        {FILTERS.map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => setFilter(option)}
            aria-pressed={filter === option}
            className={`focus-ring rounded-full border px-3 py-1.5 text-[11px] transition-colors ${
              filter === option
                ? "border-gold bg-gold/15 text-gold"
                : "border-cream/20 text-cream/60 hover:border-cream/45 hover:text-cream"
            }`}
          >
            {option}
          </button>
        ))}
      </div>

      <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2">
        {visible.map((quote) => (
          <QuoteCard key={quote.id} quote={quote} />
        ))}
      </div>

      <p className="mt-6 text-center text-[11px] text-cream/45">
        Mỗi câu đều ghi rõ tác phẩm, bối cảnh và mức độ nguyên văn. Xem mục “Kiểm chứng
        trích dẫn” ở phần Tư tưởng để biết những câu hay bị gán sai.
      </p>
    </div>
  );
}
