"use client";

// Live mockup: the real Wave "Fair Cancel" prototype running inside two iPhone 17 frames.
// The phones talk over a BroadcastChannel (?sync=1), so cancelling on Moussa's phone
// updates Awa's phone straight away. Concept by Daniel Ade-Otoki, not Wave's official UI.

import { useState } from "react";
import IPhone17 from "../../../lib/IPhone17";
import { BOOKING_URL } from "../../../lib/site";

type Lang = "fr" | "en";

const COPY = {
  en: {
    eyebrow: "Fair Cancel · concept for Wave mobile money",
    title: ["Undo a wrong transfer,", "without leaving anyone exposed."],
    sub: "Both phones are live. Tap Cancel transfer on Moussa's phone and watch Awa's phone update.",
    sender: "Sender", recipient: "Recipient",
    senderName: "Moussa sends 25.000F", recipientName: "Awa receives it",
    senderBody: "He has a short window to cancel, and has to give a reason.",
    recipientBody: "She can see the money isn't final yet, and is told why if it's taken back.",
    restart: "Restart demo", lang: "Language",
    log: "Read the product log", book: "Book a call",
    foot: "Concept by Daniel Ade-Otoki · not Wave's official UI · fictional data",
  },
  fr: {
    eyebrow: "Fair Cancel · concept pour Wave mobile money",
    title: ["Annuler un mauvais envoi,", "sans laisser personne exposé."],
    sub: "Les deux téléphones sont en direct. Touchez « Annuler l'envoi » sur le téléphone de Moussa et regardez celui d'Awa se mettre à jour.",
    sender: "Expéditeur", recipient: "Destinataire",
    senderName: "Moussa envoie 25.000F", recipientName: "Awa le reçoit",
    senderBody: "Il dispose d'un court délai pour annuler, avec une raison.",
    recipientBody: "Elle voit que l'argent n'est pas encore définitif, et sait pourquoi s'il est repris.",
    restart: "Recommencer", lang: "Langue",
    log: "Lire le product log", book: "Réserver un appel",
    foot: "Concept de Daniel Ade-Otoki · pas l'interface officielle de Wave · données fictives",
  },
} as const;

function post(msg: object) {
  if (typeof BroadcastChannel === "undefined") return;
  const c = new BroadcastChannel("wave-fair-cancel");
  c.postMessage(msg);
  c.close();
}

export default function LiveWave() {
  const [lang, setLang] = useState<Lang>("en");
  const t = COPY[lang];
  // The phones load once in English; language changes go over the channel so the demo state survives.
  const src = (side: string) => `/prototypes/wave?embed=1&sync=1&side=${side}&lang=en`;

  function changeLang(l: Lang) {
    setLang(l);
    post({ type: "lang", lang: l });
  }

  return (
    <main className="lw" lang={lang}>
      <style>{CSS}</style>
      <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" />

      <header className="lw-head">
        <div>
          <p className="lw-eyebrow">{t.eyebrow}</p>
          <h1>{t.title[0]}<br />{t.title[1]}</h1>
        </div>
        <div className="lw-side">
          <p className="lw-sub">{t.sub}</p>
          <div className="lw-controls">
            <div className="lw-seg" role="group" aria-label={t.lang}>
              {(["en", "fr"] as Lang[]).map((l) => (
                <button key={l} className={lang === l ? "on" : ""} aria-pressed={lang === l} onClick={() => changeLang(l)} lang={l}>
                  {l.toUpperCase()}
                </button>
              ))}
            </div>
            <button className="lw-btn" onClick={() => post({ type: "reset" })}>
              <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 1 0 3-6.7" /><path d="M3 4v5h5" /></svg>
              {t.restart}
            </button>
          </div>
        </div>
      </header>

      <section className="lw-phones">
        {(["sender", "recipient"] as const).map((side) => (
          <figure key={side} className="lw-fig">
            <div className="lw-phone">
              <IPhone17 src={src(side)} title={`${side === "sender" ? t.senderName : t.recipientName}: live prototype`} />
            </div>
            <figcaption>
              <span className={`lw-who ${side}`}>{side === "sender" ? t.sender : t.recipient}</span>
              <b>{side === "sender" ? t.senderName : t.recipientName}</b>
              <span>{side === "sender" ? t.senderBody : t.recipientBody}</span>
            </figcaption>
          </figure>
        ))}
        <svg className="lw-link" viewBox="0 0 120 24" aria-hidden>
          <path d="M4 12h106" stroke="currentColor" strokeWidth="2" strokeDasharray="4 6" strokeLinecap="round" />
          <path d="M104 5l9 7-9 7" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </section>

      <footer className="lw-foot">
        <span>{t.foot}</span>
        <span className="lw-links">
          <a href="/wave">{t.log}</a>
          <a href={BOOKING_URL} target="_blank" rel="noreferrer">{t.book}</a>
        </span>
      </footer>
    </main>
  );
}

const CSS = `
html,body{background:#f6f6fb}
.lw{--ink:#1d1b3a;--muted:#5c5b70;--indigo:#4a3fdb;--ease-out:cubic-bezier(.23,1,.32,1);
  min-height:100vh;box-sizing:border-box;color:var(--ink);font-family:Inter,system-ui,sans-serif;
  background:radial-gradient(1100px 620px at 50% 0%,#e9e7ff 0%,#f6f6fb 62%);padding:56px clamp(16px,5vw,80px) 32px}
.lw *{box-sizing:border-box}
.lw-head{display:flex;justify-content:space-between;align-items:flex-end;gap:40px;max-width:1180px;margin:0 auto 40px}
.lw-eyebrow{margin:0 0 12px;font-size:15px;font-weight:600;color:var(--indigo)}
.lw h1{margin:0;font-size:clamp(34px,3.7vw,46px);line-height:1.02;letter-spacing:-.035em;font-weight:800;text-wrap:balance}
.lw-side{max-width:400px;display:flex;flex-direction:column;gap:18px;align-items:flex-end;text-align:right}
.lw-sub{margin:0;font-size:17px;line-height:1.5;color:var(--muted)}
.lw-controls{display:flex;gap:10px;align-items:center}
.lw-seg{display:flex;background:#e7e6f3;border-radius:999px;padding:3px}
.lw-seg button,.lw-btn{font:inherit;cursor:pointer;-webkit-tap-highlight-color:transparent}
.lw-seg button{border:0;background:none;border-radius:999px;min-width:44px;min-height:36px;padding:0 12px;font-size:14px;color:var(--muted);transition:background-color 160ms ease,color 160ms ease}
.lw-seg button.on{background:#fff;color:var(--ink);font-weight:600;box-shadow:0 1px 2px rgba(20,20,60,.12)}
.lw-btn{display:inline-flex;align-items:center;gap:8px;min-height:42px;padding:0 16px;border:0;border-radius:999px;background:var(--ink);color:#fff;font-size:14.5px;font-weight:600;transition:transform 160ms var(--ease-out)}
.lw-btn:active{transform:scale(.97)}
.lw-btn:active svg{transform:rotate(-90deg)}
.lw-btn svg{transition:transform 300ms var(--ease-out)}
.lw button:focus-visible,.lw a:focus-visible{outline:2px solid var(--indigo);outline-offset:3px}
.lw-phones{position:relative;display:flex;justify-content:center;gap:clamp(40px,9vw,140px);max-width:1180px;margin:0 auto}
.lw-fig{margin:0;width:min(310px,100%)}
.lw-phone{width:100%}
.lw-fig figcaption{margin-top:28px;display:flex;flex-direction:column;gap:8px}
.lw-fig b{font-size:19px;letter-spacing:-.01em}
.lw-fig figcaption span:last-child{font-size:15.5px;line-height:1.5;color:var(--muted)}
.lw-who{align-self:flex-start;font-size:12px;font-weight:600;text-transform:uppercase;letter-spacing:.08em;padding:5px 10px;border-radius:999px}
.lw-who.sender{background:#e4e2ff;color:#2b2392}.lw-who.recipient{background:#dff2fd;color:#0b5f88}
.lw-link{position:absolute;top:34%;left:50%;width:clamp(40px,7vw,110px);transform:translateX(-50%);color:#a9a6d6;pointer-events:none}
.lw-foot{display:flex;justify-content:space-between;gap:16px;flex-wrap:wrap;max-width:1180px;margin:56px auto 0;font-size:14px;color:#7a7990}
.lw-links{display:flex;gap:18px}
.lw-links a{color:var(--indigo);font-weight:600;text-decoration:none}
.lw-links a:hover{text-decoration:underline}
.sf{position:relative;width:100%;overflow:hidden;background:#fff}
.sf iframe{position:absolute;top:0;left:0;border:0;display:block;background:#fff}
@media (max-width:820px){
  .lw{padding-top:32px}
  .lw-head{flex-direction:column;align-items:flex-start;margin-bottom:36px}
  .lw-side{align-items:flex-start;text-align:left}
  .lw-phones{flex-direction:column;align-items:center;gap:48px}
  .lw-link{display:none}
}
@media (prefers-reduced-motion:reduce){.lw-btn,.lw-btn svg{transition:none}}
`;
