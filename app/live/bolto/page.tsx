import type { Metadata } from "next";
import LiveBolto from "./LiveBolto";

export const metadata: Metadata = {
  title: "Payroll Preflight for Bolto: live mockup",
  description: "Bolto concept: payroll opens on what changed and what's wrong, with a fix each, then shows what happens next. Concept by Daniel Ade-Otoki.",
};

export default function Page() {
  return <LiveBolto />;
}
