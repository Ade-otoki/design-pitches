import type { Metadata } from "next";
import LiveHousingAnywhere from "./LiveHousingAnywhere";

export const metadata: Metadata = {
  title: "Move-in Check for HousingAnywhere: live mockup",
  description: "HousingAnywhere post-booking concept: a visible 48-hour move-in check that keeps the first month protected. Concept by Daniel Ade-Otoki.",
};

export default function Page() {
  return <LiveHousingAnywhere />;
}
