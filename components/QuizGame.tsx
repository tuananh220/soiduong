"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import quizData from "@/data/quiz.json";

type Option = { id: string; text: string; correct: boolean };
type Question = { id: string; prompt: string; options: Option[]; explain: string };

export default function QuizGame() {
  const questions = quizData as Question[];
  const [step, setStep] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  const current = questions[step];
  const isCorrect = useMemo(
    () => current.options.find((o) => o.id === selected)?.correct ?? false,
    [current, selected]
  );

  function choose(optionId: string) {
    if (selected) return;
    setSelected(optionId);
    const correct = current.options.find((o) => o.id === optionId)?.correct;
    if (correct) setScore((s) => s + 1);
  }

  function next() {
    if (step + 1 < questions.length) {
      setStep((s) => s + 1);
      setSelected(null);
    } else {
      setFinished(true);
    }
  }

  function restart() {
    setStep(0);
    setSelected(null);
    setScore(0);
    setFinished(false);
  }

  return (
    <div className="mx-auto max-w-2xl rounded-2xl border border-cream/15 bg-charcoal-soft/40 p-6 sm:p-8">
      {!finished ? (
        <>
          <div className="flex items-center justify-between text-xs text-cream/50">
            <span>
              Câu {step + 1} / {questions.length}
            </span>
            <span>{score} điểm</span>
          </div>
          <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-cream/10">
            <div
              className="h-full rounded-full bg-gold transition-all duration-500"
              style={{ width: `${((step + (selected ? 1 : 0)) / questions.length) * 100}%` }}
            />
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={current.id}
              initial={{ opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -12 }}
              transition={{ duration: 0.25 }}
            >
              <h3 className="mt-5 font-serif text-xl font-semibold leading-snug text-cream">
                {current.prompt}
              </h3>

              <div className="mt-5 grid gap-3">
                {current.options.map((opt) => {
                  const isChosen = selected === opt.id;
                  const showState = selected !== null;
                  return (
                    <button
                      key={opt.id}
                      onClick={() => choose(opt.id)}
                      disabled={selected !== null}
                      className={`focus-ring rounded-xl border px-4 py-3 text-left text-sm transition-colors ${
                        showState && opt.correct
                          ? "border-gold bg-gold/10 text-gold"
                          : showState && isChosen && !opt.correct
                          ? "border-burgundy-light bg-burgundy-light/10 text-burgundy-light"
                          : "border-cream/15 text-cream/80 hover:border-cream/35"
                      }`}
                    >
                      <span className="mr-2 font-medium uppercase">
                        {opt.id}.
                      </span>
                      {opt.text}
                    </button>
                  );
                })}
              </div>

              {selected && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="mt-4 overflow-hidden rounded-xl bg-black/20 p-4 text-sm text-cream/75"
                >
                  <p className="font-medium text-cream">
                    {isCorrect ? "Chính xác! 🎯" : "Chưa đúng lắm."}
                  </p>
                  <p className="mt-1">{current.explain}</p>
                  <button
                    onClick={next}
                    className="focus-ring mt-4 rounded-full bg-gold px-5 py-2 text-sm font-medium text-charcoal transition-transform hover:scale-[1.03]"
                  >
                    {step + 1 < questions.length ? "Câu tiếp theo" : "Xem kết quả"}
                  </button>
                </motion.div>
              )}
            </motion.div>
          </AnimatePresence>
        </>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <p className="text-sm uppercase tracking-wideish text-gold/80">
            Kết quả
          </p>
          <p className="mt-3 font-serif text-4xl font-semibold text-cream">
            {score}/{questions.length}
          </p>
          <p className="mt-2 text-sm text-cream/70">
            {score === questions.length
              ? "Trọn vẹn — bạn nắm rất chắc tinh thần ứng dụng thực tiễn."
              : "Không sao, quay lại từng tình huống để hiểu sâu hơn."}
          </p>
          <button
            onClick={restart}
            className="focus-ring mt-6 rounded-full border border-gold/60 px-6 py-2 text-sm font-medium text-gold hover:bg-gold/10"
          >
            Làm lại
          </button>
        </motion.div>
      )}
    </div>
  );
}
