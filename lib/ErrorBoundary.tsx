"use client";

import { Component, type ReactNode } from "react";

/**
 * Error boundary dùng chung cho các khung 3D.
 *
 * Lý do tồn tại: `useLoader` của @react-three/fiber chạy qua `suspend-react`,
 * khi tài nguyên tải lỗi thì nó ném lỗi ngay trong render phase. Nếu không có
 * boundary, lỗi sẽ lan lên error boundary của Next và làm hỏng cả trang.
 */
export default class ErrorBoundary extends Component<
  { children: ReactNode; fallback: ReactNode; onError?: () => void },
  { hasError: boolean }
> {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch() {
    this.props.onError?.();
  }

  render() {
    if (this.state.hasError) return this.props.fallback;
    return this.props.children;
  }
}
