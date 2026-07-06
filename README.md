# Échelle de maturité en intelligence artificielle

![Aperçu du Tableau de Maturité IA](https://raw.githubusercontent.com/wiki/acculturation-numerique-fr/echelle-maturite-ia/landing.webp)

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat-square&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat-square&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat-square&logo=javascript&logoColor=black)
![Alpine.js](https://img.shields.io/badge/Alpine.js-8BC0D0?style=flat-square&logo=alpinejs&logoColor=white)
![Python](https://img.shields.io/badge/Python-3776AB?style=flat-square&logo=python&logoColor=white)

## Structure

```txt
.
├── app/                            # Interface web
│   ├── index.html                  # Page principale
│   └── assets/                     # Ressources
│       ├── css/                    # Styles
│       ├── js/                     # Scripts
│       └── public/                 # Images & médias
├── api/                            # Fonctions Serverless (Vercel)
│   ├── stats.py
│   └── submit.py
├── local_server.py                 # Serveur local Python pour les tests
├── vercel.json                     # Configuration Vercel
├── .gitignore
└── README.md
```

## Fonctionnalités principales

![Formulaire de diagnostic](https://raw.githubusercontent.com/wiki/acculturation-numerique-fr/echelle-maturite-ia/form.webp)
Le questionnaire s'articule autour de **20 critères** (Q01 à Q20), répartis sur cinq dimensions : Connaissances, Prise en main, Usages, Usages avancés et Usages experts. Chaque critère est évalué selon trois seuils d'acquisition (Non acquis, Partiel, Acquis) pour établir un score global sur 20. Ce résultat permet de classifier l'utilisateur selon **5 niveaux** de maturité, du stade Novice au profil Expert.

<br>

![Restitution des résultats](https://raw.githubusercontent.com/wiki/acculturation-numerique-fr/echelle-maturite-ia/result.webp)
À l'issue de l'évaluation, le système délivre une restitution analytique immédiate avec des statistiques comparatives. Le profil expose un radar superposant les performances à la moyenne globale, ainsi que des barres mesurant l'écart à la norme par critère. Le rapport est exportable au format PDF (`Diagnostic-maturite-IA.pdf`).

### Répartition des outils IA par score

Les 40 outils du catalogue sont affectés chacun à une plage de score `[min, max]`. L'algorithme de recommandation sélectionne les 9 outils les plus pertinents pour le score obtenu. Vous pouvez consulter le [catalogue complet des applications et outils](https://github.com/acculturation-numerique-fr/echelle-maturite-ia/wiki) pour voir la liste détaillée (liens, icônes, plages de score et descriptions).

#### Plage de score de chaque outil

![Répartition des outils IA par plage de score](https://raw.githubusercontent.com/wiki/acculturation-numerique-fr/echelle-maturite-ia/figures/tool_distribution_ranges.png)

#### Densité d'outils disponibles par score

![Densité d'outils disponibles par score](https://raw.githubusercontent.com/wiki/acculturation-numerique-fr/echelle-maturite-ia/figures/tool_distribution_density.png)

## Lancer localement

```bash
export SUPABASE_URL="ton_url_supabase"
export SUPABASE_KEY="ta_cle_supabase"
python local_server.py
```

Puis ouvrir `http://localhost:8080/`.

> **Note** : Les données sont stockées de façon sécurisée sur Supabase via son API REST native (zéro dépendance locale requise).

## Export des données (CSV)

```bash
export SUPABASE_URL="ton_url_supabase"
export SUPABASE_KEY="ta_cle_supabase"
python scripts/export.py            # -> data/export_<horodatage>.csv
python scripts/export.py --output data/export.csv
```

Le script paginate automatiquement (Supabase/PostgREST limite à 1000 lignes par requête) et exporte les colonnes `timestamp, score_total, Q01..Q20` (déjà anonymisées, aucune donnée personnelle en base). `data/` est ignoré par git.

Un workflow GitHub Actions (`.github/workflows/export-supabase-csv.yml`) exécute cet export chaque jour à 03h00 UTC (et à la demande) et publie le CSV en tant qu'artéfact de build. Pour l'activer, renseigner les secrets du dépôt `SUPABASE_URL` et `SUPABASE_KEY` (Settings → Secrets and variables → Actions).
