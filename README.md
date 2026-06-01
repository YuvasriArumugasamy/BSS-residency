# BSS Residency — Full MERN Stack Website

Premium lodge website for BSS Residency, Courtallam.

---

## 📁 Project Structure

```
bss-residency/
├── backend/
│   ├── models/Booking.js
│   ├── routes/bookings.js
│   ├── routes/admin.js
│   ├── server.js
│   ├── .env.example
│   └── package.json
└── frontend/
    ├── public/index.html
    ├── src/
    │   ├── api/axios.js    ← shared axios instance (uses REACT_APP_API_URL)
    │   ├── assets/         ← building.png, room.jpg
    │   ├── components/     ← Navbar, Footer
    │   ├── pages/          ← Home, Rooms, Gallery, Booking, Contact, Admin
    │   ├── App.js
    │   ├── index.js
    │   └── index.css
    ├── .env.example
    └── package.json
```

---

## ⚙ Local Setup

### 1. MongoDB
Either install locally from https://www.mongodb.com/try/download/community, or use a free MongoDB Atlas cluster (see deployment section below).

### 2. Backend Setup
```bash
cd backend
cp .env.example .env   # then edit .env with real values
npm install
npm run dev
```
Backend runs at: http://localhost:5000

### 3. Frontend Setup (new terminal)
```bash
cd frontend
cp .env.example .env   # leave REACT_APP_API_URL empty for local dev
npm install
npm start
```
Frontend runs at: http://localhost:3000 (CRA proxy forwards `/api/*` to the backend).

---

## 🔑 Admin Panel
URL: http://localhost:3000/admin/login

Default credentials (set via `backend/.env`):
- `ADMIN_USERNAME` (default: `admin`)
- `ADMIN_PASSWORD` (default: `bss@2025`)

---

## 🌐 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/bookings | Create booking |
| POST | /api/admin/login | Admin login |
| GET | /api/admin/bookings | Get all bookings |
| PATCH | /api/admin/bookings/:id | Update status |
| DELETE | /api/admin/bookings/:id | Delete booking |
| GET | /api/admin/stats | Dashboard stats |

---

## 🚀 Deployment Guide

The app deploys as three independent pieces:

| Piece | Provider |
|-------|----------|
| Database | MongoDB Atlas |
| Backend API | Render (Web Service) |
| Frontend | Vercel |

### Step 1 — MongoDB Atlas

1. Create a free cluster at https://www.mongodb.com/atlas.
2. **Database Access** → create a database user (username + password).
3. **Network Access** → Add IP Address → **Allow Access From Anywhere** (`0.0.0.0/0`).
4. Click **Connect → Drivers** and copy the connection string. It looks like:
   ```
   mongodb+srv://<user>:<password>@cluster0.xxxxx.mongodb.net/bss_residency?retryWrites=true&w=majority
   ```
   Replace `<user>` / `<password>` with the credentials you created.

### Step 2 — Backend on Render

1. Go to https://render.com → **New → Web Service** → connect this GitHub repo.
2. Settings:
   - **Root Directory:** `backend`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
3. **Environment Variables** (Settings → Environment):
   - `MONGO_URI` = connection string from Step 1
   - `ADMIN_USERNAME` = `admin` (or your choice)
   - `ADMIN_PASSWORD` = a strong password
   - `FRONTEND_URL` = leave empty for now; fill in after Vercel step
   - *(Do NOT set `PORT` manually — Render injects it.)*
4. Deploy. You'll get a URL like `https://bss-residency.onrender.com`. Visit it — you should see `{"message":"BSS Residency API running","status":"ok"}`.

### Step 3 — Frontend on Vercel

1. Go to https://vercel.com → **New Project** → import this repo.
2. Settings:
   - **Root Directory:** `frontend`
   - **Framework Preset:** Create React App (auto-detected)
   - **Build Command:** `npm run build` (default)
   - **Output Directory:** `build` (default)
3. **Environment Variables**:
   - `REACT_APP_API_URL` = `https://bss-residency.onrender.com` (your Render URL, no trailing slash)
4. Deploy. You'll get a URL like `https://bss-residency.vercel.app`.

### Step 4 — Tighten CORS

Back on Render, set `FRONTEND_URL` to your Vercel URL (e.g. `https://bss-residency.vercel.app`) and redeploy. You can pass multiple origins as a comma-separated list, e.g.:
```
http://localhost:3000,https://bss-residency.vercel.app
```

### Step 5 — Verify

- Open the Vercel frontend URL.
- Submit a test booking on the **Booking** page.
- Log in at `/admin/login` and confirm the booking appears in the dashboard.

---

## 🔐 Environment Variables Reference

### `backend/.env`
| Key | Required | Example |
|-----|----------|---------|
| `MONGO_URI` | yes | `mongodb+srv://user:pass@cluster0.xxxxx.mongodb.net/bss_residency` |
| `PORT` | no (Render sets) | `5000` |
| `FRONTEND_URL` | recommended | `https://bss-residency.vercel.app` |
| `ADMIN_USERNAME` | yes | `admin` |
| `ADMIN_PASSWORD` | yes | `bss@2025` |

### `frontend/.env`
| Key | Required | Example |
|-----|----------|---------|
| `REACT_APP_API_URL` | prod only | `https://bss-residency.onrender.com` |

> For local dev, leave `REACT_APP_API_URL` empty — the CRA proxy in `frontend/package.json` forwards `/api/*` to `http://localhost:5000`.

---

## 📱 WhatsApp Number Setup
Search for `91XXXXXXXXXX` across all files and replace with the real number (format: country code + number, no spaces).

---

## 🚀 Tech Stack
- **Frontend:** React 18, React Router v6, Axios
- **Backend:** Node.js, Express.js
- **Database:** MongoDB, Mongoose
- **Fonts:** Playfair Display + Inter
- **Theme:** White & Blue — Premium Clean
