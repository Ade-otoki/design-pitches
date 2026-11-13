"use client";

// Concept prototype: "Clear Payday" for KOHO Cover.
// Independent concept by Daniel Ade-Otoki. Not KOHO's official UI, not affiliated with KOHO.
// Visual language follows KOHO's public iOS screens (Mobbin): white canvas, deep-purple pill buttons,
// Spend/Credit/Borrow/Save segmented control, image-backed Spendable card, outlined quick-action chips,
// lavender plan badge, uppercase section labels, bordered cards, four-tab bar. No KOHO logo.
// Fictional people and employer; amounts are illustrative (Cover limit $250, $150 used).

import { useEffect, useRef, useState } from "react";

type Scenario = "before" | "payday" | "topup";
type View = "home" | "detail";

const LIMIT = 250;
const money = (n: number) => n.toLocaleString("en-CA", { style: "currency", currency: "CAD" }).replace("CA", "");

type Tx = { id: string; title: string; sub: string; amount: number; covered?: boolean; split?: { cover: number; spend: number }; when: string };

const COVERED: Tx[] = [
  { id: "rogers", title: "Rogers", sub: "Covered by Cover", amount: -35.18, covered: true, when: "Nov 18" },
  { id: "petro", title: "Petro-Canada", sub: "Covered by Cover", amount: -60.0, covered: true, when: "Nov 17" },
  { id: "metro", title: "Metro", sub: "Covered by Cover", amount: -54.82, covered: true, when: "Nov 16" },
];

const DATA: Record<Scenario, { spendable: number; coverUsed: number; deposit?: Tx; next: { amount: number; day: string } | null }> = {
  before: { spendable: 0, coverUsed: 150, next: { amount: 1240, day: "Fri, Nov 20" } },
  payday: {
    spendable: 1090, coverUsed: 0, next: null,
    deposit: { id: "pay", title: "Northwind Co. payroll", sub: "Direct deposit", amount: 1240, split: { cover: 150, spend: 1090 }, when: "Nov 20 · 9:02 AM" },
  },
  topup: {
    spendable: 0, coverUsed: 110, next: { amount: 1240, day: "Fri, Nov 20" },
    deposit: { id: "etr", title: "Sam P.", sub: "e-Transfer received", amount: 40, split: { cover: 40, spend: 0 }, when: "Nov 19 · 6:41 PM" },
  },
};

export default function KohoClearPayday() {
  const [scenario, setScenario] = useState<Scenario>("before");
  const [view, setView] = useState<View>("home");
  const [toast, setToast] = useState<{ text: string; hiding?: boolean } | null>(null);
  const [hidden, setHidden] = useState(false);
  const [embed, setEmbed] = useState(false);
  const [ready, setReady] = useState(false);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const backRef = useRef<HTMLButtonElement>(null);
  const d = DATA[scenario];

  // URL options: ?scenario=before|payday|topup  ?embed=1 hides demo controls  ?sync=1 listens to /live/koho controls
  useEffect(() => {
    const q = new URLSearchParams(window.location.search);
    const s = q.get("scenario");
    if (s === "before" || s === "payday" || s === "topup") setScenario(s);
    setEmbed(q.get("embed") === "1");
    setReady(true);
    if (q.get("sync") !== "1" || typeof BroadcastChannel === "undefined") return;
    const c = new BroadcastChannel("koho-clear-payday");
    c.onmessage = (e: MessageEvent) => {
      const m = e.data as { type: string; scenario?: Scenario };
      if (m.type === "scenario" && m.scenario) go(m.scenario);
    };
    return () => c.close();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function showToast(text: string) {
    if (toastTimer.current) clearTimeout(toastTimer.current);
    setToast({ text });
    toastTimer.current = setTimeout(() => {
      setToast((t) => (t ? { ...t, hiding: true } : t));
      toastTimer.current = setTimeout(() => setToast(null), 180);
    }, 3200);
  }

  function go(s: Scenario) {
    setScenario(s);
    setView("home");
    if (s === "payday") showToast(`Paycheque arrived · ${money(1240)}`);
    else if (s === "topup") showToast(`e-Transfer received · ${money(40)}`);
    else setToast(null);
  }

  useEffect(() => { if (view === "detail") backRef.current?.focus(); }, [view]);

  const available = LIMIT - d.coverUsed;
  const activity: Tx[] = d.deposit ? [d.deposit, ...COVERED] : COVERED;

  return (
    <div className={`kp ${embed ? "is-embed" : ""} ${ready ? "is-ready" : ""}`}>
      <style>{CSS}</style>
      {/* eslint-disable-next-line @next/next/no-page-custom-font */}
      <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" />
      <script dangerouslySetInnerHTML={{ __html: "if(/[?&]scenario=(payday|topup)/.test(location.search))document.documentElement.classList.add('kp-wait')" }} />

      <div className="demo" role="group" aria-label="Concept demo">
        <span className="demo-l">Concept demo</span>
        <div className="seg sm">
          {([["before", "Before payday"], ["payday", "Payday lands"], ["topup", "Small top-up"]] as [Scenario, string][]).map(([k, l]) => (
            <button key={k} className={scenario === k ? "on" : ""} aria-pressed={scenario === k} onClick={() => go(k)}>{l}</button>
          ))}
        </div>
      </div>

      <div className="stage">
        {/* ---------------- Home ---------------- */}
        <section className={`screen home ${view === "home" ? "in" : "out-left"}`} aria-hidden={view !== "home"}>
          <header className="top">
            <button className="icon-btn" aria-label="Profile"><Ico.user /></button>
            <span className="plan">Extra</span>
            <span className="top-r">
              <button className="icon-btn" aria-label="Rewards"><Ico.gift /></button>
              <button className="icon-btn" aria-label="Notifications"><Ico.bell /></button>
            </span>
          </header>

          <div className="seg main" role="tablist" aria-label="Accounts">
            {["Spend", "Credit", "Borrow", "Save"].map((t, i) => (
              <button key={t} role="tab" aria-selected={i === 0} className={i === 0 ? "on" : ""} tabIndex={i === 0 ? 0 : -1}>{t}</button>
            ))}
          </div>

          <div className="bal-card">
            <div className="scene" aria-hidden />
            <div className="bal-inner">
              <span className="bal-l">Spendable</span>
              <span className="bal-v" key={`${scenario}-${hidden}`}>
                {hidden ? "••••" : <><sup>$</sup>{money(d.spendable).replace("$", "")}</>}
              </span>
              <button className="eye" aria-label={hidden ? "Show balance" : "Hide balance"} onClick={() => setHidden((h) => !h)}><Ico.eye off={!hidden} /></button>
            </div>
          </div>

          <div className={`cover-chip ${d.coverUsed ? "owed" : "ok"}`}>
            <span className="dot" aria-hidden />
            <span>{d.coverUsed ? <>Cover: <b>{money(d.coverUsed)}</b> to repay · {money(available)} available</> : <>Cover ready · <b>{money(LIMIT)}</b> available</>}</span>
          </div>

          <div className="chips">
            <button className="chip"><Ico.dollar />Add</button>
            <button className="chip"><Ico.send />Send</button>
            <button className="chip"><Ico.card />Cards</button>
          </div>

          {d.next ? (
            <div className="card preview">
              <div className="pv-head">
                <span className="lbl">NEXT DEPOSIT</span>
                <span className="pv-day">{d.next.day}</span>
              </div>
              <p className="pv-title">Northwind Co. payroll · about {money(d.next.amount)}</p>
              <Split cover={d.coverUsed} spend={d.next.amount - d.coverUsed} total={d.next.amount} k={scenario} />
              <ul className="legend">
                <li><span className="sq cover" />Repays Cover<b>{money(d.coverUsed)}</b></li>
                <li><span className="sq spend" />To Spendable<b>about {money(d.next.amount - d.coverUsed)}</b></li>
              </ul>
              <p className="pv-note">Cover is repaid first whenever money comes in. Based on your last 3 paycheques, so the amount may differ.</p>
              <button className="btn ghost">Repay Cover early</button>
            </div>
          ) : (
            <div className="card done">
              <span className="ok-ic" aria-hidden><Ico.check /></span>
              <div>
                <p className="done-t">You&apos;re all caught up</p>
                <p className="done-b">{money(150)} of your paycheque repaid Cover. Your full {money(LIMIT)} is ready again.</p>
              </div>
            </div>
          )}

          <div className="act-head"><span className="lbl">ACTIVITY</span><button className="link">See all</button></div>
          <ul className="activity">
            {activity.map((t, i) => (
              <li key={t.id} className={i === 0 && d.deposit ? "new" : ""}>
                <button className="row" disabled={!t.split} onClick={() => t.split && setView("detail")}>
                  <span className={`av ${t.amount > 0 ? "in" : ""}`} aria-hidden>{t.amount > 0 ? <Ico.down /> : t.title[0]}</span>
                  <span className="row-m">
                    <span className="row-t">{t.title}</span>
                    <span className="row-s">
                      {t.split ? (t.split.spend ? `${money(t.split.cover)} repaid Cover · ${money(t.split.spend)} to Spendable` : `All ${money(t.split.cover)} repaid Cover`) : t.sub}
                    </span>
                  </span>
                  <span className={`row-a ${t.amount > 0 ? "pos" : ""}`}>{t.amount > 0 ? "+" : "−"}{money(Math.abs(t.amount))}{t.split && <Ico.chev />}</span>
                </button>
              </li>
            ))}
          </ul>
          <p className="credit">Concept by Daniel Ade-Otoki · not KOHO&apos;s official UI · fictional data</p>
          <nav className="tabs" aria-label="Main">
            {[["Home", Ico.home], ["Accounts", Ico.acc], ["Payments", Ico.pay], ["Explore", Ico.exp]].map(([l, I], i) => {
              const C = I as () => React.JSX.Element;
              return <button key={l as string} className={i === 0 ? "on" : ""} aria-current={i === 0 ? "page" : undefined}><C /><span>{(l as string).toUpperCase()}</span></button>;
            })}
          </nav>
        </section>

        {/* ---------------- Deposit detail ---------------- */}
        <section className={`screen detail ${view === "detail" ? "in" : "out-right"}`} aria-hidden={view !== "detail"} aria-label="Deposit details">
          {d.deposit && (
            <>
              <header className="d-top">
                <button ref={backRef} className="icon-btn" aria-label="Back" onClick={() => setView("home")}><Ico.back /></button>
                <span className="d-title">Deposit</span>
                <span className="icon-btn" />
              </header>
              <div className="d-hero">
                <span className="d-amt">+{money(d.deposit.amount)}</span>
                <span className="d-sub">{d.deposit.sub} · {d.deposit.title}</span>
                <span className="d-when">{d.deposit.when}</span>
              </div>

              <div className="card where">
                <span className="lbl">WHERE IT WENT</span>
                <Split cover={d.deposit.split!.cover} spend={d.deposit.split!.spend} total={d.deposit.amount} k={`d-${scenario}-${view}`} />
                <ul className="legend big">
                  <li><span className="sq cover" />Repaid Cover<b>{money(d.deposit.split!.cover)}</b></li>
                  <li><span className="sq spend" />Added to Spendable<b>{money(d.deposit.split!.spend)}</b></li>
                </ul>
              </div>

              <div className="explain">
                <p className="ex-t">{d.deposit.split!.spend ? "Why part of it went to Cover" : `Why all ${money(d.deposit.amount)} went to Cover`}</p>
                <p className="ex-b">
                  {d.deposit.split!.spend
                    ? `You'd used ${money(150)} of Cover. Cover is always repaid first when money comes in, so your full ${money(LIMIT)} is ready to use again.`
                    : `You'd used ${money(150)} of Cover. Money you add repays Cover first, so this ${money(d.deposit.amount)} went there and nothing reached Spendable. ${money(d.coverUsed)} is left, and it'll come out of your next deposit.`}
                </p>
              </div>

              <ul className="facts">
                <li><span>Cover available now</span><b>{money(LIMIT - d.coverUsed)}</b></li>
                <li><span>Left to repay</span><b>{money(d.coverUsed)}</b></li>
                <li><span>Spendable now</span><b>{money(d.spendable)}</b></li>
              </ul>
              <button className="btn primary" onClick={() => setView("home")}>Got it</button>
              <button className="btn ghost">How Cover repayment works</button>
            </>
          )}
        </section>

        <div className={`toast ${toast ? (toast.hiding ? "hide" : "show") : ""}`} role="status" aria-live="polite">
          {toast && (
            <>
              <span>{toast.text}</span>
              <button onClick={() => setView("detail")}>See where it went</button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function Split({ cover, spend, total, k }: { cover: number; spend: number; total: number; k: string }) {
  const c = Math.max(0, Math.min(1, cover / total));
  return (
    <div className="split" key={k} role="img" aria-label={`${money(cover)} to Cover, ${money(Math.max(spend, 0))} to Spendable`}>
      <span className="s-cover" style={{ width: `${c * 100}%` }} />
      <span className="s-spend" style={{ width: `${(1 - c) * 100}%` }} />
    </div>
  );
}

const sv = { width: 22, height: 22, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.8, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
const Ico = {
  user: () => <svg {...sv}><circle cx="12" cy="12" r="9" /><circle cx="12" cy="10" r="3" /><path d="M6.5 18.5c1.3-2.2 3.2-3.3 5.5-3.3s4.2 1.1 5.5 3.3" /></svg>,
  gift: () => <svg {...sv}><rect x="4" y="9" width="16" height="11" rx="1" /><path d="M3 9h18M12 9v11M12 9c-2-4-6-4-6-1.5S9 9 12 9zm0 0c2-4 6-4 6-1.5S15 9 12 9z" /></svg>,
  bell: () => <svg {...sv}><path d="M6 16V11a6 6 0 1 1 12 0v5l1.5 2h-15z" /><path d="M10 20.5a2 2 0 0 0 4 0" /></svg>,
  eye: ({ off }: { off: boolean }) => <svg {...sv} stroke="#fff"><path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12z" /><circle cx="12" cy="12" r="3" />{off && <path d="M4 4l16 16" />}</svg>,
  dollar: () => <svg {...sv}><path d="M12 3v18M16.5 7.5c-.7-1.4-2.4-2.2-4.5-2.2-2.6 0-4.3 1.3-4.3 3.1 0 4.4 9 2.3 9 6.9 0 1.9-1.9 3.3-4.6 3.3-2.3 0-4.2-.9-4.9-2.5" /></svg>,
  send: () => <svg {...sv}><path d="M21 3 10 14M21 3l-7 18-4-7-7-4z" /></svg>,
  card: () => <svg {...sv}><rect x="3" y="6" width="18" height="12" rx="2" /><path d="M3 10h18M7 15h4" /></svg>,
  check: () => <svg {...sv} strokeWidth={2.4}><path d="m5 12.5 4.5 4.5L19 7.5" /></svg>,
  down: () => <svg {...sv}><path d="M12 5v14M6 13l6 6 6-6" /></svg>,
  chev: () => <svg {...sv} width={16} height={16}><path d="m9 6 6 6-6 6" /></svg>,
  back: () => <svg {...sv}><path d="M15 5l-7 7 7 7" /></svg>,
  home: () => <svg {...sv}><path d="M4 11 12 4l8 7v9h-5v-6H9v6H4z" /></svg>,
  acc: () => <svg {...sv}><rect x="4" y="4" width="16" height="7" rx="2" /><rect x="4" y="13" width="16" height="7" rx="2" /></svg>,
  pay: () => <svg {...sv}><path d="M4 8h14l-3-3M20 16H6l3 3" /></svg>,
  exp: () => <svg {...sv}><rect x="4" y="4" width="6" height="6" rx="1.5" /><rect x="14" y="4" width="6" height="6" rx="1.5" /><rect x="4" y="14" width="6" height="6" rx="1.5" /><path d="M17 14v6M14 17h6" /></svg>,
};

const CSS = `
:root{--p900:#2f1868;--p700:#4a23a8;--p600:#6b2bd9;--lav:#ece4ff;--lav-t:#3b1d86;--ink:#111014;--mut:#5c5a66;--line:#e4e2ea;--surf:#f5f4f8;--green:#178a43;--green-b:#1fa651;--ease:cubic-bezier(.23,1,.32,1);--drawer:cubic-bezier(.32,.72,0,1)}
*{box-sizing:border-box}
html,body{margin:0;background:#fff}
.kp{font-family:Inter,system-ui,-apple-system,sans-serif;color:var(--ink);min-height:100svh;background:#fff;position:relative;overflow:hidden;-webkit-font-smoothing:antialiased}
.kp-wait .kp:not(.is-ready){visibility:hidden}
.kp button{font:inherit;color:inherit;background:none;border:0;cursor:pointer;-webkit-tap-highlight-color:transparent}
.kp button:focus-visible{outline:2px solid var(--p600);outline-offset:2px;border-radius:10px}
.demo{position:relative;z-index:5;display:flex;flex-direction:column;gap:6px;margin:60px 16px 0;padding:8px 10px;border:1px dashed #cfc8e3;border-radius:14px;background:#faf9fd}
.demo-l{font-size:10px;letter-spacing:.08em;text-transform:uppercase;color:var(--mut)}
.kp.is-embed .demo,.kp.is-embed .credit{display:none}
.stage{position:relative;min-height:calc(100svh - 60px)}
.kp:not(.is-embed) .stage{min-height:calc(100svh - 140px)}
.screen{position:absolute;inset:0;padding:0 16px 96px;overflow:auto;transition:transform 300ms var(--drawer),opacity 300ms var(--drawer)}
.kp.is-embed .screen{padding-top:56px}
.kp:not(.is-embed) .screen{padding-top:10px}
.screen.out-left{transform:translateX(-24%);opacity:0;pointer-events:none}
.screen.out-right{transform:translateX(100%);pointer-events:none}
.screen.in{transform:none;opacity:1}
.detail{background:#fff;z-index:2}
.top{display:flex;align-items:center;justify-content:space-between;height:44px}
.top-r{display:flex;gap:4px}
.icon-btn{width:44px;height:44px;display:grid;place-items:center;color:var(--ink)}
.plan{background:var(--lav);color:var(--lav-t);font-size:13px;font-weight:600;padding:5px 12px;border-radius:999px}
.seg{display:flex;gap:2px;background:var(--surf);border:1px solid var(--line);border-radius:999px;padding:3px}
.seg button{flex:1;min-height:38px;border-radius:999px;font-size:15px;font-weight:600;color:#8b8896;transition:background-color 160ms ease,color 160ms ease}
.seg button.on{background:var(--p900);color:#fff}
.seg.main{margin:8px 0 12px}
.seg.sm button{min-height:30px;font-size:12px}
.bal-card{position:relative;height:150px;border-radius:16px;overflow:hidden}
.scene{position:absolute;inset:-20px;background:
 radial-gradient(38% 45% at 80% 22%,#f7d38a 0,#f7d38a00 100%),
 radial-gradient(45% 50% at 62% 40%,#e98f62cc 0,#e98f6200 100%),
 radial-gradient(55% 60% at 18% 30%,#7fa7c9 0,#7fa7c900 100%),
 radial-gradient(70% 55% at 30% 95%,#3e6b3c 0,#3e6b3c00 100%),
 radial-gradient(60% 50% at 85% 95%,#5d7f3f 0,#5d7f3f00 100%),
 linear-gradient(180deg,#9cb7cf 0%,#c9a77c 55%,#4f6b3a 100%);filter:blur(6px) saturate(.9)}
.scene::after{content:"";position:absolute;inset:0;background:radial-gradient(60% 70% at 50% 55%,#0000004d 0,#0000 100%),linear-gradient(180deg,#0000 0,#0000004d 100%)}
.bal-inner{position:relative;height:100%;display:flex;flex-direction:column;align-items:center;justify-content:center;color:#fff}
.bal-l{font-size:15px;font-weight:600;text-shadow:0 1px 6px #0006}
.bal-v{font-size:44px;font-weight:800;letter-spacing:-.03em;line-height:1.05;text-shadow:0 2px 10px #0005;animation:pop 260ms var(--ease)}
.bal-v sup{font-size:24px;vertical-align:14px;margin-right:2px}
.eye{position:absolute;right:16px;top:50%;transform:translateY(-35%);width:44px;height:44px;display:grid;place-items:center}
@keyframes pop{from{opacity:.4;transform:translateY(4px)}to{opacity:1;transform:none}}
.cover-chip{display:flex;align-items:center;gap:8px;width:100%;min-height:40px;margin-top:10px;padding:8px 12px;border-radius:12px;font-size:13.5px;text-align:left;transition:transform 160ms var(--ease)}
.cover-chip:active{transform:scale(.98)}
.cover-chip.owed{background:#f3edff;color:var(--lav-t)}
.cover-chip.ok{background:#e7f6ec;color:#11602f}
.cover-chip .dot{width:8px;height:8px;border-radius:50%;background:currentColor;flex:none}
.chips{display:flex;gap:8px;margin:12px 0 14px}
.kp .chip{display:flex;align-items:center;gap:6px;min-height:40px;padding:0 14px;border:1px solid #d3cfdd;border-radius:999px;font-weight:600;font-size:15px;color:var(--p900)!important;transition:transform 160ms var(--ease)}
.chip svg{width:18px;height:18px}
.chip:active,.btn:active{transform:scale(.97)}
.card{border:1px solid var(--line);border-radius:16px;padding:14px 16px;background:#fff}
.lbl{font-size:12px;font-weight:600;letter-spacing:.06em;color:#4f4c58}
.pv-head{display:flex;justify-content:space-between;align-items:center}
.pv-day{font-size:13px;color:var(--mut)}
.pv-title{margin:6px 0 10px;font-size:17px;font-weight:700;letter-spacing:-.01em}
.split{display:flex;height:12px;border-radius:999px;overflow:hidden;background:var(--surf);gap:2px}
.split span{display:block;height:100%;transform-origin:left;animation:grow 420ms var(--ease) both}
.s-cover{background:var(--p600);border-radius:999px 0 0 999px}
.s-spend{background:var(--green-b);animation-delay:80ms!important;border-radius:0 999px 999px 0}
.s-spend[style*="width: 0%"]{display:none}
@keyframes grow{from{transform:scaleX(0)}to{transform:scaleX(1)}}
.legend{list-style:none;margin:10px 0 0;padding:0;display:flex;flex-direction:column;gap:6px}
.legend li{display:flex;align-items:center;gap:8px;font-size:14px;color:#2a2830}
.legend li b{margin-left:auto;font-weight:700}
.legend.big li{font-size:15px;padding:6px 0}
.sq{width:10px;height:10px;border-radius:3px;flex:none}
.sq.cover{background:var(--p600)}.sq.spend{background:var(--green-b)}
.pv-note{margin:10px 0 4px;font-size:12.5px;line-height:1.45;color:var(--mut)}
.btn{display:flex;align-items:center;justify-content:center;width:100%;min-height:48px;border-radius:999px;font-weight:700;font-size:16px;transition:transform 160ms var(--ease),background-color 160ms ease}
.btn.primary{background:var(--p900);color:#fff!important;margin-top:16px}
.btn.ghost{color:var(--p900)!important;min-height:44px}
.done{display:flex;gap:12px;align-items:flex-start;background:#f3fbf5;border-color:#cfeeda;animation:pop 300ms var(--ease)}
.ok-ic{width:28px;height:28px;border-radius:50%;background:var(--green-b);color:#fff;display:grid;place-items:center;flex:none}
.ok-ic svg{width:16px;height:16px}
.done-t{margin:2px 0 2px;font-weight:700;font-size:15px}
.done-b{margin:0;font-size:13.5px;line-height:1.45;color:#2f4a38}
.act-head{display:flex;justify-content:space-between;align-items:center;margin:18px 0 4px}
.link{color:var(--p700)!important;font-weight:600;font-size:14px;min-height:44px}
.activity{list-style:none;margin:0;padding:0}
.activity li.new{animation:slidein 380ms var(--ease) both}
@keyframes slidein{from{opacity:0;transform:translateY(-8px)}to{opacity:1;transform:none}}
.row{display:flex;align-items:center;gap:12px;width:100%;min-height:60px;padding:8px 0;border-bottom:1px solid #efedf3;text-align:left}
.row:disabled{cursor:default}
.av{width:36px;height:36px;border-radius:50%;background:var(--surf);display:grid;place-items:center;font-weight:700;color:#4f4c58;flex:none}
.av.in{background:#e7f6ec;color:var(--green)}
.av svg{width:18px;height:18px}
.row-m{display:flex;flex-direction:column;gap:2px;min-width:0;flex:1}
.row-t{font-weight:600;font-size:15px}
.row-s{font-size:12.5px;color:var(--mut);line-height:1.35}
.row-a{display:flex;align-items:center;gap:2px;font-weight:700;font-size:15px;white-space:nowrap}
.row-a.pos{color:var(--green)}
.row-a svg{color:#9a97a5}
.credit{font-size:10.5px;color:#9a97a5;text-align:center;margin:18px 0 0}
.tabs{position:fixed;left:0;right:0;bottom:0;display:flex;background:#fff;border-top:1px solid var(--line);padding:6px 6px 30px;z-index:3}
.tabs button{flex:1;display:flex;flex-direction:column;align-items:center;gap:3px;font-size:10px;font-weight:600;color:#55525e;min-height:44px}
.tabs button.on{color:var(--p700)}
.detail .tabs{display:none}
.d-top{display:flex;align-items:center;justify-content:space-between;height:44px}
.d-title{font-weight:700;font-size:17px}
.d-hero{display:flex;flex-direction:column;align-items:center;gap:4px;margin:14px 0 18px;text-align:center}
.d-amt{font-size:38px;font-weight:800;letter-spacing:-.03em;color:var(--green)}
.d-sub{font-size:15px;font-weight:600}
.d-when{font-size:13px;color:var(--mut)}
.where .split{margin-top:10px;height:14px}
.explain{margin:14px 0 6px;padding:14px 16px;border-radius:16px;background:#f3edff}
.ex-t{margin:0 0 4px;font-weight:700;font-size:15px;color:var(--lav-t)}
.ex-b{margin:0;font-size:14px;line-height:1.5;color:#2f2648}
.facts{list-style:none;margin:8px 0 0;padding:0}
.facts li{display:flex;justify-content:space-between;padding:12px 0;border-bottom:1px solid #efedf3;font-size:15px}
.facts span{color:var(--mut)}
.toast{position:fixed;left:16px;right:16px;bottom:96px;z-index:6;display:flex;align-items:center;justify-content:space-between;gap:10px;padding:12px 14px;border-radius:14px;background:#1d1530;color:#fff;font-size:14px;font-weight:600;opacity:0;transform:translateY(12px);pointer-events:none;transition:opacity 220ms var(--ease),transform 220ms var(--ease)}
.toast.show{opacity:1;transform:none;pointer-events:auto}
.toast.hide{opacity:0;transform:translateY(8px);transition-duration:160ms}
.toast button{color:#cdb8ff!important;font-weight:700;font-size:13px;min-height:36px;white-space:nowrap}
@media (prefers-reduced-motion:reduce){
 .screen{transition:opacity 200ms ease}
 .screen.out-left,.screen.out-right{transform:none;opacity:0}
 .split span,.activity li.new,.bal-v,.done{animation:none}
 .toast{transition:opacity 200ms ease;transform:none}
}
`;
