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
│   ├── .env
│   └── package.json
└── frontend/
    ├── public/index.html
    ├── src/
    │   ├── assets/         ← building.png, room.jpg
    │   ├── components/     ← Navbar, Footer
    │   ├── pages/          ← Home, Rooms, Gallery, Booking, Contact, Admin
    │   ├── App.js
    │   ├── index.js
    │   └── index.css
    └── package.json
```

---

## ⚙️ Setup — Step by Step

### 1. Install MongoDB
Download from: https://www.mongodb.com/try/download/community
Install and start MongoDB service.

### 2. Backend Setup
```bash
cd backend
npm install
npm run dev
```
Backend runs at: http://localhost:5000

### 3. Frontend Setup (new terminal)
```bash
cd frontend
npm install
npm start
```
Frontend runs at: http://localhost:3000

---

## 🔑 Admin Panel
URL: http://localhost:3000/admin/login

Default credentials (change in backend/.env):
- Username: admin
- Password: bss@2025

---

## 📱 WhatsApp Number Setup
Search for `91XXXXXXXXXX` across all files and replace with actual number.
Format: 91XXXXXXXXXX (country code + number, no spaces)

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

## 📸 Adding More Photos
Place photos in: `frontend/src/assets/`
Import and use in Gallery.js or any page component.

---

## 🚀 Tech Stack
- **Frontend:** React 18, React Router v6, Axios
- **Backend:** Node.js, Express.js
- **Database:** MongoDB, Mongoose
- **Fonts:** Playfair Display + Inter (Google Fonts)
- **Theme:** White & Blue — Premium Clean
