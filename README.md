# Échelle de maturité en intelligence artificielle

![Aperçu du Tableau de Maturité IA](https://raw.githubusercontent.com/wiki/acculturation-numerique-fr/echelle-maturite-ia/landing.webp)

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat-square&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat-square&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat-square&logo=javascript&logoColor=black)
![Alpine.js](https://img.shields.io/badge/Alpine.js-8BC0D0?style=flat-square&logo=alpinejs&logoColor=white)
![Python](https://img.shields.io/badge/Python-3776AB?style=flat-square&logo=python&logoColor=white)
![Django](https://img.shields.io/badge/Django-092E20?style=flat-square&logo=django&logoColor=white)

## Structure

```txt
.
├── app/                            # Interface web & templates
│   ├── index.html                  # Page principale
│   └── assets/                     # Ressources statiques (CSS, JS, médias)
├── core/                           # Application Django unifiée (API, ORM, modèles)
├── api/                            # Pont Serverless Vercel
├── manage.py                       # CLI & serveur local (`python manage.py runserver`)
├── Procfile                        # Configuration de déploiement cloud
├── requirements.txt                # Dépendances Python
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

Les 42 outils du catalogue sont affectés chacun à une plage de score `[min, max]`. L'algorithme de recommandation sélectionne les 9 outils les plus pertinents pour le score obtenu. Vous pouvez consulter le [catalogue complet des applications et outils](https://github.com/acculturation-numerique-fr/echelle-maturite-ia/wiki) pour voir la liste détaillée (liens, icônes, plages de score et descriptions).

#### Plage de score de chaque outil

![Répartition des outils IA par plage de score](https://raw.githubusercontent.com/wiki/acculturation-numerique-fr/echelle-maturite-ia/figures/tool_distribution_ranges.png)

#### Densité d'outils disponibles par score

![Densité d'outils disponibles par score](https://raw.githubusercontent.com/wiki/acculturation-numerique-fr/echelle-maturite-ia/figures/tool_distribution_density.png)
