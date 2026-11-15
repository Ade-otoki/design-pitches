"use client";

// Concept prototype: "Payroll Preflight" for Bolto.
// Independent concept by Daniel Ade-Otoki. Not Bolto's official UI, not affiliated with Bolto.
// Bolto's product UI wasn't available to inspect, so this uses a neutral, modern business-software look
// (white surfaces, hairline borders, one blue accent, Inter). No Bolto logo. Company, people and amounts are fictional.

import { useEffect, useState } from "react";

type Scenario = "review" | "fixed" | "submitted";
type Issue = { id: string; who: string; what: string; why: string; fix: string; sev: "block" | "check" };
const ISSUES: Issue[] = [
  { id: "bank", who: "Leah Kim · new hire", what: "No bank account yet", why: "She can't be paid on 30 Nov without one.", fix: "Remind Leah, pay when ready", sev: "block" },
  { id: "raise", who: "Diego Alvarez", what: "Pay up 40% from last run", why: "A raise to $9,800/mo was entered on 12 Nov. Usually raises are under 15%.", fix: "Confirm raise", sev: "check" },
  { id: "term", who: "Sam Patel · leaving 22 Nov", what: "Full month's pay included", why: "Final pay should be prorated to 22 Nov and include unused PTO (3 days).", fix: "Prorate final pay", sev: "block" },
];
const f = (n: number) => `$${n.toLocaleString("en-US")}`;

export default function BoltoPreflight() {
  const [scenario, setScenario] = useState<Scenario>("review");
  const [embed, setEmbed] = useState(false);
  const [done, setDone] = useState<string[]>([]);
  const [toast, setToast] = useState<string | null>(null);
  function apply(s: Scenario) { setScenario(s); setDone(s === "review" ? [] : ISSUES.map((i) => i.id)); setToast(null); }

  useEffect(() => {
    const q = new URLSearchParams(window.location.search);
    const s = q.get("scenario") as Scenario | null;
    if (s && ["review", "fixed", "submitted"].includes(s)) apply(s);
    setEmbed(q.get("embed") === "1");
    if (q.get("sync") !== "1" || typeof BroadcastChannel === "undefined") return;
    const c = new BroadcastChannel("bolto-preflight");
    c.onmessage = (e) => { if (e.data?.type === "scenario") apply(e.data.scenario); };
    return () => c.close();
  }, []);
  useEffect(() => { if (!toast) return; const t = setTimeout(() => setToast(null), 4200); return () => clearTimeout(t); }, [toast]);

  const open = ISSUES.filter((i) => !done.includes(i.id));
  const blocks = open.filter((i) => i.sev === "block").length;
  const total = done.includes("term") ? 148_320 : 150_870;
  function fix(i: Issue) {
    const next = [...done, i.id]; setDone(next);
    setToast({ bank: "Reminder sent · Leah is paid as soon as she adds an account", raise: "Raise confirmed by you · noted in the audit log", term: "Final pay prorated to 22 Nov · 3 PTO days added" }[i.id]!);
    if (next.length === ISSUES.length) setTimeout(() => setScenario("fixed"), 900);
  }

  return (
    <div className={`bo ${embed ? "is-embed" : ""}`}>
      <style>{CSS}</style>
      <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" />
      {!embed && (
        <div className="demo" role="group" aria-label="Concept demo">
          <span className="demo-l">Concept demo</span>
          {(["review", "fixed", "submitted"] as Scenario[]).map((s, i) => (
            <button key={s} className={scenario === s ? "on" : ""} aria-pressed={scenario === s} onClick={() => apply(s)}>
              {i + 1}. {{ review: "What needs attention", fixed: "Ready, with no surprises", submitted: "What happens next" }[s]}
            </button>
          ))}
        </div>
      )}
      <div className="app">
        <aside className="nav">
          <div className="org"><span className="av">NR</span><div><b>Northwind Robotics</b><span>42 people · 3 countries</span></div></div>
          {["Home", "Hiring", "People", "Payroll", "Time off", "Benefits", "Documents", "Settings"].map((n) => <span key={n} className={`ni ${n === "Payroll" ? "on" : ""}`}>{n}</span>)}
        </aside>
        <main className="main">
          <div className="crumb">Payroll / November 2026</div>
          <header className="hd">
            <div><h1>November payroll</h1><p>Pay date <b>Mon 30 Nov</b> · submit by <b>Wed 25 Nov, 5pm PT</b> for on-time pay</p></div>
            <div className={`state ${scenario === "submitted" ? "ok" : blocks ? "bad" : "ok"}`}>{scenario === "submitted" ? "Submitted" : blocks ? `${blocks} must be fixed` : open.length ? `${open.length} to check` : "Ready to submit"}</div>
          </header>

          <div className="cols">
            <section>
              {scenario !== "submitted" && (
                <>
                  <h2>Since last payroll</h2>
                  <ul className="chg">
                    <li><b>+2</b> new hires</li><li><b>1</b> leaving</li><li><b>1</b> raise</li><li><b>3</b> contractors in Mexico and Poland</li>
                  </ul>
                  <h2 className="mt">Needs attention</h2>
                  {open.length === 0 && <div className="clear">✓ Nothing needs attention. Every change since October was checked.</div>}
                  <ul className="iss">
                    {open.map((i) => (
                      <li key={i.id} className={i.sev}>
                        <span className={`tag ${i.sev}`}>{i.sev === "block" ? "Must fix" : "Check"}</span>
                        <div className="txt"><b>{i.what}</b><span className="who">{i.who}</span><p>{i.why}</p></div>
                        <button className="b" onClick={() => fix(i)}>{i.fix}</button>
                      </li>
                    ))}
                  </ul>
                </>
              )}
              {scenario === "submitted" && (
                <>
                  <h2>What happens next</h2>
                  <ol className="tl">
                    <li className="ok"><b>Submitted</b><span>Today · by you</span></li>
                    <li><b>{f(total)} debited</b><span>Thu 26 Nov · from Chase ••7710</span></li>
                    <li><b>Contractors paid in MXN and PLN</b><span>Fri 27 Nov · rate locked at submission</span></li>
                    <li><b>Employees paid · payslips sent</b><span>Mon 30 Nov · 38 people</span></li>
                    <li><b>Leah Kim paid</b><span>When she adds a bank account · we&apos;ll remind her daily</span></li>
                  </ol>
                  <p className="sm">You can cancel until Wed 25 Nov, 5pm PT. After that, changes are made as an off-cycle run.</p>
                </>
              )}
            </section>

            <aside className="sum">
              <h3>Total cost</h3>
              <div className="big">{f(total)}</div>
              <dl>
                <div><dt>Employees (39)</dt><dd>{f(total - 21_400 - 18_870)}</dd></div>
                <div><dt>Contractors (3)</dt><dd>{f(21_400)}</dd></div>
                <div><dt>Employer taxes</dt><dd>{f(18_870)}</dd></div>
              </dl>
              <p className="delta">{total === 150_870 ? "+$4,210 vs October" : "+$1,660 vs October"} <span>· new hires, raise{total === 150_870 ? ", full pay for Sam" : ""}</span></p>
              {scenario !== "submitted" ? (
                <button className="b primary wide" disabled={blocks > 0} onClick={() => apply("submitted")}>{blocks ? `Fix ${blocks} to submit` : "Submit payroll"}</button>
              ) : (
                <button className="b wide" onClick={() => setToast("Payroll report downloaded")}>Download report</button>
              )}
              <p className="sm">{scenario === "submitted" ? "Bank balance checked: enough for the debit." : "We check the bank balance before you submit."}</p>
            </aside>
          </div>
        </main>
        {toast && <div className="toast" role="status">✓ {toast}</div>}
      </div>
      {!embed && <p className="credit">Concept by Daniel Ade-Otoki · not Bolto&apos;s official UI · fictional company, people and amounts</p>}
    </div>
  );
}

const CSS = `
html,body{margin:0;background:#fff}
.bo{--ink:#111827;--mut:#6b7280;--line:#e5e7eb;--soft:#f9fafb;--acc:#2f5bea;--accl:#eef2ff;--ok:#047857;--okbg:#ecfdf5;--bad:#b91c1c;--badbg:#fef2f2;--chk:#92400e;--chkbg:#fffbeb;--ease:cubic-bezier(.23,1,.32,1);
 font-family:Inter,system-ui,sans-serif;color:var(--ink);-webkit-font-smoothing:antialiased}
.bo *{box-sizing:border-box}
.demo{display:flex;gap:6px;align-items:center;flex-wrap:wrap;padding:8px 16px;border-bottom:1px dashed #ccc;font-size:13px}
.demo-l{font-size:11px;letter-spacing:.08em;text-transform:uppercase;color:var(--mut);margin-right:6px}
.demo button{all:unset;cursor:pointer;padding:5px 11px;border-radius:999px;border:1px solid var(--line)}
.demo button.on{background:var(--acc);color:#fff;border-color:var(--acc)}
.demo button:focus-visible,.b:focus-visible{outline:2px solid var(--acc);outline-offset:2px}
.app{position:relative;display:grid;grid-template-columns:220px 1fr;height:800px;overflow:hidden}
.bo:not(.is-embed) .app{height:calc(100svh - 64px);min-height:640px}
.nav{display:flex;flex-direction:column;gap:1px;padding:16px 12px;border-right:1px solid var(--line);background:var(--soft);font-size:13.5px}
.org{display:flex;gap:9px;align-items:center;margin-bottom:16px}.org div{display:flex;flex-direction:column;font-size:11.5px;color:var(--mut)}.org b{font-size:13px;color:var(--ink)}
.av{width:28px;height:28px;border-radius:7px;background:var(--ink);color:#fff;font-size:10px;font-weight:700;display:grid;place-items:center}
.ni{padding:7px 9px;border-radius:7px;color:#374151}.ni.on{background:#fff;box-shadow:0 0 0 1px var(--line);font-weight:600;color:var(--ink)}
.main{overflow:auto;padding:18px 32px 32px}
.crumb{font-size:12.5px;color:var(--mut);margin-bottom:6px}
.hd{display:flex;justify-content:space-between;align-items:flex-start;gap:20px;margin-bottom:22px}
h1{font-size:22px;margin:0 0 4px;letter-spacing:-.01em}.hd p{margin:0;font-size:13.5px;color:var(--mut)}.hd p b{color:var(--ink)}
.state{font-size:12.5px;font-weight:600;padding:5px 10px;border-radius:999px}.state.bad{background:var(--badbg);color:var(--bad)}.state.ok{background:var(--okbg);color:var(--ok)}
.cols{display:grid;grid-template-columns:minmax(0,1fr) 290px;gap:28px}
h2{font-size:15px;margin:0 0 10px}.mt{margin-top:22px}
.chg{list-style:none;margin:0;padding:0;display:flex;gap:8px;flex-wrap:wrap;font-size:13px}.chg li{border:1px solid var(--line);border-radius:999px;padding:4px 10px;color:#374151}
.iss{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:8px}
.iss li{display:grid;grid-template-columns:auto 1fr auto;gap:12px;align-items:start;border:1px solid var(--line);border-radius:10px;padding:12px 14px;animation:in 220ms var(--ease)}
.iss li.block{border-color:#fecaca}
.tag{font-size:11px;font-weight:700;padding:2px 7px;border-radius:5px;margin-top:2px}.tag.block{background:var(--badbg);color:var(--bad)}.tag.check{background:var(--chkbg);color:var(--chk)}
.txt{display:flex;flex-direction:column;font-size:13.5px}.who{color:var(--mut);font-size:12.5px}.txt p{margin:4px 0 0;font-size:13px;color:#374151;line-height:1.45}
.clear{background:var(--okbg);color:var(--ok);border-radius:10px;padding:12px 14px;font-size:13.5px;font-weight:600;animation:in 220ms var(--ease)}
.b{all:unset;cursor:pointer;font-size:13px;font-weight:600;padding:7px 12px;border-radius:8px;border:1px solid var(--line);background:#fff;white-space:nowrap;transition:transform 160ms var(--ease)}
.b:active{transform:scale(.97)}.b.primary{background:var(--acc);color:#fff;border-color:var(--acc)}
.b[disabled]{cursor:not-allowed;background:#e5e7eb;color:#6b7280;border-color:#e5e7eb}.b[disabled]:active{transform:none}
.b.wide{display:block;text-align:center;margin-top:14px}
.sum{border:1px solid var(--line);border-radius:12px;padding:16px;align-self:start}
.sum h3{margin:0;font-size:13px;color:var(--mut);font-weight:600}.big{font-size:28px;font-weight:700;letter-spacing:-.02em;margin:4px 0 12px}
.sum dl{margin:0;display:flex;flex-direction:column;gap:6px;font-size:13px}.sum dl div{display:flex;justify-content:space-between}.sum dt{color:var(--mut)}.sum dd{margin:0}
.delta{font-size:12.5px;margin:12px 0 0;font-weight:600}.delta span{font-weight:400;color:var(--mut)}
.sm{font-size:12px;color:var(--mut);margin:10px 0 0;line-height:1.45}
.tl{list-style:none;margin:0;padding:0 0 0 18px;border-left:2px solid var(--line);display:flex;flex-direction:column;gap:16px}
.tl li{position:relative;display:flex;flex-direction:column;font-size:13.5px}.tl li span{color:var(--mut);font-size:12.5px}
.tl li::before{content:"";position:absolute;left:-25px;top:4px;width:10px;height:10px;border-radius:50%;background:#fff;border:2px solid #9ca3af}.tl li.ok::before{background:var(--ok);border-color:var(--ok)}
.toast{position:absolute;left:50%;bottom:22px;transform:translateX(-50%);background:var(--ink);color:#fff;font-size:13px;padding:10px 14px;border-radius:8px;animation:up 260ms var(--ease)}
.credit{margin:10px 16px;font-size:11px;color:var(--mut)}
@keyframes in{from{opacity:0;transform:translateY(-4px)}}
@keyframes up{from{opacity:0;transform:translate(-50%,10px)}}
@media (prefers-reduced-motion:reduce){.iss li,.clear,.toast{animation:none}.b{transition:none}}
`;
