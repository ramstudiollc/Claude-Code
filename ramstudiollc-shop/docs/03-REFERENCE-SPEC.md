# 03 — Reference spec: what asylab.com does (measured)

_Audit run 2026-10-11 with `npm run audit -- https://www.asylab.com --pages 30 --per-template 3 --deep 6`: 214 URLs found, 22 rendered, 6 measured at 390 / 768 / 1280 / 1440 / 1920 px. Full data: `audit/www.asylab.com/report.md` (+ screenshots and scroll videos on the machine that ran it)._

**How we use this:** it sets the *standard* — page types, product flow, layout system, type and spacing rhythm, motion vocabulary, responsive behaviour. Our shop meets that standard in **RAM Studio's own design** (brand guideline 04) with our own code, words and images. We do not copy Asylab's page designs, graphics, text or code.

---

## 1. Site map and page types (214 URLs)

| Page type | Example | Role |
|---|---|---|
| Home | `/` | Brand, value, membership, trust, FAQ |
| Library | `/resources` | All products (173 cards), search, category chips |
| Category / tag | `/resources/<cat>`, `/tags/<tag>` (~70 tags) | Filtered library |
| Product | `/resources/<slug>` | Long image-led page + buy panel |
| Gallery | `/assets-gallery` | Wall of preview images |
| Pricing | `/pricing` | Two membership plans |
| Licences, FAQ, About, Contact, Terms, Privacy, Cookies | | Trust and help |
| Account | sign-in / sign-up / forgot-password | Membership login (we don't need this — Gumroad holds accounts) |

## 2. Stack
Framer site (Framer Motion appear effects). Payments: membership via Lemon Squeezy; newsletter via Gumroad. Cloudflare analytics.

## 3. Grid and layout
- Content width **1312 px** (1440 viewport → 64 px side gutters); text blocks max **600–1000 px**.
- Breakpoints: **≥1200** desktop · **810/890–1199** tablet · **<810/890** phone.
- Library cards: **2 columns, 640 × 520 px, 32 px gap** on desktop; 1 column below 890 px.
- Home sections sit on a light page (`#f6f6f9`) as large white rounded panels; hero is dark full-bleed.
- Header 136 px zone over the hero, with a 60 px black announcement bar above.

## 4. Typography
One family (a geometric grotesk, variable) + a mono for labels.

| Role | Desktop | Phone | Weight | Line-height | Tracking |
|---|---|---|---|---|---|
| Display / H1 home | 100 px | 46 px | 400–500 | 0.85–0.9 | −0.02em |
| H1 library | 80 px | 46 px | 400 | 0.9 | −0.02em |
| H1 product | 43 px | 43 px | 400 | 1.0 | −0.01em |
| H2 section | 64 px | ~40 px | 400 | 0.9 | −0.02em |
| H3 card | 26 px | 22 px | 400–500 | 1.1–1.2 | 0 |
| Lead | 19–21 px | 17 px | 400 | 1.2–1.3 | −0.005em |
| Body | 18 px | 16 px | 400 | 1.54 | 0 |
| Small / meta | 15 px | 14 px | 400 | 1.2 | 0 |
| Label (mono, uppercase) | 12 px | 12 px | 500 | 1.0 | 0 |

Scale steps 100 → 64 → 40 → 26 → 19/18 → 15 → 12 (ratio ≈ 1.25–1.56). Headings shrink to about **46 %** on phones; body only to ~90 %.

## 5. Colour, surfaces, depth
- Light page `#f6f6f9`, panels `#ffffff`, chips `#eaebf0`, dark hero/footer `#000`.
- Text black, secondary `#474d69`, muted `#848aa1`; one warm accent for labels, one violet for tags.
- **Big soft shadows** under panels: `80px 120px 114px rgba(32,38,87,.10)`.
- Glass: blurred header strip (`blur` + 85 % white), 48 px round glass icon buttons.
- Radii: **24 px** panels/cards · 8–10 px small cards · **80–99 px** pills/buttons · 30–40 px large panels.

## 6. Spacing
Padding steps 4 · 8 · 16 · 24 · 32 · 48 · 64 · 80 · 120 · 180 (library hero top). Gaps 8 · 10 · 16 · 24 · 32 · 64. Product page: 80 px top / 120 px bottom.

## 7. Components
- **Announcement bar** — full width, black, mono uppercase, one offer.
- **Header** — logo · 3 links (one dropdown) · search icon · sign-in pill; collapses to a menu button below 890 px.
- **Buttons** — pills; dark primary, white secondary; **hover widens the pill and reveals an arrow icon**; icon buttons press to 95 %.
- **Eyebrow** — icon + mono uppercase label above each section heading.
- **Library filter** — search field (pill, full width 560 px) + category chips with icons; active chip dark.
- **Product card** — big preview, title + price on one row, category tag + date, "PRO" badge.
- **Product page** — left: long stack of preview panels (scene grids "01–12", colour options, features); right: sticky panel with title, price, buy button, features, specs. Headings "Product Features", "Description", "Product Specifications".
- **Bento** feature grid (3 columns, tall centre card).
- **Testimonial carousel** with prev/next buttons.
- **Pricing** — two plans in one panel, divided; price large; check-list of inclusions; CTA per plan; payment-method logos.
- **FAQ** — 10 white rounded rows with icon + question + chevron; last row "question not answered" + contact button.
- **Footer** — black, rounded top corners, logo + 3 link columns + newsletter (email + subscribe button), legal row + social icons.

## 8. Motion
| Effect | Measured | Where |
|---|---|---|
| Scroll reveal | opacity 0 → 1 + translateY **40 px → 0** (33 elements on home) | Section headings, cards, list items |
| Stagger | list items reveal in sequence | Card grids, feature lists |
| Scroll-linked motion | **45** elements move with scroll (columns travelling 700–2800 px, a row sliding 400 px sideways) | Image wall / "number of assets" section |
| Load intro | hero text and buttons appear in sequence in the first ~1.5 s | Hero |
| Button hover | pill grows ~20–30 px, arrow fades in | All buttons |
| Icon button press | scale 0.95 | Carousel arrows |
| Nav hover | soft pill background appears | Header links |
| Carousel | testimonials slide with arrows | Reviews |
| Sticky / glass | blurred header strip | Header |

No custom cursor, no smooth-scroll library.

## 9. Responsive
No horizontal overflow at any size. Page gets taller on phones (home 11,051 → 16,283 px). Grids go to 1 column below 890 px; headings drop to 46 px; nav becomes a menu button.

## 10. UX flow
Browse → product page → buy (checkout outside the site) · free items alongside paid · membership pushed on cards ("PRO"), home and pricing · newsletter offers a discount.

## 11. SEO
One H1 per page, descriptive titles, product pages indexable, ~70 tag pages for long-tail search.

## 12. Performance (for us to beat)
Home 366 requests / 9.2 MB; library 464 requests / 13.5 MB; product 293 requests / 7.1 MB.

## 13. What RAM Studio does differently
| Area | RAM Studio shop |
|---|---|
| Look | RAM brand: navy + electric-blue glow, giant uppercase Helvetica display, Funnel Sans text, pill image inside headline |
| Checkout | Gumroad product pages (no accounts on our site) |
| Membership | All-Access Pass on Gumroad when 40+ paid sets exist |
| Proof | Real Gumroad ratings (5.0★ from 20 reviews), no invented testimonials |
| Speed | Static site, WebP images, target < 1.5 MB per page |
