# ramstudiollc.shop

The RAM Studio mockup shop. Customers **browse here** and **buy on Gumroad**.

- Plain static website built with [Astro](https://astro.build). No database, no server, no payments code.
- Every **Buy** button opens the product on Gumroad. Gumroad takes the payment and delivers the files.
- Products come from your Gumroad account with one command: `npm run sync:gumroad`.

📄 Read first: [docs/00-HANDOFF.md](docs/00-HANDOFF.md) (current task and rules), [docs/01-ANALYSIS.md](docs/01-ANALYSIS.md) (how the Asylab model works) and [docs/02-PLAN.md](docs/02-PLAN.md) (what we build, in what order).

---

## Work locally (your computer)

You need **Node.js 22 or newer** ([nodejs.org](https://nodejs.org) → LTS) and **Git** ([git-scm.com](https://git-scm.com)). Check with:

```bash
node -v   # v22.x or higher
git --version
```

First time:

```bash
git clone https://github.com/ramstudiollc/claude-code.git
cd claude-code
git checkout claude/nifty-goldberg-j75pr3   # the branch this work is on
cd ramstudiollc-shop
npm install
npm run dev
```

Open **http://localhost:4321**. The page reloads every time you save a file.

Every time after that:

```bash
cd claude-code
git pull                 # get what was done in the cloud
cd ramstudiollc-shop
npm install              # only needed if package.json changed
npm run dev
```

When you are done, send your changes back so the cloud copy has them:

```bash
git add -A
git commit -m "Describe what you changed"
git push
```

> Windows: use **Git Bash** or **PowerShell** — the commands are the same.

## Work in the cloud

Two options, both use the same GitHub repo:

1. **Claude Code on the web** (what we used to start): open a session on this repo and ask for changes. Claude commits and pushes; run `git pull` locally to get them.
2. **GitHub Codespaces**: on GitHub press **Code → Codespaces → Create**. The `.devcontainer` folder installs Node 22 and runs `npm install` for you. Then run `npm run dev` inside `ramstudiollc-shop/`.

**Rule that keeps local and cloud in step:** always `git pull` before you start and `git push` when you stop.

## Commands

| Command | What it does |
|---|---|
| `npm run dev` | Start the site at http://localhost:4321 with live reload |
| `npm run build` | Build the final website into `dist/` |
| `npm run preview` | Serve the built `dist/` folder to check it |
| `npm run sync:gumroad` | Download all your Gumroad products into `src/data/products.json` |
| `npm run sync:gumroad:dry` | Show what the sync would write, change nothing |
| `npm run audit -- <url>` | Measure a website (fonts, sizes, spacing, sections, motion, links) → `audit/<host>/report.md` |
| `npm run qc -- --ref <ref report.json> --ours <our report.json> --map tools/audit/qc-map.json` | Score our site against the reference; 95% = pass |

## Connect your Gumroad

1. Gumroad → **Settings → Advanced → Applications** → create an application → **Generate access token**.
2. In `ramstudiollc-shop/`, copy `.env.example` to `.env` and paste the token after `GUMROAD_ACCESS_TOKEN=`.
   `.env` is git-ignored — the token never goes to GitHub.
3. Run `npm run sync:gumroad`. The yellow "Sample catalogue" bar disappears and your real products show.
4. Commit `src/data/products.json` so the cloud and the live site get the same catalogue.

Tags you add on Gumroad control the site:

| Gumroad tag | Effect on the site |
|---|---|
| `cat:packaging` | Puts the product in that category (slugs: `packaging`, `bottles-jars`, `cans-drinks`, `branding`, `print`, `apparel`, `lifestyle`, `devices`, `outdoor`) |
| `format:psd` | Shows "PSD" as file format. Add one tag per format. |
| `bundle` | Lists it under Bundles |
| `featured` | Marks it as featured |
| `hidden` | Keeps it on Gumroad but off the site |
| `no-all-access` | Excludes it from the All-Access Pass |

No `cat:` tag? The script guesses the category from the product name (e.g. "bottle" → Bottles & Jars).

## Change things

| I want to… | Edit |
|---|---|
| Set the Gumroad store link, membership link, social links | `src/config/site.ts` |
| Add specs, an "editable features" list or extra images to one product | `src/data/overrides.json` (key = product slug) |
| Rename or add a category | `src/data/categories.ts` |
| Change brand colours or fonts | top of `src/styles/global.css` |
| Change home page sections | `src/pages/index.astro` |
| Change the product page layout | `src/pages/mockups/[slug].astro` |
| Switch Buy to Gumroad's pop-up checkout | `checkout: 'overlay'` in `src/config/site.ts` |

Extra product images: put them in `public/images/products/<slug>/` and list them in `overrides.json`, e.g.
`"kraft-pouch-mockup": { "images": ["/images/products/kraft-pouch-mockup/01.jpg"] }`.

## Put it online at ramstudiollc.shop

Any static host works. Recommended: **Cloudflare Pages** (free, fast, easy DNS).

| Setting | Value |
|---|---|
| Repository | `ramstudiollc/claude-code` |
| Root directory | `ramstudiollc-shop` |
| Build command | `npm run build` |
| Output directory | `dist` |
| Node version | `22` (env var `NODE_VERSION=22`) |

Then add the custom domain **ramstudiollc.shop** in the host's dashboard and follow its DNS instructions. Each `git push` redeploys automatically.

## Folder map

```
ramstudiollc-shop/
├── docs/                    analysis + plan
├── public/                  files served as-is (favicon, robots.txt, images)
├── scripts/sync-gumroad.mjs Gumroad → src/data/products.json
└── src/
    ├── config/site.ts       store settings (start here)
    ├── data/
    │   ├── categories.ts    the 9 shop categories
    │   ├── products.json    your real catalogue (created by the sync)
    │   ├── products.sample.json  demo catalogue used until the sync runs
    │   └── overrides.json   site-only extras per product
    ├── lib/catalog.ts       loads and sorts products
    ├── components/          header, footer, product card, buy button, filters…
    ├── layouts/Base.astro   page shell, SEO tags
    ├── pages/               one file per URL
    └── styles/global.css    colours, type, buttons
```

## Don't commit

- `.env` (your Gumroad token)
- PSD / PSB / ZIP source files — they are blocked by `.gitignore`. Keep them on Gumroad and in your Drive backup.
