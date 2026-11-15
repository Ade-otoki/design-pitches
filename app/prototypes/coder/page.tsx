"use client";

// Concept prototype: "Workspace Check" for Coder Agents.
// Independent concept by Daniel Ade-Otoki. Not Coder's official UI, not affiliated with Coder.
// Visual language approximates Coder's dark dashboard (zinc greys, sky-blue accent, Inter). No Coder logo.
// Grounded in Coder's docs: the agent picks a template from descriptions; users "can also manually choose which workspace";
// follow-up messages "are queued and delivered when the agent completes its current step". Repo, templates and people are fictional.

import { useEffect, useState } from "react";

type Scenario = "pick" | "queued" | "ready";
const TEMPLATES = [
  { id: "py", name: "python-payments", why: "Matches “Python backend services in the payments repo”", net: "Payments VPC only", cost: "4 vCPU · 8 GB", pick: true },
  { id: "gen", name: "general-dev", why: "Default for any repo", net: "Open internet", cost: "2 vCPU · 4 GB", pick: false },
];

export default function CoderWorkspaceCheck() {
  const [scenario, setScenario] = useState<Scenario>("pick");
  const [embed, setEmbed] = useState(false);
  const [chosen, setChosen] = useState("py");
  const [open, setOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  function apply(s: Scenario) { setScenario(s); setToast(null); setOpen(false); setChosen("py"); }

  useEffect(() => {
    const q = new URLSearchParams(window.location.search);
    const s = q.get("scenario") as Scenario | null;
    if (s && ["pick", "queued", "ready"].includes(s)) apply(s);
    setEmbed(q.get("embed") === "1");
    if (q.get("sync") !== "1" || typeof BroadcastChannel === "undefined") return;
    const c = new BroadcastChannel("coder-workspace-check");
    c.onmessage = (e) => { if (e.data?.type === "scenario") apply(e.data.scenario); };
    return () => c.close();
  }, []);
  useEffect(() => { if (!toast) return; const t = setTimeout(() => setToast(null), 4200); return () => clearTimeout(t); }, [toast]);

  const t = TEMPLATES.find((x) => x.id === chosen)!;
  return (
    <div className={`cd ${embed ? "is-embed" : ""}`}>
      <style>{CSS}</style>
      <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap" />
      {!embed && (
        <div className="demo" role="group" aria-label="Concept demo">
          <span className="demo-l">Concept demo</span>
          {(["pick", "queued", "ready"] as Scenario[]).map((s, i) => (
            <button key={s} className={scenario === s ? "on" : ""} aria-pressed={scenario === s} onClick={() => apply(s)}>
              {i + 1}. {{ pick: "See the workspace it picked", queued: "Steer mid-step", ready: "Know what's ready" }[s]}
            </button>
          ))}
        </div>
      )}
      <div className="app">
        <aside className="nav">
          <div className="org"><span className="av">AC</span><b>acme</b></div>
          {["Agents", "Workspaces", "Templates", "Users", "Audit", "Deployment"].map((n) => <span key={n} className={`ni ${n === "Agents" ? "on" : ""}`}>{n}</span>)}
          <span className="sec">Chats</span>
          <span className="ni chat on2">Fix refund rounding bug</span>
          <span className="ni chat">Bump grpc to 1.66</span>
          <span className="ni chat">Add retries to webhook worker</span>
        </aside>
        <main className="main">
          <header className="hd"><b>Fix refund rounding bug</b><span className="mono">acme/payments · main</span></header>
          <div className="thread">
            <div className="msg me">Refunds over $1,000 round down by a cent. Find the cause, fix it and add a test.</div>
            <div className="msg ai">I&apos;ll reproduce it in a workspace, then trace the refund path in <span className="mono">refunds/calc.py</span>.</div>

            <section className={`wc ${scenario !== "pick" ? "done" : ""}`} aria-label="Workspace check">
              <div className="wch"><span className="lbl">Workspace</span>{scenario === "pick" ? <span className="pill wait">Starts in 10s</span> : <span className="pill ok">Running</span>}</div>
              <div className="tpl">
                <div><b className="mono">{t.name}</b><p>{t.why}</p></div>
                <dl><div><dt>Network</dt><dd>{t.net}</dd></div><div><dt>Size</dt><dd>{t.cost}</dd></div></dl>
              </div>
              {scenario === "pick" && (
                <>
                  {open && (
                    <div className="alts" role="radiogroup" aria-label="Choose a template">
                      {TEMPLATES.map((x) => (
                        <button key={x.id} role="radio" aria-checked={chosen === x.id} className={chosen === x.id ? "on" : ""} onClick={() => setChosen(x.id)}>
                          <b className="mono">{x.name}</b><span>{x.why} · {x.net}</span>
                        </button>
                      ))}
                      <button role="radio" aria-checked={false} onClick={() => setToast("Using your running workspace dev-maya · no new workspace started")}><b className="mono">dev-maya (running)</b><span>Your existing workspace · same repo</span></button>
                    </div>
                  )}
                  <div className="acts">
                    <button className="b primary" onClick={() => apply("queued")}>Start {t.name}</button>
                    <button className="b" onClick={() => setOpen(!open)} aria-expanded={open}>{open ? "Hide options" : "Use a different workspace"}</button>
                  </div>
                </>
              )}
            </section>

            {scenario !== "pick" && (
              <div className="steps" aria-label="Agent steps">
                <div className="st ok">✓ Workspace ready · 38s</div>
                <div className="st ok">✓ Reproduced: refund of $1,234.565 → $1,234.56</div>
                <div className={`st ${scenario === "queued" ? "run" : "ok"}`}>{scenario === "queued" ? "◌ Running test suite (2 of 4 min)" : "✓ Fixed: use Decimal with ROUND_HALF_UP · test added"}</div>
              </div>
            )}

            {scenario === "queued" && (
              <>
                <div className="msg me queued">Also check partial refunds.<span className="q">Queued · delivered after the test suite finishes (~2 min)</span></div>
                <div className="acts left">
                  <button className="b" onClick={() => setToast("Agent paused · your message is delivered now")}>Deliver now (pauses the tests)</button>
                  <button className="b ghost" onClick={() => setToast("Queued message removed")}>Remove</button>
                </div>
              </>
            )}
            {scenario === "ready" && (
              <div className="ready">
                <div className="rh"><b>Ready to review</b><span className="pill ok">Tests pass · 4 / 4</span></div>
                <ul>
                  <li><span className="mono">refunds/calc.py</span> <em>+6 −3</em></li>
                  <li><span className="mono">tests/test_refunds.py</span> <em>+24</em></li>
                </ul>
                <p className="sm">Workspace <span className="mono">python-payments</span> stops in 30 min if idle. Partial refunds checked too.</p>
                <div className="acts left"><button className="b primary" onClick={() => setToast("Pull request #482 opened as draft")}>Open draft PR</button><button className="b">Open in VS Code</button><button className="b ghost" onClick={() => setToast("Workspace stopped · chat history kept")}>Stop workspace</button></div>
              </div>
            )}
          </div>
          <div className="composer"><span>Message the agent…</span><kbd>⏎</kbd></div>
        </main>
        {toast && <div className="toast" role="status">✓ {toast}</div>}
      </div>
      {!embed && <p className="credit">Concept by Daniel Ade-Otoki · not Coder&apos;s official UI · fictional repo, templates and people</p>}
    </div>
  );
}

const CSS = `
html,body{margin:0;background:#09090b}
.cd{--bg:#09090b;--sf:#18181b;--sf2:#27272a;--line:#2e2e33;--ink:#fafafa;--mut:#a1a1aa;--sky:#38bdf8;--skyd:#0c4a6e;--ok:#4ade80;--okbg:#052e16;--wait:#fbbf24;--waitbg:#3a2a05;--ease:cubic-bezier(.23,1,.32,1);
 font-family:Inter,system-ui,sans-serif;color:var(--ink);background:var(--bg);-webkit-font-smoothing:antialiased;min-height:100svh}
.cd *{box-sizing:border-box}.mono{font-family:"JetBrains Mono",ui-monospace,monospace;font-size:.92em}
.demo{display:flex;gap:6px;align-items:center;flex-wrap:wrap;padding:8px 16px;border-bottom:1px dashed #3f3f46;font-size:13px}
.demo-l{font-size:11px;letter-spacing:.08em;text-transform:uppercase;color:var(--mut);margin-right:6px}
.demo button{all:unset;cursor:pointer;padding:5px 11px;border-radius:999px;border:1px solid var(--line);color:var(--ink)}
.demo button.on{background:var(--sky);color:#082f49;border-color:var(--sky)}
.demo button:focus-visible,.b:focus-visible,.alts button:focus-visible{outline:2px solid var(--sky);outline-offset:2px}
.app{position:relative;display:grid;grid-template-columns:230px 1fr;height:800px;overflow:hidden}
.cd:not(.is-embed) .app{height:calc(100svh - 64px);min-height:640px}
.nav{display:flex;flex-direction:column;gap:1px;padding:14px 10px;border-right:1px solid var(--line);font-size:13.5px;background:#0d0d10}
.org{display:flex;gap:9px;align-items:center;margin:0 4px 14px}
.av{width:24px;height:24px;border-radius:6px;background:var(--sf2);font-size:10px;font-weight:700;display:grid;place-items:center}
.ni{padding:6px 8px;border-radius:6px;color:var(--mut)}.ni.on{color:var(--ink);background:var(--sf)}
.ni.chat{white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.ni.on2{color:var(--ink);background:var(--sf2)}
.sec{margin:16px 8px 4px;font-size:11.5px;color:var(--mut);font-weight:600}
.main{display:flex;flex-direction:column;min-height:0}
.hd{display:flex;gap:12px;align-items:baseline;padding:14px 28px;border-bottom:1px solid var(--line);font-size:14px}.hd span{color:var(--mut)}
.thread{flex:1;overflow:auto;padding:22px 28px;display:flex;flex-direction:column;gap:14px;max-width:820px;width:100%;margin:0 auto}
.msg{font-size:14px;line-height:1.5;max-width:640px}
.msg.me{align-self:flex-end;background:var(--sf2);padding:10px 14px;border-radius:12px}
.msg.ai{color:#e4e4e7}
.msg.queued{opacity:.8;border:1px dashed #52525b;background:transparent;display:flex;flex-direction:column;gap:4px;animation:in 220ms var(--ease)}
.q{font-size:12px;color:var(--wait)}
.wc{border:1px solid var(--line);background:var(--sf);border-radius:12px;padding:14px;display:flex;flex-direction:column;gap:12px;animation:in 220ms var(--ease)}
.wc.done{padding:10px 14px}
.wch{display:flex;justify-content:space-between;align-items:center}.lbl{font-size:12px;color:var(--mut);text-transform:uppercase;letter-spacing:.06em}
.pill{font-size:12px;padding:2px 8px;border-radius:999px;font-weight:600}
.pill.wait{background:var(--waitbg);color:var(--wait)}.pill.ok{background:var(--okbg);color:var(--ok)}
.tpl{display:flex;justify-content:space-between;gap:16px;align-items:flex-start}
.tpl p{margin:4px 0 0;font-size:13px;color:var(--mut)}
dl{display:flex;gap:18px;margin:0;font-size:12.5px}dt{color:var(--mut)}dd{margin:2px 0 0}
.alts{display:flex;flex-direction:column;gap:6px;animation:in 200ms var(--ease)}
.alts button{all:unset;cursor:pointer;display:flex;flex-direction:column;gap:2px;padding:9px 12px;border:1px solid var(--line);border-radius:8px;font-size:13px}
.alts button span{color:var(--mut);font-size:12px}.alts button.on{border-color:var(--sky);background:#0b2233}
.acts{display:flex;gap:8px;flex-wrap:wrap}.acts.left{margin-top:-4px}
.b{all:unset;cursor:pointer;font-size:13px;font-weight:600;padding:7px 12px;border-radius:7px;border:1px solid var(--line);color:var(--ink);transition:transform 160ms var(--ease)}
.b:active{transform:scale(.97)}.b.primary{background:var(--sky);color:#082f49;border-color:var(--sky)}.b.ghost{border-color:transparent;color:var(--mut)}
.steps{display:flex;flex-direction:column;gap:6px;font-size:13px;font-family:"JetBrains Mono",monospace}
.st{color:var(--mut)}.st.ok{color:#d4d4d8}.st.run{color:var(--sky)}
.ready{border:1px solid #14532d;background:#06180d;border-radius:12px;padding:14px;display:flex;flex-direction:column;gap:10px;animation:in 220ms var(--ease)}
.rh{display:flex;justify-content:space-between;align-items:center}
.ready ul{margin:0;padding:0;list-style:none;font-size:13px;display:flex;flex-direction:column;gap:4px}.ready em{font-style:normal;color:var(--ok);margin-left:8px}
.sm{margin:0;font-size:12.5px;color:var(--mut)}
.composer{margin:0 28px 20px;max-width:820px;width:calc(100% - 56px);align-self:center;border:1px solid var(--line);border-radius:12px;padding:14px;display:flex;justify-content:space-between;color:var(--mut);font-size:14px;background:var(--sf)}
kbd{font-family:inherit;font-size:12px;border:1px solid var(--line);border-radius:4px;padding:0 5px}
.toast{position:absolute;left:50%;bottom:90px;transform:translateX(-50%);background:var(--ink);color:#09090b;font-size:13px;padding:10px 14px;border-radius:8px;animation:up 260ms var(--ease)}
.credit{margin:10px 16px;font-size:11px;color:var(--mut)}
@keyframes in{from{opacity:0;transform:translateY(-4px)}}
@keyframes up{from{opacity:0;transform:translate(-50%,10px)}}
@media (prefers-reduced-motion:reduce){.wc,.alts,.ready,.msg.queued,.toast{animation:none}.b{transition:none}}
`;
