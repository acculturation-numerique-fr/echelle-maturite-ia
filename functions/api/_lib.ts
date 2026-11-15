export interface D1Result<T = Record<string, unknown>> {
  results?: T[];
}

export interface D1PreparedStatement {
  bind(...values: unknown[]): D1PreparedStatement;
  all<T = Record<string, unknown>>(): Promise<D1Result<T>>;
  run(): Promise<unknown>;
}

export interface D1Database {
  prepare(sql: string): D1PreparedStatement;
}

export interface Env {
  DB: D1Database;
}

export interface Context {
  env: Env;
  params: Record<string, string>;
}

export const QUESTION_IDS = Array.from({ length: 20 }, (_, i) => `Q${String(i + 1).padStart(2, "0")}`);

const COLUMNS = QUESTION_IDS.map((id) => id.toLowerCase());

export const DIMENSIONS: Record<string, string[]> = {
  Connaissances: ["Q01", "Q02", "Q03", "Q04", "Q05"],
  "Prise en main": ["Q06", "Q07", "Q08", "Q09"],
  Usages: ["Q10", "Q11", "Q12", "Q13", "Q14"],
  "Usages avancés": ["Q15", "Q16", "Q17"],
  "Usages experts": ["Q18", "Q19", "Q20"],
};

const BASELINE = {
  count: 0,
  avgScore: 11.2,
  avgDimensions: {
    Connaissances: { score: 3.1, max: 5, percent: 62 },
    "Prise en main": { score: 2.3, max: 4, percent: 58 },
    Usages: { score: 2.6, max: 5, percent: 52 },
    "Usages avancés": { score: 1.6, max: 3, percent: 53 },
    "Usages experts": { score: 1.6, max: 3, percent: 53 },
  },
};

export function toFloat(value: unknown): number {
  const n = typeof value === "number" ? value : Number.parseFloat(String(value ?? ""));
  return Number.isFinite(n) ? n : 0;
}

export function timestampNow(date = new Date()): string {
  const p = (n: number) => String(n).padStart(2, "0");
  return `${date.getUTCFullYear()}-${p(date.getUTCMonth() + 1)}-${p(date.getUTCDate())}-${p(date.getUTCHours())}-${p(date.getUTCMinutes())}`;
}

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export function json(data: unknown, status = 200): Response {
  return Response.json(data, { status, headers: CORS });
}

export function preflight(): Response {
  return new Response(null, { status: 204, headers: CORS });
}

let ready: Promise<void> | null = null;

export function ensureDatabase(db: D1Database): Promise<void> {
  ready ??= setup(db).catch((err) => {
    ready = null;
    throw err;
  });
  return ready;
}

async function setup(db: D1Database): Promise<void> {
  const questionCols = COLUMNS.map((c) => `${c} DOUBLE NOT NULL DEFAULT 0`).join(", ");
  await db
    .prepare(
      `CREATE TABLE IF NOT EXISTS submissions (
        id BIGINT AUTO_INCREMENT PRIMARY KEY,
        timestamp VARCHAR(32) NOT NULL,
        score_total DOUBLE NOT NULL DEFAULT 0,
        ${questionCols}
      )`,
    )
    .run();
}

export async function insertSubmission(db: D1Database, answers: Record<string, unknown>, scoreTotal: number) {
  await db
    .prepare(
      `INSERT INTO submissions (timestamp, score_total, ${COLUMNS.join(", ")}) VALUES (?, ?, ${COLUMNS.map(() => "?").join(", ")})`,
    )
    .bind(timestampNow(), scoreTotal, ...QUESTION_IDS.map((id) => toFloat(answers[id])))
    .run();
}

export async function computeStats(db: D1Database) {
  const dimensionSelects = Object.entries(DIMENSIONS)
    .map(([, ids], i) => `AVG(${ids.map((id) => id.toLowerCase()).join(" + ")}) AS d${i}`)
    .join(", ");
  const { results } = await db
    .prepare(`SELECT COUNT(*) AS n, AVG(score_total) AS avg_score, ${dimensionSelects} FROM submissions`)
    .all<Record<string, number | string | null>>();
  const row = results?.[0];
  const count = toFloat(row?.n);
  if (!row || count === 0) return BASELINE;

  const avgDimensions: Record<string, { score: number; max: number; percent: number }> = {};
  Object.entries(DIMENSIONS).forEach(([name, ids], i) => {
    const avg = toFloat(row[`d${i}`]);
    avgDimensions[name] = {
      score: Math.round(avg * 100) / 100,
      max: ids.length,
      percent: Math.round((avg / ids.length) * 100),
    };
  });

  return {
    count,
    avgScore: Math.round(toFloat(row.avg_score) * 10) / 10,
    avgDimensions,
  };
}
