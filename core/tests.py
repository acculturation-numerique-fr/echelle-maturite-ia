import json
from django.test import TestCase, Client
from django.urls import reverse
from django.contrib.staticfiles import finders
from .models import DiagnosticSubmission


class DiagnosticModelTest(TestCase):
    def test_create_submission(self):
        submission = DiagnosticSubmission.objects.create(
            score_total=14.5,
            answers={"Q01": 1.0, "Q02": 0.5, "Q03": 0.0}
        )
        self.assertEqual(submission.score_total, 14.5)
        self.assertEqual(submission.answers["Q01"], 1.0)
        self.assertTrue(str(submission).startswith(f"Diagnostic {submission.id}"))
        row_dict = submission.to_dict()
        self.assertEqual(row_dict["score_total"], 14.5)
        self.assertEqual(row_dict["Q01"], 1.0)
        self.assertEqual(row_dict["Q20"], 0.0)


class DiagnosticViewsTest(TestCase):
    def setUp(self):
        self.client = Client()

    def test_index_view(self):
        response = self.client.get(reverse("index"))
        self.assertEqual(response.status_code, 200)
        self.assertIn("Diagnostic de maturité IA", response.content.decode("utf-8"))

    def test_submit_view_post_and_stats(self):
        # 1. Tester la soumission d'un diagnostic
        payload = {
            "scoreTotal": 16.0,
            "answers": {
                "Q01": 1, "Q02": 1, "Q03": 1, "Q04": 1, "Q05": 1,
                "Q06": 1, "Q07": 1, "Q08": 1, "Q09": 1,
                "Q10": 1, "Q11": 1, "Q12": 1, "Q13": 1, "Q14": 1,
                "Q15": 1, "Q16": 1,
                "Q18": 0, "Q19": 0, "Q20": 0
            }
        }
        response = self.client.post(
            "/api/submit",
            data=json.dumps(payload),
            content_type="application/json"
        )
        self.assertEqual(response.status_code, 201)
        res_json = response.json()
        self.assertEqual(res_json.get("status"), "ok")
        self.assertEqual(DiagnosticSubmission.objects.count(), 1)

        # Vérifier les en-têtes CORS
        self.assertEqual(response["Access-Control-Allow-Origin"], "*")

        # 2. Tester le calcul des statistiques GET /api/stats
        stats_response = self.client.get("/api/stats")
        self.assertEqual(stats_response.status_code, 200)
        stats_json = stats_response.json()
        self.assertEqual(stats_json.get("count"), 1)
        self.assertEqual(stats_json.get("avgScore"), 16.0)
        self.assertIn("Connaissances", stats_json.get("avgDimensions", {}))
        self.assertEqual(stats_json["avgDimensions"]["Connaissances"]["score"], 5.0)

    def test_options_cors(self):
        submit_options = self.client.options("/api/submit")
        self.assertEqual(submit_options.status_code, 204)
        self.assertEqual(submit_options["Access-Control-Allow-Origin"], "*")

        stats_options = self.client.options("/api/stats")
        self.assertEqual(stats_options.status_code, 204)
        self.assertEqual(stats_options["Access-Control-Allow-Origin"], "*")

    def test_staticfiles_finder(self):
        css_path = finders.find("css/app.css")
        js_path = finders.find("js/app.js")
        self.assertIsNotNone(css_path, "Le fichier static css/app.css doit être trouvé.")
        self.assertIsNotNone(js_path, "Le fichier static js/app.js doit être trouvé.")
