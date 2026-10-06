"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Theo dõi một phần tử có nằm trong khung nhìn hay không.
 * - `hasBeenInView`: đã từng vào khung nhìn (dùng để gắn 3D một lần rồi giữ).
 * - `inView`: đang trong khung nhìn (dùng để tạm dừng vòng lặp render).
 *
 * Dùng IntersectionObserver trực tiếp thay vì hook của framer-motion để tách
 * "gắn một lần" khỏi "đang hiển thị".
 */
export function useInViewState<T extends HTMLElement>({
  rootMargin = "0px",
  threshold = 0,
}: {
  rootMargin?: string;
  threshold?: number;
} = {}) {
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(false);
  const [hasBeenInView, setHasBeenInView] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    if (typeof IntersectionObserver === "undefined") {
      setInView(true);
      setHasBeenInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (!entry) return;
        setInView(entry.isIntersecting);
        if (entry.isIntersecting) setHasBeenInView(true);
      },
      { rootMargin, threshold },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [rootMargin, threshold]);

  return { ref, inView, hasBeenInView };
}
