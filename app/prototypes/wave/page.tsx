"use client";

// Concept prototype: "Fair Cancel" for instant mobile-money transfers.
// Independent concept by Daniel Ade-Otoki. Not Wave's UI, not affiliated with Wave.
// Fictional people; amounts, times and the 30-minute window are illustrative.

import { useEffect, useMemo, useState } from "react";

type Lang = "fr" | "en";
type Side = "sender" | "recipient";
type Reason = "number" | "amount" | "other";

const T = {
  fr: {
    demo: "Démo du concept", sender: "Expéditeur", recipient: "Destinataire",
    sent: "Envoyé à", to: "Awa Diop", phone: "+221 77 ••• •• 12",
    justNow: "Il y a 2 min", fee: "Frais", free: "Gratuit", ref: "Réf.",
    cancelBtn: "Annuler ce transfert", left: "restantes",
    windowNote: "Annulable tant qu'Awa n'a pas retiré l'argent. Awa voit que ce transfert n'est pas encore définitif.",
    why: "Pourquoi annuler ?", rNumber: "Mauvais numéro", rAmount: "Mauvais montant", rOther: "Autre raison",
    seen: "Awa verra la raison.", confirm: "Confirmer l'annulation", back: "Retour",
    cancelled: "Transfert annulé", backBal: "remis sur votre solde",
    expired: "Le délai d'annulation est passé. Contactez Awa ou le service client.",
    home: "Solde", from: "De Moussa Ndiaye", received: "Reçu",
    finalAt: "Définitif à", notFinal: "Pas encore définitif",
    notFinalBody: "Moussa peut encore annuler ce transfert jusqu'à {t}. Si vous donnez de la monnaie ou une marchandise, attendez ou confirmez avec lui.",
    final: "Définitif", finalBody: "Cet argent est à vous. Il ne peut plus être annulé.",
    simulate: "Simuler : Moussa annule", cancelledBy: "Moussa a annulé 25 000 F",
    reasonLbl: "Raison", report: "J'ai déjà donné la marchandise ou la monnaie",
    reported: "Signalement envoyé avec les détails du transfert.",
    credit: "Concept de Daniel Ade-Otoki · pas l'interface de Wave · données fictives",
  },
  en: {
    demo: "Concept demo", sender: "Sender", recipient: "Recipient",
    sent: "Sent to", to: "Awa Diop", phone: "+221 77 ••• •• 12",
    justNow: "2 min ago", fee: "Fee", free: "Free", ref: "Ref.",
    cancelBtn: "Cancel this transfer", left: "left",
    windowNote: "You can cancel until Awa withdraws the money. Awa can see this transfer isn't final yet.",
    why: "Why are you cancelling?", rNumber: "Wrong number", rAmount: "Wrong amount", rOther: "Something else",
    seen: "Awa will see the reason.", confirm: "Confirm cancellation", back: "Back",
    cancelled: "Transfer cancelled", backBal: "returned to your balance",
    expired: "The cancellation window has closed. Contact Awa or customer service.",
    home: "Balance", from: "From Moussa Ndiaye", received: "Received",
    finalAt: "Final at", notFinal: "Not final yet",
    notFinalBody: "Moussa can still cancel this transfer until {t}. If you're giving change or goods for it, wait or check with him.",
    final: "Final", finalBody: "This money is yours. It can no longer be cancelled.",
    simulate: "Simulate: Moussa cancels", cancelledBy: "Moussa cancelled 25,000 F",
    reasonLbl: "Reason", report: "I already handed over goods or change",
    reported: "Report sent with the transfer details.",
    credit: "Concept by Daniel Ade-Otoki · not Wave's UI · fictional data",
  },
} as const;

const WINDOW = 30 * 60; // illustrative 30-minute window
const SENT_AT = new Date(2026, 10, 12, 14, 22); // 14:22, so final at 14:52

export default function FairCancel() {
  const [lang, setLang] = useState<Lang>("fr");
  const [side, setSide] = useState<Side>("sender");
  const [left, setLeft] = useState(WINDOW - 2 * 60 - 7);
  const [sheet, setSheet] = useState(false);
  const [reason, setReason] = useState<Reason>("number");
  const [cancelled, setCancelled] = useState<Reason | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const t = T[lang];

  useEffect(() => {
    if (cancelled || left <= 0) return;
    const id = setInterval(() => setLeft((s) => Math.max(0, s - 1)), 1000);
    return () => clearInterval(id);
  }, [cancelled, left]);
  useEffect(() => {
    if (!toast) return;
    const id = setTimeout(() => setToast(null), 2800);
    return () => clearTimeout(id);
  }, [toast]);

  const amount = lang === "fr" ? "25 000 F" : "25,000 F";
  const mmss = `${Math.floor(left / 60)}:${String(left % 60).padStart(2, "0")}`;
  const finalTime = useMemo(() => {
    const d = new Date(SENT_AT.getTime() + WINDOW * 1000);
    return `${d.getHours()}:${String(d.getMinutes()).padStart(2, "0")}`;
  }, []);
  const pct = (left / WINDOW) * 100;
  const reasonText = (r: Reason) => (r === "number" ? t.rNumber : r === "amount" ? t.rAmount : t.rOther);
  const isFinal = left <= 0 && !cancelled;

  return (
    <div className="fc">
      <style>{CSS}</style>

      <div className="demo">
        <span>{t.demo}</span>
        <div className="seg">
          {(["sender", "recipient"] as Side[]).map((s) => (
            <button key={s} className={side === s ? "on" : ""} aria-pressed={side === s} onClick={() => setSide(s)}>{t[s]}</button>
          ))}
        </div>
        <div className="seg sm">
          {(["fr", "en"] as Lang[]).map((l) => (
            <button key={l} className={lang === l ? "on" : ""} aria-pressed={lang === l} onClick={() => setLang(l)}>{l.toUpperCase()}</button>
          ))}
        </div>
      </div>

      {side === "sender" ? (
        <section className="screen">
          <div className="receipt">
            <div className={`status ${cancelled ? "gray" : "ok"}`}>{cancelled ? "↺" : "✓"}</div>
            <p className="muted">{cancelled ? t.cancelled : t.sent}</p>
            <p className="amount">{cancelled ? <s>{amount}</s> : `−${amount}`}</p>
            <p className="who">{t.to}</p>
            <p className="muted small">{t.phone} · {t.justNow}</p>
            <dl>
              <div><dt>{t.fee}</dt><dd>{t.free}</dd></div>
              <div><dt>{t.ref}</dt><dd>WV-7Q2K-91</dd></div>
            </dl>
          </div>

          {cancelled ? (
            <div className="done">
              <b>{amount} {t.backBal}</b>
              <span>{t.reasonLbl} : {reasonText(cancelled)}</span>
            </div>
          ) : left > 0 ? (
            <div className="undo">
              <div className="bar" aria-hidden><i style={{ width: `${pct}%` }} /></div>
              <button className="danger" onClick={() => setSheet(true)}>
                {t.cancelBtn}<span>{mmss} {t.left}</span>
              </button>
              <p className="note">{t.windowNote}</p>
            </div>
          ) : (
            <p className="note">{t.expired}</p>
          )}
        </section>
      ) : (
        <section className="screen">
          <div className="bal"><span className="muted">{t.home}</span><b>{cancelled ? (lang === "fr" ? "41 500 F" : "41,500 F") : (lang === "fr" ? "66 500 F" : "66,500 F")}</b></div>

          {cancelled && (
            <div className="alert" role="alert">
              <b>{t.cancelledBy}</b>
              <span>{t.reasonLbl} : {reasonText(cancelled)}</span>
              <button onClick={() => setToast(t.reported)}>{t.report}</button>
            </div>
          )}

          <div className="tx">
            <div className="avatar">MN</div>
            <div className="txm">
              <b>{t.from}</b>
              <span className="muted small">{t.received} · 14:22</span>
              {!cancelled && (
                <span className={`chip ${isFinal ? "green" : "amber"}`}>{isFinal ? t.final : `${t.finalAt} ${finalTime}`}</span>
              )}
            </div>
            <b className={cancelled ? "strike" : "plus"}>+{amount}</b>
          </div>

          {!cancelled && (
            <div className={`explain ${isFinal ? "green" : "amber"}`}>
              <b>{isFinal ? t.final : t.notFinal}</b>
              <p>{isFinal ? t.finalBody : t.notFinalBody.replace("{t}", finalTime)}</p>
              {!isFinal && <button className="ghost" onClick={() => { setCancelled("number"); }}>{t.simulate}</button>}
            </div>
          )}
        </section>
      )}

      <p className="credit">{t.credit}</p>

      {sheet && (
        <div className="sheet-bg" onClick={() => setSheet(false)}>
          <div className="sheet" role="dialog" aria-modal="true" aria-label={t.why} onClick={(e) => e.stopPropagation()}>
            <div className="grab" />
            <h3>{t.why}</h3>
            {(["number", "amount", "other"] as Reason[]).map((r) => (
              <label key={r} className={`opt ${reason === r ? "on" : ""}`}>
                <input type="radio" name="reason" checked={reason === r} onChange={() => setReason(r)} />
                {reasonText(r)}
              </label>
            ))}
            <p className="note">{t.seen}</p>
            <button className="danger solid" onClick={() => { setCancelled(reason); setSheet(false); }}>{t.confirm}</button>
            <button className="text" onClick={() => setSheet(false)}>{t.back}</button>
          </div>
        </div>
      )}
      {toast && <div className="toast" role="status">{toast}</div>}
    </div>
  );
}

const CSS = `
.fc{--ink:#0f1a2a;--muted:#5d6b7e;--line:#e6ebf1;--bg:#f4f7fb;--card:#fff;--brand:#1c6ef2;--green:#0f8a55;--green-bg:#e6f6ee;--amber:#9a5b00;--amber-bg:#fff4e0;--red:#c3262f;--red-bg:#fdecec;
  min-height:100svh;background:var(--bg);color:var(--ink);font:15px/1.45 Inter,system-ui,sans-serif;padding:50px 16px 22px;}
.fc *{box-sizing:border-box}
.demo{display:flex;flex-wrap:wrap;gap:8px;align-items:center;justify-content:space-between;border:1px dashed #c6d0dd;border-radius:12px;padding:8px 10px;margin-bottom:16px;font-size:11.5px;color:var(--muted);text-transform:uppercase;letter-spacing:.05em}
.seg{display:flex;background:#e8eef6;border-radius:999px;padding:3px}
.seg button{border:0;background:none;border-radius:999px;padding:5px 10px;font:inherit;font-size:12.5px;text-transform:none;letter-spacing:0;color:var(--muted);cursor:pointer}
.seg button.on{background:#fff;color:var(--ink);font-weight:600;box-shadow:0 1px 2px rgba(0,0,0,.08)}
.seg.sm button{padding:5px 8px}
button:focus-visible,label:focus-within{outline:2px solid var(--brand);outline-offset:2px}
.screen{display:flex;flex-direction:column;gap:12px}
.receipt{background:var(--card);border:1px solid var(--line);border-radius:20px;padding:22px 18px;text-align:center}
.status{width:48px;height:48px;border-radius:50%;margin:0 auto 10px;display:grid;place-items:center;font-size:22px;font-weight:700}
.status.ok{background:var(--green-bg);color:var(--green)} .status.gray{background:#eef1f5;color:var(--muted)}
.muted{color:var(--muted);margin:0} .small{font-size:13px}
.amount{font-size:32px;font-weight:700;margin:2px 0;letter-spacing:-.02em;font-variant-numeric:tabular-nums}
.who{margin:0;font-weight:600}
dl{margin:16px 0 0;border-top:1px solid var(--line);padding-top:10px;text-align:left}
dl div{display:flex;justify-content:space-between;padding:4px 0;font-size:14px} dt{color:var(--muted)} dd{margin:0}
.undo{background:var(--card);border:1px solid var(--line);border-radius:18px;padding:14px}
.bar{height:4px;background:#eef1f5;border-radius:4px;overflow:hidden;margin-bottom:12px}
.bar i{display:block;height:100%;background:var(--amber);transition:width 1s linear}
.danger{width:100%;display:flex;justify-content:space-between;align-items:center;gap:8px;border:1.5px solid var(--red);color:var(--red);background:#fff;border-radius:14px;padding:13px 14px;font:inherit;font-weight:600;cursor:pointer}
.danger span{font-weight:500;font-size:13px;font-variant-numeric:tabular-nums}
.danger.solid{background:var(--red);color:#fff;justify-content:center;margin-top:6px}
.note{font-size:13px;color:var(--muted);margin:10px 2px 0}
.done{background:#eef1f5;border-radius:16px;padding:14px;display:flex;flex-direction:column;gap:2px}
.bal{background:var(--card);border:1px solid var(--line);border-radius:18px;padding:16px;display:flex;justify-content:space-between;align-items:center}
.bal b{font-size:24px;font-variant-numeric:tabular-nums}
.alert{background:var(--red-bg);border-radius:16px;padding:14px;display:flex;flex-direction:column;gap:4px}
.alert b{color:var(--red)}
.alert button{margin-top:6px;align-self:flex-start;border:0;background:none;padding:0;color:var(--red);font:inherit;font-weight:600;text-decoration:underline;cursor:pointer;text-align:left}
.tx{background:var(--card);border:1px solid var(--line);border-radius:18px;padding:14px;display:flex;gap:12px;align-items:flex-start}
.avatar{width:40px;height:40px;border-radius:50%;background:#e2ebff;color:var(--brand);display:grid;place-items:center;font-weight:700;font-size:13px;flex:none}
.txm{flex:1;display:flex;flex-direction:column;gap:2px}
.plus{color:var(--green);white-space:nowrap} .strike{color:var(--muted);text-decoration:line-through;white-space:nowrap}
.chip{align-self:flex-start;margin-top:4px;font-size:12px;font-weight:600;border-radius:999px;padding:2px 9px}
.chip.amber{background:var(--amber-bg);color:var(--amber)} .chip.green{background:var(--green-bg);color:var(--green)}
.explain{border-radius:16px;padding:14px} .explain.amber{background:var(--amber-bg)} .explain.green{background:var(--green-bg)}
.explain b{display:block} .explain.amber b{color:var(--amber)} .explain.green b{color:var(--green)}
.explain p{margin:4px 0 0;font-size:14px}
.ghost{margin-top:10px;border:1px dashed #b59152;background:none;border-radius:10px;padding:7px 10px;font:inherit;font-size:13px;color:var(--amber);cursor:pointer}
.credit{margin:18px 0 0;text-align:center;font-size:11.5px;color:#93a0b1}
.sheet-bg{position:fixed;inset:0;background:rgba(10,20,35,.35);display:flex;align-items:flex-end;z-index:10}
.sheet{width:100%;background:#fff;border-radius:22px 22px 0 0;padding:10px 18px 22px}
.grab{width:40px;height:4px;border-radius:2px;background:#d6dde7;margin:0 auto 14px}
.sheet h3{margin:0 0 10px;font-size:17px}
.opt{display:flex;gap:10px;align-items:center;border:1px solid var(--line);border-radius:12px;padding:12px;margin-bottom:8px;cursor:pointer}
.opt.on{border-color:var(--ink)}
.opt input{accent-color:var(--ink)}
.text{width:100%;border:0;background:none;padding:12px;font:inherit;color:var(--muted);cursor:pointer}
.toast{position:fixed;left:16px;right:16px;bottom:18px;background:var(--ink);color:#fff;padding:10px 14px;border-radius:12px;font-size:13.5px;text-align:center;z-index:20}
@media (prefers-reduced-motion:reduce){.bar i{transition:none}}
`;
