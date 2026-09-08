"use client";

import { useRef, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import cards from "@/data/genz-cards.json";

function TiltCard({ card }: { card: (typeof cards)[number] }) {
  const ref = useRef<HTMLDivElement>(null);
  const [expanded, setExpanded] = useState(false);

  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rotateX = useSpring(useTransform(my, [-0.5, 0.5], [8, -8]), {
    stiffness: 200,
    damping: 20,
  });
  const rotateY = useSpring(useTransform(mx, [-0.5, 0.5], [-8, 8]), {
    stiffness: 200,
    damping: 20,
  });
  const glowX = useTransform(mx, [-0.5, 0.5], ["20%", "80%"]);
  const glowY = useTransform(my, [-0.5, 0.5], ["20%", "80%"]);

  function handleMove(e: React.MouseEvent<HTMLDivElement>) {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    mx.set((e.clientX - rect.left) / rect.width - 0.5);
    my.set((e.clientY - rect.top) / rect.height - 0.5);
  }

  function handleLeave() {
    mx.set(0);
    my.set(0);
  }

  return (
    <div className="tilt-wrap">
      <motion.div
        ref={ref}
        onMouseMove={handleMove}
        onMouseLeave={handleLeave}
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        className="focus-ring group relative flex h-full flex-col rounded-2xl border border-charcoal/10 bg-cream p-7 shadow-[0_20px_40px_-24px_rgba(28,26,23,0.35)]"
      >
        <motion.div
          aria-hidden="true"
          style={{
            background: "radial-gradient(circle, rgba(212,175,55,0.25), transparent 60%)",
            left: glowX,
            top: glowY,
          }}
          className="pointer-events-none absolute h-40 w-40 -translate-x-1/2 -translate-y-1/2 rounded-full opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        />

        <span className="w-fit rounded-full bg-burgundy/10 px-3 py-1 text-xs font-medium text-burgundy">
          {card.tag}
        </span>
        <h3 className="mt-4 font-serif text-xl font-semibold leading-snug text-charcoal">
          {card.title}
        </h3>
        <p className="mt-3 text-sm text-charcoal/70">{card.excerpt}</p>

        <button
          onClick={() => setExpanded((v) => !v)}
          className="focus-ring mt-5 w-fit text-sm font-medium text-burgundy underline decoration-burgundy/30 underline-offset-4 hover:decoration-burgundy"
          aria-expanded={expanded}
        >
          {expanded ? "Thu gọn" : "Đọc thêm"}
        </button>

        {expanded && (
          <p className="mt-3 border-t border-charcoal/10 pt-3 text-sm leading-relaxed text-charcoal/75">
            {card.body}
          </p>
        )}
      </motion.div>
    </div>
  );
}

export default function GenZCards() {
  return (
    <section id="goc-genz" className="bg-cream px-6 py-20 sm:px-10 lg:px-16">
      <div className="mx-auto max-w-6xl">
        <p className="font-sans text-sm uppercase tracking-wideish text-burgundy/80">
          Ứng dụng thực tiễn
        </p>
        <h2 className="mt-3 max-w-xl font-serif text-3xl font-semibold leading-tight text-charcoal sm:text-4xl">
          Góc Gen Z: từ tư tưởng đến thói quen
        </h2>

        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {cards.map((card) => (
            <TiltCard key={card.id} card={card} />
          ))}
        </div>
      </div>
    </section>
  );
}
