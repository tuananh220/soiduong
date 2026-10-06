"use client";

import { useEffect, useState } from "react";
import { SECTIONS } from "@/lib/sections";
import { setReduceEffects, useReduceEffects } from "@/lib/prefs";

/**
 * Điều hướng nhanh giữa các mục — chống tình trạng "lười lướt".
 *
 * - Màn hình lớn: một trục dọc bên phải, mục đang xem được tô sáng.
 * - Màn hình nhỏ: thanh ngay dưới cùng hiển thị "Mục 3/7 · Ôn tập" kèm hai nút
 *   trước/sau; chạm vào giữa để mở danh sách đầy đủ + hai hành động tiện dụng
 *   (giảm hiệu ứng, về đầu trang) nên không cần thêm nút nổi nào khác.
 */
export default function SectionNav() {
  const [current, setCurrent] = useState(0);
  const [open, setOpen] = useState(false);
  const reduceEffects = useReduceEffects();

  useEffect(() => {
    function onScroll() {
      const marker = window.scrollY + window.innerHeight * 0.35;
      let index = 0;
      SECTIONS.forEach((section, position) => {
        const element = document.getElementById(section.id);
        if (element && element.offsetTop <= marker) index = position;
      });
      setCurrent(index);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  useEffect(() => {
    if (!open) return;
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  function jump(index: number) {
    const target = SECTIONS[Math.max(0, Math.min(SECTIONS.length - 1, index))];
    if (!target) return;
    setOpen(false);
    document.getElementById(target.id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  const active = SECTIONS[current];

  return (
    <>
      {/* Trục điều hướng dọc — chỉ hiện ở màn hình lớn */}
      <nav
        aria-label="Điều hướng nhanh theo mục"
        className="fixed right-3 top-1/2 z-30 hidden -translate-y-1/2 flex-col items-end gap-2 lg:flex"
      >
        {SECTIONS.map((section, index) => {
          const isActive = index === current;
          return (
            <a
              key={section.id}
              href={`#${section.id}`}
              aria-current={isActive ? "true" : undefined}
              className="focus-ring group flex items-center gap-2 text-[11px]"
            >
              <span
                className={`rounded-full px-2 py-0.5 backdrop-blur-sm transition-opacity ${
                  isActive
                    ? "bg-burgundy text-cream opacity-100"
                    : "bg-cream/90 text-charcoal/60 opacity-0 group-hover:opacity-100"
                }`}
              >
                {section.label}
              </span>
              <span
                aria-hidden="true"
                className={`rounded-full border transition-all ${
                  isActive
                    ? "h-2.5 w-2.5 border-burgundy bg-burgundy"
                    : "h-2 w-2 border-charcoal/30 bg-cream group-hover:border-burgundy"
                }`}
              />
            </a>
          );
        })}
      </nav>

      {/* Thanh điều hướng gọn — chỉ hiện ở màn hình nhỏ */}
      <div className="fixed bottom-3 left-1/2 z-30 w-[min(430px,calc(100%-1.5rem))] -translate-x-1/2 lg:hidden">
        {open ? (
          <div
            role="dialog"
            aria-label="Mục lục trang"
            className="mb-2 max-h-[70vh] overflow-y-auto rounded-2xl border border-charcoal/15 bg-cream/95 p-3 shadow-2xl backdrop-blur-md"
          >
            <p className="px-1 pb-2 text-[11px] font-semibold uppercase tracking-wideish text-charcoal/50">
              Trang này có gì
            </p>
            <ul className="space-y-1">
              {SECTIONS.map((section, index) => (
                <li key={section.id}>
                  <button
                    type="button"
                    onClick={() => jump(index)}
                    aria-current={index === current ? "true" : undefined}
                    className={`focus-ring w-full rounded-xl px-3 py-2 text-left transition-colors ${
                      index === current ? "bg-burgundy/10" : "hover:bg-charcoal/5"
                    }`}
                  >
                    <span className="text-sm font-medium text-charcoal">
                      {index + 1}. {section.label}
                    </span>
                    <span className="mt-0.5 block text-[11px] leading-relaxed text-charcoal/60">
                      {section.blurb}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
            <div className="mt-2 flex items-center gap-2 border-t border-charcoal/10 pt-2">
              <button
                type="button"
                onClick={() => setReduceEffects(!reduceEffects)}
                aria-pressed={reduceEffects}
                className={`focus-ring rounded-full border px-3 py-1.5 text-[11px] font-medium ${
                  reduceEffects
                    ? "border-gold bg-gold/20 text-charcoal"
                    : "border-charcoal/20 text-charcoal/65"
                }`}
              >
                {reduceEffects ? "◐ Đang giảm hiệu ứng" : "◑ Giảm hiệu ứng"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setOpen(false);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className="focus-ring ml-auto rounded-full border border-charcoal/20 px-3 py-1.5 text-[11px] text-charcoal/65"
              >
                ↑ Về đầu trang
              </button>
            </div>
          </div>
        ) : null}

        <div className="flex items-center gap-1 rounded-full border border-charcoal/10 bg-cream/95 p-1 shadow-xl backdrop-blur-md">
          <button
            type="button"
            onClick={() => jump(current - 1)}
            disabled={current === 0}
            aria-label="Mục trước"
            className="focus-ring h-9 w-9 rounded-full text-charcoal/70 transition-colors hover:bg-charcoal/5 disabled:opacity-30"
          >
            ‹
          </button>
          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            aria-expanded={open}
            className="focus-ring flex-1 truncate rounded-full px-2 py-1.5 text-center text-[12px] font-medium text-charcoal"
          >
            <span className="text-charcoal/50">
              Mục {current + 1}/{SECTIONS.length} ·{" "}
            </span>
            {active?.short}
            <span aria-hidden="true" className="ml-1 text-charcoal/40">
              {open ? "▾" : "▴"}
            </span>
          </button>
          <button
            type="button"
            onClick={() => jump(current + 1)}
            disabled={current === SECTIONS.length - 1}
            aria-label="Mục tiếp theo"
            className="focus-ring h-9 w-9 rounded-full text-charcoal/70 transition-colors hover:bg-charcoal/5 disabled:opacity-30"
          >
            ›
          </button>
        </div>
      </div>
    </>
  );
}
