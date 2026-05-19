# Échelle de maturité en intelligence artificielle

Diagnostic interactif permettant d'évaluer en quelques minutes la maturité pratique et théorique des collaborateurs face à l'intelligence artificielle. Une expérience fluide, ultra-rapide et entièrement personnalisée.

---

## 🌟 Points Forts & Architecture

* **Interface "Zen" Minimaliste** : Une mise en page aérée de type liste, dépourvue de fioritures ou de bordures lourdes, maximisant la clarté et le confort de lecture.
* **Cinematic Motion (0.8s)** : Transitions d'écrans fluides et cinématiques utilisant une courbe de décélération naturelle (`cubic-bezier(0.16, 1, 0.3, 1)`), garantissant une transition sans sauts de page ni coupures visuelles.
* **Micro-interactions Premium** : Des points radios circulaires discrets (`14px`) s'animant sur un modèle d'interaction haut de gamme (effet puce Apple).
* **Performance Optimale** : Fichiers statiques légers, logos locaux au format `WebP` compressés, et aucune dépendance CDN superflue.
* **Sécurité & Confidentialité** : Backend d'ingestion hébergé sur Cloudflare Worker assurant la transmission sécurisée des leads vers Airtable (aucune clé d'API n'est exposée côté client).

---

## 📁 Structure du Projet

```txt
.
├── app/
│   ├── assets/       # Assets visuels locaux optimisés (WebP)
│   ├── app.js        # Modèle de données, règles métier et logique Alpine.js
│   ├── index.html    # Structure HTML & Dashboard Bento de résultats
│   └── styles.css    # Système de design unifié, variables :root et transitions
└── worker/
    ├── index.js      # Backend Cloudflare Worker
    └── README.md     # Guide de déploiement et tests du Worker
```

---

## ⚡ Lancement Local

Pour lancer l'application instantanément sur votre machine :

```bash
python3 -m http.server 8080 --directory app
```

Ouvrez ensuite votre navigateur sur : [http://localhost:8080](http://localhost:8080)

---

## 🔧 Intégration CMS (WordPress / Webflow)

L'application a été conçue pour être facilement intégrée sur n'importe quelle plateforme :

1. **HTML** : Copiez le contenu de la balise `<main id="an-diagnostic">...</main>` depuis `app/index.html` dans un bloc HTML personnalisé de votre CMS.
2. **CSS / JS** : Chargez le fichier `styles.css` (contenant le design system complet) ainsi que `app.js` sur votre page.
3. **Webhook** : Configurez l'adresse de votre API Cloudflare Worker en éditant l'attribut `data-webhook-url="https://votre-worker.workers.dev"` sur le conteneur `<main>`.
