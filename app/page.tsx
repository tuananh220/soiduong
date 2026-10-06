"use client";

import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import SiteHeader from "@/components/SiteHeader";
import GenZCards from "@/components/GenZCards";
import ChallengeSection from "@/components/ChallengeSection";
import ScrollProgress from "@/components/ScrollProgress";
import ThoughtSection from "@/components/ThoughtSection";
import KnowledgeCards from "@/components/KnowledgeCards";
import CitationGame from "@/components/CitationGame";
import RoadmapSection from "@/components/RoadmapSection";
import NotebookSection from "@/components/NotebookSection";

// Các khung 3D chỉ render phía client.
const Hero3D = dynamic(() => import("@/components/Hero3D"), {
  ssr: false,
  loading: () => <div className="h-[320px] w-full sm:h-[420px] md:h-[520px]" />,
});
const GlobeSection = dynamic(() => import("@/components/GlobeSection"), {
  ssr: false,
});

export default function Home() {
  return (
    <main id="top">
      <ScrollProgress />
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
              Các trích dẫn trong phiên bản này đã được đối chiếu với Hồ Chí Minh:
              Toàn tập và tư liệu báo chí gốc; câu nào là bản rút gọn hoặc tinh
              thần đều được ghi chú ngay tại chỗ.{" "}
              <a
                href="#tu-tuong"
                className="focus-ring font-medium text-burgundy underline decoration-burgundy/30 underline-offset-4 hover:decoration-burgundy"
              >
                Xem bảng kiểm chứng trích dẫn
              </a>
              .
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
              href="#tu-tuong"
              className="focus-ring rounded-full border border-charcoal/20 px-7 py-3 text-sm font-medium text-charcoal transition-colors hover:border-charcoal/50"
            >
              Sáu chuyên đề tư tưởng
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
      <ThoughtSection />
      <KnowledgeCards />
      <GenZCards />
      <ChallengeSection />
      <RoadmapSection />
      <NotebookSection />

      <footer className="bg-cream px-6 py-10 text-center text-xs leading-relaxed text-charcoal/55 sm:px-10 lg:px-16">
        <p>
          Soi Đường — dự án học liệu tương tác, xây dựng cho mục đích giáo dục.
        </p>
        <p className="mx-auto mt-2 max-w-2xl">
          Nội dung trích dẫn được đối chiếu với Hồ Chí Minh: Toàn tập (NXB Chính trị
          quốc gia), Di chúc và các tư liệu báo chí gốc; ảnh tư liệu thuộc Wikimedia
          Commons với giấy phép tự do. Sổ tay ôn tập lưu dữ liệu ngay trên trình duyệt
          của bạn.
        </p>
        <p className="mt-2">
          <a
            href="#tu-tuong"
            className="focus-ring text-burgundy underline decoration-burgundy/30 underline-offset-4 hover:decoration-burgundy"
          >
            Nguồn &amp; kiểm chứng trích dẫn
          </a>
        </p>
      </footer>
    </main>
  );
}
