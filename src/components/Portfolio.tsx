"use client";

import Contact from "@/components/Contact";
import Cursor from "@/components/Cursor";
import Education from "@/components/Education";
import ExperienceDial from "@/components/ExperienceDial";
import GrainOverlay from "@/components/GrainOverlay";
import Header from "@/components/Header";
import HorizontalDeck, { type Chapter } from "@/components/HorizontalDeck";
import HowIWork from "@/components/HowIWork";
import KineticHero from "@/components/KineticHero";
import Preloader from "@/components/Preloader";
import RevealCopy from "@/components/RevealCopy";
import ScrollRail from "@/components/ScrollRail";
import SectionHeading from "@/components/SectionHeading";
import ShapeField from "@/components/ShapeField";
import Skills from "@/components/Skills";
import WorkGallery from "@/components/WorkGallery";
import { LocaleProvider, useLocale, type Lang } from "@/lib/locale";

/**
 * Chapter content wrapper. The padding reset that a fixed-height deck panel
 * needs lives on the deck's own section instead — applying it here stripped
 * the spacing in the vertical fallback too, collapsing every section together.
 */
const PANEL = "relative z-10 mx-auto w-full max-w-[1300px]";

export default function Portfolio({ lang }: { lang: Lang }) {
  return (
    <LocaleProvider lang={lang}>
      <Deck />
    </LocaleProvider>
  );
}

/** Split out so it sits inside the provider and can read the locale. */
function Deck() {
  const { t } = useLocale();
  const s = t.ui.sections;
  const c = t.ui.chapters;

  /**
   * Each chapter carries its own generative motif, so the shape language
   * changes as you travel and your position in the deck is legible from the
   * pattern alone.
   */
  const chapters: Chapter[] = [
    { id: "intro", label: c.intro, node: <KineticHero /> },
    {
      id: "profile",
      label: c.profile,
      node: (
        <>
          <ShapeField name="phyllotaxis" seed={11} className="opacity-[0.55]" drift={-60} mask="right" />
          <div className={PANEL}>
            <SectionHeading number="01" label={s.profile} />
            <RevealCopy
              text={t.profile.lead}
              className="m-0 mt-[clamp(18px,3vh,36px)] max-w-[26ch] font-display text-[clamp(24px,3.2vw,50px)] font-extrabold leading-[1.05] tracking-[-0.035em]"
            />
            <div className="mt-[clamp(18px,3vh,36px)] grid gap-[clamp(18px,3vw,48px)] md:grid-cols-2">
              {t.profile.paragraphs.map((p) => (
                <RevealCopy
                  key={p}
                  text={p}
                  className="m-0 max-w-[46ch] text-[0.95rem] leading-[1.6] text-dim"
                />
              ))}
            </div>
          </div>
        </>
      ),
    },
    {
      id: "approach",
      label: c.approach,
      node: (
        <>
          <ShapeField name="truchet" seed={23} className="opacity-[0.4]" drift={70} mask="edges" />
          <div className={PANEL}>
            <HowIWork />
          </div>
        </>
      ),
    },
    {
      id: "experience",
      label: c.experience,
      node: (
        <>
          <ShapeField name="isometric" seed={5} className="opacity-[0.4]" drift={-80} mask="edges" />
          {/* h-full only matters in the deck, where the panel has a fixed height. */}
          <div className={`${PANEL} flex min-h-0 flex-col lg:h-full`}>
            <SectionHeading number="03" label={s.experience} />
            <div className="mt-[clamp(10px,1.6vh,24px)] min-h-0 flex-1">
              <ExperienceDial />
            </div>
          </div>
        </>
      ),
    },
    {
      id: "work",
      label: c.work,
      node: (
        <>
          <ShapeField name="mesh" seed={17} className="opacity-[0.45]" drift={64} mask="edges" />
          <div className={PANEL}>
            <SectionHeading number="04" label={s.work} />
            <div className="mt-[clamp(14px,2vh,28px)]">
              <WorkGallery />
            </div>
          </div>
        </>
      ),
    },
    {
      id: "skills",
      label: c.skills,
      node: (
        <>
          <ShapeField name="interference" seed={31} className="opacity-[0.34]" drift={-56} mask="edges" />
          <div className={PANEL}>
            <Skills />
          </div>
        </>
      ),
    },
    {
      id: "education",
      label: c.education,
      node: (
        <>
          <ShapeField name="phyllotaxis" seed={47} className="opacity-[0.45]" drift={58} mask="left" />
          <div className={PANEL}>
            <Education />
          </div>
        </>
      ),
    },
    {
      id: "contact",
      label: c.contact,
      node: (
        <>
          <ShapeField name="lissajous" seed={3} className="opacity-[0.5]" drift={50} mask="right" />
          <div className={PANEL}>
            <Contact />
          </div>
        </>
      ),
    },
  ];

  return (
    <>
      <Preloader />
      <ScrollRail />
      <Cursor />
      <GrainOverlay />
      <Header />
      <main id="main">
        <HorizontalDeck chapters={chapters} />
      </main>
    </>
  );
}
