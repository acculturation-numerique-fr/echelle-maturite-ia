from django.db import models


class DiagnosticSubmission(models.Model):
    timestamp = models.DateTimeField(auto_now_add=True)
    score_total = models.FloatField()
    answers = models.JSONField(default=dict)

    class Meta:
        ordering = ["-timestamp"]
        verbose_name = "Soumission de diagnostic"
        verbose_name_plural = "Soumissions de diagnostic"

    def __str__(self):
        return f"Diagnostic {self.id} - Score: {self.score_total}/20 ({self.timestamp.strftime('%Y-%m-%d %H:%M')})"

    def to_dict(self):
        row = {
            "timestamp": self.timestamp.strftime("%Y-%m-%d-%H-%M"),
            "score_total": float(self.score_total),
        }
        for i in range(1, 21):
            qid = f"Q{i:02d}"
            row[qid] = float(self.answers.get(qid, 0)) if isinstance(self.answers, dict) else 0.0
        return row
