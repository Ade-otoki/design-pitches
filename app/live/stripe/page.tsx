import type { Metadata } from "next";
import LiveStripe from "./LiveStripe";

export const metadata: Metadata = {
  title: "Cash Timeline for Stripe: live mockup",
  description: "Stripe Balances concept: when money becomes available, when it lands in the bank, and whether it covers what's due. Concept by Daniel Ade-Otoki.",
};

export default function Page() {
  return <LiveStripe />;
}
