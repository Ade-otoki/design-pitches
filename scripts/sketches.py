"""Generate lo-fi concept sketches (SVG) for each Product Log's conceptual ranges.
Run: python3 scripts/sketches.py  -> writes public/sketches/<slug>-<n>.svg
Style: greyscale wireframe, one accent colour for the idea being explored, handwritten notes."""
from pathlib import Path

OUT = Path(__file__).resolve().parent.parent / "public" / "sketches"
OUT.mkdir(parents=True, exist_ok=True)

INK, MID, LIGHT, PAPER = "#26262b", "#9a9aa3", "#e9e9ee", "#ffffff"
HAND = "'Bradley Hand','Segoe Print','Comic Sans MS','Chalkboard SE',cursive"
SANS = "-apple-system,'Segoe UI',Inter,Arial,sans-serif"


def svg(w, h, body, title):
    return (f'<svg xmlns="http://www.w3.org/2000/svg" width="{w}" height="{h}" viewBox="0 0 {w} {h}" role="img" aria-label="{title}">'
            f'<title>{title}</title><rect width="{w}" height="{h}" rx="18" fill="{PAPER}"/>{body}</svg>')


def bar(x, y, w, h=8, fill=LIGHT, r=4):
    return f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="{r}" fill="{fill}"/>'


def box(x, y, w, h, stroke=INK, fill="none", r=10, sw=2, dash=None):
    d = f' stroke-dasharray="{dash}"' if dash else ""
    return f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="{r}" fill="{fill}" stroke="{stroke}" stroke-width="{sw}"{d}/>'


def text(x, y, s, size=12, fill=INK, weight=500, anchor="start", font=SANS):
    s = s.replace("&", "&amp;").replace("<", "&lt;")
    return f'<text x="{x}" y="{y}" font-family="{font}" font-size="{size}" font-weight="{weight}" fill="{fill}" text-anchor="{anchor}">{s}</text>'


def note(x, y, s, fill="#c2410c", size=15, anchor="start"):
    return text(x, y, s, size=size, fill=fill, weight=600, anchor=anchor, font=HAND)


def arrow(x1, y1, x2, y2, color="#c2410c"):
    import math
    a = math.atan2(y2 - y1, x2 - x1)
    hx1, hy1 = x2 - 9 * math.cos(a - 0.45), y2 - 9 * math.sin(a - 0.45)
    hx2, hy2 = x2 - 9 * math.cos(a + 0.45), y2 - 9 * math.sin(a + 0.45)
    mx, my = (x1 + x2) / 2 + (y2 - y1) * 0.15, (y1 + y2) / 2 - (x2 - x1) * 0.15
    return (f'<path d="M{x1},{y1} Q{mx},{my} {x2},{y2}" fill="none" stroke="{color}" stroke-width="2" stroke-linecap="round"/>'
            f'<path d="M{hx1:.1f},{hy1:.1f} L{x2},{y2} L{hx2:.1f},{hy2:.1f}" fill="none" stroke="{color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>')


def phone(x, y, w=170, h=340):
    """Lo-fi phone outline with notch and home bar."""
    return (box(x, y, w, h, r=26, sw=2.5) + f'<rect x="{x + w/2 - 24}" y="{y + 9}" width="48" height="12" rx="6" fill="{INK}"/>'
            + bar(x + w/2 - 30, y + h - 12, 60, 4, INK, 2))


# ---------------- WAVE (phone) ----------------
RED, AMBER, AMBER_BG, RED_BG, INDIGO = "#d93a40", "#8a5300", "#fff1d6", "#fde9ea", "#4a3fdb"


def wave_1():
    x, y = 145, 40
    b = phone(x, y)
    b += f'<circle cx="{x+85}" cy="{y+70}" r="16" fill="{LIGHT}"/>' + text(x + 85, y + 75, "✓", 14, MID, 700, "middle")
    b += bar(x + 50, y + 98, 70) + text(x + 85, y + 130, "−25.000F", 20, INK, 800, "middle")
    for i in range(3):
        b += bar(x + 18, y + 152 + i * 20, 50) + bar(x + 112, y + 152 + i * 20, 40)
    b += bar(x + 18, y + 222, 134, 4, "#5bc5f7", 2)
    b += box(x + 14, y + 236, 142, 34, RED, RED_BG, 17, 2) + text(x + 24, y + 258, "Annuler l'envoi", 11, RED, 700) + text(x + 147, y + 258, "27:48", 11, RED, 600, "end")
    b += bar(x + 18, y + 282, 120, 6) + bar(x + 18, y + 294, 90, 6)
    b += note(12, 330, "on the receipt,", size=14) + note(12, 349, "time left in view", size=14)
    b += arrow(70, 316, x + 10, y + 256)
    b += note(326, 118, "no Settings or", size=14) + note(326, 137, "chatbot detour", size=14)
    b += note(230, 418, "recipient: nothing changes", "#6b6b75", 13, "middle")
    return svg(460, 440, b, "Range 1 sketch: cancel button with countdown on the sender's receipt")


def wave_2():
    x, y = 145, 40
    b = phone(x, y)
    b += f'<rect x="{x+2}" y="{y+2}" width="166" height="70" rx="24" fill="{INDIGO}" opacity=".9"/>' + bar(x + 55, y + 38, 60, 12, "#ffffff", 6)
    for i, c in enumerate(["#dfe4ff", "#fdf0d8", "#dff3fd", "#fde4e4"]):
        b += f'<circle cx="{x + 30 + i*37}" cy="{y + 98}" r="13" fill="{c}"/>'
    b += bar(x + 16, y + 128, 80) + text(x + 154, y + 136, "+25.000F", 11, INDIGO, 700, "end")
    b += box(x + 16, y + 142, 92, 18, AMBER, AMBER_BG, 9, 1.5) + text(x + 24, y + 155, "Définitif à 14h52", 9, AMBER, 700)
    b += box(x + 12, y + 172, 146, 66, "none", AMBER_BG, 12, 0) + bar(x + 22, y + 184, 80, 8, "#e9cc8f") + bar(x + 22, y + 200, 120, 6, "#efd9a6") + bar(x + 22, y + 212, 110, 6, "#efd9a6") + bar(x + 22, y + 224, 70, 6, "#efd9a6")
    for i in range(2):
        b += bar(x + 16, y + 256 + i * 30, 60) + bar(x + 110, y + 256 + i * 30, 44)
    b += note(326, 172, "“not final yet”", size=14) + note(326, 191, "+ when it will be", size=14)
    b += arrow(324, 180, x + 112, y + 152)
    b += note(12, 250, "explains what", size=14) + note(12, 269, "to do meanwhile", size=14)
    b += arrow(80, 278, x + 10, y + 205)
    b += note(230, 418, "sender still cancels via chatbot", "#6b6b75", 13, "middle")
    return svg(460, 440, b, "Range 2 sketch: recipient home screen marks incoming money as not final until 14h52")


def wave_3():
    b = ""
    for (x, side) in [(62, "s"), (248, "r")]:
        y = 46
        b += phone(x, y, 150, 300)
        if side == "s":
            b += text(x + 75, y + 70, "SENDER", 10, MID, 700, "middle") + text(x + 75, y + 100, "−25.000F", 16, INK, 800, "middle")
            for i in range(2):
                b += bar(x + 16, y + 120 + i * 18, 44) + bar(x + 96, y + 120 + i * 18, 38)
            b += box(x + 12, y + 172, 126, 30, RED, RED_BG, 15, 2) + text(x + 22, y + 191, "Annuler · 27:48", 10, RED, 700)
            b += box(x + 12, y + 214, 126, 52, MID, "#fff", 10, 1.5, "4 4") + text(x + 20, y + 232, "Raison ?", 10, INK, 700) + bar(x + 20, y + 242, 80, 6) + bar(x + 20, y + 254, 60, 6)
        else:
            b += f'<rect x="{x+2}" y="{y+2}" width="146" height="56" rx="22" fill="{INDIGO}" opacity=".9"/>' + bar(x + 45, y + 32, 60, 10, "#fff", 5)
            b += text(x + 75, y + 82, "RECIPIENT", 10, MID, 700, "middle")
            b += box(x + 12, y + 96, 126, 18, AMBER, AMBER_BG, 9, 1.5) + text(x + 20, y + 109, "Définitif à 14h52", 9, AMBER, 700)
            b += box(x + 12, y + 126, 126, 74, "none", RED_BG, 12, 0) + text(x + 20, y + 146, "Moussa a annulé", 10, RED, 700) + text(x + 20, y + 162, "Raison : mauvais n°", 9, INK, 500) + text(x + 20, y + 186, "Signaler", 10, RED, 700)
            for i in range(2):
                b += bar(x + 16, y + 218 + i * 22, 50) + bar(x + 98, y + 218 + i * 22, 36)
    b += arrow(200, 236, 256, 196)
    b += note(230, 28, "one rule, visible to both people", anchor="middle")
    b += note(230, 380, "the reason travels with the cancel", "#6b6b75", 13, "middle")
    return svg(460, 400, b, "Range 3 sketch: sender cancels with a reason; recipient sees final time and a cancellation notice")


# ---------------- RAILWAY (desktop) ----------------
DARK, PANEL, LINE, AMB, RD, BL = "#121318", "#1c1e25", "#2b2e38", "#f5b748", "#f06a6a", "#6ea8fe"


def browser(w, h, body, title):
    b = f'<rect x="20" y="20" width="{w-40}" height="{h-40}" rx="12" fill="{DARK}"/>'
    b += f'<rect x="20" y="20" width="{w-40}" height="26" rx="12" fill="#22242c"/><rect x="20" y="34" width="{w-40}" height="12" fill="#22242c"/>'
    b += "".join(f'<circle cx="{36+i*14}" cy="33" r="4" fill="#3a3d48"/>' for i in range(3))
    return svg(w, h, b + body, title)


def stages(x, y, bad_label="Healthcheck"):
    out = ""
    for i, s in enumerate(["Build", "Deploy", bad_label]):
        c = RD if i == 2 else "#4cc38a"
        out += f'<rect x="{x + i*96}" y="{y}" width="{90}" height="22" rx="6" fill="{PANEL}" stroke="{c if i==2 else LINE}"/>'
        out += text(x + i * 96 + 10, y + 15, ("✕ " if i == 2 else "✓ ") + s, 10, c if i == 2 else "#b9bcc6", 600)
    return out


def railway_1():
    w, h = 520, 340
    b = text(40, 70, "Deployment failed", 14, "#e8e9ed", 700) + stages(40, 82)
    b += f'<rect x="40" y="116" width="440" height="58" rx="10" fill="#2a2416" stroke="{AMB}"/>'
    b += text(52, 136, "Cause: your app's response", 10, AMB, 700) + text(52, 156, "Every attempt got 308 → /markets", 12, "#e8e9ed", 600)
    for i in range(5):
        y = 186 + i * 24
        b += text(48, y + 12, f"+{i*33+4}s", 10, "#6b7080", 500) + f'<rect x="96" y="{y+1}" width="34" height="15" rx="4" fill="#3a2f17"/>' + text(103, y + 12, "3xx", 9, AMB, 700) + bar(142, y + 5, 200, 6, "#2f3240")
    b += note(360, 248, "every probe +", "#ffb36b") + note(360, 268, "what came back", "#ffb36b")
    b += arrow(356, 258, 300, 222, "#ffb36b")
    b += note(486, 108, "verdict first", "#ffb36b", 14, "end")
    return browser(w, h, b, "Range 1 sketch: failed deploy with verdict and a timeline of every healthcheck probe")


def railway_2():
    w, h = 520, 340
    b = text(40, 72, "$ railway preflight", 13, "#e8e9ed", 700, font="ui-monospace,Menlo,monospace")
    lines = [("✓ start command runs", "#4cc38a"), ("✓ listening on $PORT 8080", "#4cc38a"), ("⚠ GET / → 308 redirect", AMB),
             ("✕ healthcheck would fail (needs 2xx)", RD), ("→ set healthcheck path to /api/health", "#b9bcc6")]
    for i, (s, c) in enumerate(lines):
        b += text(40, 104 + i * 26, s, 12, c, 600, font="ui-monospace,Menlo,monospace")
    b += note(300, 270, "catch it before pushing", "#ffb36b")
    b += note(300, 292, "…but not env / DB / platform", "#9aa0ad", 13)
    return browser(w, h, b, "Range 2 sketch: CLI preflight check that probes the healthcheck path locally before deploying")


def railway_3():
    w, h = 520, 340
    b = text(40, 70, "Deployment failed", 14, "#e8e9ed", 700) + stages(40, 82)
    b += f'<rect x="40" y="116" width="440" height="40" rx="10" fill="#17233a" stroke="{BL}"/>'
    b += text(54, 140, "Incident · elevated healthcheck failures in this region", 11, "#b9d3ff", 600)
    for i in range(4):
        b += bar(40, 176 + i * 22, 300 - i * 30, 8, "#2b2e38")
    b += note(330, 214, "links your failure to", "#ffb36b") + note(330, 234, "a live incident", "#ffb36b")
    b += arrow(380, 200, 400, 162, "#ffb36b")
    b += note(40, 296, "silent when the cause is your app", "#9aa0ad", 13)
    return browser(w, h, b, "Range 3 sketch: failed deploy view with an incident banner when a platform incident overlaps")


SKETCHES = {"wave-1": wave_1, "wave-2": wave_2, "wave-3": wave_3,
            "railway-1": railway_1, "railway-2": railway_2, "railway-3": railway_3}

if __name__ == "__main__":
    for name, fn in SKETCHES.items():
        (OUT / f"{name}.svg").write_text(fn(), encoding="utf-8")
        print("wrote", name)
