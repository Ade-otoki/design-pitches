"use client";

import { useState } from "react";

// Sample prototype used only to check the Product Log layout.
// Each real company gets its own folder under app/prototypes/<slug>/.

const COLUMNS = [
  { file: "Full name", field: "Name", confidence: 0.98 },
  { file: "E-mail", field: "Email", confidence: 0.96 },
  { file: "Phone no.", field: "Phone", confidence: 0.91 },
  { file: "Cust_type", field: "Segment", confidence: 0.62 },
];

export default function SamplePrototype() {
  const [confirmed, setConfirmed] = useState<Record<string, boolean>>({});
  const done = COLUMNS.every((c) => c.confidence > 0.9 || confirmed[c.file]);

  return (
    <div style={{ fontFamily: "system-ui, sans-serif", padding: "48px 20px 24px", minHeight: "100svh", background: "#fff", color: "#16140f" }}>
      <p style={{ fontSize: 12, letterSpacing: ".08em", textTransform: "uppercase", color: "#8a8476", margin: 0 }}>Step 2 of 3</p>
      <h1 style={{ fontSize: 24, margin: "6px 0 4px" }}>Match your columns</h1>
      <p style={{ color: "#4a463d", fontSize: 14, margin: "0 0 20px" }}>We matched what we could. Check the one we&apos;re unsure about.</p>
      {COLUMNS.map((c) => {
        const sure = c.confidence > 0.9;
        const ok = sure || confirmed[c.file];
        return (
          <div key={c.file} style={{ border: `1px solid ${ok ? "#e4e0d5" : "#e0b84a"}`, background: ok ? "#fff" : "#fffaea", borderRadius: 12, padding: 14, marginBottom: 10 }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 15 }}>
              <span>{c.file}</span>
              <span style={{ color: "#8a8476" }}>→ {c.field}</span>
            </div>
            {!ok && (
              <button
                onClick={() => setConfirmed((s) => ({ ...s, [c.file]: true }))}
                style={{ marginTop: 10, width: "100%", padding: "10px", borderRadius: 8, border: 0, background: "#16140f", color: "#fff", fontSize: 14 }}
              >
                Yes, this is {c.field}
              </button>
            )}
          </div>
        );
      })}
      <button
        disabled={!done}
        style={{ marginTop: 16, width: "100%", padding: 14, borderRadius: 999, border: 0, fontSize: 15, fontWeight: 600, background: done ? "#16140f" : "#e4e0d5", color: done ? "#fff" : "#8a8476" }}
      >
        {done ? "Import 1,204 customers" : "Confirm 1 column to continue"}
      </button>
    </div>
  );
}
