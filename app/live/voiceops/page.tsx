import type { Metadata } from "next";
import LiveVoiceops from "./LiveVoiceops";

export const metadata: Metadata = {
  title: "Coaching Review for Voiceops: live mockup",
  description: "Voiceops concept: managers review only the coaching notes that need them, with the call moment as evidence, and auto-send unlocks as trust is earned. Concept by Daniel Ade-Otoki.",
};

export default function Page() {
  return <LiveVoiceops />;
}
