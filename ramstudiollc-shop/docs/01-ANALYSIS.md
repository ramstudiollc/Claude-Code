# 01 — Analysis: the Asylab model and RAM Studio's assets

_Written 2026-10-11._

> **Research limit.** This cloud environment's network policy blocks `asylab.com` and `magnific.com`. Neither site could be opened directly. Everything below comes from search-engine results that index those sites. Treat counts and prices as approximate until someone checks them in a browser.

---

## 1. How asylab.com works

**Short version:** asylab.com is a branded catalogue. **Gumroad is the cash register.** The site holds the brand, the browsing and the SEO; Gumroad handles checkout, payment, tax, file delivery, the customer's library and the membership.

### 1.1 What the site is made of

| Part | What it does | Evidence |
|---|---|---|
| Home | Positions the brand ("Premium Mockups, UI Kits & Design Assets"). Featured products, membership pitch, FAQ, newsletter discount banner (20% off for subscribers). | [asylab.com](https://www.asylab.com/) |
| Resources library | All products in one place, split into Mockups, UI kits, Gradients and Freebies. Free and premium items sit side by side. | [/resources](https://www.asylab.com/resources), [/resources/ui](https://www.asylab.com/resources/ui), [/resources/freebies](https://www.asylab.com/resources/freebies) |
| Product page | One URL per product: `/resources/<slug>`. Lists scene count, file types (.PSD + .FIG), colours, shadows, dimensions (e.g. 7500 × 5000 px, 300 DPI), what is *not* included, price, and a "Unlock with Pro" prompt. | [iPhone 17 – 24 scenes](https://www.asylab.com/resources/iphone-17-24-mockups-scenes), [Apple Devices – 12 scenes](https://www.asylab.com/resources/apple-devices-12-mockups) |
| Product families | One base product released in several styles (Original / Clay / Vector), then grouped into a bigger bundle (e.g. "iPhone 17 Bundle – 120 scenes"). | [/resources/iphone-17-bundle---120-mockups-scenes](https://www.asylab.com/resources/iphone-17-bundle---120-mockups-scenes) |
| Versioned bundles | "50 Logo Mockup Branding Bundle" V1, V2, V5, V6… each $14–16. | [V1](https://www.asylab.com/resources/50-logo-mockup-branding-bundle-v1), [V6](https://www.asylab.com/resources/50-logo-mockup-branding-bundle-v6) |
| Blog posts | `/post/<slug>` pages that describe a product — extra search traffic for the same item. | [/post/12-apple-devices-mockups-2023](https://www.asylab.com/post/12-apple-devices-mockups-2023) |
| Membership | "Pro" (12 months) and "Lifetime". Unlocks every product and new releases. Advertised at $72–$84/year in different places; check the live price. | [Gumroad listing](https://asylab.gumroad.com/l/qlvung), [Dribbble](https://dribbble.com/asylab) |
| Gumroad store | [asylab.gumroad.com](https://asylab.gumroad.com/) — about 273 products. Every Buy button lands here. | search result |
| Other marketplaces | Same files also sold on Creative Market, Pixel Surplus, Design Bundles, Master Bundles. The own site is one channel among several. | [Creative Market](https://creativemarket.com/Asylab), [Pixel Surplus](https://pixelsurplus.com/collections/vendors?q=asylab) |

### 1.2 Why the model works

1. **Own the brand, rent the checkout.** No payment gateway, tax handling, file hosting or customer accounts to build.
2. **Freebies feed the funnel.** Free files on the site and on Gumroad collect emails (Gumroad keeps the buyer list).
3. **One product, many SKUs.** Original / Clay / Vector versions plus a bundle of all three multiply listings from one 3D scene.
4. **Membership lifts order value.** One yearly price unlocks everything — easier to sell once the library passes ~100 products.
5. **Every product page is an SEO landing page** with its own title, specs and images.

### 1.3 What we take, what we do differently

| Take | Do differently for RAM Studio |
|---|---|
| Catalogue on own domain, checkout on Gumroad | Same. |
| One page per product, clear specs block | Same, plus `schema.org/Product` data so Google can show price. |
| Freebies, bundles, membership | Same three entry points. |
| Device-heavy catalogue | **Packaging-first catalogue.** RAM Studio's strength is boxes, pouches, bottles, cans, tins, labels — not phones. |
| — | **Custom-work cross-sell** to ramstudiollc.com on every page. Asylab only sells files; RAM Studio also sells design services (packaging from $250, custom e-commerce mockup from $100). |
| Hand-made product pages | **Products sync from Gumroad automatically** (`npm run sync:gumroad`), so 100s of products don't have to be typed twice. |

We copy the **business model and page structure**, not Asylab's design, text or images. The new site has its own layout, colours, copy and illustrations.

---

## 2. What RAM Studio already has

### 2.1 Verified (RAM Studio master dataset)

- **8,293+ assets across 7 marketplaces**
- **504 products on Creative Fabrica**
- Founded 2021 · Wyoming LLC · studio in Lalbagh, Dhaka
- Tools: Adobe Photoshop, Autodesk Maya, Blender, Luxion KeyShot, Redshift
- Services and prices on ramstudiollc.com: e-commerce mockup from $100 · packaging & label from $250 · 3D from $400

### 2.2 Seen in search results — not yet checked by hand

| Where | What showed up |
|---|---|
| [freepik.com/author/ramstudio](https://www.freepik.com/author/ramstudio) (same account as magnific.com/author/ramstudio — Freepik is now Magnific) | Categories: PSD, Mockups, Vectors, Templates, Photos. Listings credited to ramstudio include software box, USB flash drive, ceramic mug and horizontal flyer mockups. A search snippet showed ~1.8k followers / ~484k downloads — **unverified, do not publish**. |
| [mockupcloud.com/author/ram-studio](https://www.mockupcloud.com/author/ram-studio) | Devices, billboards, stickers, apparel, boxes, bottles; e.g. a rectangular tin canister PSD. |
| [creativemarket.com/ram_studio](https://creativemarket.com/ram_studio) | Mockups at roughly $14–$20. |
| [creativefabrica.com/designer/ram-studio](https://www.creativefabrica.com/designer/ram-studio/) | 504 products. |
| [deeezy.com/user/260851/ram-studio](https://deeezy.com/user/260851/ram-studio) | Packaging, branding & identity, illustration. |

### 2.3 What we still don't know (needed before launch)

1. **Exact Magnific/Freepik list** — titles, count per category. Export it or send a screenshot of the profile's category counts.
2. **Gumroad store URL** and how many products are on it today.
3. **Exclusivity.** Some marketplaces (Freepik/Magnific exclusive contributors, Envato exclusive) forbid selling the same file elsewhere. Check each contributor agreement before re-listing a file on Gumroad.
4. **Which files you hold the full-resolution PSD for** (they must be re-uploaded to Gumroad).

### 2.4 Category map

Built from the evidence above. Editable in `src/data/categories.ts`.

| Shop category | Typical products |
|---|---|
| Packaging | boxes, pouches, sachets, tins, paper bags, labels |
| Bottles & Jars | cosmetic, dropper, pump, beverage, pharma |
| Cans & Drinks | aluminium cans, cups, cartons |
| Branding & Stationery | business cards, letterheads, logo scenes |
| Print & Publishing | flyers, posters, books, magazines |
| Apparel | t-shirts, hoodies, caps, totes |
| Mugs & Lifestyle | mugs, tumblers, everyday objects |
| Devices & Tech | phones, USB drives, software boxes |
| Signage & Outdoor | billboards, shop signs, banners |
