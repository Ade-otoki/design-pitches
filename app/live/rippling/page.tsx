import type { Metadata } from "next";
import LiveRippling from "./LiveRippling";

export const metadata: Metadata = {
  title: "Global Pay Calendar for Rippling: live mockup",
  description: "Rippling Global Payroll concept: every country's approve-by and payday in one view, moved dates explained, funding per currency. Concept by Daniel Ade-Otoki.",
};

export default function Page() {
  return <LiveRippling />;
}
