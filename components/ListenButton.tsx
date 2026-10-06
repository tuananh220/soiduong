"use client";

import { useEffect, useRef, useState } from "react";
import { useReduceEffects } from "@/lib/prefs";

/**
 * Nút nghe dùng chung cho mọi clip âm thanh.
 *
 * Nguyên tắc:
 * - Không bao giờ tự phát (`preload="none"`, chỉ phát khi người dùng bấm).
 * - Chỉ một clip phát tại một thời điểm (biến `currentAudio` ở phạm vi module).
 * - Trạng thái nút phơi ra cho trình đọc màn hình qua `aria-pressed` + vùng `aria-live`.
 * - Khi bật "Giảm hiệu ứng": không hiện sóng nhạc động, chỉ hiện chữ trạng thái.
 */
let currentAudio: HTMLAudioElement | null = null;

function formatSeconds(value: number) {
  const total = Math.max(0, Math.round(value));
  const minutes = Math.floor(total / 60);
  const seconds = total % 60;
  return `${minutes}:${String(seconds).padStart(2, "0")}`;
}

type Props = {
  /** Đường dẫn file trong /public, ví dụ "/audio/gioi-thieu.mp3". */
  src: string;
  /** Nhãn hiển thị trên nút, ví dụ "Nghe giới thiệu trang". */
  label: string;
  /** Thời lượng ghi trong data/audio.json; dùng để đối chiếu với file thật. */
  seconds: number;
  /** Mô tả ngắn, hiện dưới nút (nội dung đã kiểm duyệt, bản chữ có sẵn trên trang). */
  note?: string;
  className?: string;
};

export default function ListenButton({ src, label, seconds, note, className = "" }: Props) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [failed, setFailed] = useState(false);
  const reduceEffects = useReduceEffects();

  useEffect(() => {
    // Giữ tham chiếu ngay khi effect chạy, không đọc lại ref trong hàm dọn dẹp.
    const audio = audioRef.current;
    return () => {
      if (audio && currentAudio === audio) {
        audio.pause();
        currentAudio = null;
      }
    };
  }, []);

  function toggle() {
    const audio = audioRef.current;
    if (!audio) return;

    if (audio.paused) {
      // Tạm dừng clip đang phát ở nơi khác để hai câu không đọc chồng nhau.
      if (currentAudio && currentAudio !== audio) {
        currentAudio.pause();
      }
      currentAudio = audio;
      void audio.play().then(
        () => setFailed(false),
        () => setFailed(true),
      );
    } else {
      audio.pause();
    }
  }

  const progress = seconds > 0 ? Math.min(100, (elapsed / seconds) * 100) : 0;

  return (
    <div
      className={`rounded-2xl border border-charcoal/10 bg-cream/70 p-4 text-left ${className}`}
    >
      <audio
        ref={audioRef}
        src={src}
        preload="none"
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onEnded={() => {
          setPlaying(false);
          setElapsed(0);
        }}
        onTimeUpdate={(event) => setElapsed(event.currentTarget.currentTime)}
        onError={() => setFailed(true)}
      />

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={toggle}
          aria-pressed={playing}
          className="focus-ring flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-burgundy text-cream transition-transform hover:scale-[1.04]"
        >
          <span aria-hidden="true" className="text-lg leading-none">
            {playing ? "❙❙" : "▶"}
          </span>
          <span className="sr-only">
            {playing ? `Tạm dừng: ${label}` : `${label} (${formatSeconds(seconds)})`}
          </span>
        </button>

        <div className="min-w-0 flex-1">
          <p className="truncate text-[13px] font-medium text-charcoal">{label}</p>
          <div className="mt-1 flex items-center gap-2">
            <div className="h-1 flex-1 overflow-hidden rounded-full bg-charcoal/10">
              <div
                className="h-full rounded-full bg-burgundy transition-[width] duration-200"
                style={{ width: `${playing || elapsed > 0 ? progress : 0}%` }}
              />
            </div>
            <span className="shrink-0 font-sans text-[11px] tabular-nums text-charcoal/60">
              {playing || elapsed > 0
                ? `${formatSeconds(elapsed)} / ${formatSeconds(seconds)}`
                : formatSeconds(seconds)}
            </span>
          </div>
        </div>

        {playing && !reduceEffects ? (
          <span aria-hidden="true" className="flex h-4 shrink-0 items-end gap-[3px]">
            {[0, 1, 2].map((bar) => (
              <span
                key={bar}
                className="w-[3px] animate-pulse rounded-full bg-gold"
                style={{ height: `${8 + bar * 4}px`, animationDelay: `${bar * 120}ms` }}
              />
            ))}
          </span>
        ) : null}
      </div>

      <p aria-live="polite" className="sr-only">
        {playing ? `Đang phát: ${label}` : ""}
      </p>

      {failed ? (
        <p className="mt-2 text-[11px] text-burgundy">
          Không phát được clip này. Bản chữ đầy đủ vẫn nằm ngay trên trang.
        </p>
      ) : null}

      {note ? (
        <p className="mt-2 text-[11px] leading-relaxed text-charcoal/60">{note}</p>
      ) : null}
    </div>
  );
}
