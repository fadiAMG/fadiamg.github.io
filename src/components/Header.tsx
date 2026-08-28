import ThemeToggle from "./ThemeToggle";
import { identity } from "@/data/resume";

const navLinks = [
  { href: "#experience", label: "Experience" },
  { href: "#work", label: "Work" },
  { href: "#contact", label: "Contact" },
];

export default function Header() {
  return (
    <header
      data-print-hide
      className="sticky top-0 z-50 flex items-center justify-between gap-4 border-b border-hair bg-bg px-[clamp(18px,5vw,64px)] py-3.5 font-mono text-[10px] font-light text-dim uppercase"
    >
      <span className="text-fg">{identity.name}</span>
      <nav className="flex items-center gap-[clamp(10px,2vw,22px)]">
        {navLinks.map((link) => (
          <a
            key={link.href}
            href={link.href}
            className="inline-flex min-h-11 items-center px-1 text-dim no-underline transition-colors hover:text-ink2"
          >
            {link.label}
          </a>
        ))}
        <ThemeToggle />
      </nav>
    </header>
  );
}
