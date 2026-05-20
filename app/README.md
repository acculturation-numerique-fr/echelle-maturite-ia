# Interface Frontend - Diagnostic de Maturité IA

Ce dossier contient l'interface utilisateur (front-end) de l'application de diagnostic de maturité en intelligence artificielle.

## Architecture & Technologies

Le front-end a été conçu de manière ultra-légère, performante et sans build process complexe :

- **Structure :** HTML5 sémantique et accessible.
- **Style & Design :** CSS3 moderne et personnalisé (Vanilla CSS).
  - Utilisation d'un système de design complet basé sur des variables CSS (`:root`).
  - Grille moderne inspirée du style **Bento-grid** avec un look épuré, des surfaces blanches opaques premium, et des coins arrondis (`var(--an-radius-lg)`).
  - Effets d'interaction fluides et transitions d'états matérielles (ex. survols de cartes, changement de scores).
  - Graphiques vectoriels interactifs SVG pour le *Radar des dimensions* et la courbe de *Maturité par paliers*.
- **Réactivité :** **Alpine.js** pour piloter l'état local du questionnaire, mettre à jour les graphiques dynamiques SVG en temps réel et gérer les transitions de pages.
- **Icônes :** Pack d'icônes 100 % local au format `.webp` optimisé pour un chargement instantané sans dépendance vis-à-vis d'un CDN tiers.

## Structure des fichiers du dossier `app/`

```txt
app/
├── app.js        # Modèle de données Alpine.js, calculs de score, règles d'icônes
├── assets/       # Dossier contenant les logos WebP locaux et preview.png
├── index.html    # Balisage principal et intégration des directives Alpine.js
└── styles.css    # Système de design global, mise en page bento-grid et thémisation
```

## Fonctionnement de la Logique Applicative (`app.js`)

Le script `app.js` pilote l'application à l'aide de plusieurs modules clés :
1. **Questions :** Une liste de 20 critères d'évaluation répartis sur 6 dimensions clés.
2. **Calculateur de Score :**
   * Calcule le score global sur 20 points.
   * Génère la répartition détaillée par dimension.
   * Détermine le profil final (ex. Découvreur IA, Expert, etc.).
3. **Mappeur d'icônes local :** La fonction `resolveToolIconUrl` associe automatiquement chaque outil à son icône `.webp` locale stockée dans `app/assets/`.
4. **Soumission :** Envoi asynchrone sécurisé des résultats structurés au webhook Cloudflare Worker (aucune clé d'API ou jeton d'écriture n'est exposé côté client).

## Lancer le Frontend localement

Depuis la racine ou le dossier `app/`, vous pouvez démarrer un serveur HTTP local simple.

### Avec Python 3 :
```bash
cd app
python3 -m http.server 8080
```
Puis accédez à `http://localhost:8080`.

### Avec Node.js (via `http-server`) :
```bash
npx http-server app -p 8080
```

## Intégration sur un CMS (ex. WordPress)

Pour intégrer le diagnostic sur une page existante :
1. Copiez le contenu de la balise principale `<main id="an-diagnostic">...</main>` dans un bloc de code personnalisé.
2. Chargez la feuille `styles.css` et le script `app.js` sur la page.
3. Configurez l'adresse de votre webhook Cloudflare Worker en spécifiant l'attribut `data-webhook-url` sur la balise conteneur `<main>` :
   ```html
   <main id="an-diagnostic" data-webhook-url="https://votre-worker.workers.dev" ...>
   ```
