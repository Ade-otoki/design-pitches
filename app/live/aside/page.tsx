import type { Metadata } from "next";
import LiveAside from "./LiveAside";

export const metadata: Metadata = {
  title: "Review Lane for Aside: live mockup",
  description: "Aside concept: approve an agent's outgoing messages in one calm pass while it keeps working, and recover from blocks per item. Concept by Daniel Ade-Otoki.",
};

export default function Page() {
  return <LiveAside />;
}
