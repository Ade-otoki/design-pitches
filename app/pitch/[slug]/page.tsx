import fs from "node:fs";
import path from "node:path";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import type { PitchDeck } from "../../../lib/types";
import { CASE_STUDIES, INTRO, LINKS, SYSTEMS, WORKING_STYLE } from "../../../lib/candidate";
import { BOOKING_URL } from "../../../lib/site";
import "./deck.css";

const DIR = path.join(process.cwd(), "content", "pitches");
function getDeck(slug: string): PitchDeck | undefined {
  const f = path.join(DIR, `${slug}.json`);
  return fs.existsSync(f) ? (JSON.parse(fs.readFileSync(f, "utf8")) as PitchDeck) : undefined;
}

export const dynamicParams = false;
export function generateStaticParams() {
  if (!fs.existsSync(DIR)) return [];
  return fs.readdirSync(DIR).filter((f) => f.endsWith(".json")).map((f) => ({ slug: f.replace(/\.json$/, "") }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const d = getDeck(slug);
  return d ? { title: `${d.role} pitch for ${d.company}`, description: d.hook } : {};
}

function Slide({ tone, n, children, footer }: { tone: "yellow" | "blue" | "black"; n: number; children: React.ReactNode; footer?: string }) {
  return (
    <section className={`slide ${tone}`} aria-label={`Slide ${n}`}>
      <div className="inner">{children}</div>
      {footer && <div className="foot"><span>{footer}</span><span>{String(n).padStart(2, "0")}</span></div>}
    </section>
  );
}

export default async function Pitch({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const d = getDeck(slug);
  if (!d) notFound();
  const C = d.company.toUpperCase();
  const index = ["Intro", `Why ${d.company}`, "Experience", "Product thinking", "Design systems", "Working style", "First week", "Ask"];

  return (
    <main className="deck">
      {/* eslint-disable-next-line @next/next/no-page-custom-font */}
      <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Archivo+Black&family=Silkscreen:wght@700&family=Inter:wght@400;500;600&display=swap" precedence="default" />

      <nav className="deck-bar">
        <span>Daniel Ade-Otoki × {d.company}</span>
        <span className="deck-actions">
          <a href={`/${d.slug}`}>Product log</a>
          <a href={BOOKING_URL} target="_blank" rel="noreferrer">Book a call</a>
        </span>
      </nav>

      {/* 1 Cover */}
      <Slide tone="yellow" n={1}>
        <div className="cover-top"><b>{C}</b><b>DANIELADEOTOKI.COM</b></div>
        <div className="cover-main">
          <p className="hook">{d.hook}</p>
          <h1 className="mega">{d.role}</h1>
        </div>
        <div className="stickers">
          <span className="sticker blue tilt-l">{d.tags[0]}</span>
          <span className="sticker black tilt-r">{d.tags[1]}</span>
        </div>
        <div className="cover-date">{d.date}</div>
      </Slide>

      {/* 2 Index */}
      <Slide tone="blue" n={2} footer="Chapter one: introductions">
        <ol className="index">{index.map((x) => <li key={x}>{x}</li>)}</ol>
        <h2 className="mega bottom">Index</h2>
        <div className="stickers right">
          <span className="sticker black tilt-r">Daniel Ade-Otoki</span>
          <span className="sticker pink tilt-l">product designer</span>
        </div>
      </Slide>

      {/* 3 Intro */}
      <Slide tone="black" n={3}>
        <div className="two">
          <div>
            <h2 className="title">Intro</h2>
            {INTRO.body.map((p) => <p key={p} className="body">{p}</p>)}
          </div>
          <div>
            <h3 className="pixel">Some numbers behind the work:</h3>
            <ul className="bullets">{INTRO.numbers.map((x) => <li key={x}>{x}</li>)}</ul>
            <p className="body">{INTRO.closer}</p>
          </div>
        </div>
      </Slide>

      {/* 4 Built for */}
      <Slide tone="black" n={4}>
        <div className="two">
          <div>
            <h2 className="title"><span className="pinkt">I&apos;m built</span><br />for {d.company}</h2>
            <p className="body">{d.builtFor.context}</p>
          </div>
          <div>
            <p className="body">Three product opportunities I see:</p>
            <ul className="bullets">
              {d.builtFor.opportunities.map((o) => <li key={o.title}><b className="pinkt">{o.title}:</b> {o.body}</li>)}
            </ul>
          </div>
        </div>
      </Slide>

      {/* 5 Why me */}
      <Slide tone="black" n={5}>
        <div className="two">
          <div>
            <h2 className="title">Why me</h2>
            {d.whyMe.body.map((p) => <p key={p} className="body">{p}</p>)}
          </div>
          <div>
            <h3 className="pixel">What I bring:</h3>
            <ul className="bullets">{d.whyMe.bring.map((b) => <li key={b.title}><b className="yel">{b.title}:</b> {b.body}</li>)}</ul>
          </div>
        </div>
      </Slide>

      {/* 6–8 Case studies */}
      {d.caseStudies.map((k, i) => {
        const cs = CASE_STUDIES[k];
        return (
          <Slide tone="black" n={6 + i} key={k}>
            <div className="case">
              <div className="case-copy">
                <h2 className="title sm">{cs.name}</h2>
                <p className="label">{cs.label}</p>
                <p className="body">{cs.summary}</p>
                <p className="body dim">{cs.detail}</p>
                <p className="pixel outcome">Outcome:</p>
                <p className="outcome-text">{cs.outcome}</p>
                <a className="link" href={cs.url} target="_blank" rel="noreferrer">Read the case study ↗</a>
              </div>
              <div className="case-visual">
                {cs.image ? <img src={cs.image} alt={`${cs.name}: ${cs.label}`} /> : <div className="ph">{cs.label}</div>}
              </div>
            </div>
          </Slide>
        );
      })}

      {/* 9 Design systems */}
      <Slide tone="black" n={9}>
        <div className="two">
          <div>
            <h2 className="title">Design systems</h2>
            {SYSTEMS.body.map((p) => <p key={p} className="body">{p}</p>)}
          </div>
          <div>
            <h3 className="pixel">What {d.company} gets:</h3>
            <p className="body">{d.systemsGets}</p>
            <ul className="bullets">{SYSTEMS.approach.map((a) => <li key={a.title}><b className="yel">{a.title}:</b> {a.body}</li>)}</ul>
          </div>
        </div>
      </Slide>

      {/* 10 Opportunity */}
      <Slide tone="black" n={10}>
        <div className="opp">
          <div>
            <h2 className="title sm">{C} opportunity</h2>
            <p className="pixel">{d.opportunity.title}</p>
            <p className="body"><b className="pinkt">Problem:</b> {d.opportunity.problem}</p>
            <p className="body"><b className="yel">Solution:</b> {d.opportunity.solution}</p>
            <div className="btns">
              <a className="btn yellow" href={`/prototypes/${d.slug}`} target="_blank" rel="noreferrer">Try the prototype ↗</a>
              <a className="btn ghost" href={`/${d.slug}`} target="_blank" rel="noreferrer">Read the product log ↗</a>
            </div>
          </div>
          <div className="screen">
            <iframe src={`/prototypes/${d.slug}`} title={`${d.opportunity.title} prototype`} loading="lazy" />
          </div>
        </div>
      </Slide>

      {/* 11 Working style */}
      <Slide tone="black" n={11}>
        <div className="two">
          <div>
            <h2 className="title">Working style</h2>
            {WORKING_STYLE.body.map((p) => <p key={p} className="body">{p}</p>)}
          </div>
          <div>
            <h3 className="pixel">How I work:</h3>
            <ul className="bullets">{WORKING_STYLE.how.map((h) => <li key={h.title}><b className="yel">{h.title}:</b> {h.body}</li>)}</ul>
          </div>
        </div>
      </Slide>

      {/* 12 First week */}
      <Slide tone="black" n={12}>
        <div className="two">
          <div>
            <h2 className="title">First week at <span className="yel">{d.company}</span></h2>
            <p className="body">{d.firstWeek.intro}</p>
            <div className="stickers static"><span className="sticker yellowS tilt-l">ideas into products</span></div>
          </div>
          <ul className="bullets days">
            {d.firstWeek.days.map((x) => <li key={x.day}><b className="yel">{x.day}:</b> {x.body}</li>)}
          </ul>
        </div>
      </Slide>

      {/* 13 The ask */}
      <Slide tone="yellow" n={13}>
        <div className="ask">
          <h2 className="mega small">The ask</h2>
          <p>{d.ask}</p>
          <a className="btn black" href={BOOKING_URL} target="_blank" rel="noreferrer">Book a call</a>
          <p className="contact">
            <a href={LINKS.portfolio}>danieladeotoki.com</a> · <a href={LINKS.linkedin}>LinkedIn</a> · <a href={`mailto:${LINKS.email}`}>{LINKS.email}</a>
          </p>
        </div>
        <div className="stickers corners">
          <span className="sticker pink tilt-l">✳</span>
          <span className="sticker blue tilt-r">✎</span>
        </div>
      </Slide>

      <p className="deck-note">
        Independent pitch by Daniel Ade-Otoki. Not affiliated with {d.company}. Use your browser&apos;s Print → Save as PDF for a one-slide-per-page copy.
      </p>
    </main>
  );
}
