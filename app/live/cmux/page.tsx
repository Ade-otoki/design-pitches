import type { Metadata } from "next";
import LiveCmux from "./LiveCmux";

export const metadata: Metadata = {
  title: "Attention Queue for cmux: live mockup",
  description: "cmux concept: a queue that says which agent needs you and why, with inline answers, so developers stay in flow. Concept by Daniel Ade-Otoki.",
};

export default function Page() {
  return <LiveCmux />;
}
