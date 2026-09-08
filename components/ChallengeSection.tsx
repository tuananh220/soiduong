import QuizGame from "./QuizGame";
import QuoteGallery from "./QuoteGallery";

export default function ChallengeSection() {
  return (
    <section id="thach-thuc" className="bg-charcoal px-6 py-20 text-cream sm:px-10 lg:px-16">
      <div className="mx-auto max-w-5xl">
        <p className="text-center font-sans text-sm uppercase tracking-wideish text-gold/80">
          Trạm thách thức
        </p>
        <h2 className="mt-3 text-center font-serif text-3xl font-semibold leading-tight sm:text-4xl">
          Bạn sẽ chọn gì trong tình huống này?
        </h2>

        <div className="mt-10">
          <QuizGame />
        </div>

        <div className="mt-20">
          <p className="text-center font-sans text-sm uppercase tracking-wideish text-gold/80">
            Bộ sưu tập trích dẫn
          </p>
          <h3 className="mt-3 text-center font-serif text-2xl font-semibold">
            Lật thẻ, đọc bài học, giữ lại điều truyền cảm hứng
          </h3>
          <QuoteGallery />
        </div>
      </div>
    </section>
  );
}
