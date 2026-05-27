# Échelle de maturité en intelligence artificielle

![Aperçu du Tableau de Maturité IA](app/assets/public/landing.webp)

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat-square&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat-square&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat-square&logo=javascript&logoColor=black)
![Alpine.js](https://img.shields.io/badge/Alpine.js-8BC0D0?style=flat-square&logo=alpinejs&logoColor=white)
![PHP](https://img.shields.io/badge/PHP-777BB4?style=flat-square&logo=php&logoColor=white)

## Structure

```txt
.
├── app/                            # Interface web
│   ├── index.html                  # Page principale
│   └── assets/                     # Ressources
│       ├── css/                    # Styles
│       ├── js/                     # Scripts
│       └── public/                 # Images & médias
├── data/
│   └── stats.csv                   # Base de données locale
├── index.php                       # Serveur backend API & Routeur
├── .gitignore
└── README.md
```

## Fonctionnalités principales

![Formulaire de diagnostic](app/assets/public/form.webp)
Le questionnaire s'articule autour de **20 critères** (Q01 à Q20), répartis sur cinq dimensions : Connaissances, Prise en main, Usages, Usages avancés et Usages experts. Chaque critère est évalué selon trois seuils d'acquisition (Non acquis, Partiel, Acquis) pour établir un score global sur 20. Ce résultat permet de classifier l'utilisateur selon **5 niveaux** de maturité, du stade Novice au profil Expert.

<br>

![Restitution des résultats](app/assets/public/result.webp)
À l'issue de l'évaluation, le système délivre une restitution analytique immédiate avec des statistiques comparatives. Le profil expose un radar superposant les performances à la moyenne globale, ainsi que des barres mesurant l'écart à la norme par critère. Le rapport est exportable au format PDF (`Diagnostic-maturite-IA.pdf`).

### Répartition des outils IA par score

Les 40 outils du catalogue sont affectés chacun à une plage de score `[min, max]`. L'algorithme de recommandation sélectionne les 9 outils les plus pertinents pour le score obtenu. Vous pouvez consulter le [catalogue complet des applications et outils](app/assets/public/icons/README.md) pour voir la liste détaillée (liens, icônes, plages de score et descriptions).

#### Plage de score de chaque outil

![Répartition des outils IA par plage de score](app/assets/public/figures/tool_distribution_ranges.png)

#### Densité d'outils disponibles par score

![Densité d'outils par score et par catégorie](app/assets/public/figures/tool_distribution_density.png)

## Lancer localement

```bash
php -S localhost:8000
```

Puis ouvrir `http://localhost:8000/`.

> **Note** : Le fichier `index.php` agit comme routeur et s'appuie sur PHP pour enregistrer les réponses anonymisées et calculer les statistiques comparées en temps réel (`POST index.php?action=submit` et `GET index.php?action=stats`).

