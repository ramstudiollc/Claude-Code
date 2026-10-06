# Day 23 · Tuesday 03 November 2026

**This week's focus (Days 22–28):** Use cases by business type, MCP and agents, Facebook creator rules, your service process, the Friday review habit

| Time (BST) | Type | Post | Topic |
|---|---|---|---|
| 09:30 | Image | D23-I1 | Your automation's keys are passwords: 5 security rules |
| 13:30 | Reel | D23-R1 | Map the 'what if' path before you build |
| 18:30 | Image | D23-I2 | Before you launch anything, ask AI what you missed |
| 21:00 | Reel | D23-R2 | Same questions every day? Build your FAQ from your own chats |

---

## 09:30 · Image · D23-I1: Your automation's keys are passwords: 5 security rules

**Series:** Automate This · **Content type:** Automation & n8n · **Format:** Do / Don't card

- **The problem it solves:** Leaking a password or key in a screenshot or workflow without realising it.
- **The idea:** API keys, tokens and webhook URLs must be stored in credentials, never shown, minimally scoped, revoked if leaked, and verified on incoming webhooks.
- **What they leave with:** Treat API keys, tokens and webhook URLs like passwords: store them in credentials and never show them.
- **Call to action:** Share: Send it to someone who builds automations.

**Text on the image** (use exactly)

- Headline: Your automation's keys are passwords. Treat them that way.
- Body:
  - Store keys in n8n Credentials, never typed inside a node.
  - Never post a screenshot with a token or webhook URL visible.
  - Give each app only the access it needs.
  - Leaked a key? Revoke it and make a new one. Today.
  - Check incoming webhooks really come from the sender (signatures).

**What the image shows:** Key-and-padlock illustration over a two-column Do / Don't card.

**Layout idea** (your brand guidelines decide colours and fonts): Dark background. Key + padlock illustration top. Two columns: green DO (store in credentials, minimal access, verify signatures) and red DON'T (show tokens on screen, wait to revoke a leaked key). Series tag top-left.

**Caption** (copy and paste)

```text
API keys, access tokens and webhook URLs are passwords. 5 rules I follow:

1. Store them in n8n Credentials, never typed into a Set or Code node
2. Never post a screenshot or video where a token or webhook URL is visible
3. Give each app only the access it needs, nothing extra
4. Leaked a key? Revoke it and create a new one today, not “later”
5. Check that incoming webhooks really come from the sender (signature checks)

Most automation “hacks” aren't clever. Someone just found a key.

Send this to someone who builds automations.

#n8n #cybersecurity #automation
```

**Notes:** Security checklist template. This post reflects the filming rule for this whole plan: no tokens or webhook URLs on screen, ever.

---

## 13:30 · Reel · D23-R1: Map the 'what if' path before you build

**Series:** Automate This · **Content type:** Automation & n8n · **Format:** Talking head + paper drawing · **Length:** 42 s

- **The problem it solves:** Processes that work on normal days and fall apart on the unusual order.
- **The idea:** Draw the happy path, then list the what-ifs (missing address, out of stock, duplicate, voice note) and give each a rule: ask, wait or alert a person.
- **Hook (first 3 s):** Your process works. Until the address is missing.
- **What the viewer wants to know:** Which 'what ifs' should I plan for?
- **Where it pays off:** 7.5–29.5 s: four what-ifs, each given a rule: ask, wait or alert a person.
- **What they leave with:** Before building, list the 'what ifs' and give each one a rule: ask the customer, wait, or alert a person.
- **Call to action:** Question to the viewer: Ask what broke the viewer's process last time.
- **Overall look:** Overhead shot of Asif drawing boxes and branches on paper; each what-if becomes a branch with a rule tag.

**Video script** (times in seconds; say the voiceover word for word)

| Time | Voiceover (say) | On-screen text | What to show |
|---|---|---|---|
| 0-3 | Your process works. Until the address is missing. | Works… until it doesn't | Overhead: a neat three-box process drawn on paper; a sticky note 'address missing?' lands on it. |
| 3-7.5 | Everyone draws the happy path. Order comes in, sheet, confirmation. | Happy path ✓ | Three boxes drawn in a line. |
| 7.5-11.5 | Now ask: what if the address is missing? | What if: no address? | First branch drawn. |
| 11.5-15.5 | What if the item is out of stock? | What if: out of stock? | Second branch. |
| 15.5-19.5 | What if they order twice by mistake? | What if: ordered twice? | Third branch. |
| 19.5-24 | What if they write in Bangla, with a voice note? | What if: voice note? | Fourth branch. |
| 24-29.5 | For each one, pick a rule: ask the customer, wait, or alert a person. | ask · wait · alert a person | Rule tags written on each branch. |
| 29.5-34.5 | Ten minutes on paper saves days of fixing later. | 10 min on paper | Full map revealed. |
| 34.5-39.5 | This map is the first thing I ask clients to make with me. | Step 1 of every project | Asif to camera, holding the map. |
| 39.5-42 | What broke your process last time? | What broke yours? | End card. |

**Why people keep watching**
- Hook: Starts with the exact moment a normal process breaks, which every operator has lived through.
- Visual progression: The paper map grows branch by branch on camera.
- Relatability: Missing addresses, double orders and voice notes are exactly what sellers deal with.
- Usefulness: A pen-and-paper method anyone can do before building or hiring.
- Payoff: The finished map shows every branch with a clear rule, which is visually satisfying.

**Caption** (copy and paste)

```text
Your process works fine, until the address is missing.

Most automations don't break on the normal case. They break on the “what if”.

Before building, draw the happy path (order → sheet → confirmation). Then ask:
• What if the address is missing?
• What if the item is out of stock?
• What if they order twice by mistake?
• What if they send a voice note in Bangla?

For each one, pick a rule: ask the customer, wait, or alert a person.

Ten minutes on paper saves days of fixing later. It's the first thing I do with every client.

What “what if” broke your process last time?

#automation #n8n #processdesign
```

**Notes:** Overhead phone rig. Use a thick marker so lines read on mobile. Keep 'first thing I do with every client' only if true.

---

## 18:30 · Image · D23-I2: Before you launch anything, ask AI what you missed

**Series:** Steal This Prompt · **Content type:** Practical AI · **Format:** Prompt card

- **The problem it solves:** Launching something and only then noticing the obvious gap.
- **The idea:** A 4-question review prompt catches gaps, confusion, risks and complexity before launch.
- **What they leave with:** Ask AI what you forgot, what will confuse a newcomer, what could go wrong and what's too complicated.
- **Call to action:** Save: Save it.

**Text on the image** (use exactly)

- Headline: Before you launch anything, ask AI this
- Body:
  - “Here's my plan: [paste].
  - 1. What did I forget?
  - 2. What will confuse a first-time customer?
  - 3. What could go wrong in week one?
  - 4. Which part is too complicated? Make it simpler.”
- Footer: Use it on offers, events, websites and job posts.

**What the image shows:** Rocket icon with a magnifier; four question chips.

**Layout idea** (your brand guidelines decide colours and fonts): Light background. Small rocket + magnifier icon top-right. Prompt as a quote block with four numbered lines. Footer bottom.

**Caption** (copy and paste)

```text
Before you launch an offer, an event, a website or a job post, ask AI to find what you missed:

“Here's my plan: [paste].
1. What did I forget?
2. What will confuse a first-time customer?
3. What could go wrong in week one?
4. Which part is too complicated? Make it simpler.”

Question 2 is the one that saves money. You can't see your own plan like a stranger does.

#AItips #smallbusiness #planning
```

**Notes:** Prompt-card template.

---

## 21:00 · Reel · D23-R2: Same questions every day? Build your FAQ from your own chats

**Series:** Steal This Prompt · **Content type:** Workflows & productivity · **Format:** Talking head + screen split · **Length:** 44 s

- **The problem it solves:** Typing the same answers to the same customer questions every single day.
- **The idea:** Turn 30 anonymised customer chats into a grouped question list, write the true answers yourself, and let AI format an FAQ plus saved replies.
- **Hook (first 3 s):** Same questions every day? Answer them once.
- **What the viewer wants to know:** How do I find the questions and turn them into one-tap replies?
- **Where it pays off:** 8–33 s: grouped questions with counts, your true answers, a clean FAQ and saved replies.
- **What they leave with:** Turn your real customer chats into an FAQ and one-tap saved replies, writing the facts yourself.
- **Call to action:** Save: Save it for the weekend.
- **Overall look:** Vertical split: Asif talking on top; bottom half shows the inbox full of 'price?' → redaction → grouped question list with counts → FAQ doc → saved replies.

**Video script** (times in seconds; say the voiceover word for word)

| Time | Voiceover (say) | On-screen text | What to show |
|---|---|---|---|
| 0-3 | Same questions every day? Answer them once. | Answer them ONCE | Asif scrolling an inbox full of 'price?' and 'delivery?' |
| 3-8 | Copy thirty recent customer chats. Remove names and phone numbers first. | 1 · 30 chats · no names | Redaction of names and numbers. |
| 8-13.5 | Ask AI: “List the questions customers ask most, grouped, with how often.” | 2 · Top questions, grouped | AI list with counts. |
| 13.5-18 | Delivery charge. Payment options. Size. Return policy. The usual. | delivery · payment · size · returns | List items highlight. |
| 18-23 | Now you write the true answers. AI doesn't know your prices. | 3 · YOU write the facts | Typing answers. |
| 23-28 | Then: “Turn this into a clear FAQ, plus short versions for quick replies.” | 4 · FAQ + short replies | FAQ doc appears. |
| 28-33 | Save the short ones as saved replies in your inbox. One tap each. | Saved replies · 1 tap | Own screen capture of Meta Business Suite saved replies. |
| 33-38 | And that same FAQ is exactly what an AI assistant needs later. | Ready for an AI assistant | FAQ doc slides into an assistant icon. |
| 38-41 | One hour now. Faster replies every day. | 1 hour → faster every day | Asif to camera. |
| 41-44 | One hour this weekend. That's it. | 1 hour this weekend | End card. |

**Why people keep watching**
- Hook: Every page owner answers the same questions repeatedly; the promise is immediate relief.
- Relatability: 'Delivery charge?' and 'Size?' messages are universal for Facebook sellers.
- Usefulness: A step-by-step method using free tools and Meta Business Suite saved replies.
- Visual progression: Inbox, redaction, list with counts, FAQ doc, saved replies: five clear visual states.
- Payoff: The same FAQ becomes the foundation for an AI assistant later.

**Caption** (copy and paste)

```text
Answering the same questions every day? Answer them once:

1. Copy ~30 recent customer chats. Remove names and phone numbers first.
2. Ask AI: “List the questions customers ask most, grouped, with how often each comes up.”
3. Write the true answers yourself. AI doesn't know your prices or delivery areas.
4. “Turn this into a clear FAQ, plus a one-line version of each answer for quick replies.”
5. Save the one-liners as saved replies in Meta Business Suite.

Bonus: that FAQ is exactly what an AI assistant needs if you automate replies later.

One hour this weekend. Faster replies every day after.

#fcommerce #customerservice #AItips
```

**Notes:** Use fictional chats. Capture Meta Business Suite saved replies from your own account.
