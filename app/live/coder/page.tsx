import type { Metadata } from "next";
import LiveCoder from "./LiveCoder";

export const metadata: Metadata = {
  title: "Workspace Check for Coder: live mockup",
  description: "Coder Agents concept: see the workspace an agent picked and why, steer it mid-step, and review what's ready. Concept by Daniel Ade-Otoki.",
};

export default function Page() {
  return <LiveCoder />;
}
