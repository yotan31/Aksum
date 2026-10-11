"""
Erzeugt die Produktbilder (Verpackung + Schüssel) im Aksum-Stil.
Aufruf:  python3 tools/verpackung.py   ->  schreibt SVG-Dateien nach tools/out/
Die SVGs werden danach im Browser in JPG umgewandelt (images/<name>.jpg).
"""
import math, os, random, re

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
logo = open(os.path.join(ROOT, "images", "logo-kranz.svg")).read()
paths = "\n".join(re.findall(r'<path[^>]*/>', logo))
W, H = 1200, 900
x0, x1, y0, y1 = 330, 800, 40, 812
cx = (x0 + x1) / 2


def shade(hexcol, f):
    r, g, b = (int(hexcol[i:i + 2], 16) for i in (1, 3, 5))
    return "#%02x%02x%02x" % tuple(min(255, int(v * f)) for v in (r, g, b))


def wreath(x, y, size, fill):
    return f'<g transform="translate({x},{y}) scale({size/200})" fill="{fill}">{paths}</g>'


pouch = f"M{x0+10},{y0} H{x1-10} Q{x1},{y0} {x1},{y0+10} V{y1-26} Q{x1-4},{y1} {x1-30},{y1} H{x0+30} Q{x0+4},{y1} {x0},{y1-26} V{y0+10} Q{x0},{y0} {x0+10},{y0} Z"

tilet = []
_cols = ["#1f6b45", "#c9a03c", "#a8361b", "#c9a03c", "#2b5f8a", "#c9a03c"]
_wid = [16, 4, 16, 4, 16, 4]
_x, _i = x0, 0
while _x < x1:
    tilet.append(f'<rect x="{_x}" y="652" width="{_wid[_i % 6]}" height="18" fill="{_cols[_i % 6]}"/>')
    _x += _wid[_i % 6]; _i += 1

HEAP = "M658,774 C705,762 742,724 790,694 C828,670 856,656 876,656 C905,658 934,674 972,703 C1010,732 1040,760 1078,774 C998,794 736,794 658,774 Z"


def heap_top(x):
    t = max(0.0, 1 - ((x - 868) / 212) ** 2)
    return 776 - 118 * t ** 1.3


def scatter(n, seed):
    """Punkte innerhalb des Haufens, von hinten nach vorne sortiert."""
    rnd = random.Random(seed)
    pts = []
    while len(pts) < n:
        x = rnd.uniform(668, 1068)
        top = heap_top(x)
        y = top + 2 + (782 - top) * rnd.random() ** 1.6
        pts.append((x, y, rnd.uniform(0, 180), rnd.uniform(0.85, 1.15)))
    return sorted(pts, key=lambda p: p[1])


def contents(p):
    kind = p.get("kind", "powder")
    if kind == "powder":
        out = [f'<path d="{HEAP}" fill="url(#spice)"/>',
               f'<path d="{HEAP}" fill="#fff" filter="url(#grain)"/>',
               f'<path d="{HEAP}" fill="#fff" filter="url(#grain2)"/>',
               f'<path d="M810,684 C838,666 862,659 884,661" stroke="{p["fill"][0]}" stroke-width="5" opacity="0.5" fill="none" stroke-linecap="round"/>']
        return "\n".join(out)
    out = [f'<path d="{HEAP}" fill="{p["fill"][2]}" opacity="0.9"/>']
    for x, y, a, s in scatter(p.get("count", 170), p["id"]):
        if kind == "beans":
            out.append(f'<g transform="translate({x:.1f},{y:.1f}) rotate({a:.0f}) scale({s:.2f})">'
                       f'<ellipse rx="14" ry="10" fill="url(#spice)" stroke="{p["fill"][2]}" stroke-width="1"/>'
                       f'<path d="M-10,0 C-4,-3 4,3 10,0" stroke="{p["fill"][2]}" stroke-width="2" fill="none"/></g>')
        elif kind == "resin":
            rnd = random.Random(int(x * 7 + y))
            pts = []
            for k in range(7):
                ang = k / 7 * 2 * math.pi
                r = rnd.uniform(7, 13) * s
                pts.append(f"{x + r*math.cos(ang):.1f},{y + r*math.sin(ang)*0.8:.1f}")
            out.append(f'<polygon points="{" ".join(pts)}" fill="url(#spice)" stroke="{p["fill"][2]}" stroke-width="0.8" opacity="0.96"/>'
                       f'<circle cx="{x-3:.1f}" cy="{y-3:.1f}" r="{2.2*s:.1f}" fill="#fff" opacity="0.45"/>')
        elif kind == "pods":
            out.append(f'<g transform="translate({x:.1f},{y:.1f}) rotate({a:.0f}) scale({s:.2f})">'
                       f'<ellipse rx="13" ry="8" fill="url(#spice)" stroke="{p["fill"][2]}" stroke-width="1"/>'
                       f'<path d="M-11,-2 Q0,-6 11,-2 M-11,2 Q0,6 11,2" stroke="{p["fill"][2]}" stroke-width="1.2" fill="none"/></g>')
    return "\n".join(out)


def make(p):
    c = p["color"]
    return f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W} {H}" width="{W}" height="{H}">
<defs>
  <radialGradient id="bg" cx="0.45" cy="0.35" r="0.9"><stop offset="0" stop-color="#f7f3ec"/><stop offset="1" stop-color="#ddd5c9"/></radialGradient>
  <linearGradient id="body" x1="0" y1="0" x2="1" y2="0">
    <stop offset="0" stop-color="{shade(c,0.35)}"/><stop offset="0.08" stop-color="{shade(c,0.8)}"/>
    <stop offset="0.45" stop-color="{c}"/><stop offset="0.8" stop-color="{shade(c,0.7)}"/><stop offset="1" stop-color="{shade(c,0.3)}"/>
  </linearGradient>
  <linearGradient id="vshade" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stop-color="#000" stop-opacity="0.25"/><stop offset="0.18" stop-color="#000" stop-opacity="0"/>
    <stop offset="0.85" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity="0.35"/>
  </linearGradient>
  <linearGradient id="gold" x1="0" y1="0" x2="1" y2="1">
    <stop offset="0" stop-color="#f7e3a1"/><stop offset="0.35" stop-color="#d6a943"/>
    <stop offset="0.6" stop-color="#f2d27a"/><stop offset="1" stop-color="#a57a24"/>
  </linearGradient>
  <linearGradient id="goldW" gradientUnits="userSpaceOnUse" x1="20" y1="10" x2="180" y2="200">
    <stop offset="0" stop-color="#f7e3a1"/><stop offset="0.4" stop-color="#d6a943"/>
    <stop offset="0.65" stop-color="#f4d785"/><stop offset="1" stop-color="#9c7220"/>
  </linearGradient>
  <filter id="matte" x="0" y="0" width="100%" height="100%">
    <feTurbulence type="fractalNoise" baseFrequency="1.1" numOctaves="2" seed="3"/>
    <feColorMatrix values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 0.06 0"/>
    <feComposite in2="SourceGraphic" operator="in"/>
  </filter>
  <filter id="blur8"><feGaussianBlur stdDeviation="8"/></filter>
  <filter id="blur16" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="16"/></filter>
  <filter id="foil" x="-5%" y="-5%" width="110%" height="110%"><feDropShadow dx="0" dy="1" stdDeviation="0.6" flood-color="#000" flood-opacity="0.6"/></filter>
  <clipPath id="clip"><path d="{pouch}"/></clipPath>
  <radialGradient id="spice" cx="0.45" cy="0.2" r="0.9">
    <stop offset="0" stop-color="{p['fill'][0]}"/><stop offset="0.45" stop-color="{p['fill'][1]}"/><stop offset="1" stop-color="{p['fill'][2]}"/>
  </radialGradient>
  <filter id="grain" x="0" y="0" width="100%" height="100%">
    <feTurbulence type="fractalNoise" baseFrequency="1.8" numOctaves="2" seed="9"/>
    <feColorMatrix values="{p['dark']}  0 0 0 4 -2.0"/>
    <feComposite in2="SourceGraphic" operator="in"/>
  </filter>
  <filter id="grain2" x="0" y="0" width="100%" height="100%">
    <feTurbulence type="fractalNoise" baseFrequency="2.2" numOctaves="1" seed="21"/>
    <feColorMatrix values="{p['light']}  0 0 0 5 -3.3"/>
    <feComposite in2="SourceGraphic" operator="in"/>
  </filter>
  <linearGradient id="bowl" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fbf8f3"/><stop offset="1" stop-color="#cfc8be"/></linearGradient>
  <linearGradient id="bowlIn" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#d9d2c7"/><stop offset="1" stop-color="#efe9e0"/></linearGradient>
</defs>

<rect width="{W}" height="{H}" fill="url(#bg)"/>
<ellipse cx="{cx}" cy="{y1+6}" rx="250" ry="20" fill="#2a1a10" opacity="0.35" filter="url(#blur16)"/>

<!-- Beutel -->
<path d="{pouch}" fill="url(#body)"/>
<g clip-path="url(#clip)">
  <rect x="{x0}" y="{y0}" width="{x1-x0}" height="{y1-y0}" fill="url(#vshade)"/>
  <rect x="{x0}" y="{y0}" width="{x1-x0}" height="{y1-y0}" fill="#fff" filter="url(#matte)"/>
  <!-- weiche Lichtkante links, Schatten rechts -->
  <rect x="{x0+34}" y="{y0}" width="26" height="{y1-y0}" fill="#fff" opacity="0.07" filter="url(#blur8)"/>
  <rect x="{x1-70}" y="{y0}" width="40" height="{y1-y0}" fill="#000" opacity="0.25" filter="url(#blur8)"/>
  <!-- Siegelnaht mit feiner Riffelung -->
  <rect x="{x0}" y="{y0}" width="{x1-x0}" height="52" fill="#000" opacity="0.18"/>
  {''.join(f'<rect x="{x0}" y="{y0+6+k*5}" width="{x1-x0}" height="1" fill="#fff" opacity="0.05"/>' for k in range(9))}
  <rect x="{x0}" y="{y0+86}" width="{x1-x0}" height="6" fill="#000" opacity="0.35"/>
  <rect x="{x0}" y="{y0+92}" width="{x1-x0}" height="1.5" fill="#fff" opacity="0.08"/>
  <!-- Boden (Standfalte) -->
  <path d="M{x0},{y1-60} Q{cx},{y1-20} {x1},{y1-60}" stroke="#fff" stroke-width="1.5" opacity="0.08" fill="none"/>
  <!-- Tilet-Bordüre -->
  <g opacity="0.95">{''.join(tilet)}</g>
  <rect x="{x0}" y="649" width="{x1-x0}" height="1.5" fill="url(#gold)"/>
  <rect x="{x0}" y="671.5" width="{x1-x0}" height="1.5" fill="url(#gold)"/>
</g>

<!-- Gold-Prägung -->
<g filter="url(#foil)">
  <text x="{cx}" y="{y0+150}" text-anchor="middle" font-family="Fraunces, serif" font-size="26" font-weight="600" letter-spacing="9" fill="url(#gold)">AKSUM</text>
  <rect x="{cx-150}" y="{y0+141}" width="62" height="1.2" fill="url(#gold)"/>
  <rect x="{cx+88}" y="{y0+141}" width="62" height="1.2" fill="url(#gold)"/>
  {wreath(cx-100, y0+175, 200, "url(#goldW)")}
  <text x="{cx}" y="{y0+470}" text-anchor="middle" font-family="Fraunces, serif" font-size="78" font-weight="600" letter-spacing="2" fill="#f6efe2">{p['title']}</text>
  <text x="{cx}" y="{y0+516}" text-anchor="middle" font-family="Noto Sans Ethiopic, sans-serif" font-size="34" font-weight="700" fill="url(#gold)">{p['ti']}</text>
  <text x="{cx}" y="{y0+562}" text-anchor="middle" font-family="Inter, sans-serif" font-size="14" font-weight="500" letter-spacing="4" fill="#d9cbb3">{p['sub']}</text>
  <text x="{cx}" y="{y0+700}" text-anchor="middle" font-family="Inter, sans-serif" font-size="15" font-weight="600" letter-spacing="3" fill="url(#gold)">{p.get('weight', '')}</text>
</g>

<!-- Schüssel -->
<ellipse cx="868" cy="870" rx="240" ry="20" fill="#2a1a10" opacity="0.35" filter="url(#blur16)"/>
<path d="M628,772 Q640,862 868,870 Q1096,862 1108,772 Z" fill="url(#bowl)"/>
<ellipse cx="868" cy="772" rx="240" ry="34" fill="#f7f3ed"/>
<ellipse cx="868" cy="774" rx="226" ry="27" fill="url(#bowlIn)"/>
{contents(p)}
</svg>
'''


PRODUCTS = [
    dict(id="berbere", title="Berbere", ti="በርበረ", sub="ERITREISCHE GEWÜRZMISCHUNG", weight="250 g",
         color="#34261f", fill=("#d9441f", "#b52a16", "#6e150c"),
         dark="0 0 0 0 0.3  0 0 0 0 0.04  0 0 0 0 0.02", light="0 0 0 0 0.95  0 0 0 0 0.5  0 0 0 0 0.28"),
    dict(id="mitmita", title="Mitmita", ti="ሚጥሚጣ", sub="SCHARFE GEWÜRZMISCHUNG", weight="100 g",
         color="#5e1410", fill=("#f0682a", "#d9481c", "#9a2a10"),
         dark="0 0 0 0 0.45  0 0 0 0 0.12  0 0 0 0 0.04", light="0 0 0 0 1  0 0 0 0 0.75  0 0 0 0 0.45"),
    dict(id="shiro", title="Shiro", ti="ሽሮ", sub="GEWÜRZTES KICHERERBSENMEHL", weight="500 g",
         color="#6a480f", fill=("#e8b85a", "#cf9a3c", "#9c6d22"),
         dark="0 0 0 0 0.45  0 0 0 0 0.3  0 0 0 0 0.1", light="0 0 0 0 1  0 0 0 0 0.9  0 0 0 0 0.65"),
    dict(id="korerima", title="Korerima", ti="ኮረሪማ", sub="ÄTHIOPISCHER KARDAMOM", weight="50 g",
         color="#3d1c34", kind="pods", count=260, fill=("#7a4a32", "#5c3322", "#2e170e"),
         dark="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0", light="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0"),
    dict(id="rohkaffee", title="Rohkaffee", ti="ጥረ ቡን", sub="FÜR DIE KAFFEEZEREMONIE", weight="500 g",
         color="#1c1a19", kind="beans", count=280, fill=("#c5c79a", "#a3a878", "#6e7350"),
         dark="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0", light="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0"),
    dict(id="weihrauch", title="Weihrauch", ti="ዕጣን", sub="NATÜRLICHES HARZ", weight="100 g",
         color="#16304d", kind="resin", count=240, fill=("#f6dc8e", "#e2bb5c", "#a87c2c"),
         dark="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0", light="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0"),
    dict(id="teff", title="Teff", ti="ሓርጭ ጣፍ", sub="TEFF-MEHL",
         color="#173f2e", fill=("#b88a62", "#9a6e4a", "#6b4a30"),
         dark="0 0 0 0 0.3  0 0 0 0 0.2  0 0 0 0 0.12", light="0 0 0 0 0.95  0 0 0 0 0.85  0 0 0 0 0.72"),
    dict(id="maschella", title="Maschella", ti="ሓርጭ መሽላ", sub="SORGHUM-MEHL",
         color="#173f2e", fill=("#f3e6cf", "#e2d1b2", "#b9a582"),
         dark="0 0 0 0 0.55  0 0 0 0 0.45  0 0 0 0 0.32", light="0 0 0 0 1  0 0 0 0 1  0 0 0 0 0.95"),
]

if __name__ == "__main__":
    out = os.path.join(ROOT, "tools", "out")
    os.makedirs(out, exist_ok=True)
    for p in PRODUCTS:
        open(os.path.join(out, p["id"] + ".svg"), "w").write(make(p))
        print("geschrieben:", p["id"])
