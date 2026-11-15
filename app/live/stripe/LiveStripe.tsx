"use client";

// Live mockup: the Stripe "Cash Timeline" prototype running inside a desktop browser window.
// Step buttons talk to the prototype over a BroadcastChannel (?sync=1).
// Concept by Daniel Ade-Otoki. Not Stripe's official UI.

import { useState } from "react";
import ScaledFrame from "../../../lib/ScaledFrame";
import { BOOKING_URL } from "../../../lib/site";

type Scenario = "timeline" | "reserve" | "instant";
const STEPS: { key: Scenario; label: string; title: string; body: string }[] = [
  { key: "timeline", label: "1", title: "When money arrives", body: "Each day shows money becoming available and landing in the bank, with Friday payroll checked against it." },
  { key: "reserve", label: "2", title: "Why some is held", body: "A reserve is explained in place: how much, why, until when, and what it means for this week." },
  { key: "instant", label: "3", title: "Need it sooner", body: "Instant payout shows the fee next to the free option, and that it doesn't change the total." }
];

function post(msg: object) {
  if (typeof BroadcastChannel === "undefined") return;
  const c = new BroadcastChannel("stripe-cash-timeline");
  c.postMessage(msg);
  c.close();
}

export default function LiveStripe() {
  const [s, setS] = useState<Scenario>("timeline");
  function pick(k: Scenario) { setS(k); post({ type: "scenario", scenario: k }); }

  return (
    <main className="ls">
      <style>{CSS}</style>
      <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" />
      <div className="ls-top">
        <p className="ls-eyebrow">Cash Timeline · concept for Stripe Balances</p>
        <h1>Know when your money lands, and if it's enough.</h1>
        <p className="ls-sub">Stripe's Balances page shows incoming and available money, but not when it reaches your bank. This concept adds a day-by-day timeline, checked against payroll, with holds explained in place. The window is live: pick a step, then click around.</p>
      </div>
      <ol className="ls-steps">
        {STEPS.map((st) => (
          <li key={st.key}>
            <button className={s === st.key ? "on" : ""} aria-pressed={s === st.key} onClick={() => pick(st.key)}>
              <span className="ls-n">{st.label}</span>
              <span className="ls-t"><b>{st.title}</b><span>{st.body}</span></span>
            </button>
          </li>
        ))}
      </ol>
      <div className="ls-win">
        <div className="ls-bar" aria-hidden="true">
          <i /><i /><i />
          <span>Concept prototype · Cash Timeline</span>
        </div>
        <ScaledFrame src="/prototypes/stripe?embed=1&sync=1&scenario=timeline" title="Cash Timeline: live prototype" kind="desktop" />
      </div>
      <p className="ls-links">
        <a href="/stripe">Read the product log</a>
        <a href="/pitch/stripe">See the pitch</a>
        <a href={BOOKING_URL} target="_blank" rel="noreferrer">Book a call</a>
      </p>
      <p className="ls-foot">Concept by Daniel Ade-Otoki · not Stripe&apos;s official UI · fictional data</p>
    </main>
  );
}

const CSS = `
html,body{background:#f6f4fb}
.ls{--ink:#191b1b;--mut:#5e5f5f;--brand:#635bff;--ease:cubic-bezier(.23,1,.32,1);
 min-height:100vh;box-sizing:border-box;font-family:Inter,system-ui,sans-serif;color:var(--ink);
 background:radial-gradient(1100px 520px at 80% 0,#e7e1ff 0,#f6f4fb 62%);padding:48px clamp(16px,4vw,64px) 28px}
.ls *{box-sizing:border-box}
.ls-top{max-width:1120px;margin:0 auto}
.ls-eyebrow{margin:0 0 10px;font-size:15px;font-weight:600;color:var(--brand)}
.ls h1{margin:0;font-size:clamp(30px,3.4vw,44px);line-height:1.06;letter-spacing:-.03em;font-weight:800;text-wrap:balance;max-width:820px}
.ls-sub{margin:14px 0 22px;font-size:17px;line-height:1.55;color:var(--mut);max-width:760px}
.ls-steps{list-style:none;margin:0 auto 18px;padding:0;display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:10px;max-width:1120px}
.ls-steps button{all:unset;box-sizing:border-box;display:flex;gap:10px;align-items:flex-start;width:100%;height:100%;padding:12px 14px;border-radius:14px;border:1px solid #e1dcef;background:#fff;cursor:pointer;transition:border-color 160ms ease,box-shadow 160ms ease,transform 160ms var(--ease)}
.ls-steps button:active{transform:scale(.99)}
.ls-steps button:focus-visible{outline:2px solid var(--brand);outline-offset:2px}
.ls-steps button.on{border-color:var(--brand);box-shadow:0 0 0 3px #5d42d622}
.ls-n{flex-shrink:0;width:24px;height:24px;border-radius:50%;display:grid;place-items:center;font-size:12px;font-weight:700;background:#efedf7;color:var(--brand)}
.ls-steps button.on .ls-n{background:var(--brand);color:#fff}
.ls-t{display:flex;flex-direction:column;gap:3px}
.ls-t b{font-size:15px}
.ls-t span{font-size:13px;line-height:1.45;color:var(--mut)}
.ls-win{max-width:1120px;margin:0 auto;border-radius:14px;overflow:hidden;border:1px solid #dcd8e6;background:#fff;box-shadow:0 30px 60px -30px rgb(40 30 90 / .35),0 2px 6px rgb(0 0 0 / .05)}
.ls-bar{display:flex;align-items:center;gap:7px;padding:10px 14px;background:#f3f2f6;border-bottom:1px solid #e3e1ea}
.ls-bar i{width:11px;height:11px;border-radius:50%;background:#d6d3de}
.ls-bar span{margin-left:12px;flex:1;max-width:420px;padding:4px 12px;border-radius:7px;background:#fff;font-size:12px;color:#7d7b88}
.sf{position:relative;width:100%;overflow:hidden;background:#fff}
.sf iframe{position:absolute;top:0;left:0;border:0;display:block;background:#fff}
.ls-links{display:flex;gap:18px;flex-wrap:wrap;max-width:1120px;margin:20px auto 0}
.ls-links a{color:var(--brand);font-weight:700;text-decoration:none}
.ls-links a:hover{text-decoration:underline}
.ls-foot{max-width:1120px;margin:20px auto 0;font-size:13px;color:#7a7990}
@media (max-width:900px){.ls-steps{grid-template-columns:1fr 1fr}}
@media (max-width:560px){.ls-steps{grid-template-columns:1fr}}
@media (prefers-reduced-motion:reduce){.ls-steps button{transition:none}}
`;
