import type { Metadata } from "next";
import LiveSpendesk from "./LiveSpendesk";

export const metadata: Metadata = {
  title: "Verification Hub for Spendesk: live mockup",
  description: "Spendesk KYC review concept: one checklist, documents checked as they're uploaded, shareholders asked directly, and a review you can track. Concept by Daniel Ade-Otoki.",
};

export default function Page() {
  return <LiveSpendesk />;
}
