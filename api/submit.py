from http.server import BaseHTTPRequestHandler
import json
from datetime import datetime
from .utils import _to_float, get_supabase_credentials, supabase_request

class handler(BaseHTTPRequestHandler):
    def do_POST(self):
        try:
            length = int(self.headers.get("Content-Length", 0))
            body = json.loads(self.rfile.read(length)) if length > 0 else {}
            answers = body.get("answers", {})
            score_total = _to_float(body.get("scoreTotal", 0))
            timestamp = datetime.now().strftime("%Y-%m-%d-%H-%M")

            url, key = get_supabase_credentials()
            if url and key:
                row = {
                    "timestamp": timestamp,
                    "score_total": score_total
                }
                for i in range(1, 21):
                    qid = f"Q{i:02d}"
                    row[qid] = _to_float(answers.get(qid, 0))

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
