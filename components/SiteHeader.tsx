import { SECTIONS } from "@/lib/sections";

export default function SiteHeader() {
  return (
    <header className="fixed inset-x-0 top-0 z-30 flex items-center justify-between gap-4 border-b border-charcoal/5 bg-cream/80 px-4 py-3 backdrop-blur-md sm:px-10 lg:px-16">
      <a
        href="#top"
        className="focus-ring shrink-0 font-serif text-base font-semibold tracking-wide text-charcoal sm:text-lg"
      >
        Soi Đường
      </a>
      <nav
        aria-label="Điều hướng chính"
        className="no-scrollbar -mx-2 flex max-w-full gap-3 overflow-x-auto px-2 text-[11px] text-charcoal/70 sm:gap-5 sm:text-sm"
      >
        {SECTIONS.map((section) => (
          <a
            key={section.id}
            href={`#${section.id}`}
            className="focus-ring whitespace-nowrap py-1 hover:text-charcoal"
          >
            {section.label}
          </a>
        ))}
      </nav>
    </header>
  );
}
