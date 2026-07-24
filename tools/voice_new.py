"""Generate ROOTLINE intro voiceover with chosen voice. Never prints the key."""
import json
import sys
import urllib.request
import urllib.error
from pathlib import Path

TOOLS = Path(__file__).parent
KEY_FILE = Path(r"C:\Users\E Sykes\Documents\quickkick-bot\keys.txt")

VOICE_ID = "CgY1SqBRXmX1mlZzsXmR"  # Stryka v1 - Male black monotone deep
VOICE_NAME = "Stryka v1 - Male black monotone deep"

# EXACT SAME script text as the original pipeline (do not change timings semantics)
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


def load_key():
    return KEY_FILE.read_text(encoding="utf-8").splitlines()[0].strip().lstrip("﻿")


def main():
    key = load_key()
    body = {
        "text": NARRATION,
        "model_id": "eleven_multilingual_v2",
        "voice_settings": {"stability": 0.55, "similarity_boost": 0.75},
    }
    req = urllib.request.Request(
        f"https://api.elevenlabs.io/v1/text-to-speech/{VOICE_ID}",
        data=json.dumps(body).encode(), method="POST")
    req.add_header("xi-api-key", key)
    req.add_header("Content-Type", "application/json")
    out = TOOLS / "voiceover_new.mp3"
    try:
        with urllib.request.urlopen(req, timeout=180) as r:
            payload = r.read()
    except urllib.error.HTTPError as e:
        print(f"tts failed: HTTP {e.code} {e.read()[:300].decode('utf-8','replace')}", file=sys.stderr)
        sys.exit(3)
    out.write_bytes(payload)
    print(f"voice: {VOICE_NAME} ({VOICE_ID})")
    print(f"saved: {out} ({out.stat().st_size} bytes)")


if __name__ == "__main__":
    main()
