// Génère les figures de répartition du catalogue d'outils IA (README).
// Usage : npm run figures -- [--out figures]
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import * as echarts from "echarts";
import { Resvg } from "@resvg/resvg-js";

interface Tool {
  name: string;
  min: number;
  max: number;
  category: string;
}

const BG = "#0f172a";
const INK = "#e2e8f0";
const INK_SOFT = "#94a3b8";
const INK_FAINT = "#64748b";
const GRID = "#334155";
const FONT = "DejaVu Sans, Liberation Sans, Arial, sans-serif";

const CATEGORY_COLORS: Record<string, string> = {
  "Compagnons universels": "#565ad3",
  "Outils d'entrée": "#20b7d1",
  "Création visuelle": "#d265a1",
  "Modèles alternatifs": "#d8803a",
  Automatisation: "#8dc734",
  "Exploration données": "#d7b219",
  "Coder avec l'IA": "#2fb789",
  "IA locale & agents": "#a674dd",
  "Expert / Frameworks": "#d66568",
};

const LEVEL_BOUNDS = [0, 2.5, 5.5, 10.5, 15.5, 20];
const LEVEL_NAMES = ["Novice", "Débutant", "Intermédiaire", "Avancé", "Expert"];
const LEVEL_SHADES = ["#111a2d", "#131b2e", "#151e31", "#192135", "#1d2538"];
const SCORES = Array.from({ length: 21 }, (_, i) => i);

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const outArg = process.argv.indexOf("--out");
const outDir = resolve(outArg >= 0 ? process.argv[outArg + 1] : "figures");

const tools: Tool[] = JSON.parse(readFileSync(join(root, "app/assets/data/tool-ranges.json"), "utf8"));
for (const tool of tools) {
  if (!CATEGORY_COLORS[tool.category]) throw new Error(`Catégorie inconnue pour ${tool.name} : ${tool.category}`);
}

const fmt = (n: number) => String(n).replace(".", ",");

const levelBands = (labelSize: number) => ({
  silent: true,
  label: { position: "top" as const, color: INK_SOFT, fontSize: labelSize, fontWeight: "bold" as const, distance: 8 },
  data: LEVEL_NAMES.map((name, i) => [
    { name, xAxis: LEVEL_BOUNDS[i], itemStyle: { color: LEVEL_SHADES[i] } },
    { xAxis: LEVEL_BOUNDS[i + 1] },
  ]),
});

const levelLines = {
  silent: true,
  symbol: "none",
  label: { show: false },
  lineStyle: { color: GRID, width: 1.1, opacity: 0.55, type: "solid" as const },
  data: LEVEL_BOUNDS.slice(1, -1).map((x) => ({ xAxis: x })),
};

const scoreAxis = (min: number, max: number, nameGap: number) => ({
  type: "value" as const,
  min,
  max,
  interval: 1,
  name: "Score du diagnostic (0–20)",
  nameLocation: "middle" as const,
  nameGap,
  nameTextStyle: { color: INK, fontSize: 18 },
  axisLabel: { color: INK_SOFT, fontSize: 14, formatter: (v: number) => (Number.isInteger(v) && v >= 0 && v <= 20 ? String(v) : "") },
  axisLine: { show: false },
  axisTick: { show: false },
  splitLine: { lineStyle: { color: GRID, opacity: 0.28, type: [4, 5] } },
});

const legend = (position: Record<string, number | string>) => ({
  ...position,
  orient: "vertical" as const,
  backgroundColor: "rgba(22, 32, 58, 0.92)",
  borderColor: GRID,
  borderWidth: 1,
  padding: 14,
  itemGap: 8,
  textStyle: { color: INK, fontSize: 13 },
  data: Object.keys(CATEGORY_COLORS),
});

function render(option: echarts.EChartsCoreOption, width: number, height: number, file: string) {
  const chart = echarts.init(null, null, { renderer: "svg", ssr: true, width, height });
  chart.setOption({ animation: false, backgroundColor: BG, textStyle: { fontFamily: FONT }, ...option });
  const svg = chart.renderToSVGString();
  chart.dispose();
  const png = new Resvg(svg, { font: { loadSystemFonts: true, defaultFontFamily: "DejaVu Sans" } }).render().asPng();
  writeFileSync(join(outDir, file), png);
}

function rangesFigure() {
  const sorted = [...tools].sort((a, b) => a.min - b.min || b.max - a.max);
  const names = sorted.map((t) => t.name);
  const width = 2304;
  const height = Math.round(220 + sorted.length * 42);

  render(
    {
      title: {
        text: "Répartition des outils IA par plage de score",
        left: "center",
        top: 24,
        textStyle: { color: "#f8fafc", fontSize: 26, fontWeight: "bold" },
      },
      legend: legend({ left: 230, top: 150 }),
      grid: { left: 190, right: 120, top: 120, bottom: 80 },
      xAxis: scoreAxis(0, 20, 44),
      yAxis: {
        type: "category",
        data: names,
        axisLabel: { color: INK, fontSize: 13 },
        axisLine: { show: false },
        axisTick: { show: false },
      },
      series: [
        {
          name: "base",
          type: "bar",
          stack: "range",
          data: sorted.map((t) => t.min),
          itemStyle: { color: "transparent" },
          silent: true,
          markArea: levelBands(17),
          markLine: levelLines,
        },
        ...Object.entries(CATEGORY_COLORS).map(([category, color]) => ({
          name: category,
          type: "bar" as const,
          stack: "range",
          barWidth: "62%",
          itemStyle: { color },
          data: sorted.map((t) => (t.category === category ? t.max - t.min : "-")),
          label: {
            show: true,
            position: "right" as const,
            color: INK_FAINT,
            fontSize: 11.5,
            formatter: ({ dataIndex }: { dataIndex: number }) =>
              `[${fmt(sorted[dataIndex].min)}–${fmt(sorted[dataIndex].max)}]`,
          },
        })),
        {
          name: "centre",
          type: "scatter",
          symbolSize: 11,
          itemStyle: { color: "#f8fafc" },
          data: sorted.map((t, i) => [(t.min + t.max) / 2, i]),
          z: 5,
        },
      ],
    },
    width,
    height,
    "tool_distribution_ranges.png",
  );
}

function densityFigure() {
  const width = 2085;
  const height = 740;
  const grid = { left: 90, right: 40, top: 100, bottom: 80 };
  const unit = (width - grid.left - grid.right) / 22;

  const counts = Object.fromEntries(
    Object.keys(CATEGORY_COLORS).map((category) => [
      category,
      SCORES.map((s) => tools.filter((t) => t.category === category && t.min <= s && s <= t.max).length),
    ]),
  );
  const totals = SCORES.map((_, i) => Object.values(counts).reduce((sum, c) => sum + c[i], 0));
  const top = Math.max(...totals);

  render(
    {
      title: {
        text: "Densité d'outils disponibles par score – Répartition par catégorie",
        left: "center",
        top: 20,
        textStyle: { color: "#f8fafc", fontSize: 22, fontWeight: "bold" },
      },
      legend: legend({ left: grid.left + 20, top: grid.top + 20 }),
      grid,
      xAxis: scoreAxis(-1, 21, 40),
      yAxis: {
        type: "value",
        min: 0,
        max: Math.ceil((top * 1.12) / 5) * 5,
        interval: 5,
        name: "Nombre d'outils disponibles",
        nameLocation: "middle",
        nameGap: 50,
        nameTextStyle: { color: INK, fontSize: 16 },
        axisLabel: { color: INK_SOFT, fontSize: 14 },
        splitLine: { show: false },
      },
      series: [
        ...Object.entries(CATEGORY_COLORS).map(([category, color], index) => ({
          name: category,
          type: "bar" as const,
          stack: "density",
          barWidth: Math.round(unit * 0.86),
          itemStyle: { color },
          data: SCORES.map((s, i) => [s, counts[category][i]]),
          ...(index === 0 ? { markArea: levelBands(16), markLine: levelLines } : {}),
        })),
        {
          name: "total",
          type: "line",
          data: SCORES.map((s, i) => [s, totals[i]]),
          symbol: "circle",
          symbolSize: 12,
          lineStyle: { color: "#f1f5f9", width: 3 },
          itemStyle: { color: "#f1f5f9" },
          z: 5,
        },
      ],
    },
    width,
    height,
    "tool_distribution_density.png",
  );
}

mkdirSync(outDir, { recursive: true });
rangesFigure();
densityFigure();
console.log(`${tools.length} outils — figures générées dans ${outDir}/`);
