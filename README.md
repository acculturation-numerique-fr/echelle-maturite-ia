# Échelle de maturité en intelligence artificielle

![Aperçu du Tableau de Maturité IA](app/assets/preview.webp)

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat-square&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat-square&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat-square&logo=javascript&logoColor=black)
![Alpine.js](https://img.shields.io/badge/Alpine.js-8BC0D0?style=flat-square&logo=alpinejs&logoColor=white)

## Structure

```txt
.
├── app/
│   ├── index.html
│   └── assets/
│       ├── css/
│       │   ├── styles.css
│       │   └── pdf.css
│       ├── js/
│       │   └── app.js
│       ├── icons/    # Logos WebP locaux des outils et marques (chatgpt, claude, langgraph, etc.)
│       └── preview.webp
└── README.md
```

## Fonctionnalités principales

- Front statique en `HTML/CSS/JS` + `Alpine.js`.
- Questionnaire 20 critères (Q01-Q20), score global sur 20.
- Restitution immédiate :
  - niveau et profil ;
  - scores par critères ;
  - recommandations contextualisées.
- Export direct en PDF côté navigateur (fichier `Diagnostic-maturite-IA.pdf`, sans en-têtes/pieds de page navigateur).
- Aucune collecte de données personnelles côté front.

## Lancer localement

Option simple :

```bash
cd app
python3 -m http.server 8080
```

Puis ouvrir :

- `http://localhost:8080`

## Intégration WordPress

- Copier le contenu du `<main id="an-diagnostic">...</main>` depuis `app/index.html` dans un bloc HTML personnalisé.
- Charger `assets/css/styles.css`, `assets/css/pdf.css`, `assets/js/app.js`, Alpine.js, `html2canvas` et `jsPDF` (CDN) sur la page.

## Feuille de route

- [ ] Intégrer le module de diagnostic sur le site WordPress.
- [ ] Ajouter la comparaison avec les résultats moyens des utilisateurs sur le tableau de bord (courbe et radar).
- [ ] Générer un QR Code de partage avec suivi pour les conférences et les cours.
