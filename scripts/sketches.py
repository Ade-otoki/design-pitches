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


# ---------------- SPENDESK (desktop browser window, light) ----------------
SP_P, SP_OK, SP_BAD, SP_BADBG, SP_OKBG = "#5d42d6", "#3a984c", "#c8313b", "#fde9ea", "#e9f6ec"


def lbrowser(w, h, body, title):
    b = box(20, 20, w - 40, h - 40, r=12, sw=2)
    b += f'<line x1="20" y1="48" x2="{w-20}" y2="48" stroke="{INK}" stroke-width="2"/>'
    b += "".join(f'<circle cx="{38+i*14}" cy="34" r="4" fill="{MID}"/>' for i in range(3))
    return svg(w, h, b + body, title)


def sp_sidebar(h):
    out = f'<line x1="130" y1="48" x2="130" y2="{h-20}" stroke="{LIGHT}" stroke-width="2"/>'
    for i in range(6):
        out += bar(36, 70 + i * 22, 70 if i != 4 else 80, 8, "#d8d4ea" if i == 4 else LIGHT)
    return out


def sp_row(x, y, w, label, tag, ok):
    c, bg = (SP_OK, SP_OKBG) if ok == 1 else (SP_BAD, SP_BADBG) if ok == 0 else (MID, LIGHT)
    return (f'<line x1="{x}" y1="{y+30}" x2="{x+w}" y2="{y+30}" stroke="{LIGHT}" stroke-width="2"/>'
            + f'<rect x="{x}" y="{y+4}" width="18" height="18" rx="5" fill="{LIGHT}"/>' + text(x + 28, y + 17, label, 11, INK, 600)
            + f'<rect x="{x+w-78}" y="{y+5}" width="74" height="17" rx="8" fill="{bg}"/>' + text(x + w - 41, y + 17, tag, 9.5, c, 700, "middle"))


def spendesk_1():
    w, h = 520, 340
    b = text(40, 74, "From: collect@spendesk.com", 11, MID, 600) + text(40, 96, "Action needed: your periodic KYC review", 14, INK, 700)
    for i in range(2):
        b += bar(40, 112 + i * 14, 400 - i * 120, 7)
    b += box(40, 148, 300, 112, stroke=SP_P, r=10, sw=2)
    for i, s in enumerate(["☐ Kbis, under 3 months old", "☐ Shareholding: signed + dated", "☐ IDs in colour, front and back", "☐ Proof of address < 3 months"]):
        b += text(54, 172 + i * 24, s, 11, INK, 500)
    b += note(356, 176, "clear list +", SP_P) + note(356, 196, "examples", SP_P)
    b += note(40, 296, "still email-only · still rejected after 48h", "#9a9aa3", 13)
    return lbrowser(w, h, b, "Range 1 sketch: a clearer KYC email with a document checklist and the rules spelled out")


def spendesk_2():
    w, h = 520, 340
    b = sp_sidebar(h) + text(150, 76, "Upload: Shareholding structure", 13, INK, 700)
    b += box(150, 92, 330, 54, stroke=MID, r=10, sw=1.5, dash="5 5") + text(315, 124, "Drop file · checked instantly", 11, MID, 600, "middle")
    checks = [("✓ Dated 2 Oct 2026, under 3 months", SP_OK), ("✓ Shows 100% of shares", SP_OK), ("✕ No signature found: sign the last page", SP_BAD)]
    for i, (s, c) in enumerate(checks):
        b += f'<rect x="150" y="{160+i*30}" width="330" height="24" rx="6" fill="{SP_BADBG if c==SP_BAD else "#f6f6f8"}"/>' + text(160, 176 + i * 30, s, 11, c, 600)
    b += note(150, 278, "catches the usual rejections", SP_P)
    b += note(150, 300, "…but the owner still chases everyone", "#9a9aa3", 13)
    return lbrowser(w, h, b, "Range 2 sketch: upload screen that pre-checks each document for date, ownership and signature")


def spendesk_3_list():
    w, h = 520, 340
    b = sp_sidebar(h) + text(150, 76, "Annual company verification", 13, INK, 700)
    b += f'<rect x="374" y="64" width="106" height="17" rx="8" fill="#fff1d6"/>' + text(427, 76, "Due 12 Dec", 9.5, "#8a5300", 700, "middle")
    b += bar(150, 94, 330, 7, LIGHT) + bar(150, 94, 220, 7, SP_OK)
    rows = [("Kbis", "Ready", 1), ("Shareholding structure", "Needs a fix", 0), ("Articles of association", "Ready", 1), ("Marie Laurent · CEO", "Ready", 1), ("Thomas Girard · 32%", "Asked Thomas", 2)]
    for i, (l, t, ok) in enumerate(rows):
        b += sp_row(150, 112 + i * 34, 330, l, t, ok)
    b += ring(150, 282, 330, 28, 8) if False else ""
    b += note(150, 300, "one list, pre-checks, ask a shareholder", SP_P, 13)
    return lbrowser(w, h, b, "Range 3 sketch: verification checklist with statuses, a failed pre-check and a shareholder asked to upload")


def spendesk_3_review():
    w, h = 520, 340
    b = sp_sidebar(h) + text(150, 76, "Annual company verification", 13, INK, 700)
    b += f'<rect x="394" y="64" width="86" height="17" rx="8" fill="#eff1fe"/>' + text(437, 76, "In review", 9.5, SP_P, 700, "middle")
    steps = [("Sent for review · 13 Nov", INK), ("In review · usually 2 working days", SP_P), ("Decision expected · 17 Nov", MID)]
    for i, (s, c) in enumerate(steps):
        y = 110 + i * 46
        b += f'<circle cx="160" cy="{y}" r="6" fill="{"#fff" if i else c}" stroke="{c}" stroke-width="2"/>' + text(178, y + 4, s, 11.5, c, 700 if i == 1 else 600)
        if i < 2:
            b += f'<line x1="160" y1="{y+8}" x2="160" y2="{y+38}" stroke="{LIGHT}" stroke-width="2"/>'
    b += note(150, 270, "a status, not silence", SP_P)
    b += note(150, 292, "questions arrive here, not only by email", "#9a9aa3", 13)
    return lbrowser(w, h, b, "Range 3 sketch: after sending, a review timeline with what happens next and when")


SP_SKETCHES = {"spendesk-1": spendesk_1, "spendesk-2": spendesk_2, "spendesk-3-list": spendesk_3_list, "spendesk-3-review": spendesk_3_review}

if __name__ == "__main__":
    for name, fn in SP_SKETCHES.items():
        (OUT / f"{name}.svg").write_text(fn(), encoding="utf-8")
        print("wrote", name)


# ---------------- WEB APP full screens (1280 x 800) for the desktop browser frame ----------------
WW, WH = 1280, 800


def wscreen(body, title):
    return (f'<svg xmlns="http://www.w3.org/2000/svg" width="{WW}" height="{WH}" viewBox="0 0 {WW} {WH}" role="img" aria-label="{title}">'
            f'<title>{title}</title><rect width="{WW}" height="{WH}" fill="#ffffff"/>{body}</svg>')


def wsidebar(active=6, items=("Home", "Requests", "Expenses", "Cards", "Invoices", "Bookkeeping", "Verification", "Settings")):
    out = f'<rect x="0" y="0" width="240" height="{WH}" fill="#f6f6f8"/><line x1="240" y1="0" x2="240" y2="{WH}" stroke="{LIGHT}" stroke-width="2"/>'
    out += f'<rect x="24" y="26" width="36" height="36" rx="8" fill="{LIGHT}"/>' + bar(72, 32, 110, 11, "#d6d6dc") + bar(72, 50, 70, 8)
    for i, label in enumerate(items):
        y = 104 + i * 46
        if i == active:
            out += f'<rect x="14" y="{y-6}" width="212" height="40" rx="9" fill="#ebe8f7"/>'
        out += f'<rect x="30" y="{y+5}" width="16" height="16" rx="4" fill="{"#c9c1ee" if i == active else "#dcdce2"}"/>'
        out += text(60, y + 19, label, 16, INK if i == active else "#55555f", 700 if i == active else 500)
    return out


def wtag(x, y, label, ok):
    c, bg = (SP_OK, SP_OKBG) if ok == 1 else (SP_BAD, SP_BADBG) if ok == 0 else ("#4a4aba", "#eff1fe") if ok == 3 else ("#6b6b73", LIGHT)
    w = 22 + len(label) * 8.6
    return f'<rect x="{x-w}" y="{y}" width="{w}" height="28" rx="14" fill="{bg}"/>' + text(x - w / 2, y + 19, label, 14, c, 700, "middle")


def wrow(x, y, w, title, sub, tag, ok, highlight=False):
    out = ""
    if highlight:
        out += f'<rect x="{x}" y="{y}" width="{w}" height="64" fill="#faf9fe"/>'
    out += f'<rect x="{x+20}" y="{y+16}" width="32" height="32" rx="8" fill="{LIGHT}"/>'
    out += text(x + 68, y + 30, title, 17, INK, 700) + text(x + 68, y + 51, sub, 14, "#8a8a93", 500)
    out += wtag(x + w - 56, y + 18, tag, ok) + text(x + w - 30, y + 38, "›", 22, MID, 500)
    return out


def spendesk_1_web():
    # Webmail: the KYC request as it arrives today, rewritten as a clearer checklist
    b = f'<rect x="0" y="0" width="{WW}" height="64" fill="#f6f6f8"/><line x1="0" y1="64" x2="{WW}" y2="64" stroke="{LIGHT}" stroke-width="2"/>'
    b += text(32, 40, "Mail", 20, INK, 800) + f'<rect x="300" y="16" width="520" height="34" rx="17" fill="#ffffff" stroke="{LIGHT}" stroke-width="2"/>' + text(324, 39, "Search mail", 15, MID, 500)
    b += f'<rect x="0" y="64" width="380" height="{WH-64}" fill="#ffffff"/><line x1="380" y1="64" x2="380" y2="{WH}" stroke="{LIGHT}" stroke-width="2"/>'
    mails = [("collect@spendesk.com", "Action needed: periodic KYC review", True), ("Marie (CFO)", "Re: Q4 budget", False), ("Bank", "Statement ready", False), ("Thomas", "Board pack", False), ("Newsletter", "This week in finance", False)]
    for i, (f, s, on) in enumerate(mails):
        y = 80 + i * 86
        if on:
            b += f'<rect x="0" y="{y}" width="378" height="86" fill="#ebe8f7"/>'
        b += text(28, y + 32, f, 16, INK, 800 if on else 600) + text(28, y + 58, s, 14, "#55555f" if on else MID, 500)
    b += text(424, 120, "Action needed: your periodic KYC review", 26, INK, 800)
    b += text(424, 152, "From collect@spendesk.com  ·  to the Account Owner", 15, MID, 500)
    for i, w in enumerate([700, 640, 520]):
        b += bar(424, 180 + i * 22, w, 10)
    b += box(424, 262, 640, 300, stroke=SP_P, r=14, sw=3)
    b += text(452, 302, "What we need, and the rules", 19, INK, 800)
    rules = [("Kbis extract", "issued in the last 3 months"), ("Shareholding structure", "signed and dated, 100% of shares"),
             ("IDs for each executive", "in colour, front and back"), ("Proof of address", "personal, under 3 months")]
    for i, (a, r) in enumerate(rules):
        y = 344 + i * 52
        b += box(452, y - 18, 22, 22, stroke=INK, r=5, sw=2) + text(490, y, a, 17, INK, 700) + text(490, y + 22, r, 14, "#6b6b73", 500)
    b += f'<rect x="424" y="592" width="230" height="50" rx="25" fill="{INK}"/>' + text(539, 623, "Upload documents", 16, "#fff", 700, "middle")
    b += note(1088, 300, "clear list +", SP_P, 26) + note(1088, 334, "the rules", SP_P, 26) + arrow(1084, 316, 1070, 360, SP_P)
    b += note(424, 700, "still email-only: spam, one person, and mistakes found 48h later", "#8a8a93", 22)
    return wscreen(b, "Range 1: the KYC request email rewritten as a clear checklist of documents and rules")


def spendesk_2_web():
    b = wsidebar()
    x0 = 300
    b += text(x0, 66, "Verification  ›  Shareholding structure", 15, MID, 500)
    b += text(x0, 110, "Upload your shareholding structure", 30, INK, 800)
    b += text(x0, 142, "Signed and dated by a legal representative, under 3 months old.", 16, "#6b6b73", 500)
    b += box(x0, 174, 620, 150, stroke=MID, r=14, sw=2, dash="9 8")
    b += f'<rect x="{x0+290}" y="{206}" width="40" height="40" rx="10" fill="{LIGHT}"/>' + text(x0 + 310, 278, "Drop your file here  ·  we check it straight away", 16, "#6b6b73", 600, "middle")
    b += box(x0, 350, 620, 64, stroke=LIGHT, r=12, sw=2) + f'<rect x="{x0+18}" y="366" width="32" height="32" rx="7" fill="{SP_BADBG}"/>'
    b += text(x0 + 66, 380, "Cap-table_Northwind.pdf", 16, INK, 700) + text(x0 + 66, 400, "Uploaded just now · 1 page", 13, MID, 500)
    b += text(x0, 456, "Automatic checks", 18, INK, 800)
    checks = [("✓  Dated 2 Oct 2026, under 3 months", SP_OK, "#f4f8f4"), ("✓  Shows who owns 100% of the shares", SP_OK, "#f4f8f4"),
              ("✕  No signature found. Sign and date the last page, then upload it again.", SP_BAD, SP_BADBG)]
    for i, (s, c, bg) in enumerate(checks):
        y = 476 + i * 60
        b += f'<rect x="{x0}" y="{y}" width="620" height="48" rx="10" fill="{bg}"/>' + text(x0 + 18, y + 30, s, 16, c, 700)
    b += note(960, 520, "catches the usual", SP_P, 26) + note(960, 554, "rejections at upload", SP_P, 26) + arrow(956, 540, 930, 574, SP_P)
    b += note(x0, 740, "…but the Account Owner still chases every shareholder, and gets no status after sending", "#8a8a93", 22)
    return wscreen(b, "Range 2: upload page that checks each document straight away, with a missing signature flagged")


def spendesk_3_list_web():
    b = wsidebar()
    x0, w = 300, 820
    b += text(x0, 66, "Settings  ›  Company verification", 15, MID, 500)
    b += text(x0, 110, "Annual company verification", 30, INK, 800)
    b += f'<rect x="{x0+w-118}" y="86" width="118" height="28" rx="14" fill="#fff1d6"/>' + text(x0 + w - 59, 105, "Due 12 Dec", 14, "#8a5300", 700, "middle")
    b += box(x0, 140, w, 76, stroke=LIGHT, r=14, sw=2) + text(x0 + 22, 172, "4 of 6 ready", 19, INK, 800)
    b += bar(x0 + 22, 190, w - 44, 10, LIGHT, 5) + bar(x0 + 22, 190, (w - 44) * 4 / 6, 10, SP_OK, 5)
    rows = [("Certificate of incorporation (Kbis)", "Issued in the last 3 months", "Ready", 1, False),
            ("Shareholding structure", "Signed and dated, under 3 months", "Needs a fix", 0, True),
            ("Articles of association", "Latest signed version", "Ready", 1, False),
            ("Marie Laurent · CEO", "ID in colour, front and back · proof of address", "Ready", 1, False),
            ("Thomas Girard · owns 32%", "We sent him a secure link", "Waiting for Thomas", 3, True)]
    b += box(x0, 240, w, 64 * len(rows), stroke=LIGHT, r=14, sw=2)
    for i, (t, s, tag, ok, hl) in enumerate(rows):
        y = 240 + i * 64
        b += wrow(x0, y, w, t, s, tag, ok, False)
        if i:
            b += f'<line x1="{x0}" y1="{y}" x2="{x0+w}" y2="{y}" stroke="{LIGHT}" stroke-width="2"/>'
    b += text(x0, 618, "Review usually takes 2 working days. We'll show the status here.", 14, MID, 500)
    b += f'<rect x="{x0+w-250}" y="596" width="250" height="46" rx="10" fill="#e4e4ea"/>' + text(x0 + w - 125, 625, "Send for review · 2 left", 15, "#8a8a93", 700, "middle")
    b += ring(x0 + w - 56 - 116.6, 322, 116.6, 28, 14) + note(1136, 330, "fix before", SP_P, 24) + note(1136, 360, "review", SP_P, 24)
    b += ring(x0 + w - 56 - 176.8, 514, 176.8, 28, 14) + note(1136, 522, "they upload", SP_P, 24) + note(1136, 552, "their own ID", SP_P, 24)
    b += note(x0, 720, "one list in Spendesk: pre-checks, ask a shareholder, a due date", SP_P, 24)
    return wscreen(b, "Range 3, before sending: verification checklist with statuses, a failed pre-check and a shareholder asked to upload")


def spendesk_3_review_web():
    b = wsidebar()
    x0, w = 300, 820
    b += text(x0, 66, "Settings  ›  Company verification", 15, MID, 500)
    b += text(x0, 110, "Annual company verification", 30, INK, 800)
    b += f'<rect x="{x0+w-110}" y="86" width="110" height="28" rx="14" fill="#eff1fe"/>' + text(x0 + w - 55, 105, "In review", 14, "#4a4aba", 700, "middle")
    b += f'<rect x="{x0}" y="140" width="{w}" height="70" rx="12" fill="#eff1fe"/>' + text(x0 + 22, 170, "Your documents are with our compliance team", 17, "#4a4aba", 800)
    b += text(x0 + 22, 194, "Nothing else is needed from you. Questions will appear here as well as by email.", 14, "#55555f", 500)
    b += box(x0, 234, w, 270, stroke=LIGHT, r=14, sw=2)
    steps = [("13 Nov", "Sent for review", "By Marie Laurent · 6 of 6 items passed our checks", INK, True),
             ("13 Nov", "In review", "Our compliance team is checking. Usually 2 working days.", SP_P, False),
             ("17 Nov", "Decision expected", "We'll email you and update this page.", MID, False)]
    for i, (d, t, s, c, filled) in enumerate(steps):
        y = 280 + i * 76
        b += text(x0 + 30, y + 6, d, 14, MID, 600)
        b += f'<circle cx="{x0+120}" cy="{y}" r="9" fill="{c if filled else "#fff"}" stroke="{c}" stroke-width="3"/>'
        if i < 2:
            b += f'<line x1="{x0+120}" y1="{y+12}" x2="{x0+120}" y2="{y+64}" stroke="{LIGHT}" stroke-width="3"/>'
        b += text(x0 + 146, y + 6, t, 18, c, 800) + text(x0 + 146, y + 30, s, 14, "#6b6b73", 500)
    b += text(x0, 552, "What you sent", 16, INK, 800)
    for i in range(6):
        cx, cy = x0 + (i % 3) * 276, 572 + (i // 3) * 76
        b += box(cx, cy, 264, 62, stroke=LIGHT, r=10, sw=2) + f'<rect x="{cx+14}" y="{cy+15}" width="32" height="32" rx="7" fill="#fbe3df"/>' + bar(cx + 60, cy + 20, 150, 10, "#d6d6dc") + bar(cx + 60, cy + 38, 100, 8)
    b += note(1136, 330, "a status,", SP_P, 24) + note(1136, 360, "not silence", SP_P, 24) + arrow(1132, 346, 1100, 360, SP_P)
    return wscreen(b, "Range 3, after sending: review timeline with what happens next and when")


WEB_SCREENS = {"spendesk-1-screen": spendesk_1_web, "spendesk-2-screen": spendesk_2_web,
               "spendesk-3-list-screen": spendesk_3_list_web, "spendesk-3-review-screen": spendesk_3_review_web}

if __name__ == "__main__":
    for name, fn in WEB_SCREENS.items():
        (OUT / f"{name}.svg").write_text(fn(), encoding="utf-8")
        print("wrote", name)


# ---------------- XELIX Helpdesk full screens (1280 x 800) ----------------
XP = "#5b2bc4"


def xframe(active_side="Evidence"):
    out = f'<rect x="0" y="0" width="56" height="{WH}" fill="#3a1680"/>'
    for i in range(5):
        out += f'<rect x="16" y="{70+i*48}" width="24" height="24" rx="6" fill="{"#7b56d6" if i == 4 else "#5a37a6"}"/>'
    out += f'<line x1="56" y1="56" x2="{WW}" y2="56" stroke="{LIGHT}" stroke-width="2"/>'
    out += text(80, 35, "Dashboard", 15, "#55555f", 600) + f'<rect x="168" y="16" width="64" height="28" rx="6" fill="{XP}"/>' + text(200, 35, "Inbox", 15, "#fff", 700, "middle") + text(250, 35, "Kanban", 15, "#55555f", 600)
    out += f'<rect x="0" y="0" width="0" height="0"/><rect x="56" y="56" width="250" height="{WH-56}" fill="#faf9fd"/><line x1="306" y1="56" x2="306" y2="{WH}" stroke="{LIGHT}" stroke-width="2"/>'
    for i in range(6):
        y = 76 + i * 110
        if i == 0:
            out += f'<rect x="56" y="{y-10}" width="250" height="104" fill="#ffffff"/><rect x="56" y="{y-10}" width="4" height="104" fill="{XP}"/>'
        out += bar(76, y, 120, 11, "#cfcfd8") + bar(76, y + 22, 180, 9) + bar(76, y + 40, 200, 8) + f'<rect x="76" y="{y+60}" width="58" height="18" rx="9" fill="#e8f6ee"/>'
    out += f'<line x1="980" y1="56" x2="980" y2="{WH}" stroke="{LIGHT}" stroke-width="2"/>'
    out += text(330, 88, "Ticket #339962", 13, MID, 600) + text(330, 116, "Upcoming due invoices", 22, INK, 800)
    for i, k in enumerate(["Status", "Priority", "Categories", "Assignee", "Vendors"]):
        out += text(330 + i * 120, 146, k, 12, MID, 600) + f'<rect x="{330+i*120}" y="154" width="96" height="20" rx="5" fill="#f1eff7"/>'
    tabs = ["Evidence", "Activity", "Comments"] if active_side == "Evidence" else ["Activity", "Comments"]
    for i, t in enumerate(tabs):
        on = t == active_side
        out += text(1000 + i * 92, 90, t, 15, XP if on else MID, 700 if on else 600)
        if on:
            out += f'<rect x="1000" y="100" width="{len(t)*9}" height="3" fill="{XP}"/>'
    return out


def xdraft(x, y, lines_bad=False, fixed=False):
    out = box(x, y, 620, 270, stroke=LIGHT, r=10, sw=2) + text(x + 20, y + 34, "Dear Joseph,", 15, INK, 500)
    if fixed:
        rows = ["• PP-2172246 is in the pay run on Fri 20 Nov.", "• PP-2166142 is on hold: please send the delivery note.", "• PP-2169089 was paid on 10 Nov (ref XLX-55190)."]
        for i, r in enumerate(rows):
            out += text(x + 20, y + 74 + i * 32, r, 15, INK, 500)
    else:
        for i, inv in enumerate(["PP-2172246", "PP-2166142", "PP-2169089"]):
            bad = lines_bad and i > 0
            if bad:
                out += f'<rect x="{x+16}" y="{y+58+i*30}" width="112" height="24" rx="4" fill="{SP_BADBG}"/>'
            out += text(x + 20, y + 76 + i * 30, inv, 15, SP_BAD if bad else INK, 600)
        if lines_bad:
            out += f'<rect x="{x+16}" y="{y+160}" width="560" height="26" rx="4" fill="{SP_BADBG}"/>'
        out += text(x + 20, y + 179, "We will ensure these invoices are processed for payment as they become due.", 14, SP_BAD if lines_bad else INK, 500)
    out += text(x + 20, y + 232, "Best regards, Tony", 15, INK, 500)
    return out


def xelix_1_web():
    b = xframe("Activity")
    b += f'<rect x="330" y="190" width="620" height="40" rx="8" fill="#e8f1fe"/>' + text(348, 215, "Accept or discard generated reply?", 15, INK, 600)
    b += xdraft(330, 244)
    b += box(330, 530, 620, 120, stroke=SP_P, r=10, sw=3) + text(350, 560, "Sources used", 16, INK, 800)
    for i, s in enumerate(["AP ledger · 3 invoices", "Vendor record · Barber Ltd", "Pay run · 20 Nov"]):
        b += f'<rect x="{350+i*196}" y="578" width="184" height="30" rx="15" fill="#f1eff7"/>' + text(442 + i * 196, 598, s, 13, XP, 700, "middle")
    b += note(330, 690, "sources listed, but nobody checks the claim against them", "#8a8a93", 22)
    b += note(990, 600, "cheap to add", SP_P, 24) + note(990, 630, "under the draft", SP_P, 24)
    return wscreen(b, "Range 1: sources listed under the AI-drafted reply, but the claims aren't checked")


def xelix_2_web():
    b = xframe("Activity")
    b += f'<rect x="330" y="190" width="620" height="40" rx="8" fill="{"#fff4e0"}"/>' + text(348, 215, "This reply promises a payment. Confirm before sending.", 15, "#8a5300", 700)
    b += xdraft(330, 244, lines_bad=False)
    b += f'<rect x="346" y="404" width="574" height="26" rx="4" fill="none" stroke="#d4880f" stroke-width="2" stroke-dasharray="6 5"/>'
    b += box(330, 540, 300, 46, stroke=MID, r=8, sw=2) + text(352, 569, "☐  I've checked the payment dates", 14, INK, 600)
    b += f'<rect x="760" y="540" width="190" height="46" rx="8" fill="#cfc8e0"/>' + text(855, 569, "Use as draft", 15, "#fff", 700, "middle")
    b += note(330, 680, "catches promises, but the agent still checks the ERP by hand", "#8a8a93", 22)
    b += note(990, 420, "flags risky", SP_P, 24) + note(990, 450, "promises", SP_P, 24) + arrow(986, 432, 930, 418, SP_P)
    return wscreen(b, "Range 2: risky promises in the AI reply are flagged and need a manual confirmation")


def xelix_3_draft_web():
    b = xframe("Evidence")
    b += f'<rect x="330" y="190" width="620" height="40" rx="8" fill="#fff4e0"/>' + text(348, 215, "2 invoices don't match the ledger", 15, "#8a5300", 800)
    b += f'<rect x="700" y="196" width="130" height="28" rx="6" fill="#fff" stroke="{XP}" stroke-width="2"/>' + text(765, 215, "Fix from evidence", 12, XP, 700, "middle")
    b += f'<rect x="840" y="196" width="100" height="28" rx="6" fill="#cfc8e0"/>' + text(890, 215, "Use as draft", 12, "#fff", 700, "middle")
    b += xdraft(330, 244, lines_bad=True)
    cards = [("PP-2172246", "Scheduled · 20 Nov", "#2f6fe0", "#e8f1fe", False), ("PP-2166142", "On hold · no receipt", "#8a5300", "#fff3d6", True), ("PP-2169089", "Paid 10 Nov", SP_OK, SP_OKBG, True)]
    for i, (inv, st, c, bg, bad) in enumerate(cards):
        y = 124 + i * 128
        b += box(996, y, 266, 114, stroke="#f2b7be" if bad else LIGHT, r=10, sw=2) + text(1012, y + 28, inv, 15, INK, 800)
        b += f'<rect x="1012" y="{y+40}" width="150" height="20" rx="10" fill="{bg}"/>' + text(1087, y + 55, st, 11, c, 700, "middle")
        b += bar(1012, y + 72, 200, 8)
        if bad:
            b += text(1012, y + 100, "Draft claim is wrong", 13, SP_BAD, 700)
    b += ring(330, 190, 620, 40, 8)
    b += note(330, 690, "every claim checked against the ledger before it's sent", SP_P, 24)
    return wscreen(b, "Range 3, the draft: every invoice in the AI reply checked against the ledger, with two conflicts flagged")


def xelix_3_fixed_web():
    b = xframe("Evidence")
    b += f'<rect x="330" y="190" width="620" height="40" rx="8" fill="#e8f1fe"/>' + text(348, 215, "Every invoice matches the ledger · 3 of 3", 15, "#2f6fe0", 800)
    b += f'<rect x="840" y="196" width="100" height="28" rx="6" fill="{XP}"/>' + text(890, 215, "Use as draft", 12, "#fff", 700, "middle")
    b += xdraft(330, 244, fixed=True)
    for i, (inv, st, c, bg) in enumerate([("PP-2172246", "Scheduled · 20 Nov", "#2f6fe0", "#e8f1fe"), ("PP-2166142", "On hold · no receipt", "#8a5300", "#fff3d6"), ("PP-2169089", "Paid 10 Nov", SP_OK, SP_OKBG)]):
        y = 124 + i * 128
        b += box(996, y, 266, 114, stroke=LIGHT, r=10, sw=2) + text(1012, y + 28, inv, 15, INK, 800)
        b += f'<rect x="1012" y="{y+40}" width="150" height="20" rx="10" fill="{bg}"/>' + text(1087, y + 55, st, 11, c, 700, "middle") + bar(1012, y + 72, 200, 8)
    b += ring(330, 244, 620, 270, 10)
    b += note(330, 690, "accurate first time, evidence saved to the ticket", SP_P, 24)
    return wscreen(b, "Range 3, fixed: the reply rewritten with each invoice's real status, ready to send")


XELIX_SCREENS = {"xelix-1-screen": xelix_1_web, "xelix-2-screen": xelix_2_web, "xelix-3-draft-screen": xelix_3_draft_web, "xelix-3-fixed-screen": xelix_3_fixed_web}

if __name__ == "__main__":
    for name, fn in XELIX_SCREENS.items():
        (OUT / f"{name}.svg").write_text(fn(), encoding="utf-8")
        print("wrote", name)
