"use client";

// Concept prototype: Healthcheck Timeline for a failed deploy.
// Independent concept by Daniel Ade-Otoki. Not Railway's UI, not affiliated with Railway.
// Scenarios are modelled on public Railway Help Station threads; all data shown is illustrative.

import { useEffect, useState } from "react";

type Outcome = "redirect" | "error" | "refused" | "unreachable";
type Attempt = { t: string; outcome: Outcome; detail: string };
type Owner = "app" | "startup" | "platform";

type Scenario = {
  key: string;
  label: string;
  path: string;
  port: number;
  owner: Owner;
  verdict: string;
  why: string;
  fix: { title: string; body: string; code?: string };
  appLog: string[];
  attempts: Attempt[];
  incident?: string;
};

const OWNER_TEXT: Record<Owner, { label: string; tone: string }> = {
  app: { label: "Your app's response", tone: "amber" },
  startup: { label: "Your app's startup", tone: "amber" },
  platform: { label: "Likely Railway platform", tone: "blue" },
};

function repeat(n: number, make: (i: number) => Attempt): Attempt[] {
  return Array.from({ length: n }, (_, i) => make(i));
}
const ts = (s: number) => `${String(Math.floor(s / 60)).padStart(1, "0")}:${String(s % 60).padStart(2, "0")}`;

const SCENARIOS: Scenario[] = [
  {
    key: "redirect",
    label: "Redirect",
    path: "/",
    port: 8080,
    owner: "app",
    verdict: "Your app answered, but with a redirect.",
    why: "Every attempt got 308 → /markets/in. Healthchecks only pass on a 2xx response, so this deploy can never go live while the check points at /.",
    fix: {
      title: "Point the healthcheck at a path that returns 200",
      body: "Add a lightweight endpoint that responds 200 without redirecting, then set it as the healthcheck path.",
      code: "Healthcheck path:  /api/health",
    },
    appLog: ["▲ Next.js ready on http://0.0.0.0:8080", "✓ Ready in 412ms"],
    attempts: repeat(9, (i) => ({ t: ts(4 + i * 33), outcome: "redirect", detail: "308 Permanent Redirect → Location: /markets/in" })),
  },
  {
    key: "503",
    label: "App says unhealthy",
    path: "/health",
    port: 3000,
    owner: "app",
    verdict: "Your app is reachable and reports itself unhealthy.",
    why: "Every attempt reached /health and got 503 with body {\"status\":\"migrations_pending\"}. The previous deployment predates the new migrations, which is why redeploying an older commit works.",
    fix: {
      title: "Run migrations before the new version starts",
      body: "Move migrations into a pre-deploy command so they're applied before the healthcheck begins.",
      code: '"preDeployCommand": "npm run migrate"',
    },
    appLog: ["Listening on 0.0.0.0:3000", "health: 2 migrations pending → 503"],
    attempts: repeat(8, (i) => ({ t: ts(6 + i * 7), outcome: "error", detail: '503 Service Unavailable · {"status":"migrations_pending"}' })),
  },
  {
    key: "slow",
    label: "Slow startup",
    path: "/healthz",
    port: 8000,
    owner: "startup",
    verdict: "Your app never started listening before the 5-minute timeout.",
    why: "Every attempt got \"connection refused\" on port 8000: nothing was listening yet. The last log line shows schema setup still running, so the server hadn't opened its port.",
    fix: {
      title: "Move schema setup out of startup",
      body: "Run schema work once in a pre-deploy command, or raise the timeout while you migrate.",
      code: '"preDeployCommand": "python -m app.setup_schema"\nRAILWAY_HEALTHCHECK_TIMEOUT_SEC=600',
    },
    appLog: ["Starting uvicorn with 2 workers", "Running schema setup (180 tables)…", "Running schema setup (180 tables)…"],
    attempts: repeat(10, (i) => ({ t: ts(5 + i * 30), outcome: "refused", detail: "Connection refused · nothing listening on :8000" })),
  },
  {
    key: "platform",
    label: "Platform issue",
    path: "/health",
    port: 3000,
    owner: "platform",
    verdict: "Your app was ready. The healthcheck couldn't reach it.",
    why: "Your app logged that it was listening on :3000, but no attempt reached the instance. A routing incident was active in this region during the deploy.",
    fix: {
      title: "No change needed on your side",
      body: "Your previous deployment is still serving traffic. Redeploy once the incident is resolved. Changing your config won't help here.",
    },
    incident: "Investigating: elevated healthcheck failures in this region · started 03:21 UTC",
    appLog: ["Server listening on 0.0.0.0:3000", "GET /health 200 (local self-test)"],
    attempts: repeat(9, (i) => ({ t: ts(3 + i * 33), outcome: "unreachable", detail: "Probe timed out before reaching the instance" })),
  },
];

const OUTCOME_STYLE: Record<Outcome, { label: string; tone: string }> = {
  redirect: { label: "3xx", tone: "amber" },
  error: { label: "5xx", tone: "red" },
  refused: { label: "No listener", tone: "red" },
  unreachable: { label: "Unreachable", tone: "blue" },
};

export default function HealthcheckTimeline() {
  const [key, setKey] = useState(SCENARIOS[0].key);
  const [open, setOpen] = useState<number | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const s = SCENARIOS.find((x) => x.key === key)!;
  const owner = OWNER_TEXT[s.owner];

  useEffect(() => setOpen(null), [key]);
  useEffect(() => {
    if (!toast) return;
    const id = setTimeout(() => setToast(null), 2600);
    return () => clearTimeout(id);
  }, [toast]);

  const copy = async (text: string) => {
    try { await navigator.clipboard.writeText(text); setToast("Copied"); } catch { setToast("Copy not available here"); }
  };

  return (
    <div className="hc">
      <style>{CSS}</style>

      <div className="demo-bar">
        <span className="demo-label">Concept demo · pick a failure</span>
        <div className="seg" role="tablist" aria-label="Failure scenario">
          {SCENARIOS.map((x) => (
            <button key={x.key} role="tab" aria-selected={x.key === key} className={x.key === key ? "on" : ""} onClick={() => setKey(x.key)}>
              {x.label}
            </button>
          ))}
        </div>
      </div>

      <header className="dep-head">
        <div>
          <div className="crumbs">acme / api-service / production</div>
          <h1>Deployment failed <span className="sha">a91c4e2</span></h1>
        </div>
        <span className="pill red">Failed · previous deployment still live</span>
      </header>

      <ol className="stages" aria-label="Deployment stages">
        {["Initialize", "Build", "Deploy"].map((st) => <li key={st} className="ok"><i>✓</i>{st}</li>)}
        <li className="bad"><i>✕</i>Network › Healthcheck</li>
      </ol>

      {s.incident && <div className="incident" role="status"><b>Incident</b> {s.incident}</div>}

      <section className={`verdict ${owner.tone}`} aria-live="polite">
        <div className="who">Cause: <b>{owner.label}</b></div>
        <h2>{s.verdict}</h2>
        <p>{s.why}</p>
        <div className="checked">
          Checked <code>GET {s.path}</code> on port <code>{s.port}</code> from healthcheck.railway.app · {s.attempts.length} attempts over 5:00 · pass needs any 2xx
        </div>
      </section>

      <div className="grid">
        <section className="panel">
          <h3>Probe attempts</h3>
          <ul className="attempts">
            {s.attempts.map((a, i) => {
              const o = OUTCOME_STYLE[a.outcome];
              return (
                <li key={i}>
                  <button className="row" aria-expanded={open === i} onClick={() => setOpen(open === i ? null : i)}>
                    <span className="t">+{a.t}</span>
                    <span className={`badge ${o.tone}`}>{o.label}</span>
                    <span className="d">{a.detail}</span>
                  </button>
                  {open === i && (
                    <div className="more">
                      Request <code>GET {s.path}</code> · Host <code>healthcheck.railway.app</code> · Port <code>{s.port}</code>
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        </section>

        <aside className="side">
          <section className="panel fix">
            <h3>Suggested next step</h3>
            <h4>{s.fix.title}</h4>
            <p>{s.fix.body}</p>
            {s.fix.code && (
              <div className="code">
                <pre>{s.fix.code}</pre>
                <button onClick={() => copy(s.fix.code!)}>Copy</button>
              </div>
            )}
            <button className="ask" onClick={() => setToast("Opened assistant with this deploy's probe evidence attached")}>
              Ask the assistant with this evidence
            </button>
          </section>

          <section className="panel">
            <h3>Your app's last log lines</h3>
            <pre className="logs">{s.appLog.join("\n")}</pre>
          </section>
        </aside>
      </div>

      <footer className="credit">Concept by Daniel Ade-Otoki · not Railway&apos;s UI · illustrative data based on public Help Station threads</footer>
      {toast && <div className="toast" role="status">{toast}</div>}
    </div>
  );
}

const CSS = `
.hc{--bg:#0e0f13;--panel:#16181e;--line:#262932;--text:#e8e9ed;--muted:#9a9eab;--faint:#6b7080;
  --amber:#f5b748;--amber-bg:rgba(245,183,72,.1);--red:#f06a6a;--red-bg:rgba(240,106,106,.1);--blue:#6ea8fe;--blue-bg:rgba(110,168,254,.1);--green:#4cc38a;
  min-height:100svh;background:var(--bg);color:var(--text);font:14px/1.5 Inter,system-ui,sans-serif;padding:16px 20px 28px;}
.hc *{box-sizing:border-box}
.hc code,.hc pre{font-family:ui-monospace,SFMono-Regular,Menlo,monospace;font-size:12.5px}
.demo-bar{display:flex;flex-wrap:wrap;align-items:center;gap:10px;justify-content:space-between;padding:8px 10px;border:1px dashed #3a3f4b;border-radius:10px;margin-bottom:18px}
.demo-label{font-size:12px;color:var(--faint);letter-spacing:.04em;text-transform:uppercase}
.seg{display:flex;flex-wrap:wrap;gap:4px}
.seg button{background:transparent;border:1px solid var(--line);color:var(--muted);border-radius:999px;padding:5px 12px;font:inherit;font-size:13px;cursor:pointer}
.seg button.on{background:var(--text);color:var(--bg);border-color:var(--text)}
.seg button:focus-visible,.row:focus-visible,.ask:focus-visible,.code button:focus-visible{outline:2px solid var(--blue);outline-offset:2px}
.dep-head{display:flex;flex-wrap:wrap;gap:10px;justify-content:space-between;align-items:flex-end}
.crumbs{color:var(--faint);font-size:12.5px}
.dep-head h1{font-size:20px;margin:2px 0 0;font-weight:600}
.sha{font:12px ui-monospace,monospace;color:var(--muted);background:var(--panel);border:1px solid var(--line);border-radius:6px;padding:2px 6px;vertical-align:middle}
.pill{font-size:12.5px;border-radius:999px;padding:4px 10px}
.pill.red{background:var(--red-bg);color:var(--red)}
.stages{list-style:none;display:flex;flex-wrap:wrap;gap:6px;padding:0;margin:16px 0}
.stages li{display:flex;align-items:center;gap:6px;font-size:13px;padding:6px 10px;border-radius:8px;background:var(--panel);border:1px solid var(--line);color:var(--muted)}
.stages li i{font-style:normal;font-size:11px;width:16px;height:16px;border-radius:50%;display:grid;place-items:center}
.stages li.ok i{background:rgba(76,195,138,.15);color:var(--green)}
.stages li.bad{color:var(--text);border-color:rgba(240,106,106,.5)}
.stages li.bad i{background:var(--red-bg);color:var(--red)}
.incident{background:var(--blue-bg);color:#b9d3ff;border:1px solid rgba(110,168,254,.35);border-radius:10px;padding:10px 12px;margin-bottom:12px;font-size:13px}
.incident b{color:var(--blue);margin-right:6px}
.verdict{border-radius:14px;padding:18px;border:1px solid var(--line);background:var(--panel);margin-bottom:14px}
.verdict.amber{border-color:rgba(245,183,72,.45);background:linear-gradient(180deg,var(--amber-bg),var(--panel) 70%)}
.verdict.blue{border-color:rgba(110,168,254,.45);background:linear-gradient(180deg,var(--blue-bg),var(--panel) 70%)}
.who{font-size:12.5px;color:var(--muted)}
.verdict.amber .who b{color:var(--amber)} .verdict.blue .who b{color:var(--blue)}
.verdict h2{font-size:19px;margin:4px 0 6px;font-weight:600;letter-spacing:-.01em}
.verdict p{margin:0;color:#c9ccd4;max-width:70ch}
.checked{margin-top:12px;font-size:12.5px;color:var(--faint)}
.checked code{color:var(--muted)}
.grid{display:grid;grid-template-columns:1.25fr 1fr;gap:14px}
.panel{background:var(--panel);border:1px solid var(--line);border-radius:14px;padding:14px}
.panel h3{margin:0 0 10px;font-size:12px;letter-spacing:.06em;text-transform:uppercase;color:var(--faint);font-weight:600}
.attempts{list-style:none;margin:0;padding:0}
.attempts li+li{border-top:1px solid var(--line)}
.row{all:unset;box-sizing:border-box;display:grid;grid-template-columns:52px 92px 1fr;gap:8px;align-items:center;width:100%;padding:9px 4px;cursor:pointer;border-radius:6px}
.row:hover{background:#1c1f26}
.t{font:12px ui-monospace,monospace;color:var(--faint)}
.d{color:#c9ccd4;font-size:13px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.badge{justify-self:start;font-size:11.5px;font-weight:600;border-radius:6px;padding:2px 7px}
.badge.amber{background:var(--amber-bg);color:var(--amber)} .badge.red{background:var(--red-bg);color:var(--red)} .badge.blue{background:var(--blue-bg);color:var(--blue)}
.more{padding:2px 4px 10px 64px;color:var(--muted);font-size:12.5px}
.side{display:flex;flex-direction:column;gap:14px}
.fix h4{margin:0 0 4px;font-size:15px}
.fix p{margin:0 0 10px;color:#c9ccd4}
.code{position:relative;background:#0b0c10;border:1px solid var(--line);border-radius:10px;padding:10px 64px 10px 12px;margin-bottom:10px}
.code pre{margin:0;white-space:pre-wrap;word-break:break-word;color:#d7dae2}
.code button{position:absolute;top:8px;right:8px;background:var(--panel);color:var(--text);border:1px solid var(--line);border-radius:7px;padding:3px 9px;font:inherit;font-size:12px;cursor:pointer}
.ask{width:100%;background:var(--text);color:var(--bg);border:0;border-radius:10px;padding:10px;font:inherit;font-weight:600;cursor:pointer}
.ask:hover{opacity:.9}
.logs{margin:0;white-space:pre-wrap;color:#b8bcc7;background:#0b0c10;border:1px solid var(--line);border-radius:10px;padding:10px 12px}
.credit{margin-top:18px;font-size:12px;color:var(--faint);text-align:center}
.toast{position:fixed;left:50%;bottom:20px;transform:translateX(-50%);background:var(--text);color:var(--bg);padding:8px 14px;border-radius:999px;font-size:13px;box-shadow:0 10px 30px rgba(0,0,0,.4)}
@media (max-width:720px){.grid{grid-template-columns:1fr}.row{grid-template-columns:48px 84px 1fr}.d{white-space:normal}}
@media (prefers-reduced-motion:reduce){.hc *{transition:none!important}}
`;
