"use client";

import { useSyncExternalStore } from "react";

/**
 * Tùy chọn hiệu ứng của người đọc:
 * - `useReduceEffects()`: true khi người dùng bật giảm hiệu ứng (nút trong trang)
 *   hoặc khi hệ điều hành bật "prefers-reduced-motion".
 * - `useCanHover()`: true khi thiết bị có con trỏ chính xác (chuột/bút), dùng để
 *   tắt các hiệu ứng nghiêng thẻ trên màn hình cảm ứng.
 *
 * Cả hai đều đọc từ store ngoài React + localStorage nên nhiều component dùng
 * chung một giá trị, không cần context.
 */

const REDUCE_KEY = "soiduong.reduce-effects.v1";
const HOVER_QUERY = "(hover: hover) and (pointer: fine)";

let reduceEffects = false;
let reduceHydrated = false;
const reduceListeners = new Set<() => void>();

let canHover = false;
let hoverHydrated = false;
const hoverListeners = new Set<() => void>();

function emitReduce() {
  reduceListeners.forEach((listener) => listener());
}

function emitHover() {
  hoverListeners.forEach((listener) => listener());
}

function hydrateReduce() {
  if (reduceHydrated || typeof window === "undefined") return;
  reduceHydrated = true;
  try {
    const stored = window.localStorage.getItem(REDUCE_KEY);
    if (stored === "1") reduceEffects = true;
    else if (stored === "0") reduceEffects = false;
    else reduceEffects = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  } catch {
    reduceEffects = false;
  }
  emitReduce();
}

function subscribeReduce(listener: () => void) {
  reduceListeners.add(listener);
  hydrateReduce();
  return () => {
    reduceListeners.delete(listener);
  };
}

function hydrateHover() {
  if (hoverHydrated || typeof window === "undefined") return;
  hoverHydrated = true;
  canHover = window.matchMedia(HOVER_QUERY).matches;
  emitHover();
}

function subscribeHover(listener: () => void) {
  hoverListeners.add(listener);
  hydrateHover();
  return () => {
    hoverListeners.delete(listener);
  };
}

export function useReduceEffects(): boolean {
  return useSyncExternalStore(subscribeReduce, () => reduceEffects, () => false);
}

export function useCanHover(): boolean {
  return useSyncExternalStore(subscribeHover, () => canHover, () => false);
}

export function setReduceEffects(value: boolean) {
  reduceEffects = value;
  reduceHydrated = true;
  try {
    window.localStorage.setItem(REDUCE_KEY, value ? "1" : "0");
  } catch {
    // chế độ riêng tư: chỉ giữ trong phiên hiện tại
  }
  applyReduceAttribute(value);
  emitReduce();
}

/** Phản chiếu lựa chọn lên <html> để CSS tắt animation giống như khi OS yêu cầu. */
export function applyReduceAttribute(value: boolean) {
  if (typeof document === "undefined") return;
  if (value) document.documentElement.dataset.reduceEffects = "true";
  else delete document.documentElement.dataset.reduceEffects;
}

export function initReduceEffects() {
  hydrateReduce();
  applyReduceAttribute(reduceEffects);
}
