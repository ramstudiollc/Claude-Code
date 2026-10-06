# 30-Day Facebook Content System: Practical AI + n8n Automation

For the Facebook page **Asif** (facebook.com/Asif.myself.page). **120 production-ready posts** over 30 days: **60 Reels + 60 images**, 2 of each every day, from **Mon 12 Oct to Tue 10 Nov 2026**. Built on research verified 6 Oct 2026, then refined in a final human-first remediation pass (see `07-qc/manual-qc.md` §5).

## Start here

| You want to… | Open |
|---|---|
| Browse every post on your phone or laptop (filters, copy-caption buttons) | `viewer.html` |
| See the month at a glance | `03-calendar/calendar.md` |
| Work in a spreadsheet (all fields, status column) | `03-calendar/calendar.xlsx` or `calendar.csv` |
| Film a Reel | `04-reels/week-N.md`: timed voiceover, on-screen text and visuals per beat |
| Design an image | `05-image-posts/week-N.md` + `06-production/design-system.md` |
| Understand the why | `02-strategy/strategy.md` |
| Check the specs | `01-research/facebook-specs.md` |
| Know what to confirm before posting | `07-qc/manual-qc.md` §3 |

## The plan in numbers

- **Pillars:** Automation & n8n 31 · Practical AI 26 · Service ("work with me") 16 · Workflows 15 · AI literacy & safety 15 · Hidden features 11 · News 6
- **Human-first:** every post records the real problem it solves and a one-sentence takeaway; every Reel records its open loop and where it pays off
- **Reels:** 30–51 s (median 43 s), average spoken pace 2.27 words/s, ≥ 5 documented retention drivers each, 5 loop Reels (kept only where they help), 16 Reel formats with no format 3 days running, every Reel filmed by you (Meta's 2026 originality rules)
- **Images:** 4:5, 1440×1800, ≤ 75 words, one idea each, 31 layout formats (no format 3 days running)
- **CTAs:** save 42 · genuine question 27 · share 16 · none 12 · hard service CTA 12 (max 1/day, service posts only) · soft service line 6 · follow 5. 14 of 30 days carry no service CTA. No engagement bait, no links in post bodies.
- **Posting times (BST):** 09:30 image · 13:30 Reel · 18:30 image · 21:00 Reel

## Folder map

```
01-research/     facebook-specs.md · niche-and-creator-research.md · page-audit.md
02-strategy/     strategy.md
03-calendar/     calendar.md · calendar.csv · calendar.xlsx            (generated)
04-reels/        week-1.md … week-4.md   (Week 4 = Days 22–30)        (generated)
05-image-posts/  week-1.md … week-4.md                                 (generated)
06-production/   workflow.md · design-system.md · sourcing-and-licensing.md · image-fields.csv
07-qc/           qc-report.md (generated) · manual-qc.md
data/            posts-w1…w4.yaml  ← the single source of truth · sources.yaml (47 dated sources)
tools/           build.py (generate + QC) · export_image_fields.py · viewer_template.html
viewer.html      (generated)
```

## Edit → rebuild

```bash
pip install pyyaml openpyxl          # once
python3 tools/build.py               # regenerate everything + run QC (exit 1 if any rule fails)
python3 tools/build.py --start 2026-10-19   # shift the whole calendar
python3 tools/export_image_fields.py # CSV for Canva Bulk Create / Figma
```

Edit posts only in `data/posts-*.yaml`. The calendar, scripts, image copy, viewer and QC report are all generated from it, so they never drift apart.

## Before Day 1 (checklist)

1. Read `07-qc/manual-qc.md` §3 and confirm or edit the 11 personal statements.
2. Set up the **AUTOMATE** keyword reply in Meta Business Suite (strategy §7).
3. Build the templates (`06-production/design-system.md`) and the demo data/accounts (`workflow.md` §0).
4. Run the Week 1 pre-flight on volatile facts (`07-qc/qc-report.md` → Pre-flight list).
5. Batch-film Week 1 (`workflow.md` §1).
