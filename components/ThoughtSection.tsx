"use client";

import dynamic from "next/dynamic";
import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import topics from "@/data/tu-tuong.json";
import audit from "@/data/citation-audit.json";
import sources from "@/data/nguon.json";
import ErrorBoundary from "@/lib/ErrorBoundary";
import QuoteSource from "./QuoteSource";
import { useReduceEffects } from "@/lib/prefs";
import { useInViewState } from "@/lib/useInViewState";
import {
  removeFromNotebook,
  saveToNotebook,
  toggleReadTopic,
  upsertNote,
  useNotebook,
} from "@/lib/notebook";
import type { AuditEntry, Topic } from "@/lib/types";

const ThoughtLab3D = dynamic(() => import("./ThoughtLab3D"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full items-center justify-center">
      <span className="rounded-full border border-gold/30 bg-charcoal/80 px-4 py-2 text-xs text-cream/70">
        Đang dựng không gian chuyên đề…
      </span>
    </div>
  ),
});

/** Lưới tĩnh: phương án dự phòng khi WebGL không chạy hoặc người dùng tắt 3D. */
function StaticTopicGrid({
  topicList,
  activeIndex,
  onSelect,
}: {
  topicList: Topic[];
  activeIndex: number;
  onSelect: (index: number) => void;
}) {
  return (
    <div className="grid h-full grid-cols-2 gap-3 overflow-y-auto p-4 sm:grid-cols-3">
      {topicList.map((topic, index) => (
        <button
          key={topic.id}
          type="button"
          onClick={() => onSelect(index)}
          aria-pressed={index === activeIndex}
          className={`focus-ring flex flex-col justify-between rounded-xl border p-4 text-left transition-colors ${
            index === activeIndex
              ? "border-gold bg-cream/[0.08]"
              : "border-cream/15 bg-cream/[0.03] hover:border-cream/35"
          }`}
        >
          <span className="font-serif text-2xl font-semibold" style={{ color: topic.accent }}>
            {topic.order}
          </span>
          <span className="mt-3 text-sm font-medium leading-snug text-cream">
            {topic.short}
          </span>
          <span className="mt-1 text-[11px] leading-relaxed text-cream/55">
            {topic.title}
          </span>
        </button>
      ))}
    </div>
  );
}

const AUDIT_FILTERS = [
  { id: "all", label: "Tất cả" },
  { id: "warn", label: "Cần lưu ý khi trích dẫn" },
  { id: "ok", label: "Đã chuẩn nguyên văn" },
] as const;

type AuditFilter = (typeof AUDIT_FILTERS)[number]["id"];

function isWarnEntry(entry: AuditEntry) {
  return ["gan-sai", "sai-nguon", "rut-gon", "co-dien-ban-khac", "tinh-than"].includes(
    entry.verdict,
  );
}

function verdictClasses(entry: AuditEntry) {
  if (entry.verdict === "gan-sai" || entry.verdict === "sai-nguon") {
    return "border-burgundy-light/50 bg-burgundy-light/10 text-burgundy-light";
  }
  if (entry.verdict === "dung-nguyen-van") {
    return "border-gold/50 bg-gold/10 text-gold";
  }
  return "border-gold/30 bg-cream/5 text-gold/85";
}

function QuoteRow({
  topic,
  index,
  text,
  source,
  sourceUrl,
  level,
  note,
}: {
  topic: Topic;
  index: number;
  text: string;
  source: string;
  sourceUrl?: string;
  level: string;
  note?: string;
}) {
  const { items } = useNotebook();
  const itemId = `quote-${topic.id}-${index}`;
  const saved = items.some((item) => item.id === itemId);

  return (
    <li className="rounded-xl border border-charcoal/10 bg-cream/70 p-4">
      <blockquote className="font-serif text-[15px] leading-relaxed text-charcoal">
        “{text}”
      </blockquote>
      <div className="mt-2 flex flex-wrap items-center gap-2 text-[11px]">
        <span className="rounded-full border border-burgundy/25 bg-burgundy/5 px-2 py-0.5 font-medium text-burgundy">
          {level}
        </span>
        <QuoteSource
          source={source}
          sourceUrl={sourceUrl}
          className="text-charcoal/60"
          linkClassName="focus-ring font-medium text-burgundy underline decoration-burgundy/30 underline-offset-2 hover:decoration-burgundy"
        />
      </div>
      {note ? (
        <p className="mt-2 rounded-lg bg-charcoal/5 px-3 py-2 text-[12px] leading-relaxed text-charcoal/70">
          <strong className="font-medium">Ghi chú kiểm chứng:</strong> {note}
        </p>
      ) : null}
      <button
        type="button"
        onClick={() =>
          saved
            ? removeFromNotebook(itemId)
            : saveToNotebook({
                id: itemId,
                kind: "quote",
                title: text,
                source,
                topicTitle: `${topic.order}. ${topic.title}`,
              })
        }
        aria-pressed={saved}
        className={`focus-ring mt-3 rounded-full border px-3 py-1.5 text-[11px] font-medium transition-colors ${
          saved
            ? "border-gold bg-gold/15 text-charcoal"
            : "border-charcoal/20 text-charcoal/70 hover:border-charcoal/45"
        }`}
      >
        {saved ? "✓ Đã lưu vào sổ tay" : "Lưu vào sổ tay"}
      </button>
    </li>
  );
}

function TopicNote({ topic }: { topic: Topic }) {
  const { items } = useNotebook();
  const itemId = `note-${topic.id}`;
  const savedNote = items.find((item) => item.id === itemId)?.title ?? "";
  const [value, setValue] = useState("");
  const [justSaved, setJustSaved] = useState(false);

  useEffect(() => {
    setValue(savedNote);
  }, [savedNote, topic.id]);

  useEffect(() => {
    if (!justSaved) return;
    const timer = setTimeout(() => setJustSaved(false), 2200);
    return () => clearTimeout(timer);
  }, [justSaved]);

  return (
    <div className="rounded-xl border border-charcoal/10 bg-charcoal/[0.03] p-4">
      <label
        htmlFor={`note-${topic.id}`}
        className="text-[11px] font-semibold uppercase tracking-wideish text-charcoal/60"
      >
        Ghi chú của tôi về chuyên đề này
      </label>
      <textarea
        id={`note-${topic.id}`}
        value={value}
        onChange={(event) => setValue(event.target.value)}
        rows={3}
        placeholder="Ví dụ: điều mình sẽ thử áp dụng trong tuần này, hoặc câu hỏi còn thắc mắc…"
        className="focus-ring mt-2 w-full resize-y rounded-lg border border-charcoal/15 bg-cream px-3 py-2 text-sm text-charcoal placeholder:text-charcoal/35"
      />
      <div className="mt-2 flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={() => {
            const trimmed = value.trim();
            if (!trimmed) {
              removeFromNotebook(itemId);
              return;
            }
            upsertNote({
              id: itemId,
              kind: "note",
              title: trimmed,
              topicTitle: `${topic.order}. ${topic.title}`,
            });
            setJustSaved(true);
          }}
          className="focus-ring rounded-full bg-burgundy px-4 py-1.5 text-[11px] font-medium text-cream transition-transform hover:scale-[1.03]"
        >
          Lưu ghi chú
        </button>
        <span className="text-[11px] text-charcoal/45">
          Ghi chú chỉ nằm trong trình duyệt của bạn.
        </span>
        {justSaved ? (
          <span className="text-[11px] font-medium text-burgundy" role="status">
            Đã lưu ✓
          </span>
        ) : null}
      </div>
    </div>
  );
}

function DetailPanel({
  topic,
  index,
  total,
  onPrev,
  onNext,
}: {
  topic: Topic;
  index: number;
  total: number;
  onPrev: () => void;
  onNext: () => void;
}) {
  const { readTopics } = useNotebook();
  const read = readTopics.includes(topic.id);

  return (
    <div className="flex h-full flex-col rounded-2xl border border-charcoal/10 bg-cream p-6 shadow-[0_20px_50px_-30px_rgba(28,26,23,0.5)]">
      <div className="flex items-center justify-between gap-3">
        <span className="rounded-full bg-burgundy/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-wideish text-burgundy">
          Chuyên đề {topic.order} · {topic.tag}
        </span>
        <span className="text-[11px] text-charcoal/45">
          {index + 1}/{total}
        </span>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={topic.id}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.28, ease: "easeOut" }}
          className="mt-4 flex-1"
        >
          <h3 className="font-serif text-2xl font-semibold leading-snug text-charcoal">
            {topic.title}
          </h3>
          <p className="mt-3 text-sm leading-relaxed text-charcoal/75">{topic.essence}</p>

          <ul className="mt-4 space-y-2">
            {topic.keyPoints.map((point) => (
              <li key={point} className="flex gap-2 text-sm leading-relaxed text-charcoal/75">
                <span aria-hidden="true" className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-gold" />
                <span>{point}</span>
              </li>
            ))}
          </ul>

          <p className="mt-5 text-[11px] font-semibold uppercase tracking-wideish text-charcoal/50">
            Trích dẫn kèm nguồn
          </p>
          <ul className="mt-2 space-y-3">
            {topic.quotes.map((quote, quoteIndex) => (
              <QuoteRow
                key={`${topic.id}-${quoteIndex}`}
                topic={topic}
                index={quoteIndex}
                text={quote.text}
                source={quote.source}
                sourceUrl={"sourceUrl" in quote ? (quote.sourceUrl as string) : undefined}
                level={quote.level}
                note={"note" in quote ? (quote.note as string | undefined) : undefined}
              />
            ))}
          </ul>

          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <div className="rounded-xl bg-burgundy/5 p-4">
              <p className="text-[11px] font-semibold uppercase tracking-wideish text-burgundy">
                Ứng dụng hôm nay
              </p>
              <p className="mt-2 text-sm leading-relaxed text-charcoal/75">
                {topic.application}
              </p>
            </div>
            <div className="rounded-xl bg-gold/10 p-4">
              <p className="text-[11px] font-semibold uppercase tracking-wideish text-charcoal/60">
                Việc nhỏ tuần này
              </p>
              <p className="mt-2 text-sm leading-relaxed text-charcoal/75">{topic.task}</p>
              <button
                type="button"
                onClick={() =>
                  saveToNotebook({
                    id: `task-${topic.id}`,
                    kind: "task",
                    title: topic.task,
                    topicTitle: `${topic.order}. ${topic.title}`,
                  })
                }
                className="focus-ring mt-3 rounded-full border border-charcoal/25 px-3 py-1.5 text-[11px] font-medium text-charcoal/75 transition-colors hover:border-charcoal/50"
              >
                Lưu việc này vào sổ tay
              </button>
            </div>
          </div>

          <div className="mt-5">
            <TopicNote topic={topic} />
          </div>
        </motion.div>
      </AnimatePresence>

      <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-charcoal/10 pt-4">
        <button
          type="button"
          onClick={() => toggleReadTopic(topic.id)}
          aria-pressed={read}
          className={`focus-ring rounded-full border px-4 py-2 text-xs font-medium transition-colors ${
            read
              ? "border-burgundy bg-burgundy/10 text-burgundy"
              : "border-charcoal/20 text-charcoal/65 hover:border-charcoal/45"
          }`}
        >
          {read ? "✓ Đã đọc chuyên đề này" : "Đánh dấu đã đọc"}
        </button>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onPrev}
            className="focus-ring rounded-full border border-charcoal/20 px-4 py-2 text-xs text-charcoal/70 transition-colors hover:border-charcoal/45"
          >
            ← Chuyên đề trước
          </button>
          <button
            type="button"
            onClick={onNext}
            className="focus-ring rounded-full border border-burgundy/40 bg-burgundy/5 px-4 py-2 text-xs font-medium text-burgundy transition-colors hover:bg-burgundy/10"
          >
            Chuyên đề tiếp →
          </button>
        </div>
      </div>
    </div>
  );
}

function LabSkeleton() {
  return (
    <div className="flex h-full items-center justify-center">
      <span className="text-xs text-cream/50">Đang tải không gian 3D…</span>
    </div>
  );
}

const AUDIT_PREVIEW_COUNT = 4;

function AuditList() {
  const [filter, setFilter] = useState<AuditFilter>("all");
  const [expanded, setExpanded] = useState(false);
  const entries = useMemo(() => {
    if (filter === "all") return audit as AuditEntry[];
    if (filter === "warn") return (audit as AuditEntry[]).filter(isWarnEntry);
    return (audit as AuditEntry[]).filter((entry) => !isWarnEntry(entry));
  }, [filter]);
  // Mặc định chỉ hiện vài trường hợp tiêu biểu để phần này không chiếm 6 màn hình.
  const collapsed = filter === "all" && !expanded;
  const visibleEntries = collapsed ? entries.slice(0, AUDIT_PREVIEW_COUNT) : entries;

  return (
    <div>
      <div className="flex flex-wrap gap-2" role="group" aria-label="Lọc theo mức độ kiểm chứng">
        {AUDIT_FILTERS.map((option) => (
          <button
            key={option.id}
            type="button"
            onClick={() => setFilter(option.id)}
            aria-pressed={filter === option.id}
            className={`focus-ring rounded-full border px-3 py-1.5 text-[11px] font-medium transition-colors ${
              filter === option.id
                ? "border-gold bg-gold/15 text-charcoal"
                : "border-charcoal/20 text-charcoal/60 hover:border-charcoal/45"
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>

      <ul className="mt-5 grid gap-4 md:grid-cols-2">
        {visibleEntries.map((entry) => (
          <li
            key={entry.id}
            className="rounded-2xl border border-charcoal/10 bg-cream p-5"
          >
            <div className="flex items-start justify-between gap-3">
              <p className="font-serif text-[15px] font-medium leading-snug text-charcoal">
                “{entry.quote}”
              </p>
              <span
                className={`shrink-0 rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wideish ${verdictClasses(
                  entry,
                )}`}
              >
                {entry.verdictLabel}
              </span>
            </div>
            <p className="mt-3 text-[13px] leading-relaxed text-charcoal/70">
              {entry.evidence}
            </p>
            <p className="mt-3 border-l-2 border-gold/60 pl-3 text-[13px] leading-relaxed text-charcoal/75">
              <strong className="font-medium">Cách dùng đúng:</strong> {entry.correctUsage}
            </p>
            <a
              href={entry.referenceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="focus-ring mt-3 inline-block text-[12px] font-medium text-burgundy underline decoration-burgundy/30 underline-offset-2 hover:decoration-burgundy"
            >
              Tra cứu tư liệu đối chiếu ↗
            </a>
          </li>
        ))}
      </ul>

      {filter === "all" ? (
        <button
          type="button"
          onClick={() => setExpanded((value) => !value)}
          aria-expanded={expanded}
          className="focus-ring mt-5 w-full rounded-xl border border-charcoal/15 bg-cream px-4 py-3 text-sm font-medium text-burgundy transition-colors hover:border-burgundy/40"
        >
          {expanded
            ? "Thu gọn (chỉ hiện 4 trường hợp tiêu biểu)"
            : `Xem tất cả ${entries.length} trường hợp — gồm cả những câu bị gán sai`}
        </button>
      ) : null}
    </div>
  );
}

function SourcesPanel() {
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="rounded-2xl border border-charcoal/10 bg-cream p-6">
        <h3 className="font-serif text-xl font-semibold text-charcoal">
          {sources.editorialPolicy.title}
        </h3>
        <p className="mt-1 text-[11px] uppercase tracking-wideish text-charcoal/45">
          Cập nhật {sources.editorialPolicy.updated}
        </p>
        <ul className="mt-4 space-y-3">
          {sources.editorialPolicy.items.map((item) => (
            <li key={item} className="flex gap-2 text-sm leading-relaxed text-charcoal/75">
              <span aria-hidden="true" className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-burgundy/60" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>
      <div className="space-y-6">
        <div className="rounded-2xl border border-charcoal/10 bg-cream p-6">
          <h3 className="font-serif text-xl font-semibold text-charcoal">
            Tư liệu đối chiếu
          </h3>
          <ul className="mt-4 space-y-4">
            {sources.documents.map((doc) => (
              <li key={doc.title}>
                <p className="text-[10px] font-semibold uppercase tracking-wideish text-burgundy/80">
                  {doc.label}
                </p>
                <p className="mt-1 text-sm font-medium text-charcoal">{doc.title}</p>
                <p className="text-xs text-charcoal/55">{doc.by}</p>
                <p className="mt-1 text-[13px] leading-relaxed text-charcoal/70">{doc.note}</p>
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-2xl border border-charcoal/10 bg-charcoal/[0.03] p-6">
          <h3 className="font-serif text-xl font-semibold text-charcoal">
            Tài sản bên ngoài &amp; giấy phép
          </h3>
          <ul className="mt-4 space-y-4">
            {sources.externalAssets.map((asset) => (
              <li key={asset.title}>
                <p className="text-[10px] font-semibold uppercase tracking-wideish text-charcoal/50">
                  {asset.label}
                </p>
                <p className="mt-1 text-sm font-medium text-charcoal">{asset.title}</p>
                <p className="text-xs text-charcoal/55">{asset.by}</p>
                <p className="mt-1 text-[13px] leading-relaxed text-charcoal/70">{asset.note}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default function ThoughtSection() {
  const topicList = topics as unknown as Topic[];
  const [activeIndex, setActiveIndex] = useState(0);
  const [autoplay, setAutoplay] = useState(true);
  const [paused, setPaused] = useState(false);
  const [enable3D, setEnable3D] = useState(true);
  const [readingDetail, setReadingDetail] = useState(false);
  const pauseTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const reduceEffects = useReduceEffects();
  // hasBeenInView: gắn WebGL một lần rồi giữ (không tháo ra khi cuộn qua lại).
  // inView: chỉ dùng để tạm dừng vòng lặp render khi khuất tầm nhìn.
  const {
    ref: labRef,
    inView: labInView,
    hasBeenInView: labMounted,
  } = useInViewState<HTMLDivElement>({ rootMargin: "320px 0px" });
  const { readTopics } = useNotebook();

  const activeTopic = topicList[activeIndex];
  const readCount = topicList.filter((topic) => readTopics.includes(topic.id)).length;

  function pauseAutoplay() {
    setPaused(true);
    if (pauseTimer.current) clearTimeout(pauseTimer.current);
    pauseTimer.current = setTimeout(() => setPaused(false), 9000);
  }

  function selectTopic(index: number) {
    const next = ((index % topicList.length) + topicList.length) % topicList.length;
    setActiveIndex(next);
    pauseAutoplay();
  }

  useEffect(
    () => () => {
      if (pauseTimer.current) clearTimeout(pauseTimer.current);
    },
    [],
  );

  // Giảm hiệu ứng thì mặc định không tự xoay.
  useEffect(() => {
    if (reduceEffects) setAutoplay(false);
  }, [reduceEffects]);

  // Tạm dừng khi tab bị ẩn để không "chạy" nội dung sau lưng người đọc.
  useEffect(() => {
    function onVisibility() {
      if (document.hidden) pauseAutoplay();
    }
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, []);

  useEffect(() => {
    // Không tự chuyển khi người dùng đang đọc cột chi tiết hoặc đang ở tab khác.
    if (!autoplay || paused || readingDetail) return;
    if (typeof document !== "undefined" && document.hidden) return;
    const id = setInterval(() => {
      setActiveIndex((current) => (current + 1) % topicList.length);
    }, 7000);
    return () => clearInterval(id);
  }, [autoplay, paused, readingDetail, topicList.length]);

  return (
    <section id="tu-tuong" className="bg-cream-dim px-6 py-16 sm:px-10 lg:px-16">
      <div className="mx-auto max-w-6xl">
        <motion.p
          className="font-sans text-sm uppercase tracking-wideish text-burgundy/80"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          Tư tưởng Hồ Chí Minh · nội dung đã kiểm chứng
        </motion.p>
        <motion.h2
          className="mt-3 max-w-2xl font-serif text-3xl font-semibold leading-tight text-charcoal sm:text-4xl"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          Sáu chuyên đề cốt lõi, mỗi câu nói đều có nguồn
        </motion.h2>
        <motion.p
          className="mt-4 max-w-2xl text-sm leading-relaxed text-charcoal/70"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          Xoay vòng thẻ 3D để chọn chuyên đề; mỗi trích dẫn đều có nút xem nguồn.
        </motion.p>

        <p className="sr-only" aria-live="polite">
          Đang xem chuyên đề {activeIndex + 1} trên {topicList.length}: {activeTopic.title}
        </p>

        <div className="mt-6 max-w-md">
          <div className="flex items-center justify-between text-xs text-charcoal/55">
            <span>Tiến độ đọc của bạn</span>
            <span>
              {readCount}/{topicList.length} chuyên đề
            </span>
          </div>
          <div
            className="mt-2 h-1.5 overflow-hidden rounded-full bg-charcoal/10"
            role="progressbar"
            aria-valuemin={0}
            aria-valuemax={topicList.length}
            aria-valuenow={readCount}
            aria-label={`Đã đọc ${readCount} trên ${topicList.length} chuyên đề`}
          >
            <div
              className="h-full rounded-full bg-burgundy transition-[width] duration-500"
              style={{ width: `${(readCount / topicList.length) * 100}%` }}
            />
          </div>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-5">
          <div className="lg:col-span-3">
            <div
              ref={labRef}
              className="relative h-[380px] overflow-hidden rounded-2xl bg-charcoal sm:h-[460px] lg:h-[540px]"
              role="group"
              aria-label="Không gian 3D các chuyên đề tư tưởng Hồ Chí Minh"
              tabIndex={0}
              onKeyDown={(event) => {
                if (event.key === "ArrowRight") {
                  event.preventDefault();
                  selectTopic(activeIndex + 1);
                } else if (event.key === "ArrowLeft") {
                  event.preventDefault();
                  selectTopic(activeIndex - 1);
                }
              }}
            >
              {!enable3D ? (
                <StaticTopicGrid
                  topicList={topicList}
                  activeIndex={activeIndex}
                  onSelect={selectTopic}
                />
              ) : labMounted ? (
                <ErrorBoundary
                  fallback={
                    <StaticTopicGrid
                      topicList={topicList}
                      activeIndex={activeIndex}
                      onSelect={selectTopic}
                    />
                  }
                >
                  <ThoughtLab3D
                    topics={topicList}
                    activeIndex={activeIndex}
                    onSelectIndex={selectTopic}
                    active={labInView}
                    className="h-full w-full"
                  />
                </ErrorBoundary>
              ) : (
                <LabSkeleton />
              )}
            </div>

            <div
              className="mt-4 flex flex-wrap items-center gap-2"
              role="group"
              aria-label="Chọn chuyên đề"
            >
              {topicList.map((topic, index) => (
                <button
                  key={topic.id}
                  type="button"
                  onClick={() => selectTopic(index)}
                  aria-pressed={index === activeIndex}
                  className={`focus-ring rounded-full border px-3 py-1.5 text-[11px] font-medium transition-colors sm:text-xs ${
                    index === activeIndex
                      ? "border-burgundy bg-burgundy text-cream"
                      : "border-charcoal/20 bg-cream text-charcoal/65 hover:border-charcoal/45"
                  }`}
                >
                  {topic.order} · {topic.short}
                </button>
              ))}
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-2 text-[11px] text-charcoal/55">
              <button
                type="button"
                onClick={() => setEnable3D((value) => !value)}
                aria-pressed={enable3D}
                className={`focus-ring rounded-full border px-3 py-1.5 font-medium transition-colors ${
                  enable3D
                    ? "border-charcoal/20 text-charcoal/60 hover:border-charcoal/45"
                    : "border-burgundy bg-burgundy/10 text-burgundy"
                }`}
              >
                {enable3D ? "Tắt không gian 3D" : "Bật không gian 3D"}
              </button>
              <button
                type="button"
                onClick={() => setAutoplay((value) => !value)}
                aria-pressed={autoplay}
                className={`focus-ring rounded-full border px-3 py-1.5 font-medium transition-colors ${
                  autoplay
                    ? "border-gold bg-gold/15 text-charcoal"
                    : "border-charcoal/20 text-charcoal/60 hover:border-charcoal/45"
                }`}
              >
                {autoplay ? "⏸ Tạm dừng tự động xoay" : "▶ Bật tự động xoay"}
              </button>
              <span className="hidden sm:inline">
                Mẹo: dùng ← → khi không gian 3D đang được chọn, hoặc kéo ngang bằng
                chuột — kéo dọc vẫn cuộn trang bình thường.
              </span>
            </div>
          </div>

          <div
            className="lg:col-span-2"
            onPointerEnter={() => setReadingDetail(true)}
            onPointerLeave={() => setReadingDetail(false)}
            onFocusCapture={() => pauseAutoplay()}
          >
            <DetailPanel
              topic={activeTopic}
              index={activeIndex}
              total={topicList.length}
              onPrev={() => selectTopic(activeIndex - 1)}
              onNext={() => selectTopic(activeIndex + 1)}
            />
          </div>
        </div>

        <div className="mt-20">
          <motion.p
            className="font-sans text-sm uppercase tracking-wideish text-burgundy/80"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            Kiểm chứng trích dẫn
          </motion.p>
          <motion.h3
            className="mt-3 max-w-2xl font-serif text-2xl font-semibold text-charcoal sm:text-3xl"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Những câu tưởng là của Bác — và sự thật tư liệu
          </motion.h3>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-charcoal/70">
            Danh sách dưới đây là kết quả đối chiếu với Hồ Chí Minh: Toàn tập và các
            tư liệu báo chí gốc. Mục tiêu không phải là “bắt lỗi”, mà để bạn dùng
            trích dẫn một cách có trách nhiệm trong bài luận và trong đời sống.
          </p>
          <div className="mt-6">
            <AuditList />
          </div>
        </div>

        <details className="group mt-12 rounded-2xl border border-charcoal/12 bg-cream/70 p-5">
          <summary className="focus-ring cursor-pointer list-none">
            <span className="font-serif text-lg font-semibold text-charcoal">
              Nguồn, chính sách nội dung và giấy phép
            </span>
            <span className="mt-1 block text-[12px] text-charcoal/55">
              Cách nhóm biên soạn kiểm chứng nội dung, tài liệu đối chiếu và giấy phép
              của ảnh, thư viện 3D. Mở để xem chi tiết.
            </span>
            <span className="mt-2 inline-block text-[11px] font-medium text-burgundy group-open:hidden">
              ▸ Mở chi tiết
            </span>
            <span className="mt-2 hidden text-[11px] font-medium text-burgundy group-open:inline-block">
              ▾ Thu gọn
            </span>
          </summary>
          <div className="mt-5">
            <SourcesPanel />
          </div>
        </details>
      </div>
    </section>
  );
}
