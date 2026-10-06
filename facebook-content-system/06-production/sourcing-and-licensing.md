# Sourcing, evidence and licensing

The fastest safe workflow is to **make almost everything yourself**: your face, your screen, your demo data, your templates. External material shows up only as (a) facts with a cited source, or (b) short captures of an official page you're commenting on.

## 1. What each post is allowed to use

| Material | Allowed? | How |
|---|---|---|
| Your own footage, voice, screen recordings | ✅ Always | Default for all 60 Reels |
| Product UI (ChatGPT, Gemini, n8n, Facebook) captured **from your own account** | ✅ For teaching/commentary | Show only what's needed; no third-party logos as decoration; blur personal data |
| Official announcement pages (Meta, Google, OpenAI, n8n, FBI) | ✅ Briefly | Capture from your own screen, ≤ 3 s on screen, with the title and date visible. Cite in the caption. |
| Research papers / news articles | ✅ Headline + key line only | Same rule: short on-screen capture plus a caption citation. Never re-publish the full article. |
| Other creators' videos or images | ❌ | Unoriginal under Meta's 2026 rules, and a copyright risk. Describe the *idea* in your own words instead. |
| Google Images results | ❌ by default | A search result is not a licence. Trace the original source and its licence first. Most news and stock photos are copyrighted. |
| Free stock photos/video | ✅ with care | **Pexels**, **Unsplash**, **Pixabay**: free licences, no attribution required. Don't use identifiable people or brands in a way that implies endorsement. Check the current licence page before first use. |
| Icons | ✅ | **Lucide** (ISC), **Tabler Icons** (MIT), **Phosphor** (MIT). Use one set for consistency. |
| Illustrations | ✅ | **unDraw** (free, no attribution), **Open Peeps** (CC0), or draw your own simple shapes |
| Fonts | ✅ | Inter, Manrope, Noto Sans Bengali, Hind Siliguri, JetBrains Mono (all SIL Open Font License) |
| Music | ✅ | **Meta Sound Collection** (cleared for Facebook/Instagram). No trending commercial tracks in Page Reels. |
| AI-generated images | ⚠️ Limited | Only non-photorealistic graphics or clearly labelled examples (D13-I2, D21-R2). Photorealistic AI people are never used. |
| Real customer data | ❌ | Demo data only. Blur anything real that slips into a shot. |
| Voices of real people (cloning) | ❌ | Never, even for the scam skit (D10-R1 uses an actor or your own filtered voice). |

## 2. Fast, scalable research and evidence workflow

Instead of hunting screenshots post by post:

1. **One source register.** Every fact lives in `data/sources.yaml` with title, publisher, date, URL, the exact claim, and a `volatile` flag. Posts reference keys, not raw links. When a fact changes, fix it once.
2. **One evidence capture session per week (Thursday pre-flight).** Open every volatile source for next week (the list is auto-generated in `07-qc/qc-report.md`) and capture a dated full-page screenshot into `05-evidence/<post-id>/`. These captures are both your proof and your B-roll for green-screen Reels.
3. **Automated monitoring.** Point your own n8n RSS digest (D18-R1) at official blogs (Google, OpenAI, Anthropic, Meta Newsroom, n8n). New features arrive in one daily email, and that's next month's NEWS research done.
4. **Batch UI captures.** Record one long screen session per app (Gemini, ChatGPT, n8n, Meta Business Suite) with all the clicks needed for the week, then cut it into per-Reel clips. One login, one cleanup, one recording.
5. **Redaction pass before export.** Search every clip for: tokens, webhook URLs, phone numbers, emails, client names, notification pop-ups.

## 3. How to cite in a post

- In the **caption**: "Source: Meta Newsroom, Mar 2026" or name the study ("Stanford researchers… Patterns, 2023"). No links in the post body (see the link-limit test). Put a link in the first comment if someone asks.
- On **news images**: a small "Checked against official announcements, <date>" footer.
- On **Reels**: the source page visible for ≤ 3 s with its date, plus a caption citation.

## 4. Trademarks and names

Product names (ChatGPT, Gemini, n8n, WhatsApp, Facebook) are used as plain text to describe what the product does. That's normal descriptive use. Don't put logos on thumbnails or images, and don't imply partnership or endorsement.

## 5. If something goes wrong

- **Fact turned out wrong after posting:** edit the caption with a one-line correction ("Update: …"), and if the Reel itself is wrong, pin a correcting comment. Don't silently delete. Corrections build trust.
- **Rights complaint:** take the asset down first, then check. Keep the evidence folder for every post so you can respond quickly.
