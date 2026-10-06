"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import topics from "@/data/tu-tuong.json";
import {
  clearNotebook,
  notebookToMarkdown,
  removeFromNotebook,
  useNotebook,
  type NotebookKind,
} from "@/lib/notebook";

const GROUPS: { kind: NotebookKind; label: string; hint: string }[] = [
  {
    kind: "quote",
    label: "Trích dẫn đã lưu",
    hint: "Những câu bạn muốn dùng lại trong bài viết, thuyết trình.",
  },
  {
    kind: "task",
    label: "Việc nhỏ đã lưu",
    hint: "Hành động cụ thể cho tuần này, rút ra từ từng chuyên đề.",
  },
  {
    kind: "note",
    label: "Ghi chú của tôi",
    hint: "Suy nghĩ riêng của bạn — phần quan trọng nhất của sổ tay.",
  },
];

export default function NotebookSection() {
  const { items, readTopics } = useNotebook();
  const [copied, setCopied] = useState(false);
  const [confirmingClear, setConfirmingClear] = useState(false);

  const readTitles = useMemo(
    () =>
      topics
        .filter((topic) => readTopics.includes(topic.id))
        .map((topic) => `${topic.order}. ${topic.title}`),
    [readTopics],
  );

  const markdown = useMemo(
    () =>
      notebookToMarkdown(items, readTopics, topics as { id: string; order: string; title: string }[]),
    [items, readTopics],
  );

  const counts: Record<NotebookKind, number> = {
    quote: items.filter((item) => item.kind === "quote").length,
    task: items.filter((item) => item.kind === "task").length,
    note: items.filter((item) => item.kind === "note").length,
  };

  function downloadMarkdown() {
    const blob = new Blob([markdown], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `so-tay-soi-duong-${new Date().toISOString().slice(0, 10)}.md`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  }

  async function copyMarkdown() {
    try {
      await navigator.clipboard.writeText(markdown);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } catch {
      setCopied(false);
    }
  }

  const isEmpty = items.length === 0 && readTopics.length === 0;

  return (
    <section id="so-tay" className="bg-charcoal px-6 py-16 text-cream sm:px-10 lg:px-16">
      <div className="mx-auto max-w-5xl">
        <motion.p
          className="font-sans text-sm uppercase tracking-wideish text-gold/80"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          Sổ tay ôn tập
        </motion.p>
        <motion.h2
          className="mt-3 max-w-2xl font-serif text-3xl font-semibold leading-tight sm:text-4xl"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          Mang nội dung ra khỏi trang web
        </motion.h2>
        <motion.p
          className="mt-4 max-w-2xl text-cream/70"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          Mọi thứ bạn lưu ở phần Tư tưởng và phần Trích dẫn được giữ trong trình duyệt
          của bạn — không có tài khoản, không có máy chủ. Xuất ra file Markdown để
          mang vào bài luận, hoặc in thành bản giấy để ôn thi.
        </motion.p>

        <div className="mt-6 flex flex-wrap gap-3 text-[11px]">
          {GROUPS.map((group) => (
            <span
              key={group.kind}
              className="rounded-full border border-cream/15 bg-cream/5 px-3 py-1.5 text-cream/70"
            >
              {group.label}: <strong className="font-semibold text-gold">{counts[group.kind]}</strong>
            </span>
          ))}
          <span className="rounded-full border border-cream/15 bg-cream/5 px-3 py-1.5 text-cream/70">
            Chuyên đề đã đọc:{" "}
            <strong className="font-semibold text-gold">
              {readTopics.length}/{topics.length}
            </strong>
          </span>
        </div>

        {isEmpty ? (
          <div className="mt-8 rounded-2xl border border-cream/15 bg-cream/[0.04] p-6 text-sm leading-relaxed text-cream/70">
            Sổ tay đang trống. Hãy vào mục <strong className="text-cream">Tư tưởng</strong>{" "}
            và bấm “Lưu vào sổ tay” ở một trích dẫn, hoặc lưu “Việc nhỏ tuần này” của
            một chuyên đề. Bạn cũng có thể lưu câu nói ở phần{" "}
            <strong className="text-cream">Bộ sưu tập trích dẫn</strong>.
          </div>
        ) : (
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {GROUPS.map((group) => {
              const groupItems = items.filter((item) => item.kind === group.kind);
              return (
                <div
                  key={group.kind}
                  className="rounded-2xl border border-cream/12 bg-charcoal-soft/50 p-5"
                >
                  <h3 className="font-serif text-lg font-semibold">{group.label}</h3>
                  <p className="mt-1 text-[11px] text-cream/50">{group.hint}</p>

                  {groupItems.length === 0 ? (
                    <p className="mt-4 text-xs text-cream/40">Chưa có mục nào.</p>
                  ) : (
                    <ul className="mt-4 space-y-3">
                      {groupItems.map((item) => (
                        <li
                          key={item.id}
                          className="rounded-xl border border-cream/10 bg-black/20 p-3"
                        >
                          <p className="font-serif text-sm leading-snug text-cream/90">
                            {item.kind === "quote" ? `“${item.title}”` : item.title}
                          </p>
                          {item.source ? (
                            <p className="mt-1 text-[11px] leading-relaxed text-cream/50">
                              {item.source}
                            </p>
                          ) : null}
                          {item.topicTitle ? (
                            <p className="mt-1 text-[10px] uppercase tracking-wideish text-gold/70">
                              {item.topicTitle}
                            </p>
                          ) : null}
                          <button
                            type="button"
                            onClick={() => removeFromNotebook(item.id)}
                            className="focus-ring mt-2 text-[11px] text-cream/45 underline decoration-cream/20 underline-offset-4 transition-colors hover:text-burgundy-light"
                          >
                            Xoá khỏi sổ tay
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              );
            })}
          </div>
        )}

        <div className="mt-8 flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={downloadMarkdown}
            disabled={isEmpty}
            className="focus-ring rounded-full bg-gold px-5 py-2.5 text-sm font-medium text-charcoal transition-transform hover:scale-[1.03] disabled:cursor-not-allowed disabled:opacity-40"
          >
            ⤓ Xuất file Markdown
          </button>
          <button
            type="button"
            onClick={copyMarkdown}
            disabled={isEmpty}
            className="focus-ring rounded-full border border-gold/50 px-5 py-2.5 text-sm font-medium text-gold transition-colors hover:bg-gold/10 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {copied ? "Đã sao chép ✓" : "Sao chép nội dung"}
          </button>
          <button
            type="button"
            onClick={() => window.print()}
            disabled={isEmpty}
            className="focus-ring rounded-full border border-cream/20 px-5 py-2.5 text-sm text-cream/75 transition-colors hover:border-cream/45 disabled:cursor-not-allowed disabled:opacity-40"
          >
            In / Lưu PDF
          </button>
          <button
            type="button"
            onClick={() => {
              if (!confirmingClear) {
                setConfirmingClear(true);
                setTimeout(() => setConfirmingClear(false), 4000);
                return;
              }
              clearNotebook();
              setConfirmingClear(false);
            }}
            disabled={isEmpty}
            className="focus-ring ml-auto rounded-full border border-burgundy-light/40 px-4 py-2.5 text-xs text-burgundy-light transition-colors hover:bg-burgundy-light/10 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {confirmingClear ? "Bấm lần nữa để xoá hết" : "Xoá toàn bộ sổ tay"}
          </button>
        </div>

        {readTitles.length > 0 ? (
          <div className="mt-10 rounded-2xl border border-cream/12 bg-cream/[0.04] p-5">
            <h3 className="text-[11px] font-semibold uppercase tracking-wideish text-gold/80">
              Chuyên đề bạn đã đánh dấu đã đọc
            </h3>
            <ul className="mt-3 grid gap-2 sm:grid-cols-2">
              {readTitles.map((title) => (
                <li key={title} className="text-sm text-cream/75">
                  ✓ {title}
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </div>
    </section>
  );
}
