"use client";

import Link from "next/link";
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
    return Array.isArray(parsed) ? parsed.filter((value) => typeof value === "number") : [];
  } catch {
    return [];
  }
}

export default function RoadmapSection() {
  const days = roadmap as RoadmapDay[];
  const [done, setDone] = useState<number[]>([]);
  const { readTopics } = useNotebook();

  useEffect(() => {
    setDone(readProgress());
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

  return (
    <section id="lo-trinh" className="bg-charcoal px-6 py-20 text-cream sm:px-10 lg:px-16">
      <div className="mx-auto max-w-5xl">
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
          Mỗi ngày một chuyên đề — bảy ngày nắm được cốt lõi
        </motion.h2>
        <motion.p
          className="mt-4 max-w-2xl text-cream/70"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          Mỗi ngày khoảng 20–30 phút: đọc một chuyên đề, làm vài thẻ kiến thức nền,
          và một việc nhỏ áp dụng vào đời sống. Tiến độ được đánh dấu ngay trên máy bạn.
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

        <ol className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {days.map((day, index) => {
            const topic = topics.find((item) => item.id === day.topicId);
            const isDone = done.includes(day.day);
            const topicRead = topic ? readTopics.includes(topic.id) : false;
            return (
              <motion.li
                key={day.day}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{ duration: 0.45, delay: index * 0.06 }}
                className={`flex flex-col rounded-2xl border p-5 transition-colors ${
                  isDone
                    ? "border-gold/50 bg-gold/[0.08]"
                    : "border-cream/12 bg-charcoal-soft/50"
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <span className="font-serif text-2xl font-semibold text-gold">
                    Ngày {day.day}
                  </span>
                  {topicRead ? (
                    <span className="rounded-full border border-cream/20 px-2 py-0.5 text-[10px] text-cream/60">
                      đã đọc chuyên đề
                    </span>
                  ) : null}
                </div>
                <h3 className="mt-3 font-serif text-lg font-semibold leading-snug">
                  {day.title}
                </h3>
                <p className="mt-2 text-[13px] leading-relaxed text-cream/65">{day.focus}</p>

                <ul className="mt-3 space-y-2 text-[13px] leading-relaxed text-cream/75">
                  {day.tasks.map((task) => (
                    <li key={task} className="flex gap-2">
                      <span aria-hidden="true" className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-gold/70" />
                      <span>{task}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-auto flex flex-wrap items-center gap-3 pt-4">
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
                  {topic ? (
                    <Link
                      href="#tu-tuong"
                      className="focus-ring text-[11px] text-gold/80 underline decoration-gold/30 underline-offset-4 hover:text-gold"
                    >
                      Mở chuyên đề {topic.order}
                    </Link>
                  ) : null}
                </div>
              </motion.li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
