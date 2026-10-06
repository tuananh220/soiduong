"use client";

import { useEffect, useState } from "react";
import { motion, useScroll, useSpring } from "framer-motion";
import {
  applyReduceAttribute,
  initReduceEffects,
  setReduceEffects,
  useReduceEffects,
} from "@/lib/prefs";

/**
 * Phần "khung" của trang: thanh tiến độ đọc ở trên cùng, và ở màn hình lớn là
 * hai nút tiện dụng (giảm hiệu ứng, về đầu trang). Trên màn hình nhỏ, hai hành
 * động này nằm trong mục lục của SectionNav nên không cần nút nổi trùng lặp.
 */
export default function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 140,
    damping: 26,
    restDelta: 0.001,
  });
  const [showTop, setShowTop] = useState(false);
  const reduceEffects = useReduceEffects();

  useEffect(() => {
    initReduceEffects();
    function onScroll() {
      setShowTop(window.scrollY > 720);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    applyReduceAttribute(reduceEffects);
  }, [reduceEffects]);

  return (
    <>
      <motion.div
        aria-hidden="true"
        style={{ scaleX }}
        className="fixed inset-x-0 top-0 z-40 h-[3px] origin-left bg-gradient-to-r from-burgundy via-gold to-gold-soft"
      />

      <div className="fixed bottom-5 right-5 z-30 hidden flex-col items-end gap-2 lg:flex">
        <button
          type="button"
          onClick={() => setReduceEffects(!reduceEffects)}
          aria-pressed={reduceEffects}
          title={
            reduceEffects
              ? "Đang giảm hiệu ứng: tắt xoay tự động, hậu kỳ và các chuyển động trang trí"
              : "Giảm hiệu ứng chuyển động cho máy yếu hoặc khi bạn thấy mỏi mắt"
          }
          className={`focus-ring rounded-full border px-4 py-2.5 text-xs font-medium shadow-lg backdrop-blur-sm transition-colors ${
            reduceEffects
              ? "border-gold/60 bg-gold/20 text-charcoal"
              : "border-charcoal/15 bg-cream/90 text-charcoal/70 hover:border-charcoal/40"
          }`}
        >
          {reduceEffects ? "◐ Đang giảm hiệu ứng" : "◑ Giảm hiệu ứng"}
        </button>

        <button
          type="button"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          aria-label="Về đầu trang"
          className={`focus-ring rounded-full border border-gold/40 bg-charcoal/90 px-4 py-3 text-xs font-medium text-gold shadow-lg backdrop-blur-sm transition-all duration-300 hover:bg-charcoal ${
            showTop
              ? "translate-y-0 opacity-100"
              : "pointer-events-none translate-y-4 opacity-0"
          }`}
        >
          ↑ Đầu trang
        </button>
      </div>
    </>
  );
}
