import json
from datetime import datetime
from django.http import HttpResponse, JsonResponse
from django.shortcuts import render
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods

from api.utils import QUESTION_IDS, _to_float, compute_stats, get_supabase_credentials, supabase_request
from .models import DiagnosticSubmission


def _add_cors_headers(response):
    response["Access-Control-Allow-Origin"] = "*"
    response["Access-Control-Allow-Methods"] = "GET, POST, OPTIONS"
    response["Access-Control-Allow-Headers"] = "Content-Type"
    return response


def index_view(request):
    return render(request, "index.html")


@csrf_exempt
@require_http_methods(["POST", "OPTIONS"])
def submit_view(request):
    if request.method == "OPTIONS":
        return _add_cors_headers(HttpResponse(status=204))

    try:
        body = json.loads(request.body.decode("utf-8"))
        answers = body.get("answers", {})
        score_total = _to_float(body.get("scoreTotal", 0))
        timestamp = datetime.now().strftime("%Y-%m-%d-%H-%M")

        try:
            DiagnosticSubmission.objects.create(
                score_total=score_total,
                answers=answers,
            )
        except Exception:
            pass

        url, key = get_supabase_credentials()
        if url and key:
            row = {"timestamp": timestamp, "score_total": score_total}
            for qid in QUESTION_IDS:
                row[qid] = _to_float(answers.get(qid, 0))
            supabase_request("POST", "stats", data=row)

        response = JsonResponse({"status": "ok"}, status=201)
        return _add_cors_headers(response)
    except Exception as exc:
        response = JsonResponse({"error": str(exc)}, status=400)
        return _add_cors_headers(response)


@csrf_exempt
@require_http_methods(["GET", "OPTIONS"])
def stats_view(request):
    if request.method == "OPTIONS":
        return _add_cors_headers(HttpResponse(status=204))

    try:
        rows = []
        url, key = get_supabase_credentials()
        if url and key:
            res = supabase_request("GET", "stats?select=*")
            if res and isinstance(res, list):
                rows = res

        if not rows:
            try:
                rows = [
                    submission.to_dict()
                    for submission in DiagnosticSubmission.objects.all()
                ]
            except Exception:
                rows = []

        stats = compute_stats(rows)
        response = JsonResponse(stats, status=200)
        return _add_cors_headers(response)
    except Exception as exc:
        response = JsonResponse({"error": str(exc)}, status=500)
        return _add_cors_headers(response)
