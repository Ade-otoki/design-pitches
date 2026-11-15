"use client";

// Concept prototype: "Cash Timeline" for Stripe Balances / Treasury.
// Independent concept by Daniel Ade-Otoki. Not Stripe's official UI, not affiliated with Stripe.
// Layout follows Stripe's Balances page as captured on Mobbin: left nav (Home, Balances, Transactions, Customers, Product catalogue),
// search bar, Pay out / Add funds / Manage payouts, a balance summary bar (Incoming, Available, Future refunds) and recent activity
// with "Available on". No Stripe logo. Fictional business and amounts; the instant payout fee shown is illustrative.

import { useEffect, useState } from "react";

type Scenario = "timeline" | "reserve" | "instant";
const DAYS = [
  { d: "Today", date: "Sun 15 Nov", avail: 0, bank: 0, note: "" },
  { d: "Mon", date: "16 Nov", avail: 4210, bank: 0, note: "Fri–Sun card sales become available" },
  { d: "Tue", date: "17 Nov", avail: 1380, bank: 6040, note: "Today's and Monday's payouts land" },
  { d: "Wed", date: "18 Nov", avail: 1920, bank: 1380, note: "" },
  { d: "Thu", date: "19 Nov", avail: 1650, bank: 1920, note: "" },
  { d: "Fri", date: "20 Nov", avail: 2240, bank: 1650, note: "Payroll due: $9,800" },
];
const f = (n: number) => `$${n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

export default function StripeCashTimeline() {
  const [scenario, setScenario] = useState<Scenario>("timeline");
  const [embed, setEmbed] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  function apply(s: Scenario) { setScenario(s); setToast(null); }

  // URL options: ?scenario=timeline|reserve|instant  ?embed=1 hides demo controls  ?sync=1 listens to /live/stripe
  useEffect(() => {
    const q = new URLSearchParams(window.location.search);
    const s = q.get("scenario") as Scenario | null;
    if (s && ["timeline", "reserve", "instant"].includes(s)) apply(s);
    setEmbed(q.get("embed") === "1");
    if (q.get("sync") !== "1" || typeof BroadcastChannel === "undefined") return;
    const c = new BroadcastChannel("stripe-cash-timeline");
    c.onmessage = (e) => { if (e.data?.type === "scenario") apply(e.data.scenario); };
    return () => c.close();
  }, []);
  useEffect(() => { if (!toast) return; const t = setTimeout(() => setToast(null), 4200); return () => clearTimeout(t); }, [toast]);

  const reserve = scenario === "reserve";
  const incoming = 11400, available = 1830, held = reserve ? 2500 : 0;
  const max = 6500;
  return (
    <div className={`st ${embed ? "is-embed" : ""}`}>
      <style>{CSS}</style>
      <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" />
      {!embed && (
        <div className="demo" role="group" aria-label="Concept demo">
          <span className="demo-l">Concept demo</span>
          {(["timeline", "reserve", "instant"] as Scenario[]).map((s, i) => (
            <button key={s} className={scenario === s ? "on" : ""} aria-pressed={scenario === s} onClick={() => apply(s)}>
              {i + 1}. {{ timeline: "When money arrives", reserve: "Why some is held", instant: "Need it sooner" }[s]}
            </button>
          ))}
        </div>
      )}
      <div className="app">
        <aside className="nav">
          <div className="org"><span className="av">NB</span><div><b>Northside Bakery</b><span>Business</span></div></div>
          {["Home", "Balances", "Transactions", "Customers", "Product catalogue"].map((n) => <span key={n} className={`ni ${n === "Balances" ? "on" : ""}`}>{n}</span>)}
          <span className="sec">Products</span>
          {["Connect", "Payments", "Billing", "Treasury", "Reporting", "More"].map((n) => <span key={n} className="ni">{n}</span>)}
        </aside>
        <main className="main">
          <div className="top"><div className="search">⌕ Search</div></div>
          <div className="acts"><button className="b ghost" onClick={() => apply("instant")}>↗ Pay out</button><button className="b ghost">+ Add funds</button><button className="b ghost">Manage payouts ⌄</button></div>
          {reserve && (
            <div className="banner" role="status"><b>{f(held)} is held as a reserve until 14 Jan 2027.</b> <span>Because chargebacks rose above 1% this month. It&apos;s released automatically; nothing is lost.</span><a>Why reserves happen</a></div>
          )}
          <div className="cols">
            <section>
              <h2>Balance summary</h2>
              <div className="sumbar" aria-hidden="true">
                <i className="inc" style={{ flex: incoming - held }} /><i className="av2" style={{ flex: available }} />{reserve && <i className="res" style={{ flex: held }} />}
              </div>
              <div className="srow"><span><i className="dot inc" />Incoming</span><b>{f(incoming - held)}</b></div>
              <div className="srow"><span><i className="dot av2" />Available</span><b>{f(available)}</b></div>
              {reserve && <div className="srow"><span><i className="dot res" />Reserve · released 14 Jan</span><b>{f(held)}</b></div>}

              <h2 className="mt">Cash timeline <span className="new">New</span></h2>
              <p className="sub">When your money becomes available, and when it lands in your bank (Chase ••4021).</p>
              <div className="tl">
                {DAYS.map((d, i) => {
                  const fri = i === 5;
                  const inst = scenario === "instant";
                  const avail = reserve && i === 1 ? d.avail - held : d.avail;
                  const bank = inst && i === 0 ? available : inst && i === 2 ? d.bank - available : reserve && i === 2 ? d.bank - held : d.bank;
                  return (
                    <div key={d.date} className={`day ${fri ? "fri" : ""}`}>
                      <div className="dh"><b>{d.d}</b><span>{d.date}</span></div>
                      <div className="bars" aria-hidden="true">
                        <i className="a" style={{ height: `${(avail / max) * 100}%` }} />
                        <i className="k" style={{ height: `${(bank / max) * 100}%` }} />
                      </div>
                      <div className="vals"><span>{avail ? f(avail) : "—"}</span><span className="kb">{bank ? f(bank) : "—"}</span></div>
                      {d.note && <p className="dn">{scenario === "instant" && i === 2 ? "Monday's payout lands" : d.note}</p>}
                    </div>
                  );
                })}
              </div>
              <div className="legend"><span><i className="a" />Becomes available</span><span><i className="k" />Lands in your bank</span></div>
            </section>

            <aside className="side">
              {scenario === "timeline" && (
                <div className="card">
                  <h3>By Friday payroll</h3>
                  <p><b>{f(10990)}</b> will be in your bank by Fri 20 Nov. Payroll is <b>$9,800</b>.</p>
                  <div className="ok">✓ You&apos;re covered with $1,190 to spare.</div>
                  <p className="sm">Based on your daily automatic payouts and typical 2-day settlement. Card disputes could change this.</p>
                </div>
              )}
              {scenario === "reserve" && (
                <div className="card warn">
                  <h3>By Friday payroll</h3>
                  <p><b>{f(8490)}</b> will be in your bank by Fri 20 Nov. Payroll is <b>$9,800</b>.</p>
                  <div className="bad">$1,310 short because of the reserve.</div>
                  <p className="opt">By Mon 23 Nov you&apos;ll have <b>{f(10730)}</b>, enough to cover it. Moving payroll a weekend later, or paying part on Friday, avoids the gap.</p>
                  <button className="b primary" onClick={() => setToast("Reminder set for Thu 19 Nov · we\u2019ll update this forecast if anything changes")}>Remind me Thursday</button>
                  <p className="sm">The reserve is released on 14 Jan 2027. Fewer disputes shorten future reserves.</p>
                </div>
              )}
              {scenario === "instant" && (
                <div className="card">
                  <h3>Pay out {f(available)} now</h3>
                  <div className="cmp">
                    <div><span>Instant · to debit card ••4021</span><b>Arrives in ~30 min</b><span>Fee {f(available * 0.015)} (1.5%, illustrative)</span></div>
                    <div><span>Standard</span><b>Arrives Tue 17 Nov</b><span>No fee</span></div>
                  </div>
                  <button className="b primary" onClick={() => setToast(`${f(available - available * 0.015)} on its way · arrives in about 30 minutes`)}>Pay out instantly</button>
                  <p className="sm">Paying out early doesn&apos;t change your total: Friday payroll stays covered either way.</p>
                </div>
              )}
              <div className="card"><h3>Automatic payouts</h3><p className="sm">Daily · 2-day delay · Chase ••4021</p></div>
            </aside>
          </div>
        </main>
        {toast && <div className="toast" role="status">✓ {toast}</div>}
      </div>
      {!embed && <p className="credit">Concept by Daniel Ade-Otoki · not Stripe&apos;s official UI · fictional business and amounts</p>}
    </div>
  );
}

const CSS = `
html,body{margin:0;background:#fff}
.st{--ink:#1a1f36;--mut:#697386;--line:#e3e8ee;--soft:#f6f8fa;--pur:#635bff;--purl:#e9e8ff;--teal:#0e9aa7;--green:#0f8b4f;--greenbg:#e6f6ed;--red:#c0123c;--redbg:#fde8ec;--amber:#a15c00;--amberbg:#fff4e0;--ease:cubic-bezier(.23,1,.32,1);
 font-family:Inter,system-ui,sans-serif;color:var(--ink);-webkit-font-smoothing:antialiased}
.st *{box-sizing:border-box}
.demo{display:flex;gap:6px;align-items:center;flex-wrap:wrap;padding:8px 16px;border-bottom:1px dashed #ccc;font-size:13px}
.demo-l{font-size:11px;letter-spacing:.08em;text-transform:uppercase;color:var(--mut);margin-right:6px}
.demo button{all:unset;cursor:pointer;padding:5px 11px;border-radius:999px;border:1px solid var(--line)}
.demo button.on{background:var(--pur);color:#fff;border-color:var(--pur)}
.demo button:focus-visible,.b:focus-visible{outline:2px solid var(--pur);outline-offset:2px}
.app{position:relative;display:grid;grid-template-columns:220px 1fr;height:800px;overflow:hidden}
.st:not(.is-embed) .app{height:calc(100svh - 64px);min-height:640px}
.nav{display:flex;flex-direction:column;gap:1px;padding:14px 12px;border-right:1px solid var(--line);font-size:13.5px}
.org{display:flex;gap:9px;align-items:center;margin-bottom:12px}
.org div{display:flex;flex-direction:column;font-size:11.5px;color:var(--mut)}.org b{font-size:13px;color:var(--ink)}
.av{width:26px;height:26px;border-radius:6px;background:var(--ink);color:#fff;font-size:10px;font-weight:700;display:grid;place-items:center}
.ni{padding:6px 8px;border-radius:6px;color:#3c4257}.ni.on{color:var(--pur);font-weight:600;background:#f5f4ff}
.sec{margin:14px 8px 4px;font-size:11.5px;color:var(--mut);font-weight:600}
.main{overflow:auto;padding:12px 28px 28px}
.top{display:flex;margin-bottom:10px}.search{width:260px;background:var(--soft);border-radius:6px;padding:6px 10px;font-size:13px;color:var(--mut)}
.acts{display:flex;gap:6px;margin-bottom:14px}
.b{all:unset;cursor:pointer;font-size:13px;font-weight:600;padding:6px 10px;border-radius:6px;transition:transform 160ms var(--ease)}
.b:active{transform:scale(.97)}.b.ghost{border:1px solid var(--line);color:#3c4257}.b.primary{background:var(--pur);color:#fff;margin-top:10px}
.banner{display:flex;flex-wrap:wrap;gap:6px;align-items:baseline;background:var(--amberbg);color:#5c3a00;border-radius:8px;padding:10px 14px;font-size:13px;margin-bottom:14px;animation:in 220ms var(--ease)}
.banner a{margin-left:auto;color:var(--pur);font-weight:600}
.cols{display:grid;grid-template-columns:minmax(0,1fr) 280px;gap:24px}
h2{font-size:17px;margin:0 0 10px}.mt{margin-top:24px;display:flex;gap:8px;align-items:center}
.new{font-size:11px;background:var(--purl);color:var(--pur);border-radius:4px;padding:1px 6px}
.sub{margin:-4px 0 12px;font-size:13px;color:var(--mut)}
.sumbar{display:flex;height:12px;border-radius:3px;overflow:hidden;gap:2px;margin-bottom:8px}
.sumbar i{display:block;transition:flex 400ms var(--ease)}
i.inc{background:#c1c9d2}i.av2{background:var(--pur)}i.res{background:#f5a524}
.srow{display:flex;justify-content:space-between;font-size:13.5px;padding:7px 0;border-bottom:1px solid var(--line)}
.dot{display:inline-block;width:9px;height:9px;border-radius:2px;margin-right:8px}
.tl{display:grid;grid-template-columns:repeat(6,1fr);gap:8px}
.day{border:1px solid var(--line);border-radius:8px;padding:8px;display:flex;flex-direction:column;gap:6px;font-size:12px}
.day.fri{border-color:var(--pur);box-shadow:0 0 0 1px var(--pur)}
.dh{display:flex;flex-direction:column}.dh span{color:var(--mut);font-size:11.5px}
.bars{display:flex;gap:4px;align-items:flex-end;height:90px;border-bottom:1px solid var(--line)}
.bars i{flex:1;border-radius:3px 3px 0 0;transition:height 400ms var(--ease)}
i.a{background:#b9b5ff}i.k{background:var(--teal)}
.vals{display:flex;flex-direction:column;font-size:11.5px;color:var(--mut)}.vals .kb{color:var(--teal);font-weight:600}
.dn{margin:0;font-size:11px;color:var(--mut);line-height:1.35}
.day.fri .dn{color:var(--pur);font-weight:600}
.legend{display:flex;gap:16px;font-size:12px;color:var(--mut);margin-top:8px}
.legend i{display:inline-block;width:9px;height:9px;border-radius:2px;margin-right:6px}
.side{display:flex;flex-direction:column;gap:12px}
.card{border:1px solid var(--line);border-radius:8px;padding:14px;font-size:13px;animation:in 220ms var(--ease)}
.card.warn{border-color:#f5c26b}
.card h3{margin:0 0 6px;font-size:14px}.card p{margin:0 0 8px;line-height:1.45}
.ok{background:var(--greenbg);color:var(--green);border-radius:6px;padding:7px 10px;font-weight:600}
.bad{background:var(--redbg);color:var(--red);border-radius:6px;padding:7px 10px;font-weight:600}
.sm{font-size:12px;color:var(--mut);margin-top:8px!important}
.opt{font-size:12.5px}
.cmp{display:flex;flex-direction:column;gap:8px}
.cmp div{display:flex;flex-direction:column;border:1px solid var(--line);border-radius:6px;padding:8px 10px;font-size:12px;color:var(--mut)}
.cmp div:first-child{border-color:var(--pur)}.cmp b{color:var(--ink);font-size:13.5px}
.toast{position:absolute;left:50%;bottom:22px;transform:translateX(-50%);background:var(--ink);color:#fff;font-size:13px;padding:10px 14px;border-radius:8px;animation:up 260ms var(--ease)}
.credit{margin:10px 16px;font-size:11px;color:var(--mut)}
@keyframes in{from{opacity:0;transform:translateY(-4px)}}
@keyframes up{from{opacity:0;transform:translate(-50%,10px)}}
@media (prefers-reduced-motion:reduce){.card,.banner,.toast{animation:none}.bars i,.sumbar i,.b{transition:none}}
`;
