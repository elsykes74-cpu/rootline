"""ROOTLINE intro voiceover via ElevenLabs. Never prints the API key."""
import json
import sys
import urllib.request
import urllib.error
from pathlib import Path

TOOLS = Path(__file__).parent
KEY_FILE_PRIMARY = Path(r"C:\Users\E Sykes\Documents\quickkick-bot\keys.txt")
KEY_FILE_FALLBACK = Path(r"C:\Users\E Sykes\Documents\maya-agent\app\.env")

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
    try:
        line = KEY_FILE_PRIMARY.read_text(encoding="utf-8").splitlines()[0]
        key = line.strip().lstrip("﻿")
        if key:
            return key, "keys.txt line 1"
    except Exception:
        pass
    try:
        for line in KEY_FILE_FALLBACK.read_text(encoding="utf-8").splitlines():
            if line.startswith("ELEVENLABS_API_KEY="):
                return line.split("=", 1)[1].strip(), "maya-agent .env"
    except Exception:
        pass
    raise SystemExit("No ElevenLabs key found in either location")


def api(method, url, key, body=None, out_path=None):
    req = urllib.request.Request(url, method=method)
    req.add_header("xi-api-key", key)
    data = None
    if body is not None:
        data = json.dumps(body).encode()
        req.add_header("Content-Type", "application/json")
    try:
        with urllib.request.urlopen(req, data=data, timeout=120) as r:
            payload = r.read()
    except urllib.error.HTTPError as e:
        return None, e.code, e.read()[:300].decode("utf-8", "replace")
    if out_path:
        out_path.write_bytes(payload)
        return payload, 200, None
    return payload, 200, None


def main():
    key, source = load_key()
    print(f"key loaded from: {source} (length {len(key)})")

    payload, code, err = api("GET", "https://api.elevenlabs.io/v1/voices", key)
    if code != 200:
        print(f"voices list failed: HTTP {code} {err}", file=sys.stderr)
        sys.exit(2)
    voices = json.loads(payload)["voices"]

    # Preference order: deep, warm, confident male voices
    PREFS = ["adam", "antoni", "arnold", "bill", "marcus", "james", "brian", "sam"]
    chosen = None
    for pref in PREFS:
        for v in voices:
            if pref in v["name"].lower():
                chosen = v
                break
        if chosen:
            break
    if not chosen:
        chosen = voices[0]
    print(f"voice chosen: {chosen['name']} (id {chosen['voice_id']})")
    print("available voices:", ", ".join(v["name"] for v in voices))

    body = {
        "text": NARRATION,
        "model_id": "eleven_multilingual_v2",
        "voice_settings": {"stability": 0.55, "similarity_boost": 0.75},
    }
    url = f"https://api.elevenlabs.io/v1/text-to-speech/{chosen['voice_id']}"
    out = TOOLS / "voiceover.mp3"
    payload, code, err = api("POST", url, key, body=body, out_path=out)
    if code != 200:
        print(f"tts failed: HTTP {code} {err}", file=sys.stderr)
        sys.exit(3)
    print(f"saved: {out} ({out.stat().st_size} bytes)")


if __name__ == "__main__":
    main()
