/**
 * Shape every locale must provide.
 *
 * Arrays are `readonly` so the English source can keep its `as const` and still
 * satisfy this contract. Because both locale modules are typed against it,
 * TypeScript fails the build if a translation drops a field or a section —
 * a half-translated page is caught at compile time rather than in production.
 */

export type Role = {
  dates: string;
  location?: string;
  company: string;
  title: string;
  summary: string;
  context?: string;
  owned: readonly string[];
  impact?: string;
  stack: readonly string[];
};

export type Content = {
  identity: {
    name: string;
    positioning: string;
    location: string;
    locationShort: string;
    hook: string;
    linkedin: string;
    linkedinUrl: string;
    emailUser: string;
    emailHost: string;
  };
  /** Path to the CV served for this locale, relative to the site root. */
  cvPath: string;
  /** Filename the browser saves the CV under. */
  cvFilename: string;
  profile: { lead: string; paragraphs: readonly string[] };
  howIWork: readonly { tag: string; title: string; body: string }[];
  experience: readonly Role[];
  selectedWork: readonly { tag: string; title: string; body: string; stack: string }[];
  skills: readonly { label: string; items: string; signal: boolean }[];
  education: readonly { dates: string; title: string; place: string }[];
  certifications: string;
  languages: string;
  /** UI chrome — everything not sourced from the CV itself. */
  ui: {
    chapters: {
      intro: string;
      profile: string;
      approach: string;
      experience: string;
      work: string;
      skills: string;
      education: string;
      contact: string;
    };
    sections: {
      profile: string;
      approach: string;
      experience: string;
      work: string;
      skills: string;
      education: string;
      contact: string;
    };
    downloadCv: string;
    getInTouch: string;
    scroll: string;
    selectRole: string;
    skipToContent: string;
    email: string;
    linkedin: string;
    locationLabel: string;
    cv: string;
    downloadPdf: string;
    theme: { dark: string; light: string };
    chaptersNavLabel: string;
    rolesLabel: string;
    langSwitchLabel: string;
    metaDescription: string;
  };
};
