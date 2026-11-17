import type { Metadata } from "next";
import LiveVera from "./LiveVera";

export const metadata: Metadata = {
  title: "Claim Check for Vera Health: live mockup",
  description: "Vera Health concept: every claim in an answer labelled and one tap from its source passage, with local protocol differences flagged. Concept by Daniel Ade-Otoki.",
};

export default function Page() {
  return <LiveVera />;
}
