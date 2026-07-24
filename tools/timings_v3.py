"""v3: smoother Richard take (with-timestamps), segment frames + alignment dump.

EXACT SAME script text as timings.py — only voice_settings changed for a
smoother, less hesitant delivery. Never prints the key.
"""
import base64
import json
import sys
import urllib.request
import urllib.error
from pathlib import Path

TOOLS = Path(__file__).parent
KEY_FILE = Path(r"C:\Users\E Sykes\Documents\quickkick-bot\keys.txt")
VOICE_ID = "NFL5OTl0loQWZD1dgxyn"  # Richard

NARRATION = (
    "Welcome to ROOTLINE — a Black-owned network where the culture owns the stage. "
    "Here's how you join the line. "
    "One — claim your channel; your name, your home. "
    "Two — upload and package your work, film, sound, flavor, story. "
    "Three — declare your rights; your masters stay yours. "
    "Four — we process it, with receipts on every decision. "
    "Five — publish and get paid, up to ninety percent, every dollar accounted for. "
    "The line starts here."
)

# sentence -> segment mapping (seg1 gets sentences 1+2; steps 1-5 -> seg2-6; end -> seg7)
SENTENCES = [
    "Welcome to ROOTLINE — a Black-owned network where the culture owns the stage.",
    "Here's how you join the line.",
    "One — claim your channel; your name, your home.",
    "Two — upload and package your work, film, sound, flavor, story.",
    "Three — declare your rights; your masters stay yours.",
    "Four — we process it, with receipts on every decision.",
    "Five — publish and get paid, up to ninety percent, every dollar accounted for.",
    "The line starts here.",
]
SEG_OF_SENTENCE = [1, 1, 2, 3, 4, 5, 6, 7]

# smoother delivery settings (v3) — less hesitation, still natural
VOICE_SETTINGS = {
    "stability": 0.42,
    "similarity_boost": 0.78,
    "style": 0.15,
    "use_speaker_boost": True,
}


def main():
    key = KEY_FILE.read_text(encoding="utf-8").splitlines()[0].strip().lstrip("﻿")
    body = {
        "text": NARRATION,
        "model_id": "eleven_multilingual_v2",
        "voice_settings": VOICE_SETTINGS,
    }
    req = urllib.request.Request(
        f"https://api.elevenlabs.io/v1/text-to-speech/{VOICE_ID}/with-timestamps",
        data=json.dumps(body).encode(), method="POST")
    req.add_header("xi-api-key", key)
    req.add_header("Content-Type", "application/json")
    try:
        with urllib.request.urlopen(req, timeout=180) as r:
            data = json.loads(r.read())
    except urllib.error.HTTPError as e:
        print(f"failed: HTTP {e.code} {e.read()[:200]}", file=sys.stderr)
        sys.exit(3)

    audio = base64.b64decode(data["audio_base64"])
    out = TOOLS / "voiceover_final.mp3"
    out.write_bytes(audio)
    print(f"saved voiceover_final.mp3 ({len(audio)} bytes) — timings match THIS take")

    al = data["alignment"]
    chars = al["characters"]
    starts = al["character_start_times_seconds"]
    ends = al["character_end_times_seconds"]
    text = "".join(chars)
    total = ends[-1]
    print(f"audio total (alignment): {total:.2f}s")

    # dump alignment + sentence spans so gap analysis can classify mid-sentence
    # vs between-sentence pauses
    spans = []
    pos = 0
    seg_bounds = {}
    for i, s in enumerate(SENTENCES):
        idx = text.find(s, pos)
        if idx < 0:
            print(f"WARN sentence {i} not found verbatim; falling back to search from 0")
            idx = text.find(s)
        seg = SEG_OF_SENTENCE[i]
        t0 = starts[idx]
        t1 = ends[idx + len(s) - 1]
        spans.append({"i": i, "seg": seg, "t0": t0, "t1": t1, "text": s})
        if seg not in seg_bounds:
            seg_bounds[seg] = [t0, t1]
        else:
            seg_bounds[seg][1] = t1
        pos = idx + len(s)
        print(f"  sent {i} -> seg{seg}: {t0:6.2f}s - {t1:6.2f}s  {s[:45]}")

    (TOOLS / "scratch").mkdir(exist_ok=True)
    TOOLS.joinpath("scratch/alignment_v3.json").write_text(json.dumps({
        "total": total,
        "sentences": spans,
        "characters": chars,
        "starts": starts,
        "ends": ends,
    }))

    segs = sorted(seg_bounds)
    frames = {}
    for j, seg in enumerate(segs):
        t0 = seg_bounds[seg][0]
        if j + 1 < len(segs):
            t1 = seg_bounds[segs[j + 1]][0]
        else:
            t1 = total + 0.80  # let end card linger past last word
        dur = t1 - t0
        frames[seg] = max(30, round(dur * 30))
        print(f"seg{seg}: {t0:6.2f}s -> {t1:6.2f}s  dur={dur:5.2f}s  frames={frames[seg]}")

    total_frames = sum(frames.values())
    print(f"total frames={total_frames} -> video {total_frames/30:.2f}s vs audio {total:.2f}s")
    TOOLS.joinpath("seg_frames.json").write_text(json.dumps(frames))


if __name__ == "__main__":
    main()
