export type Role = {
  dates: string;
  location?: string;
  company: string;
  title: string;
  summary: string;
  context?: string;
  owned: string[];
  impact?: string;
  stack: string[];
};

export const identity = {
  name: "Fadi Thomas",
  positioning: "Product Engineer · AI-Powered Products · Technical Leadership",
  location: "Frankfurt am Main, Germany",
  locationShort: "Frankfurt am Main / DE",
  hook: "I build the parts of a product where the business logic is messiest.",
  linkedin: "linkedin.com/in/fadithomas",
  linkedinUrl: "https://linkedin.com/in/fadithomas",
  emailUser: "fadiamg.swe",
  emailHost: "gmail.com",
};

export const profile = {
  lead: "7+ years of software engineering — full-stack product work across TypeScript/Node.js, React, Java and Python, from early-stage products to enterprise platforms — now at the intersection of product, AI and engineering.",
  paragraphs: [
    "I take features from discovery to delivery: framing the problem with stakeholders, scoping trade-offs, shaping the solution, and owning the build.",
    "Recent work centres on AI-powered product features — LLM-based document understanding, agentic workflows, automation pipelines — and on connecting business intent to what actually ships.",
  ],
};

export const howIWork = [
  {
    tag: "Product",
    title: "Framing before building",
    body: "Continuous discovery, PRDs and user flows, requirement framing, scoping and prioritisation, roadmap input, stakeholder alignment, metrics and KPI definition.",
  },
  {
    tag: "AI",
    title: "Models inside real products",
    body: "LLM integration (Claude, vision models), AI agents, prompt engineering, document-understanding pipelines, AI-assisted development, n8n workflow automation.",
  },
  {
    tag: "Leadership",
    title: "Owning the whole loop",
    body: "End-to-end feature ownership, technical direction, code review and mentoring, cross-team collaboration, working with non-technical stakeholders.",
  },
] as const;

export const experience: Role[] = [
  {
    dates: "Jul 2025 — Present",
    location: "Remote",
    company: "Listo Global (Vensure)",
    title: "Product Engineer",
    summary:
      "Own AI-powered payroll and document features end-to-end, working directly with the executive team.",
    context:
      "Listo Global is part of Vensure, in payroll and HR services. Client data arrives in inconsistent formats and reconciling it was eating operations time. Engineering sits close to the business, so requirements come straight from the people who own the outcome.",
    owned: [
      "Ran requirement conversations directly with the CEO, CFO and CX Director — translating business goals into scoped, sequenced work and pushing back where the trade-off didn't hold.",
      "Designed and built a document-understanding pipeline: pdf2pic rasterises incoming PDFs, Claude Vision extracts structured fields, BullMQ manages the job queue and retries, and a validation layer catches malformed output before it reaches downstream systems.",
      "Shipped a payroll interface with dual-source upload and field mapping, so operations can reconcile mismatched client formats without opening a ticket.",
      "Owned features across the whole lifecycle — architecture, implementation, Jest coverage, review and deployment.",
      "Raised code quality through review feedback and pairing rather than process.",
    ],
    impact:
      "Removed a recurring manual data-entry step from operations and gave non-engineers a self-service path for data reconciliation.",
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
      "Turned open-ended business questions into the dashboards and metrics that answered them.",
    context:
      "Kia Europe's regional operation, working with business and product stakeholders who needed answers from operational data but didn't have the SQL or tooling to get them.",
    owned: [
      "Partnered with product and business teams to convert vague questions into concrete, answerable data requirements.",
      "Designed and maintained Tableau dashboards used across teams for KPI tracking and operational decisions.",
      "Built and optimised SQL queries over large operational datasets supporting reporting and cross-team analysis.",
      "Handled the unglamorous half — cleaning, transformation and exploratory analysis in SQL and Python.",
    ],
    impact: "Gave several teams a self-serve view of their KPIs instead of ad-hoc requests.",
    stack: ["SQL", "Python", "Tableau", "ETL"],
  },
  {
    dates: "Nov 2023 — May 2024",
    company: "BillMyPlate",
    title: "Full Stack Engineer",
    summary: "Rebuilt the front end for speed and gave the team live visibility into user-facing issues.",
    context:
      "A product where perceived performance directly affected usage, and where the team learned about UX problems from users rather than instrumentation.",
    owned: [
      "Built an Angular 16 SSR application, improving site responsiveness by 47%.",
      "Developed real-time monitoring with Socket.IO so the team could observe UX issues as they happened and resolve them the same day.",
      "Automated MongoDB migrations on application startup, removing a manual deployment step.",
      "Wrote end-to-end test suites and worked through daily PRs and reviews.",
    ],
    impact: "47% responsiveness improvement, and same-day resolution on issues that previously surfaced days later.",
    stack: ["Angular 16", "SSR", "TypeScript", "Socket.IO", "MongoDB"],
  },
  {
    dates: "May 2022 — Aug 2023",
    company: "Scholastic",
    title: "Full Stack Engineer",
    summary: "Led a framework migration that produced the shared component set used across multiple product teams.",
    context:
      "A large publisher running a legacy internal UI library on Angular while product teams moved to React, alongside a broader monolith-to-microservices transition.",
    owned: [
      "Led the migration of the legacy internal UI library from Angular to React (TypeScript), defining the reusable component API multiple product teams then adopted.",
      "Developed and maintained backend services in Java 12 and Spring Boot.",
      "Contributed to breaking the monolith into microservices.",
      "Implemented Docker and managed Kubernetes clusters.",
    ],
    impact: "40% reduction in deployment times; one shared component set replacing per-team reimplementation.",
    stack: ["React", "TypeScript", "Java 12", "Spring Boot", "Docker", "Kubernetes"],
  },
  {
    dates: "Nov 2020 — May 2021",
    company: "IST Networks",
    title: "Front End Engineer",
    summary: "Built the internal dashboards operations teams used to monitor reported issues.",
    context: "A systems integrator where internal tooling had to talk to large external partner systems.",
    owned: [
      "Built and maintained internal dashboards (TypeScript, React, Redux, Tailwind) used by operations teams to monitor reported issues.",
      "Integrated external systems — including Vodafone reporting — with internal services, coordinating requirements across both sides of the boundary.",
    ],
    stack: ["TypeScript", "React", "Redux", "REST"],
  },
  {
    dates: "Jul 2019 — Aug 2020",
    company: "RiseUp",
    title: "Full Stack Engineer",
    summary: "Delivered a learning platform end-to-end and handed publishing control back to the content team.",
    context:
      "RiseUp runs a large entrepreneurship community; the Academy platform was a new product line, and content updates were bottlenecked on engineering.",
    owned: [
      "Delivered the RiseUp Academy platform end-to-end (React + Django), covering the learner-facing product and the backend APIs.",
      "Built an internal dashboard that let the content team publish directly to the main site.",
    ],
    impact: "Removed a recurring engineering dependency from the content workflow.",
    stack: ["React", "Django", "PostgreSQL"],
  },
  {
    dates: "Jul 2017 — Dec 2018",
    location: "Freelance",
    company: "Upwork",
    title: "Software Engineer",
    summary: "Client web projects, owned from requirements through delivery.",
    owned: [
      "Gathered requirements directly with international clients, scoped the work, and shipped against agreed timelines.",
      "First real exposure to owning the whole loop — understanding what someone actually needs versus what they asked for.",
    ],
    stack: [],
  },
];

export const selectedWork = [
  {
    tag: "01 / Pipeline",
    title: "AI Document Processing Pipeline",
    body: "Queue-backed service that rasterises incoming PDFs, extracts structured fields with Claude Vision, validates output, and hands clean data downstream. Built for a payroll context where formats are inconsistent and errors are expensive.",
    stack: "TypeScript · BullMQ · Redis · Claude Vision · pdf2pic · Zod",
  },
  {
    tag: "02 / Product",
    title: "Raseedi — Smart Wallet Optimisation",
    body: "Business-facing web application that matched advertisers to mobile users by budget classification.",
    stack: "React · Node.js",
  },
  {
    tag: "03 / Platform",
    title: "Enrollet — Central Admission Service",
    body: "A uni-assist-style central admission platform for Egyptian universities, simplifying applications and giving newer universities visibility they otherwise lacked. Graduation project.",
    stack: "Full-stack web",
  },
] as const;

export const skills = [
  { label: "Languages", items: "TypeScript · JavaScript · Python · Java · SQL", signal: false },
  { label: "Frontend", items: "React · Next.js · Redux · Angular · Tailwind · React Hook Form · Zod", signal: false },
  { label: "Backend", items: "Node.js · NestJS · Express · tRPC · REST · GraphQL · Django · Spring Boot", signal: false },
  { label: "Data", items: "PostgreSQL · MySQL · MongoDB · Redis · Prisma · Drizzle · Tableau · ETL", signal: false },
  {
    label: "AI & Automation",
    items: "LLM integration · Claude Vision · AI agents · prompt engineering · n8n · BullMQ pipelines · AI-assisted development",
    signal: true,
  },
  { label: "Infrastructure", items: "Docker · Kubernetes · AWS · CI/CD · Jenkins · Datadog", signal: false },
  { label: "Practices", items: "Agile · TDD/BDD · code review · Jira · Git · Figma", signal: false },
] as const;

export const education = [
  {
    dates: "2024 — Present",
    title: "M.Sc. Global Software Development",
    place: "Hochschule Fulda, Germany",
  },
  {
    dates: "2015 — 2020",
    title: "B.Sc. Electronics & Computer Engineering",
    place: "Nile University, Egypt — GPA 3.22 / 4.0",
  },
] as const;

export const certifications =
  "Continuous Discovery Habits (Teresa Torres) · Android Development Nanodegree · Front End Development Track · IBM Internship (Blockchain) · BlueCloud Internship (Microsoft CRM) · 2nd Place Differential Equations & 2nd Place Linear Algebra, Nile University Research Forum";

export const languages = "English — Advanced (IELTS C1 / 7.0) · German — A2 · Arabic — Native";
