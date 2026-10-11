# 04 — Brand guideline: ramstudiollc.shop

_Measured from RAM Studio's own site, ramstudiollc.com, on 2026-10-11 (1440 px desktop). The shop uses the same brand so the two sites read as one company._

The shop takes its **structure** (page types, grid, spacing rhythm, product flow, motion patterns) from the asylab.com audit, and its **look** (logo, colours, fonts, glow, glass) from this guideline.

---

## 1. Logo

| File | Use |
|---|---|
| `public/brand/logo-white.png` (1200 × 219) | On navy / dark / blue-glow backgrounds |
| `public/brand/logo-black.png` (1200 × 221) | On white / light-grey backgrounds |
| `public/brand/favicon-192.png` | Browser tab, app icon |

- Mark: round monogram + "Ram Studio" wordmark + small "LLC".
- Header size: **200 × 37 px** on desktop (as on ramstudiollc.com), **135 × 25 px** in the compact/sticky header and footer.
- Clear space: at least the height of the round mark on every side.
- Never recolour, stretch, add effects, or put the white logo on a light background.
- _To do:_ get the SVG master from the owner for sharper rendering.

## 2. Colour

| Token | Hex | Role |
|---|---|---|
| `--navy-900` | `#141a2e` | Main text on light; dark section background |
| `--ink-800` | `#21212d` | Secondary headings, list text |
| `--ink-700` | `#2e2d2d` | Body text |
| `--ink-500` | `#61616a` | Muted text, captions |
| `--blue-500` | `#2f80ff` | **Primary action** (buttons, links, focus), highlights |
| `--surface-0` | `#ffffff` | Cards, light sections |
| `--surface-1` | `#f3f3f9` | Light section background |
| `--surface-2` | `#f4f7fb` | Alternate light background |
| `--line` | `#21212e1a` | Hairline borders (10% ink) |
| `--glass` | `#ffffff0f` | Glass fill on dark (6% white) |
| `--sun` | `#ffeb53` | Rare highlight (badge "New", sale) |

**Signature backgrounds**
- **Blue glow (hero):** deep navy `#03041c → #141a2e` with a large soft radial blue (`#2f80ff → #3b2bff`) light, slight grain. Used on hero and dark bands.
- **Aurora gradient (accent only):** `linear-gradient(230deg, #ff994b 6.7%, #d34be9 48.8%, #3188ff 91%)` — small accents (badges, rings), never full sections.
- **Soft light gradient:** `linear-gradient(126deg, #f6f5ff 3%, #ebf9ff 59%)` — light cards and panels.

Rule: one blue action per view. Body text never below 4.5 : 1 contrast.

## 3. Typography

| Role | Family | Size desktop | Weight | Line-height | Letter-spacing | Case |
|---|---|---|---|---|---|---|
| Display (hero) | Helvetica Neue / Helvetica (bold, condensed tracking) | 160–212 px | 700 | 0.9 | −0.06em | UPPERCASE |
| H1 | Helvetica | 70–80 px | 700 | 1.0 | −0.05em | UPPERCASE |
| H2 | Helvetica | 44 px | 600 | 1.18 | −0.03em | UPPERCASE |
| H3 / card title | Helvetica | 34 px | 700 | 1.2 | −0.06em | UPPERCASE |
| Big number | Phudu | 70 px | 500 | 1.0 | 0 | — |
| Lead text | Funnel Sans | 18 px | 400 | 1.56 | −0.02em | — |
| Body | Funnel Sans | 16 px | 500 | 1.5–1.63 | −0.02em | — |
| Nav link | Funnel Sans | 17 px | 500 | 1.53 | −0.01em | — |
| Small / meta | Funnel Sans | 15 px | 500 | 1.4 | 0.02em | — |
| Label / eyebrow | Funnel Sans | 14 px | 500 | 1.0 | 0 | UPPERCASE |

- Funnel Sans and Phudu are free Google Fonts. Helvetica is a system font on Mac/iOS; on Windows/Android it falls back to Arial — acceptable, or license a webfont later.
- Final sizes for the shop follow the asylab type **scale** from `03-REFERENCE-SPEC.md`; this table sets family, weight, tracking and case.

## 4. Shape and depth

- Radii: **20 px** cards · **16 px** inner panels · **12 px** small buttons/inputs · **pill** (9999 px) primary buttons and tags · **50 %** round images and icon buttons.
- Glass: `background: #ffffff0f` (dark) or `#ffffffcc` (light) · `backdrop-filter: blur(10–14px)` · 1 px border `#21212e1a` (light) or `#ffffff1a` (dark).
- Shadows: soft only — `0 1px 2px rgba(39,39,46,.04)` resting, `0 8px 16px rgba(3,4,28,.3)` lifted.
- Round "pill" image crops inside headlines (product shot inside a capsule shape) are a RAM signature — use in hero.

## 5. Spacing

- Content width **1410 px** max (1440 viewport − 15 px gutters). Narrow text column 1000 px.
- Section rhythm and gaps follow the asylab spec; RAM's site uses 15 / 30 / 90 / 135 px gaps.

## 6. Motion

- Default transition **0.3 s ease / ease-in-out** on colour, border, shadow; transform **0.4 s**.
- Libraries on ramstudiollc.com: GSAP + ScrollTrigger, Swiper. The shop's motion list comes from the asylab audit (reveals, hovers, loops) and is built with our own code.

## 7. Imagery

- Product shots: RAM Studio's own mockups (Magnific/Freepik portfolio), 4 : 3 or 1 : 1, clean studio light.
- Never use client logos without permission, stock people photos, or another site's images.

## 8. Voice

- Short sentences, plain words, for international buyers.
- Say what the file is before how good it is: "24 PSD scenes of a kraft pouch", not "stunning premium mockup".
- Buttons name the action: "Buy on Gumroad", "Download free", "See all packaging mockups".
