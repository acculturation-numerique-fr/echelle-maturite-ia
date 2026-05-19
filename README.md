# Échelle de maturité en intelligence artificielle

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat-square&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat-square&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat-square&logo=javascript&logoColor=black)
![Alpine.js](https://img.shields.io/badge/Alpine.js-8BC0D0?style=flat-square&logo=alpinejs&logoColor=white)
![Cloudflare Workers](https://img.shields.io/badge/Cloudflare_Workers-F38020?style=flat-square&logo=cloudflare&logoColor=white)
![Airtable](https://img.shields.io/badge/Airtable-18BFFF?style=flat-square&logo=airtable&logoColor=white)

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

## Fonctionnalités principales

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
