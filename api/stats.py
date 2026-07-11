from http.server import BaseHTTPRequestHandler
import json
from .utils import compute_stats, get_supabase_credentials, supabase_request

class handler(BaseHTTPRequestHandler):
    def do_GET(self):
        try:
            rows = []
            url, key = get_supabase_credentials()
            if url and key:
                res = supabase_request("GET", "stats?select=*")
                if res and isinstance(res, list):
                    rows = res

            self._json_response(200, compute_stats(rows))
        except Exception:
            self._json_response(200, compute_stats([]))

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
