# Prompts to give your design/video assistant

Copy one of these into Claude (or your editor) together with your brand guidelines. Replace the bits in [brackets].

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
