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

*Légende :*
- Architecture hybride : Front statique `HTML/CSS/JS` + `Alpine.js` et serveur back-end minimaliste en Python (zéro dépendance externe).
- Questionnaire **20 critères** (Q01–Q20) répartis en 5 dimensions :
  - Connaissances · Prise en main · Usages · Usages avancés · Usages experts
- Chaque critère à 3 états : _Non acquis_ (0 pt) · _Partiel_ (0,5 pt) · _Acquis_ (1 pt).
- Score global sur 20 avec **5 niveaux** : Novice → Débutant → Intermédiaire → Avancé → Expert.

![Restitution des résultats](app/assets/public/result.webp)

*Légende :*
- Restitution immédiate avec statistiques comparées :
  - Niveau et profil personnalisé ;
  - Radar des dimensions avec surimpression de la moyenne globale ;
  - Barres de maturité par critère et comparaison de maturité à la moyenne ;
  - **9 outils IA recommandés** parmi 40, sélectionnés par centralité sur le score obtenu ;
  - Points forts, axes de progression, recommandations contextualisées.
- Export direct en PDF côté navigateur (`Diagnostic-maturite-IA.pdf`) respectant le design et la surimpression des moyennes.
- **Conformité RGPD** : Stockage local des données anonymes en CSV (pas de cloud ou base de données externe).

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
