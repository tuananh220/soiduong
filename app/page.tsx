"use client";

import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import SiteHeader from "@/components/SiteHeader";
import GenZCards from "@/components/GenZCards";
import ChallengeSection from "@/components/ChallengeSection";
import ScrollProgress from "@/components/ScrollProgress";
import SectionNav from "@/components/SectionNav";
import ListenButton from "@/components/ListenButton";
import VoiceArchive from "@/components/VoiceArchive";
import audioData from "@/data/audio.json";
import { SECTIONS } from "@/lib/sections";
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
      <SectionNav />

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

          <Hero3D />

          <motion.div
            className="mt-2 flex flex-col items-center gap-5"
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: "easeOut" } },
            }}
          >
            <a
              href="#hanh-trinh"
              className="focus-ring rounded-full bg-burgundy px-7 py-3 text-sm font-medium text-cream transition-transform hover:scale-[1.03]"
            >
              Bắt đầu: hành trình 1890–1990
            </a>

            {/* Mục lục ngắn: cho người đọc biết trang có gì trước khi phải cuộn. */}
            <nav aria-label="Mục lục nhanh" className="w-full max-w-2xl">
              <p className="text-[11px] font-semibold uppercase tracking-wideish text-charcoal/45">
                Trang này có gì — chạm để tới thẳng
              </p>
              <ul className="mt-3 grid gap-2 text-left sm:grid-cols-2">
                {SECTIONS.map((section, index) => (
                  <li key={section.id}>
                    <a
                      href={`#${section.id}`}
                      className="focus-ring flex gap-3 rounded-xl border border-charcoal/10 bg-cream/70 px-3 py-2 transition-colors hover:border-burgundy/40"
                    >
                      <span className="font-serif text-sm font-semibold text-burgundy/70">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <span>
                        <span className="block text-[13px] font-medium text-charcoal">
                          {section.label}
                        </span>
                        <span className="mt-0.5 block text-[11px] leading-snug text-charcoal/55">
                          {section.blurb}
                        </span>
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            </nav>

            {/* Nghe thay vì đọc: không tự phát; bản chữ luôn nằm ngay trên trang. */}
            <div className="w-full max-w-2xl">
              <p className="text-[11px] font-semibold uppercase tracking-wideish text-charcoal/45">
                Nghe thay vì đọc{" "}
                <span className="font-normal normal-case tracking-normal text-charcoal/40">
                  · giọng tổng hợp, không phải giọng Bác Hồ
                </span>
              </p>
              <div className="mt-3 grid gap-2 sm:grid-cols-2">
                <ListenButton
                  src={audioData["gioi-thieu"].file}
                  label={audioData["gioi-thieu"].label}
                  seconds={audioData["gioi-thieu"].seconds}
                />
                <ListenButton
                  src={audioData["mau-nam-bo-1946"].file}
                  label={audioData["mau-nam-bo-1946"].label}
                  seconds={audioData["mau-nam-bo-1946"].seconds}
                />
              </div>
            </div>

            {/* Tiếng nói gốc: chỉ liên kết, không sao chép tệp về trang. */}
            <VoiceArchive />
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

      <footer className="bg-cream px-6 pb-24 pt-10 text-center text-xs leading-relaxed text-charcoal/65 sm:px-10 lg:px-16 lg:pb-10">
        <p>
          Soi Đường — dự án học liệu tương tác, xây dựng cho mục đích giáo dục.{" "}
          <a
            href="#tu-tuong"
            className="focus-ring font-medium text-burgundy underline decoration-burgundy/30 underline-offset-4 hover:decoration-burgundy"
          >
            Bảng kiểm chứng trích dẫn →
          </a>
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
