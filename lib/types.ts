// One Product Log per company. The daily agent writes a file in /content/<slug>.json
// matching this shape. Every claim about the company must carry a source.

export type Source = { label: string; url: string };

export type ProductLog = {
  slug: string;
  draft?: boolean; // drafts are hidden from the index page
  company: string;
  companyUrl: string;
  role: string; // e.g. "Senior Product Designer"
  jobUrl?: string;
  date: string; // ISO date the log was written

  feature: {
    name: string; // e.g. "Guided Bulk Import"
    sprint: string; // e.g. "Self-initiated · 2-day concept sprint"
    icon?: string; // a single emoji or short glyph for the chip
  };

  prototype: {
    path: string; // e.g. "/prototypes/acme" (live in this same site)
    repoUrl: string; // GitHub folder link
    frame?: "phone" | "desktop";
  };

  context: {
    title: string;
    body: string;
    assumptions: string[];
    heroImage?: { src: string; alt: string; credit?: Source };
  };

  goals: { title: string; body: string }[]; // exactly 3

  jtbd: string; // "When I…, I want to…, so I can…"

  evidence: {
    step: string; // short label, e.g. "Users stall at CSV upload"
    finding: string;
    source: Source;
    image?: { src: string; alt: string };
  }[];

  approaches: string[]; // ~5 one-line approaches considered

  ranges: {
    title: string;
    summary: string;
    pros: string[];
    cons: string[];
    image?: { src: string; alt: string };
  }[]; // 3 compared in depth

  decision: {
    title: string;
    body: string;
    reasons: string[];
    tradeoff: string;
  };

  effortImpact?: {
    option: string;
    chosen?: boolean; // mark the option the Decision section picked
    effort: { design: number; dev: number; gtm: number }; // 1-10, lower = easier
    impact: { reach: number; value: number; business: number }; // 1-10
  }[];

  depth: { body: string };

  // No invented test results. This is what would be measured, and how.
  validation: {
    hypotheses: string[];
    metrics: { name: string; definition: string }[];
    method: string;
  };

  nextSteps: string[];
  sources: Source[];
};

// One pitch deck per company, at /pitch/<slug>. Written by the agent in /content/pitches/<slug>.json.
// Daniel's own intro, numbers and case studies live in lib/candidate.ts and are shared by every deck.
export type CaseStudyKey = "youverify" | "foodlify" | "shecluded" | "shecluded-color" | "okubo";

export type PitchDeck = {
  slug: string; // must match the Product Log slug
  company: string;
  role: string;
  date: string; // e.g. "NOV 2026"
  hook: string; // cover line, e.g. "I want to help make failed deploys obvious to fix"
  tags: [string, string]; // two short domain stickers on the cover
  builtFor: { context: string; opportunities: { title: string; body: string }[] }; // exactly 3
  whyMe: { body: string[]; bring: { title: string; body: string }[] };
  caseStudies: [CaseStudyKey, CaseStudyKey, CaseStudyKey]; // order by relevance
  systemsGets: string; // "What <Company> gets" line on the design-systems slide
  opportunity: { title: string; problem: string; solution: string };
  firstWeek: { intro: string; days: { day: string; body: string }[] };
  ask: string;
};
