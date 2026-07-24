#!/usr/bin/env python3
"""Submit the Griot lip-sync job to Muapi and download the result."""
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
from muapi_pipeline import get_key, submit, poll, extract_video_url, download

IMAGE_URL = "https://cdn.muapi.ai/outputs/d88f81324b364bd5b3009f4fe97c9ef5_griot.png"
AUDIO_URL = "https://cdn.muapi.ai/outputs/b776e9b00fda44aca2aa9582694504b9_griot-voice.mp3"
OUT = os.path.join(HERE, "griot-lipsync-raw.mp4")

ENDPOINT = sys.argv[1] if len(sys.argv) > 1 else "ltx-2.3-lipsync"

payload = {
    "image_url": IMAGE_URL,
    "audio_url": AUDIO_URL,
    "resolution": "720p",
    "prompt": "A distinguished elder speaks warmly and directly to camera, subtle natural head movement, gentle welcoming expression, cinematic studio lighting.",
}

key = get_key()
print("Submitting", ENDPOINT, "...", flush=True)
rid = submit(ENDPOINT, payload, key)
print("request_id:", rid, flush=True)
result = poll(rid, key)
download(extract_video_url(result), OUT)
