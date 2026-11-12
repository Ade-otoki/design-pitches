"use client";

// Concept prototype: "Fair Cancel" for instant mobile-money transfers.
// Independent concept by Daniel Ade-Otoki. Not Wave's official UI, not affiliated with Wave.
// Visual language follows Wave's public App Store screenshots (indigo home header, white sheet,
// round action icons, indigo transaction rows, cyan pill buttons, "25.000F" amounts).
// No Wave logo or mascot. Fictional people; amounts, times and the 30-minute window are illustrative.

import { useEffect, useMemo, useRef, useState } from "react";

type Lang = "fr" | "en";
type Side = "sender" | "recipient";
type Reason = "number" | "amount" | "other";

const COPY = {
  fr: {
    demo: "Démo du concept", sender: "Expéditeur", recipient: "Destinataire",
    details: "Détails du transfert", sentTo: "Envoyé à", cancelledTitle: "Envoi annulé",
    fee: "Frais Wave", debited: "Total débité", ref: "Référence",
    cancelCta: "Annuler l'envoi", left: "pour annuler",
    helper: "Vous pouvez annuler tant qu'Awa n'a pas retiré l'argent. Elle voit que ce transfert n'est pas encore définitif.",
    sheetTitle: "Annuler l'envoi de {a} ?", sheetBody: "L'argent revient sur votre solde. Awa verra la raison.",
    rNumber: "Mauvais numéro", rAmount: "Mauvais montant", rOther: "Autre raison",
    confirm: "Annuler l'envoi", keep: "Garder l'envoi",
    doneTitle: "{a} remis sur votre solde", doneBody: "Awa a été prévenue. Raison : {r}.",
    snackCancelled: "Envoi annulé",
    expiredTitle: "Le délai d'annulation est passé",
    expiredBody: "Demandez à Awa de vous renvoyer l'argent, ou contactez le service client.",
    actions: ["Transfert", "Paiements", "Crédit", "Banque"],
    receivedFrom: "Reçu de Moussa Ndiaye", withdrawal: "Retrait", deposit: "Dépôt",
    finalAt: "Définitif à {t}", final: "Définitif",
    notFinalTitle: "Pas encore définitif",
    notFinalBody: "Moussa peut encore annuler jusqu'à {t}. Avant de donner de la monnaie ou une marchandise, attendez ou vérifiez avec lui.",
    finalBody: "Cet argent est à vous. Il ne peut plus être annulé.",
    simulate: "Simuler l'annulation par Moussa",
    alertTitle: "Moussa a annulé son envoi de {a}", alertBody: "Raison : {r}. L'argent a été retiré de votre solde.",
    report: "Signaler un problème", reported: "Merci. Nous examinons votre signalement.",
    hideBalance: "Masquer le solde", showBalance: "Afficher le solde",
    credit: "Concept de Daniel Ade-Otoki · pas l'interface officielle de Wave · données fictives",
  },
  en: {
    demo: "Concept demo", sender: "Sender", recipient: "Recipient",
    details: "Transfer details", sentTo: "Sent to", cancelledTitle: "Transfer cancelled",
    fee: "Wave fee", debited: "Total debited", ref: "Reference",
    cancelCta: "Cancel transfer", left: "to cancel",
    helper: "You can cancel until Awa withdraws the money. She can see this transfer isn't final yet.",
    sheetTitle: "Cancel this {a} transfer?", sheetBody: "The money returns to your balance. Awa will see the reason.",
    rNumber: "Wrong number", rAmount: "Wrong amount", rOther: "Other reason",
    confirm: "Cancel transfer", keep: "Keep transfer",
    doneTitle: "{a} returned to your balance", doneBody: "Awa has been told. Reason: {r}.",
    snackCancelled: "Transfer cancelled",
    expiredTitle: "The cancellation window has closed",
    expiredBody: "Ask Awa to send the money back, or contact customer service.",
    actions: ["Transfer", "Payments", "Credit", "Bank"],
    receivedFrom: "From Moussa Ndiaye", withdrawal: "Withdrawal", deposit: "Deposit",
    finalAt: "Final at {t}", final: "Final",
    notFinalTitle: "Not final yet",
    notFinalBody: "Moussa can still cancel until {t}. Before you hand over change or goods, wait or check with him.",
    finalBody: "This money is yours. It can no longer be cancelled.",
    simulate: "Simulate Moussa cancelling",
    alertTitle: "Moussa cancelled his {a} transfer", alertBody: "Reason: {r}. The money has been taken out of your balance.",
    report: "Report a problem", reported: "Thanks. We're reviewing your report.",
    hideBalance: "Hide balance", showBalance: "Show balance",
    credit: "Concept by Daniel Ade-Otoki · not Wave's official UI · fictional data",
  },
} as const;


const ICONS = [
  // person (transfer)
  <svg key="t" viewBox="0 0 24 24" aria-hidden><circle cx="12" cy="8" r="4" fill="#3f46c9"/><path d="M4 20c0-4.4 3.6-7 8-7s8 2.6 8 7" fill="#3f46c9"/></svg>,
  // basket (payments)
  <svg key="p" viewBox="0 0 24 24" aria-hidden><path d="M3 10h18l-2 9H5z" fill="#e08a2c"/><path d="M7 10l3-5M17 10l-3-5" stroke="#9a5a14" strokeWidth="1.8" strokeLinecap="round" fill="none"/></svg>,
  // phone (credit)
  <svg key="c" viewBox="0 0 24 24" aria-hidden><rect x="7" y="3" width="10" height="18" rx="2.5" fill="#2f9fe0"/><rect x="9" y="5.5" width="6" height="11" rx="1" fill="#dff3fd"/></svg>,
  // bank
  <svg key="b" viewBox="0 0 24 24" aria-hidden><path d="M12 3l9 5H3z" fill="#d84545"/><path d="M5 10h2v7H5zM11 10h2v7h-2zM17 10h2v7h-2z" fill="#d84545"/><rect x="3" y="18" width="18" height="2.5" rx="1" fill="#d84545"/></svg>,
];
const EyeIcon = ({ off }: { off: boolean }) => (
  <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <path d="M2 12s3.5-6.5 10-6.5S22 12 22 12s-3.5 6.5-10 6.5S2 12 2 12z" />
    <circle cx="12" cy="12" r="3" />
    {off && <path d="M4 4l16 16" />}
  </svg>
);
const GearIcon = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="3.2" />
    <path d="M12 2.5v3M12 18.5v3M2.5 12h3M18.5 12h3M5.3 5.3l2.1 2.1M16.6 16.6l2.1 2.1M5.3 18.7l2.1-2.1M16.6 7.4l2.1-2.1" strokeLinecap="round" />
  </svg>
);

const WINDOW = 30 * 60; // illustrative
const START_LEFT = WINDOW - 2 * 60 - 10;
const fmt = (n: number) => n.toLocaleString("de-DE") + "F"; // 25.000F, as in Wave's app
const fill = (s: string, v: Record<string, string>) => s.replace(/\{(\w)\}/g, (_, k) => v[k] ?? "");

export default function FairCancel() {
  const [lang, setLang] = useState<Lang>("fr");
  const [side, setSide] = useState<Side>("sender");
  const [left, setLeft] = useState(START_LEFT);
  const [sheet, setSheet] = useState<"closed" | "open" | "closing">("closed");
  const [reason, setReason] = useState<Reason>("number");
  const [cancelled, setCancelled] = useState<Reason | null>(null);
  const [hidden, setHidden] = useState(false);
  const [toast, setToast] = useState<{ id: number; text: string; leaving?: boolean } | null>(null);
  const confirmRef = useRef<HTMLButtonElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const t = COPY[lang];

  useEffect(() => {
    if (cancelled || left <= 0) return;
    const id = setInterval(() => setLeft((s) => Math.max(0, s - 1)), 1000);
    return () => clearInterval(id);
  }, [cancelled, left]);

  useEffect(() => {
    if (!toast) return;
    if (toast.leaving) {
      const id = setTimeout(() => setToast(null), 200);
      return () => clearTimeout(id);
    }
    const id = setTimeout(() => setToast((x) => (x ? { ...x, leaving: true } : x)), 2600);
    return () => clearTimeout(id);
  }, [toast]);

  useEffect(() => {
    if (sheet !== "open") return;
    confirmRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") return closeSheet();
      if (e.key !== "Tab") return;
      const box = document.querySelector<HTMLElement>(".drawer");
      const f = box ? [...box.querySelectorAll<HTMLElement>("button, input")] : [];
      if (!f.length) return;
      const first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [sheet]); // eslint-disable-line react-hooks/exhaustive-deps

  function closeSheet() {
    setSheet("closing");
    setTimeout(() => { setSheet("closed"); triggerRef.current?.focus(); }, 200);
  }
  function confirmCancel() {
    setCancelled(reason);
    closeSheet();
    say(t.snackCancelled);
  }
  function say(text: string) { setToast({ id: Date.now(), text }); }

  const amount = fmt(25000);
  const mmss = `${Math.floor(left / 60)}:${String(left % 60).padStart(2, "0")}`;
  const finalTime = lang === "fr" ? "14h52" : "14:52";
  const reasonText = (r: Reason) => (r === "number" ? t.rNumber : r === "amount" ? t.rAmount : t.rOther);
  const isFinal = left <= 0 && !cancelled;
  const balance = useMemo(() => (cancelled ? 41500 : 66500), [cancelled]);

  return (
    <div className="fc" data-side={side}>
      <style>{CSS}</style>

      <div className="demo" role="group" aria-label={t.demo}>
        <span className="demo-l">{t.demo}</span>
        <div className="seg">
          {(["sender", "recipient"] as Side[]).map((s) => (
            <button key={s} className={side === s ? "on" : ""} aria-pressed={side === s} onClick={() => setSide(s)}>{t[s]}</button>
          ))}
        </div>
        <div className="seg">
          {(["fr", "en"] as Lang[]).map((l) => (
            <button key={l} className={lang === l ? "on" : ""} aria-pressed={lang === l} onClick={() => setLang(l)} lang={l}>{l.toUpperCase()}</button>
          ))}
        </div>
      </div>

      {side === "sender" ? (
        <section className="sender" key="sender" lang={lang}>
          <header className="nav">
            <span className="back" aria-hidden>‹</span>
            <h1>{t.details}</h1>
            <span />
          </header>

          <div className="hero">
            <div className={`badge ${cancelled ? "is-cancelled" : ""}`} aria-hidden>
              <span className="b-ok">✓</span>
              <span className="b-undo">↺</span>
            </div>
            <p className="eyebrow">{cancelled ? t.cancelledTitle : t.sentTo}</p>
            <p className="who">Awa Diop</p>
            <p className={`amt ${cancelled ? "struck" : ""}`}>−{amount}</p>
            <p className="meta">+221 77 ••• •• 12 · 12 Nov 2026 {lang === "fr" ? "à 14h22" : "at 14:22"}</p>
          </div>

          <dl className="rows">
            <div><dt>{t.fee}</dt><dd>{fmt(250)}</dd></div>
            <div><dt>{t.debited}</dt><dd>{fmt(25250)}</dd></div>
            <div><dt>{t.ref}</dt><dd>WV-7Q2K-91</dd></div>
          </dl>

          {cancelled ? (
            <div className="done" role="status">
              <b>{fill(t.doneTitle, { a: amount })}</b>
              <span>{fill(t.doneBody, { r: reasonText(cancelled).toLowerCase() })}</span>
            </div>
          ) : left > 0 ? (
            <div className="undo">
              <div className="track" aria-hidden><i style={{ transform: `scaleX(${left / WINDOW})` }} /></div>
              <button ref={triggerRef} className="btn-outline" onClick={() => setSheet("open")} aria-haspopup="dialog">
                <span>{t.cancelCta}</span>
                <span className="time" aria-label={`${mmss} ${t.left}`}>{mmss} {t.left}</span>
              </button>
              <p className="help">{t.helper}</p>
            </div>
          ) : (
            <div className="expired" role="status">
              <b>{t.expiredTitle}</b>
              <span>{t.expiredBody}</span>
            </div>
          )}
        </section>
      ) : (
        <section className="recipient" key="recipient" lang={lang}>
          <h1 className="sr">{lang === "fr" ? "Accueil" : "Home"}</h1>
          <div className="top">
            <span className="gear" aria-hidden><GearIcon /></span>
            <div className="balance">
              <b key={`${balance}-${hidden}`} className="bal-num">{hidden ? "•••••F" : fmt(balance)}</b>
              <button className="eye" onClick={() => setHidden((h) => !h)} aria-label={hidden ? t.showBalance : t.hideBalance}><EyeIcon off={hidden} /></button>
            </div>
          </div>

          <div className="sheetbody">
            <ul className="actions" aria-hidden>
              {t.actions.map((a, i) => (
                <li key={a}><span className={`ic ic${i}`}>{ICONS[i]}</span><span>{a}</span></li>
              ))}
            </ul>

            {cancelled && (
              <div className="alert" role="alert">
                <b>{fill(t.alertTitle, { a: amount })}</b>
                <span>{fill(t.alertBody, { r: reasonText(cancelled).toLowerCase() })}</span>
                <button className="link-red" onClick={() => say(t.reported)}>{t.report}</button>
              </div>
            )}

            <ul className="tx">
              <li className={`row first ${cancelled ? "is-cancelled" : ""}`}>
                <div>
                  <b>{t.receivedFrom}</b>
                  <span className="date">12 Nov 2026 {lang === "fr" ? "à 14h22" : "at 14:22"}</span>
                  {!cancelled && (
                    <span className={`chip ${isFinal ? "ok" : "wait"}`}>{isFinal ? t.final : fill(t.finalAt, { t: finalTime })}</span>
                  )}
                </div>
                <b className="val">+{amount}</b>
              </li>
              {!cancelled && (
                <li className={`note ${isFinal ? "ok" : "wait"}`}>
                  <b>{isFinal ? t.final : t.notFinalTitle}</b>
                  <span>{isFinal ? t.finalBody : fill(t.notFinalBody, { t: finalTime })}</span>
                  {!isFinal && <button className="ghost" onClick={() => setCancelled("number")}>{t.simulate}</button>}
                </li>
              )}
              <li className="row"><div><b>{t.withdrawal}</b><span className="date">11 Nov 2026 {lang === "fr" ? "à 9h20" : "at 09:20"}</span></div><b className="val">−{fmt(2000)}</b></li>
              <li className="row"><div><b>{t.deposit}</b><span className="date">10 Nov 2026 {lang === "fr" ? "à 13h05" : "at 13:05"}</span></div><b className="val">{fmt(12000)}</b></li>
            </ul>
          </div>
        </section>
      )}

      <p className="credit">{t.credit}</p>

      {sheet !== "closed" && (
        <div className={`scrim ${sheet === "closing" ? "out" : ""}`} onClick={closeSheet}>
          <div className={`drawer ${sheet === "closing" ? "out" : ""}`} role="dialog" aria-modal="true" aria-labelledby="sheet-title" onClick={(e) => e.stopPropagation()} lang={lang}>
            <div className="grab" aria-hidden />
            <h2 id="sheet-title">{fill(t.sheetTitle, { a: amount })}</h2>
            <p className="help">{t.sheetBody}</p>
            <fieldset>
              <legend className="sr">{lang === "fr" ? "Raison" : "Reason"}</legend>
              {(["number", "amount", "other"] as Reason[]).map((r) => (
                <label key={r} className={`opt ${reason === r ? "on" : ""}`}>
                  <input type="radio" name="reason" checked={reason === r} onChange={() => setReason(r)} />
                  <span>{reasonText(r)}</span>
                </label>
              ))}
            </fieldset>
            <button ref={confirmRef} className="btn-danger" onClick={confirmCancel}>{t.confirm}</button>
            <button className="btn-text" onClick={closeSheet}>{t.keep}</button>
          </div>
        </div>
      )}

      {toast && <div key={toast.id} className={`toast ${toast.leaving ? "out" : ""}`} role="status">{toast.text}</div>}
    </div>
  );
}

const CSS = `
.fc{
  --indigo:#4a3fdb; --indigo-ink:#2b2392; --sky:#5bc5f7; --sky-ink:#0b77ab; --ink:#1d1b3a; --muted:#686879;
  --line:#ececf3; --soft:#f5f5fa; --red:#d93a40; --red-text:#b3242a; --red-bg:#fdeeee; --amber:#8a5300; --amber-bg:#fff4dc; --green:#0e7a4c; --green-bg:#e6f6ee;
  --ease-out:cubic-bezier(.23,1,.32,1); --ease-drawer:cubic-bezier(.32,.72,0,1);
  min-height:100svh;background:#fff;color:var(--ink);font:15px/1.45 -apple-system,BlinkMacSystemFont,"SF Pro Text",Inter,system-ui,sans-serif;padding:46px 0 20px;position:relative;overflow:hidden}
.fc *{box-sizing:border-box}
.fc button{font:inherit;-webkit-tap-highlight-color:transparent}
.fc button:focus-visible,.opt:focus-within{outline:2px solid var(--sky-ink);outline-offset:2px}
.sr{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0)}

/* demo strip (not part of the concept UI) */
.demo{display:flex;flex-wrap:wrap;gap:6px;align-items:center;justify-content:space-between;margin:0 14px 10px;padding:6px 8px;border:1px dashed #cfcfe0;border-radius:12px}
.demo-l{font-size:10.5px;letter-spacing:.06em;text-transform:uppercase;color:var(--muted)}
.seg{display:flex;background:var(--soft);border-radius:999px;padding:3px}
.seg button{border:0;background:none;border-radius:999px;padding:4px 10px;font-size:12.5px;color:var(--muted);cursor:pointer;transition:background-color 160ms ease,color 160ms ease}
.seg button.on{background:#fff;color:var(--ink);font-weight:600;box-shadow:0 1px 2px rgba(20,20,60,.12)}

/* screen enter */
.sender,.recipient{animation:enter 260ms var(--ease-out) both}
@keyframes enter{from{opacity:0;transform:translateY(6px)}}

/* sender: transfer details, white like Wave's send screen */
.nav{display:grid;grid-template-columns:32px 1fr 32px;align-items:center;padding:4px 14px 8px}
.nav h1{margin:0;text-align:center;font-size:17px;font-weight:600}
.back{font-size:30px;line-height:1;color:var(--ink)}
.hero{text-align:center;padding:10px 20px 18px}
.badge{position:relative;width:56px;height:56px;margin:0 auto 10px;border-radius:50%;background:#e8f7fe}
.badge span{position:absolute;inset:0;display:grid;place-items:center;font-size:24px;font-weight:700;transition:opacity 200ms ease,filter 200ms ease,transform 200ms var(--ease-out)}
.b-ok{color:var(--sky-ink)}
.b-undo{color:var(--muted);opacity:0;filter:blur(2px);transform:scale(.9)}
.badge.is-cancelled{background:var(--soft)}
.badge.is-cancelled .b-ok{opacity:0;filter:blur(2px);transform:scale(.9)}
.badge.is-cancelled .b-undo{opacity:1;filter:none;transform:none}
.eyebrow{margin:0;color:var(--muted);font-size:14px}
.who{margin:2px 0 0;font-weight:600;font-size:17px}
.amt{margin:6px 0 2px;font-size:34px;font-weight:700;color:var(--indigo-ink);letter-spacing:-.02em;font-variant-numeric:tabular-nums;position:relative;display:inline-block}
.amt::after{content:"";position:absolute;left:-2px;right:-2px;top:52%;height:2px;background:currentColor;transform:scaleX(0);transform-origin:left;transition:transform 260ms var(--ease-out)}
.amt.struck{color:var(--muted)} .amt.struck::after{transform:scaleX(1)}
.meta{margin:0;color:var(--muted);font-size:13px}
.rows{margin:0 20px;border-top:1px solid var(--line)}
.rows div{display:flex;justify-content:space-between;padding:11px 0;border-bottom:1px solid var(--line);font-size:14.5px}
.rows dt{color:var(--muted)} .rows dd{margin:0;font-variant-numeric:tabular-nums}
.undo{margin:18px 20px 0}
.track{height:4px;border-radius:4px;background:var(--soft);overflow:hidden;margin-bottom:12px}
.track i{display:block;height:100%;background:var(--sky);transform-origin:left;transition:transform 1s linear}
.btn-outline{width:100%;display:flex;justify-content:space-between;align-items:center;gap:8px;padding:14px 18px;border-radius:999px;border:1.5px solid var(--red);background:#fff;color:var(--red);font-weight:600;cursor:pointer;transition:transform 160ms var(--ease-out),background-color 160ms ease}
.btn-outline:active{transform:scale(.97);background:var(--red-bg)}
.time{font-weight:500;font-size:13px;font-variant-numeric:tabular-nums}
.help{font-size:13px;color:var(--muted);margin:10px 4px 0}
.done,.expired{margin:18px 20px 0;padding:14px 16px;border-radius:16px;display:flex;flex-direction:column;gap:2px;animation:enter 260ms var(--ease-out) both}
.done{background:var(--soft)} .expired{background:var(--amber-bg)}
.done span,.expired span{font-size:14px;color:var(--muted)}

/* recipient: Wave-style home */
.top{background:var(--indigo);color:#fff;padding:16px 18px 54px;margin-top:-6px;position:relative}
.gear{position:absolute;left:18px;top:18px;opacity:.9;display:flex}
.balance{display:flex;justify-content:center;align-items:center;gap:8px;padding-top:6px}
.bal-num{font-size:30px;font-weight:800;letter-spacing:-.01em;font-variant-numeric:tabular-nums;animation:num 220ms ease both}
@keyframes num{from{opacity:0;filter:blur(3px)}}
.eye{border:0;background:rgba(255,255,255,.14);color:#fff;width:44px;height:44px;display:grid;place-items:center;border-radius:50%;cursor:pointer;font-size:13px;transition:transform 160ms var(--ease-out)}
.eye:active{transform:scale(.94)}
.sheetbody{background:#fff;border-radius:22px 22px 0 0;margin-top:-30px;position:relative;padding:16px 16px 0}
.actions{list-style:none;margin:0 0 12px;padding:0 0 14px;display:grid;grid-template-columns:repeat(4,1fr);border-bottom:8px solid var(--soft)}
.actions li{display:flex;flex-direction:column;align-items:center;gap:6px;font-size:12px;color:var(--ink)}
.ic{width:46px;height:46px;border-radius:50%;display:grid;place-items:center}
.ic svg{width:24px;height:24px}
.ic0{background:#dfe4ff}.ic1{background:#fdf0d8}.ic2{background:#dff3fd}.ic3{background:#fde4e4}
.alert{margin:4px 0 10px;padding:12px 14px;border-radius:14px;background:var(--red-bg);display:flex;flex-direction:column;gap:2px;animation:drop 260ms var(--ease-out) both}
@keyframes drop{from{opacity:0;transform:translateY(-8px)}}
.alert b{color:var(--red-text)} .alert span{font-size:13.5px}
.link-red{align-self:flex-start;margin:0 0 -10px -8px;border:0;background:none;padding:12px 8px;min-height:44px;color:var(--red-text);font-weight:600;text-decoration:underline;text-underline-offset:3px;cursor:pointer}
.tx{list-style:none;margin:0;padding:0}
.row{display:flex;justify-content:space-between;gap:10px;padding:12px 2px;border-bottom:1px solid var(--line)}
.row div{display:flex;flex-direction:column;gap:1px}
.row b{color:var(--indigo-ink);font-weight:600}
.date{font-size:12.5px;color:var(--muted)}
.val{white-space:nowrap;font-variant-numeric:tabular-nums}
.row.is-cancelled .val{color:var(--muted);text-decoration:line-through}
.chip{align-self:flex-start;margin-top:5px;font-size:12px;font-weight:600;border-radius:999px;padding:2px 9px;transition:background-color 200ms ease,color 200ms ease}
.chip.wait{background:var(--amber-bg);color:var(--amber)} .chip.ok{background:var(--green-bg);color:var(--green)}
.note{margin:8px 0 10px;padding:12px 14px;border-radius:14px;display:flex;flex-direction:column;gap:3px;transition:background-color 200ms ease}
.note.wait{background:var(--amber-bg)} .note.ok{background:var(--green-bg)}
.note.wait b{color:var(--amber)} .note.ok b{color:var(--green)}
.note span{font-size:13.5px}
.ghost{align-self:flex-start;margin-top:8px;border:1px dashed #b08a4a;background:transparent;border-radius:10px;padding:10px 12px;min-height:44px;font-size:12.5px;color:var(--amber);cursor:pointer;transition:transform 160ms var(--ease-out)}
.ghost:active{transform:scale(.97)}

.credit{margin:18px 14px 0;text-align:center;font-size:11px;color:#6f6f80}

/* bottom sheet */
.scrim{position:absolute;inset:0;background:rgba(20,18,60,.38);display:flex;align-items:flex-end;z-index:10;animation:fade 200ms ease both}
.scrim.out{animation:fadeout 200ms ease both}
@keyframes fade{from{opacity:0}} @keyframes fadeout{to{opacity:0}}
.drawer{width:100%;background:#fff;border-radius:22px 22px 0 0;padding:10px 18px 24px;animation:up 320ms var(--ease-drawer) both}
.drawer.out{animation:down 200ms var(--ease-out) both}
@keyframes up{from{transform:translateY(100%)}} @keyframes down{to{transform:translateY(100%)}}
.grab{width:40px;height:4px;border-radius:2px;background:#dcdce8;margin:0 auto 14px}
.drawer h2{margin:0;font-size:18px}
fieldset{border:0;margin:14px 0 4px;padding:0}
.opt{display:flex;gap:10px;align-items:center;border:1.5px solid var(--line);border-radius:14px;padding:12px 14px;margin-bottom:8px;cursor:pointer;transition:border-color 160ms ease}
.opt.on{border-color:var(--indigo)}
.opt input{accent-color:var(--indigo);width:18px;height:18px}
.btn-danger{width:100%;margin-top:10px;padding:15px;border:0;border-radius:999px;background:var(--red);color:#fff;font-weight:700;cursor:pointer;transition:transform 160ms var(--ease-out)}
.btn-danger:active{transform:scale(.97)}
.btn-text{width:100%;margin-top:4px;padding:13px;border:0;border-radius:999px;background:none;color:var(--sky-ink);font-weight:600;cursor:pointer}

/* toast */
.toast{position:absolute;left:14px;right:14px;bottom:16px;z-index:20;background:var(--ink);color:#fff;border-radius:14px;padding:11px 14px;font-size:14px;text-align:center;animation:toast 300ms var(--ease-out) both}
@keyframes toast{from{opacity:0;transform:translateY(100%)}}
.toast.out{animation:toastout 200ms var(--ease-out) both}
@keyframes toastout{to{opacity:0;transform:translateY(100%)}}

@media (prefers-reduced-motion:reduce){
  .sender,.recipient,.done,.expired,.alert,.toast{animation:fade 200ms ease both}
  .toast.out{animation:fadeout 150ms ease both}
  .drawer,.drawer.out{animation:none}
  .track i{transition:none}
  .btn-outline:active,.btn-danger:active,.ghost:active,.eye:active{transform:none}
  .badge span,.amt::after{transition:opacity 150ms ease}
}
`;
