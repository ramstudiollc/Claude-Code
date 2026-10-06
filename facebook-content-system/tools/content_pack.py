"""Content pack: the whole 30-day plan as plain content, without design.

Called by build.py on every build. Writes content-pack/:
    README.md          the idea, what to post, rules, how to hand it to a designer/Claude
    30-day-plan.md     every day at a glance, then all 120 posts in one table
    days/day-NN.md     one file per day: the 4 posts in posting order, complete
    all-posts.json     the same 120 posts as structured data
    all-posts.csv      one row per post for spreadsheets
    HANDOFF-PROMPT.md  prompts to give a design/video assistant
"""
import csv
import json
from collections import Counter
from pathlib import Path

PILLAR_JOB = {
    "PA": "Prompting and everyday AI use people can copy today",
    "AU": "How automation and n8n work: concepts, real workflows, builds",
    "HF": "Features most people never found, in tools they already use",
    "WF": "Repeatable systems for work and study",
    "LIT": "Myths, mistakes and safety, so people trust you",
    "NEWS": "What changed in AI this week and what it means for the viewer",
    "SVC": "Your n8n service: proof, process and the offer",
}
ARCS = [
    (1, 7, "Foundations and quick wins: prompting fixes, automation basics, first proof (a Messenger build)"),
    (8, 14, "Real workflows: CV, proposals, meetings, first n8n builds, safety"),
    (15, 21, "Deeper automation: approvals, digests, failure modes, a website assistant, buyer education"),
    (22, 28, "Use cases by business type, MCP and agents, Facebook creator rules, your service process, the Friday review habit"),
    (29, 30, "Wrap-up: the right-tool map, comment-to-Messenger rules, the open offer"),
]
CTA_LABEL = {
    "save": "Save", "share": "Share", "question": "Question to the viewer", "follow": "Follow",
    "message": "Message me (service)", "soft": "Soft service line", "none": "No CTA (the takeaway is the ending)",
}
SLOT_LABEL = {"I1": "09:30 · Image", "R1": "13:30 · Reel", "I2": "18:30 · Image", "R2": "21:00 · Reel"}


def cell(s):
    return str(s or "").replace("|", "\\|").replace("\n", "<br>")


DRIVER_LABEL = {"save_share": "Saves and shares", "problem_solution": "Problem → solution"}


def human(key):
    return DRIVER_LABEL.get(key, key.replace("_", " ").capitalize())


def arc(day):
    return next((a, b, t) for a, b, t in ARCS if a <= day <= b)


def caption_with_tags(p):
    tags = " ".join("#" + h.lstrip("#") for h in p.get("hashtags", []))
    return (p["caption"].rstrip() + ("\n\n" + tags if tags else "")).strip()


def src(p, sources):
    out = []
    for k in p.get("sources") or []:
        s = sources[k]
        out.append({"title": s["title"], "publisher": s["publisher"], "date": str(s["date"]), "url": s["url"],
                    "recheck_before_posting": bool(s.get("volatile"))})
    return out


# ---------------------------------------------------------------- per post
def reel_md(p, pillars, sources):
    L = [f"## {SLOT_LABEL[p['slot']]} · {p['id']}: {p['topic']}", ""]
    L.append(f"**Series:** {p['series']} · **Content type:** {pillars[p['pillar']]} · **Format:** {p['format']} · **Length:** {p['runtime']} s")
    L.append("")
    L.append(f"- **The problem it solves:** {p['human_problem']}")
    L.append(f"- **The idea:** {p['main_idea']}")
    L.append(f"- **Hook (first 3 s):** {p['hook']}")
    L.append(f"- **What the viewer wants to know:** {p['open_loop']}")
    L.append(f"- **Where it pays off:** {p['payoff']}")
    L.append(f"- **What they leave with:** {p['takeaway']}")
    L.append(f"- **Call to action:** {CTA_LABEL[p['cta_type']]}: {p['cta']}")
    L.append(f"- **Overall look:** {p['visual_concept']}")
    if p.get("loop"):
        L.append(f"- **Loop:** {p['loop']}")
    L.append("")
    L.append("**Video script** (times in seconds; say the voiceover word for word)")
    L.append("")
    L.append("| Time | Voiceover (say) | On-screen text | What to show |\n|---|---|---|---|")
    for b in p["script"]:
        L.append(f"| {b['t']} | {cell(b.get('vo'))} | {cell(b.get('ost'))} | {cell(b.get('vis'))} |")
    L.append("")
    L.append("**Why people keep watching**")
    for k, v in p["retention"].items():
        L.append(f"- {human(k)}: {v}")
    L.append("")
    L.append("**Caption** (copy and paste)")
    L.append("")
    L.append("```text\n" + caption_with_tags(p) + "\n```")
    L.append("")
    L.append(f"**Notes:** {p['production_notes']}")
    s = src(p, sources)
    if s:
        L.append("")
        L.append("**Sources:** " + " · ".join(f"[{x['title']}]({x['url']}) ({x['publisher']}, {x['date']})"
                                              + (" ⚠️ re-check within 48 h of posting" if x["recheck_before_posting"] else "") for x in s))
    return "\n".join(L)


def image_md(p, pillars, sources):
    d = p["design"]
    L = [f"## {SLOT_LABEL[p['slot']]} · {p['id']}: {p['topic']}", ""]
    L.append(f"**Series:** {p['series']} · **Content type:** {pillars[p['pillar']]} · **Format:** {p['format']}")
    L.append("")
    L.append(f"- **The problem it solves:** {p['human_problem']}")
    L.append(f"- **The idea:** {p['main_idea']}")
    L.append(f"- **What they leave with:** {p['takeaway']}")
    L.append(f"- **Call to action:** {CTA_LABEL[p['cta_type']]}: {p['cta']}")
    L.append("")
    L.append("**Text on the image** (use exactly)")
    L.append("")
    L.append(f"- Headline: {d['headline']}")
    if d.get("subhead"):
        L.append(f"- Subhead: {d['subhead']}")
    L.append("- Body:")
    for b in d["body"]:
        L.append(f"  - {b}")
    if d.get("footer"):
        L.append(f"- Footer: {d['footer']}")
    L.append("")
    L.append(f"**What the image shows:** {p['visual_concept']}")
    L.append("")
    L.append(f"**Layout idea** (your brand guidelines decide colours and fonts): {d['layout']}")
    L.append("")
    L.append("**Caption** (copy and paste)")
    L.append("")
    L.append("```text\n" + caption_with_tags(p) + "\n```")
    L.append("")
    L.append(f"**Notes:** {p['production_notes']}")
    s = src(p, sources)
    if s:
        L.append("")
        L.append("**Sources:** " + " · ".join(f"[{x['title']}]({x['url']}) ({x['publisher']}, {x['date']})"
                                              + (" ⚠️ re-check within 48 h of posting" if x["recheck_before_posting"] else "") for x in s))
    return "\n".join(L)


def as_record(p, pillars, sources):
    r = {
        "post_no": p["post_no"], "id": p["id"], "day": p["day"], "date": p["date"].isoformat(),
        "weekday": f"{p['date']:%A}", "time_bst": p["time"], "type": p["type"], "series": p["series"],
        "content_type": pillars[p["pillar"]], "format": p["format"], "topic": p["topic"],
        "problem_it_solves": p["human_problem"], "objective": p["objective"], "hook": p["hook"],
        "main_idea": p["main_idea"], "value": p["value"], "takeaway": p["takeaway"],
        "cta_type": p["cta_type"], "cta": p["cta"], "visual_concept": p["visual_concept"],
        "caption": p["caption"].rstrip(), "hashtags": ["#" + h.lstrip("#") for h in p.get("hashtags", [])],
        "notes": p["production_notes"], "sources": src(p, sources),
    }
    if p["type"] == "reel":
        r.update({"length_s": p["runtime"], "open_loop": p["open_loop"], "payoff": p["payoff"],
                  "loop": p.get("loop") or None, "why_people_keep_watching": dict(p["retention"]),
                  "script": [{"time": str(b["t"]), "voiceover": b.get("vo"), "on_screen_text": b.get("ost"),
                              "what_to_show": b.get("vis")} for b in p["script"]]})
    else:
        d = p["design"]
        r["image_text"] = {"headline": d["headline"], "subhead": d.get("subhead"), "body": d["body"], "footer": d.get("footer")}
        r["layout_idea"] = d["layout"]
    return r


# ---------------------------------------------------------------- pack files
def write_pack(posts, sources, pillars, root: Path, start):
    out = root / "content-pack"
    (out / "days").mkdir(parents=True, exist_ok=True)
    by_day = {}
    for p in posts:
        by_day.setdefault(p["day"], []).append(p)
    end = posts[-1]["date"]

    # days/day-NN.md
    for day, ps in sorted(by_day.items()):
        a, b, t = arc(day)
        L = [f"# Day {day} · {ps[0]['date']:%A %d %B %Y}", ""]
        L.append(f"**This week's focus (Days {a}–{b}):** {t}")
        L.append("")
        L.append("| Time (BST) | Type | Post | Topic |\n|---|---|---|---|")
        for p in ps:
            L.append(f"| {p['time']} | {p['type'].capitalize()} | {p['id']} | {cell(p['topic'])} |")
        L.append("")
        for p in ps:
            L.append("---")
            L.append("")
            L.append(reel_md(p, pillars, sources) if p["type"] == "reel" else image_md(p, pillars, sources))
            L.append("")
        (out / "days" / f"day-{day:02d}.md").write_text("\n".join(L))

    # 30-day-plan.md
    L = ["# The 30-day plan at a glance", ""]
    L.append(f"{start:%a %d %b %Y} → {end:%a %d %b %Y} · 4 posts a day · times are Bangladesh Standard Time (BST, UTC+6). "
             "Each day's full content (scripts, on-image text, captions) is in `days/day-NN.md`.")
    L.append("")
    for a, b, t in ARCS:
        L.append(f"## Days {a}–{b}: {t}")
        L.append("")
        L.append("| Day | Date | 09:30 Image | 13:30 Reel | 18:30 Image | 21:00 Reel |\n|---|---|---|---|---|---|")
        for day in range(a, b + 1):
            ps = {p["slot"]: p for p in by_day[day]}
            L.append(f"| [{day}](days/day-{day:02d}.md) | {ps['I1']['date']:%a %d %b} | "
                     + " | ".join(cell(ps[s]["topic"]) for s in ("I1", "R1", "I2", "R2")) + " |")
        L.append("")
    L.append("## All 120 posts")
    L.append("")
    L.append("| # | Day | Time | Type | Series | Content type | Format | Hook | CTA |\n|---|---|---|---|---|---|---|---|---|")
    for p in posts:
        L.append(f"| {p['post_no']} | {p['day']} | {p['time']} | {p['type'].capitalize()} | {cell(p['series'])} | "
                 f"{pillars[p['pillar']]} | {cell(p['format'])} | {cell(p['hook'])} | {CTA_LABEL[p['cta_type']]} |")
    (out / "30-day-plan.md").write_text("\n".join(L) + "\n")

    # all-posts.json / .csv
    recs = [as_record(p, pillars, sources) for p in posts]
    (out / "all-posts.json").write_text(json.dumps(recs, ensure_ascii=False, indent=1))
    cols = ["post_no", "day", "date", "weekday", "time_bst", "id", "type", "series", "content_type", "format", "topic",
            "hook", "takeaway", "cta_type", "cta", "length_s", "script_text", "image_text", "caption", "hashtags"]
    with open(out / "all-posts.csv", "w", newline="", encoding="utf-8") as f:
        w = csv.DictWriter(f, fieldnames=cols)
        w.writeheader()
        for r in recs:
            row = {k: r.get(k, "") for k in cols}
            if r["type"] == "reel":
                row["script_text"] = "\n".join(f"[{b['time']} s] VO: {b['voiceover']} | TEXT: {b['on_screen_text']} | SHOW: {b['what_to_show']}" for b in r["script"])
            else:
                it = r["image_text"]
                row["image_text"] = "\n".join(x for x in [it["headline"], it.get("subhead")] + it["body"] + [it.get("footer")] if x)
            row["hashtags"] = " ".join(r["hashtags"])
            w.writerow(row)

    # README.md
    reels = [p for p in posts if p["type"] == "reel"]
    images = [p for p in posts if p["type"] == "image"]
    pc = Counter(p["pillar"] for p in posts)
    sc = Counter(p["series"] for p in posts)
    rf = Counter(p["format"] for p in reels)
    imf = Counter(p["format"] for p in images)
    cc = Counter(p["cta_type"] for p in posts)
    runtimes = sorted(p["runtime"] for p in reels)
    L = ["# Content pack: the 30-day plan without the design", ""]
    L.append("Everything to **say and show** for 30 days of Facebook posts, as plain text: the idea, the plan, every Reel script "
             "and every image's text and caption. Design (colours, fonts, templates) is left to your own brand guidelines.")
    L.append("")
    L.append("## The idea")
    L.append("")
    L.append("> **\"I build automations for real businesses, and I'll show you the useful parts for free: the exact prompt, "
             "the exact workflow, and what it can't do.\"**")
    L.append("")
    L.append("The page becomes the place people go for practical AI and n8n automation they can use the same day. Most posts "
             "teach for free; a smaller share shows your real builds and process, so business owners who want it done for them "
             "message you. Audience, in order: (1) F-commerce and small-business owners (your n8n buyers), (2) freelancers and young "
             "professionals (reach and shares), (3) students (saves).")
    L.append("")
    L.append("## What gets posted")
    L.append("")
    L.append(f"- **{len(posts)} posts in 30 days** ({start:%a %d %b} → {end:%a %d %b %Y}): **{len(reels)} Reels + {len(images)} images**, every day:")
    L.append("  - 09:30 image · 13:30 Reel · 18:30 image · 21:00 Reel (Bangladesh time)")
    L.append(f"- **Reels:** {runtimes[0]}–{runtimes[-1]} s (median {runtimes[len(runtimes) // 2]} s), voiced by you, captions on screen, one clear idea each.")
    L.append("- **Images:** single 4:5 images, one idea each, 75 words or fewer on the image.")
    L.append("")
    L.append("### 7 types of content")
    L.append("")
    L.append("| Content type | Posts | What it is |\n|---|---|---|")
    for k, n in sorted(pc.items(), key=lambda x: -x[1]):
        L.append(f"| {pillars[k]} | {n} | {PILLAR_JOB[k]} |")
    L.append("")
    L.append("### Recurring series (so people recognise and come back)")
    L.append("")
    L.append(" · ".join(f"**{s}** ({n})" for s, n in sc.most_common()))
    L.append("")
    L.append("### Formats")
    L.append("")
    L.append("**Reels:** " + " · ".join(f"{f} ({n})" for f, n in rf.most_common()))
    L.append("")
    L.append("**Images:** " + " · ".join(f"{f} ({n})" for f, n in imf.most_common()))
    L.append("")
    L.append("### How the month builds")
    L.append("")
    for a, b, t in ARCS:
        L.append(f"- **Days {a}–{b}:** {t}")
    L.append("")
    L.append("### Calls to action")
    L.append("")
    L.append(" · ".join(f"{CTA_LABEL[k]}: {cc[k]}" for k in ("save", "question", "share", "none", "message", "soft", "follow") if cc[k]))
    L.append("")
    L.append("\"Message me\" appears only on service posts, at most once a day. Many days have no sales message at all, "
             "so the page reads as a teacher who also builds, not an ad. Typical service lines: *\"Need something like this for your "
             "business? I build custom n8n automations.\"* and *\"Have a repetitive task you want to automate? Message me.\"*")
    L.append("")
    L.append("## Writing rules (already applied; keep them if you edit)")
    L.append("")
    L.append("1. Outcome first: the first sentence says what the viewer gets.")
    L.append("2. Plain English for second-language readers: short sentences, no idioms or slang.")
    L.append("3. Specific beats general: name the button, paste the prompt, count the steps.")
    L.append("4. Say the limits: who can use it and what it can't do.")
    L.append("5. First person, calm and practical. No shouting, no fake urgency, no engagement bait, no links in the post text.")
    L.append("6. No invented numbers or clients. Example figures are labelled as examples.")
    L.append("")
    L.append("## Files in this pack")
    L.append("")
    L.append("| File | Use it for |\n|---|---|")
    L.append("| `30-day-plan.md` | The whole month on one page, then all 120 posts in one table |")
    L.append("| `days/day-01.md` … `day-30.md` | **The working files.** One per day: the 4 posts in posting order. Reels have the full timed script (voiceover, on-screen text, what to show); images have the exact text and what the image shows. Every post has its caption and hashtags |")
    L.append("| `all-posts.json` | The same content as structured data, for an assistant or a script |")
    L.append("| `all-posts.csv` | One row per post for Excel or Google Sheets |")
    L.append("| `HANDOFF-PROMPT.md` | Ready-made instructions to give your design/video assistant |")
    L.append("")
    L.append("## Before you post")
    L.append("")
    L.append("- A few posts contain personal statements (\"I use…\", \"mine was…\"). Keep them only if they are true for you; each one is flagged in that post's **Notes**.")
    L.append("- Posts with ⚠️ sources mention fast-changing facts (prices, features, rules). Re-check those within 48 hours of posting.")
    L.append("- Notes that mention `design-system.md` or a template refer to the original plan's design files. Your own brand guidelines replace them.")
    L.append("")
    L.append("*Generated from `data/posts-w*.yaml` by `tools/build.py`. Edit the YAML, not these files, then rebuild.*")
    (out / "README.md").write_text("\n".join(L) + "\n")

    # HANDOFF-PROMPT.md
    H = ["# Prompts to give your design/video assistant", ""]
    H.append("Copy one of these into Claude (or your editor) together with your brand guidelines. Replace the bits in [brackets].")
    H.append("")
    H.append("## 1. Set-up (once)")
    H.append("")
    H.append("```text\nYou are producing my Facebook posts for the next 30 days.\n"
             "- The content is final and lives in content-pack/: read README.md first, then the day files in content-pack/days/.\n"
             "- My brand guidelines are in [path or file]. They decide colours, fonts, logo, layout style and music mood.\n"
             "- Use the text exactly as written: voiceover, on-screen text, image text, captions. Don't rewrite or add claims.\n"
             "  If something must change (too long for a design, a fact that changed), list it and ask me first.\n"
             "- Reels: 1080x1920 vertical, 30 fps. Images: 1080x1350 or 1440x1800 (4:5).\n"
             "- Keep text out of the top 270 px and bottom 670 px of Reels (Facebook covers those areas).\n"
             "- Never show passwords, API keys, webhook URLs, phone numbers or real customer data on screen.\n```")
    H.append("")
    H.append("## 2. Make one day's posts")
    H.append("")
    H.append("```text\nMake all 4 posts for content-pack/days/day-[NN].md, in posting order.\n"
             "For each Reel: follow the script table row by row. Each row is one beat: say the Voiceover in that time window,\n"
             "show the On-screen text during it, and build the visual from 'What to show'. Hit the hook in the first 3 seconds,\n"
             "add burned-in captions of the voiceover, and keep the planned loop if the post has one.\n"
             "For each image: use the 'Text on the image' exactly and build the picture from 'What the image shows'\n"
             "(the layout idea is a suggestion; my brand guidelines win).\n"
             "Give me each finished file plus the caption to paste.\n```")
    H.append("")
    H.append("## 3. Batch a week")
    H.append("")
    H.append("```text\nWork through content-pack/days/day-[NN].md to day-[NN].md. Before producing, give me a shot list:\n"
             "for every Reel, which beats need me on camera, which need screen recordings (and of what), and which are graphics only.\n"
             "Then produce the graphics-only parts and the images while I film the rest.\n```")
    H.append("")
    H.append("## 4. If you only have the JSON")
    H.append("")
    H.append("```text\ncontent-pack/all-posts.json holds all 120 posts. Reels have script[] with time, voiceover, on_screen_text\n"
             "and what_to_show; images have image_text and visual_concept. Work through them in post_no order.\n```")
    (out / "HANDOFF-PROMPT.md").write_text("\n".join(H) + "\n")
    return out
