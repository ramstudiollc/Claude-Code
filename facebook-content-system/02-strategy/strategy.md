# 30-day content strategy: practical AI + n8n automation

**Page:** Asif (facebook.com/Asif.myself.page) · **Plan window:** Mon 12 Oct → Tue 10 Nov 2026 (Day 1–30) · **Volume:** 120 posts = 60 Reels + 60 images, exactly 2 + 2 every day.

## 1. Goals for the 30 days

| Goal | Primary metric (Insights) | Healthy target to aim for* |
|---|---|---|
| Reach new people | Reel views from non-followers; 3-second hold | Hold rate ≥ 60% of viewers past 3 s |
| Keep them watching | Average watch % per Reel | ≥ 45% on 30–45 s Reels |
| Become worth saving | Saves ÷ reach (images especially) | Rising week over week |
| Earn shares | Shares ÷ reach | Rising week over week |
| Generate n8n leads | Messenger conversations starting with "AUTOMATE" | First qualified leads by Week 3 |

\*Targets are working benchmarks to compare your own weeks against, not industry facts. The 7–14 day trend matters more than any single post.

## 2. Positioning in one sentence

> **"I build automations for real businesses, and I'll show you the useful parts for free: the exact prompt, the exact workflow, and what it can't do."**

Audience priority: (1) F-commerce and small-business owners, the n8n buyers; (2) freelancers and young professionals, the reach and share engine; (3) students, the save engine. Full reasoning is in `01-research/page-audit.md`.

## 3. Content pillars

| Code | Pillar | Share of 120 | Job in the funnel |
|---|---|---|---|
| PA | **Practical AI**: prompting and everyday use | 26 (22%) | Reach + saves; builds "this guy knows" |
| AU | **Automation & n8n**: concepts, workflows, builds | 31 (26%) | Authority; educates future buyers |
| HF | **Hidden features & tool discoveries** | 11 (9%) | Novelty; shares |
| WF | **Workflows & productivity systems** | 15 (12%) | Saves; relatability |
| LIT | **AI literacy**: myths, mistakes, safety | 15 (12%) | Trust; shares to family and friends |
| NEWS | **Current developments → what it means for you** | 6 (5%) | Timeliness; capped because news ages |
| SVC | **Work with me**: n8n services, proof, process | 16 (13%) | Conversion via Messenger |

*(Final counts are computed and printed by `tools/build.py`; see `07-qc/qc-report.md`.)*

**Rhythm:** Week 1 is mostly trust and quick wins (only 2 service posts). Service content gets denser from Week 2 to Week 5, never more than 2 service posts on one day and never two days of service-only Reels in a row.

## 4. Signature series (recognition + repeat viewing)

| Series | Format | What the viewer learns to expect |
|---|---|---|
| **Explain It Simply** | Diagram Reels | One technical word, one local analogy, < 40 s, loopable |
| **Steal This Prompt** | Prompt-card images | A copy-paste prompt with a fill-in-the-blank part |
| **Automate This** | n8n demo Reels | A real workflow: trigger → steps → result, in plain words |
| **AI Myth Check** | Myth vs fact | A common belief, the evidence, what to do instead |
| **Hidden Button** | Phone/desktop demo | A feature most people never found |
| **What It Means For You** | News | What changed, who gets it, what to do |
| **Build Log** | Asif's real builds | Behind the scenes of client-style workflows |
| **Before → After** | Split screen | Same task, old way vs AI way |

Use a consistent **series tag** in the top-left corner of images and in the first 1 s of Reels (small label, 40 px, accent colour).

## 5. Format mix

**Reels (60):** talking head + screen demo · phone-in-hand demo · diagram/motion explainer · before/after split · POV skit · green screen over a source or screenshot · numbered list. Both Reels on a day always use different formats, and no Reel format runs 3 days in a row (both checked by `tools/build.py`). Every Reel has a planned visual change every 1.5–3 s.

**Images (60):** prompt card · cheat sheet · decision tree · flow diagram · checklist · myth vs fact · comparison table · glossary card · "hidden button" with UI mock · news card · framework card. All are single images, 4:5, one idea each.

## 6. Voice and writing rules

1. **Outcome first.** The first sentence tells the viewer what they get.
2. **Plain English for second-language readers.** Sentences ≤ 15 words where possible. No idioms, no puns, no slang that doesn't translate.
3. **Specific beats general.** Name the button, paste the prompt, count the steps.
4. **Show the limit.** Say who can use it (plan, country) and what it can't do.
5. **First person, calm, practical.** "I use this", "I built this". No shouting, no fake urgency.
6. **Banned words** (checked automatically): unlock, elevate, leverage, seamless, robust, game-changer/game-changing, revolutionize, supercharge, delve, cutting-edge, innovative, world-class, "in today's fast-paced world", harness, unleash, skyrocket, next level, mind-blowing, insane.
7. **No invented numbers.** Every statistic comes from `data/sources.yaml`. Any example number is labelled as an example ("say you spend 20 minutes a day…").
8. **No photorealistic AI people.** Use real footage of Asif, real screens and designed graphics. Any AI-made realistic media gets Meta's AI-disclosure toggle.
9. **No pet phrases.** No caption ending or closing Reel line is used more than twice (checked automatically). Use "X, not Y" contrasts and "Here's…" openers sparingly; they are the fastest giveaway of machine-written copy.

## 7. CTA policy

| Content type | Allowed CTA | Example from the plan |
|---|---|---|
| Reference (prompts, checklists, frameworks) | Save, phrased for the moment of use | "Use it on the next bank letter, school notice or client brief that lands on you." (D15-I1) |
| Relatable / safety | Share to a specific person | "Send this to your family group tonight." (D10-R1) |
| Experience / opinion | A question about the viewer's own life | "What keeps slipping for you every week?" (D26-R1) |
| Series content | Follow, sparingly (5 posts) | "Follow for the next Explain It Simply." (D04-R1) |
| Strong standalone value | **No CTA** (12 posts) | The takeaway is the last line (D12-I1: "Context beats costume.") |
| Build demos (AU) | **Soft service line**, caption only (6 posts) | "Need something like this for your business? I build custom n8n automations." (D09-R2) |
| Service posts (SVC) | **Hard service CTA**, max 1 per day (12 posts) | "Have a repetitive task you want to automate? Message me." (D18-R2) |

**Service balance (checked automatically):** hard "message me" CTAs only on SVC posts, at most one per day and 14 in total (the plan uses 12, on Days 3, 7, 10, 13, 16, 18, 20, 22, 24, 26, 28, 30). Soft one-line mentions only on build demos (6). **14 of 30 days carry no service CTA at all**, so the page reads as a teacher who also builds, not as an ad.

**Never:** comment-bait ("comment YES"), tag-bait, share-bait, fake scarcity, links in the post body (Meta's link-limit test). Put links in the first comment if one is truly needed.

**Messenger handling:** in Meta Business Suite → Inbox → Automations, set a keyword reply for **AUTOMATE** (if available on your Page). It should acknowledge the message, ask 3 qualifying questions (what task, which tools, how often), and promise a human reply within 24 h. Asif replies personally. The service promise is a **quick yes/no + approach**, not free consulting.

## 8. Retention playbook (applied to every Reel)

**Human-first arc (every post):** human problem → consequence → curiosity → useful solution → demonstration → result. Each post records its `human_problem` and a one-sentence `takeaway` (≤ 25 words, the answer to "what did I just learn?"). Each Reel also records its `open_loop` (the question the viewer is holding) and its `payoff` (where in the script that question is answered, with timestamps checked against the runtime).

**Scroll-stop test (applied to all 60 Reels in the final pass):**
| Moment | Question | How the plan answers it |
|---|---|---|
| 1 s | Would I stop? | A recognisable situation on screen (a 2:07 AM message, a blinking router, a pile of receipts) |
| 3 s | Do I know why this matters to me? | The hook names the viewer's problem or a surprising consequence |
| 5–8 s | Am I curious enough to stay? | An open loop: the fix, the "why" or the "who can use it" is held back |
| Middle | Is it moving? | A visible change each beat (node lights, card slides, before → after) |
| End | Was it worth it? | The payoff answers the opening question, often by calling back to the first frame |
| After | Save, share, comment? | One natural action, or none when the takeaway speaks for itself |

**Retention drivers.** Every Reel still documents ≥ 5 genuine reasons to keep watching (`hook` · `curiosity` · `usefulness` · `relatability` · `novelty` · `problem_solution` · `visual_progression` · `payoff` · `rewatch` · `save_share`), but they describe what the Reel actually does. They are not tricks bolted on.

**Hook patterns used (rotated; checked for generic openers):**
1. *A specific moment:* "Two AM: “Price?” You reply at ten." (D03-R2)
2. *Personal surprise:* "AI gave me a source. It doesn't exist." (D02-R2)
3. *Consequence:* "One wrong AI reply can cost a customer." (D15-R2)
4. *Recognition question:* "Router blinking red? Don't type it. Show it." (D02-R1)
5. *Honest contradiction:* "I build automations. Every one will break." (D11-R2)
6. *Shared memory → new idea:* "Remember when every phone needed a different charger?" (D25-R2)
7. *Demonstration promise:* "Draw a messy box. Get a finished flyer." (D22-R1)
8. *Local analogy:* "JSON is a tiffin box with labels." (D30-R1)

Banned openers (checked automatically): "Today I…", "Here are…", "Did you know…", "AI is changing…", hooks ending in "Watch/Try/Do this", and more than one hook ending in "Here's why/how".

**Pacing rules (checked automatically):**
- Spoken pace ≤ 2.8 words/second per beat, ≤ 2.6 on average (≈ 155 wpm, comfortable for second-language listeners).
- On-screen text ≤ 10 words per beat; key words only, never full sentences of narration.
- First visual change within 2 s; no static shot longer than 4 s.
- The hook is spoken **and** on screen within the first 3 s, with a face or a recognisable situation visible.

**Loop playbook (kept in 5 Reels where it genuinely helps: D01-R1, D10-R1, D12-R2, D30-R1, D30-R2):**
- **Sentence loop:** the last line ends mid-thought and the first line completes it ("Skip it, and…" → "your AI stays generic until you add this.").
- **Visual loop:** the last frame matches the first (same framing, same object) so the replay feels continuous.
- **Question loop:** the end asks the question the opening answers.
- Loops are used on short concept Reels (20–40 s). Never on long demos, where they feel like a trick. Two earlier loops (D04-R1, D14-R1) were removed because a clear payoff line served the viewer better.

## 9. The n8n service funnel

```
Free value (PA/HF/WF/LIT)  →  Automation education (AU)  →  Proof (Build Log)  →  Offer (SVC)  →  Messenger "AUTOMATE"
     ~55% of posts                ~28%                         real workflows       ~13%            qualify → call → build
```

- **Proof before pitch.** Every service Reel shows a real workflow or a concrete process, never a generic ad.
- **Buyer language.** Talk about outcomes owners feel: "customers wait", "orders get lost", "I copy-paste every morning". Avoid "AI agents orchestration".
- **Honest scope.** Each service post says what automation *won't* fix (bad processes, unclear prices, products people don't want).
- **No invented clients or results.** Demos are labelled "demo" when they use test data.

## 10. Weekly arcs

| Week | Days | Arc |
|---|---|---|
| 1 | 1–7 | Foundations and quick wins: prompting fixes, automation basics, first proof (Messenger build) |
| 2 | 8–14 | Real workflows: CV, proposals, meetings, first n8n builds, safety |
| 3 | 15–21 | Deeper automation: approvals, digests, failure modes, website assistant, buyer education |
| 4 | 22–28 | Use cases by business type, MCP/agents, Facebook creator rules, service process, the Friday review habit (Day 26 is a Friday) |
| 5 | 29–30 | Wrap-up: right-tool map, comment-to-Messenger rules, the open offer |

## 11. Measurement and iteration (15 minutes, every Monday)

1. Insights → Content → sort Reels by **average watch time %**. For the top 3 and bottom 3, note the hook formula and format.
2. Sort images by **saves**. Note the format (prompt card, checklist, etc.).
3. Count Messenger "AUTOMATE" conversations and which post triggered them (ask: "which post brought you here?").
4. **Adjust next week:** swap 2 underperforming formats for repeat versions of the top format, keeping the topic list. The calendar CSV has a `status` column for this.
5. Never chase a one-day spike. Use 7–14 day trends (Meta's own advice).

## 12. Accuracy and risk rules

- Every claim about a product, plan, price, country or date is sourced in `data/sources.yaml`. Anything marked `volatile: true` is re-checked within 48 h of publishing (see `06-production/workflow.md` → "Pre-flight check").
- News posts state **who can use it today** (plan, region).
- Safety and legal-adjacent posts (contracts, scams) say "not legal or financial advice" where relevant.
- No third-party video clips. No third-party images except official product UI captured from your own screen (allowed for commentary and teaching) or properly licensed assets (see `06-production/sourcing-and-licensing.md`).
