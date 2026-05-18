# Plan de livraison technique — Échelle de maturité en intelligence artificielle

Version : 1.0  
Projet : Acculturation Numérique

---

## 1. Objectif

Documenter l'exécution technique de la V1, de l'intégration WordPress jusqu'à la validation E2E avec Cloudflare Worker et Airtable.

---

## 2. Bloc WordPress prêt à coller (sans fichiers externes locaux)

Objectif :

- livrer une version directement intégrable dans un bloc HTML Gutenberg.

Actions :

- extraire l'app en un snippet unique : `HTML + <style> + <script>` ;
- conserver Alpine.js via CDN (ou l'inliner si une version 100% autonome est requise) ;
- injecter un `data-webhook-url` configurable sur le conteneur racine ;
- vérifier la compatibilité Gutenberg et l'isolation CSS via `#an-diagnostic`.

Critères de validation :

- rendu visuel identique à la version locale ;
- aucun conflit CSS visible avec le thème ;
- interactions intactes (navigation, score, formulaire).

---

## 3. Durcissement WordPress

Objectif :

- réduire les risques de régression liés au thème et aux plugins.

Actions :

- éviter les collisions CSS/JS (préfixe `an-` partout) ;
- tester le responsive mobile + desktop ;
- tester le parcours complet : intro → questions → résultats → formulaire.

Checklist :

- navigation clavier OK ;
- focus visibles ;
- contraste lisible ;
- boutons utilisables sur mobile.

---

## 4. Wrangler prêt à déployer

Objectif :

- industrialiser le déploiement du Cloudflare Worker.

Actions :

- créer `worker/wrangler.toml` (`name`, `main`, `compatibility_date`) ;
- ajouter les variables attendues (`AIRTABLE_BASE_ID`, `AIRTABLE_TABLE`) ;
- gérer les secrets via `wrangler secret put` (`AIRTABLE_TOKEN`) ;
- préparer des commandes de déploiement simples (`wrangler deploy`).

---

## 5. Checklist Cloudflare (5 minutes)

```bash
wrangler login
wrangler secret put AIRTABLE_TOKEN
wrangler secret put AIRTABLE_BASE_ID
wrangler deploy
```

Puis :

- exécuter un `curl` de test en `POST` ;
- vérifier la création des enregistrements dans Airtable.

---

## 6. Validation finale E2E

Objectif :

- confirmer le fonctionnement complet front + webhook + base.

Checklist :

- brancher l'URL du Worker dans le bloc WordPress ;
- soumettre un lead test ;
- vérifier le mapping des champs Airtable ;
- tester les erreurs UX : e-mail invalide, consentement absent, webhook indisponible.

Critères de succès :

- création d'un record Airtable valide ;
- message de succès affiché côté front ;
- gestion d'erreur propre en cas d'échec webhook.
