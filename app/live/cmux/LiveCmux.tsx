"use client";

// Live mockup: the cmux "Attention Queue" prototype running inside a desktop browser window.
// Step buttons talk to the prototype over a BroadcastChannel (?sync=1).
// Concept by Daniel Ade-Otoki. Not cmux's official UI.

import { useState } from "react";
import ScaledFrame from "../../../lib/ScaledFrame";
import { BOOKING_URL } from "../../../lib/site";

type Scenario = "queue" | "answer" | "clear";
const STEPS: { key: Scenario; label: string; title: string; body: string }[] = [
  { key: "queue", label: "1", title: "Who needs you, and why", body: "A permission, a question and a failed test, each with its request and how long it has waited." },
  { key: "answer", label: "2", title: "Answer without switching", body: "Allow the migration once from the queue; the ring clears and the agent continues." },
  { key: "clear", label: "3", title: "Back to flow", body: "All three resolved in two minutes, and the queue goes quiet." }
];

function post(msg: object) {
  if (typeof BroadcastChannel === "undefined") return;
  const c = new BroadcastChannel("cmux-attention-queue");
  c.postMessage(msg);
  c.close();
}

export default function LiveCmux() {
  const [s, setS] = useState<Scenario>("queue");
  function pick(k: Scenario) { setS(k); post({ type: "scenario", scenario: k }); }

  return (
    <main className="ls">
      <style>{CSS}</style>
      <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" />
      <div className="ls-top">
        <p className="ls-eyebrow">Attention Queue · concept for cmux</p>
        <h1>Five agents running. Know who needs you, and why.</h1>
        <p className="ls-sub">Blue rings show where an agent needs input, not why. This concept adds a queue that labels each wait, shows the request, and lets you answer without switching panes. The window is live: pick a step, then click around.</p>
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
          <span>Concept prototype · Attention Queue</span>
        </div>
        <ScaledFrame src="/prototypes/cmux?embed=1&sync=1&scenario=queue" title="Attention Queue: live prototype" kind="desktop" />
      </div>
      <p className="ls-links">
        <a href="/cmux">Read the product log</a>
        <a href="/pitch/cmux">See the pitch</a>
        <a href={BOOKING_URL} target="_blank" rel="noreferrer">Book a call</a>
      </p>
      <p className="ls-foot">Concept by Daniel Ade-Otoki · not cmux&apos;s official UI · fictional data</p>
    </main>
  );
}

const CSS = `
html,body{background:#f6f4fb}
.ls{--ink:#191b1b;--mut:#5e5f5f;--brand:#3b82f6;--ease:cubic-bezier(.23,1,.32,1);
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
