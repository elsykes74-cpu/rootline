"""Find the owner's 'black voices' voice in ElevenLabs. Never prints the key."""
import json
import sys
import urllib.request
import urllib.error
from pathlib import Path

KEY_FILE = Path(r"C:\Users\E Sykes\Documents\quickkick-bot\keys.txt")


def load_key():
    line = KEY_FILE.read_text(encoding="utf-8").splitlines()[0]
    key = line.strip().lstrip("﻿").strip()
    if not key.startswith("sk_"):
        raise SystemExit("key on line 1 does not look like an ElevenLabs key")
    return key


def get(url, key):
    req = urllib.request.Request(url, method="GET")
    req.add_header("xi-api-key", key)
    try:
        with urllib.request.urlopen(req, timeout=60) as r:
            return json.loads(r.read()), 200
    except urllib.error.HTTPError as e:
        return None, e.code
    except Exception as e:
        return None, str(e)


def blob(v):
    parts = [v.get("name", ""), v.get("category", ""), v.get("description", "") or ""]
    labels = v.get("labels") or {}
    if isinstance(labels, dict):
        parts.extend(str(x) for x in labels.values())
    elif isinstance(labels, list):
        parts.extend(str(x) for x in labels)
    return " | ".join(parts).lower()


def main():
    key = load_key()
    print(f"key loaded (length {len(key)}, starts 'sk_': yes)")

    data, code = get("https://api.elevenlabs.io/v1/voices", key)
    if code != 200:
        print(f"GET /v1/voices failed: {code}", file=sys.stderr)
        sys.exit(2)
    voices = data.get("voices", [])
    print(f"total voices returned: {len(voices)}")

    matches = [v for v in voices if "black" in blob(v)]
    for v in voices:
        cat = v.get("category", "?")
        print(f"  - {v['name']}  [{cat}]  id={v['voice_id']}")

    print("--- 'black' fuzzy matches ---")
    for v in matches:
        print(f"  MATCH: {v['name']}  [{v.get('category')}]  id={v['voice_id']}  labels={v.get('labels')}")

    chosen = None
    reason = ""
    if len(matches) == 1:
        chosen = matches[0]
        reason = "exactly one voice matched 'black'"
    elif len(matches) > 1:
        personal = [v for v in matches if v.get("category") not in ("premade",)]
        if personal:
            chosen = personal[0]
            reason = f"{len(matches)} matches; picked the personal (non-premade) one"
        else:
            chosen = matches[0]
            reason = f"{len(matches)} matches, all premade; picked first"
    else:
        # try shared voices library
        data2, code2 = get("https://api.elevenlabs.io/v1/shared-voices?page_size=100", key)
        if code2 == 200:
            shared = data2.get("voices", [])
            sm = [v for v in shared if "black" in blob(v)]
            print(f"shared voices checked: {len(shared)}, 'black' matches: {len(sm)}")
            for v in sm[:10]:
                print(f"  SHARED MATCH: {v.get('name')} id={v.get('voice_id')}")
        else:
            print(f"shared voices lookup failed: {code2}")

    if chosen:
        out = {"voice_id": chosen["voice_id"], "name": chosen["name"],
               "category": chosen.get("category"), "reason": reason}
        Path(__file__).parent.joinpath("chosen_voice.json").write_text(json.dumps(out, indent=2))
        print(f"CHOSEN: {chosen['name']} (id {chosen['voice_id']}) — {reason}")
    else:
        print("NO 'black' match found — fallback needed")


if __name__ == "__main__":
    main()
