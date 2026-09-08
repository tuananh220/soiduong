"use client";

import { useState } from "react";
import quotes from "@/data/quotes.json";

function QuoteCard({ quote }: { quote: (typeof quotes)[number] }) {
  const [flipped, setFlipped] = useState(false);

  async function handleShare() {
    const shareText = `"${quote.front}" — Hồ Chí Minh`;
    if (navigator.share) {
      try {
        await navigator.share({ text: shareText, title: "Soi Đường" });
      } catch {
        // user cancelled — no-op
      }
    } else if (navigator.clipboard) {
      await navigator.clipboard.writeText(shareText);
    }
  }

  return (
    <div className="flip-scene h-64 w-full">
      <button
        onClick={() => setFlipped((f) => !f)}
        aria-pressed={flipped}
        aria-label="Lật thẻ trích dẫn"
        className={`focus-ring relative h-full w-full text-left flip-card ${
          flipped ? "is-flipped" : ""
        }`}
      >
        {/* Front */}
        <div className="flip-face absolute inset-0 flex flex-col justify-between rounded-2xl border border-gold/30 bg-gradient-to-br from-burgundy to-burgundy-deep p-6 shadow-gold">
          <p className="font-serif text-lg font-medium leading-snug text-cream sm:text-xl">
            “{quote.front}”
          </p>
          <span className="text-xs uppercase tracking-wideish text-gold/80">
            Chạm để xem bài học
          </span>
        </div>

        {/* Back */}
        <div className="flip-face flip-face-back absolute inset-0 flex flex-col justify-between rounded-2xl border border-gold/40 bg-charcoal p-6">
          <div>
            <p className="text-[10px] uppercase tracking-wideish text-gold/80">
              {quote.source}
            </p>
            <p className="mt-3 text-sm leading-relaxed text-cream/85">
              {quote.back}
            </p>
          </div>
          <span
            role="button"
            tabIndex={0}
            onClick={(e) => {
              e.stopPropagation();
              handleShare();
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.stopPropagation();
                handleShare();
              }
            }}
            className="focus-ring w-fit rounded-full border border-gold/60 px-4 py-1.5 text-xs font-medium text-gold hover:bg-gold/10"
          >
            Chia sẻ / Lưu câu nói
          </span>
        </div>
      </button>
    </div>
  );
}

export default function QuoteGallery() {
  return (
    <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2">
      {quotes.map((q) => (
        <QuoteCard key={q.id} quote={q} />
      ))}
    </div>
  );
}
