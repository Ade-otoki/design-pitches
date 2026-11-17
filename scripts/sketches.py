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


# ---------------- HOUSINGANYWHERE phone screens (402 x 874) ----------------
HA_OR, HA_INK = "#ff4c27", "#002630"


def ha_head():
    return text(SW / 2, 92, "Your stay", 18, HA_INK, 700, "middle") + box(16, 110, SW - 32, 78, stroke=LIGHT, r=14, sw=2) + f'<rect x="28" y="122" width="54" height="54" rx="10" fill="{LIGHT}"/>' + bar(96, 132, 170, 11, "#cfd8de") + bar(96, 152, 210, 8) + bar(96, 166, 140, 8)


def ha_tabs():
    out = f'<line x1="0" y1="{SH-84}" x2="{SW}" y2="{SH-84}" stroke="{LIGHT}" stroke-width="2"/>'
    for i in range(5):
        out += f'<rect x="{30+i*76}" y="{SH-68}" width="36" height="8" rx="4" fill="{HA_OR if i == 3 else "#cfd8de"}"/>'
    return out


def ha_1():
    b = ha_head() + box(16, 204, SW - 32, 300, stroke=LIGHT, r=14, sw=2)
    b += text(32, 236, "Your booking is confirmed", 18, HA_INK, 800)
    for i, (l, r) in enumerate([("Move-in", "1 Dec"), ("Rent", "€650 / month"), ("Landlord", "Eva de Vries")]):
        b += text(32, 276 + i * 34, l, 14, MID, 600) + text(SW - 32, 276 + i * 34, r, 14, INK, 700, "end")
    b += f'<rect x="32" y="388" width="{SW-64}" height="80" rx="10" fill="#eef3f6"/>' + text(46, 414, "Tenant Protection", 14, HA_INK, 800) + text(46, 438, "Report problems within 48h of", 13, "#55555f", 500) + text(46, 456, "moving in for a refund.", 13, "#55555f", 500)
    b += ring(32, 388, SW - 64, 80, 10)
    b += note(24, 580, "explain the rule better", HA_OR, 22) + note(24, 612, "…but it's still just text", "#8a8a93", 18)
    return screen(b + ha_tabs(), "Range 1: booking screen with a clearer Tenant Protection explanation")


def ha_2():
    b = ha_head() + f'<rect x="16" y="204" width="{SW-32}" height="96" rx="14" fill="{HA_INK}"/>'
    b += f'<circle cx="62" cy="252" r="28" fill="none" stroke="{HA_OR}" stroke-width="4"/>' + text(62, 258, "45h", 16, "#fff", 800, "middle")
    b += text(104, 244, "Check your room", 17, "#fff", 800) + text(104, 268, "Report problems before 3 Dec", 13, "#cfe0e8", 500)
    b += ring(16, 204, SW - 32, 96, 14)
    b += box(16, 316, SW - 32, 120, stroke=LIGHT, r=14, sw=2) + text(32, 348, "Paid · held until 3 Dec, 14:00", 14, HA_INK, 700) + bar(32, 366, 260, 8) + bar(32, 384, 200, 8)
    b += note(24, 520, "a countdown makes the", HA_OR, 22) + note(24, 550, "48h window visible", HA_OR, 22) + note(24, 600, "…but what do I check?", "#8a8a93", 18)
    return screen(b + ha_tabs(), "Range 2: a 48-hour countdown card on the stay screen")


def ha_3a():
    b = ha_head() + f'<rect x="16" y="204" width="{SW-32}" height="86" rx="14" fill="{HA_INK}"/>'
    b += f'<circle cx="58" cy="247" r="24" fill="none" stroke="{HA_OR}" stroke-width="4"/>' + text(58, 252, "45h", 14, "#fff", 800, "middle") + text(96, 252, "Check your room", 16, "#fff", 800)
    b += box(16, 304, SW - 32, 340, stroke=LIGHT, r=14, sw=2) + text(32, 336, "Move-in check", 16, HA_INK, 800) + text(SW - 32, 336, "4/5", 13, MID, 700, "end")
    for i, (l, st) in enumerate([("Got the keys", 1), ("Matches the listing", 1), ("Clean and safe", 1), ("Heating and hot water", 0), ("Wi-Fi works", 1)]):
        y = 362 + i * 44
        b += f'<circle cx="44" cy="{y+12}" r="12" fill="{SP_OK if st else "#fff"}" stroke="{SP_OK if st else "#a5bccc"}" stroke-width="2"/>' + text(66, y + 17, l, 14, INK, 600)
    b += box(32, 586, 160, 44, stroke=HA_INK, r=10, sw=2) + text(112, 613, "Something's wrong", 13, HA_INK, 700, "middle")
    b += f'<rect x="204" y="586" width="166" height="44" rx="10" fill="#ffc2b5"/>' + text(287, 613, "All good, release", 13, "#fff", 700, "middle")
    b += ring(32, 586, 160, 44, 10)
    b += note(24, 700, "a checklist inside the window", HA_OR, 20)
    return screen(b + ha_tabs(), "Range 3, move-in day: countdown with a short room checklist")


def ha_3b():
    b = ha_head() + box(16, 204, SW - 32, 86, stroke="#ffc4b8", r=14, sw=2)
    b += f'<circle cx="58" cy="247" r="24" fill="#ffece9" stroke="{HA_OR}" stroke-width="3"/>' + text(58, 252, "held", 11, HA_OR, 800, "middle") + text(96, 244, "We're looking into it", 16, HA_INK, 800) + text(96, 266, "Reply within 12 hours", 13, "#55555f", 500)
    b += box(16, 304, SW - 32, 300, stroke=LIGHT, r=14, sw=2) + text(32, 336, "Your report", 16, HA_INK, 800)
    b += f'<circle cx="44" cy="374" r="12" fill="{HA_OR}"/>' + text(44, 379, "!", 13, "#fff", 800, "middle") + text(66, 379, "No hot water", 14, HA_OR, 700)
    b += f'<rect x="32" y="400" width="{SW-64}" height="70" rx="10" fill="#ffece9"/>' + bar(46, 420, 240, 9, "#f3c6bb") + bar(46, 440, 180, 9, "#f3c6bb")
    b += f'<rect x="32" y="486" width="64" height="64" rx="8" fill="{LIGHT}"/><rect x="106" y="486" width="64" height="64" rx="8" fill="{LIGHT}"/>' + text(186, 524, "2 photos", 13, MID, 600)
    b += ring(16, 204, SW - 32, 86, 14)
    b += note(24, 680, "money stays protected", HA_OR, 20) + note(24, 708, "while it's fixed", HA_OR, 20)
    return screen(b + ha_tabs(), "Range 3, something's wrong: report with photos, payment held and a reply time")


HA_SCREENS = {"housinganywhere-1-screen": ha_1, "housinganywhere-2-screen": ha_2, "housinganywhere-3-check": ha_3a, "housinganywhere-3-report": ha_3b}

if __name__ == "__main__":
    for name, fn in HA_SCREENS.items():
        (OUT / f"{name}.svg").write_text(fn(), encoding="utf-8")
        print("wrote", name)


# ---------------- FAIRE cart web screens (1280 x 800) ----------------
FG, FW = "#2f6b3f", "#b25b12"


def faire_frame():
    b = f'<rect x="0" y="0" width="{WW}" height="30" fill="#2b2b2b"/>' + bar(470, 11, 340, 8, "#777")
    b += text(40, 66, "W H O L E S A L E", 15, INK, 500) + f'<rect x="300" y="44" width="560" height="34" rx="17" fill="#fff" stroke="#bbb" stroke-width="2"/>'
    b += f'<line x1="0" y1="118" x2="{WW}" y2="118" stroke="{LIGHT}" stroke-width="2"/>' + text(100, 168, "Cart", 32, INK, 500)
    for i, (n, amt) in enumerate([("Annie B's Popcorn", "$312"), ("Lady May Tallow", "$540"), ("Juniper & Ash Candles", "$708")]):
        y = 220 + i * 76
        b += f'<circle cx="152" cy="{y+30}" r="20" fill="#e3dbcd"/>' + text(188, y + 28, n, 17, INK, 500) + bar(188, y + 40, 140, 8) + bar(548, y + 34, 150, 4, FG) + text(780, y + 34, amt, 16, INK, 600, "end")
        b += f'<line x1="100" y1="{y+68}" x2="780" y2="{y+68}" stroke="{LIGHT}" stroke-width="2"/>'
    b += f'<line x1="0" y1="{WH-62}" x2="{WW}" y2="{WH-62}" stroke="{LIGHT}" stroke-width="2"/><rect x="1000" y="{WH-50}" width="180" height="38" fill="#1f1f1f"/>' + text(1090, WH - 26, "Checkout", 15, "#fff", 600, "middle")
    return b


def faire_1_web():
    b = faire_frame() + box(820, 140, 360, 210, stroke=LIGHT, r=0, sw=2)
    for i, (l, r) in enumerate([("Item total", "$1,560"), ("Shipping", "Free"), ("Order total", "$1,560")]):
        b += text(838, 180 + i * 34, l, 15, INK, 500) + text(1162, 180 + i * 34, r, 15, INK, 600, "end")
    b += f'<rect x="838" y="290" width="324" height="44" fill="#f6f6f6"/>' + text(852, 318, "Net 60: $1,240 available", 15, INK, 700)
    b += ring(838, 290, 324, 44, 4) + note(820, 420, "show the number", SP_P, 26) + note(820, 452, "in the summary", SP_P, 26)
    b += note(100, 520, "…but the retailer still has to do the maths", "#8a8a93", 22)
    return wscreen(b, "Range 1: available net 60 terms shown as a number in the cart summary")


def faire_2_web():
    b = faire_frame() + f'<rect x="0" y="{WH-120}" width="{WW}" height="58" fill="#fdf3e8"/>' + text(100, WH - 84, "$320 of this order will be charged on shipment", 17, FW, 700)
    b += ring(90, WH - 116, 520, 50, 6) + note(820, 300, "warn at checkout", SP_P, 26) + note(820, 332, "before it happens", SP_P, 26) + arrow(820, 345, 640, 680, SP_P)
    b += note(820, 420, "…but no way to fix it", "#8a8a93", 22)
    return wscreen(b, "Range 2: a warning above the checkout button when part of the order won't fit net 60")


def faire_3_cart_web():
    b = faire_frame() + box(820, 140, 360, 330, stroke="#e7b88a", r=0, sw=2) + f'<rect x="822" y="142" width="356" height="326" fill="#fdf3e8"/>'
    b += text(838, 174, "Net 60 terms", 17, INK, 700) + text(1162, 174, "$1,240 of $2,000", 13, MID, 500, "end")
    b += f'<rect x="838" y="190" width="324" height="10" fill="#fff"/><rect x="838" y="190" width="123" height="10" fill="#9a9a9a"/><rect x="961" y="190" width="160" height="10" fill="{FG}"/><rect x="1121" y="190" width="41" height="10" fill="{FW}"/>'
    b += text(838, 238, "$320 won't fit your terms.", 15, INK, 700)
    for i, (t, s) in enumerate([("Ship Juniper & Ash on 2 Dec", "after the next invoice, it all fits"), ("Pay $320 on shipment", "charged to your card when it ships")]):
        y = 260 + i * 76
        b += box(838, y, 324, 64, stroke="#bbb", r=0, sw=2) + text(852, y + 26, t, 14, INK, 700) + text(852, y + 48, s, 12.5, MID, 500)
    b += ring(830, 182, 340, 26, 4) + note(820, 540, "the limit, this order, and a fix", SP_P, 24)
    return wscreen(b, "Range 3, the cart: terms bar with the overflow and two ways to fix it")


def faire_3_pay_web():
    b = faire_frame() + box(820, 140, 360, 330, stroke=LIGHT, r=0, sw=2) + text(838, 174, "Upcoming payments", 17, INK, 700)
    for i, (a, d, c) in enumerate([("$480", "Due 1 Dec", FW), ("$280", "Due 19 Dec", INK), ("$852", "Due 12 Jan · this order", INK)]):
        y = 200 + i * 62
        b += f'<line x1="838" y1="{y}" x2="1162" y2="{y}" stroke="{LIGHT}" stroke-width="2"/>' + text(838, y + 28, a, 17, c, 700) + text(838, y + 50, d, 13, MID, 500)
    b += box(1080, 212, 82, 28, stroke=INK, r=0, sw=2) + text(1121, 231, "Pay early", 12, INK, 600, "middle")
    b += text(838, 410, "If a payment fails, net 60 pauses.", 13.5, INK, 700)
    b += ring(830, 196, 340, 64, 4) + note(820, 540, "keep terms healthy", SP_P, 24) + note(820, 570, "before they pause", SP_P, 24)
    return wscreen(b, "Range 3, upcoming payments: what's due and when, with a warning about failed payments")


FAIRE_SCREENS = {"faire-1-screen": faire_1_web, "faire-2-screen": faire_2_web, "faire-3-cart-screen": faire_3_cart_web, "faire-3-pay-screen": faire_3_pay_web}

if __name__ == "__main__":
    for name, fn in FAIRE_SCREENS.items():
        (OUT / f"{name}.svg").write_text(fn(), encoding="utf-8")
        print("wrote", name)


# ---------------- DUFFEL dashboard web screens (1280 x 800) ----------------
def duffel_base(active=3):
    return wsidebar(active, ("Home", "Search flights", "Orders", "Change Desk", "Stays", "Payments", "Developers", "Settings"))


def duffel_1_web():
    b = wsidebar(2, ("Home", "Search flights", "Orders", "Stays", "Payments", "Developers", "Settings", "")) + text(300, 80, "Orders", 30, INK, 800)
    b += f'<rect x="300" y="104" width="160" height="32" rx="8" fill="#ebe8f7"/>' + text(380, 125, "Action required · 3", 14, SP_P, 700, "middle")
    for i in range(6):
        y = 160 + i * 64
        b += box(300, y, 860, 54, stroke=LIGHT, r=8, sw=2) + bar(320, y + 18, 160, 10, "#cfcfd8") + bar(320, y + 34, 260, 8) + bar(980, y + 22, 120, 10, "#e4e4ea")
    b += ring(296, 100, 168, 40, 10) + note(300, 600, "a tab per airline that supports it", SP_P, 24)
    b += note(300, 640, "…the rest still arrive by email", "#8a8a93", 22)
    return wscreen(b, "Range 1: an Action required tab in Orders for airlines that support changes")


def duffel_2_web():
    b = duffel_base() + text(300, 80, "Change Desk", 30, INK, 800)
    for i, (t, tag, ok) in enumerate([("Departure moved 2h later", "Accept in Duffel", 1), ("Flight cancelled", "Needs Duffel support", 0), ("Moved 15m earlier", "No action", 2)]):
        y = 120 + i * 96
        b += box(300, y, 860, 84, stroke=LIGHT, r=10, sw=2) + bar(320, y + 20, 160, 11, "#cfcfd8") + text(320, y + 54, t, 16, INK, 600) + wtag(1140, y + 30, tag, ok)
    b += ring(980, 140, 170, 230, 12) + note(300, 470, "sort every change by what you can do", SP_P, 24) + note(300, 510, "…but support is still an email", "#8a8a93", 22)
    return wscreen(b, "Range 2: one queue labelling each change as accept here, needs support or no action")


def duffel_3a_web():
    b = duffel_base() + text(300, 80, "Change Desk", 30, INK, 800)
    for i, (t, h, urg) in enumerate([("Ada · moved 2h later", "Departs in 62h", 0), ("Tom · cancelled", "Departs in 38h", 1), ("Mei · moved 15m", "", 0)]):
        y = 120 + i * 96
        b += box(300, y, 500, 84, stroke=INK if i == 0 else LIGHT, r=10, sw=2) + text(320, y + 34, t, 16, INK, 700) + text(780, y + 60, h, 13, SP_BAD if urg else MID, 700, "end")
    b += box(830, 120, 330, 420, stroke=LIGHT, r=12, sw=2) + f'<rect x="846" y="140" width="298" height="70" rx="8" fill="#f3f2ee"/>' + text(860, 170, "Was 09:40  →  Now 11:50", 15, INK, 700)
    b += f'<rect x="846" y="226" width="298" height="54" rx="8" fill="{SP_OKBG}"/>' + text(860, 258, "You can accept this here", 14, SP_OK, 700)
    b += box(846, 296, 298, 110, stroke=LIGHT, r=8, sw=2) + bar(860, 318, 250, 8) + bar(860, 336, 230, 8) + bar(860, 354, 200, 8)
    b += f'<rect x="846" y="424" width="200" height="38" rx="8" fill="{INK}"/>' + text(946, 448, "Accept and notify", 14, "#fff", 700, "middle")
    b += ring(842, 418, 212, 50, 10) + note(300, 620, "accept + a ready message, in one click", SP_P, 24)
    return wscreen(b, "Range 3, accept: change detail with was/now, a ready customer message and one-click accept")


def duffel_3b_web():
    b = duffel_base() + text(300, 80, "Change Desk", 30, INK, 800)
    b += box(300, 120, 500, 84, stroke=LIGHT, r=10, sw=2) + text(320, 154, "Tom · cancelled", 16, INK, 700) + wtag(780, 160, "With Duffel support", 3)
    b += box(830, 120, 330, 420, stroke=LIGHT, r=12, sw=2) + f'<rect x="846" y="140" width="298" height="60" rx="8" fill="#fff3db"/>' + text(860, 176, "Handled by Duffel support", 14, "#9a5b00", 700)
    for i, t in enumerate(["IB 3106 · 10:05 → 10:25", "IB 3110 · 15:40 → 16:00"]):
        y = 216 + i * 64
        b += box(846, y, 298, 54, stroke=INK if i == 0 else LIGHT, r=8, sw=2) + f'<circle cx="866" cy="{y+27}" r="7" fill="{INK if i == 0 else "#fff"}" stroke="{INK}" stroke-width="2"/>' + text(882, y + 32, t, 14, INK, 600)
    b += f'<rect x="846" y="356" width="298" height="60" rx="8" fill="#eaf0fd"/>' + text(860, 382, "Sent · reply within 4 working hours", 13, "#2c5fd6", 700)
    b += ring(842, 352, 306, 68, 10) + note(300, 300, "pre-filled request,", SP_P, 24) + note(300, 332, "tracked here, not in email", SP_P, 24)
    return wscreen(b, "Range 3, hand-off: pre-filled support request with the passenger's choice and a tracked reply time")


DUFFEL_SCREENS = {"duffel-1-screen": duffel_1_web, "duffel-2-screen": duffel_2_web, "duffel-3-accept-screen": duffel_3a_web, "duffel-3-handoff-screen": duffel_3b_web}

if __name__ == "__main__":
    for name, fn in DUFFEL_SCREENS.items():
        (OUT / f"{name}.svg").write_text(fn(), encoding="utf-8")
        print("wrote", name)


# ---------------- STRIPE dashboard web screens (1280 x 800) ----------------
STRIPE_NAV = ("Home", "Balances", "Transactions", "Customers", "Product catalogue", "Connect", "Payments", "Reporting")


def stripe_1_web():
    b = wsidebar(1, STRIPE_NAV) + text(300, 80, "Balances", 30, INK, 800)
    b += bar(300, 110, 860, 14, "#cfcfd8")
    for i in range(6):
        y = 160 + i * 64
        b += box(300, y, 860, 54, stroke=LIGHT, r=8, sw=2) + bar(320, y + 22, 200, 10, "#cfcfd8") + bar(640, y + 22, 120, 10) + text(1140, y + 33, "Available 18 Nov", 13, MID, 600, "end")
    b += f'<rect x="900" y="210" width="250" height="70" rx="8" fill="{INK}"/>' + text(915, 240, "Pending: card payments", 13, "#fff", 600) + text(915, 262, "take 2 days to settle", 13, "#fff", 600)
    b += ring(896, 206, 258, 78, 10) + note(300, 600, "explain 'pending' where it shows up", SP_P, 24)
    b += note(300, 640, "…but no answer to 'when will I have it?'", "#8a8a93", 22)
    return wscreen(b, "Range 1: explain pending and 'Available on' dates in recent activity")


def stripe_2_web():
    b = wsidebar(1, STRIPE_NAV) + text(300, 80, "Upcoming payouts", 30, INK, 800)
    for i, (d, amt) in enumerate([("Tue 17 Nov", "$6,040"), ("Wed 18 Nov", "$1,380"), ("Thu 19 Nov", "$1,920"), ("Fri 20 Nov", "$1,650")]):
        y = 120 + i * 80
        b += box(300, y, 860, 66, stroke=LIGHT, r=10, sw=2) + text(320, y + 40, d, 16, INK, 700) + text(1140, y + 40, amt, 18, INK, 700, "end") + wtag(700, y + 40, "Estimated", 2)
    b += ring(296, 116, 868, 330, 12) + note(300, 500, "a list of payouts and arrival dates", SP_P, 24) + note(300, 540, "…but no link to what the money is for", "#8a8a93", 22)
    return wscreen(b, "Range 2: a forecast of upcoming payouts with estimated arrival dates")


def stripe_3a_web():
    b = wsidebar(1, STRIPE_NAV) + text(300, 80, "Cash timeline", 30, INK, 800)
    for i, (d, a, k) in enumerate([("Today", 0, 0), ("Mon", 70, 0), ("Tue", 25, 95), ("Wed", 32, 23), ("Thu", 28, 32), ("Fri", 38, 28)]):
        x = 300 + i * 100
        b += box(x, 120, 88, 220, stroke=SP_P if i == 5 else LIGHT, r=8, sw=2) + text(x + 12, 146, d, 14, INK, 700)
        if a: b += f'<rect x="{x+12}" y="{300-a}" width="30" height="{a}" rx="3" fill="#b9b5ff"/>'
        if k: b += f'<rect x="{x+46}" y="{300-k}" width="30" height="{k}" rx="3" fill="#0e9aa7"/>'
    b += box(940, 120, 220, 170, stroke=LIGHT, r=10, sw=2) + text(956, 150, "By Friday payroll", 15, INK, 700) + bar(956, 170, 180, 9) + f'<rect x="956" y="200" width="188" height="40" rx="6" fill="{SP_OKBG}"/>' + text(968, 226, "Covered, $1,190 spare", 13, SP_OK, 700)
    b += ring(936, 116, 228, 178, 12) + note(300, 420, "when it lands in the bank,", SP_P, 24) + note(300, 452, "checked against what's due", SP_P, 24)
    return wscreen(b, "Range 3, timeline: available vs in-the-bank by day, with a payroll check")


def stripe_3b_web():
    b = wsidebar(1, STRIPE_NAV) + text(300, 80, "Cash timeline", 30, INK, 800)
    b += f'<rect x="300" y="104" width="860" height="48" rx="8" fill="#fff4e0"/>' + text(318, 134, "$2,500 held as a reserve until 14 Jan · released automatically", 14, "#5c3a00", 700)
    b += bar(300, 180, 600, 14, "#cfcfd8") + f'<rect x="760" y="180" width="140" height="14" fill="#f5a524"/>'
    b += box(940, 220, 220, 210, stroke="#f5c26b", r=10, sw=2) + text(956, 250, "By Friday payroll", 15, INK, 700) + f'<rect x="956" y="266" width="188" height="40" rx="6" fill="#fde8ec"/>' + text(968, 292, "$1,310 short", 13, SP_BAD, 700)
    b += bar(956, 324, 180, 8) + bar(956, 342, 150, 8) + f'<rect x="956" y="370" width="150" height="34" rx="6" fill="{SP_P}"/>' + text(1031, 392, "Remind me Thu", 13, "#fff", 700, "middle")
    b += ring(296, 100, 868, 56, 10) + note(300, 480, "say why money is held, until when,", SP_P, 24) + note(300, 512, "and what it means for Friday", SP_P, 24)
    return wscreen(b, "Range 3, reserve: why money is held, until when, and the payroll impact")


STRIPE_SCREENS = {"stripe-1-screen": stripe_1_web, "stripe-2-screen": stripe_2_web, "stripe-3-timeline-screen": stripe_3a_web, "stripe-3-reserve-screen": stripe_3b_web}

if __name__ == "__main__":
    for name, fn in STRIPE_SCREENS.items():
        (OUT / f"{name}.svg").write_text(fn(), encoding="utf-8")
        print("wrote", name)


# ---------------- CODER agents web screens (1280 x 800) ----------------
CODER_NAV = ("Agents", "Workspaces", "Templates", "Users", "Audit", "Deployment", "", "")


def coder_chat(b):
    b += f'<rect x="760" y="110" width="400" height="44" rx="10" fill="#ececf0"/>' + bar(780, 128, 300, 9, "#cfcfd8")
    return b + bar(300, 180, 420, 9) + bar(300, 198, 300, 9)


def coder_1_web():
    b = coder_chat(wsidebar(0, CODER_NAV) + text(300, 80, "Fix refund rounding bug", 26, INK, 800))
    b += box(300, 230, 860, 60, stroke=LIGHT, r=10, sw=2) + text(320, 266, "Workspace: python-payments (picked by agent)", 15, INK, 600)
    b += ring(296, 226, 868, 68, 10) + note(300, 360, "name the template the agent picked", SP_P, 24) + note(300, 400, "…but you can only change it after it starts", "#8a8a93", 22)
    return wscreen(b, "Range 1: show which template the agent picked, as a line in the chat")


def coder_2_web():
    b = coder_chat(wsidebar(0, CODER_NAV) + text(300, 80, "Fix refund rounding bug", 26, INK, 800))
    b += f'<rect x="760" y="240" width="400" height="64" rx="10" fill="#fff" stroke="#8a8a93" stroke-width="2" stroke-dasharray="6 5"/>' + text(780, 268, "Also check partial refunds", 14, INK, 600) + text(780, 290, "Queued · after current step", 12, "#9a5b00", 700)
    b += ring(756, 236, 408, 72, 10) + note(300, 380, "show queued messages and when they land", SP_P, 24) + note(300, 420, "…workspace choice still hidden", "#8a8a93", 22)
    return wscreen(b, "Range 2: queued follow-ups shown with when they'll be delivered")


def coder_3a_web():
    b = coder_chat(wsidebar(0, CODER_NAV) + text(300, 80, "Fix refund rounding bug", 26, INK, 800))
    b += box(300, 230, 860, 170, stroke=LIGHT, r=12, sw=2) + text(320, 258, "WORKSPACE", 12, MID, 700) + wtag(1140, 258, "Starts in 10s", 2)
    b += text(320, 292, "python-payments", 18, INK, 800) + text(320, 316, "Matches 'Python backend services in the payments repo'", 13, MID, 600) + text(900, 292, "Payments VPC · 4 vCPU", 13, INK, 600)
    b += f'<rect x="320" y="340" width="200" height="38" rx="8" fill="#38bdf8"/>' + text(420, 364, "Start python-payments", 13, "#082f49", 700, "middle") + box(536, 340, 220, 38, stroke=LIGHT, r=8, sw=2) + text(646, 364, "Use a different workspace", 13, INK, 700, "middle")
    b += ring(296, 226, 868, 178, 12) + note(300, 470, "why this template, its network and size,", SP_P, 24) + note(300, 502, "with a 10-second window to change it", SP_P, 24)
    return wscreen(b, "Range 3, pick: the workspace card with reason, network policy and a window to switch")


def coder_3b_web():
    b = coder_chat(wsidebar(0, CODER_NAV) + text(300, 80, "Fix refund rounding bug", 26, INK, 800))
    b += box(300, 230, 860, 50, stroke=LIGHT, r=10, sw=2) + text(320, 262, "python-payments", 15, INK, 700) + wtag(1140, 262, "Running", 1)
    for i, s in enumerate(["✓ Workspace ready · 38s", "✓ Reproduced", "◌ Running tests (2 of 4 min)"]):
        b += text(300, 316 + i * 26, s, 14, "#2c5fd6" if i == 2 else INK, 600)
    b += f'<rect x="760" y="400" width="400" height="64" rx="10" fill="#fff" stroke="#8a8a93" stroke-width="2" stroke-dasharray="6 5"/>' + text(780, 428, "Also check partial refunds", 14, INK, 600) + text(780, 450, "Queued · ~2 min", 12, "#9a5b00", 700)
    b += box(760, 476, 220, 36, stroke=LIGHT, r=8, sw=2) + text(870, 499, "Deliver now", 13, INK, 700, "middle")
    b += ring(756, 396, 408, 120, 12) + note(300, 560, "when it lands, and a way to interrupt", SP_P, 24)
    return wscreen(b, "Range 3, steer: queued message with delivery time and 'Deliver now'")


CODER_SCREENS = {"coder-1-screen": coder_1_web, "coder-2-screen": coder_2_web, "coder-3-pick-screen": coder_3a_web, "coder-3-steer-screen": coder_3b_web}

if __name__ == "__main__":
    for name, fn in CODER_SCREENS.items():
        (OUT / f"{name}.svg").write_text(fn(), encoding="utf-8")
        print("wrote", name)


# ---------------- ASIDE browser web screens (1280 x 800) ----------------
ASIDE_NAV = ("Today", "Docs", "Sheets", "Agent Tabs", "Priya · profile", "Tom · profile", "Tasks", "Outreach")


def aside_1_web():
    b = wsidebar(7, ASIDE_NAV) + text(300, 80, "Outreach to 12 design leads", 26, INK, 800)
    for i in range(3):
        b += bar(300, 120 + i * 22, 300, 9)
    b += f'<rect x="420" y="250" width="440" height="190" rx="14" fill="#fff" stroke="{INK}" stroke-width="2"/>' + text(440, 286, "Send this message to Priya?", 16, INK, 700) + bar(440, 310, 380, 9) + bar(440, 330, 330, 9)
    b += f'<rect x="440" y="380" width="120" height="38" rx="8" fill="{INK}"/>' + text(500, 404, "Approve", 13, "#fff", 700, "middle")
    b += ring(416, 246, 448, 198, 14) + note(300, 520, "approve each send as it happens", SP_P, 24) + note(300, 560, "…12 interruptions, task stalls each time", "#8a8a93", 22)
    return wscreen(b, "Range 1: approve each send in a modal as the agent reaches it")


def aside_2_web():
    b = wsidebar(7, ASIDE_NAV) + text(300, 80, "Outreach to 12 design leads", 26, INK, 800)
    b += box(300, 120, 860, 300, stroke=LIGHT, r=12, sw=2) + text(320, 150, "All 12 drafts", 15, INK, 700)
    for i in range(6):
        b += bar(320, 175 + i * 36, 500, 10, "#cfcfd8") + bar(1040, 175 + i * 36, 90, 10, "#e4e4ea")
    b += ring(296, 116, 868, 308, 12) + note(300, 490, "draft everything first, then review once", SP_P, 24) + note(300, 530, "…nothing sends until all 12 are done", "#8a8a93", 22)
    return wscreen(b, "Range 2: draft every message first, then review the whole batch")


def aside_3a_web():
    b = wsidebar(7, ASIDE_NAV) + text(300, 80, "Outreach to 12 design leads", 26, INK, 800)
    for i, s in enumerate(["✓ Read shortlist", "✓ Researched 8", "◌ Researching 4 more"]):
        b += text(300, 130 + i * 28, s, 14, "#2c5fd6" if i == 2 else INK, 600)
    b += box(720, 110, 440, 360, stroke=LIGHT, r=14, sw=2) + text(740, 142, "Review lane", 15, INK, 700) + wtag(1140, 142, "4 ready", 2)
    for i in range(4):
        b += box(740, 162 + i * 58, 400, 48, stroke=LIGHT, r=8, sw=2) + f'<circle cx="764" cy="{186+i*58}" r="12" fill="#e7e5df"/>' + bar(786, 180 + i * 58, 160, 9, "#cfcfd8") + text(1126, 191 + i * 58, "Skip", 12, MID, 600, "end")
    b += f'<rect x="740" y="410" width="110" height="38" rx="8" fill="{INK}"/>' + text(795, 434, "Send 4", 13, "#fff", 700, "middle")
    b += ring(716, 106, 448, 368, 14) + note(300, 300, "sends collect in a lane;", SP_P, 24) + note(300, 332, "the agent keeps working", SP_P, 24)
    return wscreen(b, "Range 3, lane: ready sends collect for review while research continues")


def aside_3b_web():
    b = wsidebar(5, ASIDE_NAV) + text(300, 80, "Outreach to 12 design leads", 26, INK, 800)
    b += box(720, 110, 440, 300, stroke=LIGHT, r=14, sw=2) + text(740, 142, "Needs you", 15, INK, 700)
    b += f'<rect x="740" y="160" width="400" height="110" rx="10" fill="#fff3db"/>' + text(756, 190, "Site asked to confirm it's you", 14, "#9a5b00", 700) + text(756, 212, "Only Tom's message is paused", 13, "#5c3a00", 600)
    b += f'<rect x="756" y="226" width="150" height="32" rx="7" fill="{INK}"/>' + text(831, 247, "Take over tab", 12, "#fff", 700, "middle")
    for i in range(3):
        b += text(740, 310 + i * 26, "✓ Sent", 13, SP_OK, 700) + bar(800, 302 + i * 26, 140, 9)
    b += ring(736, 156, 408, 118, 10) + note(300, 300, "blocked, not stopped:", SP_P, 24) + note(300, 332, "one item waits, the rest continue", SP_P, 24)
    return wscreen(b, "Range 3, blocked: a sign-in check pauses one send, not the task")


ASIDE_SCREENS = {"aside-1-screen": aside_1_web, "aside-2-screen": aside_2_web, "aside-3-lane-screen": aside_3a_web, "aside-3-blocked-screen": aside_3b_web}


# ---------------- BOLTO payroll web screens (1280 x 800) ----------------
BOLTO_NAV = ("Home", "Hiring", "People", "Payroll", "Time off", "Benefits", "Documents", "Settings")


def bolto_1_web():
    b = wsidebar(3, BOLTO_NAV) + text(300, 80, "November payroll", 26, INK, 800)
    b += box(300, 120, 860, 330, stroke=LIGHT, r=10, sw=2)
    for i in range(8):
        b += bar(320, 145 + i * 36, 180, 10, "#cfcfd8") + bar(900, 145 + i * 36, 100, 10) + bar(1040, 145 + i * 36, 90, 10)
    b += f'<rect x="980" y="470" width="180" height="40" rx="8" fill="#2f5bea"/>' + text(1070, 495, "Submit payroll", 13, "#fff", 700, "middle")
    b += note(300, 560, "a table of 42 rows to eyeball", SP_P, 24) + note(300, 600, "…errors hide in the rows", "#8a8a93", 22)
    return wscreen(b, "Range 1: today's pattern, a full table to check before submitting")


def bolto_2_web():
    b = wsidebar(3, BOLTO_NAV) + text(300, 80, "November payroll", 26, INK, 800)
    b += f'<rect x="300" y="110" width="860" height="56" rx="10" fill="#fef2f2"/>' + text(320, 144, "3 warnings found · see rows marked ⚠", 14, "#b91c1c", 700)
    b += box(300, 180, 860, 260, stroke=LIGHT, r=10, sw=2)
    for i in range(6):
        b += bar(320, 205 + i * 36, 180, 10, "#cfcfd8") + (text(880, 214 + i * 36, "⚠", 14, "#b91c1c", 700) if i in (1, 4) else "") + bar(1040, 205 + i * 36, 90, 10)
    b += ring(296, 106, 868, 64, 10) + note(300, 520, "flag rows with warnings", SP_P, 24) + note(300, 560, "…but no 'why' or one-click fix", "#8a8a93", 22)
    return wscreen(b, "Range 2: warnings banner and flagged rows in the table")


def bolto_3a_web():
    b = wsidebar(3, BOLTO_NAV) + text(300, 80, "November payroll", 26, INK, 800) + text(300, 106, "Submit by Wed 25 Nov for on-time pay", 13, MID, 600)
    b += text(300, 146, "Since last payroll: +2 hires · 1 leaving · 1 raise", 14, INK, 600)
    for i, (t, ok) in enumerate([("No bank account · Leah", 0), ("Pay up 40% · Diego", 2), ("Full month for leaver · Sam", 0)]):
        y = 170 + i * 76
        b += box(300, y, 580, 64, stroke="#fecaca" if ok == 0 else LIGHT, r=10, sw=2) + wtag(380, y + 36, "Must fix" if ok == 0 else "Check", 0 if ok == 0 else 2) + text(400, y + 38, t, 14, INK, 600) + box(760, y + 16, 104, 32, stroke=LIGHT, r=7, sw=2) + text(812, y + 37, "Fix", 12, INK, 700, "middle")
    b += box(910, 140, 250, 230, stroke=LIGHT, r=12, sw=2) + text(930, 172, "$150,870", 24, INK, 800) + bar(930, 196, 200, 8) + bar(930, 214, 180, 8)
    b += f'<rect x="930" y="300" width="210" height="40" rx="8" fill="#e5e7eb"/>' + text(1035, 325, "Fix 2 to submit", 13, MID, 700, "middle")
    b += ring(296, 166, 588, 232, 12) + note(300, 470, "only what changed, with why and a fix", SP_P, 24)
    return wscreen(b, "Range 3, preflight: changes since last run, issues with reasons and fixes")


def bolto_3b_web():
    b = wsidebar(3, BOLTO_NAV) + text(300, 80, "November payroll", 26, INK, 800) + wtag(1140, 80, "Submitted", 1)
    for i, t in enumerate(["Submitted · today", "$148,320 debited · Thu", "Contractors paid in MXN/PLN · Fri", "Employees paid · Mon 30 Nov", "Leah paid when she adds a bank"]):
        y = 140 + i * 60
        b += f'<circle cx="310" cy="{y}" r="8" fill="{"#047857" if i == 0 else "#fff"}" stroke="#9ca3af" stroke-width="2"/>' + text(330, y + 5, t, 15, INK, 600)
    b += f'<line x1="310" y1="148" x2="310" y2="372" stroke="#e5e7eb" stroke-width="2"/>'
    b += ring(296, 120, 520, 280, 12) + note(300, 470, "what happens next, and until when you can cancel", SP_P, 24)
    return wscreen(b, "Range 3, next: a timeline of debit, payouts and payslips after submitting")


BOLTO_SCREENS = {"bolto-1-screen": bolto_1_web, "bolto-2-screen": bolto_2_web, "bolto-3-preflight-screen": bolto_3a_web, "bolto-3-next-screen": bolto_3b_web}

if __name__ == "__main__":
    for name, fn in {**ASIDE_SCREENS, **BOLTO_SCREENS}.items():
        (OUT / f"{name}.svg").write_text(fn(), encoding="utf-8")
        print("wrote", name)


# ---------------- RIPPLING global payroll web screens ----------------
RIP_NAV = ("Home", "People", "Payroll", "Global payroll", "Time", "Spend", "IT", "Reports")


def rip_1_web():
    b = wsidebar(3, RIP_NAV) + text(300, 80, "Global payroll", 26, INK, 800)
    for i, c in enumerate(["US", "GB", "BR", "IN", "DE"]):
        y = 120 + i * 60
        b += box(300, y, 860, 50, stroke=LIGHT, r=8, sw=2) + text(320, y + 31, c, 15, INK, 700) + bar(400, y + 21, 200, 9) + wtag(1140, y + 30, "Draft", 2)
    b += note(300, 470, "a list of pay runs per country", SP_P, 24) + note(300, 508, "…deadlines live inside each one", "#8a8a93", 22)
    return wscreen(b, "Range 1: today's pattern, a list of pay runs, one per country")


def rip_2_web():
    b = wsidebar(3, RIP_NAV) + text(300, 80, "Global payroll", 26, INK, 800)
    b += f'<rect x="300" y="110" width="860" height="56" rx="8" fill="#fff4dc"/>' + text(320, 144, "2 pay runs need approval this week", 15, "#9a5b00", 700)
    for i in range(4):
        y = 186 + i * 56
        b += box(300, y, 860, 46, stroke=LIGHT, r=8, sw=2) + bar(320, y + 19, 220, 9) + text(1140, y + 28, "Approve by …", 12, MID, 600, "end")
    b += ring(296, 106, 868, 64, 10) + note(300, 470, "a banner of what's due", SP_P, 24) + note(300, 508, "…but no 'why' when a date moves", "#8a8a93", 22)
    return wscreen(b, "Range 2: a due-this-week banner over the pay run list")


def rip_3a_web():
    b = wsidebar(3, RIP_NAV) + text(300, 80, "November pay runs", 26, INK, 800)
    for i in range(10):
        b += text(380 + i * 54, 130, ["16", "17", "18", "19", "20", "23", "24", "25", "26", "27"][i], 12, "#a3283a" if i == 4 else MID, 600, "middle")
    for i, (c, a, p) in enumerate([("US", 7, 9), ("GB", 5, 9), ("BR", 2, 6), ("IN", 7, 9)]):
        y = 160 + i * 52
        b += text(310, y + 6, c, 14, INK, 700) + f'<line x1="{380+a*54}" y1="{y}" x2="{380+p*54}" y2="{y}" stroke="#d9c7d2" stroke-width="3"/>'
        b += f'<rect x="{356+a*54}" y="{y-12}" width="50" height="22" rx="5" fill="{"#f8b51b" if c in ("GB","BR") else "#4a1f3a"}"/>' + box(356 + p * 54, y - 12, 50, 22, stroke="#6b2d54", r=5, sw=2)
    b += ring(296, 110, 600, 250, 12) + note(300, 430, "every country on one calendar:", SP_P, 24) + note(300, 462, "approve-by and payday side by side", SP_P, 24)
    return wscreen(b, "Range 3, calendar: approve-by and payday for every country on one timeline")


def rip_3b_web():
    b = wsidebar(3, RIP_NAV) + text(300, 80, "November pay runs", 26, INK, 800)
    b += box(900, 110, 260, 280, stroke=LIGHT, r=12, sw=2) + text(916, 140, "Why Brazil moved", 15, INK, 700)
    b += bar(916, 160, 220, 8) + bar(916, 176, 200, 8) + f'<rect x="916" y="200" width="228" height="34" rx="6" fill="#fdeeee"/>' + text(928, 222, "20 Nov national holiday", 12, "#a3283a", 700)
    for i, t in enumerate(["Wed 18 approve", "Thu 19 debit", "Tue 24 paid"]):
        b += text(916, 262 + i * 24, t, 13, INK, 600)
    b += box(300, 110, 560, 280, stroke=LIGHT, r=12, sw=2) + text(320, 140, "Funding plan", 15, INK, 700)
    for i, (c, ok) in enumerate([("USD", 1), ("GBP", 1), ("BRL", 0), ("INR", 1)]):
        b += text(320, 180 + i * 44, c, 14, INK, 700) + bar(400, 172 + i * 44, 200, 9) + wtag(840, 180 + i * 44, "Covered" if ok else "Short", 1 if ok else 0)
    b += ring(896, 106, 268, 288, 12) + note(300, 450, "explain moved dates; plan funding per currency", SP_P, 24)
    return wscreen(b, "Range 3, detail: why a deadline moved, and funding per currency")


RIP_SCREENS = {"rippling-1-screen": rip_1_web, "rippling-2-screen": rip_2_web, "rippling-3-calendar-screen": rip_3a_web, "rippling-3-detail-screen": rip_3b_web}

if __name__ == "__main__":
    for name, fn in RIP_SCREENS.items():
        (OUT / f"{name}.svg").write_text(fn(), encoding="utf-8")
        print("wrote", name)


# ---------------- VERA (phone) ----------------
VN = "#13294b"


def vera_head(q="CAP, healthy adult: antibiotic?"):
    return f'<rect x="16" y="110" width="{SW-32}" height="56" rx="14" fill="#eef2f6"/>' + text(32, 144, q, 15, INK, 700)


def vera_1():
    b = vera_head() + text(24, 200, "Answer", 14, VN, 800)
    for i in range(6):
        b += bar(24, 220 + i * 22, SW - 80 - (i % 3) * 40, 9)
    b += text(24, 380, "Sources [1] [2] [3]", 13, MID, 700) + ring(18, 364, 180, 24, 6)
    b += note(24, 470, "citations at the end", SP_P, 20) + note(24, 500, "…which line came from where?", "#8a8a93", 18)
    return screen(b, "Range 1: answer with a list of sources at the end")


def vera_2():
    b = vera_head() + text(24, 200, "Answer", 14, VN, 800)
    for i in range(3):
        y = 220 + i * 70
        b += bar(24, y, SW - 60, 9) + bar(24, y + 18, SW - 120, 9) + text(24, y + 44, f"[{i+1}]", 12, VN, 700) + wtag(110, y + 44, "Moderate", 2)
    b += note(24, 470, "inline citation + evidence grade", SP_P, 20) + note(24, 500, "…still can't see the passage", "#8a8a93", 18)
    return screen(b, "Range 2: inline citations and evidence grade per sentence")


def vera_3a():
    b = vera_head() + text(24, 200, "Answer · 3 claims", 14, VN, 800)
    for i, ok in enumerate([1, 1, 0]):
        y = 220 + i * 80
        b += box(16, y, SW - 32, 68, stroke="#bfe3e1" if i == 2 else LIGHT, r=12, sw=2) + bar(30, y + 16, SW - 90, 9) + bar(30, y + 32, SW - 140, 9)
        b += text(30, y + 56, "✓ Supported" if ok else "◐ Partly supported", 12, "#0f8b8d" if ok else "#9a5b00", 700)
    b += f'<rect x="0" y="500" width="{SW}" height="300" rx="22" fill="#fff" stroke="{LIGHT}" stroke-width="2"/>' + text(24, 540, "[3] ATS/IDSA 2019", 14, VN, 800)
    b += f'<rect x="24" y="556" width="{SW-48}" height="90" rx="8" fill="#f7fafb"/>' + f'<rect x="36" y="590" width="{SW-90}" height="16" fill="#fff1b8"/>'
    b += f'<rect x="24" y="660" width="{SW-48}" height="40" rx="8" fill="#fff4dc"/>' + text(36, 685, "Why partly: tied to clinical stability", 12, "#9a5b00", 700)
    b += ring(18, 550, SW - 36, 100, 10)
    return screen(b, "Range 3, claim: tap a claim to see the exact passage that supports it")


def vera_3b():
    b = vera_head() + text(24, 200, "Answer · 3 claims", 14, VN, 800)
    for i in range(3):
        b += box(16, 220 + i * 70, SW - 32, 60, stroke=LIGHT, r=12, sw=2) + bar(30, 240 + i * 70, SW - 90, 9)
    b += f'<rect x="16" y="440" width="{SW-32}" height="130" rx="12" fill="#fff4dc" stroke="#f1d29b" stroke-width="2"/>' + text(32, 470, "Your hospital protocol differs", 14, "#4a3300", 800)
    b += bar(32, 490, SW - 90, 9, "#e8cf9a") + bar(32, 508, SW - 140, 9, "#e8cf9a") + box(32, 526, 130, 32, stroke="#4a3300", r=8, sw=2) + text(97, 547, "Open page 12", 12, "#4a3300", 700, "middle")
    b += ring(12, 436, SW - 24, 138, 14) + note(24, 640, "local protocol, opened at the page", SP_P, 20)
    return screen(b, "Range 3, local: flag where your protocol differs, open at the exact page")


VERA_SCREENS = {"vera-1": vera_1, "vera-2": vera_2, "vera-3-claim": vera_3a, "vera-3-local": vera_3b}


# ---------------- VOICEOPS web ----------------
VO_NAV = ("Today", "Coaching", "Team", "Calls", "Playbook", "Settings", "", "")


def vo_1_web():
    b = wsidebar(1, VO_NAV) + text(300, 80, "Team dashboard", 26, INK, 800)
    for i in range(3):
        b += box(300 + i * 290, 110, 270, 110, stroke=LIGHT, r=10, sw=2) + bar(316 + i * 290, 140, 120, 9) + text(316 + i * 290, 190, ["72%", "4.1", "-8%"][i], 26, INK, 800)
    b += box(300, 240, 860, 200, stroke=LIGHT, r=10, sw=2) + note(320, 300, "scores per rep", MID, 18)
    b += note(300, 520, "dashboards of scores", SP_P, 24) + note(300, 556, "…the manager still has to decide what to coach", "#8a8a93", 22)
    return wscreen(b, "Range 1: scorecards and dashboards; the manager works out what to coach")


def vo_2_web():
    b = wsidebar(1, VO_NAV) + text(300, 80, "Coaching", 26, INK, 800)
    for i in range(5):
        y = 110 + i * 70
        b += box(300, y, 860, 60, stroke=LIGHT, r=10, sw=2) + text(320, y + 26, f"Rep {i+1}", 14, INK, 700) + bar(320, y + 38, 500, 9) + wtag(1140, y + 32, "Sent", 1)
    b += note(300, 520, "AI sends every note automatically", SP_P, 24) + note(300, 556, "…no say on what reaches reps", "#8a8a93", 22)
    return wscreen(b, "Range 2: every AI-drafted note goes straight to reps")


def vo_3a_web():
    b = wsidebar(1, VO_NAV) + text(300, 80, "Today's coaching", 26, INK, 800)
    for i, (c, t) in enumerate([("#e5f2ee", "High"), ("#fff3d9", "Medium")]):
        y = 120 + i * 120
        b += box(300, y, 540, 104, stroke=LIGHT, r=12, sw=2) + text(316, y + 28, ["Maria · Price objections", "Aisha · Compliance"][i], 14, INK, 700) + bar(316, y + 48, 460, 9) + bar(316, y + 66, 380, 9)
        b += f'<rect x="316" y="{y+78}" width="60" height="22" rx="6" fill="#1f6f5c"/>' + box(386, y + 78, 110, 22, stroke=LIGHT, r=6, sw=2)
    b += box(870, 120, 290, 220, stroke=LIGHT, r=12, sw=2) + text(886, 150, "The moment · 2:14pm", 14, INK, 700)
    for i in range(30):
        h = 10 + (i * 37) % 30
        b += f'<rect x="{886+i*8}" y="{190-h/2}" width="5" height="{h}" rx="2" fill="{"#1f6f5c" if 12 < i < 19 else "#cfdcd8"}"/>'
    b += bar(886, 230, 240, 9) + bar(886, 248, 200, 9) + ring(296, 116, 548, 112, 12)
    b += note(300, 420, "review only what needs you,", SP_P, 24) + note(300, 452, "with the call moment as evidence", SP_P, 24)
    return wscreen(b, "Range 3, review: low-confidence or sensitive notes, with the call moment")


def vo_3b_web():
    b = wsidebar(1, VO_NAV) + text(300, 80, "What Voiceops can send without you", 24, INK, 800)
    for i, (t, s) in enumerate([("Praise", 1), ("Skill notes, high", 1), ("Skill notes, medium", 2), ("Compliance", 0)]):
        y = 130 + i * 56
        b += text(300, y + 28, t, 15, INK, 700) + text(640, y + 28, ["96%", "91%", "68%", "—"][i], 15, MID, 700) + wtag(1000, y + 28, ["Automatic", "Automatic", "Review first", "Always reviewed"][i], s)
    b += ring(296, 120, 868, 230, 12) + note(300, 420, "trust earned per note type,", SP_P, 24) + note(300, 452, "from what the manager approved", SP_P, 24)
    return wscreen(b, "Range 3, trust: auto-send unlocks per note type from approval history")


VO_SCREENS = {"voiceops-1-screen": vo_1_web, "voiceops-2-screen": vo_2_web, "voiceops-3-review-screen": vo_3a_web, "voiceops-3-trust-screen": vo_3b_web}


# ---------------- CMUX web (desktop app) ----------------
CM_NAV = ("api · fix-refunds", "web · checkout", "infra · node22", "docs · readme", "", "", "", "")


def cm_1_web():
    b = wsidebar(0, CM_NAV) + f'<rect x="290" y="40" width="880" height="720" fill="#0f1116"/>'
    b += f'<rect x="290" y="40" width="880" height="360" fill="none" stroke="#3b82f6" stroke-width="4"/>' + text(310, 80, "? Allow npm run db:migrate [y/n]", 15, "#cfd2db", 600)
    b += note(310, 470, "a blue ring on the pane", "#8ab4ff", 24) + note(310, 506, "…you hunt for which pane and why", "#8a8a93", 22)
    return wscreen(b, "Range 1: today, a ring on the pane and tab that needs input")


def cm_2_web():
    b = wsidebar(0, CM_NAV) + f'<rect x="290" y="40" width="580" height="720" fill="#0f1116"/>'
    b += box(890, 60, 270, 300, stroke=LIGHT, r=10, sw=2) + text(906, 90, "Notifications", 14, INK, 700)
    for i in range(3):
        b += bar(906, 116 + i * 40, 220, 9) + bar(906, 130 + i * 40, 160, 7, "#e4e4ea")
    b += note(310, 470, "a list of notifications", SP_P, 24) + note(310, 506, "…jump to each pane to answer", "#8a8a93", 22)
    return wscreen(b, "Range 2: a notification list; each one jumps to its pane")


def cm_3a_web():
    b = wsidebar(0, CM_NAV) + f'<rect x="290" y="40" width="560" height="720" fill="#0f1116"/>'
    b += text(870, 80, "Needs you · 3 waiting", 15, INK, 700)
    for i, (k, c) in enumerate([("Needs permission", "#3b82f6"), ("Asked you", "#f5b041"), ("Tests failed", "#f2555a")]):
        y = 100 + i * 130
        b += box(870, y, 290, 118, stroke=LIGHT, r=10, sw=2) + text(886, y + 26, k, 12, c, 700) + bar(886, y + 42, 220, 9) + bar(886, y + 60, 180, 8, "#e4e4ea")
        b += f'<rect x="886" y="{y+80}" width="96" height="26" rx="6" fill="#3b82f6"/>' + box(990, y + 80, 80, 26, stroke=LIGHT, r=6, sw=2)
    b += ring(866, 96, 298, 126, 12) + note(310, 470, "why each agent is waiting,", "#8ab4ff", 24) + note(310, 506, "answered right in the queue", "#8ab4ff", 24)
    return wscreen(b, "Range 3, queue: who needs you, why, and a one-click answer")


def cm_3b_web():
    b = wsidebar(0, CM_NAV) + f'<rect x="290" y="40" width="560" height="720" fill="#0f1116"/>'
    b += text(870, 80, "All clear", 15, INK, 700) + f'<rect x="870" y="100" width="290" height="80" rx="10" fill="#e8f7ef"/>' + text(886, 132, "✓ No agent is waiting", 14, "#1f7a4c", 700) + text(886, 156, "3 resolved in 2 min", 12, MID, 600)
    b += text(310, 100, "✓ migration applied · running tests", 14, "#cfd2db", 600) + text(310, 130, "✓ renamed label · running vitest", 14, "#cfd2db", 600)
    b += ring(866, 96, 298, 88, 12) + note(310, 470, "agents keep going; you stay in flow", "#8ab4ff", 24)
    return wscreen(b, "Range 3, clear: queue empties as agents continue")


CM_SCREENS = {"cmux-1-screen": cm_1_web, "cmux-2-screen": cm_2_web, "cmux-3-queue-screen": cm_3a_web, "cmux-3-clear-screen": cm_3b_web}

if __name__ == "__main__":
    for name, fn in {**VERA_SCREENS, **VO_SCREENS, **CM_SCREENS}.items():
        (OUT / f"{name}.svg").write_text(fn(), encoding="utf-8")
        print("wrote", name)
