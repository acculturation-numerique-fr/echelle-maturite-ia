#!/usr/bin/env python3
# Serveur local ultra-léger pour le Diagnostic de Maturité IA.
# 
# Son rôle est double :
# 1. Servir les fichiers statiques de l'application (HTML, CSS, JS) situés dans le dossier ./app
# 2. Exposer deux points d'accès API (JSON) pour que le front-end puisse communiquer avec le back-end :
#    - POST /api/submit : Enregistre les réponses et le score d'un utilisateur dans Supabase.
#    - GET  /api/stats  : Calcule et renvoie les statistiques moyennes depuis Supabase.

import json
import sys
import os
from datetime import datetime
from http.server import HTTPServer, SimpleHTTPRequestHandler
from pathlib import Path

import urllib.request

ROOT = Path(__file__).resolve().parent
APP_DIR = ROOT / "app"

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

QUESTION_IDS = [f"Q{i:02d}" for i in range(1, 21)]

DIMENSIONS = {
    "Connaissances":  ["Q01", "Q02", "Q03", "Q04", "Q05"],
    "Prise en main":  ["Q06", "Q07", "Q08", "Q09"],
    "Usages":         ["Q10", "Q11", "Q12", "Q13", "Q14"],
    "Usages avancés": ["Q15", "Q16", "Q17"],
    "Usages experts": ["Q18", "Q19", "Q20"],
}

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


class DiagnosticHandler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(APP_DIR), **kwargs)

    # ── Routage de l'API ─────────────────────────────────────────

    def do_GET(self):
        if self.path == "/api/stats":
            return self._handle_stats()
        # Fallback for Vercel app/ routes if accessed via root in local
        super().do_GET()

    def do_POST(self):
        if self.path == "/api/submit":
            return self._handle_submit()
        self.send_error(404)

    def do_OPTIONS(self):
        self.send_response(204)
        self._cors_headers()
        self.end_headers()

    # ── Gestionnaires (Handlers) ─────────────────────────────────

    def _handle_submit(self):
        try:
            length = int(self.headers.get("Content-Length", 0))
            body = json.loads(self.rfile.read(length))
            answers = body.get("answers", {})
            score_total = body.get("scoreTotal", 0)
            timestamp = datetime.now().strftime("%Y-%m-%d-%H-%M")

            if url and key:
                row = {"timestamp": timestamp, "score_total": score_total}
                for qid in QUESTION_IDS:
                    row[qid] = answers.get(qid, 0)
                
                supabase_request("POST", "stats", data=row)
            else:
                print("Avertissement: SUPABASE_URL ou SUPABASE_KEY manquant. Les données ne sont pas sauvegardées.")

            self._json_response(201, {"status": "ok"})
        except Exception as exc:
            self._json_response(400, {"error": str(exc)})

    def _handle_stats(self):
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

    # ── Fonctions Utilitaires (Helpers) ──────────────────────────

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

    def log_message(self, format, *args):
        path = args[0] if args else ""
        if "/api/" in str(path):
            super().log_message(format, *args)


def main():
    if not url or not key:
        print("Avertissement: Variables SUPABASE_URL ou SUPABASE_KEY non définies.")
        print("L'application tournera, mais les données ne seront ni sauvegardées ni lues depuis la base.")
        print()

    port = int(sys.argv[1]) if len(sys.argv) > 1 else 8080
    server = HTTPServer(("0.0.0.0", port), DiagnosticHandler)
    print("─── Diagnostic de Maturité IA ───")
    print(f"    http://localhost:{port}")
    print("    Ctrl+C pour arrêter")
    print()
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\nServeur arrêté.")
        server.server_close()


if __name__ == "__main__":
    main()
