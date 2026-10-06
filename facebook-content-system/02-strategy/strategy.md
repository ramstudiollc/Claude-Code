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
| HF | **Hidden features & tool discoveries** | 10 (8%) | Novelty; shares |
| WF | **Workflows & productivity systems** | 15 (12%) | Saves; relatability |
| LIT | **AI literacy**: myths, mistakes, safety | 15 (12%) | Trust; shares to family and friends |
| NEWS | **Current developments → what it means for you** | 7 (6%) | Timeliness; capped because news ages |
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

## 7. CTA policy

| Content type | Allowed CTA | Example |
|---|---|---|
| Reference (prompts, checklists, frameworks) | Save | "Save this for the next time AI gives you a vague answer." |
| Relatable / safety | Share to a specific person | "Send this to the person in your family who answers every unknown call." |
| Opinion / experience | A genuine question | "Which task would you automate first: orders, replies, or reports?" |
| Series content | Follow for the series | "Follow for the next 'Explain It Simply'." Max 1 in 5 posts. |
| Automation / service | Message keyword | "Message me 'AUTOMATE' and tell me the task. I'll tell you if it can be automated." |

**Never:** comment-bait ("comment YES"), tag-bait, share-bait, fake scarcity, links in the post body (Meta's link-limit test). Put links in the first comment if one is truly needed.

**Messenger handling:** in Meta Business Suite → Inbox → Automations, set a keyword reply for **AUTOMATE** (if available on your Page). It should acknowledge the message, ask 3 qualifying questions (what task, which tools, how often), and promise a human reply within 24 h. Asif replies personally. The service promise is a **quick yes/no + approach**, not free consulting.

## 8. Retention playbook (applied to every Reel)

**The 10 retention drivers.** Every Reel lists ≥ 5 in its script block, each with a reason:
`hook` · `curiosity` (an information gap) · `usefulness` (immediately usable) · `relatability` · `novelty` · `problem_solution` · `visual_progression` · `payoff` · `rewatch` · `save_share`

**Hook formulas used (rotated; no formula more than ~8 times):**
1. *Mistake → fix:* "Your AI answers are generic because you answer first."
2. *Contrast:* "Same prompt. Two answers. One line made the difference."
3. *Hidden thing:* "There's a button on your phone that…"
4. *Direct problem:* "If customers message you at 2 AM, watch this."
5. *Myth:* "AI detectors don't work. Here's the proof."
6. *Number with a payoff:* "Five signs a task should never be done by hand again."
7. *POV:* "POV: it's 9 AM and you're copy-pasting the same order list. Again."
8. *Simple question:* "What actually is a webhook? Think of a doorbell."

**Pacing rules (checked automatically):**
- Spoken pace ≤ 2.8 words/second per beat, ≤ 2.6 on average (≈ 155 wpm, comfortable for second-language listeners).
- On-screen text ≤ 10 words per beat; key words only, never full sentences of narration.
- First visual change within 2 s; no static shot longer than 4 s.
- The hook is spoken **and** on screen in the first 2.5 s, with the face visible.

**Loop playbook (used in 7 Reels, marked `loop:`; all are short concept Reels):**
- **Sentence loop:** the last line ends mid-thought and the first line completes it ("…and that's why you should never let AI answer first." → "Your AI answers are generic because you answer first").
- **Visual loop:** the last frame matches the first (same framing, same object) so the replay feels continuous.
- **Question loop:** the end asks the question the opening answers.
- Loops are used on short concept Reels (20–40 s). Never on long demos, where they feel like a trick.

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
