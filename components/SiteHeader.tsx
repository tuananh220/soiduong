export default function SiteHeader() {
  return (
    <header className="fixed inset-x-0 top-0 z-30 flex items-center justify-between gap-4 border-b border-charcoal/5 bg-cream/80 px-4 py-3 backdrop-blur-md sm:px-10 lg:px-16">
      <a href="#top" className="focus-ring font-serif text-base font-semibold tracking-wide text-charcoal sm:text-lg">
        Soi Đường
      </a>
      <nav
        aria-label="Điều hướng chính"
        className="no-scrollbar -mx-2 flex max-w-full gap-3 overflow-x-auto px-2 text-[11px] text-charcoal/70 sm:gap-6 sm:text-sm"
      >
        <a href="#hanh-trinh" className="focus-ring whitespace-nowrap py-1 hover:text-charcoal">
          Hành trình
        </a>
        <a href="#tu-tuong" className="focus-ring whitespace-nowrap py-1 hover:text-charcoal">
          Tư tưởng
        </a>
        <a href="#kien-thuc-nen" className="focus-ring whitespace-nowrap py-1 hover:text-charcoal">
          Ôn tập
        </a>
        <a href="#goc-genz" className="focus-ring whitespace-nowrap py-1 hover:text-charcoal">
          Góc Gen Z
        </a>
        <a href="#thach-thuc" className="focus-ring whitespace-nowrap py-1 hover:text-charcoal">
          Thách thức
        </a>
        <a href="#lo-trinh" className="focus-ring whitespace-nowrap py-1 hover:text-charcoal">
          Lộ trình
        </a>
        <a href="#so-tay" className="focus-ring whitespace-nowrap py-1 hover:text-charcoal">
          Sổ tay
        </a>
      </nav>
    </header>
  );
}
