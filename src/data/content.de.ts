import type { Content } from "./types";
import { identity } from "./resume";

/**
 * German locale.
 *
 * Conventions applied deliberately:
 *  - Established English job titles and technology names are kept (Product
 *    Engineer, Full Stack Engineer, Claude Vision). Translating them would read
 *    as odd in German tech, where these are the working terms.
 *  - "heute" rather than "Gegenwart" for an ongoing role, which is the standard
 *    Lebenslauf form.
 *  - Consistent formal register throughout; first-person singular, as in the
 *    English, rather than the impersonal style of a classic tabular CV.
 *
 * NOT reviewed by a native speaker. See README before publishing.
 */
export const de: Content = {
  identity: {
    ...identity,
    positioning: "Product Engineer · KI-gestützte Produkte · Technische Führung",
    location: "Frankfurt am Main, Deutschland",
    locationShort: "Frankfurt am Main / DE",
    // German runs roughly a quarter longer than English. The literal rendering
    // of the English hook wrapped to three lines in the hero and collided with
    // the chapter index, so this is deliberately tighter rather than word-for-word.
    hook: "Ich baue dort, wo die Fachlogik am unübersichtlichsten ist.",
  },
  cvPath: "/cv/fadi-thomas-cv.pdf",
  cvFilename: "Fadi-Thomas-Lebenslauf.pdf",

  profile: {
    lead: "7+ Jahre Software-Engineering — Full-Stack-Produktarbeit mit TypeScript/Node.js, React, Java und Python, von frühen Produktphasen bis zu Unternehmensplattformen — heute an der Schnittstelle von Produkt, KI und Engineering.",
    paragraphs: [
      "Ich begleite Features von der Discovery bis zum Release: das Problem gemeinsam mit den Stakeholdern schärfen, Zielkonflikte abwägen, die Lösung entwerfen und den Bau verantworten.",
      "Der Schwerpunkt liegt derzeit auf KI-gestützten Produktfunktionen — LLM-basiertes Dokumentenverständnis, agentische Workflows, Automatisierungs-Pipelines — und darauf, fachliche Ziele mit dem zu verbinden, was tatsächlich ausgeliefert wird.",
    ],
  },

  howIWork: [
    {
      tag: "Produkt",
      title: "Erst verstehen, dann bauen",
      body: "Continuous Discovery, PRDs und User Flows, Anforderungsklärung, Scoping und Priorisierung, Roadmap-Input, Abstimmung mit Stakeholdern, Definition von Metriken und KPIs.",
    },
    {
      tag: "KI",
      title: "Modelle in echten Produkten",
      body: "LLM-Integration (Claude, Vision-Modelle), KI-Agenten, Prompt Engineering, Pipelines für Dokumentenverständnis, KI-gestützte Entwicklung, Workflow-Automatisierung mit n8n.",
    },
    {
      tag: "Führung",
      title: "Verantwortung über den gesamten Zyklus",
      body: "Feature-Verantwortung von Anfang bis Ende, technische Ausrichtung, Code Review und Mentoring, teamübergreifende Zusammenarbeit, Arbeit mit nicht-technischen Stakeholdern.",
    },
  ],

  experience: [
    {
      dates: "Jul 2025 — heute",
      location: "Remote",
      company: "Listo Global (Vensure)",
      title: "Product Engineer",
      summary:
        "Verantworte KI-gestützte Payroll- und Dokumentenfunktionen von Anfang bis Ende, in direkter Zusammenarbeit mit der Geschäftsführung.",
      context:
        "Listo Global gehört zu Vensure und ist im Bereich Payroll und HR-Services tätig. Kundendaten kommen in uneinheitlichen Formaten an; ihre Abstimmung band viel Zeit im operativen Geschäft. Engineering arbeitet eng an der Fachseite, Anforderungen kommen also direkt von denen, die das Ergebnis verantworten.",
      owned: [
        "Habe Anforderungsgespräche direkt mit CEO, CFO und CX-Director geführt — fachliche Ziele in klar geschnittene, priorisierte Arbeitspakete übersetzt und dort widersprochen, wo die Abwägung nicht trug.",
        "Eine Pipeline für Dokumentenverständnis entworfen und gebaut: pdf2pic rastert eingehende PDFs, Claude Vision extrahiert strukturierte Felder, BullMQ steuert Job-Queue und Wiederholungen, und eine Validierungsschicht fängt fehlerhafte Ausgaben ab, bevor sie nachgelagerte Systeme erreichen.",
        "Eine Payroll-Oberfläche mit Upload aus zwei Quellen und Feld-Mapping ausgeliefert, sodass das operative Team abweichende Kundenformate ohne Ticket abgleichen kann.",
        "Features über den gesamten Lebenszyklus verantwortet — Architektur, Umsetzung, Testabdeckung mit Jest, Review und Deployment.",
        "Die Codequalität über Review-Feedback und Pairing gehoben, nicht über zusätzliche Prozesse.",
      ],
      impact:
        "Einen wiederkehrenden manuellen Erfassungsschritt aus dem operativen Ablauf entfernt und nicht-technischen Kolleginnen und Kollegen einen eigenständigen Weg zum Datenabgleich gegeben.",
      stack: [
        "TypeScript",
        "tRPC",
        "Prisma / Drizzle",
        "PostgreSQL",
        "Redis + BullMQ",
        "React",
        "Zod",
        "Claude Vision",
        "Jest",
      ],
    },
    {
      dates: "Jul 2025 — Aug 2026",
      location: "Frankfurt am Main",
      company: "Kia Europe",
      title: "Data Science & Analytics",
      summary:
        "Habe offene fachliche Fragen in die Dashboards und Kennzahlen überführt, die sie beantworten.",
      context:
        "Die Europa-Organisation von Kia, in Zusammenarbeit mit Fach- und Produktbereichen, die Antworten aus operativen Daten brauchten, aber weder SQL noch die passenden Werkzeuge dafür hatten.",
      owned: [
        "Gemeinsam mit Produkt- und Fachbereichen unscharfe Fragestellungen in konkrete, beantwortbare Datenanforderungen überführt.",
        "Tableau-Dashboards entworfen und gepflegt, die teamübergreifend für KPI-Tracking und operative Entscheidungen genutzt wurden.",
        "SQL-Abfragen auf großen operativen Datenbeständen gebaut und optimiert, als Grundlage für Reporting und teamübergreifende Analysen.",
        "Auch den unspektakulären Teil übernommen — Bereinigung, Transformation und explorative Analyse in SQL und Python.",
      ],
      impact:
        "Mehreren Teams einen eigenständigen Blick auf ihre Kennzahlen gegeben, statt Anfragen im Einzelfall zu bearbeiten.",
      stack: ["SQL", "Python", "Tableau", "ETL"],
    },
    {
      dates: "Nov 2023 — Mai 2024",
      company: "BillMyPlate",
      title: "Full Stack Engineer",
      summary:
        "Das Frontend auf Geschwindigkeit umgebaut und dem Team laufende Sicht auf nutzerseitige Probleme verschafft.",
      context:
        "Ein Produkt, bei dem die wahrgenommene Performance direkt auf die Nutzung durchschlug und das Team von UX-Problemen eher durch Nutzer als durch Messwerte erfuhr.",
      owned: [
        "Eine Angular-16-SSR-Anwendung gebaut und die Reaktionsgeschwindigkeit der Seite um 47 % verbessert.",
        "Echtzeit-Monitoring mit Socket.IO entwickelt, sodass das Team UX-Probleme im Moment ihres Auftretens sehen und noch am selben Tag beheben konnte.",
        "MongoDB-Migrationen beim Anwendungsstart automatisiert und damit einen manuellen Deployment-Schritt entfernt.",
        "End-to-End-Testsuites geschrieben und die täglichen Pull Requests und Reviews begleitet.",
      ],
      impact:
        "47 % bessere Reaktionsgeschwindigkeit und taggleiche Behebung von Problemen, die zuvor erst nach Tagen sichtbar wurden.",
      stack: ["Angular 16", "SSR", "TypeScript", "Socket.IO", "MongoDB"],
    },
    {
      dates: "Mai 2022 — Aug 2023",
      company: "Scholastic",
      title: "Full Stack Engineer",
      summary:
        "Eine Framework-Migration geleitet, aus der der gemeinsame Komponentensatz mehrerer Produktteams hervorging.",
      context:
        "Ein großer Verlag mit einer internen Alt-UI-Bibliothek auf Angular, während die Produktteams auf React wechselten — begleitet vom Umbau des Monolithen in Richtung Microservices.",
      owned: [
        "Die Migration der internen Alt-UI-Bibliothek von Angular nach React (TypeScript) geleitet und die wiederverwendbare Komponenten-API definiert, die mehrere Produktteams anschließend übernommen haben.",
        "Backend-Services in Java 12 und Spring Boot entwickelt und gepflegt.",
        "Zur Aufteilung des Monolithen in Microservices beigetragen.",
        "Docker eingeführt und Kubernetes-Cluster betreut.",
      ],
      impact:
        "40 % kürzere Deployment-Zeiten; ein gemeinsamer Komponentensatz statt paralleler Eigenentwicklungen je Team.",
      stack: ["React", "TypeScript", "Java 12", "Spring Boot", "Docker", "Kubernetes"],
    },
    {
      dates: "Nov 2020 — Mai 2021",
      company: "IST Networks",
      title: "Front End Engineer",
      summary:
        "Die internen Dashboards gebaut, mit denen die operativen Teams gemeldete Störungen überwachten.",
      context:
        "Ein Systemintegrator, dessen interne Werkzeuge mit großen externen Partnersystemen zusammenspielen mussten.",
      owned: [
        "Interne Dashboards (TypeScript, React, Redux, Tailwind) gebaut und gepflegt, mit denen operative Teams gemeldete Störungen überwachten.",
        "Externe Systeme — darunter das Reporting von Vodafone — an interne Services angebunden und die Anforderungen auf beiden Seiten der Schnittstelle abgestimmt.",
      ],
      stack: ["TypeScript", "React", "Redux", "REST"],
    },
    {
      dates: "Jul 2019 — Aug 2020",
      company: "RiseUp",
      title: "Full Stack Engineer",
      summary:
        "Eine Lernplattform vollständig ausgeliefert und die Veröffentlichung wieder in die Hand des Content-Teams gelegt.",
      context:
        "RiseUp betreibt eine große Entrepreneurship-Community; die Academy-Plattform war eine neue Produktlinie, und inhaltliche Änderungen hingen jedes Mal am Engineering.",
      owned: [
        "Die Plattform RiseUp Academy vollständig ausgeliefert (React + Django), sowohl das lernendenseitige Produkt als auch die Backend-APIs.",
        "Ein internes Dashboard gebaut, über das das Content-Team direkt auf der Hauptseite veröffentlichen konnte.",
      ],
      impact: "Eine wiederkehrende Abhängigkeit vom Engineering aus dem Content-Prozess entfernt.",
      stack: ["React", "Django", "PostgreSQL"],
    },
    {
      dates: "Jul 2017 — Dez 2018",
      location: "Freiberuflich",
      company: "Upwork",
      title: "Software Engineer",
      summary: "Web-Projekte für Kunden, von der Anforderung bis zur Auslieferung verantwortet.",
      owned: [
        "Anforderungen direkt mit internationalen Kunden erhoben, den Umfang abgesteckt und innerhalb der vereinbarten Termine geliefert.",
        "Die erste echte Erfahrung darin, den gesamten Zyklus zu verantworten — und zu unterscheiden, was jemand tatsächlich braucht und was er beschreibt.",
      ],
      stack: [],
    },
  ],

  selectedWork: [
    {
      tag: "01 / Pipeline",
      title: "KI-Pipeline zur Dokumentenverarbeitung",
      body: "Queue-basierter Service, der eingehende PDFs rastert, strukturierte Felder mit Claude Vision extrahiert, die Ausgabe validiert und saubere Daten an nachgelagerte Systeme übergibt. Gebaut für den Payroll-Kontext, in dem Formate uneinheitlich und Fehler teuer sind.",
      stack: "TypeScript · BullMQ · Redis · Claude Vision · pdf2pic · Zod",
    },
    {
      tag: "02 / Produkt",
      title: "Raseedi — Optimierung einer Smart Wallet",
      body: "Web-Anwendung für Geschäftskunden, die Werbetreibende anhand einer Budget-Klassifikation passenden mobilen Nutzern zuordnete.",
      stack: "React · Node.js",
    },
    {
      tag: "03 / Plattform",
      title: "Enrollet — zentrale Studienplatzvergabe",
      body: "Eine zentrale Bewerbungsplattform für ägyptische Hochschulen nach dem Vorbild von uni-assist: einfachere Bewerbungen und mehr Sichtbarkeit für jüngere Hochschulen. Abschlussprojekt.",
      stack: "Full-Stack-Web",
    },
  ],

  skills: [
    { label: "Sprachen", items: "TypeScript · JavaScript · Python · Java · SQL", signal: false },
    {
      label: "Frontend",
      items: "React · Next.js · Redux · Angular · Tailwind · React Hook Form · Zod",
      signal: false,
    },
    {
      label: "Backend",
      items: "Node.js · NestJS · Express · tRPC · REST · GraphQL · Django · Spring Boot",
      signal: false,
    },
    {
      label: "Daten",
      items: "PostgreSQL · MySQL · MongoDB · Redis · Prisma · Drizzle · Tableau · ETL",
      signal: false,
    },
    {
      label: "KI & Automatisierung",
      items:
        "LLM-Integration · Claude Vision · KI-Agenten · Prompt Engineering · n8n · BullMQ-Pipelines · KI-gestützte Entwicklung",
      signal: true,
    },
    { label: "Infrastruktur", items: "Docker · Kubernetes · AWS · CI/CD · Jenkins · Datadog", signal: false },
    { label: "Arbeitsweise", items: "Agile · TDD/BDD · Code Review · Jira · Git · Figma", signal: false },
  ],

  education: [
    {
      dates: "2024 — heute",
      title: "M.Sc. Global Software Development",
      place: "Hochschule Fulda, Deutschland",
    },
    {
      dates: "2015 — 2020",
      title: "B.Sc. Elektrotechnik & Informationstechnik",
      place: "Nile University, Ägypten — Note 3,22 / 4,0",
    },
  ],

  certifications:
    "Continuous Discovery Habits (Teresa Torres) · Android Development Nanodegree · Front End Development Track · Praktikum bei IBM (Blockchain) · Praktikum bei BlueCloud (Microsoft CRM) · 2. Platz Differentialgleichungen und 2. Platz Lineare Algebra, Nile University Research Forum",

  languages: "Englisch — verhandlungssicher (IELTS C1 / 7.0) · Deutsch — A2 · Arabisch — Muttersprache",

  ui: {
    chapters: {
      intro: "Start",
      profile: "Profil",
      approach: "Arbeitsweise",
      experience: "Erfahrung",
      work: "Projekte",
      skills: "Kenntnisse",
      education: "Ausbildung",
      contact: "Kontakt",
    },
    sections: {
      profile: "Profil",
      approach: "Meine Arbeitsweise",
      experience: "Berufserfahrung",
      work: "Ausgewählte Projekte",
      skills: "Kenntnisse",
      education: "Ausbildung & Auszeichnungen",
      contact: "Kontakt",
    },
    downloadCv: "Lebenslauf laden",
    getInTouch: "Kontakt aufnehmen",
    scroll: "Scrollen",
    selectRole: "Station wählen",
    skipToContent: "Zum Inhalt springen",
    email: "E-Mail",
    linkedin: "LinkedIn",
    locationLabel: "Standort",
    cv: "Lebenslauf",
    downloadPdf: "PDF laden",
    theme: { dark: "Dunkel", light: "Hell" },
    chaptersNavLabel: "Kapitel",
    rolesLabel: "Stationen",
    langSwitchLabel: "Sprache",
    metaDescription:
      "Product Engineer an der Schnittstelle von Produkt, KI und Engineering. Frankfurt am Main. Offen für produkt- und KI-nahe Engineering-Rollen in Deutschland und der EU.",
  },
};
