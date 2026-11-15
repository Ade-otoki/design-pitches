import type { Metadata } from "next";
import LiveFaire from "./LiveFaire";

export const metadata: Metadata = {
  title: "Terms Check for Faire: live mockup",
  description: "Faire net 60 concept: retailers see how an order fits their payment terms before checkout. Concept by Daniel Ade-Otoki.",
};

export default function Page() {
  return <LiveFaire />;
}
