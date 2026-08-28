import About from "@/components/About";
import Contact from "@/components/Contact";
import Education from "@/components/Education";
import Experience from "@/components/Experience";
import GrainOverlay from "@/components/GrainOverlay";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import HowIWork from "@/components/HowIWork";
import SelectedWork from "@/components/SelectedWork";
import Skills from "@/components/Skills";

export default function Home() {
  return (
    <>
      <GrainOverlay />
      <Header />
      <main id="main">
        <Hero />
        <About />
        <HowIWork />
        <Experience />
        <SelectedWork />
        <Skills />
        <Education />
        <Contact />
      </main>
    </>
  );
}
