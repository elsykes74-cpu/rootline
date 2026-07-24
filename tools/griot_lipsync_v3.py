#!/usr/bin/env python3
"""v3: upload the new Griot take, submit ltx-2.3-lipsync, download result."""
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
from muapi_pipeline import get_key, submit, poll, extract_video_url, download, upload_file

IMAGE_URL = "https://cdn.muapi.ai/outputs/d88f81324b364bd5b3009f4fe97c9ef5_griot.png"
AUDIO = os.path.join(HERE, "griot-voice.mp3")
OUT = os.path.join(HERE, "griot-lipsync-raw.mp4")

ENDPOINT = "ltx-2.3-lipsync"

key = get_key()
print("Uploading new Griot take ...", flush=True)
audio_url = upload_file(AUDIO, key)
print("audio_url:", audio_url, flush=True)

payload = {
    "image_url": IMAGE_URL,
    "audio_url": audio_url,
    "resolution": "720p",
    "prompt": "A distinguished elder speaks warmly and directly to camera, subtle natural head movement, gentle welcoming expression, cinematic studio lighting.",
}

print("Submitting", ENDPOINT, "...", flush=True)
rid = submit(ENDPOINT, payload, key)
print("request_id:", rid, flush=True)
result = poll(rid, key)
download(extract_video_url(result), OUT)
