"use client";

// Live mockup: the HousingAnywhere "Move-in Check" prototype running inside an iPhone 17 frame.
// Scenario buttons talk to the phone over a BroadcastChannel (?sync=1) so the demo keeps its state.
// Concept by Daniel Ade-Otoki, not HousingAnywhere's official UI.

import { useState } from "react";
import IPhone17 from "../../../lib/IPhone17";
import { BOOKING_URL } from "../../../lib/site";

type Scenario = "before" | "checkin" | "report";
const STEPS: { key: Scenario; label: string; title: string; body: string }[] = [
  { key: "before", label: "1. Before move-in", title: "Know exactly what happens next", body: "A confirmed move-in time, and a plain timeline of when your first month is held and when it goes to the landlord." },
  { key: "checkin", label: "2. Move-in day", title: "Check the room inside the 48 hours", body: "A countdown and a short checklist turn the 48-hour protection window into something you can actually use." },
  { key: "report", label: "3. Something's wrong", title: "Report it with proof, keep your money safe", body: "One tap adds photos to the report, pauses the release and tells you when the team will reply." },
];

function post(msg: object) {
  if (typeof BroadcastChannel === "undefined") return;
  const c = new BroadcastChannel("ha-move-in-check");
  c.postMessage(msg);
  c.close();
}

export default function LiveHousingAnywhere() {
  const [s, setS] = useState<Scenario>("before");
  function pick(k: Scenario) { setS(k); post({ type: "scenario", scenario: k }); }

  return (
    <main className="lk">
      <style>{CSS}</style>
      <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" />
      <div className="lk-grid">
        <div className="lk-copy">
          <p className="lk-eyebrow">Move-in Check · concept for HousingAnywhere</p>
          <h1>Make the first 48 hours feel safe.</h1>
          <p className="lk-sub">HousingAnywhere holds a tenant&apos;s first month until 48 hours after move-in. This concept makes that window visible and usable on the app. The phone is live: pick a moment, then tap around.</p>
          <ol className="lk-steps">
            {STEPS.map((st) => (
              <li key={st.key}>
                <button className={s === st.key ? "on" : ""} aria-pressed={s === st.key} onClick={() => pick(st.key)}>
                  <span className="lk-l">{st.label}</span>
                  <b>{st.title}</b>
                  <span>{st.body}</span>
                </button>
              </li>
            ))}
          </ol>
          <p className="lk-links">
            <a href="/housinganywhere">Read the product log</a>
            <a href="/pitch/housinganywhere">See the pitch</a>
            <a href={BOOKING_URL} target="_blank" rel="noreferrer">Book a call</a>
          </p>
        </div>
        <div className="lk-phone">
          <IPhone17 src="/prototypes/housinganywhere?embed=1&sync=1&scenario=before" title="Move-in Check: live prototype" />
        </div>
      </div>
      <p className="lk-foot">Concept by Daniel Ade-Otoki · not HousingAnywhere&apos;s official UI · fictional data</p>
    </main>
  );
}

const CSS = `
html,body{background:#f3f6f8}
.lk{--ink:#16131f;--mut:#5c5a66;--p900:#002630;--p600:#e5401f;--ease:cubic-bezier(.23,1,.32,1);
 min-height:100vh;box-sizing:border-box;font-family:Inter,system-ui,sans-serif;color:var(--ink);
 background:radial-gradient(1000px 600px at 75% 10%,#ffe3dc 0,#f3f6f8 60%);padding:56px clamp(16px,5vw,80px) 28px}
.lk *{box-sizing:border-box}
.lk-grid{display:grid;grid-template-columns:minmax(0,1fr) 330px;gap:clamp(32px,6vw,96px);align-items:center;max-width:1080px;margin:0 auto}
.lk-eyebrow{margin:0 0 12px;font-size:15px;font-weight:600;color:var(--p600)}
.lk h1{margin:0;font-size:clamp(32px,3.6vw,46px);line-height:1.04;letter-spacing:-.035em;font-weight:800;text-wrap:balance}
.lk-sub{margin:16px 0 22px;font-size:17px;line-height:1.55;color:var(--mut);max-width:520px}
.lk-steps{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:10px}
.lk-steps button{all:unset;box-sizing:border-box;display:flex;flex-direction:column;gap:3px;width:100%;padding:14px 16px;border-radius:16px;border:1px solid #dfe7ec;background:#fff;cursor:pointer;transition:border-color 160ms ease,box-shadow 160ms ease,transform 160ms var(--ease)}
.lk-steps button:active{transform:scale(.99)}
.lk-steps button:focus-visible{outline:2px solid var(--p600);outline-offset:2px}
.lk-steps button.on{border-color:var(--p600);box-shadow:0 0 0 3px #ff4c2722}
.lk-l{font-size:12px;font-weight:700;letter-spacing:.04em;color:var(--p600);text-transform:uppercase}
.lk-steps b{font-size:16px}
.lk-steps span:last-child{font-size:14px;line-height:1.5;color:var(--mut)}
.lk-links{display:flex;gap:18px;flex-wrap:wrap;margin:20px 0 0}
.lk-links a{color:var(--p900);font-weight:700;text-decoration:none}
.lk-links a:hover{text-decoration:underline}
.lk-phone{width:100%}
.sf{position:relative;width:100%;overflow:hidden;background:#fff}
.sf iframe{position:absolute;top:0;left:0;border:0;display:block;background:#fff}
.lk-foot{max-width:1080px;margin:36px auto 0;font-size:13px;color:#7a7990}
@media (max-width:860px){.lk-grid{grid-template-columns:1fr}.lk-phone{max-width:330px;margin:0 auto}}
@media (prefers-reduced-motion:reduce){.lk-steps button{transition:none}}
`;
