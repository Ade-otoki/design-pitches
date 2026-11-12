"use client";

import ScaledFrame from "./ScaledFrame";

// iPhone 17 mockup: 402 x 874 pt screen, Dynamic Island, status bar, side buttons, home indicator.
// The prototype renders at real iPhone 17 size and scales to the width this mockup is given.
// Everything is sized in container units, so the device stays in proportion at any width.
// Pass `src` for a live prototype (iframe) or `image` for a static screen (e.g. a concept sketch, 402x874).
export default function IPhone17({ src, image, title, statusBar = "dark" }: { src?: string; image?: string; title: string; statusBar?: "dark" | "light" }) {
  return (
    <div className="ip17" role="figure" aria-label={`${title}, shown on an iPhone 17`}>
      <style>{CSS}</style>
      <span className="ip17-btn ip17-action" aria-hidden />
      <span className="ip17-btn ip17-volup" aria-hidden />
      <span className="ip17-btn ip17-voldown" aria-hidden />
      <span className="ip17-btn ip17-power" aria-hidden />
      <span className="ip17-btn ip17-camera" aria-hidden />
      <div className="ip17-bezel">
        <div className="ip17-screen">
          {image ? (
            <img className="ip17-img" src={image} alt={title} />
          ) : (
            <ScaledFrame src={src ?? ""} title={title} kind="phone" />
          )}
          <div className={`ip17-status ${statusBar === "light" ? "is-light" : ""}`} aria-hidden>
            <span className="ip17-time">9:41</span>
            <span className="ip17-icons">
              <svg viewBox="0 0 18 12" className="ip17-signal"><rect x="0" y="8" width="3" height="4" rx="1" /><rect x="5" y="5.5" width="3" height="6.5" rx="1" /><rect x="10" y="3" width="3" height="9" rx="1" /><rect x="15" y="0" width="3" height="12" rx="1" /></svg>
              <svg viewBox="0 0 16 12" className="ip17-wifi"><path d="M8 11.5l2.4-2.9a3.6 3.6 0 00-4.8 0z" /><path d="M8 6.2c1.6 0 3 .6 4.1 1.5l1.5-1.8A8.5 8.5 0 008 3.6a8.5 8.5 0 00-5.6 2.3l1.5 1.8A6.2 6.2 0 018 6.2z" /><path d="M8 1.2c2.9 0 5.5 1.1 7.5 2.9L16 3.5A11.6 11.6 0 008-.9 11.6 11.6 0 000 3.5l.5.6A11.3 11.3 0 018 1.2z" /></svg>
              <svg viewBox="0 0 27 13" className="ip17-battery"><rect x="0.5" y="0.5" width="22" height="12" rx="3.5" fill="none" stroke="currentColor" opacity=".4" /><rect x="2.5" y="2.5" width="18" height="8" rx="2" /><path d="M24.5 4.5v4c.9-.3 1.5-1.1 1.5-2s-.6-1.7-1.5-2z" opacity=".45" /></svg>
            </span>
          </div>
          <span className="ip17-island" aria-hidden />
          <span className="ip17-home" aria-hidden />
        </div>
      </div>
    </div>
  );
}

const CSS = `
.ip17{position:relative;width:100%;aspect-ratio:430/902;container-type:inline-size}
.ip17-bezel{position:absolute;inset:0;border-radius:15.4cqw;padding:3.25cqw;
  background:linear-gradient(145deg,#4a4b50 0%,#1d1e21 18%,#2c2d31 50%,#151618 82%,#3c3d41 100%);
  box-shadow:0 0 0 .35cqw #0d0d0f inset,0 0 0 .7cqw #5c5d62 inset,0 9cqw 16cqw -6cqw rgba(15,15,30,.55),0 2cqw 5cqw -2cqw rgba(15,15,30,.35)}
.ip17-screen{position:relative;width:100%;height:100%;border-radius:12.4cqw;overflow:hidden;background:#000;
  box-shadow:0 0 0 1.1cqw #050506;container-type:inline-size}
.ip17-screen .sf{border-radius:0}
.ip17-img{display:block;width:100%;height:100%;object-fit:cover;background:#fff}
.ip17-status{position:absolute;left:0;right:0;top:0;height:13.4cqw;display:flex;justify-content:space-between;align-items:center;
  padding:1.2cqw 7.5cqw 0 9.5cqw;color:#000;pointer-events:none;font:600 4.2cqw/1 -apple-system,BlinkMacSystemFont,"SF Pro Text",Inter,system-ui,sans-serif;letter-spacing:-.02em}
.ip17-status.is-light{color:#fff}
.ip17-icons{display:flex;gap:1.6cqw;align-items:center}
.ip17-icons svg{fill:currentColor;height:3cqw;width:auto}
.ip17-battery{height:3.2cqw!important}
.ip17-island{position:absolute;top:2.75cqw;left:50%;width:31cqw;height:9.2cqw;transform:translateX(-50%);border-radius:999px;background:#000;pointer-events:none}
.ip17-home{position:absolute;bottom:2cqw;left:50%;width:35cqw;height:1.25cqw;transform:translateX(-50%);border-radius:999px;background:#111;opacity:.85;pointer-events:none}
.ip17-btn{position:absolute;width:.9cqw;border-radius:.6cqw;background:linear-gradient(90deg,#2a2b2f,#5a5b60,#2a2b2f)}
.ip17-action{left:-.6cqw;top:19%;height:6%}
.ip17-volup{left:-.6cqw;top:28%;height:9.5%}
.ip17-voldown{left:-.6cqw;top:39.5%;height:9.5%}
.ip17-power{right:-.6cqw;top:30%;height:15%}
.ip17-camera{right:-.6cqw;top:55%;height:8%}
`;
