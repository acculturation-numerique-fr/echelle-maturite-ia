# Architecture technique — Diagnostic de Maturité IA

Version : 1.0  
Projet : Acculturation Numérique

---

## 1. Objectif technique

Construire une web-app légère, maintenable et intégrable dans WordPress sans framework lourd.

La V1 doit fonctionner avec :

- HTML ;
- CSS ;
- JavaScript ;
- Alpine.js ;
- webhook sécurisé ;
- Airtable en base de réception optionnelle.

---

## 2. Stack retenue

| Couche | Choix | Rôle |
|---|---|---|
| Structure | HTML5 | Structure de la page et du diagnostic. |
| Style | CSS vanilla | Design isolé, responsive, sans dépendance lourde. |
| Réactivité | Alpine.js | État du questionnaire, navigation, calcul du score. |
| Graphique V1 | CSS / SVG | Barres par dimension ou radar léger. |
| Collecte | Webhook | Réception sécurisée des données. |
| Base | Airtable | Stockage des leads et résultats. |
| Intégration | WordPress | Publication sur le site existant. |

---

## 3. Principe d'architecture

```txt
Navigateur utilisateur
  ↓
Page WordPress avec bloc HTML personnalisé
  ↓
Alpine.js calcule les résultats localement
  ↓
Résultat affiché immédiatement
  ↓
Formulaire optionnel
  ↓
POST JSON vers webhook sécurisé
  ↓
Webhook ajoute la clé Airtable côté serveur
  ↓
Création d'un enregistrement Airtable
```

---

## 4. Point de sécurité essentiel

La clé API Airtable ne doit jamais être exposée dans le JavaScript public.

Interdit :

```js
fetch("https://api.airtable.com/...", {
  headers: {
    Authorization: "Bearer clé_api_visible"
  }
})
```

Correct :

```txt
Frontend public
  → webhook
      → Airtable avec clé privée stockée côté Cloudflare Worker (solution retenue)
```

---

## 5. Webhook : Cloudflare Worker

Pour sécuriser l'envoi des résultats vers Airtable sans exposer la clé API dans le code public, un Cloudflare Worker fait office de webhook intermédiaire.

### Variables d'environnement (Secrets Cloudflare) :
- `AIRTABLE_TOKEN` : Jeton d'accès personnel Airtable (lecture/écriture).
- `AIRTABLE_BASE_ID` : Identifiant unique de la base Airtable.

### Spécifications du endpoint :
- **Méthode** : `POST`
- **Format d'entrée** : `application/json`
- **Format de sortie** : `application/json`

### Payload JSON attendu :
```json
{
  "score_total": 12,
  "level": "Avancé",
  "profile": "Architecte IA",
  "answers": {
    "Q01": true,
    "Q02": false
  },
  "lead": {
    "email": "user@example.com",
    "consent": true
  }
}
```

### Réponses HTTP :
- `200 OK` : `{ "ok": true }` (Succès, record créé).
- `400 Bad Request` : Erreur de validation (champs manquants ou invalides).
- `405 Method Not Allowed` : Requête non-POST.
- `502 Bad Gateway` : Échec de communication avec l'API Airtable.

---

## 6. Intégration WordPress : Bloc HTML personnalisé

L'intégration de l'application s'effectue directement via un bloc HTML personnalisé sur WordPress.

### Configuration du bloc :
- **Type de bloc** : Bloc `HTML personnalisé` (core/html) dans l'éditeur Gutenberg.
- **Modèle de page** : Modèle pleine largeur sans barre latérale (sidebar).

### Ressources à injecter dans le bloc :
- **HTML** : Conteneur principal de l'application Alpine.js.
- **CSS** : Styles isolés insérés dans une balise `<style>`.
- **JS** : Script Alpine.js chargé via CDN.

### Script externe recommandé dans le bloc :
```html
<script defer src="https://cdn.jsdelivr.net/npm/alpinejs@3.x.x/dist/cdn.min.js"></script>
```

### Règles d'isolation CSS :
Pour éviter tout conflit avec le thème WordPress existant, une isolation stricte est appliquée :
- **Sélecteur parent** : `#an-diagnostic` encapsule tout le DOM de l'application.
- **Nomenclature** : Toutes les classes internes utilisent le préfixe unique `an-` (ex: `.an-card`, `.an-btn`, `.an-grid`).

---

## 7. Structure HTML recommandée

```html
<div id="an-diagnostic" x-data="diagnosticIA()">
  <section x-show="step === 'intro'"></section>
  <section x-show="step === 'questions'"></section>
  <section x-show="step === 'results'"></section>
  <section x-show="step === 'lead'"></section>
</div>
```

---

## 8. Structure JavaScript recommandée

```js
function diagnosticIA() {
  return {
    step: 'intro',
    currentCategoryIndex: 0,
    answers: {},
    lead: {},
    questions: [],
    categories: [],
    levels: [],
    dimensions: [],

    start() {},
    toggleAnswer(id) {},
    nextCategory() {},
    previousCategory() {},
    get scoreTotal() {},
    get level() {},
    get dimensionScores() {},
    reset() {},
    submitLead() {}
  }
}
```

---

## 9. Calcul des scores

### Score total

```js
scoreTotal() {
  return Object.values(this.answers).filter(Boolean).length
}
```

### Score par dimension

```js
dimensionScore(dimensionName) {
  return this.questions
    .filter(q => q.dimension === dimensionName)
    .reduce((sum, q) => sum + (this.answers[q.id] ? q.points : 0), 0)
}
```

### Niveau

```js
level() {
  return this.levels.find(l =>
    this.scoreTotal >= l.min && this.scoreTotal <= l.max
  )
}
```

---

## 10. Dépendances

### Alpine.js

Chargement recommandé :

```html
<script defer src="https://cdn.jsdelivr.net/npm/alpinejs@3.x.x/dist/cdn.min.js"></script>
```

### Chart.js

Non recommandé en V1 sauf besoin explicite de radar.

Si utilisé :

```html
<script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
```

---

## 11. Performance

Objectifs :

- temps de chargement rapide ;
- aucune compilation ;
- aucun bundle ;
- pas de dépendance lourde ;
- fonctionnement fluide sur mobile.

Bonnes pratiques :

- CSS inline ou fichier dédié ;
- JavaScript minimal ;
- pas d'images lourdes ;
- pas de tracking inutile ;
- pas de librairie graphique si barres CSS suffisantes.

---

## 12. RGPD

Le diagnostic peut être passé sans collecte de données personnelles.

La collecte ne commence qu'au formulaire optionnel.

À prévoir :

- case de consentement explicite ;
- lien vers la politique de confidentialité ;
- finalité claire : recevoir le diagnostic et être recontacté ;
- minimisation des données collectées.

Texte court :

> J'accepte que les informations saisies soient utilisées par Acculturation Numérique pour m'envoyer mon diagnostic et me recontacter au sujet de mes besoins en formation IA.

---

## 13. Tests avant mise en ligne

Checklist :

- score correct pour 0, 2, 3, 5, 6, 10, 11, 15, 16, 20 ;
- catégories correctement affichées ;
- responsive mobile ;
- formulaire optionnel fonctionnel ;
- erreur webhook gérée ;
- consentement obligatoire si formulaire soumis ;
- page testée dans Chrome, Firefox, Safari mobile.

---

## 14. Charte Graphique & Design System (Institutional Minimalist)

```yaml
name: Institutional Minimalist
colors:
  surface: '#f9f9f9'
  surface-dim: '#dadada'
  surface-bright: '#f9f9f9'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f3f3f4'
  surface-container: '#eeeeee'
  surface-container-high: '#e8e8e8'
  surface-container-highest: '#e2e2e2'
  on-surface: '#1a1c1c'
  on-surface-variant: '#434656'
  inverse-surface: '#2f3131'
  inverse-on-surface: '#f0f1f1'
  outline: '#737688'
  outline-variant: '#c3c5d9'
  surface-tint: '#004ced'
  primary: '#0052ff'
  on-primary: '#ffffff'
  primary-container: '#0052ff'
  on-primary-container: '#dfe3ff'
  inverse-primary: '#b7c4ff'
  secondary: '#5e5e61'
  on-secondary: '#ffffff'
  secondary-container: '#e3e2e5'
  on-secondary-container: '#646467'
  tertiary: '#4c4e4f'
  on-tertiary: '#ffffff'
  tertiary-container: '#656666'
  on-tertiary-container: '#e4e4e4'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#dde1ff'
  primary-fixed-dim: '#b7c4ff'
  on-primary-fixed: '#001452'
  on-primary-fixed-variant: '#0038b6'
  secondary-fixed: '#e3e2e5'
  secondary-fixed-dim: '#c7c6c9'
  on-secondary-fixed: '#1b1c1e'
  on-secondary-fixed-variant: '#464749'
  tertiary-fixed: '#e2e2e2'
  tertiary-fixed-dim: '#c6c6c7'
  on-tertiary-fixed: '#1a1c1c'
  on-tertiary-fixed-variant: '#454747'
  background: '#f9f9f9'
  on-background: '#1a1c1c'
  surface-variant: '#e2e2e2'
typography:
  display-lg:
    fontFamily: Inter
    fontSize: 64px
    fontWeight: '400'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  display-md:
    fontFamily: Inter
    fontSize: 48px
    fontWeight: '400'
    lineHeight: '1.2'
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '400'
    lineHeight: '1.3'
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '400'
    lineHeight: '1.4'
    letterSpacing: -0.02em
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
    letterSpacing: 0em
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
    letterSpacing: 0em
  data-lg:
    fontFamily: JetBrains Mono
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.5'
    letterSpacing: 0em
  data-sm:
    fontFamily: JetBrains Mono
    fontSize: 14px
    fontWeight: '400'
    lineHeight: '1.5'
    letterSpacing: 0em
  label-caps:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: '1.2'
    letterSpacing: 0.05em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 8px
  xs: 4px
  sm: 12px
  md: 24px
  lg: 48px
  xl: 80px
  section: 120px
  gutter: 24px
  margin: 48px
```

### Brand & Style

Le design system suit une philosophie **Monochrome & Blue Accent** — une esthétique "Quiet Luxury" qui équilibre la sobriété professionnelle avec des ancres fonctionnelles à haute visibilité. Il est conçu pour évoquer une autorité sereine, en donnant la priorité à la clarté des données tout en fournissant des cibles d'interaction indéniables.

La narration visuelle est portée par des dégradés de gris et un respect rigoureux de la grille. En éliminant l'ornementation superflue et en s'appuyant sur des surfaces plates et une typographie à fort contraste, le design system offre une interface premium sans distraction.

*Note : Cette section est la source de vérité canonique pour les standards d'interface (UI) dans ce dépôt.*

### Colors

La palette de couleurs est volontairement restreinte pour maximiser l'impact des actions principales.

- **Canvas** : L'arrière-plan structurel principal est un blanc neutre ou un gris très clair.
- **Structure Monochrome** : Les éléments structurels (barre latérale, en-têtes, texte statique) utilisent une palette allant du gris foncé au gris moyen (`#1a1c1c` à `#9ca3af`).
- **Blue Accents** : Un "Bleu Primaire" vibrant (`#0052ff`) est réservé exclusivement aux éléments interactifs ou actifs (onglets actifs, boutons actifs, états de survol sur les boutons d'action).
- **Feedback Interactif** : Les éléments d'action (boutons, liens "Ajouter") sont gris par défaut et deviennent bleus uniquement lors de l'interaction (survol).

### Typography

Ce design system utilise une approche à double police pour distinguer le contenu narratif des données techniques.

- **Inter** est la police principale, utilisée pour le texte de présentation et le corps du texte. Pour obtenir un aspect éditorial, tous les titres et styles d'affichage sont définis avec une graisse 400 et un espacement des lettres serré de -0.02em. Cela crée un style "suisse" moderne et épuré.
- **JetBrains Mono** est utilisée exclusivement pour les données tabulaires, les montants, les identifiants et les étiquettes numériques. Cela garantit que la largeur des caractères reste constante lors des changements de valeur, ce qui est essentiel pour la lisibilité et un style technique de type "pro-tool".

### Layout & Spacing

La mise en page suit un modèle de **grille fixe** pour offrir une expérience de lecture stable et prévisible. Une grille de 12 colonnes est utilisée pour les vues de bureau, avec des marges généreuses de 48px pour laisser respirer le contenu.

Le rythme vertical est établi par des "Bandes d'Élévation" — des sections horizontales pleine largeur alternant entre le Blanc et le Gris Doux (`#f7f7f7`). Cela remplace le besoin de séparateurs lourds. L'espacement entre les sections majeures doit être généreux (120px) pour maintenir le ton éditorial, tandis que le rembourrage interne des cartes reste constant (24px).

### Elevation & Depth

Ce design system évite les ombres portées traditionnelles au profit de **Couches Tonales** et de **Contours à Faible Contraste**.

- **Niveaux de Surface** : La profondeur est principalement indiquée en plaçant des cartes blanches au-dessus des bandes d'élévation gris doux.
- **Bordures Fines** : Les éléments sont définis par des bordures fines de 1px (utilisant un gris subtil comme `#eceff1`) plutôt que par des ombres.
- **L'exception "Flottante"** : Dans les sections héros éditoriales sombres, les maquettes d'interface produit utilisent une ombre ambiante subtile et très diffuse pour créer une sensation d'espace tridimensionnel, les faisant apparaître comme flottant au-dessus de l'arrière-plan noir.

### Shapes

Le langage géométrique est une signature de ce design system, utilisant des rayons distincts pour catégoriser les éléments.

- **Éléments Standards** : Les éléments d'interface utilisateur tels que les champs de saisie et les petits conteneurs utilisent un rayon standard de 8px (0.5rem).
- **Cartes** : Les grands conteneurs d'informations et les cartes de produits doivent utiliser un rayon de **24px (1.5rem)**. Ce grand rayon crée un contraste chaleureux et accessible avec la typographie stricte.
- **Boutons & Pilules** : Tous les boutons et badges de statut ont une forme de pilule complète (rayon de 100px), créant une cible de clic distincte.
- **Icônes** : Les icônes sont toujours hébergées dans un conteneur circulaire complet pour maintenir un poids visuel constant.

### Components

#### Buttons
Les boutons principaux sont en forme de pilule, utilisant l'arrière-plan Bleu Primaire avec du texte blanc. Les boutons secondaires doivent utiliser une bordure fine de 1px en gris avec du texte Noir Encre. Les états de survol sont subtils : un léger obscurcissement du bleu ou un léger arrière-plan gris pour les boutons secondaires.

#### Cards
Les cartes sont le conteneur principal de toutes les données du diagnostic. Elles disposent d'un rayon d'angle de 24px, d'une bordure fine de 1px et d'aucune ombre. Les cartes doivent être placées sur un fond Gris Doux pour créer une impression de "relief" uniquement grâce au contraste de couleur.

#### Input Fields
Les champs de saisie suivent une conception minimale : une bordure inférieure de 1px ou un cadre fin. Ils utilisent Inter pour les étiquettes et JetBrains Mono pour le texte saisi (notamment pour les données chiffrées).

#### Lists & Tables
Les tableaux de restitution utilisent JetBrains Mono pour toutes les valeurs numériques. Les hauteurs de ligne sont généreuses (minimum 56px) pour éviter l'encombrement visuel, avec de minces séparateurs entre les entrées.

#### Dark Hero Sections
Un composant spécialisé pour la section d'introduction. L'arrière-plan est Noir Encre (`#0a0b0d`). Il contient une grande typographie Display en Blanc et comporte des cartes "Floating UI" — des composants de cartes plus petits avec des rayons de 24px utilisant des ombres subtiles pour apparaître comme s'ils étaient suspendus devant l'arrière-plan.
