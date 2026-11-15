#!/usr/bin/env node
// Assemble le dossier publié sur Spacefast : site statique (app/) + fonctions TypeScript (functions/).
// Usage : node scripts/build-spacefast.mjs [--seed data/supabase-export.json] [--out dist-spacefast]
import { cpSync, existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { createHash } from "node:crypto";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const args = process.argv.slice(2);
const arg = (name, fallback) => {
  const i = args.indexOf(name);
  return i >= 0 ? args[i + 1] : fallback;
};

const out = resolve(root, arg("--out", "dist-spacefast"));
const seedPath = arg("--seed");
const questionIds = Array.from({ length: 20 }, (_, i) => `Q${String(i + 1).padStart(2, "0")}`);
const num = (v) => {
  const n = typeof v === "number" ? v : Number.parseFloat(String(v ?? ""));
  return Number.isFinite(n) ? n : 0;
};

rmSync(out, { recursive: true, force: true });
mkdirSync(out, { recursive: true });
cpSync(join(root, "app"), out, { recursive: true });
cpSync(join(root, "functions"), join(out, "functions"), { recursive: true });

let rows = [];
if (seedPath) {
  const raw = JSON.parse(readFileSync(resolve(root, seedPath), "utf8"));
  if (!Array.isArray(raw)) throw new Error("Le fichier d'export doit contenir un tableau de lignes.");
  rows = raw.map((r) => ({
    sourceId: String(r.id ?? createHash("sha256").update(JSON.stringify(r)).digest("hex").slice(0, 40)),
    timestamp: String(r.timestamp ?? r.created_at ?? ""),
    scoreTotal: num(r.score_total ?? r.scoreTotal),
    answers: questionIds.map((q) => num(r[q] ?? r[q.toLowerCase()])),
  }));
  const ids = new Set(rows.map((r) => r.sourceId));
  if (ids.size !== rows.length) throw new Error("Identifiants Supabase en double dans l'export.");
}

const seedFile = join(out, "functions", "api", "_seed.ts");
if (!existsSync(seedFile)) throw new Error("functions/api/_seed.ts introuvable.");
writeFileSync(
  seedFile,
  `export interface SeedRow { sourceId: string; timestamp: string; scoreTotal: number; answers: number[] }\n` +
    `export const SEED_ROWS: SeedRow[] = ${JSON.stringify(rows)};\n`,
);

console.log(`Dossier prêt : ${out} (${rows.length} ligne(s) Supabase à importer)`);
