// Daniel's own content, shared by every pitch deck. Only facts from the verified profile.
// Never add metrics, employers or tools that aren't here.
import type { CaseStudyKey } from "./types";

export const INTRO = {
  body: [
    "I'm Daniel, a product designer with 5+ years of experience across FinTech, RegTech, lending and B2B marketplaces.",
    "I work from research and problem definition through flows, prototypes, design systems and developer handoff, usually inside small teams where speed and ownership matter.",
  ],
  numbers: [
    "+31% repeat orders after redesigning Foodlify's checkout and ordering flows.",
    "Shipped a complete color system and usage reference that sharply reduced brand inconsistency.",
    "30K+ female-owned businesses empowered across Nigeria and Africa at Shecluded.",
    "Designed Youverify's Transaction Monitoring MVP end to end.",
    "60% increase in revenue for Shecluded.",
  ],
  closer: "I start from the workflow a person is actually navigating, prototype early, and treat research as an input to the next decision.",
};

export const CASE_STUDIES: Record<
  CaseStudyKey,
  { name: string; label: string; summary: string; detail: string; outcome: string; image?: string; url: string }
> = {
  youverify: {
    name: "Youverify",
    label: "AML onboarding · RegTech",
    summary:
      "Designed the onboarding step that gets a compliance team's customer data into Youverify's AML monitoring MVP, without a developer.",
    detail:
      "Columns in a team's own export are matched to the right fields automatically, so nobody has to guess. I also designed KYC verification and transaction-monitoring dashboards for financial institutions.",
    outcome: "3 Transaction Monitoring projects delivered on schedule in six months",
    image: "https://danieladeotoki.com/assets/work/youverify-aml-onboarding/DXGbFzLeXPBUdISgrMooYB7jYE-2048.png",
    url: "https://danieladeotoki.com/work/youverify-aml-onboarding",
  },
  foodlify: {
    name: "Foodlify",
    label: "Wallet-first checkout · B2B marketplace",
    summary:
      "Redesigned checkout and ordering for a B2B catering marketplace, starting with a wallet-first mobile checkout.",
    detail:
      "Journey mapping and research fed straight into sprints. I also built the component library and documentation used across four product lines.",
    outcome: "+23% customer satisfaction · +31% repeat orders · −45% developer onboarding time",
    image: "https://danieladeotoki.com/assets/foodlify-checkout-prototype.gif",
    url: "https://danieladeotoki.com/work/foodlify-checkout",
  },
  shecluded: {
    name: "Shecluded",
    label: "Loan application · Lending",
    summary:
      "Turned a long loan application that female entrepreneurs were abandoning into a 5-step progressive flow they could finish, pause and come back to.",
    detail:
      "On the same platform I redesigned the loan dashboard, testing with roughly 30% of active users and fixing three major pain points.",
    outcome: "Loan dashboard: +30% first-time engagement · −14% time-to-release",
    image: "https://danieladeotoki.com/assets/work/shecluded-loan-application/yj2JVNUbhzSoZPW9IBhX0ds3RA-2048.png",
    url: "https://danieladeotoki.com/work/shecluded-loan-application",
  },
  "shecluded-color": {
    name: "Shecluded",
    label: "Color system · Lending",
    summary:
      "Turned Shecluded's signature pink into a color system that stays on-brand and passes WCAG contrast on phones, outdoors and lower-end screens.",
    detail: "Tonal ramps, semantic roles and documented usage, so the team could ship accessible screens without guessing.",
    outcome: "Accessible, documented color foundations for a lending product",
    image: "https://danieladeotoki.com/assets/work/shecluded-color-system/HJswcZIz6MbQK3qgEC5Gp4N7uQY-2048.png",
    url: "https://danieladeotoki.com/work/shecluded-color-system",
  },
  okubo: {
    name: "Okubo",
    label: "Tier 2 KYC upgrade · FinTech",
    summary: "Designed a KYC experience so users could complete verification and unlock higher account and transaction limits.",
    detail: "A step-up verification flow designed to keep momentum while collecting what compliance needs.",
    outcome: "Public case study on my portfolio",
    url: "https://danieladeotoki.com/work/okubo-tier-2-kyc",
  },
};

export const SYSTEMS = {
  body: [
    "I treat design systems as a product: components built around real use cases, with documentation clear enough that an engineer never has to ask what a component does.",
    "At Foodlify, the component library and docs I built cut developer onboarding time by 45% and standardised interfaces across four product lines. At Shecluded, I turned a brand color into an accessible, WCAG-passing system.",
  ],
  approach: [
    { title: "Consistency", body: "Shared patterns that remove needless variation." },
    { title: "Real use cases", body: "Components shaped by product needs, not an abstract inventory." },
    { title: "Engineering alignment", body: "Clear specs and handoff that match how the code is built." },
    { title: "Accessibility", body: "Contrast, states and hierarchy built into the foundations." },
  ],
};

export const WORKING_STYLE = {
  body: [
    "I've run several remote freelance and contract engagements at once, across different industries and time zones. Remote work is how I already operate.",
  ],
  how: [
    { title: "Find the real problem", body: "Talk to users, read support threads and analytics, and understand the business and technical constraints." },
    { title: "Make ideas tangible early", body: "Prototype in Figma or in code, using AI tools like Claude and v0 to get to working builds fast." },
    { title: "Work closely with engineers", body: "Understand trade-offs, keep handoff clean, stay involved through shipping." },
    { title: "Communicate asynchronously", body: "Write down decisions, progress, blockers and rationale so other time zones aren't blocked." },
    { title: "Own the outcome", body: "Learn from what ships and improve it." },
  ],
};

export const LINKS = {
  portfolio: "https://danieladeotoki.com",
  linkedin: "https://linkedin.com/in/adeotokidaniel/",
  email: "adeotokidaniel@gmail.com",
};
