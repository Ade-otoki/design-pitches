"use client";

// Concept prototype: "Evidence Review" for VECTRA International's assurance portal.
// Independent concept by Daniel Ade-Otoki. Not VECTRA's official UI, not affiliated with VECTRA International.
// Visual language follows vectra-intl.com: Poppins, deep navy (#00263D), VECTRA green (#54BD01 / #099250) and a warm yellow (#FFBE33).
// Grounded in VECTRA's own guidance on SMETA reports (findings vs Corrective Action Plan, "a commitment is not evidence")
// and certificate verification (ISO 25500-110:2026 verifies a record exists, not that it fits the decision). No VECTRA logo.
// Suppliers, sites, people and findings are fictional.

import { useEffect, useState } from "react";

type Scenario = "queue" | "review" | "board";
type Flag = { id: string; site: string; type: string; ai: string; evidence: string; claim: string; conf: number };
const FLAGS: Flag[] = [
  { id: "f1", site: "Sunrise Garments · Dhaka", type: "Closed without evidence", ai: "CAPR marks 'Overtime above 60 hours' as closed, but the only evidence is a management letter.", claim: "Status: Closed · 12 Oct 2026", evidence: "Management commitment letter, 10 Oct 2026. No payroll or time records attached.", conf: 0.91 },
  { id: "f2", site: "Sunrise Garments · Dhaka", type: "Scope gap", ai: "The audit covered the cutting and sewing units; the dyeing unit listed in the supplier profile wasn't assessed.", claim: "Scope: units A and B", evidence: "Supplier profile lists unit C (dyeing), added 2 Sep 2026.", conf: 0.84 },
  { id: "f3", site: "Andes Leather · Lima", type: "Certificate mismatch", ai: "Certificate verifies, but the recipient name differs from the supplier record.", claim: "Recipient: Andes Curtiembre SAC", evidence: "Supplier record: Andes Leather Group SAC.", conf: 0.62 },
];

export default function VectraEvidenceReview() {
  const [scenario, setScenario] = useState<Scenario>("queue");
  const [embed, setEmbed] = useState(false);
  const [decided, setDecided] = useState<Record<string, string>>({});
  const [open, setOpen] = useState("f1");
  const [toast, setToast] = useState<string | null>(null);
  function apply(s: Scenario) { setScenario(s); setToast(null); setOpen("f1"); setDecided(s === "board" ? { f1: "Upheld", f2: "Upheld", f3: "Dismissed" } : {}); }

  useEffect(() => {
    const q = new URLSearchParams(window.location.search);
    const s = q.get("scenario") as Scenario | null;
    if (s && ["queue", "review", "board"].includes(s)) apply(s);
    setEmbed(q.get("embed") === "1");
    if (q.get("sync") !== "1" || typeof BroadcastChannel === "undefined") return;
    const c = new BroadcastChannel("vectra-evidence-review");
    c.onmessage = (e) => { if (e.data?.type === "scenario") apply(e.data.scenario); };
    return () => c.close();
  }, []);
  useEffect(() => { if (!toast) return; const t = setTimeout(() => setToast(null), 3800); return () => clearTimeout(t); }, [toast]);

  const f = FLAGS.find((x) => x.id === open)!;
  function decide(id: string, d: string) { setDecided({ ...decided, [id]: d }); setToast(`${d} · logged to the audit trail`); const next = FLAGS.find((x) => x.id !== id && !decided[x.id]); if (next) setOpen(next.id); }
  return (
    <div className={`vx ${embed ? "is-embed" : ""}`}>
      <style>{CSS}</style>
      <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap" />
      {!embed && (
        <div className="demo" role="group" aria-label="Concept demo">
          <span className="demo-l">Concept demo</span>
          {(["queue", "review", "board"] as Scenario[]).map((s, i) => (
            <button key={s} className={scenario === s ? "on" : ""} aria-pressed={scenario === s} onClick={() => apply(s)}>
              {i + 1}. {{ queue: "What the AI flagged", review: "Decide with the evidence", board: "What the board sees" }[s]}
            </button>
          ))}
        </div>
      )}
      <div className="app">
        <header className="bar">
          <span className="logo">VECTRA <em>Assurance</em></span>
          <nav>{["Participants", "Assessments", "QA review", "Board"].map((n) => <span key={n} className={(scenario === "board" ? n === "Board" : n === "QA review") ? "on" : ""}>{n}</span>)}</nav>
          <span className="who">{scenario === "board" ? "Board view" : "QA · Inès M."}</span>
        </header>

        {scenario !== "board" ? (
          <div className="body">
            <aside className="list" aria-label="AI flags">
              <div className="lh"><b>AI flags to review</b><span>{FLAGS.filter((x) => !decided[x.id]).length} open</span></div>
              {FLAGS.map((x) => (
                <button key={x.id} className={`fl ${open === x.id ? "on" : ""} ${decided[x.id] ? "done" : ""}`} onClick={() => { setOpen(x.id); if (scenario === "queue") setScenario("review"); }}>
                  <span className="ft">{x.type}</span>
                  <b>{x.site}</b>
                  <span className="fm">{decided[x.id] ? `✓ ${decided[x.id]}` : `AI confidence ${Math.round(x.conf * 100)}%`}</span>
                </button>
              ))}
              <p className="sm">The AI flags; a reviewer decides. Nothing reaches a participant or the board until it&apos;s reviewed.</p>
            </aside>
            <main className="main">
              {scenario === "queue" ? (
                <div className="intro">
                  <h1>Sunrise Garments · SMETA 4-pillar audit</h1>
                  <p className="sub">Assessor report and Corrective Action Plan uploaded 14 Nov 2026 · 3 AI flags across 2 sites</p>
                  <div className="steps">
                    {[["Participant", "Uploaded report and CAPR", 1], ["Assessor", "Submitted 14 Nov", 1], ["QA review", "3 flags to decide", 0], ["Board", "Waiting for QA", 2]].map(([a, b, s]) => (
                      <div key={a as string} className={`st s${s}`}><i>{s === 1 ? "✓" : s === 0 ? "●" : "○"}</i><b>{a}</b><span>{b}</span></div>
                    ))}
                  </div>
                  <p className="hint">Select a flag to see the claim and the evidence side by side.</p>
                </div>
              ) : (
                <div className="rev" key={f.id}>
                  <div className="rh"><span className="ft">{f.type}</span><span className="cf">AI confidence {Math.round(f.conf * 100)}%</span></div>
                  <h1>{f.site}</h1>
                  <p className="ai"><b>Why it was flagged</b>{f.ai}</p>
                  <div className="cmp">
                    <div><span className="lbl">What the report says</span><p>{f.claim}</p></div>
                    <div><span className="lbl">What the evidence shows</span><p>{f.evidence}</p></div>
                  </div>
                  {decided[f.id] ? (
                    <div className="dec">✓ {decided[f.id]} by Inès M. · logged</div>
                  ) : (
                    <div className="acts">
                      <button className="b primary" onClick={() => decide(f.id, "Upheld")}>Uphold: reopen finding</button>
                      <button className="b" onClick={() => decide(f.id, "Edited")}>Edit wording</button>
                      <button className="b ghost" onClick={() => decide(f.id, "Dismissed")}>Dismiss with reason</button>
                    </div>
                  )}
                  <p className="sm">Upholding reopens the action for the participant and asks for payroll or time records.</p>
                </div>
              )}
            </main>
          </div>
        ) : (
          <main className="board">
            <h1>Supplier assurance · Q4 2026</h1>
            <p className="sub">Reviewed by QA before it reaches you. Each conclusion says what the evidence supports, and what it doesn&apos;t.</p>
            <div className="kpis">
              <div><b>48</b><span>sites assessed</span></div>
              <div><b>31</b><span>approved</span></div>
              <div className="y"><b>12</b><span>approved with conditions</span></div>
              <div className="r"><b>5</b><span>need more due diligence</span></div>
            </div>
            <table>
              <thead><tr><th>Site</th><th>Conclusion</th><th>Why</th><th>Not covered</th></tr></thead>
              <tbody>
                <tr><td>Sunrise Garments · Dhaka</td><td><span className="tg r">More due diligence</span></td><td>Overtime action reopened; no records yet</td><td>Dyeing unit (C)</td></tr>
                <tr><td>Andes Leather · Lima</td><td><span className="tg g">Approved</span></td><td>Certificate verified; name difference explained</td><td>—</td></tr>
                <tr><td>Kaya Ceramics · Izmir</td><td><span className="tg y">With conditions</span></td><td>2 actions open, due Jan 2027</td><td>Subcontracted glazing</td></tr>
              </tbody>
            </table>
          </main>
        )}
        {toast && <div className="toast" role="status">✓ {toast}</div>}
      </div>
      {!embed && <p className="credit">Concept by Daniel Ade-Otoki · not VECTRA&apos;s official UI · fictional suppliers, sites and findings</p>}
    </div>
  );
}

const CSS = `
html,body{margin:0;background:#fff}
.vx{--navy:#00263d;--ink:#181d27;--mut:#5d6675;--line:#e5e9ee;--soft:#f8fafc;--green:#54bd01;--dgreen:#099250;--gbg:#ecf8e1;--yel:#ffbe33;--ybg:#fff5df;--red:#c43d3d;--rbg:#fdecec;--ease:cubic-bezier(.23,1,.32,1);
 font-family:Poppins,system-ui,sans-serif;color:var(--ink);-webkit-font-smoothing:antialiased}
.vx *{box-sizing:border-box}
.demo{display:flex;gap:6px;align-items:center;flex-wrap:wrap;padding:8px 16px;border-bottom:1px dashed #ccc;font-size:13px}
.demo-l{font-size:11px;letter-spacing:.08em;text-transform:uppercase;color:var(--mut);margin-right:6px}
.demo button{all:unset;cursor:pointer;padding:5px 11px;border-radius:999px;border:1px solid var(--line)}
.demo button.on{background:var(--navy);color:#fff;border-color:var(--navy)}
.demo button:focus-visible,.b:focus-visible,.fl:focus-visible{outline:2px solid var(--dgreen);outline-offset:2px}
.app{position:relative;display:flex;flex-direction:column;height:800px;overflow:hidden}
.vx:not(.is-embed) .app{height:calc(100svh - 64px);min-height:640px}
.bar{display:flex;align-items:center;gap:28px;background:var(--navy);color:#fff;padding:12px 22px;font-size:13px}
.logo{font-weight:700;letter-spacing:.04em}.logo em{font-style:normal;font-weight:400;color:var(--green);margin-left:4px}
nav{display:flex;gap:18px}nav span{opacity:.75}nav .on{opacity:1;font-weight:600;border-bottom:2px solid var(--green);padding-bottom:2px}
.who{margin-left:auto;opacity:.85}
.body{flex:1;display:grid;grid-template-columns:300px 1fr;min-height:0}
.list{border-right:1px solid var(--line);background:var(--soft);padding:16px 12px;display:flex;flex-direction:column;gap:8px;overflow:auto}
.lh{display:flex;justify-content:space-between;align-items:baseline;font-size:13.5px;padding:0 4px 4px}.lh span{color:var(--mut);font-size:12px}
.fl{all:unset;box-sizing:border-box;width:100%;cursor:pointer;display:flex;flex-direction:column;gap:3px;padding:11px 12px;border-radius:10px;background:#fff;border:1px solid var(--line);font-size:13px;transition:transform 160ms var(--ease)}
.fl:active{transform:scale(.98)}.fl.on{border-color:var(--dgreen);box-shadow:0 0 0 1px var(--dgreen)}.fl.done{opacity:.6}
.ft{font-size:11px;font-weight:600;color:#7a4f00;background:var(--ybg);padding:2px 8px;border-radius:999px;align-self:flex-start}
.fm{font-size:11.5px;color:var(--mut)}
.sm{font-size:12px;color:var(--mut);line-height:1.5;margin:6px 4px 0}
.main{overflow:auto;padding:24px 32px}
h1{font-size:20px;margin:6px 0 4px;color:var(--navy)}.sub{margin:0 0 18px;color:var(--mut);font-size:13px}
.steps{display:grid;grid-template-columns:repeat(4,1fr);gap:10px;max-width:760px}
.st{border:1px solid var(--line);border-radius:12px;padding:12px;display:flex;flex-direction:column;gap:3px;font-size:12.5px}.st span{color:var(--mut)}
.st i{font-style:normal;font-size:14px}.st.s1 i{color:var(--dgreen)}.st.s0{border-color:var(--yel);background:var(--ybg)}.st.s2{opacity:.6}
.hint{margin-top:22px;color:var(--mut);font-size:13px}
.rev{max-width:820px;animation:in 220ms var(--ease)}
.rh{display:flex;gap:10px;align-items:center}.cf{font-size:12px;color:var(--mut)}
.ai{background:var(--soft);border-left:3px solid var(--yel);border-radius:6px;padding:10px 14px;font-size:14px;line-height:1.55;display:flex;flex-direction:column;gap:2px}
.ai b{font-size:11.5px;text-transform:uppercase;letter-spacing:.05em;color:var(--mut)}
.cmp{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin:14px 0}
.cmp div{border:1px solid var(--line);border-radius:12px;padding:12px 14px}.cmp p{margin:4px 0 0;font-size:14px;line-height:1.5}
.lbl{font-size:11.5px;font-weight:600;color:var(--mut)}
.acts{display:flex;gap:8px;flex-wrap:wrap}
.b{all:unset;cursor:pointer;font-size:13px;font-weight:600;padding:9px 14px;border-radius:999px;border:1px solid var(--line);transition:transform 160ms var(--ease)}
.b:active{transform:scale(.97)}.b.primary{background:var(--dgreen);color:#fff;border-color:var(--dgreen)}.b.ghost{color:var(--mut);border-color:transparent}
.dec{background:var(--gbg);color:var(--dgreen);font-weight:600;border-radius:10px;padding:10px 14px;font-size:13.5px}
.board{padding:24px 32px;overflow:auto;animation:in 220ms var(--ease)}
.kpis{display:grid;grid-template-columns:repeat(4,1fr);gap:12px;max-width:900px;margin-bottom:18px}
.kpis div{border:1px solid var(--line);border-radius:12px;padding:14px;display:flex;flex-direction:column}.kpis b{font-size:26px;color:var(--navy)}.kpis span{font-size:12.5px;color:var(--mut)}
.kpis .y{background:var(--ybg);border-color:#f5d99a}.kpis .r{background:var(--rbg);border-color:#f3c4c4}
table{width:100%;max-width:900px;border-collapse:collapse;font-size:13.5px}th{text-align:left;font-size:12px;color:var(--mut);font-weight:600;padding:8px 10px;border-bottom:1px solid var(--line)}td{padding:12px 10px;border-bottom:1px solid var(--line)}
.tg{font-size:11.5px;font-weight:600;padding:3px 9px;border-radius:999px}.tg.g{background:var(--gbg);color:var(--dgreen)}.tg.y{background:var(--ybg);color:#7a4f00}.tg.r{background:var(--rbg);color:var(--red)}
.toast{position:absolute;left:50%;bottom:22px;transform:translateX(-50%);background:var(--navy);color:#fff;font-size:13px;padding:10px 16px;border-radius:999px;animation:up 260ms var(--ease)}
.credit{margin:10px 16px;font-size:11px;color:var(--mut)}
@keyframes in{from{opacity:0;transform:translateY(-4px)}}
@keyframes up{from{opacity:0;transform:translate(-50%,10px)}}
@media (prefers-reduced-motion:reduce){.rev,.board,.toast{animation:none}.b,.fl{transition:none}}
`;
