import AboutReveal from "@/components/AboutReveal";
import Contact from "@/components/Contact";
import Cursor from "@/components/Cursor";
import Education from "@/components/Education";
import Experience from "@/components/Experience";
import GrainOverlay from "@/components/GrainOverlay";
import Header from "@/components/Header";
import HowIWork from "@/components/HowIWork";
import KineticHero from "@/components/KineticHero";
import Marquee from "@/components/Marquee";
import Preloader from "@/components/Preloader";
import ScrollRail from "@/components/ScrollRail";
import SectionHeading from "@/components/SectionHeading";
import Skills from "@/components/Skills";
import WorkGallery from "@/components/WorkGallery";

const TICKER = [
  "Product Engineering",
  "AI Products",
  "LLM Pipelines",
  "Discovery to Delivery",
  "Technical Leadership",
];

export default function Home() {
  return (
    <>
      <Preloader />
      <ScrollRail />
      <Cursor />
      <GrainOverlay />
      <Header />
      <main id="main">
        <KineticHero />
        <Marquee items={TICKER} />
        <AboutReveal />
        <HowIWork />
        <Experience />

        <section
          id="work"
          className="mx-auto max-w-[1500px] px-[clamp(18px,5vw,64px)] py-[clamp(56px,10vh,130px)]"
        >
          <SectionHeading number="04" label="Selected work" />
          <div className="mt-[clamp(28px,5vh,56px)]">
            <WorkGallery />
          </div>
        </section>

        <Skills />
        <Education />
        <Contact />
      </main>
    </>
  );
}
