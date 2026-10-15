# 06 — Catalogue plan: what the shop sells and how it is organised

_2026-10-11. Sources: the live Gumroad store (read directly), search-engine listings of RAM Studio's Envato Elements and Creative Market shops (those sites block cloud servers, so they were not opened directly), and RAM Studio's verified facts._

## 1. What exists today

### On Gumroad — `shop.ramstudiollc.com` (read directly, imported into the site)

| Store section | Products | Free | Paid |
|---|---|---|---|
| Packaging | Foldable Cardboard Shipping Box · Gift Handle Box · Kraft Paper Tube · Luxury Perfume Rigid Box | 4 | 0 |
| Branding | Minimalist A4 Folder · Construction Helmet | 2 | 0 |
| Apparel | Baseball Cap · Safety Vest | 2 | 0 |
| Device | Laptop Long Scroll Screen ($14) · iMac · Long Scroll Extended Laptop | 2 | 1 |
| **Total** | **11** | **10** | **1** |

Free items are $0+ (pay what you want) and carry 5.0★ ratings (1–4 reviews each). They are lead magnets: each one is a 2–4 PSD sample of a larger paid set ("Download full project").

### Elsewhere (from search listings — titles only, not verified page by page)

| Niche | Seen on Envato Elements / Creative Market |
|---|---|
| Packaging — boxes | Carton box, cardboard box with tape, custom perfume box, vertical kraft soap box, wet-wipes box, pharmaceutical boxes |
| Packaging — flexible | Zipper pouch, small zipper pouch, coffee pouch, glossy snack flow-pack, kraft shopping bag |
| Food & beverage | Bakery branding + packaging set, ice-cream tub |
| Devices | iPhone 16 Pro, iPhone 17 Pro Max, iPhone 17 Pro Max in pocket, iPhone case, multi-device, laptop long scroll |
| Branding & stationery | Rounded-corner business card, presentation folder & paper, branding identity kit, ID card with lanyard |
| Apparel & workwear | Oversized T-shirt, long-sleeve T-shirt, cap, safety vest, construction helmet |
| Fitness & lifestyle | Gym towel, metallic dumbbell |
| Advertising & events | Foldable backdrop banner, booth |

Verified totals (RAM Studio dataset): **8,293+ assets across 7 marketplaces**, **504 products on Creative Fabrica**. Marketplace prices seen: **$9–$20** per mockup, $30 for a branding + packaging set.

## 2. Categories (shop navigation)

Seven top-level categories. Each has products today or a clear pipeline from the other marketplaces. **A category appears on the site only when it has at least one product** (no empty pages).

| # | Category | Slug | Sub-niches (filters) | Today on Gumroad |
|---|---|---|---|---|
| 1 | Packaging | `packaging` | Boxes · Pouches & bags · Tubes & tubs · Luxury & cosmetic · Food & beverage | 4 |
| 2 | Branding & Stationery | `branding` | Business cards · Folders & paper · Identity kits · ID cards | 1 |
| 3 | Apparel & Workwear | `apparel` | T-shirts · Caps · Workwear & PPE | 3 (incl. helmet) |
| 4 | Devices | `devices` | iPhone · Laptop & long-scroll · Desktop · Multi-device | 3 |
| 5 | Food & Beverage | `food-beverage` | Bakery · Coffee · Snacks · Ice cream | 0 |
| 6 | Advertising & Events | `outdoor` | Banners & backdrops · Booths · Billboards | 0 |
| 7 | Fitness & Lifestyle | `lifestyle` | Gym · Home · Gifts | 0 |

Change from the store: "Construction Helmet" moves from Branding to **Apparel & Workwear → Workwear & PPE** (with the safety vest) — a clear niche few mockup shops cover.

## 3. Themes (cross-category tags)

Themes power the home-page collections and "More like this": **Free** · **Eco & kraft** · **Luxury** · **Industrial & PPE** · **Tech & UI** · **Food & drink** · **Beauty & cosmetics** · **Fitness**.

On Gumroad, add them as tags (`theme:eco`, `theme:luxury`…). The importer and API sync read tags.

## 4. How many products

| Stage | Products on the site | Mix |
|---|---|---|
| **Launch** | the 11 on Gumroad today | 10 free, 1 paid |
| **Launch + 30 days** | 40 | Packaging 14 · Devices 8 · Branding 6 · Apparel & Workwear 6 · Food & Beverage 4 · Advertising 2 |
| **Launch + 90 days** | 80 + 4 bundles | ~1 free sample for every 3 paid sets |
| Ongoing | +8 to 10 per month | New releases feed the "New in" section |

The site always shows **exactly** what is in `src/data/products.json` (= what is on Gumroad). No placeholder products ship.

**Before moving a marketplace item to Gumroad:** check that marketplace's contributor terms. Some exclusive programmes do not allow selling the same file elsewhere.

## 5. Offer structure on Gumroad

| Offer | Price idea | Gumroad set-up |
|---|---|---|
| Free sample (2–4 PSD) | $0+ | Pay what you want, min 0 — collects buyer emails |
| Full set (8–24 PSD) | $9–$20 | Fixed price; free sample links to it |
| Category bundle | $29–$49 | One product with all files of a sub-niche; tag `bundle` |
| All-Access Pass | yearly + lifetime | Gumroad membership; unlocks every file — launch when 40+ paid sets exist |
| Newsletter discount | 20 % | Gumroad offer code sent to subscribers |

## 6. Page architecture

| Our page | Reference page type (asylab) | Purpose |
|---|---|---|
| `/` Home | `/` | Brand, best products, membership, trust, FAQ |
| `/mockups/` Library | `/resources` | Every product, search + filters + sort |
| `/category/<slug>/` | `/resources/<category>` and `/tags/<tag>` | One category or theme |
| `/mockups/<slug>/` Product | `/resources/<product>` | Gallery, what's inside, price, **Buy on Gumroad** |
| `/freebies/` | `/resources/freebies` | All free samples |
| `/bundles/` | bundle products | Bundles only |
| `/all-access/` Pricing | `/pricing` | Membership plans |
| `/gallery/` | `/assets-gallery` | Visual wall of every preview image |
| `/license/` | `/licenses` | Licence in plain words |
| `/faq/`, `/about/`, `/contact/` | FAQ section, `/contact` | Help and trust |

## 7. Product page anatomy (from the Gumroad data we hold)

1. Gallery — up to 8 previews (imported as WebP), cover first
2. Title, category, rating (★ value + count when present)
3. Price + **Buy on Gumroad** / **Download free on Gumroad** (one primary action)
4. Specs: PSD file count · resolution (DPI) · image size · smart objects
5. "What you get" — feature bullets
6. "Perfect for" — use-case bullets
7. Description (store header and upsell cards removed)
8. Licence summary + link
9. Related products (same category first) and the free ↔ paid pair

## 8. How it stays in sync

- Add or edit products **on Gumroad only**. Put each product in the right store section (= category) and add theme tags.
- Run `npm run import:store` (no token needed) or `npm run sync:gumroad` (API token) → `products.json` + images update → commit → the site rebuilds.
