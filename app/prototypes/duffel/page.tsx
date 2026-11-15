"use client";

// Concept prototype: "Change Desk" for the Duffel Dashboard.
// Independent concept by Daniel Ade-Otoki. Not Duffel's official UI, not affiliated with Duffel.
// Visual language from duffel.com docs: deep purple-black ink (#100024), teal accent (#6cbfb0 / #5aaa9c) with mint surfaces, zinc greys,
// off-white #f9f8fc, GT America (Inter as open substitute). No Duffel logo. Fictional travel seller, passengers and flights.
// The role owns Duffel's AI support product (Duffel Assistant). Grounded in Duffel's public docs: airline-initiated changes from 300+ airlines are notified, 20+ airlines can be accepted
// immediately, one can be automated, and customer-requested flight changes are handled manually via help@duffel.com.

import { useEffect, useState } from "react";

type Scenario = "queue" | "accept" | "manual";
type Change = { id: string; pax: string; route: string; airline: string; what: string; departs: string; hrs: number; path: "accept" | "manual" | "info" };

const CHANGES: Change[] = [
  { id: "ord_0000AbX1", pax: "Ada Okafor", route: "LHR → JFK", airline: "British Airways", what: "Departure moved 2h 10m later", departs: "18 Nov", hrs: 62, path: "accept" },
  { id: "ord_0000AbX7", pax: "Tom Reyes", route: "MAD → LIS", airline: "Iberia", what: "Flight cancelled · 2 alternatives offered", departs: "17 Nov", hrs: 38, path: "manual" },
  { id: "ord_0000AbY2", pax: "Mei Chen", route: "AMS → BCN", airline: "KLM", what: "Departure moved 15m earlier", departs: "24 Nov", hrs: 210, path: "info" },
  { id: "ord_0000AbY9", pax: "Sam Patel", route: "DXB → LHR", airline: "Emirates", what: "Aircraft change · seat map updated", departs: "2 Dec", hrs: 400, path: "info" },
];

const PATH = {
  accept: { label: "Accept in Duffel", cls: "acc" },
  manual: { label: "Needs Duffel support", cls: "man" },
  info: { label: "No action needed", cls: "inf" },
};

export default function DuffelChangeDesk() {
  const [scenario, setScenario] = useState<Scenario>("queue");
  const [embed, setEmbed] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  function apply(s: Scenario) { setScenario(s); setToast(s === "accept" ? "Change accepted · Ada Okafor notified by email" : null); }

  // URL options: ?scenario=queue|accept|manual  ?embed=1 hides demo controls  ?sync=1 listens to /live/duffel
  useEffect(() => {
    const q = new URLSearchParams(window.location.search);
    const s = q.get("scenario") as Scenario | null;
    if (s && ["queue", "accept", "manual"].includes(s)) apply(s);
    setEmbed(q.get("embed") === "1");
    if (q.get("sync") !== "1" || typeof BroadcastChannel === "undefined") return;
    const c = new BroadcastChannel("duffel-change-desk");
    c.onmessage = (e) => { if (e.data?.type === "scenario") apply(e.data.scenario); };
    return () => c.close();
  }, []);
  useEffect(() => { if (!toast) return; const t = setTimeout(() => setToast(null), 4000); return () => clearTimeout(t); }, [toast]);

  const sel = scenario === "manual" ? CHANGES[1] : CHANGES[0];
  const needs = scenario === "queue" ? 2 : scenario === "accept" ? 1 : 0;
  return (
    <div className={`dd ${embed ? "is-embed" : ""}`}>
      <style>{CSS}</style>
      <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" />
      {!embed && (
        <div className="demo" role="group" aria-label="Concept demo">
          <span className="demo-l">Concept demo</span>
          {(["queue", "accept", "manual"] as Scenario[]).map((s, i) => (
            <button key={s} className={scenario === s ? "on" : ""} aria-pressed={scenario === s} onClick={() => apply(s)}>
              {i + 1}. {{ queue: "Triage the queue", accept: "Accept in one click", manual: "Hand off to support" }[s]}
            </button>
          ))}
        </div>
      )}
      <div className="app">
        <aside className="nav">
          <div className="org"><span className="av">W</span><div><b>Wayfarer Trips</b><span>Live mode</span></div></div>
          {["Home", "Search flights", "Orders", "Change Desk", "Stays", "Payments", "Developers", "Settings"].map((n) => (
            <span key={n} className={`ni ${n === "Change Desk" ? "on" : ""}`}>{n}{n === "Change Desk" && needs > 0 && <i>{needs}</i>}</span>
          ))}
        </aside>
        <main className="main">
          <header className="hd">
            <div><h1>Change Desk</h1><p>Airline changes to your orders, sorted by what you can do and how soon the flight leaves.</p></div>
            <div className="seg"><span className="on">Needs you · {needs}</span><span>For info · 2</span><span>Resolved · {scenario === "queue" ? 14 : 15}</span></div>
          </header>
          <div className="cols">
            <section className="list" aria-label="Changes">
              {CHANGES.map((c) => {
                const resolved = scenario !== "queue" && c === CHANGES[0];
                const handed = scenario === "manual" && c === CHANGES[1];
                return (
                  <div key={c.id} className={`row ${sel === c ? "sel" : ""} ${resolved ? "res" : ""}`}>
                    <div className="r1"><b>{c.pax}</b><span className="mono">{c.id}</span></div>
                    <div className="r2">{c.route} · {c.airline} · departs {c.departs}</div>
                    <div className="r3">{c.what}</div>
                    <div className="r4">
                      <span className={`pill ${resolved ? "ok" : handed ? "wait" : PATH[c.path].cls}`}>{resolved ? "Accepted" : handed ? "With Duffel support" : PATH[c.path].label}</span>
                      {c.path !== "info" && !resolved && !handed && <span className={`due ${c.hrs < 48 ? "urg" : ""}`}>Departs in {c.hrs}h</span>}
                    </div>
                  </div>
                );
              })}
            </section>
            <section className="detail" aria-label="Change detail">
              <div className="dh"><b>{sel.pax}</b><span className="mono">{sel.id}</span></div>
              <div className="cmp">
                <div><span className="lab">Was</span><b>{sel === CHANGES[0] ? "LHR 09:40 → JFK 12:35" : "MAD 07:15 → LIS 07:35"}</b><span>{sel === CHANGES[0] ? "BA 117 · Mon 18 Nov" : "IB 3104 · Sun 17 Nov"}</span></div>
                <div className="arrow">→</div>
                <div className={sel === CHANGES[1] ? "x" : ""}><span className="lab">Now</span><b>{sel === CHANGES[0] ? "LHR 11:50 → JFK 14:45" : "Cancelled"}</b><span>{sel === CHANGES[0] ? "BA 117 · Mon 18 Nov · +2h 10m" : "Airline offers 2 alternatives"}</span></div>
              </div>

              {scenario === "queue" && (
                <>
                  <div className="why"><b>You can resolve this here.</b> British Airways lets you accept, change or cancel this order in Duffel.</div>
                  <label className="msgl">Message to your customer · drafted by Duffel Assistant</label>
                  <div className="msg">Hi Ada, British Airways has moved your flight on 18 Nov. It now leaves London Heathrow at 11:50 and lands at JFK at 14:45. No action needed from you.</div>
                  <div className="acts"><button className="btn" onClick={() => apply("accept")}>Accept change and notify</button><button className="btn ghost">Change flight</button><button className="btn ghost">Cancel and refund</button></div>
                </>
              )}
              {scenario === "accept" && (
                <div className="okbox" role="status"><b>Accepted at 10:42.</b> Ada was emailed the new times. The order history keeps the old and new itinerary.</div>
              )}
              {scenario === "manual" && (
                <>
                  <div className="why warn"><b>The Assistant can&apos;t rebook this automatically.</b> Iberia changes need a person, so it handed this to Duffel&apos;s travel support with a summary, the change and Tom&apos;s choice. No email needed.</div>
                  <div className="alts">
                    <label className="alt on"><input type="radio" name="alt" defaultChecked /><span><b>IB 3106 · 10:05 → 10:25</b>Same day, +2h 50m</span></label>
                    <label className="alt"><input type="radio" name="alt" /><span><b>IB 3110 · 15:40 → 16:00</b>Same day, +8h 25m</span></label>
                  </div>
                  <div className="sla"><b>With Duffel travel support · reply within 4 working hours</b><span>Departs in 38h. You&apos;ll see the reply here and by email.</span></div>
                </>
              )}
            </section>
          </div>
        </main>
        {toast && <div className="toast" role="status">✓ {toast}</div>}
      </div>
      {!embed && <p className="credit">Concept by Daniel Ade-Otoki · not Duffel&apos;s official UI · fictional seller, passengers and flights</p>}
    </div>
  );
}

const CSS = `
html,body{margin:0;background:#f9f8fc}
.dd{--ink:#100024;--mut:#71717a;--line:#e6e4ee;--soft:#f4f2f8;--acc:#2f7f71;--accbg:#ccefe9;--man:#9a5b00;--manbg:#fff3db;--blue:#2c5fd6;--bluebg:#eaf0fd;--ease:cubic-bezier(.23,1,.32,1);
 font-family:"GT America",Inter,system-ui,sans-serif;color:var(--ink);-webkit-font-smoothing:antialiased}
.dd *{box-sizing:border-box}
.demo{display:flex;gap:6px;align-items:center;flex-wrap:wrap;padding:8px 16px;border-bottom:1px dashed #ccc;font-size:13px;background:#fff}
.demo-l{font-size:11px;letter-spacing:.08em;text-transform:uppercase;color:var(--mut);margin-right:6px}
.demo button{all:unset;cursor:pointer;padding:5px 11px;border-radius:999px;border:1px solid var(--line)}
.demo button.on{background:var(--ink);color:#fff;border-color:var(--ink)}
.demo button:focus-visible,.btn:focus-visible{outline:2px solid var(--blue);outline-offset:2px}
.app{position:relative;display:grid;grid-template-columns:220px 1fr;height:800px;overflow:hidden;background:#f9f8fc}
.dd:not(.is-embed) .app{height:calc(100svh - 64px);min-height:640px}
.nav{display:flex;flex-direction:column;gap:2px;padding:16px 12px;border-right:1px solid var(--line);background:#fff}
.org{display:flex;gap:10px;align-items:center;margin-bottom:14px}
.org div{display:flex;flex-direction:column;font-size:12px;color:var(--mut)}.org b{font-size:14px;color:var(--ink)}
.av{width:30px;height:30px;border-radius:8px;background:#6cbfb0;color:#fff;display:grid;place-items:center;font-weight:700}
.ni{display:flex;justify-content:space-between;align-items:center;padding:7px 10px;border-radius:8px;font-size:13.5px;color:#3d3d39}
.ni.on{background:#e5f8f4;font-weight:600;color:var(--ink)}
.ni i{font-style:normal;font-size:11px;background:#d1462f;color:#fff;border-radius:999px;padding:0 7px}
.main{display:flex;flex-direction:column;min-width:0;padding:20px 28px 0}
.hd{display:flex;justify-content:space-between;align-items:flex-end;gap:16px;margin-bottom:14px}
.hd h1{margin:0;font-size:22px;letter-spacing:-.01em}.hd p{margin:4px 0 0;font-size:13.5px;color:var(--mut)}
.seg{display:flex;background:#efedf5;border-radius:8px;padding:3px;font-size:12.5px}
.seg span{padding:5px 10px;border-radius:6px;white-space:nowrap}.seg .on{background:#fff;font-weight:600;box-shadow:0 1px 2px rgb(0 0 0/.06)}
.cols{display:grid;grid-template-columns:minmax(0,1fr) 440px;gap:16px;flex:1;min-height:0;padding-bottom:20px}
.list{display:flex;flex-direction:column;gap:8px;overflow:auto}
.row{background:#fff;border:1px solid var(--line);border-radius:10px;padding:12px 14px;font-size:13px;transition:opacity 200ms ease,border-color 160ms ease}
.row.sel{border-color:var(--ink);box-shadow:0 0 0 1px var(--ink)}
.row.res{opacity:.6}
.r1{display:flex;justify-content:space-between}.r1 b{font-size:14px}
.mono{font-family:ui-monospace,SFMono-Regular,Menlo,monospace;font-size:11.5px;color:var(--mut)}
.r2{color:var(--mut);margin-top:2px}.r3{margin-top:6px;font-weight:500}
.r4{display:flex;justify-content:space-between;align-items:center;margin-top:8px}
.pill{font-size:11.5px;font-weight:600;padding:2px 8px;border-radius:999px}
.pill.acc{background:var(--accbg);color:var(--acc)}.pill.man{background:var(--manbg);color:var(--man)}.pill.inf{background:var(--soft);color:var(--mut)}
.pill.ok{background:var(--accbg);color:var(--acc)}.pill.wait{background:var(--bluebg);color:var(--blue)}
.due{font-size:12px;color:var(--mut)}.due.urg{color:#c0392b;font-weight:600}
.detail{background:#fff;border:1px solid var(--line);border-radius:12px;padding:16px;display:flex;flex-direction:column;gap:12px;overflow:auto;animation:in 220ms var(--ease)}
.dh{display:flex;justify-content:space-between;align-items:baseline}.dh b{font-size:16px}
.cmp{display:grid;grid-template-columns:1fr 24px 1fr;gap:8px;align-items:center;background:var(--soft);border-radius:10px;padding:12px}
.cmp>div{display:flex;flex-direction:column;font-size:12px;color:var(--mut)}
.cmp b{font-size:13.5px;color:var(--ink)}.cmp .x b{color:#c0392b}
.lab{font-size:10.5px;text-transform:uppercase;letter-spacing:.06em}
.arrow{text-align:center;color:var(--mut)}
.why{font-size:13px;line-height:1.45;background:var(--accbg);border-radius:8px;padding:10px 12px}
.why.warn{background:var(--manbg)}
.msgl{font-size:12px;font-weight:600;color:var(--mut)}
.msg{font-size:13px;line-height:1.5;border:1px solid var(--line);border-radius:8px;padding:10px 12px}
.acts{display:flex;gap:8px;flex-wrap:wrap}
.btn{all:unset;cursor:pointer;font-size:13px;font-weight:600;padding:8px 12px;border-radius:8px;background:var(--ink);color:#fff;transition:transform 160ms var(--ease)}
.btn:active{transform:scale(.97)}.btn.ghost{background:#fff;color:var(--ink);border:1px solid var(--line)}
.okbox{font-size:13.5px;line-height:1.5;background:var(--accbg);border-radius:8px;padding:12px}
.alts{display:flex;flex-direction:column;gap:6px}
.alt{display:flex;gap:10px;align-items:flex-start;border:1px solid var(--line);border-radius:8px;padding:10px;font-size:12.5px;color:var(--mut);cursor:pointer}
.alt.on{border-color:var(--ink)}.alt b{display:block;color:var(--ink);font-size:13.5px}
.sla{display:flex;flex-direction:column;gap:2px;background:var(--bluebg);border-radius:8px;padding:10px 12px;font-size:12.5px;color:#30406b}
.sla b{color:var(--blue);font-size:13.5px}
.toast{position:absolute;left:50%;bottom:22px;transform:translateX(-50%);background:var(--ink);color:#fff;font-size:13px;padding:10px 14px;border-radius:8px;animation:up 260ms var(--ease)}
.credit{margin:10px 16px;font-size:11px;color:var(--mut)}
@keyframes in{from{opacity:0;transform:translateY(4px)}}
@keyframes up{from{opacity:0;transform:translate(-50%,10px)}}
@media (prefers-reduced-motion:reduce){.detail,.toast{animation:none}.row,.btn{transition:none}}
`;
