from http.server import BaseHTTPRequestHandler
import json
import os
import urllib.request

url: str = os.environ.get("SUPABASE_URL", "") or os.environ.get("NEXT_PUBLIC_SUPABASE_URL", "")
key: str = os.environ.get("SUPABASE_KEY", "") or os.environ.get("NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY", "") or os.environ.get("SUPABASE_ANON_KEY", "") or os.environ.get("NEXT_PUBLIC_SUPABASE_ANON_KEY", "")

DIMENSIONS = {
    "Connaissances":  ["Q01", "Q02", "Q03", "Q04", "Q05"],
    "Prise en main":  ["Q06", "Q07", "Q08", "Q09"],
    "Usages":         ["Q10", "Q11", "Q12", "Q13", "Q14"],
    "Usages avancés": ["Q15", "Q16", "Q17"],
    "Usages experts": ["Q18", "Q19", "Q20"],
}

def supabase_request(method: str, path: str, data=None):
    if not url or not key:
        return None
    req_url = f"{url}/rest/v1/{path}"
    headers = {
        "apikey": key,
        "Authorization": f"Bearer {key}",
        "Content-Type": "application/json",
        "Prefer": "return=representation"
    }
    payload = json.dumps(data).encode("utf-8") if data else None
    req = urllib.request.Request(req_url, data=payload, headers=headers, method=method)
    try:
        with urllib.request.urlopen(req) as res:
            return json.loads(res.read().decode("utf-8"))
    except Exception as e:
        raise Exception(f"Erreur Supabase: {e}")

def compute_stats(rows):
    if not rows:
        return {"count": 0, "avgScore": None, "avgDimensions": None}

    count = len(rows)
    avg_score = sum(float(r.get("score_total", 0)) for r in rows) / count

    avg_dimensions = {}
    for dim_name, qids in DIMENSIONS.items():
        dim_avg = sum(
            sum(float(r.get(qid, 0)) for qid in qids) for r in rows
        ) / count
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

class handler(BaseHTTPRequestHandler):
    def do_GET(self):
        try:
            rows = []
            if url and key:
                res = supabase_request("GET", "stats?select=*")
                if res and isinstance(res, list):
                    rows = res
                
            stats = compute_stats(rows)
            self._json_response(200, stats)
        except Exception as exc:
            self._json_response(500, {"error": str(exc)})
            
    def do_OPTIONS(self):
        self.send_response(204)
        self._cors_headers()
        self.end_headers()

    def _json_response(self, status, data):
        payload = json.dumps(data, ensure_ascii=False).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(payload)))
        self._cors_headers()
        self.end_headers()
        self.wfile.write(payload)

    def _cors_headers(self):
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
