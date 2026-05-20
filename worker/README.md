# Cloudflare Worker - Webhook Airtable

Ce dossier contient le code du webhook sécurisé chargé de réceptionner les diagnostics et de les enregistrer dans Airtable.

## Variables d'environnement

Configurer ces secrets dans Cloudflare Workers :

- `AIRTABLE_TOKEN` : token Airtable avec droit d'écriture
- `AIRTABLE_BASE_ID` : identifiant de base Airtable
- `AIRTABLE_TABLE` (optionnel) : nom de table, par défaut `Diagnostics IA`

## Contrat API

- Méthode : `POST`
- Content-Type : `application/json`
- Réponse succès : `{ "ok": true }`
- Réponse erreur : `{ "ok": false, "error": "..." }`

Le Worker valide :

- `score_total` entre `0` et `20`
- `level` parmi `Novice`, `Débutant`, `Intermédiaire`, `Avancé`, `Expert`
- `answers` objet JSON
- si formulaire soumis : `lead.email` valide et `lead.consent=true`

## Déploiement rapide

```bash
# Depuis worker/
wrangler deploy
```

Puis configurer les secrets :

```bash
wrangler secret put AIRTABLE_TOKEN
wrangler secret put AIRTABLE_BASE_ID
# optionnel
wrangler secret put AIRTABLE_TABLE
```

## Test local (exemple)

```bash
curl -X POST "https://<votre-worker>.workers.dev" \
  -H "Content-Type: application/json" \
  -d '{
    "score_total": 8,
    "level": "Intermédiaire",
    "profile": "Opérateur augmenté",
    "dimension_scores": {
      "Culture & cadre IA": 3,
      "Prise en main des outils": 3,
      "Usages opérationnels": 1,
      "Prompting & capitalisation": 1,
      "Personnalisation & autonomie": 0,
      "Technique & automatisation": 0
    },
    "answers": {"Q01": true, "Q02": false},
    "lead": {
      "first_name": "Jean",
      "last_name": "Dupont",
      "email": "jean.dupont@example.com",
      "company": "Acme",
      "job_title": "Manager",
      "company_size": "10-49 salariés",
      "consent": true
    },
    "source": "diagnostic-ia-wordpress"
  }'
```
