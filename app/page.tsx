import { allLogs } from "../lib/content";

export default function Home() {
  const logs = allLogs().filter((l) => !l.draft);
  return (
    <main className="wrap" style={{ padding: "96px var(--gutter) 64px" }}>
      <p className="eyebrow">Product logs</p>
      <h1 className="serif h-display">Problems I&apos;d solve on your team.</h1>
      <p className="lede muted" style={{ marginTop: 24 }}>
        For each company I&apos;m excited about, I research the product from public evidence, frame one real problem,
        and ship a working prototype of the fix. Each log walks through that thinking from evidence to decision.
      </p>
      {logs.length === 0 ? (
        <p className="faint" style={{ marginTop: 48 }}>The first logs are on their way.</p>
      ) : (
        <ul className="index-list">
          {logs.map((l) => (
            <li key={l.slug}>
              <a href={`/${l.slug}`}>
                <span className="serif" style={{ fontSize: 30, lineHeight: 1.2 }}>{l.feature.name}</span>
                <span className="faint" style={{ alignSelf: "center" }}>{l.company}</span>
                <span className="muted" style={{ gridColumn: "1 / -1", fontSize: 15 }}>{l.jtbd}</span>
              </a>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
