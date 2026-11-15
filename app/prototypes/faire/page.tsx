"use client";

// Concept prototype: "Terms Check" for Faire's net 60 payment terms, on the retailer cart.
// Independent concept by Daniel Ade-Otoki. Not Faire's official UI, not affiliated with Faire.
// Layout follows Faire's cart as seen on Mobbin: black promo bar, search pill and category row, serif "Cart" heading,
// brand rows with a minimum-order bar, summary card and sticky checkout footer. No Faire wordmark. Fictional store, brands and amounts.
// Rules shown come from Faire's help centre: if an order exceeds available terms it converts to payment on shipment;
// an overdue invoice makes net 60 unavailable and can restrict checkout.

import { useEffect, useState } from "react";

type Scenario = "cart" | "fixed" | "invoices";

const LIMIT = 2000;
const USED = 760;
const BRANDS = [
  { id: "a", name: "Annie B's Popcorn", items: "Caramel popcorn · 48 bags", total: 312, min: 100 },
  { id: "b", name: "Lady May Tallow", items: "Balm, 3 scents · 60 tins", total: 540, min: 150 },
  { id: "c", name: "Juniper & Ash Candles", items: "Holiday candles · 36 units", total: 708, min: 200 },
];

export default function FaireTermsCheck() {
  const [scenario, setScenario] = useState<Scenario>("cart");
  const [embed, setEmbed] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  function apply(s: Scenario) { setScenario(s); setToast(s === "fixed" ? "Juniper & Ash moved to ship 2 Dec, after your next payment" : null); }

  // URL options: ?scenario=cart|fixed|invoices  ?embed=1 hides demo controls  ?sync=1 listens to /live/faire
  useEffect(() => {
    const q = new URLSearchParams(window.location.search);
    const s = q.get("scenario") as Scenario | null;
    if (s && ["cart", "fixed", "invoices"].includes(s)) apply(s);
    setEmbed(q.get("embed") === "1");
    if (q.get("sync") !== "1" || typeof BroadcastChannel === "undefined") return;
    const c = new BroadcastChannel("faire-terms-check");
    c.onmessage = (e) => { if (e.data?.type === "scenario") apply(e.data.scenario); };
    return () => c.close();
  }, []);
  useEffect(() => { if (!toast) return; const t = setTimeout(() => setToast(null), 4200); return () => clearTimeout(t); }, [toast]);

  const available = LIMIT - USED;
  const now = scenario === "cart" ? BRANDS : BRANDS.filter((b) => b.id !== "c");
  const total = now.reduce((a, b) => a + b.total, 0);
  const over = Math.max(0, total - available);
  const f = (n: number) => `$${n.toLocaleString("en-US")}`;

  return (
    <div className={`ft ${embed ? "is-embed" : ""}`}>
      <style>{CSS}</style>
      <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Libre+Caslon+Text&display=swap" />
      {!embed && (
        <div className="demo" role="group" aria-label="Concept demo">
          <span className="demo-l">Concept demo</span>
          {(["cart", "fixed", "invoices"] as Scenario[]).map((s, i) => (
            <button key={s} className={scenario === s ? "on" : ""} aria-pressed={scenario === s} onClick={() => apply(s)}>
              {i + 1}. {{ cart: "Terms checked in the cart", fixed: "Fits net 60", invoices: "Upcoming payments" }[s]}
            </button>
          ))}
        </div>
      )}
      <div className="app">
        <div className="promo">Get up to $20K in payment terms when you apply for Open with Faire. <u>Learn more</u></div>
        <header className="hdr">
          <span className="mark" aria-hidden="true">Wholesale</span>
          <span className="cat">All categories ⌄</span>
          <div className="search">Search products or brands <span>⌕</span></div>
          <span className="ml">My market list</span>
          <span className="ic" aria-hidden="true">🔔︎</span><span className="ic" aria-hidden="true">◯</span><span className="ic cartc">🛒︎<i>{now.length}</i></span>
        </header>
        <nav className="cats">{["Bestsellers", "New", "Gifts", "Women", "Home decor", "Jewelry", "Beauty & wellness", "Sale"].map((c) => <span key={c} className={c === "Sale" ? "sale" : ""}>{c}</span>)}</nav>

        <main className="main">
          <div className="left">
            <h1>Cart</h1>
            <div className="tabs"><span className="on">Brands in cart {now.length}</span><span>Saved for later 1</span></div>
            {BRANDS.map((b) => {
              const moved = scenario !== "cart" && b.id === "c";
              return (
                <section key={b.id} className={`brand ${moved ? "moved" : ""}`}>
                  <span className="cb" aria-hidden="true">{moved ? "" : "✓"}</span>
                  <span className="logo" aria-hidden="true" />
                  <div className="bi"><b>{b.name}</b><span>{b.items}</span>{moved && <em>Scheduled to ship 2 Dec · fits your terms then</em>}</div>
                  <div className="bm"><span>Minimum {f(b.min)}</span><div className="mbar"><i /></div></div>
                  <b className="bt">{f(b.total)}</b>
                </section>
              );
            })}
          </div>

          <aside className="right">
            {scenario !== "invoices" ? (
              <div className={`terms ${over > 0 ? "warn" : "ok"}`} role="status">
                <div className="th"><b>Net 60 terms</b><span>{f(available)} available of {f(LIMIT)}</span></div>
                <div className="tbar" aria-hidden="true">
                  <i className="used" style={{ width: `${(USED / LIMIT) * 100}%` }} />
                  <i className="this" style={{ width: `${(Math.min(total, available) / LIMIT) * 100}%` }} />
                  {over > 0 && <i className="over" style={{ width: `${(over / LIMIT) * 100}%` }} />}
                </div>
                <ul className="legend"><li><i className="used" />Unpaid invoices {f(USED)}</li><li><i className="this" />This order {f(total)}</li></ul>
                {over > 0 ? (
                  <>
                    <p className="msg"><b>{f(over)} of this order won&apos;t fit your terms.</b> Today, it would switch to payment on shipment without asking.</p>
                    <div className="opts">
                      <button className="opt" onClick={() => apply("fixed")}><b>Ship Juniper &amp; Ash on 2 Dec</b><span>After your $480 invoice is paid, everything fits net 60</span></button>
                      <button className="opt"><b>Pay {f(over)} on shipment</b><span>Charged to Visa ••4242 when it ships</span></button>
                    </div>
                  </>
                ) : (
                  <p className="msg okm"><b>All of this order is on net 60.</b> First payment due 12 Jan 2027.</p>
                )}
                <button className="lnk" onClick={() => apply("invoices")}>See upcoming payments →</button>
              </div>
            ) : (
              <div className="terms inv">
                <div className="th"><b>Upcoming payments</b><span>Charged automatically on the due date</span></div>
                <ul className="pay">
                  <li className="soon"><div><b>$480</b><span>Due Mon 1 Dec · Linen &amp; Co.</span></div><button className="mini">Pay early</button></li>
                  <li><div><b>$280</b><span>Due 19 Dec · Pebble Paper</span></div></li>
                  <li><div><b>{f(total)}</b><span>Due 12 Jan 2027 · this order</span></div></li>
                </ul>
                <p className="msg"><b>Check Visa ••4242 has funds by 1 Dec.</b> If a payment fails, net 60 is paused and checkout may be restricted until it&apos;s paid.</p>
                <div className="row"><button className="btn ghost" onClick={() => apply("fixed")}>← Back to cart</button><button className="btn ghost">Change payment method</button></div>
              </div>
            )}
            <div className="summary">
              <div><span>Item total</span><span>{f(total)}</span></div>
              <div><span>Shipping</span><span>Free</span></div>
              <div className="tot"><span>Order total</span><span>{f(total)}</span></div>
              <div className="due"><span>Due today</span><span>$0</span></div>
            </div>
          </aside>
        </main>

        <footer className="foot">
          <div><b>{now.length} brands are ready for checkout</b><span>{over > 0 && scenario !== "invoices" ? `${f(over)} would be charged on shipment` : "All on net 60 terms"}</span></div>
          <div className="ot"><span>Order total</span><b>{f(total)}</b></div>
          <button className="btn">Checkout {now.length} brands</button>
        </footer>
        {toast && <div className="toast" role="status">✓ {toast}</div>}
      </div>
      {!embed && <p className="credit">Concept by Daniel Ade-Otoki · not Faire&apos;s official UI · fictional store, brands and amounts</p>}
    </div>
  );
}

const CSS = `
html,body{margin:0;background:#fff}
.ft{--ink:#333;--blk:#1f1f1f;--mut:#757575;--line:#dfe0e1;--green:#2f6b3f;--warn:#b25b12;--warnbg:#fdf3e8;--okbg:#eef6f0;--ease:cubic-bezier(.23,1,.32,1);
 font-family:Inter,Helvetica,sans-serif;color:var(--ink);-webkit-font-smoothing:antialiased}
.ft *{box-sizing:border-box}
.demo{display:flex;gap:6px;align-items:center;flex-wrap:wrap;padding:8px 16px;border-bottom:1px dashed #ccc;font-size:13px}
.demo-l{font-size:11px;letter-spacing:.08em;text-transform:uppercase;color:var(--mut);margin-right:6px}
.demo button{all:unset;cursor:pointer;padding:5px 11px;border:1px solid var(--line)}
.demo button.on{background:var(--blk);color:#fff;border-color:var(--blk)}
.demo button:focus-visible,.btn:focus-visible,.opt:focus-visible,.lnk:focus-visible{outline:2px solid var(--blk);outline-offset:2px}
.app{position:relative;height:800px;overflow:hidden;display:flex;flex-direction:column;background:#fff}
.ft:not(.is-embed) .app{height:calc(100svh - 64px);min-height:640px}
.promo{background:#2b2b2b;color:#fff;font-size:12.5px;text-align:center;padding:7px}
.hdr{display:flex;align-items:center;gap:18px;padding:12px 40px;font-size:13px}
.mark{font-family:"Libre Caslon Text",serif;letter-spacing:.32em;text-transform:uppercase;font-size:14px;color:var(--blk)}
.search{flex:1;max-width:560px;display:flex;justify-content:space-between;border:1px solid #bbb;border-radius:999px;padding:7px 14px;color:var(--mut)}
.ml{font-weight:500}.ic{font-size:15px}.cartc{position:relative}
.cartc i{position:absolute;top:-6px;right:-9px;font-style:normal;font-size:10px;background:var(--blk);color:#fff;border-radius:50%;width:15px;height:15px;display:grid;place-items:center}
.cats{display:flex;justify-content:center;gap:18px;font-size:13px;padding:4px 0 12px;border-bottom:1px solid var(--line)}
.cats .sale{color:#b8572e}
.main{flex:1;min-height:0;overflow:auto;display:grid;grid-template-columns:minmax(0,1fr) 360px;gap:40px;padding:20px 100px 90px}
h1{font-family:"Libre Caslon Text",serif;font-weight:400;font-size:28px;margin:0 0 16px;color:var(--blk)}
.tabs{display:flex;gap:28px;font-size:13.5px;border-bottom:1px solid var(--line);margin-bottom:6px}
.tabs span{padding:8px 0}.tabs .on{border-bottom:2px solid var(--blk);font-weight:500}
.brand{display:grid;grid-template-columns:20px 44px minmax(0,1fr) 150px 70px;gap:12px;align-items:center;padding:14px 0;border-bottom:1px solid var(--line);transition:opacity 200ms ease}
.brand.moved{opacity:.55}
.cb{width:16px;height:16px;border:1px solid #999;display:grid;place-items:center;font-size:11px}
.logo{width:40px;height:40px;border-radius:50%;background:linear-gradient(135deg,#e9e2d6,#cbbfae)}
.bi{display:flex;flex-direction:column;font-size:12.5px;color:var(--mut)}
.bi b{font-size:15px;color:var(--blk);font-weight:500}
.bi em{font-style:normal;color:var(--green);font-weight:500;margin-top:2px}
.bm{font-size:11.5px;color:var(--mut)}
.mbar{height:4px;background:var(--green);margin-top:4px;border-radius:2px}
.bt{font-size:14px;font-weight:500;text-align:right;color:var(--blk)}
.right{display:flex;flex-direction:column;gap:14px}
.terms{border:1px solid var(--line);padding:16px;animation:in 240ms var(--ease)}
.terms.warn{border-color:#e7b88a;background:var(--warnbg)}
.terms.ok{background:var(--okbg);border-color:#b9d8c1}
.th{display:flex;justify-content:space-between;align-items:baseline;gap:8px;white-space:nowrap;font-size:12.5px;color:var(--mut)}
.th b{font-size:15px;color:var(--blk);font-weight:600}
.tbar{display:flex;height:8px;background:#fff;border:1px solid var(--line);margin:12px 0 8px;overflow:hidden}
.tbar i{display:block;height:100%;transition:width 400ms var(--ease)}
i.used{background:#9a9a9a}i.this{background:var(--green)}i.over{background:var(--warn)}
.legend{list-style:none;margin:0;padding:0;display:flex;gap:14px;font-size:11.5px;color:var(--mut)}
.legend i{display:inline-block;width:8px;height:8px;margin-right:5px}
.msg{font-size:13px;line-height:1.45;margin:12px 0 10px}
.msg b{color:var(--blk)}
.opts{display:flex;flex-direction:column;gap:8px}
.opt{all:unset;cursor:pointer;display:flex;flex-direction:column;gap:2px;background:#fff;border:1px solid #bbb;padding:10px 12px;font-size:12.5px;color:var(--mut);transition:border-color 160ms ease,transform 160ms var(--ease)}
.opt b{font-size:13.5px;color:var(--blk);font-weight:600}
.opt:hover{border-color:var(--blk)}.opt:active{transform:scale(.99)}
.lnk{all:unset;cursor:pointer;margin-top:10px;font-size:12.5px;text-decoration:underline}
.pay{list-style:none;margin:12px 0 0;padding:0}
.pay li{display:flex;justify-content:space-between;align-items:center;padding:10px 0;border-top:1px solid var(--line)}
.pay li div{display:flex;flex-direction:column;font-size:12.5px;color:var(--mut)}
.pay li b{font-size:15px;color:var(--blk)}
.pay li.soon b{color:var(--warn)}
.mini{all:unset;cursor:pointer;font-size:12px;border:1px solid var(--blk);padding:4px 10px}
.row{display:flex;gap:8px;flex-wrap:wrap}
.summary{border:1px solid var(--line);padding:14px 16px;font-size:13px;display:flex;flex-direction:column;gap:8px}
.summary div{display:flex;justify-content:space-between}
.summary .tot{border-top:1px solid var(--line);padding-top:8px;font-weight:600;color:var(--blk)}
.summary .due{color:var(--green);font-weight:600}
.foot{position:absolute;left:0;right:0;bottom:0;display:flex;align-items:center;gap:24px;padding:12px 100px;background:#fff;border-top:1px solid var(--line)}
.foot>div:first-child{flex:1;display:flex;flex-direction:column;font-size:12px;color:var(--mut)}
.foot>div:first-child b{font-size:13.5px;color:var(--blk);font-weight:600}
.ot{display:flex;flex-direction:column;align-items:flex-end;font-size:12px;color:var(--mut)}
.ot b{font-size:17px;color:var(--blk)}
.btn{all:unset;cursor:pointer;background:var(--blk);color:#fff;font-size:13.5px;padding:11px 28px;transition:transform 160ms var(--ease)}
.btn:active{transform:scale(.98)}
.btn.ghost{background:#fff;color:var(--blk);border:1px solid var(--blk);padding:8px 12px;font-size:12.5px}
.toast{position:absolute;left:50%;bottom:78px;transform:translateX(-50%);background:var(--blk);color:#fff;font-size:13px;padding:10px 16px;animation:up 260ms var(--ease)}
.credit{margin:10px 16px;font-size:11px;color:var(--mut)}
@keyframes in{from{opacity:0;transform:translateY(-4px)}}
@keyframes up{from{opacity:0;transform:translate(-50%,10px)}}
@media (prefers-reduced-motion:reduce){.terms,.toast{animation:none}.tbar i,.opt,.brand{transition:none}}
`;
