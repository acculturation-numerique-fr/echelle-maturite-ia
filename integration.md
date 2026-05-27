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

Il y a donc deux options possibles de déploiement selon le budget et la complexité technique souhaitée.

---

## 2. Déploiement : Les Deux Options

### Option 1 : Hébergement dédié PHP (Payant mais simple)

Il faut utiliser un hébergement "mutualisé" externe très basique et peu coûteux (type OVH, Hostinger, o2switch) **dédié uniquement à cette application**. Vous pourrez ensuite lier cette application à votre nom de domaine via un sous-domaine (ex: `https://diagnostic.acculturation-numerique.fr`).

**Marche à suivre :**
1. **Accéder au serveur** : Connectez-vous à l'espace client de ce nouvel hébergeur (interface web "Gestionnaire de Fichiers" ou via un logiciel FTP comme FileZilla).
2. **Trouver la racine** : Rendez-vous dans le dossier racine associé au sous-domaine (souvent `public_html`, `www` ou un dossier au nom du sous-domaine).
3. **Transférer les fichiers** : Glissez-déposez le contenu du projet (`app/`, `data/`, `index.php`) à l'intérieur de ce dossier.
4. **Permissions (Important)** : Assurez-vous que le dossier `data/` a bien les permissions d'écriture (CHMOD `755` ou `775`) pour que le serveur puisse écrire dans `stats.csv`.

**L'application est en ligne.** Elle est désormais accessible de manière autonome via l'URL (exemple) : `https://diagnostic.acculturation-numerique.fr/`.

### Option 2 : Vercel + Base de Données Cloud (100% Gratuit mais complexe)

Si le budget est de 0€, il est impossible de conserver le système de stockage par fichier `stats.csv` car les hébergements gratuits comme Vercel sont éphémères (les fichiers locaux sont effacés à chaque exécution). 

**Marche à suivre (Nécessite de modifier le code de l'application) :**
1. **Base de données Cloud (BDD)** : Créer une base de données externe gratuite (comme Supabase, Firebase ou MongoDB Atlas).
2. **Réécrire le Backend** : Le backend (actuellement en PHP) devra être réécrit sous forme de "Serverless Functions" (en Node.js ou Python) compatibles avec Vercel, afin de communiquer avec cette nouvelle base de données externe au lieu du fichier CSV.
3. **Hébergement Frontend (Vercel)** : Pousser le code source sur un dépôt GitHub, puis lier ce dépôt à Vercel. Vercel hébergera l'interface (`app/`) gratuitement et mettra à disposition les Serverless Functions pour l'API.
4. **Lien de domaine** : Vercel fournit une URL gratuite (ex: `diagnostic-ia.vercel.app`). Vous pouvez également y relier gratuitement votre sous-domaine `diagnostic.acculturation-numerique.fr`.

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
