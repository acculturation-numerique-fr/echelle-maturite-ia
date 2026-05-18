const LEVELS = new Set(["Novice", "Débutant", "Intermédiaire", "Avancé", "Expert"]);

const DIMENSION_FIELD_MAPPING = {
  "Culture & cadre IA": "Score culture cadre",
  "Prise en main des outils": "Score prise en main",
  "Usages opérationnels": "Score usages opérationnels",
  "Prompting & capitalisation": "Score prompting",
  "Personnalisation & autonomie": "Score personnalisation",
  "Technique & automatisation": "Score technique automatisation"
};

function jsonResponse(payload, status = 200, corsOrigin = "*") {
  return new Response(JSON.stringify(payload), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Access-Control-Allow-Origin": corsOrigin,
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type"
    }
  });
}

function normalizeString(value) {
  if (typeof value !== "string") {
    return "";
  }
  return value.trim();
}

function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function isObject(value) {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function getCorsOrigin(request) {
  const requestOrigin = request.headers.get("Origin");
  return requestOrigin || "*";
}

function buildAirtableFields(payload) {
  const lead = isObject(payload.lead) ? payload.lead : {};
  const dimensionScores = isObject(payload.dimension_scores) ? payload.dimension_scores : {};

  const fields = {
    "Prénom": normalizeString(lead.first_name),
    "Nom": normalizeString(lead.last_name),
    "Email": normalizeString(lead.email),
    "Entreprise": normalizeString(lead.company),
    "Fonction": normalizeString(lead.job_title),
    "Taille entreprise": normalizeString(lead.company_size),
    "Score total": payload.score_total,
    "Niveau maturité": payload.level,
    "Profil": normalizeString(payload.profile),
    "Réponses JSON": JSON.stringify(payload.answers || {}),
    "Consentement RGPD": Boolean(lead.consent),
    "Source": normalizeString(payload.source) || "diagnostic-ia-wordpress"
  };

  Object.entries(DIMENSION_FIELD_MAPPING).forEach(([dimensionKey, airtableField]) => {
    const value = Number(dimensionScores[dimensionKey]);
    fields[airtableField] = Number.isFinite(value) ? value : 0;
  });

  return fields;
}

function validatePayload(payload) {
  if (!isObject(payload)) {
    return "Payload JSON invalide";
  }

  if (
    typeof payload.score_total !== "number" ||
    payload.score_total < 0 ||
    payload.score_total > 20
  ) {
    return "score_total doit être un nombre entre 0 et 20";
  }

  if (!LEVELS.has(payload.level)) {
    return "level est invalide";
  }

  if (!isObject(payload.answers)) {
    return "answers doit être un objet";
  }

  const lead = isObject(payload.lead) ? payload.lead : {};
  const email = normalizeString(lead.email);
  const consent = Boolean(lead.consent);

  const hasContactIntent =
    email.length > 0 ||
    consent ||
    normalizeString(lead.first_name).length > 0 ||
    normalizeString(lead.last_name).length > 0 ||
    normalizeString(lead.company).length > 0 ||
    normalizeString(lead.job_title).length > 0;

  if (hasContactIntent) {
    if (!isValidEmail(email)) {
      return "lead.email est requis et doit être valide si formulaire soumis";
    }

    if (!consent) {
      return "lead.consent doit être true si formulaire soumis";
    }
  }

  return null;
}

export default {
  async fetch(request, env) {
    const corsOrigin = getCorsOrigin(request);

    if (request.method === "OPTIONS") {
      return jsonResponse({ ok: true }, 200, corsOrigin);
    }

    if (request.method !== "POST") {
      return jsonResponse({ ok: false, error: "Method not allowed" }, 405, corsOrigin);
    }

    let payload;

    try {
      payload = await request.json();
    } catch (error) {
      return jsonResponse({ ok: false, error: "Invalid JSON body" }, 400, corsOrigin);
    }

    const validationError = validatePayload(payload);
    if (validationError) {
      return jsonResponse({ ok: false, error: validationError }, 400, corsOrigin);
    }

    if (!env.AIRTABLE_TOKEN || !env.AIRTABLE_BASE_ID) {
      return jsonResponse({ ok: false, error: "Server misconfiguration" }, 500, corsOrigin);
    }

    const tableName = env.AIRTABLE_TABLE || "Diagnostics IA";
    const airtableUrl = `https://api.airtable.com/v0/${env.AIRTABLE_BASE_ID}/${encodeURIComponent(tableName)}`;
    const fields = buildAirtableFields(payload);

    try {
      const airtableResponse = await fetch(airtableUrl, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${env.AIRTABLE_TOKEN}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          records: [{ fields }]
        })
      });

      if (!airtableResponse.ok) {
        const details = await airtableResponse.text();
        return jsonResponse(
          {
            ok: false,
            error: "Airtable error",
            details
          },
          502,
          corsOrigin
        );
      }

      return jsonResponse({ ok: true }, 200, corsOrigin);
    } catch (error) {
      return jsonResponse(
        {
          ok: false,
          error: "Upstream request failed"
        },
        502,
        corsOrigin
      );
    }
  }
};
