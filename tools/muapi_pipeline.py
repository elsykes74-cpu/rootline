#!/usr/bin/env python3
"""ROOTLINE — Muapi media pipeline.

Submits image-to-video (and text-to-video) generations to Muapi and downloads
results. Key is read from env MUAPI_API_KEY or rootline/tools/.secrets/muapi.key
(first line). NEVER prints the key.

Usage:
  python muapi_pipeline.py upload --file hero.png
  python muapi_pipeline.py i2v --image hero.png --prompt "..." \
      --endpoint seedance-lite-i2v --duration 5 --aspect-ratio 16:9 --output out.mp4
  python muapi_pipeline.py models --grep i2v
"""
import argparse
import json
import os
import sys
import time
import urllib.request
import urllib.error
import uuid

API = "https://api.muapi.ai/api/v1"
HERE = os.path.dirname(os.path.abspath(__file__))
KEY_FILE = os.path.join(HERE, ".secrets", "muapi.key")


def get_key() -> str:
    key = os.environ.get("MUAPI_API_KEY", "").strip()
    if not key and os.path.exists(KEY_FILE):
        with open(KEY_FILE, "r", encoding="utf-8") as f:
            key = f.readline().strip()
    if not key:
        sys.exit("No Muapi key: set MUAPI_API_KEY or create " + KEY_FILE)
    return key


def _req(url: str, key: str, data=None, raw=False, method=None, headers=None):
    h = {"x-api-key": key, "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"}
    if headers:
        h.update(headers)
    r = urllib.request.Request(url, data=data, method=method, headers=h)
    with urllib.request.urlopen(r, timeout=120) as resp:
        body = resp.read()
        return body if raw else json.loads(body.decode("utf-8"))


def upload_file(path: str, key: str) -> str:
    boundary = uuid.uuid4().hex
    name = os.path.basename(path)
    with open(path, "rb") as f:
        blob = f.read()
    parts = (
        f"--{boundary}\r\nContent-Disposition: form-data; name=\"file\"; "
        f"filename=\"{name}\"\r\nContent-Type: application/octet-stream\r\n\r\n"
    ).encode() + blob + f"\r\n--{boundary}--\r\n".encode()
    out = _req(
        f"{API}/upload_file", key, data=parts,
        headers={"Content-Type": f"multipart/form-data; boundary={boundary}"},
    )
    url = out.get("url") or out.get("file_url") or out.get("data", {}).get("url")
    if not url:
        sys.exit("Upload response had no URL: " + json.dumps(out)[:300])
    return url


def submit(endpoint: str, payload: dict, key: str) -> str:
    body = json.dumps(payload).encode()
    out = _req(f"{API}/{endpoint}", key, data=body,
               headers={"Content-Type": "application/json"})
    rid = out.get("request_id") or out.get("id") or out.get("data", {}).get("request_id")
    cost = out.get("cost") or {}
    if cost:
        print("cost_usd:", cost.get("amount_usd"), flush=True)
    if not rid:
        sys.exit("Submit response had no request id: " + json.dumps(out)[:300])
    return rid


def poll(request_id: str, key: str, timeout_s: int = 1500, every: int = 10):
    t0 = time.time()
    while time.time() - t0 < timeout_s:
        out = _req(f"{API}/predictions/{request_id}/result", key)
        status = str(out.get("status", "")).lower()
        if status in ("completed", "succeeded", "success"):
            return out
        if status in ("failed", "error", "canceled"):
            sys.exit("Generation failed: " + json.dumps(out)[:500])
        print(f"  ... {status or 'pending'} ({int(time.time()-t0)}s)", flush=True)
        time.sleep(every)
    sys.exit("Timed out waiting for generation")


def extract_video_url(result) -> str:
    def walk(o):
        if isinstance(o, str) and o.startswith("http") and any(
            o.lower().split("?")[0].endswith(e) for e in (".mp4", ".webm", ".mov")
        ):
            return o
        if isinstance(o, dict):
            for v in o.values():
                r = walk(v)
                if r:
                    return r
        if isinstance(o, list):
            for v in o:
                r = walk(v)
                if r:
                    return r
        return None
    url = walk(result)
    if not url:
        sys.exit("No video URL in result: " + json.dumps(result)[:500])
    return url


def download(url: str, out_path: str):
    os.makedirs(os.path.dirname(os.path.abspath(out_path)), exist_ok=True)
    urllib.request.urlretrieve(url, out_path)
    print("Saved:", out_path, f"({os.path.getsize(out_path)//1024} KB)")


def main():
    p = argparse.ArgumentParser()
    sub = p.add_subparsers(dest="cmd", required=True)

    up = sub.add_parser("upload")
    up.add_argument("--file", required=True)

    g = sub.add_parser("i2v")
    g.add_argument("--image", required=True, help="local path or http(s) URL")
    g.add_argument("--prompt", required=True)
    g.add_argument("--endpoint", default="seedance-lite-i2v")
    g.add_argument("--duration", type=int, default=None)
    g.add_argument("--aspect-ratio", default=None)
    g.add_argument("--output", required=True)

    m = sub.add_parser("models")
    m.add_argument("--grep", default="")

    args = p.parse_args()
    key = get_key()

    if args.cmd == "upload":
        print(upload_file(args.file, key))
    elif args.cmd == "models":
        src = open(os.path.join(HERE, "models.js"), encoding="utf-8").read()
        import re
        ids = sorted(set(re.findall(r'"endpoint":\s*"([^"]+)"', src)))
        for i in ids:
            if args.grep.lower() in i.lower():
                print(i)
    elif args.cmd == "i2v":
        image_url = args.image if args.image.startswith("http") else upload_file(args.image, key)
        payload = {"image_url": image_url, "prompt": args.prompt}
        if args.duration:
            payload["duration"] = args.duration
        if args.aspect_ratio:
            payload["aspect_ratio"] = args.aspect_ratio
        print("Submitting", args.endpoint, "...", flush=True)
        rid = submit(args.endpoint, payload, key)
        print("request_id:", rid, flush=True)
        result = poll(rid, key)
        download(extract_video_url(result), args.output)


if __name__ == "__main__":
    main()
