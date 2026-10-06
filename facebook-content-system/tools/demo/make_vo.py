"""Voice-over + caption timeline for a demo Reel.

Reads one Reel from data/posts-w*.yaml, synthesises each beat's VO, fits it
inside the beat, estimates word timings for burned-in captions and writes:

    <out>/<ID>/beat_NN.wav     one clip per beat (48 kHz mono)
    <out>/<ID>/vo.wav          all beats placed on the timeline + soft clicks
    <out>/<ID>/timeline.json   beats, words and caption pages for the renderer

Engines
  kokoro      offline, open-source Kokoro-82M (Apache-2.0). Needs
              KOKORO_MODEL (model_quantized.onnx) and KOKORO_VOICES (.npz).
  elevenlabs  ElevenLabs text-to-speech-with-timestamps. Needs
              ELEVENLABS_API_KEY and ELEVENLABS_VOICE_ID, and network access
              to api.elevenlabs.io. Word timings come from the API.

Usage: python3 tools/demo/make_vo.py D01-R2 --out build/demo [--engine kokoro]
"""
import argparse
import base64
import json
import os
import re
import subprocess
import sys
import urllib.request
import wave
from pathlib import Path

import numpy as np
import yaml

ROOT = Path(__file__).resolve().parents[2]
SR = 48000

# Spoken form of words the TTS would otherwise misread. Captions keep the
# written form.
SAY = {
    r"\bPINs\b": "pins",
}


def load_post(pid):
    for f in sorted((ROOT / "data").glob("posts-w*.yaml")):
        data = yaml.safe_load(f.read_text())
        posts = data["posts"] if isinstance(data, dict) else data
        for p in posts:
            if p["id"] == pid:
                return p
    sys.exit(f"{pid} not found")


def spoken(text):
    for pat, rep in SAY.items():
        text = re.sub(pat, rep, text)
    return text


def run(cmd):
    subprocess.run(cmd, check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)


def read_wav(path):
    with wave.open(str(path)) as w:
        a = np.frombuffer(w.readframes(w.getnframes()), dtype=np.int16).astype(np.float32) / 32768
        return a, w.getframerate()


def write_wav(path, a, sr=SR):
    a = np.clip(a, -1, 1)
    with wave.open(str(path), "wb") as w:
        w.setnchannels(1)
        w.setsampwidth(2)
        w.setframerate(sr)
        w.writeframes((a * 32767).astype(np.int16).tobytes())


def resample(src, dst, tempo=1.0):
    af = f"aresample={SR}" + (f",atempo={tempo:.4f}" if abs(tempo - 1) > 1e-3 else "")
    run(["ffmpeg", "-y", "-i", str(src), "-af", af, "-ac", "1", str(dst)])


# ---------------------------------------------------------------- engines
class KokoroEngine:
    def __init__(self, voice):
        from kokoro_onnx import Kokoro
        self.k = Kokoro(os.environ["KOKORO_MODEL"], os.environ["KOKORO_VOICES"])
        self.voice = voice or "am_michael"

    def say(self, text, prev, nxt, dst, speed=1.0):
        a, sr = self.k.create(spoken(text), voice=self.voice, speed=speed, lang="en-us")
        tmp = dst.with_suffix(".raw.wav")
        write_wav(tmp, a, sr)
        resample(tmp, dst)
        tmp.unlink()
        return None  # no word timings; estimated from the audio later


class ElevenLabsEngine:
    URL = "https://api.elevenlabs.io/v1/text-to-speech/{}/with-timestamps?output_format=mp3_44100_128"

    def __init__(self, voice):
        self.key = os.environ["ELEVENLABS_API_KEY"]
        self.voice = voice or os.environ["ELEVENLABS_VOICE_ID"]
        self.model = os.environ.get("ELEVENLABS_MODEL", "eleven_multilingual_v2")

    def say(self, text, prev, nxt, dst, speed=1.0):
        body = {
            "text": text,
            "model_id": self.model,
            "previous_text": prev or None,
            "next_text": nxt or None,
            "voice_settings": {"stability": 0.5, "similarity_boost": 0.75, "speed": speed},
        }
        req = urllib.request.Request(
            self.URL.format(self.voice),
            data=json.dumps(body).encode(),
            headers={"xi-api-key": self.key, "Content-Type": "application/json"},
        )
        with urllib.request.urlopen(req, timeout=120) as r:
            res = json.load(r)
        mp3 = dst.with_suffix(".mp3")
        mp3.write_bytes(base64.b64decode(res["audio_base64"]))
        resample(mp3, dst)
        mp3.unlink()
        al = res.get("alignment") or res.get("normalized_alignment")
        return chars_to_words(text, al)


def chars_to_words(text, al):
    """Group ElevenLabs character timings into caption words."""
    words, cur, start, end = [], "", None, None
    for ch, s, e in zip(al["characters"], al["character_start_times_seconds"], al["character_end_times_seconds"]):
        if ch.isspace():
            if cur:
                words.append([cur, start, end])
            cur, start = "", None
            continue
        if start is None:
            start = s
        cur += ch
        end = e
    if cur:
        words.append([cur, start, end])
    return words


# ---------------------------------------------------------------- timings
def speech_bounds(a, sr):
    env = np.abs(a)
    thr = max(env.max() * 0.04, 1e-4)
    idx = np.where(env > thr)[0]
    return (idx[0] / sr, idx[-1] / sr) if len(idx) else (0.0, len(a) / sr)


def gaps(a, sr, lo, hi, min_len=0.09):
    """Silent runs inside the speech, as (start, end) seconds."""
    hop = int(sr * 0.01)
    frames = a[: len(a) // hop * hop].reshape(-1, hop)
    rms = np.sqrt((frames ** 2).mean(axis=1))
    thr = max(rms.max() * 0.06, 1e-4)
    quiet = rms < thr
    out, run_start = [], None
    for i, q in enumerate(quiet):
        t = i * hop / sr
        if q and run_start is None:
            run_start = t
        elif not q and run_start is not None:
            if t - run_start >= min_len and run_start > lo and t < hi:
                out.append((run_start, t))
            run_start = None
    return out


def weight(w):
    core = re.sub(r"[^\w]", "", w)
    n = len(core) or 1
    if re.search(r"\d", core):
        n += 3  # numbers take longer to say than to write
    return n + 1.5


def estimate_words(text, a, sr):
    """Word timings from audio. Each punctuation mark is anchored to the
    silent gap nearest to where it should fall; words between anchors share
    the time by length."""
    words = text.split()
    lo, hi = speech_bounds(a, sr)

    def pause_w(w):
        return 4.0 if re.search(r"[.?!]”?$", w) else 2.0 if re.search(r"[,:;]$", w) else 0.0

    wts = [weight(w) for w in words]
    pws = [pause_w(w) for w in words[:-1]] + [0.0]
    total = sum(wts) + sum(pws)
    cand = gaps(a, sr, lo, hi, min_len=0.06)
    anchors, used_until, acc = {}, lo, 0.0
    for i, w in enumerate(words[:-1]):
        acc += wts[i]
        if pws[i]:
            exp = lo + (hi - lo) * (acc + pws[i] / 2) / total
            best = None
            for g0, g1 in cand:
                mid = (g0 + g1) / 2
                if g0 >= used_until and abs(mid - exp) < 0.6 and (best is None or abs(mid - exp) < abs(sum(best) / 2 - exp)):
                    best = (g0, g1)
            if best:
                anchors[i] = best
                used_until = best[1]
        acc += pws[i]
    out, start, seg_t = [], 0, lo
    for end in sorted(anchors) + [len(words) - 1]:
        seg_end = anchors[end][0] if end in anchors else hi
        ws = range(start, end + 1)
        tot = sum(wts[k] for k in ws)
        t = seg_t
        for k in ws:
            d = (seg_end - seg_t) * wts[k] / tot
            out.append([words[k], t, t + d])
            t += d
        if end in anchors:
            seg_t = anchors[end][1]
        start = end + 1
    return out


WEAK_END = {"a", "an", "the", "to", "of", "in", "on", "and", "or", "with", "for", "by", "at", "your", "my", "its", "is", "you"}


def balanced(words, max_line=28):
    """Split words into the fewest balanced lines, preferring punctuation."""
    texts = [w[0] for w in words]
    n = len(texts)

    def width(i, j):
        return len(" ".join(texts[i:j]))

    total = width(0, n)
    kmin = max(1, -(-total // max_line))
    best = None
    for k in range(kmin, kmin + 2):
        target = total / k
        INF = float("inf")
        cost = [[INF] * (k + 1) for _ in range(n + 1)]
        back = [[0] * (k + 1) for _ in range(n + 1)]
        cost[0][0] = 0
        for m in range(1, k + 1):
            for j in range(1, n + 1):
                for i in range(m - 1, j):
                    if cost[i][m - 1] == INF:
                        continue
                    ln = width(i, j)
                    if ln > max_line + 2 and j - i > 1:
                        continue
                    c = cost[i][m - 1] + (ln - target) ** 2
                    last = texts[j - 1]
                    if j < n:
                        if re.search(r"[.?!]”?$", last):
                            c -= 80
                        elif re.search(r"[,:;]$", last):
                            c -= 15
                        elif last.lower() in WEAK_END:
                            c += 30
                    if c < cost[j][m]:
                        cost[j][m], back[j][m] = c, i
        if cost[n][k] < INF:
            c = cost[n][k] + (k - kmin) * 150
            if best is None or c < best[0]:
                cuts, j = [], n
                for m in range(k, 0, -1):
                    i = back[j][m]
                    cuts.append(list(range(i, j)))
                    j = i
                best = (c, cuts[::-1])
    return best[1]


def pages(words, max_line=28):
    """Caption pages (max two lines) for one beat. Pages end on sentence
    ends where possible; lines are balanced, so no line is a lone word."""
    texts = [w[0] for w in words]
    sents, cur = [], []
    for i, w in enumerate(texts):
        cur.append(i)
        if re.search(r"[.?!]”?$", w):
            sents.append(cur)
            cur = []
    if cur:
        sents.append(cur)
    width = lambda idx: len(" ".join(texts[i] for i in idx))
    out, k = [], 0
    while k < len(sents):
        s = sents[k]
        # two short sentences share a page, one per line
        if k + 1 < len(sents) and width(s) <= max_line and width(sents[k + 1]) <= max_line:
            out.append([s, sents[k + 1]])
            k += 2
            continue
        lines = [[s[0] + i for i in l] for l in balanced([words[i] for i in s], max_line)]
        out += [lines[j: j + 2] for j in range(0, len(lines), 2)]
        k += 1
    return out


# ---------------------------------------------------------------- main
def click(dur=0.045, f=2100):
    t = np.arange(int(SR * dur)) / SR
    return np.sin(2 * np.pi * f * t) * np.exp(-t * 90) * 0.18


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("id")
    ap.add_argument("--out", default=str(ROOT / "build" / "demo"))
    ap.add_argument("--engine", default="kokoro", choices=["kokoro", "elevenlabs"])
    ap.add_argument("--voice", default=None)
    args = ap.parse_args()

    post = load_post(args.id)
    out = Path(args.out) / args.id
    out.mkdir(parents=True, exist_ok=True)
    eng = KokoroEngine(args.voice) if args.engine == "kokoro" else ElevenLabsEngine(args.voice)

    beats = []
    for i, b in enumerate(post["script"]):
        s, e = (float(x) for x in str(b["t"]).split("-"))
        beats.append({"i": i, "start": s, "end": e, "vo": b["vo"], "ost": b["ost"], "vis": b["vis"]})
    runtime = float(post["runtime"])

    words, page_list, track = [], [], np.zeros(int(SR * runtime) + SR)
    for i, b in enumerate(beats):
        lead = 0.08 if i == 0 else 0.12
        slot = b["end"] - b["start"] - lead - 0.12
        prev = beats[i - 1]["vo"] if i else ""
        nxt = beats[i + 1]["vo"] if i + 1 < len(beats) else ""
        dst = out / f"beat_{i:02d}.wav"
        speed = 1.0
        timed = eng.say(b["vo"], prev, nxt, dst, speed)
        a, _ = read_wav(dst)
        dur = len(a) / SR
        if dur > slot:  # too long for the beat: say it a little faster
            speed = min(1.25, dur / slot * 1.02)
            if args.engine == "kokoro":
                timed = eng.say(b["vo"], prev, nxt, dst, speed)
            else:
                tmp = dst.with_suffix(".tmp.wav")
                dst.rename(tmp)
                resample(tmp, dst, tempo=speed)
                tmp.unlink()
                timed = [[w, s0 / speed, e0 / speed] for w, s0, e0 in timed] if timed else None
            a, _ = read_wav(dst)
            dur = len(a) / SR
        b["speed"] = round(speed, 3)
        b["vo_start"] = round(b["start"] + lead, 3)
        b["vo_end"] = round(b["start"] + lead + dur, 3)
        bw = timed if timed else estimate_words(b["vo"], a, SR)
        base = len(words)
        for w, s0, e0 in bw:
            words.append({"w": w, "s": round(b["vo_start"] + s0, 3), "e": round(b["vo_start"] + e0, 3), "beat": i})
        for pg in pages(bw):
            idx = [[base + j for j in line] for line in pg]
            page_list.append({"beat": i, "lines": idx, "s": words[idx[0][0]]["s"] - 0.05})
        p0 = int(b["vo_start"] * SR)
        track[p0: p0 + len(a)] += a
        if i:  # soft click on each new beat
            c = click()
            q = int(b["start"] * SR)
            track[q: q + len(c)] += c

    for k, pg in enumerate(page_list):
        nxt = page_list[k + 1]["s"] if k + 1 < len(page_list) else runtime
        last = words[pg["lines"][-1][-1]]["e"]
        pg["e"] = round(min(nxt, last + 1.0, runtime), 3)
        pg["s"] = round(max(pg["s"], 0), 3)

    write_wav(out / "vo.wav", track[: int(SR * runtime)])
    tl = {
        "id": post["id"], "series": post["series"], "format": post["format"], "runtime": runtime,
        "engine": args.engine, "voice": eng.voice, "beats": beats, "words": words, "pages": page_list,
    }
    (out / "timeline.json").write_text(json.dumps(tl, ensure_ascii=False, indent=1))
    for b in beats:
        print(f"  beat {b['i']:2d} {b['start']:5.1f}-{b['end']:5.1f}  vo {b['vo_start']:5.2f}-{b['vo_end']:5.2f}  x{b['speed']}")


if __name__ == "__main__":
    main()
