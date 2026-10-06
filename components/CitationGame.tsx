"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import game from "@/data/trot-choi.json";
import QuoteSource from "./QuoteSource";
import type { GameData, GameItem } from "@/lib/types";

const ROUND_SIZE = 8;
const HIGH_SCORE_KEY = "soiduong.game.best.v1";

type Round = {
  items: GameItem[];
  options: string[];
};

function shuffle<T>(input: T[]): T[] {
  const array = [...input];
  for (let i = array.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function buildRound(): Round {
  const data = game as GameData;
  const items = shuffle(data.items).slice(0, ROUND_SIZE);
  // Phương án nhiễu lấy từ chính danh sách tác giả đã kiểm chứng, không bịa thêm.
  const options = shuffle(data.authors);
  return { items, options };
}

function readBest(): number {
  if (typeof window === "undefined") return 0;
  try {
    const raw = window.localStorage.getItem(HIGH_SCORE_KEY);
    const value = raw ? Number.parseInt(raw, 10) : 0;
    return Number.isFinite(value) ? value : 0;
  } catch {
    return 0;
  }
}

export default function CitationGame() {
  const data = game as GameData;
  const [round, setRound] = useState<Round>(() => buildRound());
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const [best, setBest] = useState(0);

  useEffect(() => {
    setBest(readBest());
  }, []);

  const current = round.items[index];
  const isCorrect = selected !== null && selected === current?.author;

  const verdictText = useMemo(() => {
    if (selected === null) return "";
    return isCorrect
      ? "Chính xác — và đây là điều đáng nhớ:"
      : `Chưa đúng. Câu này là của ${current.author}:`;
  }, [selected, isCorrect, current]);

  const next = useCallback(() => {
    if (index + 1 < round.items.length) {
      setIndex((value) => value + 1);
      setSelected(null);
      return;
    }
    setFinished(true);
    setBest((previous) => {
      const nextBest = Math.max(previous, score);
      try {
        window.localStorage.setItem(HIGH_SCORE_KEY, String(nextBest));
      } catch {
        // không lưu được thì thôi, điểm vẫn hiển thị trong phiên này
      }
      return nextBest;
    });
  }, [index, round.items.length, score]);

  function restart() {
    setRound(buildRound());
    setIndex(0);
    setSelected(null);
    setScore(0);
    setFinished(false);
  }

  function choose(author: string) {
    if (selected !== null) return;
    setSelected(author);
    if (author === current.author) setScore((value) => value + 1);
  }

  return (
    <div className="mx-auto max-w-3xl rounded-2xl border border-charcoal/10 bg-cream p-6 shadow-[0_20px_50px_-30px_rgba(28,26,23,0.5)] sm:p-8">
      {!finished ? (
        <>
          <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-charcoal/55">
            <span>
              Câu {index + 1} / {round.items.length}
            </span>
            <span className="flex items-center gap-3">
              <span>Điểm: {score}</span>
              {best > 0 ? (
                <span className="rounded-full bg-gold/15 px-2 py-0.5 font-medium text-charcoal/70">
                  Kỷ lục của bạn: {best}/{ROUND_SIZE}
                </span>
              ) : null}
            </span>
          </div>

          <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-charcoal/10">
            <div
              className="h-full rounded-full bg-burgundy transition-all duration-500"
              style={{
                width: `${((index + (selected ? 1 : 0)) / round.items.length) * 100}%`,
              }}
            />
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={current.id}
              initial={{ opacity: 0, x: 14 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -14 }}
              transition={{ duration: 0.25 }}
            >
              <p className="mt-6 text-[11px] font-semibold uppercase tracking-wideish text-burgundy/80">
                Câu này của ai?
              </p>
              <blockquote className="mt-2 font-serif text-xl font-medium leading-snug text-charcoal sm:text-2xl">
                “{current.text}”
              </blockquote>

              <div className="mt-5 grid gap-2 sm:grid-cols-2">
                {round.options.map((author) => {
                  const isChosen = selected === author;
                  const reveal = selected !== null;
                  const isAnswer = author === current.author;
                  return (
                    <button
                      key={author}
                      type="button"
                      onClick={() => choose(author)}
                      disabled={reveal}
                      className={`focus-ring rounded-xl border px-4 py-3 text-left text-sm font-medium transition-colors ${
                        reveal && isAnswer
                          ? "border-burgundy bg-burgundy/10 text-burgundy"
                          : reveal && isChosen
                            ? "border-charcoal/40 bg-charcoal/5 text-charcoal/70 line-through"
                            : "border-charcoal/15 text-charcoal/75 hover:border-charcoal/40"
                      }`}
                    >
                      {author}
                    </button>
                  );
                })}
              </div>

              {selected !== null ? (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="mt-4 overflow-hidden rounded-xl bg-charcoal/[0.04] p-4 text-sm leading-relaxed text-charcoal/75"
                >
                  <p className="font-medium text-charcoal">
                    {isCorrect ? "Chính xác! 🎯 " : ""}
                    {verdictText}
                  </p>
                  <p className="mt-1">{current.explain}</p>
                  {"sourceUrl" in current && current.sourceUrl ? (
                    <QuoteSource
                      source="Tư liệu đối chiếu"
                      sourceUrl={current.sourceUrl}
                      className="mt-2 block text-[12px] text-charcoal/55"
                      linkClassName="focus-ring font-medium text-burgundy underline decoration-burgundy/30 underline-offset-2 hover:decoration-burgundy"
                    />
                  ) : "sourceNote" in current && current.sourceNote ? (
                    <p className="mt-2 text-[12px] text-charcoal/55">{current.sourceNote}</p>
                  ) : null}
                  <button
                    type="button"
                    onClick={next}
                    className="focus-ring mt-4 rounded-full bg-burgundy px-5 py-2 text-sm font-medium text-cream transition-transform hover:scale-[1.03]"
                  >
                    {index + 1 < round.items.length ? "Câu tiếp theo" : "Xem kết quả"}
                  </button>
                </motion.div>
              ) : null}
            </motion.div>
          </AnimatePresence>
        </>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <p className="text-[11px] font-semibold uppercase tracking-wideish text-burgundy/80">
            Kết quả vòng chơi
          </p>
          <p className="mt-3 font-serif text-4xl font-semibold text-charcoal">
            {score}/{round.items.length}
          </p>
          <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-charcoal/70">
            {score === round.items.length
              ? "Bạn phân biệt rất tốt đâu là câu của Bác, đâu là thơ văn và danh ngôn được dẫn lại. Đây chính là kỹ năng cần có khi trích dẫn trong bài luận."
              : score >= round.items.length * 0.7
                ? "Khá tốt. Xem lại vài câu bị nhầm — phần lớn các trường hợp nhầm đều rơi vào thơ văn viết về Bác và những câu Bác dẫn lại."
                : "Hãy thử lại sau khi đọc mục “Kiểm chứng trích dẫn” ở phần Tư tưởng: có 12 trường hợp thường bị gán sai được phân tích cụ thể."}
          </p>
          {best > 0 ? (
            <p className="mt-2 text-xs text-charcoal/50">Kỷ lục của bạn: {best}/{ROUND_SIZE}</p>
          ) : null}
          <button
            type="button"
            onClick={restart}
            className="focus-ring mt-6 rounded-full border border-burgundy/50 px-6 py-2 text-sm font-medium text-burgundy hover:bg-burgundy/10"
          >
            Chơi vòng mới
          </button>
        </motion.div>
      )}
    </div>
  );
}
