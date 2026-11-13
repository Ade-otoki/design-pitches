"use client";

// Concept prototype: "Move-in Check" for HousingAnywhere's post-booking experience (mobile).
// Independent concept by Daniel Ade-Otoki. Not HousingAnywhere's official UI, not affiliated with HousingAnywhere.
// Visual language from housinganywhere.com: deep teal-navy ink (#002630), slate text, orange accent (#FF4C27),
// pale blue-grey surfaces, Inter. No HousingAnywhere logo. Fictional tenant, landlord and address.
// Rule shown is from HousingAnywhere's help centre: the first payment is held until 48 hours after the official move-in date.

import { useEffect, useState } from "react";

type Scenario = "before" | "checkin" | "report";
type Item = { id: string; label: string; hint: string };

const ITEMS: Item[] = [
  { id: "keys", label: "Got the keys", hint: "Front door and room" },
  { id: "match", label: "Room matches the listing", hint: "Size, furniture, photos" },
  { id: "clean", label: "Clean and safe", hint: "No damp, mould or damage" },
  { id: "heat", label: "Heating and hot water work", hint: "Run the shower for a minute" },
  { id: "wifi", label: "Wi-Fi works", hint: "If it was in the listing" },
];

export default function HousingAnywhereMoveInCheck() {
  const [scenario, setScenario] = useState<Scenario>("before");
  const [done, setDone] = useState<Record<string, boolean>>({});
  const [embed, setEmbed] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  function apply(s: Scenario) {
    setScenario(s);
    setDone(s === "before" ? {} : { keys: true, match: true, clean: true, wifi: true, ...(s === "report" ? {} : {}) });
    setToast(s === "report" ? "Report sent · your €650 stays protected" : null);
  }

  // URL options: ?scenario=before|checkin|report  ?embed=1 hides demo controls  ?sync=1 listens to /live/housinganywhere
  useEffect(() => {
    const q = new URLSearchParams(window.location.search);
    const s = q.get("scenario") as Scenario | null;
    if (s && ["before", "checkin", "report"].includes(s)) apply(s);
    setEmbed(q.get("embed") === "1");
    if (q.get("sync") !== "1" || typeof BroadcastChannel === "undefined") return;
    const c = new BroadcastChannel("ha-move-in-check");
    c.onmessage = (e) => { if (e.data?.type === "scenario") apply(e.data.scenario); };
    return () => c.close();
  }, []);

  useEffect(() => { if (!toast) return; const t = setTimeout(() => setToast(null), 3800); return () => clearTimeout(t); }, [toast]);

  const count = ITEMS.filter((i) => done[i.id]).length;

  return (
    <div className={`ha ${embed ? "is-embed" : ""}`}>
      <style>{CSS}</style>
      <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" />
      {!embed && (
        <div className="demo" role="group" aria-label="Concept demo">
          <span className="demo-l">Concept demo</span>
          {(["before", "checkin", "report"] as Scenario[]).map((s, i) => (
            <button key={s} className={scenario === s ? "on" : ""} aria-pressed={scenario === s} onClick={() => apply(s)}>
              {i + 1}. {{ before: "Before move-in", checkin: "Move-in check", report: "Something's wrong" }[s]}
            </button>
          ))}
        </div>
      )}

      <div className="screen">
        <header className="bar">
          <span className="back" aria-hidden="true">‹</span>
          <b>Your stay</b>
          <span className="help" aria-hidden="true">?</span>
        </header>

        <section className="home">
          <div className="ph" aria-hidden="true"><span>Room photo</span></div>
          <div>
            <b>Bright room near Blaak</b>
            <span>Rotterdam · 1 Dec 2026 – 31 May 2027</span>
            <span>Landlord: Eva de Vries</span>
          </div>
        </section>

        {scenario === "before" && (
          <>
            <section className="card hero">
              <p className="eyebrow">Move-in</p>
              <h1>Mon 1 Dec, 14:00</h1>
              <p className="sub">Eva confirmed this time. She&apos;ll meet you at the front door with the keys.</p>
              <div className="row2"><button className="chip">Add to calendar</button><button className="chip">Message Eva</button></div>
            </section>
            <section className="card">
              <h2>Your €650 is protected</h2>
              <ol className="tl">
                <li className="done"><i />Paid · held by HousingAnywhere<span>12 Nov</span></li>
                <li><i />You move in<span>1 Dec, 14:00</span></li>
                <li><i />48-hour room check<span>until 3 Dec, 14:00</span></li>
                <li><i />Payment released to Eva<span>3 Dec, 14:00</span></li>
              </ol>
              <p className="note">If the room isn&apos;t as described, report it within 48 hours of moving in for a full refund of your first month.</p>
            </section>
          </>
        )}

        {scenario !== "before" && (
          <section className={`card timer ${scenario === "report" ? "held" : ""}`}>
            {scenario === "checkin" ? (
              <>
                <div className="clock" aria-hidden="true"><span>45h</span><small>left</small></div>
                <div>
                  <h2>Check your room</h2>
                  <p>Report anything that isn&apos;t as listed before <b>Wed 3 Dec, 14:00</b>. After that, your €650 goes to Eva.</p>
                </div>
              </>
            ) : (
              <>
                <div className="clock warn" aria-hidden="true"><span>⏸</span><small>held</small></div>
                <div>
                  <h2>We&apos;re looking into it</h2>
                  <p>Your €650 stays with us until this is resolved. Our team replies within <b>12 hours</b>.</p>
                </div>
              </>
            )}
          </section>
        )}

        {scenario !== "before" && (
          <section className="card">
            <div className="ch"><h2>Move-in check</h2><span>{count}/{ITEMS.length}</span></div>
            <ul className="list">
              {ITEMS.map((it) => {
                const bad = scenario === "report" && it.id === "heat";
                const ok = !!done[it.id];
                return (
                  <li key={it.id} className={bad ? "bad" : ok ? "ok" : ""}>
                    <button
                      className="tick"
                      aria-pressed={ok}
                      aria-label={`${it.label}: ${bad ? "problem reported" : ok ? "checked" : "not checked"}`}
                      onClick={() => scenario === "checkin" && setDone((d) => ({ ...d, [it.id]: !d[it.id] }))}
                    >{bad ? "!" : ok ? "✓" : ""}</button>
                    <span className="lt"><b>{it.label}</b><span>{bad ? "No hot water · 2 photos added" : it.hint}</span></span>
                  </li>
                );
              })}
            </ul>
            {scenario === "checkin" ? (
              <div className="row2 actions">
                <button className="btn ghost" onClick={() => apply("report")}>Something&apos;s wrong</button>
                <button className="btn" disabled={count < ITEMS.length}>All good, release payment</button>
              </div>
            ) : (
              <div className="report">
                <h3>Your report · 1 Dec, 15:10</h3>
                <p>&ldquo;No hot water in the shower or kitchen sink.&rdquo;</p>
                <div className="thumbs" aria-hidden="true"><span /><span /></div>
                <p className="note">Shared with Eva. If it&apos;s fixed, tick it off and confirm the rest.</p>
              </div>
            )}
          </section>
        )}

        <nav className="tabs" aria-label="App">
          {["Search", "Favourites", "Messages", "Your stay", "Profile"].map((t) => <span key={t} className={t === "Your stay" ? "on" : ""}>{t}</span>)}
        </nav>
        {toast && <div className="toast" role="status">✓ {toast}</div>}
      </div>
      {!embed && <p className="credit">Concept by Daniel Ade-Otoki · not HousingAnywhere&apos;s official UI · fictional data</p>}
    </div>
  );
}

const CSS = `
html,body{margin:0;background:#f3f6f8}
.ha{--ink:#002630;--txt:#2d4658;--mut:#6a7d8a;--line:#dfe7ec;--soft:#eef3f6;--or:#ff4c27;--orbg:#ffece9;--ok:#13804f;--okbg:#e6f5ee;--ease:cubic-bezier(.23,1,.32,1);
 font-family:Inter,system-ui,sans-serif;color:var(--txt);-webkit-font-smoothing:antialiased}
.ha *{box-sizing:border-box}
.demo{position:relative;z-index:5;display:flex;flex-direction:column;gap:6px;margin:60px 16px 0;padding:8px 10px;border:1px dashed #c9d5dd;border-radius:14px;background:#fff}
.demo-l{font-size:10px;letter-spacing:.08em;text-transform:uppercase;color:var(--mut)}
.demo button{all:unset;cursor:pointer;font-size:13px;padding:5px 10px;border-radius:999px;border:1px solid var(--line)}
.demo button.on{background:var(--ink);color:#fff;border-color:transparent}
.screen{position:relative;max-width:402px;margin:0 auto;min-height:874px;background:#f3f6f8;padding:56px 16px 96px;display:flex;flex-direction:column;gap:12px}
.ha:not(.is-embed) .screen{padding-top:12px}
.bar{display:flex;align-items:center;justify-content:space-between;height:40px;color:var(--ink)}
.bar b{font-size:17px;font-weight:700}
.back,.help{width:32px;height:32px;display:grid;place-items:center;font-size:22px}
.help{font-size:14px;font-weight:700;border:1.5px solid var(--ink);border-radius:50%;width:24px;height:24px}
.home{display:flex;gap:12px;align-items:center;background:#fff;border-radius:16px;padding:10px;border:1px solid var(--line)}
.home .ph{width:64px;height:64px;border-radius:12px;background:linear-gradient(135deg,#a5bccc,#cfdbe3);display:grid;place-items:center;font-size:9px;color:#fff;flex-shrink:0}
.home div:last-child{display:flex;flex-direction:column;gap:2px;font-size:13px}
.home b{font-size:15px;color:var(--ink)}
.card{background:#fff;border:1px solid var(--line);border-radius:16px;padding:16px;animation:in 260ms var(--ease)}
.eyebrow{margin:0;font-size:12px;font-weight:700;letter-spacing:.06em;text-transform:uppercase;color:var(--or)}
.hero h1{margin:4px 0 6px;font-size:26px;letter-spacing:-.02em;color:var(--ink)}
.sub{margin:0 0 12px;font-size:14px;line-height:1.45}
.row2{display:flex;gap:8px}
.chip{all:unset;cursor:pointer;font-size:13px;font-weight:600;color:var(--ink);padding:8px 12px;border-radius:999px;border:1px solid var(--line);background:var(--soft)}
.card h2{margin:0 0 10px;font-size:17px;color:var(--ink)}
.tl{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:12px}
.tl li{position:relative;display:flex;justify-content:space-between;gap:8px;padding-left:22px;font-size:14px;font-weight:600;color:var(--ink)}
.tl li span{font-weight:400;color:var(--mut);font-size:13px;white-space:nowrap}
.tl i{position:absolute;left:0;top:3px;width:12px;height:12px;border-radius:50%;border:2px solid #a5bccc;background:#fff}
.tl li:not(:last-child)::after{content:"";position:absolute;left:5px;top:17px;width:2px;height:16px;background:var(--line)}
.tl li.done i{background:var(--ok);border-color:var(--ok)}
.note{margin:12px 0 0;font-size:13px;line-height:1.45;color:var(--mut)}
.timer{display:flex;gap:14px;align-items:center;background:var(--ink);border-color:var(--ink);color:#d7e3ea}
.timer h2{color:#fff;margin:0 0 4px}
.timer p{margin:0;font-size:13.5px;line-height:1.45}
.timer b{color:#fff}
.timer.held{background:#fff;color:var(--txt);border-color:#ffc4b8}
.timer.held h2{color:var(--ink)}.timer.held b{color:var(--ink)}
.clock{width:64px;height:64px;border-radius:50%;border:3px solid var(--or);display:grid;place-items:center;align-content:center;color:#fff;flex-shrink:0}
.clock span{font-size:18px;font-weight:800;line-height:1}
.clock small{font-size:10px;text-transform:uppercase;letter-spacing:.06em;opacity:.8}
.clock.warn{border-color:var(--or);color:var(--or);background:var(--orbg)}
.ch{display:flex;justify-content:space-between;align-items:baseline}
.ch span{font-size:13px;font-weight:700;color:var(--mut)}
.list{list-style:none;margin:0;padding:0;display:flex;flex-direction:column}
.list li{display:flex;gap:12px;align-items:center;padding:10px 0;border-top:1px solid var(--line)}
.tick{all:unset;cursor:pointer;width:28px;height:28px;border-radius:50%;border:2px solid #a5bccc;display:grid;place-items:center;font-weight:800;color:#fff;flex-shrink:0;transition:background-color 160ms ease,border-color 160ms ease,transform 160ms var(--ease)}
.tick:active{transform:scale(.92)}
.tick:focus-visible,.btn:focus-visible,.chip:focus-visible,.demo button:focus-visible{outline:2px solid var(--or);outline-offset:2px}
.list li.ok .tick{background:var(--ok);border-color:var(--ok)}
.list li.bad .tick{background:var(--or);border-color:var(--or)}
.lt{display:flex;flex-direction:column;font-size:13px;color:var(--mut)}
.lt b{font-size:15px;color:var(--ink);font-weight:600}
.list li.bad .lt span{color:var(--or);font-weight:600}
.actions{margin-top:12px}
.btn{all:unset;cursor:pointer;flex:1;text-align:center;font-size:14px;font-weight:700;padding:12px 10px;border-radius:12px;background:var(--or);color:#fff;transition:transform 160ms var(--ease),opacity 160ms ease}
.btn:active{transform:scale(.97)}
.btn:disabled{opacity:.4;cursor:not-allowed}
.btn.ghost{background:#fff;color:var(--ink);border:1.5px solid var(--ink)}
.report{margin-top:12px;background:var(--orbg);border-radius:12px;padding:12px}
.report h3{margin:0 0 4px;font-size:13px;color:var(--ink)}
.report p{margin:0;font-size:14px}
.thumbs{display:flex;gap:8px;margin:10px 0 0}
.thumbs span{width:56px;height:56px;border-radius:8px;background:linear-gradient(135deg,#a5bccc,#e5ecf1)}
.tabs{position:fixed;left:50%;transform:translateX(-50%);width:100%;max-width:402px;bottom:0;z-index:4;display:flex;justify-content:space-around;padding:10px 8px 34px;background:#fff;border-top:1px solid var(--line);font-size:11px;font-weight:600;color:var(--mut)}
.tabs .on{color:var(--or)}
.toast{position:fixed;left:50%;transform:translateX(-50%);width:calc(min(402px,100%) - 32px);bottom:96px;z-index:5;background:var(--ink);color:#fff;font-size:14px;font-weight:600;padding:12px 14px;border-radius:12px;animation:up 260ms var(--ease)}
.credit{font-size:10.5px;color:#8a97a0;text-align:center;margin:12px 0 24px}
@keyframes in{from{opacity:0;transform:translateY(6px)}}
@keyframes up{from{opacity:0;transform:translate(-50%,10px)}}
@media (prefers-reduced-motion:reduce){.card,.toast{animation:none}.tick,.btn{transition:none}}
`;
