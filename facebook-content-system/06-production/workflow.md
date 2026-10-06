# Production workflow: 120 posts without doing everything by hand

The goal: one person (Asif), optionally helped by an editor/designer, ships 4 posts a day for 30 days without quality slipping. The system is batch-based. You film, record, design and schedule in blocks, never one post at a time.

## 0. One-time setup (≈ half a day, before Day 1)

| Item | What to do | Why |
|---|---|---|
| **Folder structure** | Google Drive: `FB-30day/01-aroll`, `02-screen`, `03-edits`, `04-images`, `05-evidence`, `06-exports`. One sub-folder per post ID (e.g. `D05-R2`). | Every asset findable by ID |
| **File naming** | `D05-R2_sheets-formula_v1.mp4`, `D05-I1_gemini-notebook_v2.png` | Matches calendar IDs |
| **Templates** | Build the 19 image templates and 6 motion templates in `design-system.md` once (Canva or Figma). `08-demos/` has a finished example of 3 of each | Each new post becomes "fill the template" |
| **Caption preset** | One saved caption style in your editor (CapCut or similar): font, size, box, position y 1050–1250 | Identical captions on all 60 Reels |
| **Demo data** | A demo Google Sheet (fake orders, fake leads), a test Facebook Page, a test Gmail, a Telegram test bot, a WhatsApp test number | Never film real customers |
| **n8n demo project** | A separate n8n project/folder "DEMO" with copies of workflows, no production credentials | Safe to show on screen |
| **AUTOMATE keyword** | Meta Business Suite → Inbox → Automations: keyword reply for "AUTOMATE" asking for the 4 things in D26-R2 | Every service CTA lands somewhere useful |
| **Meta AI translations** | Check the Reel composer for the Meta AI translation option (Bengali) | Free reach in Bengali |

## 1. The weekly cycle (repeat 4–5 times)

| Day | Block | Output | Time (solo, rough) |
|---|---|---|---|
| **Thu** | Pre-flight + script lock | Volatile facts re-checked (list in `07-qc/qc-report.md`), personal lines adjusted, props listed | 1–1.5 h |
| **Fri** | **A-roll batch**: film every talking-head beat for next week's 14 Reels in one setup | ~14 folders of face clips | 2–3 h |
| **Sat** | **Screen batch**: all screen/phone recordings with demo data | Screen clips per Reel | 2–3 h |
| **Sun** | **Edit batch** with motion templates | 14 Reel exports + covers | 4–6 h (or hand to an editor) |
| **Mon** | **Image batch** via bulk fill (see §3) + caption paste + schedule all 28 posts | 14 PNGs, 28 scheduled posts | 2–3 h |
| Daily | 15 min: reply to comments in the first hour after each Reel; handle AUTOMATE messages | Engagement + leads | 15–30 min/day |

Week 1's batch has to be produced in the days before Mon 12 Oct. If you need more time, move the start date (see README: `--start`).

## 2. Reels: from script to scheduled

1. **Open the script** in `04-reels/week-N.md` (or `viewer.html` on a phone while filming).
2. **A-roll:** film each VO line as its own take, looking at the lens. Frame at 1080×1920, eyes at about y 600, so your face stays in the safe box above the caption zone. Lav or phone mic, quiet room. Read the line, wait one beat, read it again (gives the editor a choice).
3. **Screen recordings:** desktop at 1920×1080 cropped to 9:16, or phone native vertical. Zoom 150–200% on the n8n canvas so node names read on a phone. Hide bookmarks, notifications and personal tabs. **Never show** credentials, tokens, webhook URLs, phone numbers or client names.
4. **Edit:** follow the timing table exactly. The `t` column is the edit decision list. Put on-screen text (OST) in the upper-middle (y 300–1000) and burned-in captions at y 1050–1250. Cut on every beat boundary. Music −22 dB under the voice.
5. **Loops (7 Reels):** match the last frame to frame 1 (same framing, same object) and cut the final word tight.
6. **Export:** H.264 MP4, 1080×1920, 30 fps, AAC 48 kHz, ~12 Mbps. Cover frame: title inside the centre 1080×1350.
7. **Asset QC (60 s per Reel):** the hook lands in ≤3 s, face visible early, no text in the bottom 35% except captions, no secrets on screen, the CTA matches the caption, and the runtime matches the script (±2 s).
8. **Schedule** in Meta Business Suite Planner at the slot time. Paste the caption from the script file (hashtags included). Turn on Meta AI translation where it's available.

## 3. Images: bulk-fill instead of designing 60 times

The calendar CSV already contains every headline and body line, so you design each **template** once and fill it from data.

1. Export the image rows: `03-calendar/calendar.csv`, filter `type = image`. For bulk tools, use `tools/export_image_fields.py` (below), which writes `06-production/image-fields.csv` with one column per text field (headline, subhead, body_1…body_8, footer).
2. **Canva Bulk Create** (or a Figma data plugin): connect `image-fields.csv` to each template's text boxes, and generate all posts of that template type at once.
3. Fix line breaks by eye. Check every image at phone size (about 30% zoom). If any line wraps to 3 lines, shorten it in the YAML and rebuild. Don't shrink the font below 44 px.
4. Export PNG, 1440×1800, sRGB. Name it `Dxx-Ix_slug.png`.
5. Schedule with the caption from `05-image-posts/week-N.md`.

## 4. Pre-flight check (every Thursday, ~45 minutes)

`07-qc/qc-report.md` → "Pre-flight list" shows every post that depends on a **volatile** fact (new features, plan availability, Meta policies), grouped by day. For each:
1. Open the source URL. Is the claim still true (name, plan, country, date)?
2. If something changed, edit the post in `data/posts-*.yaml`, run `python3 tools/build.py`, and re-check that QC passes.
3. Save a dated screenshot of the source in `05-evidence/<post-id>/`. This is your proof if anyone questions the post.

## 5. Make the plan run itself (optional, uses your own service)

This plan is already structured data, so it can feed the **approved-only auto-publisher** described in D24-R2:
- Import `calendar.csv` into a Google Sheet. Add columns `asset_url`, `approved` (Y/N), `posted_at`, `post_link`.
- An n8n workflow checks every 15 minutes for rows where the time is due and `approved = Y`, publishes to the Page via the Graph API, writes back the link, and alerts you on failure (error workflow).
- Bonus: film it working. That's a Build Log Reel for next month.

If you prefer zero risk, Meta Business Suite's Planner does the scheduling just as well. The automation is a demonstration of your service, not a requirement.

## 6. Editing the plan

- **Change any post:** edit `data/posts-w*.yaml` → run `python3 tools/build.py`. The calendar, scripts, image copy, viewer and QC report all regenerate. A non-zero exit means a QC rule failed; read the printed errors.
- **Change the start date:** `python3 tools/build.py --start 2026-10-19` re-dates everything.
- **Swap two posts:** swap their `id` values (e.g. `D12-R1` ↔ `D15-R1`) and rebuild. QC re-checks the per-day rules.
- **Mark progress:** use the `status` column in `calendar.xlsx` (planned → filmed → edited → scheduled → posted).

## 7. Tools (only the ones that earn their place)

| Job | Tool | Note |
|---|---|---|
| Filming | Phone + clip-on mic + window light | Face clarity matters more than a camera upgrade |
| Screen capture | OBS (desktop) / built-in phone recorder | Record at a high zoom level |
| Editing + captions | CapCut (auto-captions, templates) or your editor of choice | Save one caption preset |
| Images | Canva (Bulk Create) or Figma | Template + data merge |
| Scheduling | Meta Business Suite Planner | Supports Reels + photos for Pages |
| Research monitoring | Your own n8n RSS digest (D18-R1) on official blogs | Feeds next month's NEWS posts |
| Plan source of truth | This repo (`data/*.yaml` + `tools/build.py`) | One edit updates every output |
