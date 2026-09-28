"""Extract the official Ram Studio logo assets from the brand guideline PDF as clean
vector SVGs, and inline them into an invoice HTML file.

Only the paths and outlined glyphs that sit inside each asset's bounding box are
kept, with their original colours and geometry (no redraw, no recolour).

    python3 build_logo_assets.py <brand-guideline.pdf> <invoice.html>
"""
import re
import sys

import pymupdf as fitz

# Brand Guideline p.2 (white-on-navy). Boxes are in PDF units.
PAGE = 1
ASSETS = {
    "LOGO_WHITE":  ("Ram Studio LLC",                  fitz.Rect(187.0, 457.3, 845.4, 577.7)),
    "ICON_WHITE":  ("Ram Studio icon",                 fitz.Rect(1160.1, 219.2, 1280.5, 339.6)),
    "BADGE_WHITE": ("Ram Studio LLC, established 2021", fitz.Rect(1172.2, 563.8, 1268.0, 659.5)),
}


def num(v):
    return f"{v:.2f}".rstrip("0").rstrip(".")


def hexcol(rgb):
    return "#" + "".join(f"{round(c * 255):02x}" for c in rgb)


def path_d(drawing, ox, oy):
    out, cur = [], None

    def pt(p):
        return f"{num(p.x - ox)} {num(p.y - oy)}"

    def move_if_needed(p):
        if cur is None or abs(cur.x - p.x) > 0.01 or abs(cur.y - p.y) > 0.01:
            out.append("M" + pt(p))

    for item in drawing["items"]:
        op = item[0]
        if op == "l":
            move_if_needed(item[1])
            out.append("L" + pt(item[2]))
            cur = item[2]
        elif op == "c":
            move_if_needed(item[1])
            out.append("C" + " ".join(pt(p) for p in item[2:5]))
            cur = item[4]
        elif op == "re":
            r = item[1]
            out.append(f"M{num(r.x0 - ox)} {num(r.y0 - oy)}H{num(r.x1 - ox)}V{num(r.y1 - oy)}H{num(r.x0 - ox)}Z")
            cur = None
        elif op == "qu":
            q = item[1]
            out.append("M" + pt(q.ul) + "L" + pt(q.ur) + "L" + pt(q.lr) + "L" + pt(q.ll) + "Z")
            cur = None
    if drawing.get("closePath"):
        out.append("Z")
    return "".join(out)


def build(page, key, label, box):
    ox, oy = box.x0, box.y0
    body, defs = [], {}

    for d in page.get_drawings():
        if not box.contains(d["rect"]):
            continue
        attrs = [f'd="{path_d(d, ox, oy)}"']
        if d.get("fill") is not None:
            attrs.append(f'fill="{hexcol(d["fill"])}"')
            if d.get("even_odd"):
                attrs.append('fill-rule="evenodd"')
        else:
            attrs.append('fill="none"')
        if d.get("color") is not None and d["type"] in ("s", "fs"):
            attrs.append(f'stroke="{hexcol(d["color"])}" stroke-width="{num(d.get("width") or 1)}"')
        body.append(f"<path {' '.join(attrs)}/>")

    # Outlined text (the badge lettering): keep glyph <use>s whose origin is inside the box.
    svg_full = page.get_svg_image(text_as_path=True)
    glyphs = dict(re.findall(r'<path id="(font_[^"]+)" d="([^"]*)"', svg_full))
    for gid, m, fill in re.findall(
        r'<use data-text="[^"]*" xlink:href="#(font_[^"]+)" transform="matrix\(([^)]+)\)" fill="(#[0-9a-fA-F]+)"/>',
        svg_full,
    ):
        a, b, c, dd, e, f = (float(v) for v in m.split(","))
        if not box.contains(fitz.Point(e, f)) or not glyphs.get(gid):
            continue  # outside the asset, or a blank glyph (space)
        local = f"{key.lower()}-{gid}"
        defs[local] = glyphs[gid]
        body.append(
            f'<use href="#{local}" transform="matrix({num(a)},{num(b)},{num(c)},{num(dd)},{num(e - ox)},{num(f - oy)})" fill="{fill}"/>'
        )

    defs_xml = "".join(f'<path id="{k}" d="{v}"/>' for k, v in defs.items())
    return (
        f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {num(box.width)} {num(box.height)}" '
        f'role="img" aria-label="{label}">'
        + (f"<defs>{defs_xml}</defs>" if defs_xml else "")
        + "".join(body)
        + "</svg>"
    )


def main(pdf_path, html_path):
    page = fitz.open(pdf_path)[PAGE]
    html = open(html_path, encoding="utf-8").read()
    for key, (label, box) in ASSETS.items():
        svg = build(page, key, label, box)
        pattern = re.compile(rf"<!--{key}-->.*?<!--/{key}-->", re.S)
        if not pattern.search(html):
            sys.exit(f"marker <!--{key}--> not found in {html_path}")
        html = pattern.sub(lambda _: f"<!--{key}-->{svg}<!--/{key}-->", html)
        print(f"{key}: {len(svg):,} bytes")
    open(html_path, "w", encoding="utf-8").write(html)


if __name__ == "__main__":
    main(*sys.argv[1:3])
