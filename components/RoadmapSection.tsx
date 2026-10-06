"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import roadmap from "@/data/lo-trinh.json";
import topics from "@/data/tu-tuong.json";
import { useNotebook } from "@/lib/notebook";
import type { RoadmapDay } from "@/lib/types";

const PROGRESS_KEY = "soiduong.lotrinh.v1";

function readProgress(): number[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(PROGRESS_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed)
      ? parsed.filter((value) => typeof value === "number")
      : [];
  } catch {
    return [];
  }
}

/**
 * Lộ trình dạng gọn: một dải 7 ngày để chọn, bên dưới chỉ hiện nội dung của ngày
 * đang chọn — thay cho 7 thẻ lớn chiếm gần 2 màn hình.
 */
export default function RoadmapSection() {
  const days = roadmap as RoadmapDay[];
  const [done, setDone] = useState<number[]>([]);
  const [activeDay, setActiveDay] = useState(1);
  const { readTopics } = useNotebook();

  useEffect(() => {
    const stored = readProgress();
    setDone(stored);
    // Mặc định mở ngày chưa hoàn thành đầu tiên để người mới không phải tự đoán.
    const nextDay = days.find((day) => !stored.includes(day.day));
    setActiveDay(nextDay ? nextDay.day : days[days.length - 1].day);
    // days là dữ liệu tĩnh từ JSON nên không cần thêm dependency.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function toggle(day: number) {
    setDone((previous) => {
      const next = previous.includes(day)
        ? previous.filter((value) => value !== day)
        : [...previous, day];
      try {
        window.localStorage.setItem(PROGRESS_KEY, JSON.stringify(next));
      } catch {
        // không lưu được thì vẫn giữ tiến độ trong phiên hiện tại
      }
      return next;
    });
  }

  const completed = days.filter((day) => done.includes(day.day)).length;
  const day = days.find((item) => item.day === activeDay) ?? days[0];
  const topic = topics.find((item) => item.id === day.topicId);
  const isDone = done.includes(day.day);
  const topicRead = topic ? readTopics.includes(topic.id) : false;

  return (
    <section id="lo-trinh" className="bg-charcoal px-6 py-16 text-cream sm:px-10 lg:px-16">
      <div className="mx-auto max-w-4xl">
        <motion.p
          className="font-sans text-sm uppercase tracking-wideish text-gold/80"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          Lộ trình 7 ngày
        </motion.p>
        <motion.h2
          className="mt-3 max-w-2xl font-serif text-3xl font-semibold leading-tight sm:text-4xl"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          Bảy ngày, mỗi ngày 20–30 phút
        </motion.h2>
        <motion.p
          className="mt-3 max-w-2xl text-sm leading-relaxed text-cream/70"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.15 }}
        >
          Chọn một ngày để xem việc cần làm. Tiến độ lưu ngay trên máy bạn.
        </motion.p>

        <div className="mt-6 max-w-md">
          <div className="flex items-center justify-between text-xs text-cream/55">
            <span>Tiến độ lộ trình</span>
            <span>
              {completed}/{days.length} ngày
            </span>
          </div>
          <div
            className="mt-2 h-1.5 overflow-hidden rounded-full bg-cream/10"
            role="progressbar"
            aria-valuemin={0}
            aria-valuemax={days.length}
            aria-valuenow={completed}
            aria-label={`Đã hoàn thành ${completed} trên ${days.length} ngày`}
          >
            <div
              className="h-full rounded-full bg-gold transition-[width] duration-500"
              style={{ width: `${(completed / days.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Dải chọn ngày */}
        <div
          className="no-scrollbar -mx-1 mt-8 flex gap-2 overflow-x-auto px-1 pb-1"
          role="tablist"
          aria-label="Chọn ngày trong lộ trình"
        >
          {days.map((item) => {
            const itemDone = done.includes(item.day);
            const isActive = item.day === day.day;
            return (
              <button
                key={item.day}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => setActiveDay(item.day)}
                className={`focus-ring flex shrink-0 items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
                  isActive
                    ? "border-gold bg-gold/20 text-cream"
                    : "border-cream/15 text-cream/65 hover:border-cream/40"
                }`}
              >
                <span>{itemDone ? "✓" : `Ngày ${item.day}`}</span>
                {itemDone && isActive ? (
                  <span className="text-[11px] text-cream/70">đã xong</span>
                ) : null}
              </button>
            );
          })}
        </div>

        {/* Chi tiết ngày đang chọn */}
        <motion.div
          key={day.day}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className={`mt-4 rounded-2xl border p-6 ${
            isDone ? "border-gold/50 bg-gold/[0.08]" : "border-cream/12 bg-charcoal-soft/50"
          }`}
        >
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-[11px] font-semibold uppercase tracking-wideish text-gold/80">
              Ngày {day.day}/7
            </p>
            <div className="flex flex-wrap items-center gap-2">
              {topicRead ? (
                <span className="rounded-full border border-cream/20 px-2.5 py-0.5 text-[10px] text-cream/60">
                  đã đọc chuyên đề {topic?.order}
                </span>
              ) : null}
              <button
                type="button"
                onClick={() => toggle(day.day)}
                aria-pressed={isDone}
                className={`focus-ring rounded-full border px-3 py-1.5 text-[11px] font-medium transition-colors ${
                  isDone
                    ? "border-gold bg-gold/20 text-cream"
                    : "border-cream/25 text-cream/70 hover:border-cream/50"
                }`}
              >
                {isDone ? "✓ Đã hoàn thành" : "Đánh dấu hoàn thành"}
              </button>
            </div>
          </div>

          <h3 className="mt-3 font-serif text-2xl font-semibold leading-snug">
            {day.title}
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-cream/70">{day.focus}</p>

          <ol className="mt-4 space-y-2 text-sm leading-relaxed text-cream/80">
            {day.tasks.map((task, index) => (
              <li key={task} className="flex gap-3">
                <span className="mt-0.5 font-serif text-sm font-semibold text-gold/80">
                  {index + 1}.
                </span>
                <span>{task}</span>
              </li>
            ))}
          </ol>

          {topic ? (
            <a
              href="#tu-tuong"
              className="focus-ring mt-4 inline-block rounded-full border border-gold/50 px-4 py-2 text-xs font-medium text-gold transition-colors hover:bg-gold/10"
            >
              Mở chuyên đề {topic.order}: {topic.short} →
            </a>
          ) : null}
        </motion.div>
      </div>
    </section>
  );
}
