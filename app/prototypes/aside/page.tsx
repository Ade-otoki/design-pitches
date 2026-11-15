"use client";

// Concept prototype: "Review Lane" for Aside, the AI browser.
// Independent concept by Daniel Ade-Otoki. Not Aside's official UI, not affiliated with Aside.
// Layout follows Aside's "New York" tab style as described publicly (tabs, groups and chat stacked in a left sidebar,
// Agent Tabs group, Queue/Steer follow-ups, Guard permission mode). Visuals use macOS-native conventions
// (translucent sidebar, system-like sans, neutral greys); aside.com's own styling wasn't available to inspect. No Aside logo.
// People, companies and messages are fictional.

import { useEffect, useState } from "react";

type Scenario = "batch" | "blocked" | "done";
type Draft = { id: string; name: string; role: string; line: string };
const DRAFTS: Draft[] = [
  { id: "a", name: "Priya Nair", role: "Head of Design · Lumen", line: "saw your post on design crits at Lumen; the 'two-minute silent read' idea…" },
  { id: "b", name: "Tom Okafor", role: "Design Lead · Fernway", line: "Fernway's new onboarding is lovely, especially the progress hint…" },
  { id: "c", name: "Ana Ruiz", role: "VP Product · Kitebase", line: "congrats on Kitebase's launch in Mexico; your team's checkout…" },
  { id: "d", name: "Jonas Berg", role: "Design Manager · Orbit", line: "your talk on design systems at Config stuck with me…" },
];

export default function AsideReviewLane() {
  const [scenario, setScenario] = useState<Scenario>("batch");
  const [embed, setEmbed] = useState(false);
  const [skipped, setSkipped] = useState<string[]>([]);
  const [open, setOpen] = useState<string | null>("a");
  const [toast, setToast] = useState<string | null>(null);
  function apply(s: Scenario) { setScenario(s); setSkipped([]); setOpen("a"); setToast(null); }

  useEffect(() => {
    const q = new URLSearchParams(window.location.search);
    const s = q.get("scenario") as Scenario | null;
    if (s && ["batch", "blocked", "done"].includes(s)) apply(s);
    setEmbed(q.get("embed") === "1");
    if (q.get("sync") !== "1" || typeof BroadcastChannel === "undefined") return;
    const c = new BroadcastChannel("aside-review-lane");
    c.onmessage = (e) => { if (e.data?.type === "scenario") apply(e.data.scenario); };
    return () => c.close();
  }, []);
  useEffect(() => { if (!toast) return; const t = setTimeout(() => setToast(null), 4200); return () => clearTimeout(t); }, [toast]);

  const ready = DRAFTS.filter((d) => !skipped.includes(d.id));
  const sent = scenario === "done" ? 10 : scenario === "blocked" ? 4 : 0;
  return (
    <div className={`as ${embed ? "is-embed" : ""}`}>
      <style>{CSS}</style>
      <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" />
      {!embed && (
        <div className="demo" role="group" aria-label="Concept demo">
          <span className="demo-l">Concept demo</span>
          {(["batch", "blocked", "done"] as Scenario[]).map((s, i) => (
            <button key={s} className={scenario === s ? "on" : ""} aria-pressed={scenario === s} onClick={() => apply(s)}>
              {i + 1}. {{ batch: "Review sends in one place", blocked: "Blocked, not stopped", done: "What was done" }[s]}
            </button>
          ))}
        </div>
      )}
      <div className="win">
        <aside className="side">
          <div className="lights"><i /><i /><i /></div>
          <div className="newtab">⌕ Search or ask</div>
          <span className="grp">Today</span>
          <span className="tab">Q4 hiring plan · Docs</span>
          <span className="tab">Design leads shortlist · Sheets</span>
          <span className="grp">Agent Tabs <em>{scenario === "done" ? "0" : "3"}</em></span>
          {scenario !== "done" && <>
            <span className="tab ag">Priya Nair · profile</span>
            <span className={`tab ag ${scenario === "blocked" ? "warn" : ""}`}>{scenario === "blocked" ? "⚠ Sign-in check" : "Tom Okafor · profile"}</span>
            <span className="tab ag">Kitebase · blog</span>
          </>}
          <span className="grp">Tasks</span>
          <span className="tab on">● Outreach to 12 design leads</span>
          <span className="tab">Compare 3 CRMs</span>
        </aside>

        <main className="task">
          <header className="th">
            <div><h1>Outreach to 12 design leads</h1><p>From “Design leads shortlist” · personal note for each · Guard mode</p></div>
            <div className="prog" aria-label={`${sent} of 12 sent`}><span>{sent} / 12 sent</span><div className="bar"><i style={{ width: `${(sent / 12) * 100}%` }} /></div></div>
          </header>

          <div className="cols">
            <section className="log" aria-label="Progress">
              <h2>Progress</h2>
              <ol>
                <li className="ok">Read the shortlist · 12 people</li>
                <li className="ok">Researched 8 profiles and recent posts</li>
                <li className={scenario === "done" ? "ok" : "run"}>{scenario === "done" ? "Researched all 12" : "Researching Ana Ruiz, Jonas Berg…"}</li>
                <li className={scenario === "done" ? "ok" : "wait"}>{scenario === "done" ? "Sent 10 · skipped 1 · 1 needs you" : "Sends wait in Review lane"}</li>
              </ol>
              <p className="sm">Aside keeps working while sends wait for you. Nothing goes out without your OK.</p>
              <div className="comp"><span>Steer or queue a note…</span><kbd>⏎</kbd></div>
            </section>

            <section className="lane" aria-label="Review lane">
              {scenario === "batch" && (
                <>
                  <div className="lh"><h2>Review lane</h2><span className="pill">{ready.length} ready to send</span></div>
                  <ul className="drafts">
                    {DRAFTS.map((d) => (
                      <li key={d.id} className={`${skipped.includes(d.id) ? "skip" : ""} ${open === d.id ? "open" : ""}`}>
                        <button className="dh" onClick={() => setOpen(open === d.id ? null : d.id)} aria-expanded={open === d.id}>
                          <span className="av">{d.name.split(" ").map((x) => x[0]).join("")}</span>
                          <span className="who"><b>{d.name}</b><em>{d.role}</em></span>
                          <span className="via">via LinkedIn</span>
                        </button>
                        {open === d.id && !skipped.includes(d.id) && (
                          <div className="body">
                            <p>Hi {d.name.split(" ")[0]}, {d.line}</p>
                            <p className="src">Based on: their post from 3 Nov · your note “keep it under 300 characters”</p>
                          </div>
                        )}
                        {!skipped.includes(d.id) && <button className="x" onClick={() => setSkipped([...skipped, d.id])} aria-label={`Skip ${d.name}`}>Skip</button>}
                      </li>
                    ))}
                  </ul>
                  <div className="acts">
                    <button className="b primary" onClick={() => apply("blocked")}>Send {ready.length}</button>
                    <button className="b">Edit all in a doc</button>
                  </div>
                  <p className="sm">8 more will arrive here as Aside finishes them. Sends go out one by one, at a human pace.</p>
                </>
              )}
              {scenario === "blocked" && (
                <>
                  <div className="lh"><h2>Needs you</h2><span className="pill warn">1 blocked</span></div>
                  <div className="block">
                    <b>LinkedIn asked to confirm it&apos;s you</b>
                    <p>Aside paused only Tom Okafor&apos;s message. The other 7 are still being researched.</p>
                    <div className="acts"><button className="b primary" onClick={() => setToast("Opened the sign-in check in Agent Tabs · Aside resumes when you're done")}>Take over this tab</button><button className="b" onClick={() => setToast("Tom Okafor skipped · you can retry from the summary")}>Skip Tom</button></div>
                  </div>
                  <div className="lh mt"><h2>Sent</h2><span className="pill ok">4</span></div>
                  <ul className="sent">{["Priya Nair", "Ana Ruiz", "Jonas Berg", "Mei Tanaka"].map((n) => <li key={n}>✓ {n}<em>just now</em></li>)}</ul>
                </>
              )}
              {scenario === "done" && (
                <>
                  <div className="lh"><h2>Done</h2><span className="pill ok">10 sent</span></div>
                  <dl className="sum">
                    <div><dt>Sent</dt><dd>10 · each with the note it used</dd></div>
                    <div><dt>Skipped</dt><dd>1 · Tom Okafor (you chose)</dd></div>
                    <div><dt>Needs you</dt><dd>1 · Lena Fox has no open messages; email found on her site</dd></div>
                  </dl>
                  <div className="acts"><button className="b primary" onClick={() => setToast("Saved to Design leads shortlist · Status column added")}>Update the shortlist</button><button className="b" onClick={() => setToast("Activity log opened · 10 sends with timestamps")}>See activity log</button></div>
                  <p className="sm">Replies will show here as they arrive. Ask Aside to follow up in 5 days.</p>
                </>
              )}
            </section>
          </div>
        </main>
        {toast && <div className="toast" role="status">✓ {toast}</div>}
      </div>
      {!embed && <p className="credit">Concept by Daniel Ade-Otoki · not Aside&apos;s official UI · fictional people and messages</p>}
    </div>
  );
}

const CSS = `
html,body{margin:0;background:#ecebe8}
.as{--bg:#ecebe8;--win:#fff;--side:#f3f2ef;--line:#e4e2dd;--ink:#1d1d1f;--mut:#6e6e73;--acc:#1d1d1f;--blue:#0a64d6;--ok:#1f8a4c;--okbg:#e6f4ea;--warn:#a35a00;--warnbg:#fff3df;--ease:cubic-bezier(.23,1,.32,1);
 font-family:-apple-system,"SF Pro Text",Inter,system-ui,sans-serif;color:var(--ink);-webkit-font-smoothing:antialiased}
.as *{box-sizing:border-box}
.demo{display:flex;gap:6px;align-items:center;flex-wrap:wrap;padding:8px 16px;border-bottom:1px dashed #c9c7c1;font-size:13px}
.demo-l{font-size:11px;letter-spacing:.08em;text-transform:uppercase;color:var(--mut);margin-right:6px}
.demo button{all:unset;cursor:pointer;padding:5px 11px;border-radius:999px;border:1px solid var(--line);background:#fff}
.demo button.on{background:var(--ink);color:#fff;border-color:var(--ink)}
.demo button:focus-visible,.b:focus-visible,.dh:focus-visible,.x:focus-visible{outline:2px solid var(--blue);outline-offset:2px}
.win{position:relative;display:grid;grid-template-columns:240px 1fr;height:800px;overflow:hidden;background:var(--win)}
.as:not(.is-embed) .win{height:calc(100svh - 64px);min-height:640px;margin:0;border-top:1px solid var(--line)}
.side{background:var(--side);border-right:1px solid var(--line);padding:12px 10px;display:flex;flex-direction:column;gap:2px;font-size:13px}
.lights{display:flex;gap:7px;margin:2px 4px 12px}.lights i{width:11px;height:11px;border-radius:50%;background:#ff5f57}.lights i:nth-child(2){background:#febc2e}.lights i:nth-child(3){background:#28c840}
.newtab{background:#fff;border:1px solid var(--line);border-radius:8px;padding:7px 10px;color:var(--mut);margin-bottom:10px}
.grp{margin:12px 6px 4px;font-size:11.5px;color:var(--mut);font-weight:600;display:flex;justify-content:space-between}.grp em{font-style:normal}
.tab{padding:6px 8px;border-radius:7px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;color:#3a3a3c}
.tab.on{background:#fff;box-shadow:0 0 0 1px var(--line);font-weight:600}.tab.ag{color:var(--blue)}.tab.warn{color:var(--warn);font-weight:600}
.task{display:flex;flex-direction:column;min-height:0;padding:22px 28px;overflow:auto}
.th{display:flex;justify-content:space-between;gap:24px;align-items:flex-start;margin-bottom:18px}
h1{font-size:20px;margin:0 0 4px;letter-spacing:-.01em}.th p{margin:0;font-size:13px;color:var(--mut)}
.prog{width:200px;font-size:12.5px;color:var(--mut);text-align:right}.bar{height:6px;background:#efeee9;border-radius:3px;margin-top:6px;overflow:hidden}.bar i{display:block;height:100%;background:var(--ink);transition:width 400ms var(--ease)}
.cols{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1.25fr);gap:24px;flex:1}
h2{font-size:14px;margin:0}
.log ol{list-style:none;margin:12px 0;padding:0;display:flex;flex-direction:column;gap:8px;font-size:13.5px}
.log li::before{display:inline-block;width:20px;color:var(--mut)}
.log li.ok::before{content:"✓";color:var(--ok)}.log li.run::before{content:"◌";color:var(--blue)}.log li.wait::before{content:"⏸"}
.log li.run{color:var(--blue)}
.sm{font-size:12.5px;color:var(--mut);margin:8px 0 0;line-height:1.45}
.comp{margin-top:18px;border:1px solid var(--line);border-radius:10px;padding:10px 12px;display:flex;justify-content:space-between;color:var(--mut);font-size:13px}
kbd{font-family:inherit;font-size:11px;border:1px solid var(--line);border-radius:4px;padding:0 5px}
.lane{border:1px solid var(--line);border-radius:14px;padding:16px;background:#fbfbfa;align-self:start;animation:in 220ms var(--ease)}
.lh{display:flex;justify-content:space-between;align-items:center;margin-bottom:10px}.lh.mt{margin-top:18px}
.pill{font-size:12px;font-weight:600;padding:2px 8px;border-radius:999px;background:#efeee9}.pill.ok{background:var(--okbg);color:var(--ok)}.pill.warn{background:var(--warnbg);color:var(--warn)}
.drafts{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:6px}
.drafts li{position:relative;border:1px solid var(--line);border-radius:10px;background:#fff}
.drafts li.skip{opacity:.45}.drafts li.skip .who b{text-decoration:line-through}
.dh{all:unset;cursor:pointer;display:flex;align-items:center;gap:10px;padding:9px 64px 9px 10px;width:100%;box-sizing:border-box}
.av{width:28px;height:28px;border-radius:50%;background:#e7e5df;font-size:11px;font-weight:700;display:grid;place-items:center;flex:none}
.who{display:flex;flex-direction:column;font-size:13px;flex:1;min-width:0}.who em{font-style:normal;color:var(--mut);font-size:12px}
.via{font-size:11.5px;color:var(--mut)}
.x{all:unset;cursor:pointer;position:absolute;right:10px;top:13px;font-size:12px;color:var(--mut)}
.body{padding:0 12px 10px 48px;font-size:13px;line-height:1.5;animation:in 200ms var(--ease)}.body p{margin:0}.src{color:var(--mut);font-size:11.5px;margin-top:6px!important}
.acts{display:flex;gap:8px;flex-wrap:wrap;margin-top:12px}
.b{all:unset;cursor:pointer;font-size:13px;font-weight:600;padding:7px 13px;border-radius:8px;border:1px solid var(--line);background:#fff;transition:transform 160ms var(--ease)}
.b:active{transform:scale(.97)}.b.primary{background:var(--ink);color:#fff;border-color:var(--ink)}
.block{border:1px solid #f1d29b;background:var(--warnbg);border-radius:10px;padding:12px;font-size:13px}.block p{margin:4px 0 0;color:#5c3a00}
.sent{list-style:none;margin:0;padding:0;font-size:13px;display:flex;flex-direction:column;gap:6px}.sent li{display:flex;justify-content:space-between}.sent em{font-style:normal;color:var(--mut);font-size:12px}
.sum{margin:0;display:flex;flex-direction:column;gap:10px;font-size:13px}.sum dt{color:var(--mut);font-size:12px}.sum dd{margin:2px 0 0}
.toast{position:absolute;left:50%;bottom:22px;transform:translateX(-50%);background:var(--ink);color:#fff;font-size:13px;padding:10px 14px;border-radius:10px;animation:up 260ms var(--ease)}
.credit{margin:10px 16px;font-size:11px;color:var(--mut)}
@keyframes in{from{opacity:0;transform:translateY(-4px)}}
@keyframes up{from{opacity:0;transform:translate(-50%,10px)}}
@media (prefers-reduced-motion:reduce){.lane,.body,.toast{animation:none}.bar i,.b{transition:none}}
`;
