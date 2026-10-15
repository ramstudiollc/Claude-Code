# 02 — Plan: ramstudiollc.shop

**Goal:** a branded mockup shop at **ramstudiollc.shop**. Visitors browse on our site, then **buy, pay and download on Gumroad**.

---

## 1. Site map

| URL | Page | Status |
|---|---|---|
| `/` | Home: hero, categories, new releases, bundles, how buying works, All-Access band, freebies, custom-work band | ✅ built |
| `/mockups/` | Full library: search, filter (category, price, type, format), sort | ✅ built |
| `/mockups/<slug>/` | Product page: preview gallery, price, **Buy on Gumroad**, specs, editable features, licence summary, related | ✅ built |
| `/category/<slug>/` | One page per category (9) | ✅ built |
| `/bundles/` | All bundles | ✅ built |
| `/freebies/` | All free mockups | ✅ built |
| `/all-access/` | Membership offer (button appears once the Gumroad membership exists) | ✅ built |
| `/license/` | Plain-English licence | ✅ draft — **needs review** |
| `/faq/` | Buying & download questions (with FAQ schema) | ✅ built |
| `/about/` | Studio facts from the master dataset | ✅ built |
| `/sitemap.xml`, `/robots.txt`, `404` | SEO plumbing | ✅ built |
| `/blog/<slug>/` | Product stories for search traffic | ⏳ phase 3 |

## 2. How a sale flows

```
Google / Pinterest / Behance / marketplace link
        │
        ▼
ramstudiollc.shop  ── browse, filter, view previews
        │  "Buy on Gumroad · $12"
        ▼
Gumroad product page (or pop-up overlay)  ── pay by card / PayPal, tax, receipt
        │
        ▼
Email with download link  +  buyer's Gumroad Library  +  buyer joins your Gumroad audience
```

Two checkout styles, switch in `src/config/site.ts → checkout`:

- `redirect` (default, like Asylab): Buy opens the Gumroad page.
- `overlay`: Buy opens Gumroad's checkout pop-up on top of our site, so the buyer never leaves.

## 3. Where each piece of data lives

| Data | Lives in | Why |
|---|---|---|
| Product name, price, Buy link, cover images, description | **Gumroad** → pulled by `npm run sync:gumroad` into `src/data/products.json` | Gumroad is the single source of truth for what is for sale. |
| Category, file format, bundle, featured, hidden | **Gumroad tags** (`cat:packaging`, `format:psd`, `bundle`, `featured`, `hidden`, `no-all-access`) | Edit once on Gumroad; the site follows. |
| Specs table, "what you can edit" list, extra gallery images | `src/data/overrides.json` (keyed by slug) | Gumroad has no field for these. |
| Store settings, membership link, socials | `src/config/site.ts` | One file. |
| PSD source files | **Not in git.** Gumroad (delivery) + your own Drive/Dropbox backup | Too large for git; `.gitignore` blocks `*.psd`, `*.psb`, `*.zip`. |

## 4. Gumroad set-up checklist

1. **Store URL.** Pick the Gumroad username (e.g. `ramstudio.gumroad.com`). Put it in `site.ts → gumroadStore`.
2. **Custom domain on Gumroad is optional.** Our site lives on ramstudiollc.shop; Gumroad can stay on `*.gumroad.com`.
3. **Product naming:** `<Object> Mockup — <variant>` e.g. "Kraft Stand-Up Pouch Mockup — 6 Scenes".
4. **Custom URL (permalink)** per product, readable: `kraft-pouch-mockup`. The site uses it as the page slug.
5. **Tags** per product: one `cat:<slug>`, one or more `format:<ext>`, plus `bundle` / `featured` where true.
6. **Cover + preview images:** 1600 × 1200 px (4:3) — the site cards are 4:3.
7. **Freebies:** price `$0+` (pay what you want, minimum 0). They grow your Gumroad audience.
8. **Bundles:** Gumroad product that contains several files; tag `bundle`.
9. **All-Access Pass:** a Gumroad **membership** product, yearly (and optional lifetime). Give members access to every file — Gumroad's "Membership" content tab or a single updating ZIP/links page. Paste its URL into `site.ts → allAccess.url`.
10. **Discount code** for newsletter subscribers (Gumroad → Discounts), e.g. 20% off.
11. **API token** for the sync: Gumroad → Settings → Advanced → Applications → create an app → *Generate access token*. Put it in `.env` (never commit it).

## 5. Phases

### Phase 1 — Foundation (this commit)
- [x] Site skeleton, design system, all core pages
- [x] Data model, sample catalogue, Gumroad sync script
- [x] Works the same locally and in the cloud
- [x] Analysis and plan documents

### Phase 2 — Real catalogue (next)
- [ ] Owner: create/clean the Gumroad store, tags and images (checklist §4)
- [ ] Owner: send Gumroad store URL + access token (token goes in `.env`, not in chat)
- [ ] Run `npm run sync:gumroad`, review every page, write `overrides.json` for top 20 products
- [ ] Brand pass: real logo, brand colours into `src/styles/global.css` tokens
- [ ] Licence reviewed → `licenseReviewed: true`
- [ ] Hosting: Cloudflare Pages (recommended) or Netlify/Vercel, connect GitHub, point **ramstudiollc.shop** DNS
- [ ] Analytics (Cloudflare Web Analytics or Plausible — no cookie banner needed)

### Phase 3 — Growth
- [ ] Newsletter (Gumroad audience or Klaviyo/Mailchimp) + 20% code
- [ ] Blog/product-story pages for SEO (`/blog/`)
- [ ] Product families: Original / Clay / Vector style variants + family bundle (the Asylab trick)
- [ ] Auto-rebuild: nightly GitHub Action runs the sync and redeploys
- [ ] Pinterest product pins; links from Behance/Dribbble to the shop
- [ ] Search across 500+ products (Pagefind) if the client-side filter gets slow

## 6. Decisions waiting on you

| # | Question | Default if you don't answer |
|---|---|---|
| 1 | Gumroad store URL? | — (needed) |
| 2 | Which marketplace files are you allowed to re-sell on Gumroad (exclusivity)? | Only files you confirm |
| 3 | All-Access price — yearly and/or lifetime? | Yearly only, price TBD |
| 4 | Checkout: redirect or pop-up overlay? | Redirect |
| 5 | Hosting: Cloudflare Pages, Netlify or Vercel? | Cloudflare Pages |
| 6 | Brand colours/logo for the shop — same as ramstudiollc.com? | Current neutral palette with vermilion accent |
| 7 | Should the site live in its own GitHub repo (`ramstudiollc-shop`)? | Stays in this repo under `ramstudiollc-shop/` |
