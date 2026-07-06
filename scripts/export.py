#!/usr/bin/env python3
# Export périodique de la table Supabase "stats" (résultats anonymisés du
# diagnostic : timestamp, score_total, Q01..Q20) vers un fichier CSV local,
# pour analyses et tests hors ligne.
#
# Usage :
#   export SUPABASE_URL="ton_url_supabase"
#   export SUPABASE_KEY="ta_cle_supabase"
#   python scripts/export_supabase_csv.py [--output chemin.csv]

import argparse
import csv
import json
import os
import sys
import urllib.request
from datetime import datetime, timezone
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
DEFAULT_OUTPUT_DIR = ROOT / "data"

URL = os.environ.get("SUPABASE_URL", "") or os.environ.get("NEXT_PUBLIC_SUPABASE_URL", "")
KEY = os.environ.get("SUPABASE_KEY", "") or os.environ.get("NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY", "") or os.environ.get("SUPABASE_ANON_KEY", "") or os.environ.get("NEXT_PUBLIC_SUPABASE_ANON_KEY", "")

TABLE = "stats"
PAGE_SIZE = 1000
FIELDNAMES = ["timestamp", "score_total"] + [f"Q{i:02d}" for i in range(1, 21)]


def fetch_all_rows():
    if not URL or not KEY:
        print("Erreur: SUPABASE_URL ou SUPABASE_KEY non définis.", file=sys.stderr)
        sys.exit(1)

    rows = []
    offset = 0
    while True:
        req = urllib.request.Request(
            f"{URL}/rest/v1/{TABLE}?select=*&order=timestamp.asc",
            headers={
                "apikey": KEY,
                "Authorization": f"Bearer {KEY}",
                "Range-Unit": "items",
                "Range": f"{offset}-{offset + PAGE_SIZE - 1}",
            },
        )
        with urllib.request.urlopen(req) as res:
            page = json.loads(res.read().decode("utf-8"))

        rows.extend(page)
        if len(page) < PAGE_SIZE:
            break
        offset += PAGE_SIZE

    return rows


def write_csv(rows, output_path):
    output_path.parent.mkdir(parents=True, exist_ok=True)
    with output_path.open("w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=FIELDNAMES, extrasaction="ignore")
        writer.writeheader()
        for row in rows:
            writer.writerow(row)


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument(
        "--output",
        type=Path,
        default=None,
        help="Chemin du fichier CSV de sortie (défaut: data/export_<horodatage>.csv)",
    )
    args = parser.parse_args()

    output_path = args.output
    if output_path is None:
        stamp = datetime.now(timezone.utc).strftime("%Y%m%d-%H%M%S")
        output_path = DEFAULT_OUTPUT_DIR / f"export_{stamp}.csv"

    rows = fetch_all_rows()
    write_csv(rows, output_path)
    print(f"{len(rows)} ligne(s) exportée(s) vers {output_path}")


if __name__ == "__main__":
    main()
