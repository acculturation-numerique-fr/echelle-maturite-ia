from django.contrib import admin
from django.urls import path, re_path
from . import views

urlpatterns = [
    path("admin/", admin.site.urls),
    re_path(r"^$", views.index_view, name="index"),
    re_path(r"^api/submit/?$", views.submit_view, name="api-submit"),
    re_path(r"^api/stats/?$", views.stats_view, name="api-stats"),
]
