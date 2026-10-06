# Design system: one look for 120 posts

Couldn't see the page's existing visual style (facebook.com is blocked here), so this is a clean, neutral system designed for legibility on phones. **If the page already has brand colours or fonts, swap the tokens below and keep everything else.**

## 1. Tokens

| Token | Value | Use |
|---|---|---|
| `ink` | `#111418` | Dark backgrounds, body text on light |
| `paper` | `#F6F5F1` | Light backgrounds |
| `accent` | `#10B981` (emerald) | Series tags, key words, arrows, "after" states, CTA bars |
| `accent-ink` | `#06291F` | Text on accent |
| `warn` | `#F59E0B` | Caution rows, "check this" |
| `stop` | `#EF4444` | Myths, "before", never-do rows |
| `muted` | `#6B7280` | Footers, weak/"instead of" text |
| `line` | `#D9D8D2` (light) / `#2A2F36` (dark) | Dividers |

Contrast: body text vs background ≥ 4.5:1 (ink on paper and white on ink both pass). Never put accent-green text on paper for body copy. Use it for tags and large type only.

**Fonts** (all SIL Open Font License, free for commercial use):
- Headlines: **Inter** ExtraBold (or Manrope ExtraBold)
- Body: **Inter** Medium
- Bengali: **Noto Sans Bengali** or **Hind Siliguri** (test rendering on Android)
- Code/JSON: **JetBrains Mono**

## 2. Image grid (1440 × 1800, 4:5)

- Outer margin **90 px** on all sides. Nothing important closer to the edge.
- **Series tag:** top-left, 40 px caps, accent pill, y = 90.
- **Headline:** starts at y ≈ 170, 88–110 px, max 3 lines, left-aligned. Keep the whole headline in the **top 60%**.
- **Body:** 44–52 px, line height 1.3, max 8 rows, rows separated by 28–36 px.
- **Footer:** 32–36 px, muted, bottom margin 90 px.
- **Page handle** (small, bottom-right, 28 px): your page name. It gives credit when the image gets shared without the caption.

### The 13 image templates

| Template | Used by (format field) | Layout rule |
|---|---|---|
| Prompt card | Prompt card | Quote block with 8 px accent left border; `[fill-ins]` in accent |
| Cheat sheet / glossary | Cheat sheet, Glossary card | Term (bold accent) + one-line definition per row |
| Checklist | Checklist | Checkbox or icon per row; warnings in `warn` |
| Decision tree | Decision tree | Diamonds top-to-bottom; "No" exits to the right |
| Flow diagram | Flow diagram | Left→right nodes (max 5), numbered labels below |
| Myth vs fact | Myth vs fact | Red-tint MYTH band with strike-through, green FACT area |
| Comparison table | Comparison table | Max 3 columns, tool names as **plain text** (no logos) |
| Before/after | Before/after card/table/timeline | Grey "before" left/top, accent "after" right/bottom |
| News card | News card | Numbered rows + "Checked <date>" pill bottom-right |
| Framework | Framework card | One formula or loop diagram as the hero |
| Hidden-feature card | Hidden feature card | **Drawn** UI mock (simplified), not a screenshot |
| Service/CTA | Service menu, Process steps, FAQ card | Full-width accent CTA bar at the bottom with Messenger icon |
| Quiz / stack | Quiz card, Stack card | 2×2 grid / layered bands |

## 3. Reel layout (1080 × 1920, 9:16)

```
y 0     ┌──────────────────────────┐
        │  top UI zone (no text)   │  0–270
y 270   ├──────────────────────────┤
        │ series tag (y 290)       │
        │ ON-SCREEN TEXT zone      │  300–1000  ← OST: 64–72 px bold, ≤2 lines
        │ face / screen content    │
y 1050  │ burned-in CAPTIONS       │  1050–1250 ← 54–64 px, ≤2 lines, ~32 chars/line
y 1250  ├──────────────────────────┤
        │ bottom UI zone (no text) │  1250–1920 (caption, name, buttons)
        └──────────────────────────┘
          x 65 ─────────── x 1015  (side margins)
```

- **Face-cam bubble** (screen demos): 360 px circle, bottom-left of the safe box (centre ≈ x 250, y 1050). Move it to the top-right when captions are long.
- **Split-screen layouts:** top half Asif (y 270–960), bottom half screen (y 960–1250 visible area + caption overlay). Or left/right halves for before/after.
- **n8n canvas shots:** zoom until node names are ≥ 40 px tall in the final frame. Pan with a slow ease, one node per beat.
- **Transitions:** hard cuts on beat boundaries; at most one whoosh per Reel; zoom-ins for "look at this" moments.
- **Colour:** OST in white with an ink box (70% opacity), key word in accent.
- **Sound:** voice first. Music from Meta Sound Collection at −22 dB. A soft click SFX on each list item, nothing louder.

### The 5 motion templates

1. **Three boxes** (D01-R2): trigger / steps / result boxes that fill.
2. **Explain It Simply** (D04-R1, D08-R1, D12-R2, D25-R2, D30-R1): object → analogy → real tool → loop back to the object.
3. **Numbered list cards** (D05-R1, D07-R1, D16-R2, D18-R2, D28-R2, D29-R1): card slides in every 4–5 s with a large numeral.
4. **Canvas walk-through** (Build Log / Automate This demos): face-cam + node-by-node zoom + phone result shot.
5. **Before/after split** (D03-R1, D07-R2, D10-R2, D12-R1, D14-R2, D28-R1): vertical or horizontal split; the "after" side gets circled features.

## 4. Covers (Reel thumbnails)

- Big 3–5 word title inside the centre 1080×1350 (it survives the grid crop).
- Same font and accent as the images. Series tag at top.
- Face in at least half of the covers (it builds recognition).

## 5. Do-not-use

- Third-party logos as decoration (OpenAI, Google, Meta, n8n). Write the names as text. Product UI is OK when you capture it from your own account to demonstrate something.
- Photorealistic AI people.
- Thin fonts, text under 44 px on images, text in the Reel bottom 35%.
- More than 2 accent colours on one asset.
