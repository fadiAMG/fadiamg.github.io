"use client";

import { useEffect, useState } from "react";
import SectionHeading from "./SectionHeading";
import { usePrefersReducedMotion } from "@/lib/motion-preference";
import { identity } from "@/data/resume";

export default function Contact() {
  const reduced = usePrefersReducedMotion();
  const [email, setEmail] = useState<{ text: string; href: string } | null>(null);

  useEffect(() => {
    // Assembled client-side only, so the address never appears in the static HTML for scrapers.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setEmail({
      text: `${identity.emailUser} [at] ${identity.emailHost}`,
      href: `mailto:${identity.emailUser}@${identity.emailHost}`,
    });
  }, []);

  return (
    <section
      id="contact"
      className="mx-auto max-w-[1500px] px-[clamp(18px,5vw,64px)] pt-[clamp(48px,9vh,110px)] pb-[clamp(56px,10vh,120px)]"
    >
      <SectionHeading number="07" label="Contact" />
      <h2 className="m-0 mt-[clamp(26px,5vh,52px)] max-w-[22ch] font-display text-[clamp(2.2rem,7vw,5.5rem)] font-extrabold leading-[0.92] tracking-[-0.045em]">
        Open to product- and AI-focused engineering roles in Germany and the EU.
      </h2>
      <div className="mt-[clamp(28px,5vh,56px)] grid grid-cols-[repeat(auto-fit,minmax(min(100%,220px),1fr))] gap-[clamp(16px,3vw,40px)] border-t border-hair pt-[22px]">
        <div className="grid gap-2">
          <span className="font-mono text-[10px] font-light uppercase text-dim">Email</span>
          <a
            href={email?.href ?? "#"}
            className="inline-flex min-h-11 items-center py-2.5 font-mono text-xs font-medium break-all no-underline transition-colors hover:text-ink2"
            style={{ color: "var(--ink1)" }}
          >
            {email?.text ?? "loading…"}
          </a>
        </div>
        <div className="grid gap-2">
          <span className="font-mono text-[10px] font-light uppercase text-dim">LinkedIn</span>
          <a
            href={identity.linkedinUrl}
            rel="noopener"
            className="inline-flex min-h-11 items-center py-2.5 font-mono text-xs font-medium break-all no-underline transition-colors hover:text-ink2"
            style={{ color: "var(--ink1)" }}
          >
            /in/fadithomas
          </a>
        </div>
        <div className="grid gap-2">
          <span className="font-mono text-[10px] font-light uppercase text-dim">Location</span>
          <span className="font-mono text-xs font-medium">{identity.locationShort}</span>
        </div>
        <div className="grid gap-2">
          <span className="font-mono text-[10px] font-light uppercase text-dim">CV</span>
          <a
            href="/cv/fadi-thomas-cv.pdf"
            download
            className="inline-flex min-h-11 items-center py-2.5 font-mono text-xs font-medium no-underline transition-colors hover:text-ink2"
            style={{ color: "var(--ink1)" }}
          >
            Download PDF ↓
          </a>
        </div>
      </div>
      <footer className="mt-[clamp(40px,7vh,80px)] flex flex-wrap gap-x-6 gap-y-2.5 border-t-2 border-fg pt-3.5 font-mono text-[10px] font-light uppercase text-dim">
        <span>Fadi Thomas — 2026</span>
        <span data-print-hide>{reduced ? "Motion: reduced" : "Motion: active"}</span>
      </footer>
    </section>
  );
}
