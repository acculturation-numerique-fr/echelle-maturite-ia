import csv
from datetime import datetime, timezone
from pathlib import Path
from django.core.management.base import BaseCommand
from django.conf import settings
from core.models import DiagnosticSubmission
from core.views import get_supabase_credentials, supabase_request, QUESTION_IDS

class Command(BaseCommand):
    help = "Exporte les soumissions de diagnostic en fichier CSV (depuis Supabase ou la base Django locale)"

    def add_arguments(self, parser):
        parser.add_argument(
            "--output",
            type=Path,
            default=None,
            help="Chemin du fichier CSV de sortie (défaut: data/export_<horodatage>.csv)",
        )

    def handle(self, *args, **options):
        output_path = options["output"]
        if output_path is None:
            stamp = datetime.now(timezone.utc).strftime("%Y%m%d-%H%M%S")
            output_path = settings.BASE_DIR / "data" / f"export_{stamp}.csv"

        rows = []
        url, key = get_supabase_credentials()
        if url and key:
            self.stdout.write("Récupération des données depuis Supabase...")
            try:
                rows = supabase_request("GET", "stats?select=*&order=timestamp.asc") or []
            except Exception as e:
                self.stderr.write(f"Erreur Supabase ({e}), bascule sur ORM Django...")

        if not rows:
            self.stdout.write("Récupération des données depuis la base Django ORM...")
            rows = [s.to_dict() for s in DiagnosticSubmission.objects.all()]

        output_path.parent.mkdir(parents=True, exist_ok=True)
        fieldnames = ["timestamp", "score_total"] + QUESTION_IDS
        with output_path.open("w", newline="", encoding="utf-8") as f:
            writer = csv.DictWriter(f, fieldnames=fieldnames, extrasaction="ignore")
            writer.writeheader()
            for row in rows:
                writer.writerow(row)

        self.stdout.write(self.style.SUCCESS(f"{len(rows)} ligne(s) exportée(s) vers {output_path}"))
