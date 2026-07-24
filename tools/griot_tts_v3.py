#!/usr/bin/env python3
"""v3: regenerate the Griot welcome voiceover with smoother delivery settings.
EXACT SAME script text as griot_tts.py. Never prints the key."""
import os
import sys
import urllib.request

KEY_FILE = r"C:\Users\E Sykes\Documents\quickkick-bot\keys.txt"
VOICE_ID = "NFL5OTl0loQWZD1dgxyn"  # Richard
HERE = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.join(HERE, "griot-voice.mp3")

SCRIPT = (
    "Ah... you made it. Welcome to ROOTLINE. "
    "I am the Griot — keeper of the stories. "
    "Here, the culture owns the stage, and every creator eats what they grow. "
    "So pull up a chair. The line is yours."
)

# smoother delivery settings (v3) — same as intro v3
VOICE_SETTINGS = {
    "stability": 0.42,
    "similarity_boost": 0.78,
    "style": 0.15,
    "use_speaker_boost": True,
}


def main():
    with open(KEY_FILE, encoding="utf-8") as f:
        key = f.readline().strip()
    import json
    body = json.dumps({
        "text": SCRIPT,
        "model_id": "eleven_multilingual_v2",
        "voice_settings": VOICE_SETTINGS,
    }).encode()
    req = urllib.request.Request(
        f"https://api.elevenlabs.io/v1/text-to-speech/{VOICE_ID}",
        data=body,
        headers={"xi-api-key": key, "Content-Type": "application/json",
                 "Accept": "audio/mpeg"},
    )
    with urllib.request.urlopen(req, timeout=120) as resp:
        audio = resp.read()
    with open(OUT, "wb") as f:
        f.write(audio)
    print("Saved:", OUT, f"({len(audio)//1024} KB)")


if __name__ == "__main__":
    main()
