# Échelle de maturité en intelligence artificielle

Ce depot contient la documentation canonique et l'implementation V1 du diagnostic interactif (nom court: diagnostic de maturite IA).

## Structure

```txt
.
├── app/
│   ├── app.js
│   ├── index.html
│   └── styles.css
├── docs/
│   ├── 01_specification_canonique.md
│   ├── 02_positionnement_strategique.md
│   ├── 03_experience_utilisateur.md
│   ├── 04_architecture_technique.md
│   ├── 05_modele_de_donnees.md
│   ├── 06_references_et_benchmarks.md
│   ├── 07_copywriting_et_microtextes.md
│   ├── 08_roadmap_v1_v2.md
│   └── 09_plan_livraison_technique.md
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

## Lecture recommandee

1. `docs/01_specification_canonique.md`
2. `docs/02_positionnement_strategique.md`
3. `docs/03_experience_utilisateur.md`
4. `docs/04_architecture_technique.md`
5. `docs/05_modele_de_donnees.md`
6. `docs/08_roadmap_v1_v2.md`
7. `docs/09_plan_livraison_technique.md`
