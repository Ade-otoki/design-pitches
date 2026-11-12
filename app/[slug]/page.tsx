import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { allLogs, getLog } from "../../lib/content";
import type { ProductLog } from "../../lib/types";

export const dynamicParams = false;

export function generateStaticParams() {
  return allLogs().map((l) => ({ slug: l.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const log = getLog(slug);
  if (!log) return {};
  return {
    title: `${log.feature.name} for ${log.company}`,
    description: `Product log: ${log.jtbd}`,
    robots: log.draft ? { index: false, follow: false } : undefined,
  };
}

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
}

function Device({ log }: { log: ProductLog }) {
  const src = log.prototype.path;
  if (log.prototype.frame === "desktop") {
    return (
      <div className="desktop">
        <div className="bar"><i /><i /><i /></div>
        <iframe src={src} title={`${log.feature.name} prototype`} loading="lazy" />
      </div>
    );
  }
  return (
    <div className="phone">
      <iframe src={src} title={`${log.feature.name} prototype`} loading="lazy" />
    </div>
  );
}

function scoreOf(r: NonNullable<ProductLog["effortImpact"]>[number]) {
  const effort = r.effort.design + r.effort.dev + r.effort.gtm;
  const impact = r.impact.reach + r.impact.value + r.impact.business;
  return { effortTotal: effort, impactTotal: impact, ratio: impact / Math.max(effort, 1) };
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const log = getLog(slug);
  if (!log) notFound();

  const ei = log.effortImpact?.map((r) => ({ ...r, ...scoreOf(r) }));
  const best = ei?.reduce((a, b) => (b.ratio > a.ratio ? b : a));

  return (
    <main>
      {log.draft && <div className="banner">Sample layout — placeholder content, not a real pitch.</div>}

      {/* 1. Cover */}
      <div className="wrap">
        <div className="cover">
          <div>
            <span className="chip" aria-hidden>{log.feature.icon ?? "✦"}</span>
            <p className="eyebrow" style={{ marginTop: 40 }}>
              Product log · {log.company} · {log.role}
            </p>
            <h1 className="h-display">
              <span className="kicker">New Feature:</span>
              <span className="serif name">{log.feature.name}</span>
            </h1>
            <div className="meta">
              <span>Feature owner: <b>Daniel Ade-Otoki</b></span>
              <span className="dot" />
              <span>{log.feature.sprint}</span>
              <span className="dot" />
              <span>{fmtDate(log.date)}</span>
            </div>
            <div className="cta-row">
              <a className="btn solid" href={log.prototype.path} target="_blank" rel="noreferrer">Open the prototype ↗</a>
              <a className="btn ghost" href={log.prototype.repoUrl} target="_blank" rel="noreferrer">View code</a>
            </div>
          </div>
          <Device log={log} />
        </div>
      </div>

      {/* 2. Context */}
      <section>
        <div className="wrap">
          {log.context.heroImage && (
            <img className="hero-img" src={log.context.heroImage.src} alt={log.context.heroImage.alt} />
          )}
          <div className="two-col">
            <p className="eyebrow">Context</p>
            <div>
              <h2 className="h-card" style={{ fontWeight: 600, marginBottom: 12 }}>{log.context.title}</h2>
              <p className="muted" style={{ marginTop: 0 }}>{log.context.body}</p>
              <h3 style={{ marginTop: 28 }}>Assumptions</h3>
              <ul className="clean">{log.context.assumptions.map((a) => <li key={a}>{a}</li>)}</ul>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Design goals */}
      <section>
        <div className="wrap">
          <h2 className="serif h-section">Design Goals</h2>
          <p className="muted lede" style={{ marginTop: 16 }}>What this feature has to achieve.</p>
          <div className="goals">
            {log.goals.map((g, i) => (
              <div className="goal" key={g.title}>
                <span className="chip sm">{i + 1}</span>
                <h3 className="serif h-card">{g.title}</h3>
                <p>{g.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. JTBD */}
      <section>
        <div className="wrap">
          <h2 className="serif h-display">The Job to Be Done</h2>
          <p className="jtbd">{log.jtbd}</p>
        </div>
      </section>

      {/* 5. Evidence */}
      <section>
        <div className="wrap evidence">
          <div>
            <h2 className="serif h-section">What the evidence says</h2>
            <p className="muted" style={{ marginTop: 16 }}>
              Public signals from {log.company}&apos;s users, docs and product. Every finding links to its source.
            </p>
          </div>
          <div>
            {log.evidence.map((e, i) => (
              <div className="ev-row" key={e.step}>
                {e.image ? (
                  <img className="ev-thumb" src={e.image.src} alt={e.image.alt} />
                ) : (
                  <div className="ev-thumb empty" aria-hidden>{i + 1}</div>
                )}
                <div>
                  <h4>{e.step}</h4>
                  <p>{e.finding}</p>
                  <a className="src" href={e.source.url} target="_blank" rel="noreferrer">Source: {e.source.label} ↗</a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. Conceptual range */}
      <section>
        <div className="wrap">
          <h2 className="serif h-section">Conceptual Range</h2>
          <p className="muted lede" style={{ marginTop: 16 }}>Approaches I considered for the job to be done.</p>
          <div className="approaches">
            {log.approaches.map((a) => <div className="approach" key={a}><p>{a}</p></div>)}
          </div>
        </div>
      </section>

      {/* 7–9. Ranges */}
      {log.ranges.map((r, i) => (
        <div className="range" key={r.title}>
          <div className="copy">
            <span className="chip sm">{i + 1}</span>
            <h3 className="serif">Range {i + 1}: {r.title}</h3>
            <p className="muted" style={{ margin: 0 }}>{r.summary}</p>
            <div className="pc">
              <h4>Pros</h4>
              <ul className="clean">{r.pros.map((p) => <li key={p}>{p}</li>)}</ul>
              <h4>Cons</h4>
              <ul className="clean">{r.cons.map((c) => <li key={c}>{c}</li>)}</ul>
            </div>
          </div>
          <div className="visual">
            {r.image ? <img src={r.image.src} alt={r.image.alt} /> : <div className="placeholder">Sketch of range {i + 1}</div>}
          </div>
        </div>
      ))}

      {/* 10. Decision + effort/impact */}
      <section>
        <div className="wrap">
          <div className="decision">
            <div>
              <p className="eyebrow">Decision</p>
              <h2 className="serif h-section">{log.decision.title}</h2>
              <p className="muted lede" style={{ marginTop: 20 }}>{log.decision.body}</p>
              <h3 style={{ fontSize: 18, marginTop: 32 }}>Why</h3>
              <ul className="clean">{log.decision.reasons.map((r) => <li key={r}>{r}</li>)}</ul>
            </div>
            <div className="decision-card">
              <h4>Accepted trade-off</h4>
              <p>{log.decision.tradeoff}</p>
            </div>
          </div>

          {ei && (
            <div className="ei-scroll">
              <table className="ei">
                <thead>
                  <tr>
                    <th>Option</th><th>Design</th><th>Dev</th><th>GTM</th>
                    <th>Reach</th><th>Value</th><th>Business</th><th>Impact ÷ effort</th>
                  </tr>
                </thead>
                <tbody>
                  {ei.map((r) => (
                    <tr key={r.option} className={r === best ? "pick" : undefined}>
                      <td>{r.option}{r === best ? " — chosen" : ""}</td>
                      <td className="num">{r.effort.design}</td><td className="num">{r.effort.dev}</td><td className="num">{r.effort.gtm}</td>
                      <td className="num">{r.impact.reach}</td><td className="num">{r.impact.value}</td><td className="num">{r.impact.business}</td>
                      <td className="num"><b>{r.ratio.toFixed(2)}</b></td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <p className="note">Effort scored 1–10 per area (lower is easier); impact scored 1–10 per area. These are my estimates from public information, to be recalibrated with the team&apos;s data.</p>
            </div>
          )}
        </div>
      </section>

      {/* 11. Conceptual depth */}
      <section>
        <div className="wrap depth">
          <div>
            <p className="eyebrow">Conceptual depth</p>
            <h2 className="serif h-section">The working prototype</h2>
            <p className="muted lede" style={{ marginTop: 20 }}>{log.depth.body}</p>
            <div className="cta-row">
              <a className="btn solid" href={log.prototype.path} target="_blank" rel="noreferrer">Open full screen ↗</a>
            </div>
          </div>
          <Device log={log} />
        </div>
      </section>

      {/* 12. Validation plan */}
      <section>
        <div className="wrap">
          <h2 className="serif h-section">How I&apos;d validate it</h2>
          <p className="muted lede" style={{ marginTop: 16 }}>{log.validation.method}</p>
          <div className="validation">
            <div className="vcard">
              <h4>Hypotheses</h4>
              <ul className="clean">{log.validation.hypotheses.map((h) => <li key={h}>{h}</li>)}</ul>
            </div>
            {log.validation.metrics.map((m) => (
              <div className="vcard" key={m.name}>
                <h4>{m.name}</h4>
                <p>{m.definition}</p>
              </div>
            ))}
          </div>
          <p className="note">This concept hasn&apos;t been tested with {log.company}&apos;s users yet. These are the measures I&apos;d set up first.</p>
        </div>
      </section>

      {/* 13. Summary */}
      <section>
        <div className="wrap summary">
          <div>
            <h2 className="serif h-section">Next steps</h2>
            <p className="muted" style={{ marginTop: 16 }}>
              I&apos;m applying for the {log.role} role at {log.company}.{" "}
              {log.jobUrl && <a href={log.jobUrl} target="_blank" rel="noreferrer">See the role ↗</a>}
            </p>
            <div className="cta-row">
              <a className="btn solid" href="mailto:adeotokidaniel@gmail.com">Get in touch</a>
              <a className="btn ghost" href="https://danieladeotoki.com">Portfolio</a>
            </div>
          </div>
          <ul className="steps">{log.nextSteps.map((s) => <li key={s}>{s}</li>)}</ul>
        </div>
        <div className="wrap" style={{ marginTop: 72 }}>
          <p className="eyebrow">Sources</p>
          <ol className="sources">
            {log.sources.map((s) => (
              <li key={s.url}><a href={s.url} target="_blank" rel="noreferrer">{s.label}</a></li>
            ))}
          </ol>
          <p className="note">
            Independent concept by Daniel Ade-Otoki, not affiliated with {log.company}. Product names and trademarks belong to their owners.
          </p>
        </div>
      </section>
    </main>
  );
}
