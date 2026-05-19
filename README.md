# Échelle de maturité en intelligence artificielle

Diagnostic interactif permettant d'évaluer en quelques minutes la maturité pratique et théorique des collaborateurs face à l'intelligence artificielle.

## Caractéristiques techniques et produit

- **Interface minimaliste** : Mise en page de type liste épurée, dépourvue de contours ou de bordures lourdes, maximisant la clarté et le confort de lecture.
- **Mouvement fluide** : Transitions d'écrans cinématiques utilisant une courbe de décélération naturelle (`cubic-bezier(0.16, 1, 0.3, 1)`) sur 800ms, évitant tout chevauchement ou saut de mise en page.
- **Micro-interactions** : Points radios circulaires discrets (`14px`) avec effet d'animation de type puce au clic.
- **Optimisation des performances** : Chargement instantané grâce à des assets visuels au format `WebP` compressés et à une architecture sans dépendances CDN lourdes.
- **Sécurité et conformité** : Backend d'ingestion hébergé sur Cloudflare Worker assurant la transmission des leads vers Airtable (aucune clé d'API exposée côté client).

## Structure du projet

```txt
.
├── app/
│   ├── assets/       # Assets visuels locaux optimisés (WebP)
│   ├── app.js        # Modèle de données, règles métier et logique Alpine.js
│   ├── index.html    # Structure HTML et tableau de bord Bento de résultats
│   └── styles.css    # Système de design unifié, variables :root et transitions
└── worker/
    ├── index.js      # Backend Cloudflare Worker
    └── README.md     # Guide de déploiement et tests du Worker
```

## Lancement local

Pour lancer l'application en local :

```bash
python3 -m http.server 8080 --directory app
```

L'application est ensuite accessible à l'adresse : `http://localhost:8080`

## Intégration CMS (WordPress / Webflow)

L'application est conçue pour être intégrée facilement :

1. **HTML** : Copier le contenu de la balise `<main id="an-diagnostic">...</main>` depuis `app/index.html` dans un bloc HTML personnalisé.
2. **CSS / JS** : Charger le fichier `styles.css` ainsi que `app.js` sur la page cible.
3. **Webhook** : Configurer l'adresse de votre API Cloudflare Worker via l'attribut `data-webhook-url="https://votre-worker.workers.dev"` sur le conteneur principal.
