# Échelle de maturité en intelligence artificielle

![Aperçu du Tableau de Maturité IA](https://raw.githubusercontent.com/wiki/acculturation-numerique-fr/echelle-maturite-ia/landing.webp)

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat-square&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat-square&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat-square&logo=javascript&logoColor=black)
![Alpine.js](https://img.shields.io/badge/Alpine.js-8BC0D0?style=flat-square&logo=alpinejs&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white)

## Structure

```txt
.
├── app/                            # Site statique
│   ├── index.html                  # Page principale
│   └── assets/                     # CSS, JS, catalogue d'outils (data/tool-ranges.json)
├── functions/api/                  # Fonctions Spacefast en TypeScript
│   ├── submit.ts                   # POST /api/submit : enregistre un diagnostic
│   ├── stats.ts                    # GET /api/stats : moyennes globales et par dimension
│   └── _lib.ts                     # Questions, dimensions et accès à la base
├── scripts/
│   ├── build-spacefast.mjs         # Assemble app/ et functions/ pour la publication
│   └── visualize-tools.ts          # Génère les figures du catalogue d'outils (ECharts)
├── package.json                    # Scripts npm (build, figures)
├── .gitignore
└── README.md
```

## Hébergement

Le site est hébergé sur [Spacefast](https://spacefast.com) : fichiers statiques et fonctions TypeScript, avec une base MySQL propre au Space (accessible via `env.DB`).

```bash
npm run build
npx -y spacefast@latest publish dist-spacefast --space <spaceId>
```

En local, le site s'ouvre avec n'importe quel serveur statique (par exemple `npx serve app`) ; sans les fonctions, la moyenne comparative n'est simplement pas affichée.

La liste des questions est définie dans `app/assets/js/app.js` et reprise dans `functions/api/_lib.ts` (identifiants et dimensions). Toute modification du questionnaire doit être répercutée dans les deux fichiers, avec un nouveau nom de table si les identifiants changent.

## Fonctionnalités principales

![Formulaire de diagnostic](https://raw.githubusercontent.com/wiki/acculturation-numerique-fr/echelle-maturite-ia/form.webp)
Le questionnaire s'articule autour de **25 critères** (Q01 à Q25), répartis à raison de cinq par dimension : Connaissances, Prise en main, Usages, Usages avancés et Usages experts. Chaque critère est évalué selon trois seuils d'acquisition (Non acquis, Partiel, Acquis) ; le total des points est ramené à un score global sur 20. Ce résultat permet de classifier l'utilisateur selon **5 niveaux** de maturité, du stade Novice au profil Expert.

<br>

![Restitution des résultats](https://raw.githubusercontent.com/wiki/acculturation-numerique-fr/echelle-maturite-ia/result.webp)
À l'issue de l'évaluation, le système délivre une restitution analytique immédiate avec des statistiques comparatives. Le profil expose un radar superposant les performances à la moyenne globale, ainsi que des barres mesurant l'écart à la norme par critère. Le rapport est exportable au format PDF (`Diagnostic-maturite-IA.pdf`).

### Répartition des outils IA par score

Les 42 outils du catalogue sont affectés chacun à une plage de score `[min, max]`. L'algorithme de recommandation sélectionne les 9 outils les plus pertinents pour le score obtenu. Vous pouvez consulter le [catalogue complet des applications et outils](https://github.com/acculturation-numerique-fr/echelle-maturite-ia/wiki) pour voir la liste détaillée (liens, icônes, plages de score et descriptions).

Les figures ci-dessous se régénèrent après chaque modification de `app/assets/data/tool-ranges.json` :

```bash
npm install
npm run figures
```

#### Plage de score de chaque outil

![Répartition des outils IA par plage de score](https://raw.githubusercontent.com/wiki/acculturation-numerique-fr/echelle-maturite-ia/figures/tool_distribution_ranges.png)

#### Densité d'outils disponibles par score

![Densité d'outils disponibles par score](https://raw.githubusercontent.com/wiki/acculturation-numerique-fr/echelle-maturite-ia/figures/tool_distribution_density.png)
