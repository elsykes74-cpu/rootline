"""Find 'Richard' in the owner's ElevenLabs voices. Never prints the key."""
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


def score_narrative(v):
    """Higher = deeper / more narrative, based on description+labels."""
    b = blob(v)
    score = 0
    for kw, pts in [
        ("deep", 3), ("narrat", 3), ("documentary", 2), ("audiobook", 2),
        ("warm", 1), ("low", 1), ("rich", 1), ("story", 1), ("film", 1),
        ("calm", 1), ("authoritative", 1), ("male", 1),
    ]:
        if kw in b:
            score += pts
    return score


def main():
    key = load_key()
    print(f"key loaded (length {len(key)}, starts 'sk_': yes)")

    data, code = get("https://api.elevenlabs.io/v1/voices", key)
    if code != 200:
        print(f"GET /v1/voices failed: {code}", file=sys.stderr)
        sys.exit(2)
    voices = data.get("voices", [])
    print(f"total voices returned: {len(voices)}")

    exact = [v for v in voices if v.get("name", "").strip().lower() == "richard"]
    fuzzy = [v for v in voices if "rich" in blob(v) and v not in exact]

    print("--- exact 'richard' (case-insensitive name) ---")
    for v in exact:
        print(f"  EXACT: {v['name']}  [{v.get('category')}]  id={v['voice_id']}")
        print(f"         desc={v.get('description')}  labels={v.get('labels')}")
    print("--- fuzzy 'rich' ---")
    for v in fuzzy:
        print(f"  FUZZY: {v['name']}  [{v.get('category')}]  id={v['voice_id']}  labels={v.get('labels')}")

    chosen = None
    reason = ""
    pool = exact if exact else fuzzy
    if pool:
        personal = [v for v in pool if v.get("category") not in ("premade",)]
        pick_from = personal if personal else pool
        chosen = max(pick_from, key=score_narrative)
        kind = "exact 'Richard' name match" if exact else "no exact 'Richard'; fuzzy 'rich' match"
        why = "personal/library voice preferred over premade" if personal else "only premade candidates"
        reason = (f"{kind}; {len(pool)} candidate(s); {why}; "
                  f"highest deep/narrative score ({score_narrative(chosen)})")
    else:
        print("NO 'richard' or 'rich' match in /v1/voices")

    if chosen:
        out = {"voice_id": chosen["voice_id"], "name": chosen["name"],
               "category": chosen.get("category"), "reason": reason,
               "description": chosen.get("description"), "labels": chosen.get("labels")}
        Path(__file__).parent.joinpath("chosen_voice.json").write_text(json.dumps(out, indent=2))
        print(f"CHOSEN: {chosen['name']} (id {chosen['voice_id']}) [{chosen.get('category')}] — {reason}")


if __name__ == "__main__":
    main()
