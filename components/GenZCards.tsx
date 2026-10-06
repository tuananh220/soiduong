"use client";

import { useRef, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import cards from "@/data/genz-cards.json";
import { removeFromNotebook, saveToNotebook, useNotebook } from "@/lib/notebook";
import { useCanHover, useReduceEffects } from "@/lib/prefs";

function TiltCard({ card }: { card: (typeof cards)[number] }) {
  const ref = useRef<HTMLDivElement>(null);
  const [expanded, setExpanded] = useState(false);
  const { items } = useNotebook();
  // Chỉ nghiêng thẻ khi có con trỏ chính xác (chuột/bút) và không bật giảm hiệu ứng:
  // trên cảm ứng, nghiêng theo ngón tay khi cuộn gây cảm giác "trôi" khó chịu.
  const canHover = useCanHover();
  const reduceEffects = useReduceEffects();
  const tiltEnabled = canHover && !reduceEffects;
  const itemId = `genz-${card.id}`;
  const saved = items.some((item) => item.id === itemId);

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

  function handleMove(event: React.PointerEvent<HTMLDivElement>) {
    if (!tiltEnabled) return;
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    mx.set((event.clientX - rect.left) / rect.width - 0.5);
    my.set((event.clientY - rect.top) / rect.height - 0.5);
  }

  function handleLeave() {
    mx.set(0);
    my.set(0);
  }

  return (
    <div className="tilt-wrap h-full">
      <motion.div
        ref={ref}
        onPointerMove={handleMove}
        onPointerLeave={handleLeave}
        onPointerUp={handleLeave}
        onPointerCancel={handleLeave}
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

        <div className="mt-5 flex flex-wrap items-center gap-4">
          <button
            onClick={() => setExpanded((value) => !value)}
            className="focus-ring w-fit text-sm font-medium text-burgundy underline decoration-burgundy/30 underline-offset-4 hover:decoration-burgundy"
            aria-expanded={expanded}
          >
            {expanded ? "Thu gọn" : "Đọc thêm"}
          </button>
          <button
            onClick={() =>
              saved
                ? removeFromNotebook(itemId)
                : saveToNotebook({
                    id: itemId,
                    kind: "note",
                    title: card.title,
                    body: card.body,
                    topicTitle: "Góc Gen Z",
                  })
            }
            aria-pressed={saved}
            className={`focus-ring w-fit rounded-full border px-3 py-1 text-[11px] font-medium transition-colors ${
              saved
                ? "border-gold bg-gold/15 text-charcoal"
                : "border-charcoal/20 text-charcoal/65 hover:border-charcoal/45"
            }`}
          >
            {saved ? "✓ Trong sổ tay" : "+ Lưu bài học"}
          </button>
        </div>

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
    <section id="goc-genz" className="bg-cream px-6 py-16 sm:px-10 lg:px-16">
      <div className="mx-auto max-w-6xl">
        <motion.p
          className="font-sans text-sm uppercase tracking-wideish text-burgundy/80"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          Ứng dụng thực tiễn
        </motion.p>
        <motion.h2
          className="mt-3 max-w-xl font-serif text-3xl font-semibold leading-tight text-charcoal sm:text-4xl"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          Góc Gen Z: từ tư tưởng đến thói quen
        </motion.h2>
        <motion.p
          className="mt-4 max-w-xl text-sm leading-relaxed text-charcoal/65"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.15 }}
        >
          Mỗi thẻ là một cách chuyển giá trị cũ thành thói quen hôm nay.
        </motion.p>

        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {cards.map((card, index) => (
            <motion.div
              key={card.id}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.1 }}
              transition={{ duration: 0.5, delay: index * 0.13, ease: "easeOut" }}
            >
              <TiltCard card={card} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
