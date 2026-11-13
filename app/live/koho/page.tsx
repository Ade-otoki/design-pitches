import type { Metadata } from "next";
import LiveKoho from "./LiveKoho";

export const metadata: Metadata = {
  title: "Clear Payday for KOHO: live mockup",
  description: "KOHO Cover concept: preview how a deposit splits between Cover and Spendable, and see where every deposit went. Concept by Daniel Ade-Otoki.",
};

export default function Page() {
  return <LiveKoho />;
}
