#!/usr/bin/env python3
# Serveur local ultra-léger pour le Diagnostic de Maturité IA.
# 
# Son rôle est double :
# 1. Servir les fichiers statiques de l'application (HTML, CSS, JS) situés dans le dossier ./app
# 2. Exposer deux points d'accès API (JSON) pour que le front-end puisse communiquer avec le back-end :
#    - POST /api/submit : Enregistre les réponses et le score d'un utilisateur à la fin de son diagnostic.
#    - GET  /api/stats  : Calcule et renvoie les statistiques moyennes globales de tous les participants.
#
# Les données sont sauvegardées de manière persistante dans un simple fichier data/stats.csv (créé automatiquement).
# Aucune dépendance externe n'est requise, ce script s'appuie uniquement sur la bibliothèque standard de Python 3.

import csv
import json
import sys
from datetime import datetime
from http.server import HTTPServer, SimpleHTTPRequestHandler
from pathlib import Path

ROOT = Path(__file__).resolve().parent
APP_DIR = ROOT / "app"
DATA_DIR = ROOT / "data"
CSV_PATH = DATA_DIR / "stats.csv"

QUESTION_IDS = [f"Q{i:02d}" for i in range(1, 21)]
FIELDNAMES = ["timestamp"] + QUESTION_IDS + ["score_total"]

DIMENSIONS = {
    "Connaissances":  ["Q01", "Q02", "Q03", "Q04", "Q05"],
    "Prise en main":  ["Q06", "Q07", "Q08", "Q09"],
    "Usages":         ["Q10", "Q11", "Q12", "Q13", "Q14"],
    "Usages avancés": ["Q15", "Q16", "Q17"],
    "Usages experts": ["Q18", "Q19", "Q20"],
}


def read_csv_rows():
    # Lit et extrait toutes les lignes du fichier CSV. 
    # Si le fichier n'existe pas encore (ex: premier lancement), retourne une liste vide pour éviter les erreurs.
    if not CSV_PATH.exists():
        return []
    with open(CSV_PATH, "r", newline="", encoding="utf-8") as f:
        return list(csv.DictReader(f))


def compute_stats(rows):
    # Calcule les statistiques globales (moyennes) à partir des données extraites du CSV.
    # Ces calculs permettent d'afficher le radar et les barres comparatives à la fin du diagnostic.
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
    # Gestionnaire HTTP personnalisé qui s'occupe de router les requêtes entrantes :
    # - Si l'URL correspond à notre API (/api/...), on traite la logique de calcul ou de sauvegarde.
    # - Sinon, la classe parente (SimpleHTTPRequestHandler) prend le relais pour distribuer les fichiers web (index.html, css, js).

    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(APP_DIR), **kwargs)

    # ── Routage de l'API ─────────────────────────────────────────

    def do_GET(self):
        if self.path == "/api/stats":
            return self._handle_stats()
        super().do_GET()

    def do_POST(self):
        if self.path == "/api/submit":
            return self._handle_submit()
        self.send_error(404)

    def do_OPTIONS(self):
        # Gère les requêtes "preflight" liées au CORS (Cross-Origin Resource Sharing).
        # C'est un mécanisme de sécurité des navigateurs : avant d'envoyer un POST, le navigateur vérifie d'abord si le serveur est d'accord.
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

            DATA_DIR.mkdir(exist_ok=True)
            file_exists = CSV_PATH.exists()

            row = {"timestamp": timestamp, "score_total": score_total}
            for qid in QUESTION_IDS:
                row[qid] = answers.get(qid, 0)

            with open(CSV_PATH, "a", newline="", encoding="utf-8") as f:
                writer = csv.DictWriter(f, fieldnames=FIELDNAMES)
                if not file_exists:
                    writer.writeheader()
                writer.writerow(row)

            self._json_response(201, {"status": "ok"})
        except Exception as exc:
            self._json_response(400, {"error": str(exc)})

    def _handle_stats(self):
        try:
            rows = read_csv_rows()
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
        # Surcharge de la méthode de journalisation (log) native :
        # On ne conserve que les logs des appels API pour garder la console propre et lisible, en ignorant le chargement des images/css.
        path = args[0] if args else ""
        if "/api/" in str(path):
            super().log_message(format, *args)


def main():
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
