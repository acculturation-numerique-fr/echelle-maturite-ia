# Roadmap produit — Échelle de maturité en intelligence artificielle

Version : 1.0  
Projet : Acculturation Numérique

---

## 1. Principe

La roadmap doit éviter l'usine à gaz.

Priorité :

> sortir une V1 utile, belle, simple et maintenable avant d'ajouter des fonctionnalités avancées.

Note :

- le plan de livraison technique (WordPress + Cloudflare) est documenté dans `09_plan_livraison_technique.md`.

---

## 2. V1 — Diagnostic interactif simple

Objectif :

- remplacer le PDF par une web-app légère ;
- donner un résultat immédiat ;
- collecter des leads optionnels.

Fonctionnalités :

- page WordPress dédiée ;
- diagnostic en 20 critères ;
- score global ;
- niveau de maturité ;
- profil narratif ;
- scores par dimensions ;
- barres de progression par dimension ;
- recommandations par niveau ;
- formulaire optionnel ;
- envoi vers Airtable via webhook.

Critères de succès :

- temps de passage inférieur à 2 minutes ;
- aucune friction avant résultat ;
- affichage mobile propre ;
- aucune clé API exposée ;
- résultats corrects sur tous les seuils ;
- formulaire opérationnel.

À ne pas faire en V1 :

- login ;
- dashboard admin ;
- PDF généré côté serveur ;
- benchmark dynamique ;
- scoring pondéré ;
- segmentation avancée par secteur ;
- multi-langue.

---

## 3. Planning recommandé

### Jour 1 — Stabilisation

- valider la grille canonique ;
- valider niveaux et profils ;
- valider microtextes ;
- créer base Airtable.

### Jour 2 — Intégration front

- construire HTML ;
- ajouter CSS ;
- ajouter Alpine.js ;
- calculer scores ;
- afficher résultats.

### Jour 3 — Webhook et test

- déployer le Cloudflare Worker ;
- envoyer les données ;
- tester erreurs ;
- tester mobile.

### Jour 4 — Mise en ligne

- intégrer dans WordPress ;
- tester sur page privée ;
- corriger design ;
- publier.

---

## 4. Definition of Done V1

La V1 est terminée si :

- les 20 critères s'affichent ;
- le score est exact ;
- le niveau est exact ;
- les dimensions sont exactes ;
- la restitution est lisible ;
- le formulaire est optionnel ;
- le webhook fonctionne ;
- Airtable reçoit les données ;
- aucune clé API n'est visible ;
- le rendu mobile est propre ;
- le projet peut être présenté à un prospect.

---

## 5. V1.1 — Polissage

Objectif :

- améliorer la perception premium.

Fonctionnalités possibles :

- animations plus fluides ;
- radar SVG ;
- meilleur écran de résultat ;
- message e-mail automatique ;
- ajustement copywriting ;
- tracking léger des conversions ;
- intégration d'une section méthodologie.

---

## 6. V1.2 — Rapport e-mail

Objectif :

- augmenter la valeur perçue après soumission.

Fonctionnalités :

- e-mail automatique avec :
  - score ;
  - profil ;
  - recommandations ;
  - CTA vers accompagnement ;
- modèle d'e-mail Brevo ou équivalent ;
- personnalisation selon niveau.

---

## 7. V2 — Benchmark et analytics

Objectif :

- transformer les réponses collectées en insights.

Fonctionnalités :

- statistiques agrégées ;
- score moyen global ;
- dimensions les plus faibles ;
- comparaison par taille d'organisation ;
- comparaison par fonction ;
- messages du type :
  - “Votre score est supérieur à la moyenne des répondants.”
  - “La dimension la plus faible chez les répondants est le prompting.”

Attention :

- ne pas afficher de benchmark si l'échantillon est trop faible ;
- anonymiser les données ;
- expliquer clairement la méthode.

Seuil recommandé :

```txt
Ne pas afficher de benchmark public avant 100 réponses exploitables.
```

---

## 8. V2.5 — Export PDF

Objectif :

- fournir un livrable plus formel.

Options :

### Option simple

PDF généré côté navigateur avec impression CSS.

Avantage :

- pas de backend.

### Option avancée

PDF généré côté serveur ou via outil tiers.

Avantage :

- rendu plus stable.

Recommandation :

- commencer par une page imprimable ;
- repousser le vrai PDF si non nécessaire.

---

## 9. V3 — Diagnostic organisationnel

Objectif :

- passer d'un diagnostic individuel à un outil d'équipe.

Fonctionnalités :

- campagne par entreprise ;
- lien partagé à une équipe ;
- résultats agrégés par organisation ;
- restitution équipe ;
- recommandations de formation ;
- export pour RH ou direction.

Cas d'usage :

- audit de maturité IA interne ;
- préparation d'un plan de formation ;
- segmentation des collaborateurs par niveau ;
- mesure avant / après formation.

---

## 10. Backlog d'idées

Idées intéressantes mais non prioritaires :

- version anglaise ;
- version secteur public ;
- version formateurs ;
- version managers ;
- scoring pondéré ;
- recommandations par métier ;
- bibliothèque de ressources par niveau ;
- mini-certificat de complétion ;
- intégration CRM avancée ;
- intégration calendrier pour réserver un appel ;
- génération d'un plan de formation personnalisé.
