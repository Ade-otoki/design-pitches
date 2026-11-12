"use client";

import { useEffect, useRef, useState } from "react";

// Renders a prototype at its real size (desktop 1280x800, phone 402x874 (iPhone 17)) and scales it down to fit
// the frame, so web solutions show their full desktop layout instead of collapsing to a mobile one.
const SIZES = { desktop: { w: 1280, h: 800 }, phone: { w: 402, h: 874 } } as const;

export default function ScaledFrame({ src, title, kind }: { src: string; title: string; kind: "desktop" | "phone" }) {
  const box = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0);
  const { w, h } = SIZES[kind];

  useEffect(() => {
    const el = box.current;
    if (!el) return;
    const fit = () => setScale(el.clientWidth / w);
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(el);
    return () => ro.disconnect();
  }, [w]);

  return (
    <div ref={box} className="sf" style={{ aspectRatio: `${w} / ${h}` }}>
      {scale > 0 && (
        <iframe
          src={src}
          title={title}
          loading="lazy"
          style={{ width: w, height: h, transform: `scale(${scale})`, transformOrigin: "0 0" }}
        />
      )}
    </div>
  );
}
