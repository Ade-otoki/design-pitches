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


SKETCHES = {"railway-1": railway_1, "railway-2": railway_2, "railway-3": railway_3}

if __name__ == "__main__":
    for name, fn in SKETCHES.items():
        (OUT / f"{name}.svg").write_text(fn(), encoding="utf-8")
        print("wrote", name)


# ---------------- WAVE full screens for the iPhone 17 mockup (402 x 874) ----------------
SW, SH = 402, 874
RING = "#c2410c"


def screen(body, title):
    return (f'<svg xmlns="http://www.w3.org/2000/svg" width="{SW}" height="{SH}" viewBox="0 0 {SW} {SH}" role="img" aria-label="{title}">'
            f'<title>{title}</title><rect width="{SW}" height="{SH}" fill="#ffffff"/>{body}</svg>')


def ring(x, y, w, h, r=18):
    return f'<rect x="{x-7}" y="{y-7}" width="{w+14}" height="{h+14}" rx="{r+6}" fill="none" stroke="{RING}" stroke-width="2.5" stroke-dasharray="7 6"/>'


def nav(title):
    return text(28, 92, "‹", 34, INK, 400) + text(SW / 2, 92, title, 18, INK, 700, "middle")


def wave_receipt(cancel_btn=True, with_reason=False):
    b = nav("Détails du transfert")
    b += f'<circle cx="{SW/2}" cy="150" r="30" fill="#e8f7fe"/>' + text(SW / 2, 160, "✓", 26, "#0b77ab", 700, "middle")
    b += bar(SW / 2 - 50, 196, 100, 10) + text(SW / 2, 236, "Awa Diop", 18, INK, 700, "middle")
    b += text(SW / 2, 290, "−25.000F", 40, "#2b2392", 800, "middle") + bar(SW / 2 - 110, 308, 220, 8)
    for i in range(3):
        y = 352 + i * 50
        b += f'<line x1="28" y1="{y-18}" x2="{SW-28}" y2="{y-18}" stroke="{LIGHT}" stroke-width="2"/>' + bar(28, y, 90, 10) + bar(SW - 118, y, 90, 10)
    b += bar(28, 510, SW - 56, 6, "#f0f0f5", 3) + bar(28, 510, (SW - 56) * 0.92, 6, "#5bc5f7", 3)
    if cancel_btn:
        b += box(28, 534, SW - 56, 56, RED, RED_BG, 28, 2.5) + text(52, 568, "Annuler l'envoi", 17, RED, 700) + text(SW - 52, 568, "27:48", 16, RED, 600, "end")
        b += ring(28, 534, SW - 56, 56, 28)
    b += bar(32, 614, 300, 9) + bar(32, 632, 240, 9)
    if with_reason:
        b += f'<rect x="0" y="0" width="{SW}" height="{SH}" fill="rgba(20,18,60,.32)"/>'
        b += f'<rect x="0" y="520" width="{SW}" height="{SH-520}" rx="28" fill="#fff"/>' + bar(SW / 2 - 22, 536, 44, 5, "#dcdce8", 3)
        b += text(28, 584, "Annuler l'envoi de 25.000F ?", 19, INK, 800)
        for i, (lab, on) in enumerate([("Mauvais numéro", True), ("Mauvais montant", False), ("Autre raison", False)]):
            y = 610 + i * 58
            b += box(28, y, SW - 56, 46, INDIGO if on else LIGHT, "#fff", 14, 2) + f'<circle cx="54" cy="{y+23}" r="8" fill="{INDIGO if on else "#fff"}" stroke="{INDIGO if on else MID}" stroke-width="2"/>' + text(74, y + 29, lab, 15, INK, 500)
        b += ring(28, 610, SW - 56, 162, 16)
        b += f'<rect x="28" y="790" width="{SW-56}" height="50" rx="25" fill="{RED}"/>' + text(SW / 2, 821, "Annuler l'envoi", 16, "#fff", 700, "middle")
    return b


def wave_home(chip=True, note_card=True, cancelled=False):
    b = f'<rect width="{SW}" height="250" fill="{INDIGO}"/>' + text(SW / 2, 160, "41.500F" if cancelled else "66.500F", 36, "#fff", 800, "middle")
    b += f'<rect x="0" y="210" width="{SW}" height="{SH-210}" rx="28" fill="#fff"/>'
    for i, c in enumerate(["#dfe4ff", "#fdf0d8", "#dff3fd", "#fde4e4"]):
        cx = 62 + i * 93
        b += f'<circle cx="{cx}" cy="262" r="25" fill="{c}"/>' + bar(cx - 26, 298, 52, 8)
    b += f'<rect x="0" y="326" width="{SW}" height="10" fill="#f5f5fa"/>'
    y = 362
    if cancelled:
        b += f'<rect x="20" y="{y}" width="{SW-40}" height="104" rx="18" fill="{RED_BG}"/>'
        b += text(38, y + 32, "Moussa a annulé son envoi", 16, "#b3242a", 700) + text(38, y + 56, "Raison : mauvais numéro", 14, INK, 500)
        b += text(38, y + 86, "Signaler un problème", 14, "#b3242a", 700)
        b += ring(20, y, SW - 40, 104, 18)
        y += 128
    b += text(24, y + 16, "Reçu de Moussa Ndiaye", 16, "#2b2392", 700) + bar(24, y + 30, 150, 9)
    amt = "+25.000F"
    b += text(SW - 24, y + 16, amt, 16, MID if cancelled else "#2b2392", 700, "end")
    if cancelled:
        b += f'<line x1="{SW-100}" y1="{y+10}" x2="{SW-24}" y2="{y+10}" stroke="{MID}" stroke-width="2"/>'
    if chip and not cancelled:
        b += box(24, y + 50, 150, 28, AMBER, AMBER_BG, 14, 1.5) + text(38, y + 69, "Définitif à 14h52", 13, AMBER, 700)
        b += ring(24, y + 50, 150, 28, 14)
    y += 96
    if note_card and not cancelled:
        b += f'<rect x="20" y="{y}" width="{SW-40}" height="112" rx="18" fill="{AMBER_BG}"/>'
        b += text(38, y + 32, "Pas encore définitif", 16, AMBER, 700) + bar(38, y + 50, 300, 9, "#efd9a6") + bar(38, y + 68, 280, 9, "#efd9a6") + bar(38, y + 86, 200, 9, "#efd9a6")
        y += 136
    for i in range(3):
        b += f'<line x1="24" y1="{y-14}" x2="{SW-24}" y2="{y-14}" stroke="{LIGHT}" stroke-width="2"/>' + bar(24, y, 110, 10, "#d9d9f0") + bar(24, y + 18, 150, 8) + bar(SW - 104, y, 80, 10, "#d9d9f0")
        y += 62
    return b


SCREENS = {
    "wave-1-screen": lambda: screen(wave_receipt(), "Range 1: Cancel button with countdown on the sender's receipt"),
    "wave-2-screen": lambda: screen(wave_home(), "Range 2: Recipient home marks incoming money as final at 14h52"),
    "wave-3-sender": lambda: screen(wave_receipt(with_reason=True), "Range 3, sender: cancel sheet asking for a reason"),
    "wave-3-recipient": lambda: screen(wave_home(cancelled=True), "Range 3, recipient: cancellation notice with reason and report link"),
}


# ---------------- KOHO full screens for the iPhone 17 mockup (402 x 874) ----------------
KP, KLAV, KGREEN, KPV = "#2f1868", "#ece4ff", "#1fa651", "#6b2bd9"


def koho_home(preview=True, caught_up=False):
    b = f'<circle cx="38" cy="80" r="12" fill="none" stroke="{INK}" stroke-width="2"/>' + f'<rect x="{SW/2-32}" y="68" width="64" height="24" rx="12" fill="{KLAV}"/>' + text(SW / 2, 85, "Extra", 13, KP, 600, "middle")
    b += box(16, 106, SW - 32, 44, LIGHT, "#f5f4f8", 22, 1.5) + f'<rect x="20" y="110" width="88" height="36" rx="18" fill="{KP}"/>' + text(64, 133, "Spend", 14, "#fff", 600, "middle")
    for i, t in enumerate(["Credit", "Borrow", "Save"]):
        b += text(160 + i * 82, 133, t, 14, MID, 600, "middle")
    b += f'<rect x="16" y="162" width="{SW-32}" height="140" rx="16" fill="#cfd8de"/>' + text(SW / 2, 222, "Spendable", 14, "#fff", 600, "middle")
    b += text(SW / 2, 268, "$0.00" if not caught_up else "$1,090.00", 40, "#fff", 800, "middle")
    b += f'<rect x="16" y="312" width="{SW-32}" height="36" rx="12" fill="{"#e7f6ec" if caught_up else "#f3edff"}"/>' + text(32, 335, "Cover ready · $250 available" if caught_up else "Cover: $150 to repay · $100 available", 13, "#11602f" if caught_up else KP, 600)
    for i, t in enumerate(["Add", "Send", "Cards"]):
        b += box(16 + i * 96, 362, 84, 36, "#d3cfdd", "#fff", 18, 1.5) + text(58 + i * 96, 385, t, 14, KP, 600, "middle")
    y = 414
    if preview:
        b += box(16, y, SW - 32, 196, LIGHT, "#fff", 16, 1.5)
        b += text(32, y + 28, "NEXT DEPOSIT", 11, MID, 700) + text(SW - 32, y + 28, "Fri, Nov 20", 12, MID, 500, "end")
        b += text(32, y + 54, "Payroll · about $1,240", 16, INK, 700)
        b += f'<rect x="32" y="{y+70}" width="{(SW-64)*0.12}" height="12" rx="6" fill="{KPV}"/><rect x="{32+(SW-64)*0.12+3}" y="{y+70}" width="{(SW-64)*0.88-3}" height="12" rx="6" fill="{KGREEN}"/>'
        b += f'<rect x="32" y="{y+98}" width="10" height="10" rx="3" fill="{KPV}"/>' + text(50, y + 107, "Repays Cover", 13, INK, 500) + text(SW - 32, y + 107, "$150", 13, INK, 700, "end")
        b += f'<rect x="32" y="{y+120}" width="10" height="10" rx="3" fill="{KGREEN}"/>' + text(50, y + 129, "To Spendable", 13, INK, 500) + text(SW - 32, y + 129, "~$1,090", 13, INK, 700, "end")
        b += bar(32, y + 150, 280, 8) + bar(32, y + 166, 200, 8)
        b += ring(16, y, SW - 32, 196, 16)
        y += 220
    elif caught_up:
        b += f'<rect x="16" y="{y}" width="{SW-32}" height="76" rx="16" fill="#f3fbf5"/>' + text(36, y + 32, "You're all caught up", 15, INK, 700) + bar(36, y + 48, 260, 8, "#cfeeda")
        y += 100
    b += text(16, y + 14, "ACTIVITY", 11, MID, 700)
    for i in range(3):
        yy = y + 40 + i * 62
        b += f'<circle cx="34" cy="{yy}" r="18" fill="#f5f4f8"/>' + bar(62, yy - 10, 110, 10, "#d9d6e3") + bar(62, yy + 6, 150, 8) + bar(SW - 96, yy - 6, 80, 10, "#d9d6e3")
    return b


def koho_detail(small=False):
    b = nav("Deposit")
    b += text(SW / 2, 172, "+$40.00" if small else "+$1,240.00", 38, "#178a43", 800, "middle") + bar(SW / 2 - 100, 192, 200, 10) + bar(SW / 2 - 60, 212, 120, 8)
    y = 252
    b += box(16, y, SW - 32, 150, LIGHT, "#fff", 16, 1.5) + text(32, y + 28, "WHERE IT WENT", 11, MID, 700)
    if small:
        b += f'<rect x="32" y="{y+44}" width="{SW-64}" height="14" rx="7" fill="{KPV}"/>'
    else:
        b += f'<rect x="32" y="{y+44}" width="{(SW-64)*0.12}" height="14" rx="7" fill="{KPV}"/><rect x="{32+(SW-64)*0.12+3}" y="{y+44}" width="{(SW-64)*0.88-3}" height="14" rx="7" fill="{KGREEN}"/>'
    b += f'<rect x="32" y="{y+80}" width="10" height="10" rx="3" fill="{KPV}"/>' + text(50, y + 89, "Repaid Cover", 14, INK, 500) + text(SW - 32, y + 89, "$40.00" if small else "$150.00", 14, INK, 700, "end")
    b += f'<rect x="32" y="{y+110}" width="10" height="10" rx="3" fill="{KGREEN}"/>' + text(50, y + 119, "Added to Spendable", 14, INK, 500) + text(SW - 32, y + 119, "$0.00" if small else "$1,090.00", 14, INK, 700, "end")
    b += ring(16, y, SW - 32, 150, 16)
    y += 172
    b += f'<rect x="16" y="{y}" width="{SW-32}" height="104" rx="16" fill="#f3edff"/>' + text(32, y + 30, "Why all $40 went to Cover" if small else "Why part of it went to Cover", 15, KP, 700)
    b += bar(32, y + 48, 300, 8, "#ddd0fb") + bar(32, y + 64, 280, 8, "#ddd0fb") + bar(32, y + 80, 200, 8, "#ddd0fb")
    y += 128
    for i in range(3):
        b += f'<line x1="16" y1="{y+i*48}" x2="{SW-16}" y2="{y+i*48}" stroke="{LIGHT}" stroke-width="2"/>' + bar(16, y + 20 + i * 48, 120, 9) + bar(SW - 96, y + 20 + i * 48, 80, 9, "#d9d6e3")
    b += f'<rect x="16" y="{y+170}" width="{SW-32}" height="50" rx="25" fill="{KP}"/>' + text(SW / 2, y + 201, "Got it", 16, "#fff", 700, "middle")
    return b


SCREENS.update({
    "koho-1-screen": lambda: screen(koho_detail(), "Range 1: deposit detail shows how a paycheque was split between Cover and Spendable"),
    "koho-2-screen": lambda: screen(koho_home(), "Range 2: home shows a preview of the next deposit's split before payday"),
    "koho-3-before": lambda: screen(koho_home(), "Range 3, before payday: next-deposit preview on home"),
    "koho-3-after": lambda: screen(koho_detail(small=True), "Range 3, after money lands: breakdown with an explanation, even for a small top-up"),
})

if __name__ == "__main__":
    for name, fn in SCREENS.items():
        (OUT / f"{name}.svg").write_text(fn(), encoding="utf-8")
        print("wrote", name)
