"use client";

// Concept prototype: "Why my pay changed" for an employee's mobile pay summary.
// Independent concept by Daniel Ade-Otoki. Not Remote's UI, not affiliated with Remote.
// Fictional employee; all amounts are illustrative and do not reflect any country's tax rules.

import { useEffect, useState } from "react";

type Change = { key: string; label: string; delta: number; kind: "earning" | "deduction"; reason: string; detail: string; guide?: boolean };
type Month = { key: string; label: string; prev: string; net: number; prevNet: number; gross: number; changes: Change[]; unchanged: { label: string; amount: number }[] };

const eur = (n: number, sign = false) =>
  (sign && n > 0 ? "+" : n < 0 ? "−" : "") + "€" + Math.abs(n).toLocaleString("en-IE", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

const MONTHS: Month[] = [
  {
    key: "oct",
    label: "October 2026",
    prev: "September",
    net: 3412.3,
    prevNet: 3596.3,
    gross: 5120,
    changes: [
      { key: "bonus", label: "Q3 performance bonus", delta: 600, kind: "earning", reason: "A one-off bonus was paid this month.", detail: "Approved by your employer on 18 Sep and included in October's payroll. It won't repeat next month." },
      { key: "leave", label: "Unpaid leave · 2 days", delta: -320, kind: "earning", reason: "2 days of unpaid leave were deducted.", detail: "You took unpaid leave on 9–10 Oct. Your daily rate is your monthly salary divided by working days in the month." },
      { key: "tax", label: "Income tax withheld", delta: -390, kind: "deduction", reason: "Tax went up because the bonus raised this month's taxable pay.", detail: "Withholding is calculated on this month's total taxable pay, so a bonus month is withheld at a higher amount. Your annual tax return may balance this out.", guide: true },
      { key: "social", label: "Social contributions", delta: -74, kind: "deduction", reason: "Contributions rise with gross pay, which was higher this month.", detail: "These are a percentage of gross pay, so they follow the bonus and leave changes above.", guide: true },
    ],
    unchanged: [
      { label: "Base salary", amount: 4800 },
      { label: "Internet stipend", amount: 40 },
    ],
  },
  {
    key: "nov",
    label: "November 2026",
    prev: "October",
    net: 3546.3,
    prevNet: 3412.3,
    gross: 4840,
    changes: [
      { key: "bonus", label: "Q3 performance bonus", delta: -600, kind: "earning", reason: "Last month's one-off bonus isn't repeated.", detail: "October included a one-off bonus. November is back to your regular salary." },
      { key: "leave", label: "Unpaid leave", delta: 320, kind: "earning", reason: "No unpaid leave this month.", detail: "October had 2 days of unpaid leave deducted; November has none." },
      { key: "tax", label: "Income tax withheld", delta: 390, kind: "deduction", reason: "Tax went down with your regular, lower taxable pay.", detail: "Without the bonus, this month's taxable pay is lower, so less tax is withheld.", guide: true },
      { key: "social", label: "Social contributions", delta: 74, kind: "deduction", reason: "Contributions fell with gross pay.", detail: "They follow gross pay, which went back to your regular salary.", guide: true },
      { key: "pension", label: "Voluntary pension", delta: -50, kind: "deduction", reason: "You started a voluntary pension contribution.", detail: "You opted in on 3 Nov. €50 is taken from gross pay each month until you change it in Benefits." },
    ],
    unchanged: [
      { label: "Base salary", amount: 4800 },
      { label: "Internet stipend", amount: 40 },
    ],
  },
];

export default function WhyMyPayChanged() {
  const [mk, setMk] = useState("oct");
  const [open, setOpen] = useState<string | null>("tax");
  const [ask, setAsk] = useState<Change | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const m = MONTHS.find((x) => x.key === mk)!;
  const diff = +(m.net - m.prevNet).toFixed(2);

  useEffect(() => setOpen(m.changes[0]?.key ?? null), [mk]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (!toast) return;
    const id = setTimeout(() => setToast(null), 2800);
    return () => clearTimeout(id);
  }, [toast]);

  return (
    <div className="pp">
      <style>{CSS}</style>

      <header className="top">
        <span className="back" aria-hidden>‹</span>
        <span>Pay summary</span>
        <span className="tag">Concept</span>
      </header>

      <div className="months" role="tablist" aria-label="Payslip month">
        {MONTHS.map((x) => (
          <button key={x.key} role="tab" aria-selected={x.key === mk} className={x.key === mk ? "on" : ""} onClick={() => setMk(x.key)}>
            {x.label.split(" ")[0]}
          </button>
        ))}
      </div>

      <section className="net">
        <p className="cap">Net pay · {m.label}</p>
        <p className="big">{eur(m.net)}</p>
        <p className="gross">from {eur(m.gross)} gross</p>
      </section>

      <section className={`delta ${diff < 0 ? "down" : "up"}`} aria-live="polite">
        <div className="dl">
          <span className="arrow" aria-hidden>{diff < 0 ? "↓" : "↑"}</span>
          <div>
            <p className="dt">{eur(Math.abs(diff))} {diff < 0 ? "less" : "more"} than {m.prev}</p>
            <p className="ds">{m.changes.length} things changed. Here&apos;s why.</p>
          </div>
        </div>
      </section>

      <h2 className="sh">What changed since {m.prev}</h2>
      <ul className="changes">
        {m.changes.map((c) => {
          const isOpen = open === c.key;
          return (
            <li key={c.key} className={isOpen ? "open" : ""}>
              <button className="row" aria-expanded={isOpen} onClick={() => setOpen(isOpen ? null : c.key)}>
                <span className="lbl">
                  <b>{c.label}</b>
                  <span>{c.reason}</span>
                </span>
                <span className={`amt ${c.delta < 0 ? "neg" : "pos"}`}>{eur(c.delta, true)}</span>
              </button>
              {isOpen && (
                <div className="more">
                  <p>{c.detail}</p>
                  <div className="acts">
                    {c.guide && <button className="link" onClick={() => setToast("Opens the payslip guide for your country")}>Country guide</button>}
                    <button className="link" onClick={() => setAsk(c)}>Ask about this line</button>
                  </div>
                </div>
              )}
            </li>
          );
        })}
      </ul>

      <details className="same">
        <summary>{m.unchanged.length} lines didn&apos;t change</summary>
        <ul>{m.unchanged.map((u) => <li key={u.label}><span>{u.label}</span><span>{eur(u.amount)}</span></li>)}</ul>
      </details>

      <button className="pdf" onClick={() => setToast("Opens the full payslip PDF")}>View full payslip (PDF)</button>
      <p className="foot">Concept by Daniel Ade-Otoki · not Remote&apos;s UI · fictional employee, illustrative amounts</p>

      {ask && (
        <div className="sheet-bg" onClick={() => setAsk(null)}>
          <div className="sheet" role="dialog" aria-modal="true" aria-label="Ask about this line" onClick={(e) => e.stopPropagation()}>
            <div className="grab" />
            <h3>Ask about “{ask.label}”</h3>
            <div className="ctx">
              <span>Attached</span>
              {m.label} payslip · {ask.label} · {eur(ask.delta, true)} vs {m.prev}
            </div>
            <label htmlFor="q">Your question</label>
            <textarea id="q" defaultValue={`Why did my ${ask.label.toLowerCase()} change by ${eur(ask.delta, true)} this month?`} />
            <button className="send" onClick={() => { setAsk(null); setToast("Sent to support with your payslip context attached."); }}>Send to support</button>
          </div>
        </div>
      )}
      {toast && <div className="toast" role="status">{toast}</div>}
    </div>
  );
}

const CSS = `
.pp{--ink:#14161c;--muted:#5f6573;--faint:#9aa0ad;--line:#eceef2;--bg:#f6f7f9;--card:#fff;--green:#127a4b;--green-bg:#e8f6ef;--red:#b4232c;--red-bg:#fdecec;--accent:#3b3ff5;
  min-height:100svh;background:var(--bg);color:var(--ink);font:15px/1.45 Inter,system-ui,sans-serif;padding:60px 16px 24px;}
.pp *{box-sizing:border-box}
.top{display:grid;grid-template-columns:24px 1fr auto;align-items:center;font-weight:600;font-size:16px;margin-bottom:14px}
.back{font-size:26px;line-height:1;color:var(--muted)}
.tag{font-size:11px;font-weight:600;color:var(--accent);background:#eceeff;border-radius:999px;padding:3px 8px}
.months{display:flex;gap:6px;margin-bottom:16px}
.months button{flex:1;border:1px solid var(--line);background:var(--card);border-radius:10px;padding:8px;font:inherit;font-size:14px;color:var(--muted);cursor:pointer}
.months button.on{background:var(--ink);color:#fff;border-color:var(--ink)}
.net{background:var(--card);border-radius:18px;padding:18px;border:1px solid var(--line)}
.cap{margin:0;color:var(--muted);font-size:13px}
.big{margin:2px 0 0;font-size:34px;font-weight:700;letter-spacing:-.02em;font-variant-numeric:tabular-nums}
.gross{margin:0;color:var(--faint);font-size:13px}
.delta{margin-top:10px;border-radius:16px;padding:14px}
.delta.down{background:var(--red-bg)} .delta.up{background:var(--green-bg)}
.dl{display:flex;gap:12px;align-items:center}
.arrow{width:34px;height:34px;border-radius:50%;display:grid;place-items:center;font-weight:700;background:#fff}
.down .arrow{color:var(--red)} .up .arrow{color:var(--green)}
.dt{margin:0;font-weight:700}
.ds{margin:0;color:var(--muted);font-size:13.5px}
.sh{font-size:13px;letter-spacing:.06em;text-transform:uppercase;color:var(--faint);margin:20px 4px 8px;font-weight:600}
.changes{list-style:none;margin:0;padding:0;background:var(--card);border:1px solid var(--line);border-radius:18px;overflow:hidden}
.changes li+li{border-top:1px solid var(--line)}
.row{all:unset;box-sizing:border-box;display:flex;gap:12px;justify-content:space-between;align-items:flex-start;width:100%;padding:14px 16px;cursor:pointer}
.row:focus-visible,.months button:focus-visible,.link:focus-visible,.send:focus-visible,.pdf:focus-visible{outline:2px solid var(--accent);outline-offset:2px}
.lbl{display:flex;flex-direction:column;gap:2px}
.lbl b{font-weight:600}
.lbl span{color:var(--muted);font-size:13.5px}
.amt{font-weight:700;white-space:nowrap;font-variant-numeric:tabular-nums}
.amt.neg{color:var(--red)} .amt.pos{color:var(--green)}
.open{background:#fafbfc}
.more{padding:0 16px 14px}
.more p{margin:0 0 10px;font-size:13.5px;color:#3c4150}
.acts{display:flex;gap:14px}
.link{background:none;border:0;padding:0;font:inherit;font-size:14px;font-weight:600;color:var(--accent);cursor:pointer}
.same{margin-top:12px;background:var(--card);border:1px solid var(--line);border-radius:14px;padding:12px 16px;font-size:14px}
.same summary{cursor:pointer;color:var(--muted)}
.same ul{list-style:none;margin:10px 0 0;padding:0}
.same li{display:flex;justify-content:space-between;padding:6px 0;color:var(--ink)}
.pdf{margin-top:14px;width:100%;border:1px solid var(--line);background:var(--card);border-radius:12px;padding:12px;font:inherit;font-weight:600;cursor:pointer}
.foot{margin:16px 0 0;text-align:center;font-size:11.5px;color:var(--faint)}
.sheet-bg{position:fixed;inset:0;background:rgba(10,12,18,.35);display:flex;align-items:flex-end;z-index:10}
.sheet{width:100%;background:#fff;border-radius:22px 22px 0 0;padding:10px 18px 24px;box-shadow:0 -10px 30px rgba(0,0,0,.15)}
.grab{width:40px;height:4px;border-radius:2px;background:#d9dce3;margin:0 auto 14px}
.sheet h3{margin:0 0 10px;font-size:17px}
.ctx{background:var(--bg);border-radius:10px;padding:10px 12px;font-size:13px;color:var(--muted);margin-bottom:12px}
.ctx span{display:block;font-size:11px;font-weight:700;color:var(--accent);text-transform:uppercase;letter-spacing:.06em;margin-bottom:2px}
.sheet label{font-size:13px;font-weight:600}
.sheet textarea{width:100%;min-height:84px;margin:6px 0 12px;border:1px solid var(--line);border-radius:10px;padding:10px;font:inherit;font-size:14px;resize:none}
.send{width:100%;border:0;background:var(--ink);color:#fff;border-radius:12px;padding:13px;font:inherit;font-weight:600;cursor:pointer}
.toast{position:fixed;left:16px;right:16px;bottom:18px;background:var(--ink);color:#fff;padding:10px 14px;border-radius:12px;font-size:13.5px;z-index:20;text-align:center}
@media (prefers-reduced-motion:reduce){.pp *{transition:none!important}}
`;
