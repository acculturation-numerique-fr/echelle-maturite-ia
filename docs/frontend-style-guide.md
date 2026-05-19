# Guide Frontend - Cohérence UI

Date: 19 mai 2026

## Objectif

Ce guide verrouille une direction visuelle unique pour l'application.
Toute nouvelle UI doit respecter ce document avant merge.

## 1) Design System (source unique)

Fichier de référence:
- `app/styles.css` (section `:root`)

### 1.1 Tokens obligatoires

Utiliser exclusivement les tokens pour:
- couleurs (`--an-*`)
- typographie (`--an-font-*`)
- rayons (`--an-radius-*`)
- ombres (`--an-shadow-*`)
- états de focus / feedback / overlays

Interdit:
- nouvelles couleurs hex en dehors de `:root`
- nouvelles valeurs `rgba(...)` en dehors de `:root` (sauf cas exceptionnel documenté)

### 1.2 Typographie

Rôles:
- `--an-font-body`: texte courant, boutons, formulaires
- `--an-font-display`: titres structurants
- `--an-font-mono`: badges, métriques, labels techniques

## 2) Règles Composants

### 2.1 Cartes et panneaux

Classes canon:
- `.an-panel`
- `.an-card`

Règles:
- border via `--an-border`
- fond via `--an-surface-raised`
- ombre via `--an-shadow-soft`

### 2.2 Boutons

Classes canon:
- `.an-btn-primary`
- `.an-btn-secondary`
- `.an-btn-ghost`

Règles:
- tailles minimales cohérentes
- focus visible obligatoire
- états `hover` et `disabled` définis

### 2.3 Formulaires

Classes canon:
- `.an-input`, `.an-select`
- `.an-check`, `.an-check-compact`
- `.an-feedback-*`

Règles:
- pas de style inline
- pas de variantes locales dupliquées
- tous les états utilisent les tokens

### 2.4 Hero et animations

Le hero doit rester dans la même palette que le reste de l'app.
L'animation flottante est autorisée si:
- lisibilité du titre intacte
- contrastes suffisants
- comportement mobile dégradé proprement

## 3) Responsive

Breakpoints de référence:
- `1060px`
- `820px`
- `640px`

Règles:
- boutons en pile sur mobile
- ordre de lecture conservé (pas d'inversion arbitraire)
- densité visuelle réduite sans casser la hiérarchie

## 4) Checklist PR UI

Avant merge, vérifier:
1. Aucun nouveau hex / rgba hors `:root`.
2. Aucun composant "one-off" non réutilisable ajouté sans justification.
3. Focus clavier visible sur champs/boutons/checks.
4. Desktop + mobile validés visuellement (intro, questions, résultats, lead).
5. Aucune régression de texte (coupures, overflow, alignements).

## 5) Workflow recommandé

1. Ajouter/ajuster un token dans `:root`.
2. Réutiliser une classe existante avant d'en créer une nouvelle.
3. Tester localement les 4 écrans clés.
4. Capturer des screenshots desktop/mobile en contrôle final.
