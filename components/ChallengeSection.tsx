"use client";

import { motion } from "framer-motion";
import QuizGame from "./QuizGame";
import QuoteGallery from "./QuoteGallery";

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay, ease: "easeOut" },
  }),
};

export default function ChallengeSection() {
  return (
    <section id="thach-thuc" className="bg-charcoal px-6 py-20 text-cream sm:px-10 lg:px-16">
      <div className="mx-auto max-w-5xl">
        <motion.p
          className="text-center font-sans text-sm uppercase tracking-wideish text-gold/80"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          custom={0}
        >
          Trạm thách thức
        </motion.p>
        <motion.h2
          className="mt-3 text-center font-serif text-3xl font-semibold leading-tight sm:text-4xl"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          custom={0.1}
        >
          Bạn sẽ chọn gì trong tình huống này?
        </motion.h2>

        <motion.div
          className="mt-10"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <QuizGame />
        </motion.div>

        <div className="mt-20">
          <motion.p
            className="text-center font-sans text-sm uppercase tracking-wideish text-gold/80"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            custom={0}
          >
            Bộ sưu tập trích dẫn
          </motion.p>
          <motion.h3
            className="mt-3 text-center font-serif text-2xl font-semibold"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            custom={0.1}
          >
            Lật thẻ, đọc nguồn, lưu lại điều bạn muốn mang theo
          </motion.h3>
          <motion.p
            className="mx-auto mt-3 max-w-xl text-center text-sm text-cream/60"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            custom={0.15}
          >
            Tám trích dẫn đã đối chiếu nguồn, lọc theo chuyên đề. Câu nào bạn lưu sẽ
            nằm trong Sổ tay ôn tập ở cuối trang.
          </motion.p>
          <QuoteGallery />
        </div>
      </div>
    </section>
  );
}
