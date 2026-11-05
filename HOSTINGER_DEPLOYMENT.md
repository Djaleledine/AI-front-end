# 🚀 Guide de Déploiement Hostinger — ANJUCIA Dermaceutics

Ce projet Next.js 15 Full-Stack (App Router + Node.js API + MongoDB + DermoScan AI™) est prêt pour la production sur **Hostinger**. Pour la checklist complète de sécurité et des variables d'environnement, consultez également [`PRODUCTION_DEPLOYMENT.md`](file:///c:/Users/SAID/Desktop/platform/AI%20front-end/PRODUCTION_DEPLOYMENT.md).

---

## Option 1 : Déploiement Node.js via Git sur Hostinger (Recommandé ⭐)

Si vous utilisez **Hostinger Web Hosting (avec Node.js)**, **Cloud Hosting** ou **VPS Hostinger** :

1. Poussez les modifications sur votre dépôt GitHub :
   ```bash
   git add .
   git commit -m "chore: production security hardening, clean database seeds & deployment guide"
   git push origin main
   ```
2. Dans votre tableau de bord **Hostinger hPanel** :
   - Allez dans **Sites Web** > Cliquez sur votre domaine > **Avancé** > **Git**.
   - Connectez votre dépôt Git et sélectionnez la branche `main`.
3. Dans la section **Node.js** de votre hébergement :
   - Version de Node.js : **20.x** ou **22.x** (Node LTS).
   - Répertoire racine : `/`
   - Variables d'environnement : ajoutez `GEMINI_API_KEY`, `MONGODB_URI`, `ADMIN_PIN`, `ADMIN_SESSION_SECRET`, et `NEXT_PUBLIC_SITE_URL` (voir `.env.example`).
   - Commande de build : `npm run build`
   - Commande de démarrage : `npm start`
   - Port : `3000` (ou port assigné par Hostinger).

---

## Option 2 : Déploiement Standalone (VPS / PM2 Hostinger)

```bash
# 1. Cloner le projet
git clone https://github.com/Djaleledine/AI-front-end.git
cd AI-front-end

# 2. Configurer les variables d'environnement
cp .env.example .env.local
nano .env.local

# 3. Installer et compiler
npm ci
npm run build

# 4. Lancer avec PM2
npm install -g pm2
pm2 start npm --name "anjucia-store" -- start
pm2 save
pm2 startup
```

---

## 🔐 Accès Sécurisé au Panneau d'Administration (`/admin`)

- **URL :** `https://anjucia.com/admin`
- **Authentification Serveur :** Protégée par `ADMIN_PIN` (configurable dans `.env.local` ou directement dans l'onglet **CMS & Base MongoDB**), cookie `HttpOnly` signé HMAC-SHA256 et limitation anti-force brute.
- **Fonctionnalités incluses :**
  - Gestion intégrale des commandes COD 58 Wilayas (statuts, codes de suivi, export CSV).
  - Gestion du catalogue produits, prix en DA, stocks et actifs biochimiques (synchronisés en direct avec DermoScan AI™).
  - Gestion des packs promotionnels, avis clients, pharmacies partenaires et leads VIP.
  - Télémétrie DermoScan AI™ et configuration MongoDB Atlas en direct.
