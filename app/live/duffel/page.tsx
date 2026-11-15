import type { Metadata } from "next";
import LiveDuffel from "./LiveDuffel";

export const metadata: Metadata = {
  title: "Change Desk for Duffel: live mockup",
  description: "Duffel Dashboard concept: airline schedule changes sorted by what a travel seller can do, and how soon the flight leaves. Concept by Daniel Ade-Otoki.",
};

export default function Page() {
  return <LiveDuffel />;
}
