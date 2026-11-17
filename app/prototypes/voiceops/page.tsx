"use client";

// Concept prototype: "Coaching Review" for Voiceops.
// Independent concept by Daniel Ade-Otoki. Not Voiceops' official UI, not affiliated with Voiceops.
// Grounded in the role brief: decide "how much evidence to show", "when Voiceops should show, ask, coach, or act",
// and "how Voiceops earns the trust to take on more work". Voiceops' product UI wasn't available to inspect, so this uses a
// clean manager-dashboard style (white, deep green ink, one accent). No Voiceops logo. Reps, calls and numbers are fictional.

import { useEffect, useState } from "react";

type Scenario = "review" | "evidence" | "trust";
type Note = { id: string; rep: string; skill: string; draft: string; conf: "High" | "Medium"; calls: number; auto: boolean };
const NOTES: Note[] = [
  { id: "n1", rep: "Maria Lopez", skill: "Price objections", draft: "When a caller says it's too expensive, you moved to discounts in 4 of 6 calls. Try restating the coverage first, like your 2:14pm call.", conf: "High", calls: 6, auto: false },
  { id: "n2", rep: "Devon Price", skill: "Opening", draft: "Great openings this week: callers stayed past 60 seconds in 9 of 10 calls. Keep it up.", conf: "High", calls: 10, auto: true },
  { id: "n3", rep: "Aisha Khan", skill: "Compliance disclosure", draft: "You skipped the recording disclosure in 2 calls. Say it in the first 15 seconds.", conf: "Medium", calls: 2, auto: false },
  { id: "n4", rep: "Sam Ortiz", skill: "Closing", draft: "You asked for the sale in 7 of 8 qualified calls, the team's best rate today.", conf: "High", calls: 8, auto: true },
];

export default function VoiceopsCoachingReview() {
  const [scenario, setScenario] = useState<Scenario>("review");
  const [embed, setEmbed] = useState(false);
  const [sent, setSent] = useState<string[]>([]);
  const [toast, setToast] = useState<string | null>(null);
  function apply(s: Scenario) { setScenario(s); setToast(null); setSent([]); }

  useEffect(() => {
    const q = new URLSearchParams(window.location.search);
    const s = q.get("scenario") as Scenario | null;
    if (s && ["review", "evidence", "trust"].includes(s)) apply(s);
    setEmbed(q.get("embed") === "1");
    if (q.get("sync") !== "1" || typeof BroadcastChannel === "undefined") return;
    const c = new BroadcastChannel("voiceops-coaching-review");
    c.onmessage = (e) => { if (e.data?.type === "scenario") apply(e.data.scenario); };
    return () => c.close();
  }, []);
  useEffect(() => { if (!toast) return; const t = setTimeout(() => setToast(null), 3800); return () => clearTimeout(t); }, [toast]);

  const review = NOTES.filter((n) => !n.auto && !sent.includes(n.id));
  const auto = NOTES.filter((n) => n.auto);
  return (
    <div className={`vo ${embed ? "is-embed" : ""}`}>
      <style>{CSS}</style>
      <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" />
      {!embed && (
        <div className="demo" role="group" aria-label="Concept demo">
          <span className="demo-l">Concept demo</span>
          {(["review", "evidence", "trust"] as Scenario[]).map((s, i) => (
            <button key={s} className={scenario === s ? "on" : ""} aria-pressed={scenario === s} onClick={() => apply(s)}>
              {i + 1}. {{ review: "Review only what needs you", evidence: "See the moment, not the transcript", trust: "Let it do more" }[s]}
            </button>
          ))}
        </div>
      )}
      <div className="app">
        <aside className="nav">
          <div className="org"><span className="av">KI</span><b>Kestrel Insurance</b></div>
          {["Today", "Coaching", "Team", "Calls", "Playbook", "Settings"].map((n) => <span key={n} className={`ni ${n === "Coaching" ? "on" : ""}`}>{n}</span>)}
        </aside>
        <main className="main">
          <header className="hd"><div><h1>Today&apos;s coaching</h1><p>Team B · 14 reps · drafted from 1,240 calls yesterday</p></div>
            <span className="pill">{scenario === "trust" ? "Auto-send on for 2 note types" : `${review.length} need your review · ${auto.length} sent automatically`}</span></header>

          {scenario !== "trust" && (
            <div className="cols">
              <section>
                <h2>Needs your review</h2>
                {review.length === 0 && <div className="done">✓ All reviewed. Reps get their notes at their next break.</div>}
                {review.map((n) => (
                  <article key={n.id} className={`note ${scenario === "evidence" && n.id === "n1" ? "on" : ""}`}>
                    <div className="nh"><b>{n.rep}</b><span className="sk">{n.skill}</span><span className={`cf ${n.conf}`}>{n.conf} confidence · {n.calls} calls</span></div>
                    <p>{n.draft}</p>
                    {n.id === "n3" && <p className="why">Needs you: compliance notes always go to a manager first.</p>}
                    <div className="acts"><button className="b primary" onClick={() => { setSent([...sent, n.id]); setToast(`Sent to ${n.rep.split(" ")[0]} at their next break`); }}>Send</button><button className="b" onClick={() => setScenario("evidence")}>See the moment</button><button className="b ghost">Edit</button></div>
                  </article>
                ))}
                <h2 className="mt">Sent automatically</h2>
                {auto.map((n) => <div key={n.id} className="mini"><b>{n.rep}</b> · {n.skill} <span>praise · high confidence</span><button className="u" onClick={() => setToast(`Undone · ${n.rep.split(" ")[0]}'s note moved to review`)}>Undo</button></div>)}
              </section>
              {scenario === "evidence" && (
                <aside className="ev" aria-label="Evidence">
                  <h3>Maria · price objection · 2:14pm</h3>
                  <div className="wave" aria-hidden="true">{Array.from({ length: 44 }).map((_, i) => <i key={i} style={{ height: `${20 + ((i * 37) % 60)}%` }} className={i > 17 && i < 27 ? "hl" : ""} />)}</div>
                  <div className="tr"><p><b>Caller</b> That&apos;s more than I pay now.</p><p className="good"><b>Maria</b> I hear you. This plan includes roadside and rental cover, which your current one doesn&apos;t…</p><p><b>Caller</b> Oh, okay. What would that be monthly?</p></div>
                  <p className="sm">The model found the same moment in 6 calls. In 4, Maria offered a discount first.</p>
                  <button className="b primary" onClick={() => setToast("Playing 0:42 at 2:14pm call")}>▶ Play 42 seconds</button>
                </aside>
              )}
            </div>
          )}

          {scenario === "trust" && (
            <section className="trust">
              <h2>What Voiceops can send without you</h2>
              <p className="sub">Based on the 212 notes you reviewed: you sent 96% of praise and 91% of high-confidence skill notes unchanged.</p>
              <table>
                <thead><tr><th>Note type</th><th>You approved unchanged</th><th>Sending</th></tr></thead>
                <tbody>
                  <tr><td>Praise</td><td>96% of 80</td><td><span className="tg on">Automatic</span></td></tr>
                  <tr><td>Skill notes, high confidence</td><td>91% of 74</td><td><span className="tg on">Automatic</span></td></tr>
                  <tr><td>Skill notes, medium confidence</td><td>68% of 38</td><td><button className="tg" onClick={() => setToast("Kept on review · we'll suggest again after 50 more")}>Review first</button></td></tr>
                  <tr><td>Compliance</td><td>—</td><td><span className="tg lock">Always reviewed</span></td></tr>
                </tbody>
              </table>
              <p className="sm">You&apos;ll see a weekly digest of everything sent automatically, and can undo within 1 hour.</p>
            </section>
          )}
        </main>
        {toast && <div className="toast" role="status">✓ {toast}</div>}
      </div>
      {!embed && <p className="credit">Concept by Daniel Ade-Otoki · not Voiceops&apos; official UI · fictional reps, calls and numbers</p>}
    </div>
  );
}

const CSS = `
html,body{margin:0;background:#fff}
.vo{--ink:#0f2a24;--mut:#5f6f6b;--line:#e2e8e6;--soft:#f6f8f7;--acc:#1f6f5c;--accl:#e5f2ee;--amber:#8a5a00;--amberbg:#fff3d9;--ease:cubic-bezier(.23,1,.32,1);
 font-family:Inter,system-ui,sans-serif;color:var(--ink);-webkit-font-smoothing:antialiased}
.vo *{box-sizing:border-box}
.demo{display:flex;gap:6px;align-items:center;flex-wrap:wrap;padding:8px 16px;border-bottom:1px dashed #ccc;font-size:13px}
.demo-l{font-size:11px;letter-spacing:.08em;text-transform:uppercase;color:var(--mut);margin-right:6px}
.demo button{all:unset;cursor:pointer;padding:5px 11px;border-radius:999px;border:1px solid var(--line)}
.demo button.on{background:var(--acc);color:#fff;border-color:var(--acc)}
.demo button:focus-visible,.b:focus-visible,.tg:focus-visible,.u:focus-visible{outline:2px solid var(--acc);outline-offset:2px}
.app{position:relative;display:grid;grid-template-columns:210px 1fr;height:800px;overflow:hidden}
.vo:not(.is-embed) .app{height:calc(100svh - 64px);min-height:640px}
.nav{display:flex;flex-direction:column;gap:1px;padding:16px 12px;border-right:1px solid var(--line);background:var(--soft);font-size:13.5px}
.org{display:flex;gap:9px;align-items:center;margin-bottom:16px;font-size:13px}
.av{width:28px;height:28px;border-radius:7px;background:var(--ink);color:#fff;font-size:10px;font-weight:700;display:grid;place-items:center}
.ni{padding:7px 9px;border-radius:7px;color:#3d4c48}.ni.on{background:#fff;box-shadow:0 0 0 1px var(--line);font-weight:600;color:var(--ink)}
.main{overflow:auto;padding:20px 28px}
.hd{display:flex;justify-content:space-between;gap:16px;align-items:flex-start;margin-bottom:18px}
h1{font-size:21px;margin:0 0 4px}.hd p{margin:0;font-size:13px;color:var(--mut)}
.pill{font-size:12.5px;font-weight:600;padding:5px 10px;border-radius:999px;background:var(--accl);color:var(--acc);white-space:nowrap}
.cols{display:grid;grid-template-columns:minmax(0,1fr) auto;gap:20px}
h2{font-size:14.5px;margin:0 0 10px}.mt{margin-top:22px}
.note{border:1px solid var(--line);border-radius:12px;padding:13px 14px;margin-bottom:10px;animation:in 220ms var(--ease)}
.note.on{border-color:var(--acc);box-shadow:0 0 0 1px var(--acc)}
.nh{display:flex;gap:8px;align-items:center;flex-wrap:wrap;font-size:13.5px}
.sk{font-size:12px;color:var(--mut)}.cf{margin-left:auto;font-size:11.5px;font-weight:600;padding:2px 8px;border-radius:999px}.cf.High{background:var(--accl);color:var(--acc)}.cf.Medium{background:var(--amberbg);color:var(--amber)}
.note p{margin:8px 0 0;font-size:14px;line-height:1.5}.note .why{font-size:12.5px;color:var(--amber)}
.acts{display:flex;gap:8px;margin-top:10px}
.b{all:unset;cursor:pointer;font-size:13px;font-weight:600;padding:7px 12px;border-radius:8px;border:1px solid var(--line);transition:transform 160ms var(--ease)}
.b:active{transform:scale(.97)}.b.primary{background:var(--acc);color:#fff;border-color:var(--acc)}.b.ghost{border-color:transparent;color:var(--mut)}
.mini{display:flex;align-items:center;gap:6px;font-size:13px;padding:9px 0;border-bottom:1px solid var(--line)}.mini span{color:var(--mut);font-size:12px}
.u{all:unset;cursor:pointer;margin-left:auto;font-size:12.5px;color:var(--acc);font-weight:600}
.done{background:var(--accl);color:var(--acc);border-radius:10px;padding:12px;font-weight:600;font-size:13.5px}
.ev{width:330px;border:1px solid var(--line);border-radius:12px;padding:14px;align-self:start;animation:in 220ms var(--ease)}
.ev h3{margin:0 0 10px;font-size:14px}
.wave{display:flex;align-items:center;gap:2px;height:48px;margin-bottom:10px}.wave i{flex:1;background:#cfdcd8;border-radius:2px}.wave i.hl{background:var(--acc)}
.tr{font-size:13px;line-height:1.5;border-left:2px solid var(--line);padding-left:10px}.tr p{margin:0 0 6px}.tr .good{background:var(--accl);border-radius:6px;padding:4px 6px}
.sm{font-size:12.5px;color:var(--mut);margin:10px 0}
.trust{animation:in 220ms var(--ease)}.sub{font-size:13.5px;color:var(--mut);margin:-4px 0 14px;max-width:640px}
table{width:100%;max-width:760px;border-collapse:collapse;font-size:13.5px}th{text-align:left;font-size:12px;color:var(--mut);font-weight:600;padding:8px 10px;border-bottom:1px solid var(--line)}td{padding:12px 10px;border-bottom:1px solid var(--line)}
.tg{all:unset;font-size:12px;font-weight:600;padding:3px 9px;border-radius:999px;background:#f1f3f2;color:var(--mut);cursor:default}button.tg{cursor:pointer;border:1px dashed #b9c6c2}
.tg.on{background:var(--accl);color:var(--acc)}.tg.lock{background:var(--amberbg);color:var(--amber)}
.toast{position:absolute;left:50%;bottom:22px;transform:translateX(-50%);background:var(--ink);color:#fff;font-size:13px;padding:10px 14px;border-radius:8px;animation:up 260ms var(--ease)}
.credit{margin:10px 16px;font-size:11px;color:var(--mut)}
@keyframes in{from{opacity:0;transform:translateY(-4px)}}
@keyframes up{from{opacity:0;transform:translate(-50%,10px)}}
@media (prefers-reduced-motion:reduce){.note,.ev,.trust,.toast{animation:none}.b{transition:none}}
`;
