#!/usr/bin/env python3
"""Generate the Griot welcome voiceover via ElevenLabs. Never prints the key."""
import os
import sys
import urllib.request

KEY_FILE = r"C:\Users\E Sykes\Documents\quickkick-bot\keys.txt"
VOICE_ID = "NFL5OTl0loQWZD1dgxyn"  # Richard
OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "griot-voice.mp3")

SCRIPT = (
    "Ah... you made it. Welcome to ROOTLINE. "
    "I am the Griot — keeper of the stories. "
    "Here, the culture owns the stage, and every creator eats what they grow. "
    "So pull up a chair. The line is yours."
)

def main():
    with open(KEY_FILE, encoding="utf-8") as f:
        key = f.readline().strip()
    import json
    body = json.dumps({
        "text": SCRIPT,
        "model_id": "eleven_multilingual_v2",
        "voice_settings": {
            "stability": 0.55,
            "similarity_boost": 0.8,
            "style": 0.35,
            "use_speaker_boost": True,
        },
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
