from django.contrib import admin
from .models import DiagnosticSubmission


@admin.register(DiagnosticSubmission)
class DiagnosticSubmissionAdmin(admin.ModelAdmin):
    list_display = ("id", "score_total", "timestamp")
    list_filter = ("timestamp",)
    search_fields = ("id", "score_total")
    readonly_fields = ("timestamp",)
