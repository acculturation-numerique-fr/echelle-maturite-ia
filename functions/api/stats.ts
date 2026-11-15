import { type Context, computeStats, ensureDatabase, json, preflight } from "./_lib";

export async function GET(_request: Request, context: Context): Promise<Response> {
  try {
    await ensureDatabase(context.env.DB);
    return json(await computeStats(context.env.DB));
  } catch (err) {
    console.error("stats failed", err);
    return json({ error: "Statistiques indisponibles" }, 500);
  }
}

export function OPTIONS(): Response {
  return preflight();
}
