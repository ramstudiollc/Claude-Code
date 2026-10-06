# Page audit: what we could verify, and how to audit the rest in 15 minutes

## 1. Access status (stated honestly)

| Source | Status | What it gave us |
|---|---|---|
| facebook.com/Asif.myself.page | **Blocked** by this environment's network policy (facebook.com, about.fb.com and developers.facebook.com are all denied) | Nothing directly. The page's posts, visuals and metrics could not be read. |
| Web search for the page | No indexed results for "Asif.myself.page" | Suggests a new or small page, or one that isn't indexed |
| Google Drive (connected) | Searched for scripts, reels and content calendars | **No previous Facebook/Instagram scripts found.** The "script" files are Apps Script automations and 3D work reports. |
| n8n instance (connected, read-only) | 32 workflows listed; 2 production workflows inspected (node structure only) | **Strong proof material for the "hire me for n8n" posts** (see section 3) |
| RAM Studio LLC fact base | Read | Business context: Dhaka studio; "AI & Automation" is one of 7 services |

**So the "previous content critique" below is built from (a) the weaknesses that show up most in this niche, and (b) a 15-minute self-audit you run on your last 30 posts.** Paste your results into the scoring grid. If the scores show a pattern this plan doesn't address, tell me and I'll adjust the calendar.

## 2. Positioning (recommended)

**Who Asif is on this page:** *a builder who automates real businesses with n8n and AI, and shows you the useful parts for free.*

- **Not** an AI news channel (too crowded, ages fast).
- **Not** a "10 tools" curator (low trust, low retention).
- **Is** the person who says "here's the exact prompt / the exact workflow / the exact setting, and here's what it can't do."

**Audience (in priority order):**
1. **Small-business and F-commerce owners** who sell through a Facebook Page, Messenger and WhatsApp. They are the n8n buyers.
2. **Freelancers and young professionals** who want to work faster with AI. They become the reach and share engine.
3. **Students** who use AI to study. Highest volume; drives saves.

**Language:** the scripts are written in simple, ESL-friendly English (short sentences, no idioms). Turn on Meta AI translation to **Bengali** for talking-head Reels so local viewers can watch dubbed versions. If your current audience mainly comments in Bangla, tell me and I'll produce Bangla versions of the scripts and captions.

## 3. Assets you already have (from your n8n instance)

These are real builds, so the service posts can show proof instead of claims. Feature descriptions below match the workflows' actual nodes. Don't claim more than this on camera.

| Workflow (as named in n8n) | What it verifiably does | Used in posts |
|---|---|---|
| Facebook Messenger AI Auto Reply | Verifies Meta's webhook signature, ignores echoes, replies with an AI agent that keeps per-customer conversation memory, short replies | Reel D03-R2 |
| Production WhatsApp AI Client Manager | Receives WhatsApp Cloud API messages, creates/loads a client record, loads the last 5 conversation summaries, detects language + intent (inquiry, complaint, order…), replies in the customer's language, saves memory | Reel D22-R2 |
| TG→Drive ① / ② | Every few minutes moves new archive files from a Telegram channel to Google Drive, verifies size + MD5, skips duplicates, crash-safe; a second workflow backfills old posts | Reel D13-R2 |
| AI Social Media Content Creation and Auto Publisher, Pinterest AI Auto Publisher | Content publishing pipelines | Reel D24-R2 (confirm current behaviour before filming) |
| Website AI Agent – Master Workflow, AI Google Calendar Assistant, Lead_Gen_Comment, B2B AI Leads | Website assistant, calendar assistant, comment lead capture, B2B leads | Service menu image D07-I1 (names only; confirm features) |

**Filming rule for every workflow shot:** never show credential fields, tokens, webhook URLs, phone numbers or customer data. Collapse or crop any "Config" or "Set" node that holds keys. Use the n8n canvas zoomed to node names only, or re-run with fixture/demo data.

## 4. The 15-minute self-audit (run it once, before Day 1)

Open your last 30 posts. Score each from 0–2 on the eight criteria below and total the columns.

| # | Criterion | 0 | 1 | 2 |
|---|---|---|---|---|
| 1 | **Hook**: first line/frame says what the viewer gets | Greeting or vague | Topic named | Outcome named in ≤ 2 s |
| 2 | **One idea** | 3+ ideas | 2 ideas | 1 idea, fully delivered |
| 3 | **Proof** | Claim only | Screenshot | Live demo or real result |
| 4 | **Plain language** | Jargon unexplained | Some jargon | A 15-year-old would follow |
| 5 | **Currency** | Outdated feature or name | Unchecked | Verified, dated |
| 6 | **Visual pacing** (Reels) | Static > 5 s | Change every 3–5 s | Purposeful change every 1.5–3 s |
| 7 | **Save/share reason** | None | Weak | Clear (prompt, checklist, "send to…") |
| 8 | **CTA fit** | Bait or none | Generic "follow" | Matches the content |

**Read the totals:**
- Criterion 1 averages < 1 → your hooks are the bottleneck. This plan's hooks go first in every script.
- Criterion 2 averages < 1 → **information overload**, the most common problem in AI content. This plan uses one idea per post.
- Criterion 5 has any 0 → archive or update those posts, since outdated AI posts damage trust.
- Criterion 8 shows bait → stop now. Meta demotes it.

## 5. The weaknesses we designed against (with a rewrite example)

The most common problems in AI/automation pages, and the fix built into this plan:

| Weakness | Typical symptom | Fix in this plan |
|---|---|---|
| Information overload | "7 ways to use ChatGPT" in 30 s | One method per Reel; images ≤ 75 words |
| Weak hooks | "Hi guys, today I'll show you…" | Outcome or tension in the first sentence, spoken + on screen |
| Unclear explanations | "Use an API to connect the webhook" | "Explain It Simply" series with local analogies |
| Generic wording | "AI is changing everything" | Specific: button names, real prompts, real step counts |
| No relatability | Enterprise examples | Messenger orders, CVs, client messages, exams |
| Weak visual direction | Static talking head for 40 s | Every script has timed visual changes |
| Poor CTA strategy | "Like, share, follow" on everything | CTA rules in `02-strategy/strategy.md` §7 |
| Outdated info | Old feature names | Every tool claim is dated and sourced; re-check volatile items 48 h before posting |
| Sounds AI-generated | "Unlock the power of…" | Banned-word list checked automatically by `tools/build.py` |
| Information without a reason to care | Feature tour | Every post states the problem first |

**Rewrite example (the same topic, weak vs strong):**

> **Weak:** "Hello everyone! Today we will learn about prompt engineering. Prompt engineering is very important in the AI era. There are many techniques like role prompting, few-shot prompting, chain of thought…" *(No outcome, three ideas, jargon, no proof, greeting.)*
>
> **Strong (Day 1, Reel 1):** "Your AI answers are generic because you answer first. Do the opposite. Type: *Before you start, ask me 5 questions.*" → live demo → better answer side by side → "…and that's why it should ask first." *(Outcome in 2 s, one idea, proof, plain words, loops back to the hook.)*
