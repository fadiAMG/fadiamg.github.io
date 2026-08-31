"use client";

import ThemeToggle from "./ThemeToggle";
import { useLocale, pathFor, type Lang } from "@/lib/locale";

export default function Header() {
  const { t, lang } = useLocale();
  const identity = t.identity;

  const navLinks = [
    { href: "#experience", label: t.ui.chapters.experience },
    { href: "#work", label: t.ui.chapters.work },
    { href: "#contact", label: t.ui.chapters.contact },
  ];

  return (
    <header
      data-print-hide
      className="sticky top-0 z-50 flex items-center justify-between gap-4 border-b border-hair bg-bg px-[clamp(18px,5vw,64px)] py-3.5 font-mono text-[10px] font-light uppercase text-dim"
    >
      <span className="text-fg">{identity.name}</span>
      <nav className="flex items-center gap-[clamp(10px,2vw,22px)]">
        {navLinks.map((link) => (
          <a
            key={link.href}
            href={link.href}
            className="inline-flex min-h-11 items-center px-1 !text-dim no-underline transition-colors hover:!text-ink2"
          >
            {link.label}
          </a>
        ))}
        <LangSwitch current={lang} label={t.ui.langSwitchLabel} />
        <ThemeToggle />
      </nav>
    </header>
  );
}

/**
 * Language switch.
 *
 * Real anchors to the other locale's URL rather than a client-side toggle:
 * each language is its own statically-built page, so switching has to
 * navigate. That also means it works without JavaScript and can be opened in a
 * new tab. `hrefLang` tells crawlers and assistive tech what is on the far end.
 */
function LangSwitch({ current, label }: { current: Lang; label: string }) {
  const langs: Lang[] = ["en", "de"];
  return (
    <span className="flex items-center" aria-label={label}>
      {langs.map((l, i) => (
        <span key={l} className="flex items-center">
          {i > 0 && (
            <span aria-hidden="true" className="px-1 opacity-40">
              /
            </span>
          )}
          {l === current ? (
            <span aria-current="true" className="inline-flex min-h-11 items-center px-0.5 text-fg">
              {l.toUpperCase()}
            </span>
          ) : (
            <a
              href={pathFor(l)}
              hrefLang={l}
              className="inline-flex min-h-11 items-center px-0.5 !text-dim no-underline transition-colors hover:!text-ink2"
            >
              {l.toUpperCase()}
            </a>
          )}
        </span>
      ))}
    </span>
  );
}
