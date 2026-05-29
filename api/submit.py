from http.server import BaseHTTPRequestHandler
import json
from datetime import datetime
import os
import urllib.request

url: str = os.environ.get("SUPABASE_URL", "")
key: str = os.environ.get("SUPABASE_KEY", "")

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

class handler(BaseHTTPRequestHandler):
    def do_POST(self):
        try:
            length = int(self.headers.get("Content-Length", 0))
            body = json.loads(self.rfile.read(length))
            answers = body.get("answers", {})
            score_total = body.get("scoreTotal", 0)
            timestamp = datetime.now().strftime("%Y-%m-%d-%H-%M")

            if url and key:
                row = {
                    "timestamp": timestamp,
                    "score_total": score_total
                }
                for i in range(1, 21):
                    qid = f"Q{i:02d}"
                    row[qid] = answers.get(qid, 0)
                
                supabase_request("POST", "stats", data=row)
            
            self._json_response(201, {"status": "ok"})
        except Exception as exc:
            self._json_response(400, {"error": str(exc)})
            
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
