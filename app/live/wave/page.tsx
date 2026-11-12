import type { Metadata } from "next";
import LiveWave from "./LiveWave";

export const metadata: Metadata = {
  title: "Fair Cancel for Wave: live mockup",
  description: "Sender and recipient phones running the Fair Cancel concept prototype side by side. Concept by Daniel Ade-Otoki.",
};

export default function Page() {
  return <LiveWave />;
}
