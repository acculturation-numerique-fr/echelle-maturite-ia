# Échelle de maturité en intelligence artificielle

![Aperçu du Tableau de Maturité IA](app/assets/public/preview.webp)

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat-square&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat-square&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat-square&logo=javascript&logoColor=black)
![Alpine.js](https://img.shields.io/badge/Alpine.js-8BC0D0?style=flat-square&logo=alpinejs&logoColor=white)

## Structure

```txt
.
├── app/
│   ├── index.html                  # Page unique du diagnostic
│   └── assets/
│       ├── css/
│       │   ├── styles.css          # Styles principaux
│       │   └── pdf.css             # Styles dédiés à l'export PDF
│       ├── js/
│       │   └── app.js              # Logique Alpine.js (questionnaire, scoring, graphiques, export)
│       └── public/                 # Toutes les images du projet
│           ├── preview.webp        # Capture d'écran pour le README
│           ├── *.webp              # 40 logos d'outils IA (chatgpt, claude, gemini, etc.)
│           ├── tool_distribution_ranges.png   # Graphique des plages de score par outil
│           └── tool_distribution_density.png  # Graphique de densité d'outils par score
├── .gitignore
└── README.md
```

## Fonctionnalités principales

- Front statique en `HTML/CSS/JS` + `Alpine.js`, zéro dépendance back-end.
- Questionnaire **20 critères** (Q01–Q20) répartis en 5 dimensions :
  - Connaissances · Prise en main · Usages · Usages avancés · Usages experts
- Chaque critère à 3 états : _Non acquis_ (0 pt) · _Partiel_ (0,5 pt) · _Acquis_ (1 pt).
- Score global sur 20 avec **5 niveaux** : Novice → Débutant → Intermédiaire → Avancé → Expert.
- Restitution immédiate :
  - Niveau et profil personnalisé ;
  - Radar et trajectoire par dimension ;
  - **9 outils IA recommandés** parmi 40, sélectionnés par centralité sur le score obtenu ;
  - Points forts, axes de progression, recommandations contextualisées.
- Export direct en PDF côté navigateur (`Diagnostic-maturite-IA.pdf`).
- Aucune collecte de données personnelles.

## Répartition des outils IA par score

Les 40 outils du catalogue sont affectés chacun à une plage de score `[min, max]`. L'algorithme de recommandation sélectionne les 9 outils les plus pertinents pour le score obtenu.

### Plage de score de chaque outil

![Répartition des outils IA par plage de score](app/assets/public/tool_distribution_ranges.png)

### Densité d'outils disponibles par score

![Densité d'outils par score et par catégorie](app/assets/public/tool_distribution_density.png)

## Lancer localement

```bash
cd app
python3 -m http.server 8080
```

Puis ouvrir `http://localhost:8080`.

## Intégration WordPress

1. Copier le contenu du `<main id="an-diagnostic">…</main>` depuis `app/index.html` dans un bloc HTML personnalisé.
2. Charger `assets/css/styles.css`, `assets/css/pdf.css`, `assets/js/app.js`, Alpine.js, `html2canvas` et `jsPDF` (CDN) sur la page.

## Feuille de route

- [ ] Intégrer le module de diagnostic sur le site WordPress.
- [ ] Générer un QR Code de partage avec suivi pour les conférences et les cours.
