"use client";

import { useMemo, useState } from "react";
import cards from "@/data/kien-thuc-nen.json";
import {
  removeFromNotebook,
  saveToNotebook,
  useNotebook,
} from "@/lib/notebook";
import type { KnowledgeCard } from "@/lib/types";

const FILTERS = [
  { id: "all", label: "Tất cả 12 thẻ" },
  { id: "dinh-nghia", label: "Định nghĩa & cơ sở" },
  { id: "thoi-ky", label: "5 thời kỳ" },
  { id: "gia-tri", label: "Giá trị tư tưởng" },
] as const;

type FilterId = (typeof FILTERS)[number]["id"];

function matchFilter(card: KnowledgeCard, filter: FilterId) {
  if (filter === "all") return true;
  if (filter === "dinh-nghia") return card.id.startsWith("kn-dinh-nghia") || card.id.includes("co-so") || card.id.includes("chu-quan");
  if (filter === "thoi-ky") return card.id.startsWith("kn-thoi-ky");
  return card.id.startsWith("kn-gia-tri");
}

function Flashcard({ card, index }: { card: KnowledgeCard; index: number }) {
  const [flipped, setFlipped] = useState(false);
  const { items } = useNotebook();
  const itemId = `card-${card.id}`;
  const saved = items.some((item) => item.id === itemId);

  return (
    <div className="flex h-full flex-col">
      <div className="flip-scene relative h-64">
        <div
          onClick={() => setFlipped((value) => !value)}
          className={`flip-card absolute inset-0 ${flipped ? "is-flipped" : ""}`}
        >
          {/* Mặt trước: câu hỏi */}
          <div className="flip-face absolute inset-0 flex flex-col justify-between rounded-2xl border border-charcoal/12 bg-cream p-5">
            <div>
              <span className="text-[10px] font-semibold uppercase tracking-wideish text-burgundy/80">
                Thẻ {index + 1}
              </span>
              <p className="mt-3 font-serif text-[17px] font-medium leading-snug text-charcoal">
                {card.front}
              </p>
            </div>
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                setFlipped(true);
              }}
              aria-expanded={flipped}
              className="focus-ring w-fit rounded-full border border-charcoal/20 px-3 py-1.5 text-[11px] font-medium text-charcoal/70 hover:border-charcoal/45"
            >
              Xem đáp án
            </button>
          </div>

          {/* Mặt sau: đáp án + nguồn */}
          <div className="flip-face flip-face-back absolute inset-0 flex flex-col justify-between rounded-2xl border border-burgundy/25 bg-charcoal p-5">
            <div className="overflow-y-auto pr-1">
              <p className="text-sm leading-relaxed text-cream/90">{card.back}</p>
              <p className="mt-3 border-l-2 border-gold/50 pl-2 text-[11px] leading-relaxed text-cream/55">
                {card.source}
              </p>
            </div>
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  setFlipped(false);
                }}
                className="focus-ring text-[11px] text-cream/55 underline decoration-cream/20 underline-offset-4 hover:text-cream"
              >
                Lật lại
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
                    kind: "note",
                    title: card.front,
                    body: card.back,
                    topicTitle: "Thẻ kiến thức nền",
                  });
                }}
                className={`focus-ring ml-auto rounded-full border px-3 py-1.5 text-[11px] font-medium ${
                  saved
                    ? "border-gold bg-gold/20 text-cream"
                    : "border-cream/25 text-cream/70 hover:border-cream/50"
                }`}
              >
                {saved ? "✓ Trong sổ tay" : "+ Lưu vào sổ tay"}
              </button>
            </div>
          </div>
        </div>
        <span className="sr-only" aria-live="polite">
          {flipped ? `Đáp án: ${card.back}` : ""}
        </span>
      </div>
    </div>
  );
}

export default function KnowledgeCards() {
  const [filter, setFilter] = useState<FilterId>("all");
  const visible = useMemo(
    () => (cards as KnowledgeCard[]).filter((card) => matchFilter(card, filter)),
    [filter],
  );

  return (
    <section id="kien-thuc-nen" className="bg-cream px-6 py-20 sm:px-10 lg:px-16">
      <div className="mx-auto max-w-6xl">
        <p className="font-sans text-sm uppercase tracking-wideish text-burgundy/80">
          Ôn tập nền tảng
        </p>
        <h2 className="mt-3 max-w-2xl font-serif text-3xl font-semibold leading-tight text-charcoal sm:text-4xl">
          Thẻ kiến thức nền — phần hay được hỏi khi kiểm tra
        </h2>
        <p className="mt-4 max-w-2xl text-sm leading-relaxed text-charcoal/70">
          Định nghĩa tư tưởng Hồ Chí Minh, các cơ sở hình thành và năm thời kỳ phát
          triển. Lật thẻ để xem câu trả lời chuẩn theo giáo trình, kèm ghi rõ tài liệu
          để bạn đối chiếu lại khi viết bài.
        </p>

        <div
          className="mt-6 flex flex-wrap gap-2"
          role="group"
          aria-label="Lọc thẻ theo nhóm nội dung"
        >
          {FILTERS.map((option) => (
            <button
              key={option.id}
              type="button"
              onClick={() => setFilter(option.id)}
              aria-pressed={filter === option.id}
              className={`focus-ring rounded-full border px-3 py-1.5 text-[11px] font-medium transition-colors ${
                filter === option.id
                  ? "border-burgundy bg-burgundy/10 text-burgundy"
                  : "border-charcoal/20 text-charcoal/60 hover:border-charcoal/45"
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>

        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((card, index) => (
            <Flashcard key={card.id} card={card} index={index} />
          ))}
        </div>

        <p className="mt-6 text-[11px] text-charcoal/50">
          Nội dung được trình bày lại theo Giáo trình Tư tưởng Hồ Chí Minh (NXB Chính
          trị quốc gia Sự thật). Khi làm bài, hãy mở lại giáo trình và văn kiện gốc để
          dẫn chính xác.
        </p>
      </div>
    </section>
  );
}
