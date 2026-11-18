import type { Metadata } from "next";
import LiveVectra from "./LiveVectra";

export const metadata: Metadata = {
  title: "Evidence Review for VECTRA: live mockup",
  description: "VECTRA International concept: QA reviewers decide on AI-flagged audit inconsistencies with claim and evidence side by side, and the board sees conclusions with their limits. Concept by Daniel Ade-Otoki.",
};

export default function Page() {
  return <LiveVectra />;
}
