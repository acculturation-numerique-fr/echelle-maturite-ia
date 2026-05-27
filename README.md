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
*L'application repose sur une architecture hybride, alliant une interface client statique (`HTML/CSS/JS` et `Alpine.js`) à un serveur de traitement minimaliste en Python, garantissant ainsi un déploiement sans dépendance externe. Le cadre méthodologique s'articule autour d'un questionnaire de **20 critères** (Q01 à Q20), répartis sur cinq dimensions analytiques : Connaissances, Prise en main, Usages, Usages avancés et Usages experts. Chaque critère est évalué selon trois seuils d'acquisition (Non acquis pour 0 pt, Partiel pour 0,5 pt, Acquis pour 1 pt), permettant d'établir un score d'évaluation sur 20. Ce résultat permet ensuite de classifier la progression de l'utilisateur selon **5 niveaux** de maturité, évoluant du stade Novice au profil Expert.*

<br>

![Restitution des résultats](app/assets/public/result.webp)
*À l'issue de l'évaluation, le système délivre une restitution analytique immédiate, mise en perspective par des statistiques comparatives. Le profil généré expose un graphique en radar superposant les performances à la moyenne globale, complété par des barres de maturité mesurant l'écart à la norme pour chaque critère. Sur la base du score obtenu, un algorithme de centralité isole les **9 outils IA les plus pertinents** au sein d'un catalogue qualifié de 40 solutions, accompagnés de recommandations contextualisées. Le rapport complet est directement exportable au format PDF (`Diagnostic-maturite-IA.pdf`) via le navigateur. Enfin, l'architecture garantit une stricte **conformité RGPD** : les données anonymisées sont exclusivement conservées localement au format CSV, proscrivant tout hébergement cloud externe.*

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
