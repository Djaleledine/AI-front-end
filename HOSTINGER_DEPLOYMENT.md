# 🚀 Guide de Déploiement Hostinger — ANJUCIA Dermaceutics

Ce projet Next.js 15 (App Router) est optimisé pour être déployé sur **Hostinger** selon votre formule d'hébergement.

---

## Option 1 : Déploiement Automatique via Git sur Hostinger (Recommandé ⭐)

Si vous utilisez **Hostinger Web Hosting (avec Node.js)**, **Cloud Hosting** ou **VPS Hostinger** :

1. Poussez les modifications sur votre dépôt GitHub :
   ```bash
   git add .
   git commit -m "feat: complete dermaceutical skincare design, admin dashboard & light mode"
   git push origin main
   ```
2. Dans votre tableau de bord **Hostinger hPanel** :
   - Allez dans **Sites Web** > Cliquez sur votre domaine > **Avancé** > **Git**.
   - Connectez votre dépôt : `https://github.com/Djaleledine/AI-front-end.git`.
   - Branche : `main`.
   - Cochez **Déploiement automatique lors du push**.
3. Dans la section **Node.js** de votre hébergement :
   - Version de Node.js : **20.x** ou **22.x** (Node LTS).
   - Répertoire racine : `/`
   - Commande de build : `npm run build`
   - Commande de démarrage : `npm start`
   - Port : `3000` (ou port assigné par Hostinger).

---

## Option 2 : Déploiement Standalone (VPS / Docker Hostinger)

Le projet génère automatiquement une version ultra-légère autonome dans `.next/standalone` :

1. Sur votre serveur Hostinger :
   ```bash
   # 1. Cloner ou transférer le projet
   git clone https://github.com/Djaleledine/AI-front-end.git
   cd AI-front-end

   # 2. Installer et compiler
   npm install
   npm run build

   # 3. Lancer avec PM2
   npm install -g pm2
   pm2 start server.js --name "anjucia-store" --cwd .next/standalone
   pm2 save
   pm2 startup
   ```

---

## Option 3 : Export Statique pour Hébergement Partagé Hostinger (public_html)

Si vous disposez d'un hébergement mutualisé standard sans serveur Node.js permanent :

1. Générez l'export statique complet :
   ```bash
   set NEXT_EXPORT=true && npm run build
   ```
2. Un dossier `out/` contenant les fichiers HTML, CSS, JS et images sera créé.
3. Dans **Hostinger hPanel** > **Gestionnaire de Fichiers** :
   - Ouvrez le dossier `public_html`.
   - Téléversez l'ensemble du contenu du dossier `out/`.
   - Vos pages s'afficheront instantanément avec SSL automatique.

---

## 🔐 Accès au Panneau d'Administration (/admin)

- **URL :** `https://votre-domaine.com/admin` (ou `http://localhost:3000/admin`)
- **Code PIN Administrateur :** `anjucia2026`
- **Bouton Démo :** Un clic sur « Connexion Rapide Démo » permet d'accéder instantanément au tableau de bord.
- **Fonctionnalités incluses :**
  - Gestion des commandes 58 Wilayas (Changement de statut en direct, filtrage, export CSV).
  - Gestion en direct du prix du Gel-Crème (1 800 DA par défaut, modifiable).
  - Gestion des stocks (En stock / Rupture).
  - Suivi des inscrits aux listes d'attente (Coming Soon / Club VIP).
  - Grille logistique 58 Wilayas (Yalidine, ZR Express, Mayestro).
