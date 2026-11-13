"use client";

// Concept prototype: "Verification Hub" for Spendesk's periodic KYC/KYB review.
// Independent concept by Daniel Ade-Otoki. Not Spendesk's official UI, not affiliated with Spendesk.
// Built with Spendesk's open-source design system, Grapes (@dev-spendesk/grapes, MIT): Navigation, Callout,
// Tag, Button, IconButton, FileCard, Upload, Panel, Timeline, Toast, Avatar, HighlightIcon and Grapes tokens.
// Fictional company and people. Document names follow Spendesk's public help-centre KYC articles.

import { useEffect, useMemo, useState } from "react";
import "@dev-spendesk/grapes/style";
import "@dev-spendesk/grapes/token";
import {
  Avatar,
  Button,
  Callout,
  FileCard,
  GrapesProvider,
  HighlightIcon,
  Icon,
  IconButton,
  Panel,
  Tag,
  Timeline,
  TimelineItem,
  Toast,
  Upload,
} from "@dev-spendesk/grapes";

type Scenario = "checklist" | "precheck" | "delegate" | "submitted";
type Status = "ready" | "attention" | "todo" | "waiting";
type Check = { label: string; ok: boolean; note?: string };
type Item = {
  id: string;
  group: "company" | "people";
  title: string;
  who?: string;
  rule: string;
  file?: { name: string; meta: string };
  checks?: Check[];
  owner?: { name: string; role: string; email: string };
};

const LOCALES = {
  locales: {
    en: {
      cancel: "Cancel", close: "Close", nextMonth: "Next month", previousMonth: "Previous month",
      showOptions: "Show options", openCalendar: "Open calendar", show: "Show", hide: "Hide", edit: "Edit",
      clearSelection: "Clear selection", selectCurrency: "Select currency",
      deleteWithName: ({ name }: { [x: string]: string }) => `Delete ${name}`,
    },
  },
  fallbackLocale: "en",
};

const NAV: [string, "house" | "inbox" | "receipt" | "card" | "invoice" | "calculator" | "shield-star" | "gear"][] = [
  ["Home", "house"], ["Requests", "inbox"], ["Expenses", "receipt"], ["Cards", "card"], ["Invoices", "invoice"],
  ["Bookkeeping", "calculator"], ["Company verification", "shield-star"], ["Settings", "gear"],
];

const ITEMS: Item[] = [
  {
    id: "kbis", group: "company", title: "Certificate of incorporation (Kbis)",
    rule: "Issued in the last 3 months",
    file: { name: "Kbis_Northwind_Oct-2026.pdf", meta: "Issued 14 Oct 2026 · 2 pages" },
    checks: [{ label: "Issued in the last 3 months", ok: true }, { label: "Company name matches Northwind SAS", ok: true }],
  },
  {
    id: "shares", group: "company", title: "Shareholding structure",
    rule: "Signed and dated by a legal representative, under 3 months old",
    file: { name: "Cap-table_Northwind.pdf", meta: "Uploaded today · 1 page" },
    checks: [
      { label: "Dated in the last 3 months", ok: true, note: "Dated 2 Oct 2026" },
      { label: "Shows who owns 100% of the shares", ok: true },
      { label: "Signed by a legal representative", ok: false, note: "We couldn't find a signature. Sign and date the last page, then upload it again." },
    ],
  },
  {
    id: "articles", group: "company", title: "Articles of association",
    rule: "Latest signed version",
    file: { name: "Statuts_Northwind_2025.pdf", meta: "Signed 3 Mar 2025 · 14 pages" },
    checks: [{ label: "Signed", ok: true }, { label: "Latest version on file", ok: true }],
  },
  {
    id: "marie", group: "people", title: "Marie Laurent", who: "CEO · legal representative",
    rule: "ID in colour, front and back · proof of address under 3 months",
    file: { name: "ID-and-address_M-Laurent.pdf", meta: "2 documents · uploaded today" },
    checks: [{ label: "ID in colour, front and back", ok: true }, { label: "Proof of address under 3 months", ok: true, note: "Electricity bill, 21 Sep 2026" }],
  },
  {
    id: "thomas", group: "people", title: "Thomas Girard", who: "Co-founder · owns 32%",
    rule: "ID in colour, front and back · proof of address under 3 months",
    owner: { name: "Thomas Girard", role: "Co-founder", email: "thomas@northwind.example" },
  },
  {
    id: "business", group: "company", title: "Business activity",
    rule: "Confirm what you do and your expected monthly spend",
    file: { name: "Confirmed in Spendesk", meta: "Software for logistics · €40k–€80k a month" },
    checks: [{ label: "Activity confirmed", ok: true }, { label: "Expected spend confirmed", ok: true }],
  },
];

const STATUS: Record<Status, { label: string; variant: "success" | "alert" | "neutral" | "info"; icon: "circle-check" | "triangle-warning" | "clock-outline" | "envelope" }> = {
  ready: { label: "Ready", variant: "success", icon: "circle-check" },
  attention: { label: "Needs a fix", variant: "alert", icon: "triangle-warning" },
  todo: { label: "To do", variant: "neutral", icon: "clock-outline" },
  waiting: { label: "Waiting for Thomas", variant: "info", icon: "envelope" },
};

function startState(s: Scenario): Record<string, Status> {
  const base: Record<string, Status> = { kbis: "ready", shares: "attention", articles: "ready", marie: "ready", thomas: "todo", business: "ready" };
  if (s === "delegate") base.thomas = "waiting";
  if (s === "submitted") { base.shares = "ready"; base.thomas = "ready"; }
  return base;
}

export default function SpendeskVerificationHub() {
  const [scenario, setScenario] = useState<Scenario>("checklist");
  const [status, setStatus] = useState<Record<string, Status>>(startState("checklist"));
  const [open, setOpen] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [embed, setEmbed] = useState(false);
  const [ready, setReady] = useState(false);

  function apply(s: Scenario) {
    setScenario(s);
    setStatus(startState(s));
    setSubmitted(s === "submitted");
    setOpen(s === "precheck" ? "shares" : s === "delegate" ? "thomas" : null);
    setToast(null);
  }

  // URL options: ?scenario=checklist|precheck|delegate|submitted  ?embed=1 hides demo controls  ?sync=1 listens to /live/spendesk
  useEffect(() => {
    const q = new URLSearchParams(window.location.search);
    const s = q.get("scenario") as Scenario | null;
    if (s && ["checklist", "precheck", "delegate", "submitted"].includes(s)) apply(s);
    setEmbed(q.get("embed") === "1");
    setReady(true);
    if (q.get("sync") !== "1" || typeof BroadcastChannel === "undefined") return;
    const c = new BroadcastChannel("spendesk-verification-hub");
    c.onmessage = (e) => { if (e.data?.type === "scenario") apply(e.data.scenario); };
    return () => c.close();
  }, []);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 4200);
    return () => clearTimeout(t);
  }, [toast]);

  const readyCount = useMemo(() => Object.values(status).filter((v) => v === "ready").length, [status]);
  const total = ITEMS.length;
  const allReady = readyCount === total;
  const item = ITEMS.find((i) => i.id === open) ?? null;

  function fixShares() {
    setStatus((s) => ({ ...s, shares: "ready" }));
    setToast("Shareholding structure is ready");
  }
  function askThomas() {
    setStatus((s) => ({ ...s, thomas: "waiting" }));
    setToast("Request sent to Thomas Girard");
  }
  function thomasUploads() {
    setStatus((s) => ({ ...s, thomas: "ready" }));
    setToast("Thomas uploaded his documents");
  }
  function submit() {
    setSubmitted(true);
    setOpen(null);
    setToast("Sent for review");
  }

  return (
    <GrapesProvider locale="en" localesDefinition={LOCALES}>
      <style>{CSS}</style>
      <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" />
      <div className={`vh ${embed ? "is-embed" : ""} ${ready ? "is-ready" : ""}`}>
        {!embed && (
          <div className="demo" role="group" aria-label="Concept demo">
            <span className="demo-l">Concept demo</span>
            {(["checklist", "precheck", "delegate", "submitted"] as Scenario[]).map((s, i) => (
              <button key={s} className={scenario === s ? "on" : ""} aria-pressed={scenario === s} onClick={() => apply(s)}>
                {i + 1}. {{ checklist: "What's needed", precheck: "Pre-check", delegate: "Ask a shareholder", submitted: "Track review" }[s]}
              </button>
            ))}
          </div>
        )}

        <div className="app">
          <aside className="side">
            <div className="org">
              <Avatar text="Northwind SAS" size={32} variant="square" />
              <div><b>Northwind SAS</b><span>Marie Laurent</span></div>
              <Icon name="chevron-down" size="s" color="var(--grapes-color-content-secondary-bg-primary)" />
            </div>
            <nav className="nav" aria-label="Main">
              {NAV.map(([label, icon]) => {
                const on = label === "Company verification";
                return (
                  <a key={label} href="#" className={`nav-i ${on ? "on" : ""}`} aria-current={on ? "page" : undefined} onClick={(e) => e.preventDefault()}>
                    <Icon name={icon} size="m" />
                    <span>{label}</span>
                    {on && !submitted && <span className="dot" aria-label="Action needed" />}
                  </a>
                );
              })}
            </nav>
          </aside>

          <main className="main">
            <div className="crumb">Settings <Icon name="chevron-right" size="s" /> Company verification</div>
            <header className="head">
              <div>
                <h1>Annual company verification</h1>
                <p>Our banking partner asks us to check every company&apos;s details regularly. Only you, as Account Owner, can submit, but anyone can help.</p>
              </div>
              {!submitted ? (
                <div className="due"><Tag variant="warning" iconName="calendar-clock">Due 12 Dec 2026</Tag></div>
              ) : (
                <div className="due"><Tag variant="info" iconName="clock-outline">In review</Tag></div>
              )}
            </header>

            {!submitted ? (
              <>
                <section className="progress" aria-label="Progress">
                  <div className="p-top">
                    <b>{readyCount} of {total} ready</b>
                    <span>{allReady ? "Everything passed our checks. You can send it for review." : "We check each document as you upload it, so it isn't sent back later."}</span>
                  </div>
                  <div className="bar" role="progressbar" aria-valuemin={0} aria-valuemax={total} aria-valuenow={readyCount}>
                    <i style={{ transform: `scaleX(${readyCount / total})` }} />
                  </div>
                </section>

                {(["company", "people"] as const).map((g) => (
                  <section key={g} className="group">
                    <h2>{g === "company" ? "Company" : "People with control"}</h2>
                    <ul className="list">
                      {ITEMS.filter((i) => i.group === g).map((i) => {
                        const st = STATUS[status[i.id]];
                        return (
                          <li key={i.id}>
                            <button className={`row ${open === i.id ? "sel" : ""}`} onClick={() => setOpen(i.id)}>
                              {i.group === "people"
                                ? <Avatar text={i.title} size={32} />
                                : <HighlightIcon name={i.id === "business" ? "buildings-office" : "document"} size={32} variant="neutral" />}
                              <span className="r-txt">
                                <b>{i.title}</b>
                                <span>{i.who ? `${i.who} · ` : ""}{i.rule}</span>
                              </span>
                              <Tag variant={st.variant} iconName={st.icon}>{st.label}</Tag>
                              <Icon name="chevron-right" size="m" color="var(--grapes-color-content-secondary-bg-primary)" />
                            </button>
                          </li>
                        );
                      })}
                    </ul>
                  </section>
                ))}

                <footer className="foot">
                  <span>Review usually takes 2 working days. We&apos;ll email you and show the status here.</span>
                  <Button variant="primaryBrand" text={allReady ? "Send for review" : `Send for review · ${total - readyCount} left`} isDisabled={!allReady} onClick={submit} />
                </footer>
              </>
            ) : (
              <section className="review">
                <Callout variant="info" title="Your documents are with our compliance team" iconName="shield-star">
                  Nothing else is needed from you right now. If we have a question, you&apos;ll see it on this page as well as by email.
                </Callout>
                <div className="tl">
                  <Timeline renderDate={(d) => d.toLocaleDateString("en-GB", { day: "numeric", month: "short" })}>
                    <TimelineItem date={new Date(2026, 10, 13)}>
                      <div className="tl-i"><b>Sent for review</b><span>By Marie Laurent · 6 of 6 items passed our checks</span></div>
                    </TimelineItem>
                    <TimelineItem date={new Date(2026, 10, 13)}>
                      <div className="tl-i now"><b>In review</b><span>Our compliance team is checking your documents. Usually 2 working days.</span></div>
                    </TimelineItem>
                    <TimelineItem date={new Date(2026, 10, 17)}>
                      <div className="tl-i next"><b>Decision expected</b><span>We&apos;ll email you and update this page. Your next review: Nov 2027.</span></div>
                    </TimelineItem>
                  </Timeline>
                </div>
                <div className="sent">
                  <h2>What you sent</h2>
                  <div className="files">
                    {ITEMS.map((i) => (
                      <FileCard key={i.id} title={i.title} mimeType={i.id === "business" ? undefined : "application/pdf"}
                        description={i.id === "thomas" ? "Uploaded by Thomas Girard" : i.id === "shares" ? "Signed version · uploaded today" : i.file?.meta} />
                    ))}
                  </div>
                </div>
              </section>
            )}
            <p className="credit">Concept by Daniel Ade-Otoki · built with Spendesk&apos;s open-source Grapes design system · not Spendesk&apos;s official UI · fictional data</p>
          </main>

          {item && (
            <>
              <div className="scrim" onClick={() => setOpen(null)} />
              <div className="drawer" role="dialog" aria-label={item.title}>
                <Panel title={item.title} onClose={() => setOpen(null)}
                  footer={<PanelFooter item={item} status={status[item.id]} onFix={fixShares} onAsk={askThomas} onThomas={thomasUploads} onDone={() => setOpen(null)} />}>
                  <div className="d-body">
                    <p className="d-rule"><Icon name="circle-information" size="s" /> {item.rule}</p>

                    {item.id === "thomas" ? (
                      status.thomas === "todo" ? (
                        <>
                          <Callout variant="info" title="Thomas owns 32%, so his ID is needed">
                            You don&apos;t need to collect his documents yourself. We&apos;ll send him a secure link, and you&apos;ll see here when he&apos;s done.
                          </Callout>
                          <div className="ask">
                            <Avatar text="Thomas Girard" size={40} />
                            <div><b>Thomas Girard</b><span>{item.owner!.email}</span></div>
                          </div>
                          <ul className="need">
                            <li><Icon name="person" size="s" /> ID card or passport, in colour, front and back</li>
                            <li><Icon name="house" size="s" /> Proof of address from the last 3 months</li>
                          </ul>
                        </>
                      ) : status.thomas === "waiting" ? (
                        <>
                          <Callout variant="info" title="Waiting for Thomas" iconName="envelope">
                            We sent him a secure link today. He doesn&apos;t need a Spendesk account. We&apos;ll remind him in 2 days if he hasn&apos;t uploaded.
                          </Callout>
                          <ol className="steps">
                            <li className="done"><Icon name="check" size="s" /> Request sent · today, 10:18</li>
                            <li><span className="ring" /> Thomas uploads his ID and proof of address</li>
                            <li><span className="ring" /> We check them, then this item turns ready</li>
                          </ol>
                        </>
                      ) : (
                        <>
                          <Callout variant="success" title="Thomas's documents passed our checks" />
                          <FileCard title="ID-and-address_T-Girard.pdf" description="Uploaded by Thomas · today" mimeType="application/pdf" />
                        </>
                      )
                    ) : (
                      <>
                        {item.id === "shares" && status.shares === "attention" && (
                          <Callout variant="alert" title="This version would be sent back">
                            It isn&apos;t signed. Fix it now and you won&apos;t wait for another review round.
                          </Callout>
                        )}
                        {item.file && (
                          <FileCard title={item.id === "shares" && status.shares === "ready" ? "Cap-table_Northwind_signed.pdf" : item.file.name}
                            description={item.id === "shares" && status.shares === "ready" ? "Uploaded today · 1 page" : item.file.meta}
                            mimeType={item.id === "business" ? undefined : "application/pdf"}
                            variant={item.id === "shares" && status.shares === "attention" ? "alert" : "neutral"} />
                        )}
                        <div className="checks">
                          <h3><Icon name="magic-wand" size="s" /> Automatic checks</h3>
                          <ul>
                            {(item.checks ?? []).map((c) => {
                              const ok = c.ok || (item.id === "shares" && status.shares === "ready");
                              return (
                                <li key={c.label} className={ok ? "ok" : "bad"}>
                                  <Icon name={ok ? "circle-check" : "triangle-warning"} size="m" />
                                  <span><b>{c.label}</b>{c.note && !(ok && !c.ok) ? <em>{c.note}</em> : ok && !c.ok ? <em>Signed by Marie Laurent</em> : null}</span>
                                </li>
                              );
                            })}
                          </ul>
                        </div>
                        {item.id === "shares" && status.shares === "attention" && (
                          <Upload
                            content={<span className="up"><b>Upload the signed version</b><span>PDF, JPG or PNG · we check it straight away</span></span>}
                            activeDragContent={<span className="up"><b>Drop to upload</b></span>}
                            onUpload={() => fixShares()}
                            accept=".pdf,.jpg,.jpeg,.png"
                          />
                        )}
                      </>
                    )}
                  </div>
                </Panel>
              </div>
            </>
          )}

          {toast && (
            <div className="toast" role="status">
              <Toast title={toast} variant="success" onClose={() => setToast(null)} />
            </div>
          )}
        </div>
      </div>
    </GrapesProvider>
  );
}

function PanelFooter({ item, status, onFix, onAsk, onThomas, onDone }: {
  item: Item; status: Status; onFix: () => void; onAsk: () => void; onThomas: () => void; onDone: () => void;
}) {
  if (item.id === "shares" && status === "attention")
    return <div className="d-foot"><Button variant="secondaryNeutral" text="Close" onClick={onDone} /><Button variant="primaryBrand" iconName="arrow-up-tray" text="Use signed copy (demo)" onClick={onFix} /></div>;
  if (item.id === "thomas" && status === "todo")
    return <div className="d-foot"><Button variant="secondaryNeutral" text="I'll upload them myself" onClick={onDone} /><Button variant="primaryBrand" iconName="paper-plane" text="Ask Thomas to upload" onClick={onAsk} /></div>;
  if (item.id === "thomas" && status === "waiting")
    return <div className="d-foot"><Button variant="secondaryNeutral" text="Copy link" onClick={onDone} /><Button variant="primaryBrand" text="Simulate Thomas uploading (demo)" onClick={onThomas} /></div>;
  return <div className="d-foot"><Button variant="primaryBrand" text="Done" onClick={onDone} /></div>;
}

const CSS = `
:root{color-scheme:light;--grapes-ff-heading:"Inter",Helvetica,sans-serif;--ease:cubic-bezier(.23,1,.32,1)}
html,body{margin:0;background:var(--grapes-color-background-secondary-default)}
.vh{font-family:var(--grapes-ff-base);color:var(--grapes-color-content-primary);-webkit-font-smoothing:antialiased}
.vh *{box-sizing:border-box}
html:has(.vh.is-embed){overflow:hidden}
.demo{display:flex;gap:6px;align-items:center;flex-wrap:wrap;padding:8px 16px;border-bottom:1px dashed var(--grapes-color-border-default);background:#fff;font:var(--grapes-body-s)}
.demo-l{font-size:11px;letter-spacing:.08em;text-transform:uppercase;color:var(--grapes-color-content-secondary-bg-primary);margin-right:6px}
.demo button{all:unset;cursor:pointer;padding:5px 10px;border-radius:999px;border:1px solid var(--grapes-color-border-default);font:var(--grapes-body-s)}
.demo button.on{background:var(--grapes-color-background-primary-brand-default);border-color:transparent;color:#fff}
.demo button:focus-visible{outline:2px solid var(--grapes-color-content-brand-default);outline-offset:2px}
.app{position:relative;display:grid;grid-template-columns:240px minmax(0,1fr);height:800px;overflow:hidden;background:var(--grapes-color-background-secondary-default)}
.vh:not(.is-embed) .app{height:calc(100svh - 45px);min-height:640px}
.side{display:flex;flex-direction:column;gap:16px;padding:16px 12px;border-right:1px solid var(--grapes-color-border-default);background:var(--grapes-color-background-secondary-default)}
.org{display:flex;align-items:center;gap:10px;padding:8px;border-radius:var(--grapes-border-radius-8)}
.org div{display:flex;flex-direction:column;flex:1;min-width:0}
.org b{font:var(--grapes-title-m)}
.org span{font:var(--grapes-body-s);color:var(--grapes-color-content-secondary-bg-primary)}
.nav{display:flex;flex-direction:column;gap:2px}
.nav-i{display:flex;align-items:center;gap:10px;padding:8px 10px;border-radius:var(--grapes-border-radius-8);font:var(--grapes-body-m);color:var(--grapes-color-content-primary);text-decoration:none;transition:background-color 120ms ease}
.nav-i span:first-of-type{flex:1}
.nav-i svg{color:var(--grapes-color-content-secondary-bg-primary)}
.nav-i:hover{background:var(--grapes-color-background-navigation-item-hover)}
.nav-i.on{background:var(--grapes-color-background-navigation-item-active);font:var(--grapes-title-m)}
.nav-i.on svg{color:var(--grapes-color-content-primary)}
.nav-i:focus-visible{outline:2px solid var(--grapes-color-content-brand-default);outline-offset:-2px}
.dot{width:8px;height:8px;border-radius:50%;background:var(--grapes-color-content-alert-default);display:inline-block}
.main{overflow:auto;padding:24px 48px 32px;background:var(--grapes-color-background-primary-default);border-radius:12px 0 0 0;margin-top:8px}
.crumb{display:flex;align-items:center;gap:4px;font:var(--grapes-body-s);color:var(--grapes-color-content-secondary-bg-primary)}
.head{display:flex;justify-content:space-between;gap:24px;align-items:flex-start;margin:8px 0 20px;max-width:820px}
.head h1{margin:0;font:var(--grapes-heading-l);letter-spacing:-.01em}
.head p{margin:6px 0 0;font:var(--grapes-body-m);font-weight:400;color:var(--grapes-color-content-secondary-bg-primary);max-width:600px}
.due{padding-top:6px;flex-shrink:0}
.progress{max-width:820px;padding:16px;border:1px solid var(--grapes-color-border-default);border-radius:var(--grapes-border-radius-12);margin-bottom:20px}
.p-top{display:flex;justify-content:space-between;gap:16px;align-items:baseline;margin-bottom:10px}
.p-top b{font:var(--grapes-title-l)}
.p-top span{font:var(--grapes-body-s);color:var(--grapes-color-content-secondary-bg-primary);text-align:right}
.bar{height:8px;border-radius:99px;background:var(--grapes-color-background-secondary-default);overflow:hidden}
.bar i{display:block;height:100%;background:var(--_grapes-color-emerald-60);transform-origin:left;transition:transform 400ms var(--ease)}
.group{max-width:820px;margin-bottom:16px}
.group h2{margin:0 0 8px;font:var(--grapes-title-s);text-transform:uppercase;letter-spacing:.06em;color:var(--grapes-color-content-secondary-bg-primary)}
.list{list-style:none;margin:0;padding:0;border:1px solid var(--grapes-color-border-default);border-radius:var(--grapes-border-radius-12);overflow:hidden}
.list li+li{border-top:1px solid var(--grapes-color-border-default)}
.row{all:unset;box-sizing:border-box;display:flex;align-items:center;gap:12px;width:100%;padding:12px 16px;cursor:pointer;transition:background-color 120ms ease}
.row:hover,.row.sel{background:var(--grapes-color-background-primary-hover)}
.row:focus-visible{outline:2px solid var(--grapes-color-content-brand-default);outline-offset:-2px}
.r-txt{display:flex;flex-direction:column;flex:1;min-width:0}
.r-txt b{font:var(--grapes-title-m)}
.r-txt span{font:var(--grapes-body-s);color:var(--grapes-color-content-secondary-bg-primary);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.foot{position:sticky;bottom:-32px;max-width:820px;display:flex;align-items:center;justify-content:space-between;gap:16px;padding:16px 0 4px;background:linear-gradient(transparent,#fff 30%)}
.foot span{font:var(--grapes-body-s);color:var(--grapes-color-content-secondary-bg-primary)}
.review{max-width:820px;display:flex;flex-direction:column;gap:20px}
.tl{padding:20px;border:1px solid var(--grapes-color-border-default);border-radius:var(--grapes-border-radius-12)}
.tl-i{display:flex;flex-direction:column;gap:2px}
.tl-i b{font:var(--grapes-title-m)}
.tl-i span{font:var(--grapes-body-s);color:var(--grapes-color-content-secondary-bg-primary)}
.tl-i.now b{color:var(--grapes-color-content-brand-default)}
.tl-i.next{opacity:.7}
.sent h2{margin:0 0 8px;font:var(--grapes-title-s);text-transform:uppercase;letter-spacing:.06em;color:var(--grapes-color-content-secondary-bg-primary)}
.files{display:grid;grid-template-columns:1fr 1fr;gap:8px}
.credit{margin:24px 0 0;font:var(--grapes-body-s);font-size:11px;color:var(--grapes-color-content-secondary-bg-primary)}
.vh.is-embed .credit{display:none}
.scrim{position:absolute;inset:0;background:rgb(25 27 27 / .18);animation:fade 200ms ease-out}
.drawer{position:absolute;top:8px;right:8px;bottom:8px;width:420px;display:flex;animation:slide 280ms var(--ease)}
.drawer>*{flex:1;display:flex;flex-direction:column;box-shadow:var(--grapes-elevation-l);min-height:0}
.d-body{display:flex;flex-direction:column;gap:14px}
.d-rule{display:flex;gap:6px;align-items:flex-start;margin:0;font:var(--grapes-body-s);color:var(--grapes-color-content-secondary-bg-primary)}
.d-rule svg{flex-shrink:0;margin-top:2px}
.d-foot{display:flex;justify-content:flex-end;gap:8px;width:100%}
.checks h3{display:flex;gap:6px;align-items:center;margin:4px 0 8px;font:var(--grapes-title-m)}
.checks ul{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:8px}
.checks li{display:flex;gap:10px;align-items:flex-start;padding:10px 12px;border-radius:var(--grapes-border-radius-8);background:var(--grapes-color-background-secondary-default)}
.checks li span{display:flex;flex-direction:column;gap:2px}
.checks li b{font:var(--grapes-body-m)}
.checks li em{font:var(--grapes-body-s);font-style:normal;color:var(--grapes-color-content-secondary-bg-primary)}
.checks li.ok svg{color:var(--grapes-color-content-success-default);flex-shrink:0}
.checks li.bad{background:var(--grapes-color-background-secondary-alert-default)}
.checks li.bad svg{color:var(--grapes-color-content-alert-default);flex-shrink:0}
.checks li.bad em{color:var(--grapes-color-content-primary)}
.up{display:flex;flex-direction:column;align-items:center;gap:2px;font:var(--grapes-body-s)}
.up b{font:var(--grapes-title-m)}
.ask{display:flex;gap:12px;align-items:center;padding:12px;border:1px solid var(--grapes-color-border-default);border-radius:var(--grapes-border-radius-8)}
.ask div{display:flex;flex-direction:column}
.ask b{font:var(--grapes-title-m)}
.ask span{font:var(--grapes-body-s);color:var(--grapes-color-content-secondary-bg-primary)}
.need{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:8px;font:var(--grapes-body-m);font-weight:400}
.need li{display:flex;gap:8px;align-items:center}
.steps{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:12px;font:var(--grapes-body-m);font-weight:400}
.steps li{display:flex;gap:10px;align-items:center;color:var(--grapes-color-content-secondary-bg-primary)}
.steps li.done{color:var(--grapes-color-content-primary)}
.steps li.done svg{color:var(--grapes-color-content-success-default)}
.ring{width:14px;height:14px;border-radius:50%;border:2px solid var(--grapes-color-border-default);flex-shrink:0}
.toast{position:absolute;left:50%;bottom:24px;transform:translateX(-50%);z-index:20;animation:rise 260ms var(--ease)}
@keyframes fade{from{opacity:0}}
@keyframes slide{from{transform:translateX(24px);opacity:0}}
@keyframes rise{from{transform:translate(-50%,12px);opacity:0}}
@media (prefers-reduced-motion:reduce){.drawer,.toast{animation:fade 150ms ease-out}.bar i{transition:none}}
`;
