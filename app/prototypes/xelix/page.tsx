"use client";

// Concept prototype: "Verified Replies" for Xelix Helpdesk.
// Independent concept by Daniel Ade-Otoki. Not Xelix's official UI, not affiliated with Xelix.
// Layout follows Xelix's public Helpdesk screenshots (xelix.com/platform/helpdesk): purple left rail, Dashboard/Inbox/Kanban,
// inbox list with category tags, ticket header with Status/Priority/Categories/Assignee/Source/Vendors, the
// "Accept or discard generated reply?" banner and the Activity/Comments panel. No Xelix logo. Fictional vendors and invoices.

import { useEffect, useState } from "react";

type Scenario = "draft" | "fixed" | "sent";
type Inv = { id: string; amount: string; status: "scheduled" | "hold" | "paid"; detail: string; ledger: string };

const INVOICES: Inv[] = [
  { id: "PP-2172246", amount: "£4,180.00", status: "scheduled", detail: "Approved 4 Nov · in pay run of Fri 20 Nov", ledger: "ERP · AP ledger line 88213" },
  { id: "PP-2166142", amount: "£1,295.40", status: "hold", detail: "On hold: no goods receipt for PO 77812", ledger: "ERP · 3-way match failed 6 Nov" },
  { id: "PP-2169089", amount: "£2,760.00", status: "paid", detail: "Paid 10 Nov · BACS ref XLX-55190", ledger: "Remittance sent 10 Nov" },
];

const TICKETS = [
  { name: "Joseph Myers", subj: "Upcoming due invoices", snip: "We'd like to bring your attention to the following in…", tag: "Invoice", id: "#339962", when: "13/11/2026 at 09:56", active: true },
  { name: "Martha Steward; Accounts Rec…", subj: "Legal action notice", snip: "Hello AP Team, I hope you are all doing well. I am f…", tag: "Important", id: "#339967", when: "13/11/2026 at 09:05" },
  { name: "Janet Becker; Vaughan, Horton", subj: "Payment reminder", snip: "Thank you for your reminder. Please note all invoic…", tag: "Invoice", id: "#339974", when: "12/11/2026 at 16:42" },
  { name: "Laura Wright", subj: "Importe de factura incorrecto", snip: "Hola. Por favor, tenga en cuenta que hemos com…", tag: "Reminder", id: "#339975", when: "12/11/2026 at 15:16" },
  { name: "Ravi Patel", subj: "Statement for October", snip: "Please find attached our statement of account for…", tag: "Statement", id: "#339970", when: "12/11/2026 at 11:30" },
];

export default function XelixVerifiedReplies() {
  const [scenario, setScenario] = useState<Scenario>("draft");
  const [tab, setTab] = useState<"evidence" | "activity">("evidence");
  const [embed, setEmbed] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  function apply(s: Scenario) { setScenario(s); setTab("evidence"); setToast(s === "sent" ? "Reply sent · evidence saved to ticket #339962" : null); }

  // URL options: ?scenario=draft|fixed|sent  ?embed=1 hides demo controls  ?sync=1 listens to /live/xelix
  useEffect(() => {
    const q = new URLSearchParams(window.location.search);
    const s = q.get("scenario") as Scenario | null;
    if (s && ["draft", "fixed", "sent"].includes(s)) apply(s);
    setEmbed(q.get("embed") === "1");
    if (q.get("sync") !== "1" || typeof BroadcastChannel === "undefined") return;
    const c = new BroadcastChannel("xelix-verified-replies");
    c.onmessage = (e) => { if (e.data?.type === "scenario") apply(e.data.scenario); };
    return () => c.close();
  }, []);

  useEffect(() => { if (!toast) return; const t = setTimeout(() => setToast(null), 4000); return () => clearTimeout(t); }, [toast]);

  const conflicts = scenario === "draft" ? 2 : 0;

  return (
    <div className={`xv ${embed ? "is-embed" : ""}`}>
      <style>{CSS}</style>
      <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Barlow:wght@400;500;600;700&display=swap" />
      {!embed && (
        <div className="demo" role="group" aria-label="Concept demo">
          <span className="demo-l">Concept demo</span>
          {(["draft", "fixed", "sent"] as Scenario[]).map((s, i) => (
            <button key={s} className={scenario === s ? "on" : ""} aria-pressed={scenario === s} onClick={() => apply(s)}>
              {i + 1}. {{ draft: "AI draft is checked", fixed: "Draft fixed from evidence", sent: "Sent with proof" }[s]}
            </button>
          ))}
        </div>
      )}
      <div className="app">
        <nav className="rail" aria-label="Modules">
          <span className="mark" aria-hidden="true" />
          {["⇆", "☑", "◫", "↗", "✉"].map((g, i) => <span key={i} className={`ri ${i === 4 ? "on" : ""}`} aria-hidden="true">{g}</span>)}
          <span className="ri bottom" aria-hidden="true">⚙</span>
        </nav>

        <div className="body">
          <header className="top">
            <div className="tabs"><span>Dashboard</span><span className="on">Inbox</span><span>Kanban</span></div>
            <div className="search">⌕ Search Helpdesk <kbd>⌘K</kbd></div>
          </header>

          <div className="cols">
            <aside className="inbox">
              <div className="ib-h"><b>Inbox</b><span className="sel">☐ Select all</span></div>
              <ul>
                {TICKETS.map((t) => (
                  <li key={t.id} className={t.active ? "on" : ""}>
                    <div className="t1"><b>{t.name}</b></div>
                    <div className="t2"><span>{t.subj}</span><span className="dt">{t.when}</span></div>
                    <p>{t.snip}</p>
                    <div className="t3">
                      <span className={`tg ${t.tag.toLowerCase()}`}>{t.tag}</span>
                      <span className="tid">{t.id} · {t.active && scenario === "sent" ? "Complete" : "New"}</span>
                    </div>
                  </li>
                ))}
              </ul>
            </aside>

            <main className="ticket">
              <div className="th">
                <div className="tmeta">Ticket <a>#339962</a> · 13/11/2026 at 09:56 <span className="focus">◷ Focused</span></div>
                <h1>Upcoming due invoices</h1>
                <div className="fields">
                  {[["Status", scenario === "sent" ? "Complete" : "New"], ["Priority", "Low"], ["Categories", "Invoice · Reminder"], ["Assignee", "Tony Russell"], ["Source", "Internal"], ["Vendors", "Barber Ltd"]].map(([k, v]) => (
                    <div key={k}><span>{k}</span><b>{v} ⌄</b></div>
                  ))}
                </div>
              </div>

              {scenario === "draft" && (
                <div className="gen warn" role="status">
                  <span className="ic">!</span>
                  <span><b>2 invoices in this reply don&apos;t match the ledger.</b> Check the evidence before using it.</span>
                  <button className="btn ghost" onClick={() => apply("fixed")}>Fix from evidence</button>
                  <button className="btn" disabled title="Fix the conflicts first">Use as draft ✓</button>
                </div>
              )}
              {scenario === "fixed" && (
                <div className="gen ok" role="status">
                  <span className="ic">✓</span>
                  <span><b>Every invoice in this reply matches the ledger.</b> 3 of 3 checked against ERP.</span>
                  <button className="btn ghost">Start blank reply</button>
                  <button className="btn" onClick={() => apply("sent")}>Use as draft ✓</button>
                </div>
              )}
              {scenario === "sent" && (
                <div className="gen sent" role="status">
                  <span className="ic">✓</span>
                  <span><b>Sent to Joseph Myers at 10:04.</b> The evidence behind each line is saved to the ticket.</span>
                </div>
              )}

              <div className="editor">
                <div className="tool">Paragraph ⌄ <span>B</span><span>I</span><span>A</span><span>≡</span><span>¶</span></div>
                <div className="mail">
                  <p>Dear Joseph,</p>
                  <p>Thank you for bringing the upcoming due invoices to our attention.{scenario === "draft" ? " We have noted the following invoice numbers:" : " Here's where each one stands:"}</p>
                  {scenario === "draft" ? (
                    <>
                      <p className="mono">
                        <mark className="ok">PP-2172246</mark><br />
                        <mark className="bad">PP-2166142</mark><br />
                        <mark className="bad">PP-2169089</mark>
                      </p>
                      <p><mark className="bad">We will ensure these invoices are processed for payment as they become due.</mark></p>
                    </>
                  ) : (
                    <ul className="lines">
                      <li><b>PP-2172246</b> (£4,180.00) is approved and in our pay run on Friday 20 November.</li>
                      <li><b>PP-2166142</b> (£1,295.40) is on hold because we haven&apos;t received the goods receipt for PO 77812. Could you send the signed delivery note?</li>
                      <li><b>PP-2169089</b> (£2,760.00) was paid on 10 November, BACS reference XLX-55190.</li>
                    </ul>
                  )}
                  <p>Best regards,<br />Tony Russell</p>
                </div>
              </div>

              <div className="orig">
                <div className="oh"><span className="tg plain">Inbox</span><span className="gs">Generate Summary ✦</span></div>
                <p className="from"><b>Joseph Myers</b> &lt;ar@barber-ltd.example&gt; · 13/11/2026 at 09:56</p>
                <p>We&apos;d like to bring your attention to the following invoices that are due this month: PP-2172246, PP-2166142, PP-2169089.</p>
              </div>
            </main>

            <aside className="side">
              <div className="sh">
                <button className={tab === "evidence" ? "on" : ""} onClick={() => setTab("evidence")}>Evidence {conflicts > 0 && <i className="cnt">{conflicts}</i>}</button>
                <button className={tab === "activity" ? "on" : ""} onClick={() => setTab("activity")}>Activity</button>
                <button>Comments (0)</button>
              </div>
              {tab === "evidence" ? (
                <div className="ev">
                  <p className="evh">What the reply says vs. what the ledger says</p>
                  {INVOICES.map((v) => {
                    const claimBad = scenario === "draft" && v.status !== "scheduled";
                    return (
                      <div key={v.id} className={`card ${claimBad ? "bad" : "ok"}`}>
                        <div className="c1"><b>{v.id}</b><span>{v.amount}</span></div>
                        <div className={`st ${v.status}`}>{{ scheduled: "Scheduled · pay run 20 Nov", hold: "On hold · missing goods receipt", paid: "Paid 10 Nov" }[v.status]}</div>
                        <p>{v.detail}</p>
                        <p className="src">{v.ledger}</p>
                        {claimBad && <p className="claim">Draft says it will be paid when due. {v.status === "paid" ? "It's already paid." : "It can't be paid until the hold is cleared."}</p>}
                      </div>
                    );
                  })}
                  <p className="foot">Checked against Barber Ltd&apos;s vendor record and AP ledger at 10:01.</p>
                </div>
              ) : (
                <ul className="act">
                  <li>09:56 · Email received, categorised as Invoice · Reminder</li>
                  <li>09:57 · Reply generated from ERP data</li>
                  <li>10:01 · 3 invoices checked against the ledger{scenario === "draft" ? ", 2 conflicts" : ""}</li>
                  {scenario !== "draft" && <li>10:02 · Draft corrected from evidence</li>}
                  {scenario === "sent" && <li>10:04 · Sent by Tony Russell, evidence saved</li>}
                </ul>
              )}
            </aside>
          </div>
        </div>
        {toast && <div className="toast" role="status">✓ {toast}</div>}
      </div>
      {!embed && <p className="credit">Concept by Daniel Ade-Otoki · not Xelix&apos;s official UI · fictional vendors and invoices</p>}
    </div>
  );
}

const CSS = `
html,body{margin:0;background:#f4f3f8}
.xv{--ink:#1b1b2b;--mut:#6b6b7b;--line:#e6e4ee;--p:#5b2bc4;--p2:#3b1680;--pl:#efeaff;--ok:#1f8a4c;--okbg:#e8f6ee;--bad:#c62b3b;--badbg:#fdecee;--warnbg:#fff4e0;--blue:#e8f1fe;
 font-family:Barlow,Inter,system-ui,sans-serif;color:var(--ink);-webkit-font-smoothing:antialiased}
.xv *{box-sizing:border-box}
.demo{display:flex;gap:6px;align-items:center;flex-wrap:wrap;padding:8px 16px;border-bottom:1px dashed #d7d3e4;background:#fff;font-size:13px}
.demo-l{font-size:11px;letter-spacing:.08em;text-transform:uppercase;color:var(--mut);margin-right:6px}
.demo button{all:unset;cursor:pointer;padding:5px 11px;border-radius:999px;border:1px solid var(--line)}
.demo button.on{background:var(--p);color:#fff;border-color:transparent}
.demo button:focus-visible,.btn:focus-visible,.sh button:focus-visible{outline:2px solid var(--p);outline-offset:2px}
.app{position:relative;display:grid;grid-template-columns:56px 1fr;height:800px;overflow:hidden;background:#fff}
.xv:not(.is-embed) .app{height:calc(100svh - 64px);min-height:640px}
.rail{display:flex;flex-direction:column;align-items:center;gap:18px;padding:14px 0;background:linear-gradient(180deg,#2b1160,#4a1d96)}
.mark{width:28px;height:28px;border-radius:7px;background:rgba(255,255,255,.18)}
.ri{width:34px;height:34px;display:grid;place-items:center;border-radius:8px;color:#d9ccff;font-size:16px}
.ri.on{background:rgba(255,255,255,.18);color:#fff}
.ri.bottom{margin-top:auto}
.body{display:flex;flex-direction:column;min-width:0}
.top{display:flex;align-items:center;justify-content:space-between;padding:10px 18px;border-bottom:1px solid var(--line)}
.tabs{display:flex;gap:6px;font-size:14px;font-weight:600}
.tabs span{padding:5px 10px;border-radius:6px}
.tabs .on{background:var(--p);color:#fff}
.search{font-size:13px;color:var(--mut);border:1px solid var(--line);border-radius:8px;padding:6px 10px;width:260px}
.search kbd{float:right;font-family:inherit;font-size:11px;color:var(--p);background:var(--pl);border-radius:4px;padding:0 4px}
.cols{display:grid;grid-template-columns:270px minmax(0,1fr) 300px;flex:1;min-height:0}
.inbox{border-right:1px solid var(--line);overflow:auto;background:#fbfafd}
.ib-h{display:flex;justify-content:space-between;align-items:center;padding:12px 14px;font-size:15px}
.sel{font-size:12px;color:var(--mut)}
.inbox ul{list-style:none;margin:0;padding:0}
.inbox li{padding:10px 14px;border-top:1px solid var(--line);font-size:13px}
.inbox li.on{background:#fff;box-shadow:inset 3px 0 0 var(--p)}
.t1 b{font-size:14px}
.t2{display:flex;justify-content:space-between;gap:8px;font-weight:600;font-size:12.5px;margin-top:2px}
.t2 .dt{font-weight:400;color:var(--mut);white-space:nowrap}
.inbox p{margin:3px 0 6px;color:var(--mut);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.t3{display:flex;justify-content:space-between;align-items:center}
.tid{font-size:11.5px;color:var(--mut)}
.tg{font-size:11.5px;font-weight:600;padding:1px 8px;border-radius:999px;border:1px solid}
.tg.invoice{color:var(--ok);border-color:#9fd8b6;background:var(--okbg)}
.tg.important{color:var(--p);border-color:#c9b6f5;background:var(--pl)}
.tg.reminder{color:#8a5a00;border-color:#f0cf86;background:#fff6dd}
.tg.statement{color:var(--p);border-color:#c9b6f5;background:#f6f2ff}
.tg.plain{color:var(--ink);border-color:var(--line);background:#fff;border-radius:4px}
.ticket{overflow:auto;padding:12px 18px 20px;display:flex;flex-direction:column;gap:10px;min-width:0}
.tmeta{font-size:12px;color:var(--mut)}
.tmeta a{color:var(--p);font-weight:600}
.focus{margin-left:6px;font-size:11.5px;font-weight:600;color:#fff;background:#b23cc9;border-radius:5px;padding:1px 6px}
.th h1{margin:3px 0 8px;font-size:17px;font-weight:700}
.fields{display:flex;gap:16px;flex-wrap:wrap}
.fields div{display:flex;flex-direction:column;gap:2px;font-size:11.5px}
.fields span{color:var(--mut);font-weight:600}
.fields b{font-size:12px;background:#f4f2fa;border-radius:5px;padding:2px 7px}
.gen{display:flex;align-items:center;gap:10px;padding:9px 12px;border-radius:8px;font-size:13.5px;animation:in 220ms cubic-bezier(.23,1,.32,1)}
.gen>span:nth-child(2){flex:1}
.gen .ic{width:20px;height:20px;border-radius:50%;display:grid;place-items:center;font-weight:700;font-size:12px;color:#fff;flex-shrink:0}
.gen.warn{background:var(--warnbg);border:1px solid #f1d39a}.gen.warn .ic{background:#d4880f}
.gen.ok{background:var(--blue);border:1px solid #c7dcfb}.gen.ok .ic{background:#2f6fe0}
.gen.sent{background:var(--okbg);border:1px solid #b9e3c9}.gen.sent .ic{background:var(--ok)}
.btn{all:unset;cursor:pointer;font-size:13px;font-weight:600;padding:6px 12px;border-radius:6px;background:var(--p);color:#fff;white-space:nowrap;transition:transform 160ms cubic-bezier(.23,1,.32,1),background-color 160ms ease}
.btn:active{transform:scale(.97)}
.btn.ghost{background:#fff;color:var(--p);border:1px solid #c9b6f5}
.btn:disabled{background:#cfc8e0;cursor:not-allowed}
.editor{border:1px solid var(--line);border-radius:8px}
.tool{display:flex;gap:16px;font-size:12px;color:var(--mut);padding:7px 12px;border-bottom:1px solid var(--line)}
.mail{padding:10px 14px;font-size:14px;line-height:1.55}
.mail p{margin:0 0 10px}
.mono{font-variant-numeric:tabular-nums}
mark{background:none;padding:0 2px;border-radius:3px}
mark.ok{box-shadow:inset 0 -2px 0 #6cc596}
mark.bad{background:var(--badbg);box-shadow:inset 0 -2px 0 var(--bad)}
.lines{margin:0 0 10px;padding-left:18px;display:flex;flex-direction:column;gap:6px}
.orig{border:1px solid var(--line);border-radius:8px;padding:10px 14px;font-size:13px}
.orig p{margin:6px 0 0}
.oh{display:flex;justify-content:space-between;align-items:center}
.gs{font-size:12px;font-weight:600;color:var(--p)}
.from{color:var(--mut)}
.side{border-left:1px solid var(--line);display:flex;flex-direction:column;min-height:0}
.sh{display:flex;gap:4px;padding:10px 12px 0;border-bottom:1px solid var(--line)}
.sh button{all:unset;cursor:pointer;font-size:13px;font-weight:600;padding:6px 8px 9px;color:var(--mut);border-bottom:2px solid transparent;display:flex;gap:6px;align-items:center}
.sh button.on{color:var(--p);border-color:var(--p)}
.cnt{font-style:normal;font-size:11px;color:#fff;background:var(--bad);border-radius:999px;padding:0 6px}
.ev{padding:12px;overflow:auto;display:flex;flex-direction:column;gap:9px}
.evh{margin:0;font-size:12px;font-weight:600;color:var(--mut);text-transform:uppercase;letter-spacing:.04em}
.card{border:1px solid var(--line);border-radius:8px;padding:9px 11px;font-size:12.5px;transition:border-color 200ms ease,background-color 200ms ease}
.card.bad{border-color:#f2b7be;background:#fffafa}
.card p{margin:3px 0 0;color:var(--mut)}
.c1{display:flex;justify-content:space-between;font-size:13.5px}
.st{display:inline-block;margin-top:5px;font-size:11.5px;font-weight:700;padding:1px 7px;border-radius:999px}
.st.scheduled{color:#2f6fe0;background:var(--blue)}
.st.hold{color:#8a5a00;background:#fff3d6}
.st.paid{color:var(--ok);background:var(--okbg)}
.src{font-size:11.5px}
.claim{color:var(--bad)!important;font-weight:600}
.foot{margin:2px 0 0;font-size:11.5px;color:var(--mut)}
.act{list-style:none;margin:0;padding:12px;display:flex;flex-direction:column;gap:9px;font-size:12.5px;color:var(--mut)}
.toast{position:absolute;left:50%;bottom:22px;transform:translateX(-50%);background:#1d1b2b;color:#fff;font-size:13px;padding:9px 14px;border-radius:8px;animation:up 260ms cubic-bezier(.23,1,.32,1)}
.credit{margin:10px 16px;font-size:11px;color:var(--mut)}
@keyframes in{from{opacity:0;transform:translateY(-4px)}}
@keyframes up{from{opacity:0;transform:translate(-50%,10px)}}
@media (prefers-reduced-motion:reduce){.gen,.toast{animation:none}.btn,.card{transition:none}}
`;
