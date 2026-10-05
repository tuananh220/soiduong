"use client";

import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import SiteHeader from "@/components/SiteHeader";
import GenZCards from "@/components/GenZCards";
import ChallengeSection from "@/components/ChallengeSection";

// 3D canvases must render client-side only.
const Hero3D = dynamic(() => import("@/components/Hero3D"), {
  ssr: false,
  loading: () => <div className="h-[320px] w-full sm:h-[420px] md:h-[520px]" />,
});
const GlobeSection = dynamic(() => import("@/components/GlobeSection"), {
  ssr: false,
});

export default function Home() {
  return (
    <main>
      <SiteHeader />

      <section className="relative overflow-hidden bg-cream px-6 pb-16 pt-28 sm:px-10 sm:pt-32 lg:px-16">
        <div
          className="pointer-events-none absolute inset-0 bg-radial-fade"
          aria-hidden="true"
        />
        <motion.div
          className="relative mx-auto max-w-5xl text-center"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.14 } },
          }}
        >
          <motion.p
            className="font-sans text-sm uppercase tracking-wideish text-burgundy/80"
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: "easeOut" } },
            }}
          >
            Môn học Tư tưởng Hồ Chí Minh — phiên bản tương tác
          </motion.p>
          <motion.h1
            className="mx-auto mt-4 max-w-3xl font-serif text-4xl font-semibold leading-tight text-charcoal sm:text-5xl md:text-6xl"
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: "easeOut" } },
            }}
          >
            Kim chỉ nam cho thế hệ trẻ
          </motion.h1>
          <motion.p
            className="mx-auto mt-5 max-w-xl text-charcoal/70"
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: "easeOut" } },
            }}
          >
            Không phải sáu chương giáo trình dàn trải — mà là những giá trị cốt
            lõi, được kể lại theo cách một người trẻ hôm nay có thể mang vào đời
            sống của mình.
          </motion.p>

          <motion.div
            className="mx-auto mt-6 max-w-3xl rounded-2xl border border-burgundy/20 bg-burgundy/5 px-4 py-3 text-left text-sm leading-relaxed text-charcoal/75 sm:px-6"
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: "easeOut" } },
            }}
          >
            <p className="font-medium text-burgundy">Ghi chú lịch sử:</p>
            <p className="mt-1">
              Một số câu nói và bài học ở đây được rút ra từ tư tưởng, lời nói,
              và hành động của Người, không phải lúc nào cũng là trích dẫn
              nguyên văn. Mục tiêu là giúp thế hệ trẻ hiểu giá trị và cách vận
              dụng vào đời sống hiện đại một cách đúng mực và có trách nhiệm.
            </p>
          </motion.div>

          <Hero3D />

          <motion.div
            className="mt-2 flex flex-col items-center justify-center gap-3 sm:flex-row"
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: "easeOut" } },
            }}
          >
            <a
              href="#hanh-trinh"
              className="focus-ring rounded-full bg-burgundy px-7 py-3 text-sm font-medium text-cream transition-transform hover:scale-[1.03]"
            >
              Khám phá hành trình
            </a>
            <a
              href="#thach-thuc"
              className="focus-ring rounded-full border border-charcoal/20 px-7 py-3 text-sm font-medium text-charcoal transition-colors hover:border-charcoal/50"
            >
              Trạm thách thức
            </a>
          </motion.div>
        </motion.div>
      </section>

      <GlobeSection />
      <GenZCards />
      <ChallengeSection />

      <footer className="bg-cream px-6 py-10 text-center text-xs text-charcoal/50 sm:px-10 lg:px-16">
        Soi Đường — dự án học liệu tương tác, xây dựng cho mục đích giáo dục.
      </footer>
    </main>
  );
}
