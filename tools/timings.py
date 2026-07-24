"""Get word timings for the narration, compute segment frame counts. Never prints the key."""
import json
import sys
import urllib.request
import urllib.error
from pathlib import Path

TOOLS = Path(__file__).parent
KEY_FILE = Path(r"C:\Users\E Sykes\Documents\quickkick-bot\keys.txt")
VOICE_ID = "CgY1SqBRXmX1mlZzsXmR"

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


def main():
    key = KEY_FILE.read_text(encoding="utf-8").splitlines()[0].strip().lstrip("﻿")
    body = {
        "text": NARRATION,
        "model_id": "eleven_multilingual_v2",
        "voice_settings": {"stability": 0.55, "similarity_boost": 0.75},
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

    import base64
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

    # locate each sentence start in the character stream
    pos = 0
    seg_bounds = {}  # seg -> [start, end]
    for i, s in enumerate(SENTENCES):
        idx = text.find(s, pos)
        if idx < 0:
            print(f"WARN sentence {i} not found verbatim; falling back to search from 0")
            idx = text.find(s)
        seg = SEG_OF_SENTENCE[i]
        t0 = starts[idx]
        t1 = ends[idx + len(s) - 1]
        if seg not in seg_bounds:
            seg_bounds[seg] = [t0, t1]
        else:
            seg_bounds[seg][1] = t1
        pos = idx + len(s)
        print(f"  sent {i} -> seg{seg}: {t0:6.2f}s - {t1:6.2f}s  {s[:45]}")

    # segment start = first sentence start; segment end = start of next segment's first sentence
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
