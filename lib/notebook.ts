"use client";

import { useEffect, useSyncExternalStore } from "react";

/**
 * Sổ tay ôn tập: lưu trích dẫn, việc nhỏ và ghi chú cá nhân vào localStorage.
 * Không có backend — toàn bộ dữ liệu nằm trên máy người đọc.
 */

const STORAGE_KEY = "soiduong.notebook.v1";

export type NotebookKind = "quote" | "task" | "note";

export type NotebookItem = {
  id: string;
  kind: NotebookKind;
  title: string;
  body?: string;
  source?: string;
  topicTitle?: string;
  savedAt: number;
};

export type NotebookState = {
  items: NotebookItem[];
  readTopics: string[];
  hydrated: boolean;
};

const EMPTY: NotebookState = { items: [], readTopics: [], hydrated: false };

let state: NotebookState = EMPTY;
const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((listener) => listener());
}

function isNotebookItem(value: unknown): value is NotebookItem {
  if (!value || typeof value !== "object") return false;
  const item = value as Partial<NotebookItem>;
  return typeof item.id === "string" && typeof item.title === "string";
}

function hydrate() {
  if (typeof window === "undefined" || state.hydrated) return;
  let next: NotebookState = { items: [], readTopics: [], hydrated: true };
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<NotebookState>;
      next.items = Array.isArray(parsed.items)
        ? parsed.items.filter(isNotebookItem)
        : [];
      next.readTopics = Array.isArray(parsed.readTopics)
        ? parsed.readTopics.filter((id): id is string => typeof id === "string")
        : [];
    }
  } catch {
    // Chế độ riêng tư hoặc dữ liệu hỏng: bỏ qua, coi như sổ trống.
  }
  state = next;
  emit();
}

function persist() {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ items: state.items, readTopics: state.readTopics })
    );
  } catch {
    // Hết dung lượng: vẫn giữ nguyên trong phiên làm việc hiện tại.
  }
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function getSnapshot() {
  return state;
}

function getServerSnapshot() {
  return EMPTY;
}

export function useNotebook(): NotebookState {
  const snapshot = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  useEffect(() => {
    hydrate();
  }, []);

  return snapshot;
}

export function saveToNotebook(item: Omit<NotebookItem, "savedAt">) {
  if (state.items.some((existing) => existing.id === item.id)) return;
  state = {
    ...state,
    items: [{ ...item, savedAt: Date.now() }, ...state.items],
  };
  persist();
  emit();
}

export function removeFromNotebook(id: string) {
  state = { ...state, items: state.items.filter((item) => item.id !== id) };
  persist();
  emit();
}

export function clearNotebook() {
  state = { ...state, items: [], readTopics: [] };
  persist();
  emit();
}

export function toggleReadTopic(id: string) {
  const has = state.readTopics.includes(id);
  state = {
    ...state,
    readTopics: has
      ? state.readTopics.filter((topicId) => topicId !== id)
      : [...state.readTopics, id],
  };
  persist();
  emit();
}

export function notebookToMarkdown(items: NotebookItem[], readTopics: string[], topics: { id: string; order: string; title: string }[]): string {
  const readTitles = topics
    .filter((topic) => readTopics.includes(topic.id))
    .map((topic) => `- [x] ${topic.order}. ${topic.title}`)
    .join("\n");

  const groups: Record<NotebookKind, string> = {
    quote: "Trích dẫn đã lưu",
    task: "Việc nhỏ đã lưu",
    note: "Ghi chú của tôi",
  };

  const sections = (Object.keys(groups) as NotebookKind[])
    .map((kind) => {
      const rows = items.filter((item) => item.kind === kind);
      if (rows.length === 0) return "";
      const body = rows
        .map((item) => {
          const source = item.source ? `\n   - Nguồn: ${item.source}` : "";
          const topic = item.topicTitle ? `\n   - Chuyên đề: ${item.topicTitle}` : "";
          return `- **${item.title}**${source}${topic}`;
        })
        .join("\n");
      return `## ${groups[kind]}\n${body}`;
    })
    .filter(Boolean)
    .join("\n\n");

  return [
    "# Sổ tay ôn tập — Soi Đường",
    "",
    `_Xuất ngày ${new Date().toLocaleDateString("vi-VN")} từ soiduong. Dữ liệu chỉ nằm trên máy của bạn._`,
    "",
    readTitles ? `## Chuyên đề đã đọc\n${readTitles}\n` : "",
    sections,
    "",
    "---",
    "Lưu ý học thuật: khi dùng cho bài luận, hãy đối chiếu lại bản in chính thức của Hồ Chí Minh: Toàn tập (NXB Chính trị quốc gia).",
    "",
  ]
    .filter((part) => part !== "")
    .join("\n");
}

/** Ghi chú cá nhân: cho phép ghi đè nội dung cũ của cùng một chuyên đề. */
export function upsertNote(item: Omit<NotebookItem, "savedAt">) {
  const exists = state.items.some((existing) => existing.id === item.id);
  state = {
    ...state,
    items: exists
      ? state.items.map((existing) =>
          existing.id === item.id
            ? { ...existing, ...item, savedAt: Date.now() }
            : existing
        )
      : [{ ...item, savedAt: Date.now() }, ...state.items],
  };
  persist();
  emit();
}
