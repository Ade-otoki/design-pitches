"use client";

// Concept prototype: "Global Pay Calendar" for Rippling Global Payroll.
// Independent concept by Daniel Ade-Otoki. Not Rippling's official UI, not affiliated with Rippling.
// Rippling's product UI wasn't available to inspect; this uses a clean business-software layout with a deep plum
// top bar and a warm yellow accent, approximating Rippling's brand colours. No Rippling logo.
// Company, people and amounts are fictional. Brazil's 20 Nov national holiday (Black Consciousness Day) is real.

import { useEffect, useState } from "react";

type Scenario = "calendar" | "holiday" | "funding";
type Run = { cc: string; flag: string; entity: string; people: number; payday: string; approveBy: string; status: "ready" | "action" | "done"; note: string; cur: string; amt: number };
const RUNS: Run[] = [
  { cc: "US", flag: "🇺🇸", entity: "Northwind Inc.", people: 64, payday: "Mon 30 Nov", approveBy: "Wed 25 Nov", status: "ready", note: "All set", cur: "USD", amt: 612400 },
  { cc: "GB", flag: "🇬🇧", entity: "Northwind UK Ltd", people: 18, payday: "Fri 27 Nov", approveBy: "Mon 23 Nov", status: "action", note: "2 starters missing NI numbers", cur: "GBP", amt: 121300 },
  { cc: "BR", flag: "🇧🇷", entity: "Northwind Brasil Ltda", people: 11, payday: "Tue 24 Nov", approveBy: "Wed 18 Nov", status: "action", note: "Approve by tomorrow: 20 Nov is a holiday", cur: "BRL", amt: 286500 },
  { cc: "IN", flag: "🇮🇳", entity: "Northwind India Pvt", people: 27, payday: "Mon 30 Nov", approveBy: "Wed 25 Nov", status: "ready", note: "All set", cur: "INR", amt: 4785000 },
  { cc: "DE", flag: "🇩🇪", entity: "EOR · Germany", people: 4, payday: "Fri 27 Nov", approveBy: "Fri 20 Nov", status: "done", note: "Approved by you, 16 Nov", cur: "EUR", amt: 31200 },
];
const DAYS = ["Mon 16", "Tue 17", "Wed 18", "Thu 19", "Fri 20", "Mon 23", "Tue 24", "Wed 25", "Thu 26", "Fri 27", "Mon 30"];
const col = (d: string) => DAYS.findIndex((x) => d.includes(x.split(" ")[1]) && d.startsWith(x.split(" ")[0]));
const money = (c: string, n: number) => new Intl.NumberFormat("en-US", { style: "currency", currency: c, maximumFractionDigits: 0 }).format(n);

export default function RipplingPayCalendar() {
  const [scenario, setScenario] = useState<Scenario>("calendar");
  const [embed, setEmbed] = useState(false);
  const [sel, setSel] = useState("BR");
  const [toast, setToast] = useState<string | null>(null);
  function apply(s: Scenario) { setScenario(s); setToast(null); setSel(s === "funding" ? "US" : "BR"); }

  useEffect(() => {
    const q = new URLSearchParams(window.location.search);
    const s = q.get("scenario") as Scenario | null;
    if (s && ["calendar", "holiday", "funding"].includes(s)) apply(s);
    setEmbed(q.get("embed") === "1");
    if (q.get("sync") !== "1" || typeof BroadcastChannel === "undefined") return;
    const c = new BroadcastChannel("rippling-pay-calendar");
    c.onmessage = (e) => { if (e.data?.type === "scenario") apply(e.data.scenario); };
    return () => c.close();
  }, []);
  useEffect(() => { if (!toast) return; const t = setTimeout(() => setToast(null), 4200); return () => clearTimeout(t); }, [toast]);

  const r = RUNS.find((x) => x.cc === sel)!;
  const needs = RUNS.filter((x) => x.status === "action").length;
  return (
    <div className={`rp ${embed ? "is-embed" : ""}`}>
      <style>{CSS}</style>
      <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" />
      {!embed && (
        <div className="demo" role="group" aria-label="Concept demo">
          <span className="demo-l">Concept demo</span>
          {(["calendar", "holiday", "funding"] as Scenario[]).map((s, i) => (
            <button key={s} className={scenario === s ? "on" : ""} aria-pressed={scenario === s} onClick={() => apply(s)}>
              {i + 1}. {{ calendar: "Every country, one view", holiday: "Why a date moved", funding: "Fund it on time" }[s]}
            </button>
          ))}
        </div>
      )}
      <div className="app">
        <header className="bar"><span className="logo">◆ Northwind</span><span className="srch">Search people, apps, settings</span><span className="me">DA</span></header>
        <div className="body">
          <aside className="nav">
            {["Home", "People", "Payroll", "Global payroll", "Time", "Spend", "IT", "Reports"].map((n) => <span key={n} className={`ni ${n === "Global payroll" ? "on" : ""}`}>{n}</span>)}
          </aside>
          <main className="main">
            <div className="hd">
              <div><h1>November pay runs</h1><p>5 countries · 124 people · pay dates 24–30 Nov</p></div>
              <span className={`state ${needs ? "warn" : "ok"}`}>{needs ? `${needs} need you before their approve-by date` : "All on track"}</span>
            </div>

            {scenario !== "funding" ? (
              <section className="cal" aria-label="Pay calendar">
                <div className="row head"><span />{DAYS.map((d) => <span key={d} className={d === "Fri 20" ? "hol" : ""}>{d}{d === "Fri 20" ? " · BR holiday" : ""}</span>)}</div>
                {RUNS.map((x) => {
                  const a = col(x.approveBy), p = col(x.payday);
                  return (
                    <button key={x.cc} className={`row run ${sel === x.cc ? "sel" : ""}`} onClick={() => setSel(x.cc)} aria-label={`${x.entity}: approve by ${x.approveBy}, payday ${x.payday}`}>
                      <span className="who"><b>{x.flag} {x.cc}</b><em>{x.people} people</em></span>
                      {DAYS.map((d, i) => (
                        <span key={d} className="cell">
                          {i === a && <i className={`mk ap ${x.status}`}>{x.status === "done" ? "✓" : "Approve"}</i>}
                          {i === p && <i className="mk pd">Payday</i>}
                          {i > a && i < p && <i className="ln" />}
                        </span>
                      ))}
                    </button>
                  );
                })}
              </section>
            ) : (
              <section className="fund" aria-label="Funding plan">
                <h2>Funding plan</h2>
                <p className="sub">Each currency must reach Rippling before its debit date for on-time pay.</p>
                <table>
                  <thead><tr><th>Currency</th><th>Amount</th><th>Debit date</th><th>From</th><th>Status</th></tr></thead>
                  <tbody>
                    {RUNS.map((x) => (
                      <tr key={x.cc}>
                        <td>{x.flag} {x.cur}</td><td>{money(x.cur, x.amt)}</td>
                        <td>{x.cc === "BR" ? "Thu 19 Nov" : x.cc === "DE" ? "Mon 23 Nov" : x.cc === "GB" ? "Tue 24 Nov" : "Thu 26 Nov"}</td>
                        <td>{x.cur === "USD" ? "Chase ••7710" : x.cc === "BR" ? "USD → BRL at submit" : `Wise ${x.cur} ••${x.cc === "GB" ? "2201" : x.cc === "IN" ? "9930" : "4512"}`}</td>
                        <td>{x.cc === "BR" ? <span className="tag warn">Balance short</span> : <span className="tag ok">Covered</span>}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </section>
            )}
          </main>

          <aside className="side">
            {scenario === "calendar" && (
              <div className="card">
                <h3>{r.flag} {r.entity}</h3>
                <dl><div><dt>Approve by</dt><dd>{r.approveBy}, 5pm local</dd></div><div><dt>Payday</dt><dd>{r.payday}</dd></div><div><dt>Total</dt><dd>{money(r.cur, r.amt)}</dd></div></dl>
                <div className={`msg ${r.status}`}>{r.note}</div>
                {r.cc === "GB" && <button className="b primary" onClick={() => setToast("Reminder sent to Ana and Tom to add NI numbers")}>Ask starters for NI numbers</button>}
                {r.cc === "BR" && <button className="b primary" onClick={() => apply("holiday")}>See why it moved</button>}
                {r.status === "ready" && <button className="b primary" onClick={() => setToast(`${r.cc} pay run approved · ${r.payday}`)}>Review and approve</button>}
              </div>
            )}
            {scenario === "holiday" && (
              <div className="card">
                <h3>🇧🇷 Why Brazil moved earlier</h3>
                <p>In this example, approval needs <b>3 business days</b> before payday. Fri 20 Nov is Brazil&apos;s Black Consciousness Day, a national holiday, so the deadline moves from Thu 19 to <b>Wed 18 Nov</b>, tomorrow.</p>
                <ol className="tl"><li><b>Wed 18 Nov</b> Approve by 5pm BRT</li><li><b>Thu 19 Nov</b> BRL funds debited</li><li><b>Tue 24 Nov</b> 11 people paid</li></ol>
                <p className="sm">Your other countries aren&apos;t affected. Approving now leaves time to fix anything.</p>
                <button className="b primary" onClick={() => setToast("Brazil pay run approved · 11 people paid Tue 24 Nov")}>Review and approve Brazil</button>
              </div>
            )}
            {scenario === "funding" && (
              <div className="card">
                <h3>BRL is short R$ 41,200</h3>
                <p>Convert from USD when you approve, or top up your BRL account by Thu 19 Nov.</p>
                <button className="b primary" onClick={() => setToast("BRL will be converted from USD when you approve · rate shown before you confirm")}>Convert from USD at submit</button>
                <p className="sm">Other currencies are covered. Rate is locked when you approve.</p>
              </div>
            )}
          </aside>
        </div>
        {toast && <div className="toast" role="status">✓ {toast}</div>}
      </div>
      {!embed && <p className="credit">Concept by Daniel Ade-Otoki · not Rippling&apos;s official UI · fictional company, people and amounts</p>}
    </div>
  );
}

const CSS = `
html,body{margin:0;background:#fff}
.rp{--plum:#4a1f3a;--plum2:#6b2d54;--yel:#f8b51b;--ink:#1f1a1d;--mut:#6b6468;--line:#e7e3e5;--soft:#faf8f9;--ok:#1f7a4c;--okbg:#e8f5ee;--warn:#9a5b00;--warnbg:#fff4dc;--ease:cubic-bezier(.23,1,.32,1);
 font-family:Inter,system-ui,sans-serif;color:var(--ink);-webkit-font-smoothing:antialiased}
.rp *{box-sizing:border-box}
.demo{display:flex;gap:6px;align-items:center;flex-wrap:wrap;padding:8px 16px;border-bottom:1px dashed #ccc;font-size:13px}
.demo-l{font-size:11px;letter-spacing:.08em;text-transform:uppercase;color:var(--mut);margin-right:6px}
.demo button{all:unset;cursor:pointer;padding:5px 11px;border-radius:999px;border:1px solid var(--line)}
.demo button.on{background:var(--plum);color:#fff;border-color:var(--plum)}
.demo button:focus-visible,.b:focus-visible,.run:focus-visible{outline:2px solid var(--plum2);outline-offset:2px}
.app{position:relative;display:flex;flex-direction:column;height:800px;overflow:hidden}
.rp:not(.is-embed) .app{height:calc(100svh - 64px);min-height:640px}
.bar{display:flex;align-items:center;gap:20px;background:var(--plum);color:#fff;padding:10px 18px;font-size:13px}
.logo{font-weight:700}.srch{flex:1;max-width:420px;background:rgba(255,255,255,.12);border-radius:6px;padding:6px 10px;color:#e9d9e3}
.me{margin-left:auto;width:26px;height:26px;border-radius:50%;background:var(--yel);color:var(--plum);font-weight:700;font-size:11px;display:grid;place-items:center}
.body{flex:1;display:grid;grid-template-columns:190px minmax(0,1fr) 280px;min-height:0}
.nav{display:flex;flex-direction:column;gap:1px;padding:14px 10px;border-right:1px solid var(--line);font-size:13.5px;background:var(--soft)}
.ni{padding:7px 9px;border-radius:6px;color:#4b4448}.ni.on{background:#fff;box-shadow:0 0 0 1px var(--line);font-weight:600;color:var(--plum)}
.main{overflow:auto;padding:20px 24px}
.hd{display:flex;justify-content:space-between;gap:16px;align-items:flex-start;margin-bottom:18px}
h1{font-size:21px;margin:0 0 4px}.hd p{margin:0;font-size:13px;color:var(--mut)}
.state{font-size:12.5px;font-weight:600;padding:5px 10px;border-radius:999px;white-space:nowrap}.state.warn{background:var(--warnbg);color:var(--warn)}.state.ok{background:var(--okbg);color:var(--ok)}
.cal{border:1px solid var(--line);border-radius:10px;overflow:hidden;animation:in 220ms var(--ease)}
.row{display:grid;grid-template-columns:96px repeat(11,minmax(0,1fr));align-items:center;font-size:11.5px}
.row.head{background:var(--soft);color:var(--mut);border-bottom:1px solid var(--line)}.row.head span{padding:8px 4px;text-align:center}
.row.head .hol{background:#fdeeee;color:#a3283a;font-weight:600}
.run{all:unset;box-sizing:border-box;width:100%;cursor:pointer;display:grid;grid-template-columns:96px repeat(11,minmax(0,1fr));align-items:center;border-bottom:1px solid var(--line);min-height:52px;transition:background 160ms var(--ease)}
.run:last-child{border-bottom:0}.run:hover{background:#fcfafb}.run.sel{background:#f6eef3}
.who{display:flex;flex-direction:column;padding:0 10px;font-size:12.5px}.who em{font-style:normal;color:var(--mut);font-size:11.5px}
.cell{position:relative;height:52px;display:grid;place-items:center}
.mk{position:relative;z-index:1;font-style:normal;font-size:10.5px;font-weight:700;padding:3px 6px;border-radius:5px;white-space:nowrap}
.mk.ap.ready{background:var(--plum);color:#fff}.mk.ap.action{background:var(--yel);color:var(--plum)}.mk.ap.done{background:var(--okbg);color:var(--ok)}
.mk.pd{background:#fff;border:1px solid var(--plum2);color:var(--plum2)}
.ln{position:absolute;left:0;right:0;top:50%;height:2px;background:#d9c7d2}
.fund{animation:in 220ms var(--ease)}.fund h2{font-size:16px;margin:0 0 4px}.sub{margin:0 0 12px;font-size:13px;color:var(--mut)}
table{width:100%;border-collapse:collapse;font-size:13px;border:1px solid var(--line);border-radius:10px;overflow:hidden}
th{text-align:left;font-weight:600;color:var(--mut);background:var(--soft);padding:9px 12px;font-size:12px}td{padding:11px 12px;border-top:1px solid var(--line)}
.tag{font-size:11.5px;font-weight:700;padding:2px 8px;border-radius:999px}.tag.ok{background:var(--okbg);color:var(--ok)}.tag.warn{background:var(--warnbg);color:var(--warn)}
.side{border-left:1px solid var(--line);padding:20px 16px;overflow:auto}
.card{border:1px solid var(--line);border-radius:12px;padding:14px;font-size:13px;animation:in 220ms var(--ease)}
.card h3{margin:0 0 10px;font-size:14.5px}.card p{margin:0 0 10px;line-height:1.5}
dl{margin:0 0 10px;display:flex;flex-direction:column;gap:6px}dl div{display:flex;justify-content:space-between}dt{color:var(--mut)}dd{margin:0;font-weight:600}
.msg{border-radius:8px;padding:8px 10px;font-weight:600;font-size:12.5px;margin-bottom:10px}.msg.ready{background:var(--okbg);color:var(--ok)}.msg.action{background:var(--warnbg);color:var(--warn)}.msg.done{background:var(--okbg);color:var(--ok)}
.tl{margin:0 0 10px;padding-left:18px;display:flex;flex-direction:column;gap:6px}.tl b{margin-right:6px}
.b{all:unset;cursor:pointer;display:block;text-align:center;font-size:13px;font-weight:600;padding:8px 12px;border-radius:8px;border:1px solid var(--line);transition:transform 160ms var(--ease)}
.b:active{transform:scale(.97)}.b.primary{background:var(--plum);color:#fff;border-color:var(--plum)}
.sm{font-size:12px;color:var(--mut)}
.toast{position:absolute;left:50%;bottom:22px;transform:translateX(-50%);background:var(--ink);color:#fff;font-size:13px;padding:10px 14px;border-radius:8px;animation:up 260ms var(--ease)}
.credit{margin:10px 16px;font-size:11px;color:var(--mut)}
@keyframes in{from{opacity:0;transform:translateY(-4px)}}
@keyframes up{from{opacity:0;transform:translate(-50%,10px)}}
@media (prefers-reduced-motion:reduce){.cal,.fund,.card,.toast{animation:none}.b,.run{transition:none}}
`;
