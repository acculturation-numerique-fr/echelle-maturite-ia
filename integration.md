# Guide de Déploiement et d'Intégration : Diagnostic IA

Ce document explique comment déployer l'application **Échelle de Maturité IA** et comment l'intégrer au site principal `https://acculturation-numerique.fr`.

---

## 1. Comprendre l'architecture et la contrainte WordPress.com

L'application repose sur une architecture minimaliste divisée en trois éléments clés :

- `app/` : L'interface visuelle (Frontend) qui tourne dans le navigateur de l'utilisateur.
- `data/` : Le dossier contenant `stats.csv` (Base de données très légère pour stocker les scores).
- `index.php` (ou `server.py`) : Le serveur backend qui fait le pont entre l'interface et la base de données.

Le script serveur initial (`server.py`) a été converti en **PHP** (`index.php`) pour être universellement compatible avec les hébergements web.

**Cependant, une contrainte technique importante existe :**
Le site principal (`acculturation-numerique.fr`) est hébergé sur **WordPress.com** (le service Cloud managé par Automattic). Contrairement à un hébergement classique, WordPress.com est un environnement verrouillé. Il n'autorise pas l'accès FTP complet ni l'exécution de scripts autonomes qui écrivent dans des fichiers locaux (le stockage des scores dans le fichier `stats.csv` risquerait d'être effacé à chaque mise à jour de leur Cloud).

Il y a donc deux options possibles de déploiement selon l'architecture souhaitée.

---

## 2. Déploiement : Les Deux Options

### Option 1 : Vercel + Base de Données Cloud (Gratuit)

Les hébergements gratuits comme Vercel étant éphémères (les fichiers locaux sont réinitialisés à chaque exécution), il est nécessaire de remplacer le fichier `stats.csv` par une base de données cloud.

**Marche à suivre :**

1. **Base de données Cloud (BDD)** : Créer une base de données externe (comme Supabase, Firebase ou MongoDB Atlas).
2. **Adapter le Backend** : Le script Python existant (`server.py`) devra être légèrement adapté pour fonctionner comme "Serverless Function" sur Vercel. Il faudra modifier sa logique de sauvegarde pour qu'il communique avec cette base de données externe au lieu d'écrire dans le fichier `stats.csv` local.
3. **Hébergement (Vercel)** : Pousser le code source sur un dépôt GitHub, puis lier ce dépôt à Vercel. Vercel hébergera l'interface (`app/`) et mettra à disposition les Serverless Functions pour l'API.
4. **Lien de domaine** : Vercel fournit une URL (ex: `diagnostic-ia.vercel.app`). Vous pouvez également y relier votre sous-domaine `diagnostic.acculturation-numerique.fr`.

### Option 2 : Hébergement dédié PHP (Payant)

Il est possible d'utiliser un hébergement "mutualisé" externe standard (type OVH, Hostinger, o2switch) dédié à cette application, et d'y lier un sous-domaine (ex: `https://diagnostic.acculturation-numerique.fr`).

**Marche à suivre :**

1. **Accéder au serveur** : Connectez-vous à l'espace client de l'hébergeur (interface web "Gestionnaire de Fichiers" ou via un logiciel FTP comme FileZilla).
2. **Trouver la racine** : Rendez-vous dans le dossier racine associé au sous-domaine (souvent `public_html` ou `www`).
3. **Transférer les fichiers** : Glissez-déposez le contenu du projet (`app/`, `data/`, `index.php`) à l'intérieur de ce dossier.
4. **Permissions (Important)** : Assurez-vous que le dossier `data/` a bien les permissions d'écriture (CHMOD `755` ou `775`) pour que le serveur puisse écrire dans `stats.csv`.

---

## 3. Intégration dans le site WordPress.com

Une fois l'application en ligne sur son propre espace (via l'Option 1 ou l'Option 2), il faut faire le lien depuis le site WordPress principal (par exemple depuis la page `/intelligence-artificielle/`). Deux options s'offrent à vous :

### Option 1 : L'approche "Plein Écran"

C'est l'approche la plus ergonomique et professionnelle. Une application complexe avec des graphiques et des radars a besoin d'espace.

* **Comment faire** : Éditez la page WordPress et ajoutez un bouton d'action (Call to Action) : **"Lancer le diagnostic IA"**.
* **Le lien** : Faites pointer ce bouton vers l'URL de votre application (ex: `https://diagnostic.acculturation-numerique.fr/`).
* **Astuce UX** : Cochez "Ouvrir dans un nouvel onglet" pour que l'utilisateur garde le site principal ouvert à côté.

### Option 2 : L'approche "Incrustée" (Iframe)

Si le besoin est de garder l'utilisateur strictement au sein de l'interface WordPress (avec le menu du site en haut et le footer en bas).

* **Comment faire** : Éditez la page WordPress, ajoutez un bloc **"HTML Personnalisé"**.
* **Le code** : Collez le code suivant pour incruster l'application au milieu de la page (remplacez l'URL par la vôtre) :

```html
<iframe 
  src="https://diagnostic.acculturation-numerique.fr/" 
  width="100%" 
  height="900px" 
  style="border: none; border-radius: 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);" 
  allowfullscreen>
</iframe>
```

* **Inconvénient** : Sur mobile, l'effet "un site dans un site" peut être moins confortable pour la lecture des graphiques. L'Option 1 est souvent privilégiée pour les tests d'évaluation.
