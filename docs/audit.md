# Audit technique et produit — Diagnostic de maturité IA

Date de l'audit: 19 mai 2026  
Périmètre: `README.md`, `app/`, `worker/`, `docs/`, `docs/inspirations/`

## 1) Note globale

**7.6 / 10**

Le projet est solide sur la vision, le contenu métier et la couverture fonctionnelle V1.  
La principale marge de progression est le durcissement "production" (sécurité webhook, gouvernance de dépendances, industrialisation du déploiement).

## 2) Résumé exécutif

- Socle fonctionnel complet (questionnaire 20 critères, scoring, niveaux, restitution, formulaire, envoi webhook).
- Documentation très fournie et cohérente avec l'intention produit.
- Risque principal: webhook facilement exploitable si URL exposée publiquement.
- Quelques écarts entre les standards documentés et l'implémentation (RGPD, packaging déploiement).

## 3) Méthode et vérifications réalisées

### Revue statique

- Lecture complète du front: `app/index.html`, `app/app.js`, `app/styles.css`.
- Lecture complète du worker: `worker/index.js`.
- Lecture complète de la documentation: `docs/01` à `docs/09`.

### Vérifications d'exécution

- Vérification syntaxe JS:
  - `node --check app/app.js`
  - `node --input-type=module --check < worker/index.js`
- Vérification logique de scoring/niveaux sur seuils clés:
  - scores testés: `0, 2, 3, 5, 6, 10, 11, 15, 16, 20`
  - mapping niveaux conforme.
- Vérification worker:
  - cas valide -> `200 {"ok":true}`
  - cas invalide (`score_total=21`) -> `400` avec message de validation.
- Vérification service local front:
  - `python3 -m http.server 8080 --directory app`
  - endpoint `/` renvoie `HTTP 200`.
- Recherche de tests automatisés:
  - aucun fichier de test détecté.

## 4) Points forts

1. **Cohérence produit**
   - Grille canonique, niveaux et restitution bien alignés entre docs et code.

2. **Qualité documentaire**
   - Documentation complète (spécification, UX, architecture, modèle de données, roadmap, plan de livraison).

3. **Séparation front/back correcte**
   - Clé Airtable absente du front.
   - Passage par Cloudflare Worker côté serveur.

4. **UX V1 claire et lisible**
   - Parcours simple: intro -> questions -> résultat -> formulaire optionnel.
   - Responsive et états UX bien structurés.

## 5) Constats priorisés

## [Élevé] F1 — Webhook trop exposé à l'abus

**Constat**  
Le worker accepte les requêtes cross-origin (origine reflétée) sans mécanisme d'authentification applicative.

**Impact**  
Spam, pollution Airtable, surcoûts et baisse de fiabilité des leads.

**Preuves**  
- `worker/index.js:39-42` (`getCorsOrigin` reflète `Origin`)  
- `worker/index.js:117-127` (route publique `POST`)  
- `worker/index.js:151-160` (écrit en base si payload valide)  
- `app/app.js:733-739` (appel direct depuis navigateur)

**Recommandations**  
- Ajouter un secret partagé (`X-Webhook-Token`) validé côté worker.
- Restreindre les origines autorisées par allowlist.
- Ajouter un contrôle anti-abus (honeypot, rate limiting applicatif, minimum de champs/tempo).

## [Moyen] F2 — Écart RGPD doc vs implémentation

**Constat**  
La doc exige un lien vers la politique de confidentialité, mais le formulaire n'affiche qu'un texte de consentement.

**Impact**  
Incohérence de conformité et friction potentielle en audit légal.

**Preuves**  
- Exigence: `docs/04_architecture_technique.md:268-273`  
- Implémentation: `app/index.html:272-279`

**Recommandations**  
- Ajouter un lien cliquable vers la politique de confidentialité dans le bloc de consentement.

## [Moyen] F3 — Industrialisation déploiement incomplète

**Constat**  
Le plan prévoit `worker/wrangler.toml`, absent du repo.

**Impact**  
Déploiement moins reproductible, risque d'erreurs manuelles.

**Preuves**  
- Plan: `docs/09_plan_livraison_technique.md:64-67`  
- Arborescence `worker/`: fichier non présent.

**Recommandations**  
- Ajouter `worker/wrangler.toml` versionné avec `name`, `main`, `compatibility_date`.

## [Moyen] F4 — Dépendances front non figées

**Constat**  
Chargement de versions non pinées.

**Impact**  
Risque de régression visuelle/fonctionnelle au fil du temps.

**Preuves**  
- Alpine CDN: `app/index.html:322` (`3.x.x`)  
- Icônes: `app/app.js:310` (`@latest`)

**Recommandations**  
- Pinner une version Alpine explicite.
- Pinner une version du package d'icônes (pas `@latest`).

## [Moyen] F5 — Couverture de tests automatisés absente

**Constat**  
Aucun test unitaire/intégration détecté.

**Impact**  
Régressions possibles sur scoring, mapping des niveaux et validation webhook.

**Preuves**  
- Aucun fichier de test identifié sur le périmètre repo.

**Recommandations**  
- Ajouter un socle minimal:
  - tests de seuils de niveau;
  - tests de `dimension_scores`;
  - tests de validation worker (`400/405/502`).

## [Faible] F6 — Dossier d'inspirations non relié au runtime

**Constat**  
Les snippets ont été déplacés en `docs/inspirations/` (correctif appliqué), mais restent volontairement non reliés au runtime applicatif.

**Impact**  
Risque faible de confusion si leur statut n'est pas documenté explicitement.

**Preuves**  
- `docs/inspirations/Dashboard.txt` (~1763 lignes)  
- `docs/inspirations/README.md` (statut non-runtime explicité)

**Recommandations**  
- Conserver la séparation stricte runtime/inspiration.
- Garder à jour le fichier d'inventaire `docs/inspirations/README.md`.

## 6) Évaluation détaillée

- Produit / valeur métier: **8.5/10**
- UX V1: **8/10**
- Qualité de code front: **7.5/10**
- Back/worker et sécurité: **6.5/10**
- Documentation: **9/10**
- Exploitabilité long terme: **6.5/10**

## 7) Plan de remédiation recommandé

### Priorité immédiate (J+1)

1. Ajouter secret de webhook + vérification d'origine.
2. Ajouter lien politique de confidentialité dans le consentement.
3. Versionner `worker/wrangler.toml`.

### Priorité court terme (Semaine 1)

1. Pinner Alpine et package d'icônes.
2. Ajouter tests automatisés minimum (score, niveaux, worker validation).

### Priorité moyen terme (Semaine 2+)

1. [Fait le 19 mai 2026] Déplacer et organiser les snippets dans `docs/inspirations/`.
2. Ajouter checklist de release (sécurité, RGPD, tests, rollback).

## 8) Score cible après correctifs

Avec les correctifs prioritaires appliqués: **8.5 à 8.8 / 10**.

---

## 9) Audit ciblé frontend (cohérence visuelle) — 19 mai 2026

### Note frontend cohérence

**4.5 / 10**

Le produit fonctionne, mais la cohérence UI est faible: la landing suit un langage visuel différent du questionnaire/résultats, ce qui donne un ressenti "bordélique" en production.

### Constats priorisés

## [Élevé] UI1 — Deux directions visuelles en parallèle (hero vs reste de l'app)

**Constat**  
Le hero d'intro utilise une direction "floating / gradient / glass", alors que les étapes questions/résultats utilisent une base "cartes sobres" historique.

**Impact**  
Rupture de perception (on dirait deux produits différents) et difficulté à maintenir l'identité.

**Preuves**  
- Hero intro: `app/index.html` (`section` dédiée) et styles spécifiques (`an-hero-*`).  
- `app/index.html:20-78`  
- `app/styles.css:188-341`  
- Questions/résultats/lead: `app/index.html:80-367` + styles majoritairement "système initial" (`app/styles.css:343-890`).

## [Élevé] UI2 — Tokenisation incomplète (couleurs hardcodées encore nombreuses)

**Constat**  
Le design system existe (`:root`), mais beaucoup de valeurs couleurs/ombres restent en dur hors tokens.

**Impact**  
Changement de thème très coûteux, dette visuelle, incohérences progressives.

**Preuves**  
- Tokens: `app/styles.css:1-22`  
- Hardcodes notables: `app/styles.css:199-201`, `app/styles.css:212`, `app/styles.css:216-219`, `app/styles.css:241`, `app/styles.css:365`, `app/styles.css:400-401`, `app/styles.css:410-411`, `app/styles.css:427`, `app/styles.css:807`, `app/styles.css:855-857`.

## [Moyen] UI3 — Système typo hétérogène

**Constat**  
Trois familles sont chargées et utilisées de façon transversale (Inter, Montserrat, Roboto Mono), sans règles de rôle explicites documentées.

**Impact**  
Hierarchie perçue instable, effet "template mashup".

**Preuves**  
- Imports fontes: `app/index.html:10-14`  
- Mix body/titres/labels: `app/styles.css:37`, `app/styles.css:83`, `app/styles.css:93`, `app/styles.css:133`.

## [Moyen] UI4 — Dépendance CDN non figée (risque de drift visuel)

**Constat**  
Alpine est chargé en `3.x.x`.

**Impact**  
Risque de changement de comportement sans contrôle.

**Preuves**  
- `app/index.html:370`.

## [Faible] UI5 — Animation hero dédiée mais non mutualisée

**Constat**  
Le comportement "repulsion" est codé ad hoc dans `app.js`, centré sur `.an-hero-fx`.

**Impact**  
Complexité locale; difficile à réutiliser proprement pour d'autres blocs.

**Preuves**  
- `app/app.js:419-496`.

### Verdict "standard vs vibecodé" sur les fichiers `docs/inspirations/`

1. `docs/inspirations/Exemple.txt`: **standard (snippet composant)**, mais hors stack actuelle (React + Framer + alias `@/...`)  
2. `docs/inspirations/Other_Exemple.txt`: **doublon exact** de `Exemple.txt`  
3. `docs/inspirations/Bento.txt`: **vibecodé/template** (copie Tailwind marketing avec placeholders)  
4. `docs/inspirations/Landing.txt`: **vibecodé/template** (bloc générique Tailwind, contenu placeholder)  
5. `docs/inspirations/Dashboard.txt`: **vibecodé lourd** (gros dump de template + scripts/vendor minifiés inline)  
6. `docs/inspirations/Liens.txt`: **références utiles** (pas du code runtime)

### Plan frontend recommandé (cohérence d'abord)

#### Phase 1 — Figer le design system (0.5 à 1 jour)

1. Définir un seul axe visuel (palette, radius, shadow, typo) dans `:root`.
2. Introduire des tokens manquants (`--an-hero-*`, `--an-gradient-*`, `--an-focus-*`) et supprimer les hardcodes hors cas exceptionnels.
3. Pinner Alpine (`3.x.y`) et documenter les dépendances UI.

#### Phase 2 — Uniformiser les composants (1 à 2 jours)

1. Harmoniser boutons/chips/cartes/inputs autour d'une seule grammaire (mêmes arrondis, contrastes, états hover/focus).
2. Refaire le hero pour qu'il respecte exactement les mêmes tokens que questions/résultats.
3. Garder l'animation, mais isoler sa config (rayon/force/timing) via variables.

#### Phase 3 — Nettoyage et garde-fous (0.5 à 1 jour)

1. [Fait le 19 mai 2026] Mettre les snippets en `docs/inspirations/` avec statut clair (source d'inspiration, non-runtime).
2. [Fait le 19 mai 2026] Ajouter une checklist "UI consistency" en PR via `docs/frontend-style-guide.md`.
3. [Fait le 19 mai 2026] Versionner un guide court et opérationnel de référence UI (`docs/frontend-style-guide.md`).
4. Capturer 3 screenshots de référence (intro/questions/résultats) pour éviter les dérives futures.

### Score attendu après plan

Si les 3 phases sont appliquées: **8 / 10 à 8.5 / 10** sur la cohérence frontend.
