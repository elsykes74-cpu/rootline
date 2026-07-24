import json
import time
from pathlib import Path

import requests

ENV_PATH = Path(r"C:\Users\E Sykes\Documents\maya-agent\app\.env")
OUT_DIR = Path(r"C:\Users\E Sykes\Documents\kimi\workspace\rootline\public\audio")
API_URL = "https://api.elevenlabs.io/v1/sound-generation"

SOUNDS = [
    ("film-room", "Film Room", "cinematic ambient swell, warm strings and soft piano, film-score feel, instrumental"),
    ("afrobeats", "Afrobeats", "afrobeats instrumental groove, log drum, shakers, sunny guitar"),
    ("hip-hop", "Hip Hop", "classic boom bap beat, dusty vinyl crackle, deep 808, head-nod groove, instrumental"),
    ("hbcu-sports", "HBCU Sports", "marching band brass fanfare hit with rolling snare drums, stadium energy"),
    ("black-tech", "Black Tech", "futuristic synth pulse, clean digital arpeggio, optimistic tech ambiance, instrumental"),
    ("culture", "Culture", "warm neo-soul instrumental, rhodes chords, soft percussion, salon warmth"),
    ("soul-food", "Soul Food", "cozy kitchen ambiance, gentle sizzling, warm gospel organ chords underneath"),
    ("gospel", "Gospel", "uplifting gospel choir swell with organ, reverent and joyful"),
    ("style", "Style", "sleek fashion runway beat, minimal deep house, confident strut, instrumental"),
    ("roots", "Roots", "front porch acoustic guitar, evening crickets, gentle storytelling warmth"),
    ("jazz", "Jazz", "late night jazz club, smoky saxophone riff over brushed drums and upright bass"),
]


KEYS_TXT = Path(r"C:\Users\E Sykes\Documents\quickkick-bot\keys.txt")


def load_keys() -> list[str]:
    keys = []
    lines = KEYS_TXT.read_text().splitlines()
    if lines and lines[0].strip().startswith("sk_"):
        keys.append(lines[0].strip())
    for line in ENV_PATH.read_text().splitlines():
        line = line.strip()
        if line.startswith("ELEVENLABS_API_KEY") and "=" in line:
            keys.append(line.split("=", 1)[1].strip().strip('"').strip("'"))
    if not keys:
        raise RuntimeError("No ElevenLabs API key found")
    return keys


def generate(api_key: str, slug: str, prompt: str) -> tuple[bool, str]:
    resp = requests.post(
        API_URL,
        headers={"xi-api-key": api_key, "Content-Type": "application/json"},
        json={"text": prompt, "duration_seconds": 7, "prompt_influence": 0.4},
        timeout=120,
    )
    if resp.status_code == 200 and resp.content:
        path = OUT_DIR / f"{slug}.mp3"
        path.write_bytes(resp.content)
        return True, f"{len(resp.content)} bytes"
    return False, f"HTTP {resp.status_code}: {resp.text[:200]}"


def main() -> None:
    keys = load_keys()
    results = {}
    failed = []

    for slug, _label, prompt in SOUNDS:
        ok, info = False, ""
        for attempt in range(2):  # initial call + one retry after 3s
            if attempt:
                time.sleep(3)
            ok, info = generate(keys[0], slug, prompt)
            if not ok and "401" in info and len(keys) > 1:
                ok, info = generate(keys[1], slug, prompt)  # fallback key on auth error
            if ok:
                break
        results[slug] = (ok, info)
        print(f"{slug}: {'OK' if ok else 'FAILED'} ({info})")
        if not ok:
            failed.append(slug)
        time.sleep(0.5)

    manifest = {slug: {"file": f"audio/{slug}.mp3", "label": label} for slug, label, _ in SOUNDS}
    (OUT_DIR / "manifest.json").write_text(json.dumps(manifest, indent=2) + "\n")
    print("\nmanifest.json written")
    if failed:
        print(f"FAILED: {', '.join(failed)}")


if __name__ == "__main__":
    main()
