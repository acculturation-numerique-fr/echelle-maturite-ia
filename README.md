# Échelle de maturité en intelligence artificielle

Ce depot contient l'implementation V1 du diagnostic interactif (nom court: diagnostic de maturite IA).

## Structure

```txt
.
├── app/
│   ├── app.js
│   ├── index.html
│   └── styles.css
└── worker/
    ├── index.js
    └── README.md
```

## V1 implementee

- Front statique en `HTML/CSS/JS` + `Alpine.js`.
- Questionnaire 20 criteres (Q01-Q20), score global sur 20.
- Restitution immediate:
  - niveau et profil;
  - scores par dimensions;
  - recommandations contextualisees.
- Formulaire final optionnel (RGPD, consentement, validation e-mail).
- Envoi securise vers webhook Cloudflare Worker.
- Mapping Airtable cote serveur (aucune cle API exposee dans le front).

## Lancer localement

Option simple:

```bash
cd app
python3 -m http.server 8080
```

Puis ouvrir:

- `http://localhost:8080`

## Integration WordPress

- Copier le contenu du `<main id="an-diagnostic">...</main>` depuis `app/index.html` dans un bloc HTML personnalise.
- Charger `styles.css`, `app.js` et Alpine.js (CDN) sur la page.
- Renseigner `data-webhook-url="https://votre-worker.workers.dev"` sur le conteneur principal.

## Webhook Cloudflare

Voir `worker/README.md` pour:

- la configuration des secrets;
- le deploiement;
- un exemple de test `curl`.
