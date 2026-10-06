# Demos: 3 Reels and 3 images

Finished examples built straight from the post data (`data/posts-w*.yaml`). They show how the scripts, timing, on-screen text, captions and design system look once produced. Use them as a reference for the real thing, not as the final posts.

## What's here

| File | Post | Template | Specs |
|---|---|---|---|
| `reels/D01-R2-three-boxes.mp4` | D01-R2 · Explain It Simply · "The task you repeat daily? It's three boxes." | Three boxes → n8n canvas → checklist → comment prompt | 42 s |
| `reels/D16-R2-four-part-prompt.mp4` | D16-R2 · Steal This Prompt · "Good prompts have four parts. Yours has one." | Text-led: G/C/E/F blocks fill, before/after split | 43 s |
| `reels/D05-R1-never-paste-into-ai.mp4` | D05-R1 · AI Myth Check · "You've probably pasted one of these into AI." | Numbered list cards with a 1–5 progress strip, placeholder swap | 37 s |
| `images/D01-I1-automate-delegate-delete.png` | D01-I1 · Automate This | Decision tree (dark) | 1440×1800 |
| `images/D06-I2-angry-customer-replies.png` | D06-I2 · Steal This Prompt | Before/after chat mock (light) | 1440×1800 |
| `images/D17-I1-seller-day-before-after.png` | D17-I1 · Before → After | Before/after timeline (light) | 1440×1800 |

All Reels: 1080×1920, 30 fps, H.264 High + AAC 48 kHz stereo, about −16 LUFS. Each beat starts exactly on its scripted timestamp. On-screen text sits in the 300–1000 px zone and captions in the 1050–1250 px zone. **The bottom third is left empty on purpose**, because Facebook's caption, name and buttons cover it.

## What's real and what's a stand-in

- **Voice: synthetic stand-in.** The voice-over is the open-source Kokoro-82M model (Apache-2.0, voice `am_michael`), generated offline. It is not Asif's voice and not ElevenLabs. Pace and timing match the scripts. Swap in the real voice before posting (see below).
- **Presenter: motion-graphic versions.** D01-R2 and D05-R1 are scripted as talking-head Reels. Here the face shots are replaced with graphics so the beats are easy to judge. The real posts should still be filmed by you (Meta's 2026 originality rules; see `01-research/facebook-specs.md`). D16-R2 is text-led by design, so it is close to final apart from the voice.
- **No music.** Add a track from Meta Sound Collection at −22 dB in the Facebook editor (`06-production/sourcing-and-licensing.md`). A soft click marks each new beat.
- **Example data is fictional:** the lunch shop, Tk 250, "Bright Star Traders", the contract, the masked numbers and the "Sending invoices every Friday" comment. The before/after outputs in D16-R2 are illustrative. Per the production notes, generate them live when you film.
- **Captions** are burned in with the current word highlighted. Word timings are estimated from the audio (pauses are matched to punctuation). They are close but not frame-perfect. ElevenLabs returns exact timings.
- **Page handle** shows as `@Asif.myself.page`. Change it in `tools/demo/reel.html` and `image.html` if the page name differs.

## Switch the voice to ElevenLabs

1. In the Claude Code cloud environment settings, add `api.elevenlabs.io` to **Allowed domains** (Network access → Custom, keep the package-manager defaults).
2. Add the environment variables `ELEVENLABS_API_KEY` and `ELEVENLABS_VOICE_ID` (a cloned voice of Asif works best). Never paste keys into chat or commit them.
3. Run `ENGINE=elevenlabs tools/demo/make_demos.sh`.

The ElevenLabs path uses the *text-to-speech with timestamps* endpoint, so captions sync to the exact word. It has not been run here, because the host was blocked in this environment.

## Rebuild

```bash
pip install pyyaml numpy kokoro-onnx        # voice-over (kokoro engine)
# ffmpeg with libx264, Node 18+, and Playwright's Chromium are also needed
export KOKORO_MODEL=/path/to/model_quantized.onnx   # onnx-community/Kokoro-82M-v1.0-ONNX
export KOKORO_VOICES=/path/to/voices.npz            # see below
tools/demo/make_demos.sh                    # writes build/demo/ and refreshes this folder
```

`voices.npz` packs the voice files that ship in the `kokoro-js` npm package (`voices/*.bin`, float32, shape 510×1×256):

```bash
npm pack kokoro-js && tar -xzf kokoro-js-*.tgz
python3 -c "import numpy as np, glob, os; np.savez('voices.npz', **{os.path.basename(f)[:-4]: np.fromfile(f, dtype=np.float32).reshape(-1, 1, 256) for f in glob.glob('package/voices/*.bin')})"
```

The pieces:

| Script | Does |
|---|---|
| `tools/demo/make_vo.py` | One VO clip per beat, sped up slightly (max ×1.25) if it would overrun its beat, placed on the timeline. Writes word timings and caption pages to `timeline.json` |
| `tools/demo/reel.html` | The motion templates. Each frame is a pure function of time, so renders are repeatable |
| `tools/demo/render_reel.mjs` | Drives Chromium frame by frame and pipes to ffmpeg. `--frames 30,90 --stills dir` renders review stills only |
| `tools/demo/image.html` + `render_images.mjs` | The image templates, filled from each post's `design` fields. Warns if anything crosses the 90 px margin |

To make another post, add a scene to `reel.html` (Reels) or a template to `image.html` (images), keyed by post ID or format.

## Checks done

- `ffprobe`: resolution, frame rate, codecs, exact runtimes (1260 / 1290 / 1110 frames). EBU R128 loudness about −16 LUFS, peaks about −4 dBFS.
- Every beat reviewed as stills. Fixed: on-screen text collapsing (a CSS class clash), single-word caption pages, before/after cards overlapping, a clipped context chip, the closing question overlapping the list, and a badge that appeared too late to see.
- Images reviewed at full size. Fixed: decision-tree exit tags overflowing, the chat mock cutting off the calm reply, timeline card overflow, and low-contrast footer text on the dark background.
- Copy matches the post data (D01-R2's "Box one / Box two / Box three" wording was made consistent in `data/posts-w1.yaml` at the same time).
