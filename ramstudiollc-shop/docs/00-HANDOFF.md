# 00 — Handoff: read this first

_Last updated 2026-10-11 by the cloud session. The cloud environment could not reach asylab.com, magnific.com, freepik.com, ramstudiollc.com or gumroad.com (network policy), so the work moves to the owner's Mac, which has normal internet._

## The owner's verdict on v0.1

The first version (the current `src/` site) was rated **1/100**. It was built from search results without seeing the reference site. **Treat the current visual layer as throwaway.** Keep only the plumbing that still fits: Gumroad sync (`scripts/sync-gumroad.mjs`), catalogue loader (`src/lib/catalog.ts`), `BuyButton` rule (no `href="#"`).

## The task, in the owner's order

### Step 1 — Audit the reference site in full
Reference: **https://www.asylab.com** (all pages, not just home).

Measure everything: code/stack, links (internal, outbound, Gumroad), fonts, font sizes, size ratios, perspective/visual depth, alignment, gaps, responsive behaviour of type and layout, animations and micro-animations, UX flows.

1. Run the tool (see Commands): `npm run audit -- https://www.asylab.com --pages 40 --per-template 3 --deep 8`
2. Open `audit/www.asylab.com/report.md`, the screenshots in `shots/` and the scroll videos in `video/`. Watch the videos frame by frame for motion the tool can't name (stagger order, easing feel, text-split effects, image zoom, marquee speed).
3. Write the findings, section by section, into **`docs/03-REFERENCE-SPEC.md`** (template already there). Every number in it must come from the report or a screenshot.
4. Show the owner the spec before building.

### Step 2 — Brand guideline + element inventory
- `docs/04-BRAND-GUIDELINE.md`: logo use, colours, type, spacing, radii, imagery, voice. Source: RAM Studio's own brand files — **ask the owner for the logo and brand guideline PDF** (they offered) and use ramstudiollc.com.
- `docs/05-COMPONENTS-AND-MOTION.md`: every component and animation the new site needs, with sizes, states and timing taken from the spec.
- Glassy / futuristic elements: build them ourselves in CSS/SVG/WebGL, or use RAM Studio's own files from the owner's desktop, or properly licensed packs. **Do not download graphics from asylab.com.**

### Step 3 — Catalogue and architecture plan
Source: **https://www.magnific.com/author/ramstudio** (RAM Studio's own contributor profile).
- Count products per type; list themes and niches.
- Decide categories, sub-niches, themes, how many products launch, and the page architecture (home, library, category, product, bundles, freebies, membership, blog, about/licence/FAQ).
- Product page anatomy and how each item links to its Gumroad listing.
- Write it to `docs/06-CATALOGUE-PLAN.md`.

### Step 4 — Rebuild, then QC to 95%
- Rebuild the UI to the spec. **Every piece of content must be editable** from data/config files (no text hard-coded in components). The number of products shown = the number in the catalogue data.
- Audit our build and score it:
  ```bash
  npm run build && npm run preview          # terminal 1
  npm run audit -- http://localhost:4321 --pages 40 --per-template 3 --deep 8   # terminal 2
  npm run qc -- --ref audit/www.asylab.com/report.json --ours audit/localhost-4321/report.json --map tools/audit/qc-map.json
  ```
- **≥ 95% = pass.** Below that, fix the items listed in `qc-report.md` (motion, responsiveness, spacing…) and re-run until it passes. Also compare screenshots side by side by eye.

### Step 5 — Real images
Use RAM Studio's own mockup previews from Magnific/Freepik for product images, then connect Gumroad (`npm run sync:gumroad`).

## Rules

1. **Match the system, not the files.** Match layout, grid, spacing, type scale, motion patterns and UX. Do **not** copy asylab's source code, images, illustrations, icons, 3D/glass graphics, text or logo. Words, images and logo are RAM Studio's.
2. QC scores layout, type, spacing, motion and responsiveness; brand fonts/colours are mapped in `tools/audit/qc-map.json`, not copied.
3. Facts about RAM Studio come from the owner's verified data (ramstudio-website-content skill, if installed). Never publish follower/view counts you didn't read yourself, client logos without permission, or "trusted by" marketplace walls.
4. No `href="#"`. A button without a real destination is not shown.
5. `git pull` before work, `git push` after. Branch: `claude/nifty-goldberg-j75pr3` (PR: https://github.com/ramstudiollc/Claude-Code/pull/2).

## Commands

```bash
cd ramstudiollc-shop
npm install
npx playwright install chromium     # once per computer, for the audit tool
npm run audit -- https://www.asylab.com --pages 40 --per-template 3 --deep 8
npm run dev                          # http://localhost:4321
```

Audit flags: `--pages` max pages rendered · `--per-template` pages per URL pattern (e.g. 3 product pages) · `--deep` pages measured at all 5 screen sizes · `--no-video` skip scroll recordings · `--out` output folder.

## Still needed from the owner
- Logo files (SVG/PNG) and the RAM Studio brand guideline PDF
- Gumroad store URL; Gumroad access token goes in `ramstudiollc-shop/.env` (never in chat or git)
