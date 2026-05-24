# Recommandations Produit — Points Restants

Date: 24/05/2026

Les ajustements de wording déjà validés dans le dashboard ont été couverts.
Ce document ne conserve que les points encore à traiter.

## 1) Issue #2 — Évaluation partielle (priorité haute)

Objectif: passer d’une logique binaire à une évaluation nuancée `0 / 0.5 / 1`.

### Cible fonctionnelle

1. Conserver des cases à cocher.
2. Proposer deux états explicites par question:
   - `Partiellement acquis`
   - `Totalement acquis`
3. Appliquer la règle de score:
   - `Non acquis = 0`
   - `Partiellement acquis = 0.5`
   - `Totalement acquis = 1`

### Impacts techniques

1. `answers` doit stocker une valeur numérique (`0 | 0.5 | 1`).
2. Tous les calculs (`score global`, `scores par critère`, graphiques) passent en décimal.
3. Le PDF doit afficher les mêmes scores que le dashboard.

### Critères d’acceptation

1. Une question ne peut pas être “partielle” et “totale” en même temps.
2. Le score sur 20 intègre correctement les demi-points.
3. Le niveau affiché est cohérent avec le score décimal.

## 2) Outils recommandés — Ajouts à valider

### Liste proposée

1. `Airtable`
2. `Meilisearch`
3. `Elasticsearch`
4. `LlamaIndex` (à conserver)
5. `AirLLM`
6. `MLflow`
7. `OpenFang` (nom/positionnement à confirmer)

### Règle de sélection

1. Limiter le nombre d’outils visibles par niveau (8 à 12 maximum).
2. Réserver les outils très techniques aux niveaux `Avancé` et `Expert`.
3. Prioriser les outils utiles à des cas d’usage concrets pour étudiants.

## 3) Plan d’exécution (prochain patch)

1. Implémenter les états `0 / 0.5 / 1` dans le formulaire.
2. Adapter calculs, affichages et export PDF aux demi-points.
3. Intégrer la nouvelle liste d’outils recommandés par niveau.
