# Single Web Link Deployment Guide

This platform is configured as a **Unified Fullstack Web Application**. You can deploy both the Frontend (React SPA) and Backend (Express API + Turso DB + AI Services) under **a single web link**.

---

## Option 1: Deploy on Render (Recommended Free Fullstack Host)

Render hosts your entire project on one URL (e.g. `https://the-pitch-deck.onrender.com`), handling API requests, static frontend pages, and background email/notification jobs together.

### Steps:
1. Push your latest code to your GitHub repository (e.g. `preethi-0809/the-pitch-deck`).
2. Go to [Render Dashboard](https://dashboard.render.com/) and click **New +** -> **Web Service**.
3. Select your GitHub repository.
4. Configure the settings:
   - **Name**: `the-pitch-deck` (or your choice)
   - **Runtime**: `Node`
   - **Branch**: `main`
   - **Build Command**: `npm run build`
   - **Start Command**: `npm start`
   - **Plan**: `Free`
5. In **Environment Variables**, add the following keys from your `.env`:
   - `NODE_ENV` = `production`
   - `DB_TYPE` = `turso`
   - `TURSO_DATABASE_URL` = `libsql://pitchdeck-preethi-0809.aws-ap-south-1.turso.io`
   - `TURSO_AUTH_TOKEN` = `<your-turso-auth-token>`
   - `JWT_SECRET` = `super_secure_exam_ai_jwt_secret_key_2026`
   - `JWT_EXPIRES_IN` = `7d`
   - `AI_PROVIDER` = `mock` *(or `gemini` if using real API key)*
   - `EMAIL_PROVIDER` = `smtp`
   - `EMAIL_HOST` = `smtp.gmail.com`
   - `EMAIL_PORT` = `587`
   - `EMAIL_USER` = `preethika0809@gmail.com`
   - `EMAIL_PASS` = `nlsu kkia whuf crkv`
   - `EMAIL_FROM` = `"Pitch Deck Government Exam Intelligence" <preethika0809@gmail.com>`
   - `ADMIN_NOTIFICATION_EMAIL` = `preethika0809@gmail.com`
6. Click **Deploy Web Service**.
7. Once deployment finishes, your single web link will be live (e.g. `https://the-pitch-deck.onrender.com`).

---

## Connected Live Architecture: Vercel (Frontend) + Render (Backend)

- **Frontend URL**: `https://the-pitch-deck.vercel.app`
- **Backend API URL**: `https://the-pitch-deck.onrender.com`
- **Database**: Turso Cloud libSQL (`pitchdeck-preethi-0809.aws-ap-south-1.turso.io`)

### How Frontend and Backend Are Connected:
1. **Dual-Path Resilient Routing**:
   - **Vercel Reverse Proxy (`vercel.json`)**: All requests to `https://the-pitch-deck.vercel.app/api/*` are edge reverse-proxied directly to `https://the-pitch-deck.onrender.com/api/$1`.
   - **Smart Client Fallback (`frontend/src/services/api.js`)**: If direct requests are made, the frontend client automatically resolves to `https://the-pitch-deck.onrender.com/api` when running on any production domain.
2. **CORS Configuration**: Render backend explicitly allows `https://the-pitch-deck.vercel.app`, handles `OPTIONS` preflight requests, and allows credentials and auth headers (`Authorization`, `Content-Type`).
3. **Database & Modules**: All modules (Discovery, Aspirant OS, Mock Tests, AI Coach, Notifications, Syllabi) interact with the live Render backend, which executes queries against the Turso cloud database.

### Redeploying Updates:
Simply push your changes to GitHub:
```bash
git add .
git commit -m "Connect frontend and backend modules"
git push origin main
```
Both Vercel and Render will automatically pick up the new commit and rebuild!

---

## Option 3: Deploy on Railway / Koyeb

1. Go to [Railway](https://railway.app/) or [Koyeb](https://www.koyeb.com/).
2. Create a new service from GitHub repo.
3. Build Command: `npm run build`
4. Start Command: `npm start`
5. Port: `5000` (or leave default, Railway assigns `$PORT` automatically).
6. Set environment variables.

---

## How it Works Under the Hood

- **Single Domain Origin**: When a user navigates to `/dashboard` or `/mock-tests`, the browser renders the React single page app from the root host.
- **Unified API Routing**: When the frontend requests `/api/exams` or `/api/auth/login`, it sends relative requests to `/api/*` on the exact same domain. No CORS configurations or separate backend hosting needed.
- **Turso Cloud DB**: The backend syncs state directly with your cloud Turso database, keeping all user data, test attempts, study plans, and notifications synchronized in real time.
