# Facebook Page publishing specs (verified 6 Oct 2026)

These specs apply to every asset in this plan. The rules in the "Use this" column are the production standard. The "Why" column says where each rule comes from.

> **How this was verified:** Meta's sites (facebook.com, about.fb.com, developers.facebook.com) are blocked for direct fetching in this research environment. Each spec below was read from Meta's own pages through search-engine retrieval and then cross-checked against at least two current third-party spec guides (updated 2026). Where Meta's ads guide and organic guidance differ, both are shown. Re-check this sheet once a quarter. Meta changes specs without notice.

## 1. Reels (all 60 videos)

| Item | Use this | Why / source |
|---|---|---|
| Format | **Every video is a Reel.** Publish through the Page's Reel composer (Meta Business Suite or the Facebook app). | Since June 2025 every new Facebook video is shared as a Reel, and the Video tab is now the Reels tab. Reels have **no length or format restriction**. [Meta, Jun 2025] |
| Aspect ratio | **9:16 vertical** | Vertical Reels beat square and horizontal on reach and retention (Emplifi study of 10,110 brand Reels, 2026). |
| Master resolution | **1080 × 1920 px** for organic posting. Export 1440 × 2560 only if a Reel will also run as an ad. | 1080×1920 is the standard organic Reels resolution (720×1280 minimum). Meta's ads guide now recommends 1440×2560 for Reels *ad* placements. |
| Frame rate | **30 fps** (keep the native rate of screen recordings; never mix 25/30/60 in one edit) | Industry standard. Mixed frame rates cause judder after Facebook re-encodes the file. |
| Codec / container | **H.264, MP4**, AAC audio 48 kHz stereo, high-profile, ~10–16 Mbps VBR | Facebook Video Requirements chart; keeps files small for upload from Bangladesh connections. |
| Length | **20–60 s by default.** 60–90 s only for step-by-step demos where every beat earns its place. | No platform cap exists any more, but retention rate is the main ranking signal. All 60 Reels in this plan run 28–51 s (median 42 s). |
| Safe zone | Keep text, faces and key UI **out of the top 14% (≈270 px), the bottom 35% (≈670 px) and 6% (≈65 px) on each side**. The safe box on 1080×1920 is **x 65–1015, y 270–1250**. | Meta Business Help Center safe-zone guidance for Reels and Stories (one shared 9:16 template since 2025). The bottom 35% is covered by the caption, the Page name, the audio label and buttons. |
| Burned-in captions | **Always on.** Bold sans, 54–64 px, white with a dark stroke or box, max 2 lines and ~32 characters per line, placed at **y 1050–1250** (just above the danger zone). | Many people scroll with sound off. Captions also help viewers whose first language isn't English. |
| Cover/thumbnail | Pick a frame or upload a 1080×1920 cover with the title inside the **centre 1080×1350**. | The Page grid and feed previews crop Reel covers toward 4:5 / 1:1. |
| Audio | Your own voice first. Background music at −20 to −24 dB under speech. Use only Meta Sound Collection or licensed tracks. | Human speech in the first 3 s lifted 10-second retention ~25% vs music-only (Emplifi 2026). Licensed audio avoids muting or blocking. |
| Person on screen | Show your face for ≥1 s within the first 3 s on most Reels. | A person on screen in the first 3 s lifted 10-second retention ~10% (Emplifi 2026). Meta's 2026 originality rules also favour an on-screen creator who adds new information. |
| Translation | Turn on **Meta AI translations** (Bengali, Hindi and others) for talking-head Reels. Review the dubbed version before keeping it on. | Meta AI can translate, dub and lip-sync Reels into Bengali and 8 other languages for free (Meta, Nov 2025 → 2026). |

## 2. Image posts (all 60 images)

| Item | Use this | Why / source |
|---|---|---|
| Aspect ratio | **4:5 portrait** | Takes up the most mobile feed space without cropping. Meta recommends 4:5 for Feed. |
| Size | **1440 × 1800 px** (design canvas). | Meta Ads Guide recommendation for 4:5 Feed images. It stays under Facebook's 2048 px long-edge limit, so Facebook won't resize it again. |
| File type | **PNG** for text graphics, **JPG (quality 90+)** for photos. sRGB colour profile. | Facebook converts uploads to JPEG. A lossless PNG source keeps text edges sharper than re-compressing a JPEG. |
| Safe margin | Keep text **≥ 90 px from every edge**. Keep the headline in the **top 60%**. | The feed preview and the Page grid can crop the edges. The headline has to read at thumbnail size. |
| Minimum text size | Headline **≥ 88 px**, body **≥ 44 px**, footnotes **≥ 32 px** (on the 1440 px canvas) | Readable on a 6-inch phone without zooming. |
| Words on the image | **Headline ≤ 10 words. Whole image ≤ 75 words.** One idea per image. | Scannable in 3–5 seconds. Long detail goes in the caption. |
| Upload | Upload from desktop / Meta Business Suite, not from a phone gallery. | Mobile uploads get compressed more. |
| AI-made visuals | Photorealistic AI images of people or scenes need the **AI disclosure** toggle (and in this plan we avoid them). | Meta requires disclosure for photorealistic digitally created or altered media. |

## 3. Captions (both formats)

| Item | Use this | Why |
|---|---|---|
| First line | **The hook, ≤ 110 characters, no hashtags, no emoji at the start.** | Mobile shows about 125 characters (depending on rendered height) before "See more". Reel captions show 1–2 lines over the video. |
| Body | Short lines. Steps or the copy-paste prompt go here. 300–900 characters is typical. | People save posts that hold the full method. |
| Keywords | Write captions in **plain words people would search for** ("automate Messenger replies", "n8n Google Sheets"). | Discovery now depends more on topic understanding and search, including Facebook's AI Mode search, than on hashtags. |
| Hashtags | **2–4**, at the end: one niche tag + one or two topic tags. | Hashtags still index but barely affect distribution. Hashtag blocks look spammy. |
| Links | **No links in the post body.** Use "Message me" (Messenger) or put a link in the first comment. | Meta is testing a limit of 2 link posts/month for Pages without a paid Meta plan (Meta Verified, or Meta One, launched Sept 2026). Links in comments aren't limited. |
| Engagement asks | Ask real questions. **Never** "comment YES", "tag a friend", "share if you agree". | Meta demotes comment, share, tag and vote bait. |

## 4. Distribution facts that shape the plan

1. **Reels are the discovery engine.** Meta's own creator guide says "start with Reels" because they reach people beyond your followers.
2. **Fresh content gets a boost.** Since Oct 2025 Facebook recommends 50% more same-day Reels. So we post daily, never in weekly dumps.
3. **Interest beats clicks.** Since Jan 2026 Facebook Reels ranking also learns from a random in-feed survey ("How well does this video match your interests?"). Staying in one clear niche matters more than chasing viral topics.
4. **Originality is enforced.** Since 2025–2026, reposts, lightly edited clips and "narrating what's already on screen" are demoted. Every Reel in this plan is filmed or designed by the page owner and adds new information.
5. **Shares and saves are strong signals.** Friend bubbles show friends' likes, and Saves were upgraded in Oct 2025. Every post in this plan has a clear save or share reason.
6. **Comment-to-Messenger rules.** A Page can send **one** private reply to a comment within **7 days**. Further messages are only possible if the person replies, which opens a 24-hour window. Plan comment-automation CTAs inside these rules.

## 5. Posting schedule (Bangladesh time, BST = UTC+6)

| Slot | Time | Asset | Rationale |
|---|---|---|---|
| 1 | 09:30 | Image | Morning commute scroll: quick, saveable reads |
| 2 | 13:30 | Reel | Lunch break, the secondary peak |
| 3 | 18:30 | Image | Early evening, people heading home |
| 4 | 21:00 | Reel | Main peak (8–11 PM BST) for maximum first-hour signal |

These are starting hypotheses from industry estimates. After 14 days, check Insights (7–14 day trends) and move the two Reel slots to the two highest-activity hours. Keep ≥ 3 hours between posts.

## Sources
- Meta Newsroom — [Making it Easier to Create Videos on Facebook (Jun 2025)](https://about.fb.com/news/2025/06/making-it-easier-create-videos-facebook/)
- Meta Business Help Center — [Text overlays and the Safe Zone for ads in Stories and Reels](https://www.facebook.com/business/help/980593475366490/)
- Meta Ads Guide — [Facebook Feed image specs](https://www.facebook.com/business/ads-guide/update/image) · [Reels specs](https://www.facebook.com/business/ads-guide/update/image/instagram-reels) · [Video Requirements Chart](https://www.facebook.com/business/m/one-sheeters/video-requirements)
- Meta Newsroom — [Finding and Sharing Reels on Facebook Just Got Easier (7 Oct 2025)](https://about.fb.com/news/2025/10/finding-sharing-reels-facebook-just-got-easier-more-fun/)
- Engineering at Meta — [Adapting the Facebook Reels RecSys AI Model Based on User Feedback (14 Jan 2026)](https://engineering.fb.com/2026/01/14/ml-applications/adapting-the-facebook-reels-recsys-ai-model-based-on-user-feedback/)
- Meta Newsroom — [Rewarding Original Creators on Facebook (Mar 2026)](https://about.fb.com/news/2026/03/rewarding-original-creators-on-facebook/)
- Meta for Creators — [How to get your content seen on Facebook](https://creators.facebook.com/how-to-get-your-content-seen-on-facebook/)
- Meta Newsroom — [Local voice translations (Nov 2025)](https://about.fb.com/news/2025/11/instagram-empowers-creators-to-go-global-with-local-voice-translations-and-fonts/)
- Meta Newsroom — [Labeling AI-Generated Content (5 Apr 2024)](https://about.fb.com/news/2024/04/metas-approach-to-labeling-ai-generated-content-and-manipulated-media/)
- Meta Newsroom — [Fighting Engagement Bait (Dec 2017)](https://about.fb.com/news/2017/12/news-feed-fyi-fighting-engagement-bait-on-facebook/)
- Meta for Developers — [Messenger Platform policy (private replies)](https://developers.facebook.com/documentation/business-messaging/messenger-platform/policy)
- Social Media Examiner — [Facebook's new link rules (2026)](https://www.socialmediaexaminer.com/what-facebooks-new-link-rules-mean-for-your-2026-strategy/) · Meta Newsroom — [Introducing Meta One (Sept 2026)](https://about.fb.com/news/2026/09/introducing-meta-one-subscription-service-more-features-ai/)
- Emplifi — [Facebook Reels: What Drives Views and Stops the Scroll (2026)](https://emplifi.io/resources/facebook-reels-data/)
- Third-party cross-checks (2026 editions): [Outfy size guide](https://www.outfy.com/blog/facebook-image-video-size-guide/), [SocialRails Reels size](https://socialrails.com/sizes/facebook/reels), [charcount.tools truncation](https://charcount.tools/platforms/facebook-character-limit), [Lilach Bullock on hashtags](https://www.lilachbullock.com/best-hashtags-for-facebook-reels/)
