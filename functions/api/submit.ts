import { type Context, ensureDatabase, insertSubmission, json, preflight, toFloat } from "./_lib";

export async function POST(request: Request, context: Context): Promise<Response> {
  let body: { answers?: Record<string, unknown>; scoreTotal?: unknown };
  try {
    body = await request.json();
  } catch {
    return json({ error: "Corps JSON invalide" }, 400);
  }

  const answers = body.answers && typeof body.answers === "object" ? body.answers : {};
  try {
    await ensureDatabase(context.env.DB);
    await insertSubmission(context.env.DB, answers, toFloat(body.scoreTotal));
    return json({ status: "ok" }, 201);
  } catch (err) {
    console.error("submit failed", err);
    return json({ error: "Enregistrement impossible" }, 500);
  }
}

export function OPTIONS(): Response {
  return preflight();
}
