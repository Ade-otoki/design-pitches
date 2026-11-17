"use client";

// Concept prototype: "Attention Queue" for cmux.
// Independent concept by Daniel Ade-Otoki. Not cmux's official UI, not affiliated with cmux.
// Built on what cmux documents publicly: vertical tabs with branch/PR/ports, blue notification rings on panes that need input,
// a notification panel, Cmd+Shift+U to jump to the latest unread, and `cmux notify` from agent hooks.
// Dark, native-macOS-terminal styling with a blue attention accent. No cmux logo. Repos, agents and output are fictional.

import { useEffect, useState } from "react";

type Scenario = "queue" | "answer" | "clear";
type Item = { id: string; ws: string; agent: string; kind: "permission" | "question" | "failed"; title: string; body: string; waiting: string };
const ITEMS: Item[] = [
  { id: "a", ws: "api · fix-refunds", agent: "Claude Code", kind: "permission", title: "Run: npm run db:migrate", body: "Wants to apply 1 migration to the local database.", waiting: "6 min" },
  { id: "b", ws: "web · checkout-copy", agent: "OpenCode", kind: "question", title: "Keep the old button label?", body: "“Pay now” is used in 3 tests. Rename them too, or keep the label?", waiting: "4 min" },
  { id: "c", ws: "infra · bump-node", agent: "Claude Code", kind: "failed", title: "Tests failed: 2 of 148", body: "node 22 changed fetch timeouts in 2 integration tests.", waiting: "1 min" },
];
const KIND = { permission: "Needs permission", question: "Asked you", failed: "Stopped: tests failed" } as const;

export default function CmuxAttentionQueue() {
  const [scenario, setScenario] = useState<Scenario>("queue");
  const [embed, setEmbed] = useState(false);
  const [done, setDone] = useState<string[]>([]);
  const [toast, setToast] = useState<string | null>(null);
  function apply(s: Scenario) { setScenario(s); setToast(null); setDone(s === "clear" ? ["a", "b", "c"] : s === "answer" ? ["a"] : []); }

  useEffect(() => {
    const q = new URLSearchParams(window.location.search);
    const s = q.get("scenario") as Scenario | null;
    if (s && ["queue", "answer", "clear"].includes(s)) apply(s);
    setEmbed(q.get("embed") === "1");
    if (q.get("sync") !== "1" || typeof BroadcastChannel === "undefined") return;
    const c = new BroadcastChannel("cmux-attention-queue");
    c.onmessage = (e) => { if (e.data?.type === "scenario") apply(e.data.scenario); };
    return () => c.close();
  }, []);
  useEffect(() => { if (!toast) return; const t = setTimeout(() => setToast(null), 3800); return () => clearTimeout(t); }, [toast]);

  const open = ITEMS.filter((i) => !done.includes(i.id));
  const ring = (ws: string) => open.some((i) => i.ws === ws);
  function resolve(id: string, msg: string) { setDone([...done, id]); setToast(msg); }
  return (
    <div className={`cm ${embed ? "is-embed" : ""}`}>
      <style>{CSS}</style>
      <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap" />
      {!embed && (
        <div className="demo" role="group" aria-label="Concept demo">
          <span className="demo-l">Concept demo</span>
          {(["queue", "answer", "clear"] as Scenario[]).map((s, i) => (
            <button key={s} className={scenario === s ? "on" : ""} aria-pressed={scenario === s} onClick={() => apply(s)}>
              {i + 1}. {{ queue: "Who needs you, and why", answer: "Answer without switching", clear: "Back to flow" }[s]}
            </button>
          ))}
        </div>
      )}
      <div className="win">
        <div className="tbar"><span className="lights"><i /><i /><i /></span><span className="ttl">cmux</span></div>
        <div className="body">
          <aside className="tabs">
            {[["api · fix-refunds", "fix/refunds · PR #482 · :3000"], ["web · checkout-copy", "copy/checkout · :5173"], ["infra · bump-node", "chore/node22 · PR #91"], ["docs · readme", "main"]].map(([ws, sub]) => (
              <div key={ws} className={`tab ${ring(ws) ? "ring" : ""} ${ws.startsWith("api") ? "on" : ""}`}><b>{ws}</b><span>{sub}</span></div>
            ))}
          </aside>
          <main className="panes">
            <section className={`pane ${ring("api · fix-refunds") ? "ring" : ""}`}>
              <div className="ph">api · Claude Code</div>
              <pre>{`> fix the refund rounding bug and add a test
● Reading refunds/calc.py
● Edited refunds/calc.py (+6 −3)
● Added tests/test_refunds.py (+24)
${done.includes("a") ? "✓ Ran npm run db:migrate (1 applied)\n● Running tests…" : "? Allow: npm run db:migrate  [y/n]"}`}</pre>
            </section>
            <section className={`pane ${ring("web · checkout-copy") ? "ring" : ""}`}>
              <div className="ph">web · OpenCode</div>
              <pre>{`> update checkout copy to the new style guide
● Edited src/Checkout.tsx
${done.includes("b") ? "✓ Renamed label in 3 tests\n● Running vitest…" : "? “Pay now” is used in 3 tests. Rename them too?"}`}</pre>
            </section>
          </main>
          <aside className={`queue ${open.length ? "" : "empty"}`} aria-label="Attention queue">
            <div className="qh"><b>Needs you</b><span>{open.length ? `${open.length} waiting · oldest first` : "All clear"}</span></div>
            {open.length === 0 && <div className="clear">✓ No agent is waiting on you.<span>3 resolved in 2 min · next ring will show here</span></div>}
            {open.map((i) => (
              <div key={i.id} className={`item ${i.kind}`}>
                <div className="ih"><span className={`k ${i.kind}`}>{KIND[i.kind]}</span><span className="w">{i.waiting}</span></div>
                <b className="it">{i.title}</b>
                <p>{i.body}</p>
                <span className="src">{i.ws} · {i.agent}</span>
                <div className="acts">
                  {i.kind === "permission" && <><button className="b primary" onClick={() => resolve(i.id, "Allowed once · agent continued")}>Allow once</button><button className="b">Deny</button></>}
                  {i.kind === "question" && <><button className="b primary" onClick={() => resolve(i.id, "Sent: “Rename them too” · agent continued")}>Rename them too</button><button className="b" onClick={() => resolve(i.id, "Sent: “Keep the label” · agent continued")}>Keep label</button></>}
                  {i.kind === "failed" && <><button className="b primary" onClick={() => resolve(i.id, "Opened infra · bump-node at the failing test")}>Open pane</button><button className="b" onClick={() => resolve(i.id, "Asked the agent to fix the 2 tests")}>Ask agent to fix</button></>}
                </div>
              </div>
            ))}
            <div className="hint"><kbd>⌘⇧U</kbd> next · <kbd>⌘↩</kbd> primary action</div>
          </aside>
        </div>
        {toast && <div className="toast" role="status">✓ {toast}</div>}
      </div>
      {!embed && <p className="credit">Concept by Daniel Ade-Otoki · not cmux&apos;s official UI · fictional repos and agent output</p>}
    </div>
  );
}

const CSS = `
html,body{margin:0;background:#0b0c0f}
.cm{--bg:#101116;--pane:#0b0c0f;--side:#15161c;--line:#262832;--ink:#e8e9ee;--mut:#8b8f9c;--blue:#3b82f6;--bluebg:#0f1e38;--amber:#f5b041;--red:#f2555a;--green:#3ecf8e;--ease:cubic-bezier(.23,1,.32,1);
 font-family:Inter,system-ui,sans-serif;color:var(--ink);-webkit-font-smoothing:antialiased;min-height:100svh;background:#0b0c0f}
.cm *{box-sizing:border-box}
.demo{display:flex;gap:6px;align-items:center;flex-wrap:wrap;padding:8px 16px;border-bottom:1px dashed #333;font-size:13px}
.demo-l{font-size:11px;letter-spacing:.08em;text-transform:uppercase;color:var(--mut);margin-right:6px}
.demo button{all:unset;cursor:pointer;padding:5px 11px;border-radius:999px;border:1px solid var(--line);color:var(--ink)}
.demo button.on{background:var(--blue);border-color:var(--blue)}
.demo button:focus-visible,.b:focus-visible{outline:2px solid var(--blue);outline-offset:2px}
.win{position:relative;display:flex;flex-direction:column;height:800px;overflow:hidden;background:var(--bg)}
.cm:not(.is-embed) .win{height:calc(100svh - 64px);min-height:640px}
.tbar{display:flex;align-items:center;gap:12px;padding:9px 14px;border-bottom:1px solid var(--line);font-size:12.5px;color:var(--mut)}
.lights{display:flex;gap:7px}.lights i{width:11px;height:11px;border-radius:50%;background:#ff5f57}.lights i:nth-child(2){background:#febc2e}.lights i:nth-child(3){background:#28c840}
.ttl{flex:1;text-align:center;margin-right:60px}
.body{flex:1;display:grid;grid-template-columns:210px minmax(0,1fr) 320px;min-height:0}
.tabs{background:var(--side);border-right:1px solid var(--line);padding:10px 8px;display:flex;flex-direction:column;gap:4px}
.tab{padding:8px 10px;border-radius:8px;display:flex;flex-direction:column;gap:2px;font-size:12.5px;border:1px solid transparent}
.tab span{font-family:"JetBrains Mono",monospace;font-size:10.5px;color:var(--mut)}.tab.on{background:#1e2029}
.tab.ring{border-color:var(--blue);box-shadow:0 0 0 1px var(--blue)}
.panes{display:grid;grid-template-rows:1fr 1fr;gap:1px;background:var(--line);min-height:0}
.pane{background:var(--pane);display:flex;flex-direction:column;min-height:0;transition:box-shadow 200ms var(--ease)}
.pane.ring{box-shadow:inset 0 0 0 2px var(--blue)}
.ph{font-size:11.5px;color:var(--mut);padding:6px 12px;border-bottom:1px solid var(--line)}
pre{margin:0;padding:12px;font-family:"JetBrains Mono",monospace;font-size:12.5px;line-height:1.6;color:#cfd2db;white-space:pre-wrap}
.queue{border-left:1px solid var(--line);padding:12px;display:flex;flex-direction:column;gap:10px;overflow:auto;background:var(--side)}
.qh{display:flex;justify-content:space-between;align-items:baseline;font-size:13px}.qh span{color:var(--mut);font-size:12px}
.item{border:1px solid var(--line);border-radius:10px;padding:11px;background:#1a1b22;display:flex;flex-direction:column;gap:5px;animation:in 200ms var(--ease)}
.ih{display:flex;justify-content:space-between;align-items:center}
.k{font-size:11px;font-weight:700;padding:2px 7px;border-radius:5px}.k.permission{background:var(--bluebg);color:#8ab4ff}.k.question{background:#2d2410;color:var(--amber)}.k.failed{background:#331417;color:#ff9a9e}
.w{font-size:11.5px;color:var(--mut)}
.it{font-family:"JetBrains Mono",monospace;font-size:12.5px;font-weight:500}
.item p{margin:0;font-size:12.5px;color:#c3c6d0;line-height:1.45}
.src{font-size:11px;color:var(--mut)}
.acts{display:flex;gap:6px;margin-top:4px}
.b{all:unset;cursor:pointer;font-size:12.5px;font-weight:600;padding:6px 10px;border-radius:7px;border:1px solid var(--line);color:var(--ink);transition:transform 140ms var(--ease)}
.b:active{transform:scale(.97)}.b.primary{background:var(--blue);border-color:var(--blue);color:#fff}
.clear{border:1px solid #1d3b2c;background:#0f2219;color:var(--green);border-radius:10px;padding:12px;font-size:13px;font-weight:600;display:flex;flex-direction:column;gap:4px;animation:in 200ms var(--ease)}
.clear span{color:var(--mut);font-weight:400;font-size:12px}
.hint{margin-top:auto;font-size:11.5px;color:var(--mut)}
kbd{font-family:inherit;font-size:11px;border:1px solid var(--line);border-radius:4px;padding:0 5px}
.toast{position:absolute;left:50%;bottom:22px;transform:translateX(-50%);background:#e8e9ee;color:#0b0c0f;font-size:13px;padding:9px 14px;border-radius:8px;animation:up 240ms var(--ease)}
.credit{margin:10px 16px;font-size:11px;color:var(--mut)}
@keyframes in{from{opacity:0;transform:translateY(-4px)}}
@keyframes up{from{opacity:0;transform:translate(-50%,10px)}}
@media (prefers-reduced-motion:reduce){.item,.clear,.toast{animation:none}.b,.pane{transition:none}}
`;
