#!/usr/bin/env node
// Assemble le dossier publié sur Spacefast : site statique (app/) + fonctions TypeScript (functions/).
// Usage : node scripts/build-spacefast.mjs [--out dist-spacefast]
import { cpSync, mkdirSync, rmSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const args = process.argv.slice(2);
const arg = (name, fallback) => {
  const i = args.indexOf(name);
  return i >= 0 ? args[i + 1] : fallback;
};

const out = resolve(root, arg("--out", "dist-spacefast"));
rmSync(out, { recursive: true, force: true });
mkdirSync(out, { recursive: true });
cpSync(join(root, "app"), out, { recursive: true });
cpSync(join(root, "functions"), join(out, "functions"), { recursive: true });

console.log(`Dossier prêt : ${out}`);
