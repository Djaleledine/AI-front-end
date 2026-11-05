# 🚀 ANJUCIA.COM — Production Deployment & Security Checklist

This guide covers everything you need to deploy **Anjucia Dermaceutical** (Next.js 15 Full-Stack + Node.js API + MongoDB + DermoScan AI™ Station) safely to production.

---

## 1. Environment Variables Setup (`.env.local` / Hosting Panel)

Before deploying, configure the following environment variables in your hosting provider's dashboard (Hostinger Node.js App, VPS `.env.local`, Vercel, or Railway). Reference [`.env.example`](file:///c:/Users/SAID/Desktop/platform/AI%20front-end/.env.example) for the complete template:

| Variable | Required | Description |
| :--- | :---: | :--- |
| `GEMINI_API_KEY` | **YES** | Your Google Gemini API key (`@google/genai`) powering `/api/dermoscan`. |
| `MONGODB_URI` | **YES** | Your MongoDB Atlas or self-hosted MongoDB connection string (`mongodb+srv://...`). If unreachable, the backend automatically persists to `data/anjucia-db.json` on the server so your store never goes down. |
| `ADMIN_PIN` | **YES** | Strong secret PIN to unlock `/admin` (replace the default `anjucia2026` before going live). |
| `ADMIN_SESSION_SECRET` | **YES** | A 64-character random hex string used to sign `HttpOnly` HMAC-SHA256 admin session cookies. Generate one via: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`. |
| `NEXT_PUBLIC_SITE_URL` | Recommended | Your production HTTPS URL (e.g., `https://anjucia.com`). |
| `NEXT_PUBLIC_SUPPORT_WHATSAPP` | Optional | WhatsApp support number in international format without `+` (e.g., `213550123456`). |
| `YALIDINE_API_ID` / `YALIDINE_API_TOKEN` | Optional | Placeholders for automated Yalidine Express waybill dispatch. |
| `ZR_EXPRESS_API_KEY` / `ZR_EXPRESS_API_TOKEN` | Optional | Placeholders for automated ZR Express waybill dispatch. |
| `MAYSTRO_API_TOKEN` | Optional | Placeholder for Maystro Delivery integration. |
| `SMTP_HOST` / `SMTP_PORT` / `SMTP_USER` / `SMTP_PASS` | Optional | Placeholders for transactional email notifications. |

---

## 2. MongoDB Atlas Setup (5 Minutes)

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) and create a cluster (the free `M0` tier or a dedicated cluster works out of the box).
2. **Database Access**: Create a database user with **Read and write to any database** permissions and copy the username & password.
3. **Network Access**: Add your server's IP address (or `0.0.0.0/0` if deploying on dynamic cloud instances).
4. **Connection String**: Click **Connect** → **Drivers** → Copy the URI:
   ```env
   MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/anjucia_prod?retryWrites=true&w=majority
   ```
5. Paste this into your production environment variables (or test & switch it live inside `/admin` → **CMS & Base MongoDB**).
   - On first connection, `app/lib/dbStore.js` automatically seeds the 8 Mongoose collections (`Product`, `Order`, `Bundle`, `Lead`, `Review`, `Pharmacy`, `DermoScanLog`, `SiteConfig`).

---

## 3. Security Hardening Included Out of the Box

- **Server-Side Admin Authentication (`/api/admin`)**:
  - Protected by constant-time PIN comparison (`crypto.timingSafeEqual`) + brute-force rate limiting (max 10 attempts per 15 minutes per IP).
  - Issues a signed `HttpOnly; SameSite=Lax; Secure` HMAC-SHA256 session cookie (`anjucia_admin_session`, valid for 12 hours).
  - Logging out sends the `Clear-Site-Data: "cookies", "storage"` header to wipe browser state.
  - Database passwords in `mongoStatus.uri` are masked (`mongodb+srv://user:********@cluster...`) and `adminPin` is stripped from public `/api/store` responses.
- **Fetch Metadata Resource Isolation (`Sec-Fetch-Site`)**:
  - Cross-site non-navigational requests (`Sec-Fetch-Site: cross-site`) to `/api/admin`, `/api/store`, and `/api/dermoscan` are rejected with `403 Forbidden` before authentication or database queries execute.
- **Per-IP Rate Limiting & Input Sanitization**:
  - `/api/dermoscan`: Limited to 25 scans per 10 minutes per IP + 850KB payload cap.
  - `/api/store`: Limited to 30 order/lead submissions per 10 minutes per IP + HTML tag/control-character stripping on all customer fields.
- **Production HTTP Security Headers (`next.config.mjs`)**:
  - `Strict-Transport-Security: max-age=31536000; includeSubDomains; preload`
  - `Content-Security-Policy` (restricting `script-src`, `connect-src`, `object-src 'none'`, `base-uri 'none'`, `frame-ancestors 'none'`)
  - `Permissions-Policy: camera=(self), geolocation=(), microphone=(), payment=(), usb=()` (allowing WebRTC camera strictly on `anjucia.com` while blocking microphone/geolocation)
  - `X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`, `Referrer-Policy: strict-origin-when-cross-origin`, `Cross-Origin-Opener-Policy: same-origin-allow-popups`, `Cross-Origin-Resource-Policy: same-origin`
  - `poweredByHeader: false` (hides `X-Powered-By: Next.js`)

---

## 4. How to Deploy

### Option A: Hostinger Node.js Web App / Cloud Hosting
1. Push your repository to GitHub (`.env.local` and `data/anjucia-db.json` are automatically excluded by `.gitignore`).
2. In **Hostinger hPanel** → **Websites** → **Manage** → **Node.js**:
   - **Node.js Version**: `20.x` or `22.x`
   - **Application Root**: `/`
   - **Environment Variables**: Add `GEMINI_API_KEY`, `MONGODB_URI`, `ADMIN_PIN`, `ADMIN_SESSION_SECRET`, and `NEXT_PUBLIC_SITE_URL`.
   - **Build Command**: `npm run build`
   - **Start Command**: `npm run start`
3. Ensure **SSL / HTTPS** is active on `anjucia.com` (browsers require `https://` for `navigator.mediaDevices.getUserMedia` camera access).

### Option B: VPS (Ubuntu + PM2 + Nginx Reverse Proxy)
```bash
# 1. Install dependencies & build production bundle
npm ci
npm run build

# 2. Copy static assets into the standalone folder (if running standalone server.js)
cp -r public .next/standalone/public
cp -r .next/static .next/standalone/.next/static
cp .env.local .next/standalone/.env.local

# 3. Start with PM2
pm2 start npm --name "anjucia-prod" -- start
pm2 save
pm2 startup
```

---

## 5. Post-Deployment Verification Checklist

1. **SSL & Camera Check (`https://anjucia.com/analyzer`)**:
   - Open `/analyzer` on both PC and smartphone over `https://`.
   - Click **Activer la Caméra**, verify the live SVG face contour & 3-metric Photo Coach, test the **Retardateur 3s**, and confirm auto-scrolling to Step 2 and to the Clinical Results Dashboard.
2. **Admin Command Center Check (`https://anjucia.com/admin`)**:
   - Open `/admin` and log in with your `ADMIN_PIN`.
   - Verify the top badge displays `MongoDB Connecté (Live)` (or `Node.js + Persistance Hybride Active`).
   - Change a product price or stock status in **Produits**, then run a DermoScan AI™ consultation to confirm real-time catalog synchronization.
3. **Checkout & Order Flow Check (`https://anjucia.com`)**:
   - Place a test COD order from the cart drawer and verify it appears immediately under **Commandes** in `/admin`.

