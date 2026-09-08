export default function SiteHeader() {
  return (
    <header className="fixed inset-x-0 top-0 z-30 flex items-center justify-between border-b border-charcoal/5 bg-cream/80 px-6 py-3 backdrop-blur-md sm:px-10 lg:px-16">
      <span className="font-serif text-lg font-semibold tracking-wide text-charcoal">
        Soi Đường
      </span>
      <nav className="flex gap-3 text-[11px] text-charcoal/70 sm:gap-8 sm:text-sm">
        <a href="#hanh-trinh" className="focus-ring hover:text-charcoal">
          Hành trình
        </a>
        <a href="#goc-genz" className="focus-ring hover:text-charcoal">
          Góc Gen Z
        </a>
        <a href="#thach-thuc" className="focus-ring hover:text-charcoal">
          Thách thức
        </a>
      </nav>
    </header>
  );
}
