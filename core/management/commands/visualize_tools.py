import json
import os
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
from matplotlib.patches import Patch
from django.core.management.base import BaseCommand
from django.conf import settings

# Palette
BG = "#0f172a"
INK = "#e2e8f0"
INK_SOFT = "#94a3b8"
INK_FAINT = "#64748b"
GRID = "#334155"

CATEGORY_COLORS = {
    "Compagnons universels": "#565ad3",
    "Outils d'entrée": "#20b7d1",
    "Création visuelle": "#d265a1",
    "Modèles alternatifs": "#d8803a",
    "Automatisation": "#8dc734",
    "Exploration données": "#d7b219",
    "Coder avec l'IA": "#2fb789",
    "IA locale & agents": "#a674dd",
    "Expert / Frameworks": "#d66568",
}

LEVEL_BOUNDS = [0, 2.5, 5.5, 10.5, 15.5, 20]
LEVEL_NAMES = ["Novice", "Débutant", "Intermédiaire", "Avancé", "Expert"]
LEVEL_SHADES = ["#111a2d", "#131b2e", "#151e31", "#192135", "#1d2538"]

TOOL_RANGES_PATH = settings.BASE_DIR / "app" / "assets" / "data" / "tool-ranges.json"


def load_tools():
    with TOOL_RANGES_PATH.open(encoding="utf-8") as handle:
        data = json.load(handle)

    return [
        (item["name"], item["min"], item["max"], item["category"])
        for item in data
    ]


TOOLS = load_tools()

def fmt(value):
    return f"{value:g}"

def draw_level_bands(ax, label_y, label_size):
    for i, name in enumerate(LEVEL_NAMES):
        left, right = LEVEL_BOUNDS[i], LEVEL_BOUNDS[i + 1]
        ax.axvspan(left, right, color=LEVEL_SHADES[i], zorder=0)
        ax.text((left + right) / 2, label_y, name, ha="center", va="center",
                color=INK_SOFT, fontsize=label_size, fontweight="bold", zorder=4)
    for bound in LEVEL_BOUNDS[1:-1]:
        ax.axvline(bound, color=GRID, linewidth=1.1, alpha=0.55, zorder=0.5)
    for x in range(21):
        ax.axvline(x, color=GRID, linewidth=0.7, alpha=0.28,
                   linestyle=(0, (4, 5)), zorder=0.5)

def style_axes(ax):
    ax.set_facecolor(BG)
    for spine in ax.spines.values():
        spine.set_visible(False)
    ax.tick_params(colors=INK_SOFT, labelsize=14, length=0)

def legend_categories(ax, loc):
    handles = [Patch(facecolor=color, label=name) for name, color in CATEGORY_COLORS.items()]
    legend = ax.legend(handles=handles, loc=loc, ncol=2, title="Catégories",
                       fontsize=13, title_fontsize=14, framealpha=0.92,
                       facecolor="#16203a", edgecolor=GRID,
                       labelcolor=INK, borderpad=0.9, handlelength=1.6)
    legend.get_title().set_color(INK)
    legend.set_zorder(6)

class Command(BaseCommand):
    help = "Génère les figures de répartition du catalogue d'outils IA."

    def add_arguments(self, parser):
        parser.add_argument("--out", default="figures", help="dossier de sortie des PNG (défaut : figures/)")

    def handle(self, *args, **options):
        out_dir = options["out"]
        os.makedirs(out_dir, exist_ok=True)

        # 1. Plot ranges
        order = sorted(range(len(TOOLS)), key=lambda i: (TOOLS[i][1], -TOOLS[i][2], i))
        n = len(order)
        fig, ax = plt.subplots(figsize=(23.04, 2.2 + n * 0.42), dpi=100)
        fig.patch.set_facecolor(BG)
        style_axes(ax)
        draw_level_bands(ax, label_y=n + 0.9, label_size=17)

        for y, i in enumerate(order):
            name, lo, hi, category = TOOLS[i]
            color = CATEGORY_COLORS[category]
            ax.barh(y, hi - lo, left=lo, height=0.62, color=color, zorder=2)
            ax.plot((lo + hi) / 2, y, "o", color="#f8fafc", markersize=6.5, zorder=3)
            ax.text(lo - 0.18, y, name, ha="right", va="center", color=INK, fontsize=13, zorder=4)
            ax.text(hi + 0.18, y, f"[{fmt(lo)}–{fmt(hi)}]", ha="left", va="center", color=INK_FAINT, fontsize=11.5, zorder=4)

        ax.set_xlim(0, 20)
        ax.set_ylim(-0.9, n + 1.8)
        ax.set_xticks(range(21))
        ax.set_yticks([])
        ax.set_xlabel("Score du diagnostic (0–20)", color=INK, fontsize=18, labelpad=14)
        ax.set_title("Répartition des outils IA par plage de score", color="#f8fafc", fontsize=26, fontweight="bold", pad=26)
        legend_categories(ax, loc="lower right")
        fig.savefig(os.path.join(out_dir, "tool_distribution_ranges.png"), facecolor=BG, bbox_inches="tight", pad_inches=0.3)
        plt.close(fig)

        # 2. Plot density
        scores = list(range(21))
        fig, ax = plt.subplots(figsize=(20.85, 7.4), dpi=100)
        fig.patch.set_facecolor(BG)
        style_axes(ax)

        totals = [0] * len(scores)
        for category, color in CATEGORY_COLORS.items():
            counts = [sum(1 for _, lo, hi, cat in TOOLS if cat == category and lo <= s <= hi) for s in scores]
            ax.bar(scores, counts, bottom=totals, width=0.86, color=color, zorder=2)
            totals = [t + c for t, c in zip(totals, counts)]

        top = max(totals)
        draw_level_bands(ax, label_y=top * 1.065, label_size=16)
        ax.plot(scores, totals, color="#f1f5f9", linewidth=3, marker="o", markersize=8, zorder=5)

        ax.set_xlim(-0.6, 20.6)
        ax.set_ylim(0, top * 1.12)
        ax.set_xticks(scores)
        ax.set_yticks(range(0, top + 1, 5))
        ax.set_xlabel("Score du diagnostic (0–20)", color=INK, fontsize=18, labelpad=12)
        ax.set_ylabel("Nombre d'outils disponibles", color=INK, fontsize=16, labelpad=12)
        ax.set_title("Densité d'outils disponibles par score – Répartition par catégorie", color="#f8fafc", fontsize=22, fontweight="bold", pad=18)
        legend_categories(ax, loc="upper left")
        fig.savefig(os.path.join(out_dir, "tool_distribution_density.png"), facecolor=BG, bbox_inches="tight", pad_inches=0.25)
        plt.close(fig)

        self.stdout.write(self.style.SUCCESS(f"{len(TOOLS)} outils — figures générées dans {out_dir}/"))
