#!/usr/bin/env python3
"""Export on-image text fields to a flat CSV for Canva Bulk Create / Figma data plugins.

Usage: python3 tools/export_image_fields.py
Writes: 06-production/image-fields.csv (one row per image post, one column per text box)
"""
import csv
from pathlib import Path

import yaml

ROOT = Path(__file__).resolve().parent.parent
MAX_BODY = 8

rows = []
for f in sorted((ROOT / "data").glob("posts-*.yaml")):
    for p in yaml.safe_load(f.read_text()) or []:
        if p["type"] != "image":
            continue
        d = p["design"]
        r = {"id": p["id"], "format": p["format"], "series": p["series"],
             "headline": d.get("headline", ""), "subhead": d.get("subhead", ""), "footer": d.get("footer", "")}
        body = d.get("body", [])
        for i in range(MAX_BODY):
            r[f"body_{i+1}"] = body[i] if i < len(body) else ""
        r["layout_notes"] = d.get("layout", "")
        rows.append(r)

rows.sort(key=lambda r: r["id"])
cols = ["id", "format", "series", "headline", "subhead"] + [f"body_{i+1}" for i in range(MAX_BODY)] + ["footer", "layout_notes"]
out = ROOT / "06-production" / "image-fields.csv"
with open(out, "w", newline="", encoding="utf-8") as fh:
    w = csv.DictWriter(fh, fieldnames=cols)
    w.writeheader()
    w.writerows(rows)
print(f"wrote {len(rows)} rows → {out.relative_to(ROOT)}")
