"use client";

// Concept prototype: "Claim Check" for Vera Health (mobile).
// Independent concept by Daniel Ade-Otoki. Not Vera's official UI, not affiliated with Vera Health.
// Vera's own visuals weren't available to inspect; this uses a calm clinical style (white, deep navy, teal accent, Inter).
// Clinical content is illustrative only, based on ATS/IDSA 2019 and NICE NG138 outpatient pneumonia guidance;
// "St Luke's antimicrobial guide" is fictional. Not medical advice.

import { useEffect, useState } from "react";

type Scenario = "answer" | "source" | "local";
type Claim = { id: string; text: string; src: string; grade: "High" | "Moderate" | "Low"; match: "Supports" | "Partly supports" };
const CLAIMS: Claim[] = [
  { id: "c1", text: "For healthy adults without comorbidities, amoxicillin 1 g three times daily is a first-line option.", src: "ATS/IDSA 2019 · outpatient treatment", grade: "Moderate", match: "Supports" },
  { id: "c2", text: "Doxycycline 100 mg twice daily is an alternative.", src: "ATS/IDSA 2019 · outpatient treatment", grade: "Low", match: "Supports" },
  { id: "c3", text: "Treat for a minimum of 5 days, and until clinically stable.", src: "ATS/IDSA 2019 · duration of therapy", grade: "Moderate", match: "Partly supports" },
];

export default function VeraClaimCheck() {
  const [scenario, setScenario] = useState<Scenario>("answer");
  const [embed, setEmbed] = useState(false);
  const [open, setOpen] = useState<string>("c3");
  const [toast, setToast] = useState<string | null>(null);
  function apply(s: Scenario) { setScenario(s); setToast(null); setOpen("c3"); }

  useEffect(() => {
    const q = new URLSearchParams(window.location.search);
    const s = q.get("scenario") as Scenario | null;
    if (s && ["answer", "source", "local"].includes(s)) apply(s);
    setEmbed(q.get("embed") === "1");
    if (q.get("sync") !== "1" || typeof BroadcastChannel === "undefined") return;
    const c = new BroadcastChannel("vera-claim-check");
    c.onmessage = (e) => { if (e.data?.type === "scenario") apply(e.data.scenario); };
    return () => c.close();
  }, []);
  useEffect(() => { if (!toast) return; const t = setTimeout(() => setToast(null), 3800); return () => clearTimeout(t); }, [toast]);

  const c = CLAIMS.find((x) => x.id === open)!;
  return (
    <div className={`vr ${embed ? "is-embed" : ""}`}>
      <style>{CSS}</style>
      <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" />
      {!embed && (
        <div className="demo" role="group" aria-label="Concept demo">
          <span className="demo-l">Concept demo</span>
          {(["answer", "source", "local"] as Scenario[]).map((s, i) => (
            <button key={s} className={scenario === s ? "on" : ""} aria-pressed={scenario === s} onClick={() => apply(s)}>
              {i + 1}. {{ answer: "Every claim, checked", source: "See the exact passage", local: "Your protocol differs" }[s]}
            </button>
          ))}
        </div>
      )}
      <div className="phone">
        <div className="status"><b>9:41</b><span>●●● ▮</span></div>
        <header className="top"><span className="back">‹</span><b>Vera</b><span className="new">New</span></header>
        <main className="scroll">
          <div className="q">Outpatient CAP, healthy adult, no comorbidities: first-line antibiotic and duration?</div>
          <section className="ans">
            <div className="ah"><span className="dot" />Answer <em>3 claims · 2 sources</em></div>
            {CLAIMS.map((x, i) => (
              <button key={x.id} className={`cl ${open === x.id && scenario !== "answer" ? "on" : ""}`} onClick={() => { setOpen(x.id); if (scenario === "answer") setScenario("source"); }}>
                <span className="t">{x.text}</span>
                <span className="meta"><i className={`m ${x.match === "Supports" ? "ok" : "part"}`}>{x.match === "Supports" ? "✓ Supported" : "◐ Partly supported"}</i><i className="g">Evidence: {x.grade}</i><i className="s">[{i + 1}]</i></span>
              </button>
            ))}
            {scenario === "local" && (
              <div className="local" role="note">
                <b>Your hospital protocol differs</b>
                <p>St Luke&apos;s antimicrobial guide (p. 12) uses <b>amoxicillin 500 mg three times daily for 5 days</b>, in line with NICE NG138.</p>
                <button className="b" onClick={() => setToast("Opened St Luke's guide at page 12")}>Open page 12</button>
              </div>
            )}
          </section>
          <p className="disc">Vera supports, not replaces, clinical judgment.</p>
        </main>
        <div className="ask"><span>Ask a follow-up…</span><span className="mic">◉</span></div>

        {scenario === "source" && (
          <div className="sheet" role="dialog" aria-label="Source passage">
            <div className="grab" />
            <div className="sh"><b>[{CLAIMS.indexOf(c) + 1}] {c.src}</b><button className="x" onClick={() => setScenario("answer")} aria-label="Close">✕</button></div>
            <p className="pt">Metlay JP et al. Diagnosis and Treatment of Adults with Community-acquired Pneumonia. Am J Respir Crit Care Med. 2019.</p>
            <blockquote>
              {c.id === "c3"
                ? <>“We recommend that the duration of antibiotic therapy should be guided by a validated measure of clinical stability… <mark>and antibiotic therapy should be continued until the patient achieves stability and for no less than a total of 5 days</mark>.”</>
                : <>“For healthy outpatient adults without comorbidities… <mark>amoxicillin 1 g three times daily</mark> (strong recommendation), <mark>or doxycycline 100 mg twice daily</mark> (conditional recommendation).”</>}
            </blockquote>
            {c.id === "c3" && <div className="why"><b>Why “partly”:</b> the guideline ties duration to a validated measure of clinical stability; the answer simplifies that.</div>}
            <div className="acts"><button className="b primary" onClick={() => setToast("Opened the full guideline at this passage")}>Open full source</button><button className="b" onClick={() => setToast("Thanks · flagged for review")}>Flag claim</button></div>
          </div>
        )}
        {toast && <div className="toast" role="status">✓ {toast}</div>}
      </div>
      {!embed && <p className="credit">Concept by Daniel Ade-Otoki · not Vera Health&apos;s official UI · illustrative clinical content, not medical advice</p>}
    </div>
  );
}

const CSS = `
html,body{margin:0;background:#eef2f5}
.vr{--ink:#0f1b2d;--mut:#5b6677;--line:#e3e8ee;--navy:#13294b;--teal:#0f8b8d;--tealbg:#e6f5f4;--amber:#9a5b00;--amberbg:#fff4dc;--ease:cubic-bezier(.23,1,.32,1);
 font-family:Inter,system-ui,sans-serif;color:var(--ink);-webkit-font-smoothing:antialiased;display:flex;flex-direction:column;align-items:center;min-height:100svh}
.vr *{box-sizing:border-box}
.demo{display:flex;gap:6px;align-items:center;flex-wrap:wrap;justify-content:center;padding:10px 16px;font-size:13px}
.demo-l{font-size:11px;letter-spacing:.08em;text-transform:uppercase;color:var(--mut);margin-right:6px}
.demo button{all:unset;cursor:pointer;padding:5px 11px;border-radius:999px;border:1px solid var(--line);background:#fff}
.demo button.on{background:var(--navy);color:#fff;border-color:var(--navy)}
.demo button:focus-visible,.b:focus-visible,.cl:focus-visible{outline:2px solid var(--teal);outline-offset:2px}
.phone{position:relative;width:402px;height:874px;background:#fff;overflow:hidden;display:flex;flex-direction:column}
.vr:not(.is-embed) .phone{border-radius:44px;box-shadow:0 0 0 10px #10151c,0 20px 60px rgba(0,0,0,.18);margin:8px 0 12px}
.status{display:flex;justify-content:space-between;padding:16px 30px 4px;font-size:14px}
.top{display:flex;align-items:center;justify-content:space-between;padding:8px 18px 10px;border-bottom:1px solid var(--line)}
.top b{font-size:17px;color:var(--navy)}.back{font-size:26px;color:var(--navy)}.new{font-size:13px;color:var(--teal);font-weight:600}
.scroll{flex:1;overflow:auto;padding:16px 18px 20px}
.q{background:#f3f6f9;border-radius:14px;padding:12px 14px;font-size:15px;font-weight:600;line-height:1.4;margin-bottom:14px}
.ah{display:flex;align-items:center;gap:8px;font-size:13px;font-weight:700;color:var(--navy);margin-bottom:10px}.ah em{font-style:normal;font-weight:500;color:var(--mut)}
.dot{width:8px;height:8px;border-radius:50%;background:var(--teal)}
.cl{all:unset;box-sizing:border-box;width:100%;display:flex;flex-direction:column;gap:6px;padding:10px 12px;border-radius:12px;cursor:pointer;margin-bottom:6px;border:1px solid transparent;transition:background 160ms var(--ease)}
.cl:active{background:#f3f6f9}.cl.on{background:var(--tealbg);border-color:#bfe3e1}
.cl .t{font-size:15px;line-height:1.45}
.meta{display:flex;gap:6px;flex-wrap:wrap}.meta i{font-style:normal;font-size:11.5px;font-weight:600;padding:2px 7px;border-radius:999px;background:#f1f4f7;color:var(--mut)}
.m.ok{background:var(--tealbg);color:var(--teal)}.m.part{background:var(--amberbg);color:var(--amber)}.s{color:var(--navy)!important}
.local{margin-top:8px;border:1px solid #f1d29b;background:var(--amberbg);border-radius:12px;padding:12px;font-size:13.5px;animation:in 220ms var(--ease)}
.local p{margin:4px 0 10px;line-height:1.45;color:#4a3300}
.disc{font-size:12px;color:var(--mut);margin-top:14px}
.ask{margin:0 14px 26px;border:1px solid var(--line);border-radius:22px;padding:12px 16px;display:flex;justify-content:space-between;color:var(--mut);font-size:15px}
.mic{color:var(--teal)}
.sheet{position:absolute;left:0;right:0;bottom:0;background:#fff;border-radius:22px 22px 0 0;box-shadow:0 -10px 40px rgba(15,27,45,.18);padding:8px 18px 30px;animation:up2 280ms var(--ease)}
.grab{width:40px;height:5px;border-radius:3px;background:#d5dbe2;margin:4px auto 10px}
.sh{display:flex;justify-content:space-between;align-items:center;font-size:14px;color:var(--navy)}
.x{all:unset;cursor:pointer;font-size:16px;color:var(--mut);padding:4px}
.pt{font-size:12.5px;color:var(--mut);margin:6px 0 10px;line-height:1.4}
blockquote{margin:0 0 10px;padding:10px 12px;border-left:3px solid var(--teal);background:#f7fafb;font-size:14px;line-height:1.5}
mark{background:#fff1b8;padding:0 2px}
.why{font-size:13px;background:var(--amberbg);color:#4a3300;border-radius:10px;padding:9px 11px;margin-bottom:12px;line-height:1.45}
.acts{display:flex;gap:8px}
.b{all:unset;cursor:pointer;text-align:center;font-size:14px;font-weight:600;padding:10px 14px;border-radius:12px;border:1px solid var(--line);background:#fff;transition:transform 160ms var(--ease)}
.b:active{transform:scale(.97)}.b.primary{background:var(--navy);color:#fff;border-color:var(--navy);flex:1}
.toast{position:absolute;left:50%;bottom:96px;transform:translateX(-50%);background:var(--ink);color:#fff;font-size:13px;padding:10px 14px;border-radius:12px;white-space:nowrap;animation:up 260ms var(--ease)}
.credit{font-size:11px;color:var(--mut);margin:0 0 16px}
@keyframes in{from{opacity:0;transform:translateY(-4px)}}
@keyframes up{from{opacity:0;transform:translate(-50%,10px)}}
@keyframes up2{from{transform:translateY(100%)}}
@media (prefers-reduced-motion:reduce){.local,.sheet,.toast{animation:none}.b,.cl{transition:none}}
`;
