import json
import os
import urllib.request

QUESTION_IDS = [f"Q{i:02d}" for i in range(1, 21)]

DIMENSIONS = {
    "Connaissances": ["Q01", "Q02", "Q03", "Q04", "Q05"],
    "Prise en main": ["Q06", "Q07", "Q08", "Q09"],
    "Usages": ["Q10", "Q11", "Q12", "Q13", "Q14"],
    "Usages avancés": ["Q15", "Q16", "Q17"],
    "Usages experts": ["Q18", "Q19", "Q20"],
}

BASELINE_DIMENSIONS = {
    "Connaissances": {"score": 3.1, "max": 5, "percent": 62},
    "Prise en main": {"score": 2.3, "max": 4, "percent": 58},
    "Usages": {"score": 2.6, "max": 5, "percent": 52},
    "Usages avancés": {"score": 1.6, "max": 3, "percent": 53},
    "Usages experts": {"score": 1.6, "max": 3, "percent": 53},
}


def _to_float(val, default=0.0):
    if val is None:
        return default
    try:
        return float(val)
    except (ValueError, TypeError):
        return default


def get_supabase_credentials():
    url = (
        os.environ.get("SUPABASE_URL", "")
        or os.environ.get("NEXT_PUBLIC_SUPABASE_URL", "")
    )
    key = (
        os.environ.get("SUPABASE_KEY", "")
        or os.environ.get("NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY", "")
        or os.environ.get("SUPABASE_ANON_KEY", "")
        or os.environ.get("NEXT_PUBLIC_SUPABASE_ANON_KEY", "")
    )
    return url.rstrip("/") if url else "", key


def supabase_request(method: str, path: str, data=None):
    url, key = get_supabase_credentials()
    if not url or not key:
        return None
    req_url = f"{url}/rest/v1/{path}"
    headers = {
        "apikey": key,
        "Authorization": f"Bearer {key}",
        "Content-Type": "application/json",
        "Prefer": "return=representation",
    }
    payload = json.dumps(data).encode("utf-8") if data else None
    req = urllib.request.Request(
        req_url, data=payload, headers=headers, method=method
    )
    try:
        with urllib.request.urlopen(req) as res:
            return json.loads(res.read().decode("utf-8"))
    except Exception:
        return None


def compute_stats(rows):
    if not rows:
        return {
            "count": 0,
            "avgScore": 11.2,
            "avgDimensions": BASELINE_DIMENSIONS,
        }

    count = len(rows)
    total_scores = [
        _to_float(r.get("score_total", r.get("scoreTotal", 0)))
        for r in rows
    ]
    avg_score = sum(total_scores) / count

    avg_dimensions = {}
    for dim_name, qids in DIMENSIONS.items():
        dim_sum = sum(
            sum(_to_float(r.get(qid, 0)) for qid in qids)
            for r in rows
        )
        dim_avg = dim_sum / count
        dim_max = len(qids)
        avg_dimensions[dim_name] = {
            "score": round(dim_avg, 2),
            "max": dim_max,
            "percent": round((dim_avg / dim_max) * 100) if dim_max else 0,
        }

    return {
        "count": count,
        "avgScore": round(avg_score, 1),
        "avgDimensions": avg_dimensions,
    }
