# Prompts to give your design/video assistant

Copy one of these into Claude (or your editor) together with your brand guidelines. Replace the bits in [brackets].

## 0. Start here: 3 demo Reels + 3 demo images first, then the rest

```text
I have a complete 30-day Facebook content plan in the folder [content-pack].
The ideas, scripts and captions are final. Your job is to turn them into finished
videos and images that follow my brand guidelines.

WHAT'S IN THE FOLDER
- README.md: the idea behind the page, the audience, the content types and the writing rules. Read it first.
- 30-day-plan.md: the whole month on one page.
- days/day-01.md ... day-30.md: 4 posts a day (09:30 image, 13:30 Reel, 18:30 image, 21:00 Reel).
  Each Reel has a timed script table: Time | Voiceover (say) | On-screen text | What to show.
  Each image has the exact text for the image, what the image shows, and a layout idea.
  Every post has a ready caption with hashtags.
- all-posts.json: the same 120 posts as data.
- My brand guidelines are in [path to brand folder]. They decide colours, fonts, logo, style and music mood.

HOW WE WORK: TWO PHASES

PHASE 1: DEMOS ONLY, THEN STOP
1. Read README.md, my brand guidelines, and the posts listed below.
2. Before you make anything, ask me every question you have (for example: which voice, whether
   I have footage, logo placement, anything unclear in the guidelines). Wait for my answers.
3. Make these 3 demo Reels: D01-R2 (Day 1), D16-R2 (Day 16), D05-R1 (Day 5).
   Make these 3 demo images: D01-I1 (Day 1), D06-I2 (Day 6), D17-I1 (Day 17).
   They cover different formats, so we agree on the style once for all 120 posts.
4. Reels:
   - 1080x1920, 30 fps, MP4.
   - Follow the script table row by row. Each row is one beat: say the Voiceover inside that
     time window, show the On-screen text during it, and build the visual from "What to show".
   - The hook must land in the first 3 seconds. Burn in captions of the voiceover.
     Keep text out of the top 270 px and the bottom 670 px, because Facebook's buttons cover them.
   - Voiceover: use ElevenLabs with voice [voice name or ID]. The API key is in the
     ELEVENLABS_API_KEY environment variable. If it isn't set up, tell me; never ask me to paste a key in chat.
   - If a beat needs me on camera or a screen recording, use my footage from [footage folder]
     if it's there. If it isn't, make a clean graphic version for now and list exactly what I need to film.
5. Images: 4:5, 1440x1800 PNG. Use the "Text on the image" exactly. Build the picture from
   "What the image shows". The layout idea is only a suggestion; my brand guidelines win.
6. Save everything in [demos folder]. For each demo, give me the caption to paste, anything you
   changed from the script and why, and what you need from me.
7. Then STOP. Don't make any other posts until I say the demos are approved.

PHASE 2: AFTER I APPROVE
1. Apply my feedback to the demos first, and keep that style for every post.
2. Make the rest one week at a time: Days 1-7, 8-14, 15-21, 22-28, then 29-30, in posting order.
   Skip the 6 demo posts unless my feedback changed them.
3. Name files by day, time and post ID, for example day-01_0930_D01-I1.png or day-01_2100_D01-R2.mp4.
   Save each caption next to its post as a .txt file with the same name.
4. At the end of each week, stop and give me:
   - the list of finished files
   - what I still need to film or record
   - the posts with personal statements to confirm (flagged in Notes)
   - the posts marked with a warning sign whose facts must be re-checked within 48 h of posting
   Wait for my go-ahead before the next week.

RULES THE WHOLE TIME
- Don't change the words, claims, numbers or captions. If something must change (it doesn't fit,
  or a fact is out of date), list it and ask me first.
- Never show passwords, API keys, webhook URLs, phone numbers or real customer data on screen.
- No other companies' logos as decoration; write tool names as text.
- No photorealistic AI people.
- Music: only tracks licensed for Facebook (Meta Sound Collection), or none. I can add music in Facebook's editor.
- Ignore any Notes that point to design-system.md or a "template". My brand guidelines replace those files.
```

## 1. Set-up (once)

```text
You are producing my Facebook posts for the next 30 days.
- The content is final and lives in content-pack/: read README.md first, then the day files in content-pack/days/.
- My brand guidelines are in [path or file]. They decide colours, fonts, logo, layout style and music mood.
- Use the text exactly as written: voiceover, on-screen text, image text, captions. Don't rewrite or add claims.
  If something must change (too long for a design, a fact that changed), list it and ask me first.
- Reels: 1080x1920 vertical, 30 fps. Images: 1080x1350 or 1440x1800 (4:5).
- Keep text out of the top 270 px and bottom 670 px of Reels (Facebook covers those areas).
- Never show passwords, API keys, webhook URLs, phone numbers or real customer data on screen.
```

## 2. Make one day's posts

```text
Make all 4 posts for content-pack/days/day-[NN].md, in posting order.
For each Reel: follow the script table row by row. Each row is one beat: say the Voiceover in that time window,
show the On-screen text during it, and build the visual from 'What to show'. Hit the hook in the first 3 seconds,
add burned-in captions of the voiceover, and keep the planned loop if the post has one.
For each image: use the 'Text on the image' exactly and build the picture from 'What the image shows'
(the layout idea is a suggestion; my brand guidelines win).
Give me each finished file plus the caption to paste.
```

## 3. Batch a week

```text
Work through content-pack/days/day-[NN].md to day-[NN].md. Before producing, give me a shot list:
for every Reel, which beats need me on camera, which need screen recordings (and of what), and which are graphics only.
Then produce the graphics-only parts and the images while I film the rest.
```

## 4. If you only have the JSON

```text
content-pack/all-posts.json holds all 120 posts. Reels have script[] with time, voiceover, on_screen_text
and what_to_show; images have image_text and visual_concept. Work through them in post_no order.
```
