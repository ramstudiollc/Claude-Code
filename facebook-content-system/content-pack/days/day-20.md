# Day 20 · Saturday 31 October 2026

**This week's focus (Days 15–21):** Deeper automation: approvals, digests, failure modes, a website assistant, buyer education

| Time (BST) | Type | Post | Topic |
|---|---|---|---|
| 09:30 | Image | D20-I1 | ChatGPT Library: pull files from your cloud drive with @ |
| 13:30 | Reel | D20-R1 | Snap a receipt, get a spreadsheet row (Telegram bot + n8n) |
| 18:30 | Image | D20-I2 | Before you automate: is your business ready? |
| 21:00 | Reel | D20-R2 | A website chat that only answers from your documents (RAG explained) |

---

## 09:30 · Image · D20-I1: ChatGPT Library: pull files from your cloud drive with @

**Series:** Hidden Button · **Content type:** Hidden features & tools · **Format:** Hidden feature card

- **The problem it solves:** Downloading files from Drive or Dropbox just to upload them into ChatGPT.
- **The idea:** Since Sept 2026, ChatGPT's Library connects Google Drive, Dropbox, Box and SharePoint; add files with @ or 'Add from Library'.
- **What they leave with:** ChatGPT's Library can pull files from Google Drive, Dropbox, Box and SharePoint with an @ mention.
- **Call to action:** No CTA (the takeaway is the ending): None. Ends with a privacy and plan check.

**Text on the image** (use exactly)

- Headline: Stop downloading files just to show ChatGPT
- Body:
  - Library connects Google Drive, Dropbox, Box and SharePoint (Sept 2026).
  - Type @ in a chat to add a file, or use Add from Library.
  - Ask: “Compare these two quotes.” No downloading needed.
  - Only connect accounts you're comfortable sharing.
- Footer: Features vary by plan. Check your ChatGPT settings.

**What the image shows:** Chat input with '@' and a dropdown of file icons from four cloud services (drawn, no logos).

**Layout idea** (your brand guidelines decide colours and fonts): Light background. Drawn chat input with an '@' and a dropdown listing 3 generic file icons. Rows below. Footer small.

**Caption** (copy and paste)

```text
Still downloading files just to upload them to ChatGPT? It can now pull them straight from your cloud storage.

Since 10 Sept 2026, ChatGPT's Library connects Box, Dropbox and SharePoint, alongside Google Drive. Once connected:
• type @ in a chat to add a file, or use “Add from Library”
• ask: “Compare these two quotes” or “Summarise the changes in v2”, no downloading needed

Only connect accounts you're comfortable sharing, and check what's available on your plan.

#ChatGPT #productivity #AItips
```

**Notes:** Re-check the release note and plan availability the day before posting. Draw UI; no third-party logos.

**Sources:** [ChatGPT — Release Notes](https://help.openai.com/en/articles/6825453-chatgpt-release-notes) (OpenAI Help Center, 2026-09) ⚠️ re-check within 48 h of posting

---

## 13:30 · Reel · D20-R1: Snap a receipt, get a spreadsheet row (Telegram bot + n8n)

**Series:** Automate This · **Content type:** Automation & n8n · **Format:** Phone-in-hand demo + canvas inserts · **Length:** 48 s

- **The problem it solves:** Losing receipts and spending month-end piecing your expenses back together.
- **The idea:** A Telegram bot built in n8n reads receipt photos with AI, validates numbers, asks when unsure, logs to Sheets and confirms.
- **Hook (first 3 s):** Month end. Receipts everywhere. Again.
- **What the viewer wants to know:** How does a photo become a correct spreadsheet row?
- **Where it pays off:** 11.5–41 s: AI reads it, checks the numbers, asks when unsure, logs it and confirms; month-end totals are ready.
- **What they leave with:** A Telegram bot built in n8n can turn receipt photos into checked spreadsheet rows and ask you when it's unsure.
- **Call to action:** Soft service line: Soft service line in the caption only.
- **Overall look:** Mostly phone-in-hand: snapping a real receipt, sending it to the bot, getting the confirmation; brief canvas and sheet inserts between.

**Video script** (times in seconds; say the voiceover word for word)

| Time | Voiceover (say) | On-screen text | What to show |
|---|---|---|---|
| 0-3 | Month end. Receipts everywhere. Again. | Receipts everywhere. Again. | A messy pile of receipts on a desk; Asif picks one up and snaps it. |
| 3-7 | So I send each one to a Telegram bot instead. | Snap → bot → sheet | Canvas overview. |
| 7-11.5 | I send a photo. The workflow receives it instantly. | 1 · Photo arrives | Telegram trigger node. |
| 11.5-17 | An AI model reads it: shop, date, total, and a category. | 2 · AI reads shop · date · total | Extracted fields shown as a simple card. |
| 17-22 | Then a check: is the total a real number? Is the date valid? | 3 · Check the numbers | IF node with two conditions. |
| 22-27 | If something's unclear, the bot asks me instead of guessing. | Unclear? It asks. | Bot message: 'I can't read the total. What was it?' |
| 27-31.5 | Then it adds the row to my Google Sheet. | 4 · Add to the sheet | Row appears. |
| 31.5-36 | And replies: “Saved, 850 taka, groceries. Correct?” | “Saved: Tk 850 · Groceries” | Bot reply on phone. |
| 36-41 | Month end, the totals are already there. No pile of receipts. | Month end: done | Sheet summary with totals by category. |
| 41-45 | Which messy pile would you hand to a bot? | Your messy pile? | Asif to camera. |
| 45-48 | Follow for more builds. | Follow | End card. |

**Why people keep watching**
- Hook: Starts from the month-end receipt mess everyone recognises, then shows the photo-to-row fix.
- Relatability: Everyone loses receipts; small teams track expenses badly.
- Visual progression: Photo, canvas, extracted fields, check, row, reply: six visual states.
- Novelty: A bot that asks when it can't read the total is a smart detail.
- Payoff: Month-end totals already done.

**Caption** (copy and paste)

```text
Month end. Receipts everywhere. Again. So now I send each one to a Telegram bot built in n8n:

1. Send the bot a photo of a receipt
2. An AI model reads the shop, date, total and picks a category
3. A check: is the total a real number, is the date valid?
4. If anything is unclear, the bot asks you instead of guessing
5. It adds a row to Google Sheets and replies: “Saved: Tk 850, Groceries. Correct?”

Month end, the totals are already there.

This is the kind of thing I build for clients. Ask if you want one for your team.

#n8n #Telegram #automation
```

**Notes:** Build a demo bot (Telegram Trigger → download file → AI vision model → IF → Google Sheets → Telegram reply). Use your own receipts with personal data covered. The vision step must receive the actual image file (not just a file ID). Test this before filming.

---

## 18:30 · Image · D20-I2: Before you automate: is your business ready?

**Series:** Work With Me · **Content type:** Work with me (n8n services) · **Format:** Checklist

- **The problem it solves:** Paying for automation before the business process is ready for it.
- **The idea:** Readiness = clear steps, digital data, weekly repetition, a definition of done, and an owner.
- **What they leave with:** Automation works when the task is clear, digital, weekly, has a defined end and has an owner.
- **Call to action:** Question to the viewer: Ask how many boxes viewers ticked.

**Text on the image** (use exactly)

- Headline: Before you automate: is your business ready?
- Body:
  - ☐ You can explain the task step by step.
  - ☐ The data lives somewhere digital: a sheet, inbox or form.
  - ☐ The task repeats every week.
  - ☐ You know what 'done' looks like.
  - ☐ Someone will own it after launch.
- Footer: Missing some? Fix those first.

**What the image shows:** Clipboard checklist with five boxes.

**Layout idea** (your brand guidelines decide colours and fonts): Light background. Clipboard illustration with five checkbox rows. Footer as a short bold line under the clipboard.

**Caption** (copy and paste)

```text
Before you pay anyone to automate, check that your business is ready:

☐ You can explain the task step by step
☐ The data lives somewhere digital (a sheet, an inbox, a form), not only in a notebook
☐ The task repeats every week
☐ You know what “done” looks like
☐ Someone will own it after launch

Missing some? Fix those first. It'll save you money.
How many boxes did you tick?

#automation #smallbusiness #n8n
```

**Notes:** Checklist template.

---

## 21:00 · Reel · D20-R2: A website chat that only answers from your documents (RAG explained)

**Series:** Work With Me · **Content type:** Work with me (n8n services) · **Format:** Diagram explainer + talking head · **Length:** 46 s

- **The problem it solves:** Website chatbots giving customers confident but wrong answers about your business.
- **The idea:** A retrieval-based assistant searches your files, answers only from matching passages, shows sources and hands over when the answer isn't there.
- **Hook (first 3 s):** Most website chatbots guess. This one reads first.
- **What the viewer wants to know:** How does it know what to say about my business?
- **Where it pays off:** 7.5–27 s: search your files, pick matching parts, answer only from those, hand over if not found.
- **What they leave with:** A retrieval-based assistant answers only from your documents and hands over to a person when the answer isn't there.
- **Call to action:** Message me (service): Message 'AUTOMATE' and send your FAQ.
- **Overall look:** Website chat widget → document icons → highlighted paragraphs → answer with source tag → human fallback.

**Video script** (times in seconds; say the voiceover word for word)

| Time | Voiceover (say) | On-screen text | What to show |
|---|---|---|---|
| 0-3 | Most website chatbots guess. This one reads first. | Guessing bot vs reading bot | Website chat widget answers 'Do you deliver to Chattogram?' |
| 3-7.5 | Normal chatbots answer from the internet, or make things up. | Normal bots: guess | Example of a wrong generic answer. |
| 7.5-12 | This one searches your files first. Price list, policies, FAQs. | 1 · Search your files | Document icons. |
| 12-17 | It picks the few paragraphs that match the question. | 2 · Pick matching parts | Paragraphs highlight. |
| 17-22 | Then it answers using only those, and can show where it came from. | 3 · Answer from those only | Answer with 'Source: Delivery policy' tag. |
| 22-27 | Not in your documents? It says so, and offers a human. | Not found → a human | Fallback message. |
| 27-32 | The technical name is RAG: retrieval, then generation. Find, then answer. | RAG = find, then answer | Two-step diagram. |
| 32-37 | Update the price list, and the answers update too. No retraining. | Update a file → answers update | File edit → new answer. |
| 37-42 | Want one for your website or page? Message me AUTOMATE. | Message: AUTOMATE | Asif to camera. |
| 42-46 | Send me your FAQ. I'll show you. | Send your FAQ | End card. |

**Why people keep watching**
- Hook: Contrasts a common annoyance (bots that guess) with a better approach in one line.
- Problem → solution: Shows a normal bot guessing, then the document-grounded approach.
- Visual progression: Documents → highlighted passages → sourced answer → fallback, each step visible.
- Novelty: Explains 'RAG' in plain words, a term many have heard but few understand.
- Payoff: Updating a price list instantly updates answers, a concrete business benefit.

**Caption** (copy and paste)

```text
Most website chatbots guess. This one reads your documents first, and answers only from them.

How it works:
1. Searches your files first: price list, delivery policy, FAQs
2. Picks the few paragraphs that match the question
3. Answers using only those, and can show the source
4. Not in your documents? It says so and offers a human

The technical name is RAG (retrieval-augmented generation): find, then answer. Update your price list and the answers update too, with no retraining.

Want one for your website or page? Message me “AUTOMATE” and send your FAQ.

#AIchatbot #n8n #smallbusiness
```

**Notes:** Demo with a fictional shop's documents. If showing your 'Website AI Agent' workflow, confirm it actually retrieves document text (not just file names) before claiming 'answers from your documents'. Build a dedicated demo if needed.
