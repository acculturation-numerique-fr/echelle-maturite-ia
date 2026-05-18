# Expérience utilisateur — Diagnostic de Maturité IA

Version : 1.0  
Projet : Acculturation Numérique

---

## 1. Objectif UX

Créer une expérience courte, fluide et valorisante qui donne envie de terminer le diagnostic et de consulter la restitution.

Contraintes :

- durée cible : moins de 2 minutes ;
- aucun compte requis ;
- aucune saisie obligatoire avant le résultat ;
- expérience parfaitement lisible sur mobile ;
- restitution immédiate après validation.

---

## 2. Parcours utilisateur

### Étape 1 — Introduction

Objectif : expliquer l'intérêt du diagnostic en quelques secondes.

Contenus à afficher :

- titre ;
- promesse ;
- durée estimée ;
- nombre de critères ;
- bouton de démarrage.

Exemple :

> Évaluez votre maturité IA en 2 minutes  
> Cochez les usages que vous maîtrisez déjà et découvrez votre profil, vos forces et vos prochains axes de progression.

Bouton :

> Commencer le diagnostic

---

### Étape 2 — Questionnaire

Le questionnaire contient 20 critères répartis en 5 catégories.

Affichage recommandé :

- une catégorie à la fois ;
- cases à cocher larges ;
- progression visible ;
- possibilité de revenir en arrière ;
- bouton “Suivant”.

Structure :

```txt
Connaissances
[ ] Je sais ce qu'est l'IA et comment elle fonctionne.
[ ] Je sais à quoi peut servir l'IA dans mon quotidien.
...
```

Barre de progression :

```txt
Étape 1/5 — Connaissances
```

---

### Étape 3 — Résultat immédiat

Après validation, afficher :

- score total ;
- niveau ;
- profil ;
- phrase de restitution ;
- visualisation par dimensions ;
- forces ;
- axes de progression.

Bloc principal :

```txt
Votre niveau : Intermédiaire
Profil : Opérateur augmenté
Score : 8 / 20
```

---

### Étape 4 — Recommandations

Afficher selon le profil :

- concepts à approfondir ;
- vigilance principale ;
- outils recommandés ;
- prochaine étape concrète.

Le vocabulaire doit rester opérationnel.

---

### Étape 5 — Capture optionnelle

Après avoir affiché le résultat gratuit, proposer :

> Recevoir mon diagnostic complet par e-mail

Champs :

- prénom ;
- nom ;
- e-mail ;
- entreprise ;
- fonction ;
- taille d'entreprise ;
- consentement RGPD.

Le formulaire doit être optionnel.  
L'utilisateur doit pouvoir consulter son résultat sans donner ses coordonnées.

---

## 3. Composants d'interface

### Hero

- titre clair ;
- sous-titre ;
- durée estimée ;
- CTA.

### Carte de catégorie

- titre de catégorie ;
- court descriptif ;
- liste de cases ;
- compteur local.

### Boutons

- précédent ;
- suivant ;
- voir mes résultats ;
- recevoir mon diagnostic complet ;
- recommencer.

### Résultat

- score circulaire ou grande carte ;
- niveau ;
- profil ;
- description ;
- graphique.

### Recommandations

- carte “à apprendre” ;
- carte “à surveiller” ;
- carte “outils recommandés” ;
- carte “prochaine étape”.

---

## 4. Visualisation recommandée

Pour la V1, deux options sont acceptables.

### Option A — Barres horizontales

Plus simple, plus robuste, parfaitement compatible WordPress.

Dimensions :

- Culture & cadre IA ;
- Prise en main des outils ;
- Usages opérationnels ;
- Prompting & capitalisation ;
- Personnalisation & autonomie ;
- Technique & automatisation.

Affichage :

```txt
Culture & cadre IA          ███████░░ 3/5
Prise en main des outils    ████████░ 4/4
Usages opérationnels        █████░░░░ 2/3
...
```

### Option B — Radar SVG ou Chart.js

Plus premium visuellement mais ajoute une dépendance.

Recommandation :

- V1 : barres CSS ;
- V1.5 : radar SVG maison ;
- V2 : radar Chart.js si besoin.

---

## 5. Comportements UX importants

### Sauvegarde locale

Pendant le diagnostic, les réponses peuvent être conservées dans l'état Alpine.js.  
Pas besoin de stockage local pour la V1.

### Recommencer

Un bouton “Recommencer” doit réinitialiser :

- les cases cochées ;
- le score ;
- le profil ;
- l'étape active ;
- le formulaire final.

### Accessibilité

Les cases doivent être utilisables au clavier.

Règles :

- labels cliquables ;
- contraste suffisant ;
- focus visible ;
- boutons explicites ;
- pas d'information uniquement portée par la couleur.

---

## 6. Micro-animations

Animations recommandées :

- transition douce entre catégories ;
- apparition progressive du résultat ;
- animation de remplissage des barres ;
- légère mise en valeur du score final.

À éviter :

- animations lourdes ;
- effets flashy ;
- ralentissement sur mobile ;
- librairies inutiles.

---

## 7. Responsive mobile

La majorité des utilisateurs peuvent arriver depuis LinkedIn ou mobile.

Priorités mobile :

- cartes en une colonne ;
- boutons pleine largeur ;
- texte lisible ;
- pas de tableau complexe dans l'interface ;
- graphique simple.

---

## 8. États à prévoir

### État initial

Aucune réponse. CTA de démarrage visible.

### État questionnaire

Une catégorie active. Score non affiché ou discret.

### État résultat

Score et recommandations visibles.

### État formulaire

Résultat conservé + formulaire optionnel.

### État soumission réussie

Message :

> Merci, votre demande a bien été prise en compte. Vous recevrez votre diagnostic complet prochainement.

### État erreur webhook

Message :

> Votre résultat reste disponible à l'écran. L'envoi du formulaire a rencontré un problème temporaire. Vous pouvez réessayer dans quelques instants.

---

## 9. Priorités de design

L'interface doit évoquer :

- sérieux ;
- clarté ;
- modernité ;
- accompagnement ;
- acculturation.

Elle ne doit pas évoquer :

- quiz bas de gamme ;
- formulaire administratif ;
- outil scolaire ;
- dashboard complexe.

---

## 10. Structure de page recommandée

```txt
<section id="hero">
<section id="diagnostic-app">
  <div data-state="intro">
  <div data-state="questions">
  <div data-state="results">
  <div data-state="lead-form">
</section>
<section id="about-method">
<section id="cta-accompagnement">
```
