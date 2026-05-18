# Modèle de données — Diagnostic de Maturité IA

Version : 1.0  
Projet : Acculturation Numérique

---

## 1. Objectif

Définir les données nécessaires au fonctionnement du diagnostic, à la restitution utilisateur et à la collecte optionnelle dans Airtable.

---

## 2. Données côté front

### Réponses

Format recommandé :

```json
{
  "Q01": true,
  "Q02": false,
  "Q03": true
}
```

Chaque clé correspond à un critère canonique.

---

## 3. Objet question

```json
{
  "id": "Q01",
  "category": "Connaissances",
  "dimension": "Culture & cadre IA",
  "label": "Je sais ce qu'est l'IA et comment elle fonctionne.",
  "points": 1
}
```

Champs :

| Champ | Type | Description |
|---|---|---|
| id | string | Identifiant stable de la question. |
| category | string | Catégorie affichée dans le questionnaire. |
| dimension | string | Dimension utilisée pour la restitution graphique. |
| label | string | Texte utilisateur. |
| points | number | Nombre de points, 1 en V1. |

---

## 4. Objet niveau

```json
{
  "min": 6,
  "max": 10,
  "level": "Intermédiaire",
  "profile": "Opérateur augmenté",
  "summary": "Vous utilisez déjà l'IA dans votre quotidien...",
  "next_step": "Structurer vos prompts et créer une bibliothèque réutilisable."
}
```

---

## 5. Payload envoyé au webhook

```json
{
  "submitted_at": "2026-05-18T22:30:00.000Z",
  "score_total": 8,
  "level": "Intermédiaire",
  "profile": "Opérateur augmenté",
  "dimension_scores": {
    "Culture & cadre IA": 3,
    "Prise en main des outils": 4,
    "Usages opérationnels": 1,
    "Prompting & capitalisation": 0,
    "Personnalisation & autonomie": 0,
    "Technique & automatisation": 0
  },
  "answers": {
    "Q01": true,
    "Q02": true,
    "Q03": true
  },
  "lead": {
    "first_name": "Jean",
    "last_name": "Dupont",
    "email": "jean.dupont@example.com",
    "company": "Acme",
    "job_title": "Directeur marketing",
    "company_size": "10-49 salariés",
    "consent": true
  }
}
```

---

## 6. Table Airtable recommandée

Nom de table :

```txt
Diagnostics IA
```

Champs :

| Champ Airtable | Type | Exemple | Obligatoire |
|---|---|---|---|
| Date | Created time | 18/05/2026 22:30 | Oui |
| Prénom | Single line text | Jean | Non |
| Nom | Single line text | Dupont | Non |
| Email | Email | jean@example.com | Oui si formulaire soumis |
| Entreprise | Single line text | Acme | Non |
| Fonction | Single line text | Directeur marketing | Non |
| Taille entreprise | Single select | 10-49 salariés | Non |
| Score total | Number | 8 | Oui |
| Niveau maturité | Single select | Intermédiaire | Oui |
| Profil | Single select | Opérateur augmenté | Oui |
| Score culture cadre | Number | 3 | Oui |
| Score prise en main | Number | 4 | Oui |
| Score usages opérationnels | Number | 1 | Oui |
| Score prompting | Number | 0 | Oui |
| Score personnalisation | Number | 0 | Oui |
| Score technique automatisation | Number | 0 | Oui |
| Réponses JSON | Long text | {"Q01":true} | Oui |
| Consentement RGPD | Checkbox | true | Oui si formulaire soumis |
| Source | Single line text | diagnostic-ia-wordpress | Non |

---

## 7. Single selects Airtable

### Niveau maturité

- Novice
- Débutant
- Intermédiaire
- Avancé
- Expert

### Profil

- Découvreur IA
- Utilisateur assisté
- Opérateur augmenté
- Architecte IA
- Stratège IA

### Taille entreprise

- Indépendant
- 1-9 salariés
- 10-49 salariés
- 50-249 salariés
- 250 salariés et plus
- Collectivité / organisme public
- Association
- Autre

---

## 8. Données à ne pas collecter en V1

Pour limiter les risques RGPD et simplifier la mise en œuvre, ne pas collecter :

- données sensibles ;
- prompts saisis par l'utilisateur ;
- documents analysés ;
- adresse IP sauf besoin technique du service tiers ;
- scoring psychologique ;
- informations personnelles non nécessaires.

---

## 9. Logique du Webhook (Cloudflare Worker)

Le webhook déployé sur Cloudflare Workers réalise les étapes suivantes :

1. Réception du payload JSON en entrée.
2. Validation minimale des champs reçus.
3. Création d'un enregistrement (record) Airtable avec les clés d'API sécurisées stockées en variables d'environnement.
4. Optionnel (V1.2) : envoi d'un e-mail de confirmation (Brevo, Resend, etc.).

### Validation minimale :

- `score_total` est compris entre 0 et 20 ;
- `level` appartient aux niveaux autorisés ;
- `lead.email` est présent et valide si demande de contact ;
- `lead.consent` vaut `true` si demande de contact.

---

## 10. Exemple Cloudflare Worker

```js
export default {
  async fetch(request, env) {
    if (request.method !== "POST") {
      return new Response("Method not allowed", { status: 405 });
    }

    const payload = await request.json();

    if (
      typeof payload.score_total !== "number" ||
      payload.score_total < 0 ||
      payload.score_total > 20
    ) {
      return new Response("Invalid score", { status: 400 });
    }

    const airtableResponse = await fetch(
      `https://api.airtable.com/v0/${env.AIRTABLE_BASE_ID}/Diagnostics%20IA`,
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${env.AIRTABLE_TOKEN}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          records: [
            {
              fields: {
                "Score total": payload.score_total,
                "Niveau maturité": payload.level,
                "Profil": payload.profile,
                "Email": payload.lead?.email || "",
                "Consentement RGPD": Boolean(payload.lead?.consent),
                "Réponses JSON": JSON.stringify(payload.answers || {})
              }
            }
          ]
        })
      }
    );

    if (!airtableResponse.ok) {
      return new Response("Airtable error", { status: 502 });
    }

    return Response.json({ ok: true });
  }
};
```

---

## 11. Nomenclature stable

Les identifiants `Q01` à `Q20` ne doivent pas changer après mise en production.

Si une question est reformulée :

- conserver le même ID ;
- documenter la modification ;
- éviter de modifier le sens profond de la question.

Si une question est remplacée :

- créer une nouvelle version de diagnostic ;
- conserver la traçabilité.
