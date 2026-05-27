# Échelle de maturité en intelligence artificielle

![Aperçu du Tableau de Maturité IA](app/assets/public/landing.webp)

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat-square&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat-square&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat-square&logo=javascript&logoColor=black)
![Alpine.js](https://img.shields.io/badge/Alpine.js-8BC0D0?style=flat-square&logo=alpinejs&logoColor=white)
![Python](https://img.shields.io/badge/Python-3776AB?style=flat-square&logo=python&logoColor=white)

## Structure

```txt
.
├── app/
│   ├── index.html                  # Page unique du diagnostic
│   └── assets/
│       ├── css/
│       │   ├── app.css             # Styles principaux
│       │   └── pdf.css             # Styles dédiés à l'export PDF
│       ├── js/
│       │   └── app.js              # Logique Alpine.js (questionnaire, scoring, graphiques, export)
│       └── public/
│           ├── landing.webp        # Capture d'écran pour le README
│           ├── form.webp           # Capture d'écran du formulaire
│           ├── result.webp         # Capture d'écran des résultats
│           ├── icons/              # Logos des 40 outils IA et [catalogue complet](app/assets/public/icons/README.md)
│           └── figures/            # Graphiques matplotlib (répartition et densité des outils)
├── data/
│   └── stats.csv                   # Stockage local des réponses (RGPD, pas de base de données externe)
├── server.py                       # Serveur minimaliste (persistance + calcul des moyennes)
├── .gitignore
└── README.md
```

## Fonctionnalités principales

![Formulaire de diagnostic](app/assets/public/form.webp)
Le questionnaire s'articule autour de **20 critères** (Q01 à Q20), répartis sur cinq dimensions : Connaissances, Prise en main, Usages, Usages avancés et Usages experts. Chaque critère est évalué selon trois seuils d'acquisition (Non acquis, Partiel, Acquis) pour établir un score global sur 20. Ce résultat permet de classifier l'utilisateur selon **5 niveaux** de maturité, du stade Novice au profil Expert.

<br>

![Restitution des résultats](app/assets/public/result.webp)
À l'issue de l'évaluation, le système délivre une restitution analytique immédiate avec des statistiques comparatives. Le profil expose un radar superposant les performances à la moyenne globale, ainsi que des barres mesurant l'écart à la norme par critère. Le rapport est exportable au format PDF (`Diagnostic-maturite-IA.pdf`).

## Répartition des outils IA par score

Les 40 outils du catalogue sont affectés chacun à une plage de score `[min, max]`. L'algorithme de recommandation sélectionne les 9 outils les plus pertinents pour le score obtenu. Vous pouvez consulter le [catalogue complet des applications et outils](app/assets/public/icons/README.md) pour voir la liste détaillée (liens, icônes, plages de score et descriptions).

### Plage de score de chaque outil

![Répartition des outils IA par plage de score](app/assets/public/figures/tool_distribution_ranges.png)

### Densité d'outils disponibles par score

![Densité d'outils par score et par catégorie](app/assets/public/figures/tool_distribution_density.png)

## Lancer localement

```bash
python3 server.py 8080
```

Puis ouvrir `http://localhost:8080/app/`.

> **Note** : Il est impératif d'utiliser `server.py` (et non pas un simple serveur statique) car l'application s'appuie sur ce backend pour enregistrer les réponses anonymisées et calculer les statistiques comparées en temps réel (`POST /api/submit` et `GET /api/stats`).

## Intégration WordPress

1. Copier le contenu du `<main id="an-diagnostic">…</main>` depuis `app/index.html` dans un bloc HTML personnalisé.
2. Charger `assets/css/app.css`, `assets/css/pdf.css`, `assets/js/app.js`, Alpine.js, `html2canvas` et `jsPDF` (CDN) sur la page.

## Feuille de route

- [ ] Intégrer le module de diagnostic sur le site WordPress.
- [ ] Générer un QR Code de partage avec suivi pour les conférences et les cours.
