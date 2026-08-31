import type { Content } from "./types";
import {
  identity,
  profile,
  howIWork,
  experience,
  selectedWork,
  skills,
  education,
  certifications,
  languages,
} from "./resume";

/**
 * English locale. Content is re-exported from resume.ts, which stays the single
 * editing surface for the CV material; only the UI strings live here.
 *
 * Typing this against `Content` also validates the contract itself — if the
 * type drifts from the real data, this file fails to compile.
 */
export const en: Content = {
  identity,
  cvPath: "/cv/fadi-thomas-cv.pdf",
  cvFilename: "Fadi-Thomas-CV.pdf",
  profile,
  howIWork,
  experience,
  selectedWork,
  skills,
  education,
  certifications,
  languages,
  ui: {
    chapters: {
      intro: "Intro",
      profile: "Profile",
      approach: "Approach",
      experience: "Experience",
      work: "Work",
      skills: "Skills",
      education: "Education",
      contact: "Contact",
    },
    sections: {
      profile: "Profile",
      approach: "How I work",
      experience: "Experience",
      work: "Selected work",
      skills: "Skills",
      education: "Education & recognition",
      contact: "Contact",
    },
    downloadCv: "Download CV",
    getInTouch: "Get in touch",
    scroll: "Scroll",
    selectRole: "Select a role",
    skipToContent: "Skip to content",
    email: "Email",
    linkedin: "LinkedIn",
    locationLabel: "Location",
    cv: "CV",
    downloadPdf: "Download PDF",
    theme: { dark: "Dark", light: "Light" },
    chaptersNavLabel: "Chapters",
    rolesLabel: "Roles",
    langSwitchLabel: "Language",
    metaDescription:
      "Product Engineer working at the intersection of product, AI and engineering. Frankfurt am Main, Germany. Open to product- and AI-focused engineering roles in Germany and the EU.",
  },
};
