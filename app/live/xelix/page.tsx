import type { Metadata } from "next";
import LiveXelix from "./LiveXelix";

export const metadata: Metadata = {
  title: "Verified Replies for Xelix: live mockup",
  description: "Xelix Helpdesk concept: every AI-drafted supplier reply is checked against the ledger before it's sent. Concept by Daniel Ade-Otoki.",
};

export default function Page() {
  return <LiveXelix />;
}
