# Jotish — Employee Portal 🚀

A fully-featured **ReactJS Employee Management Portal** with login, paginated data tables, camera capture, salary bar chart, and an interactive map.

## ✨ Features
cd jotish
npm install
```

### 2. Run the dev server

```bash
npm run dev
```

App starts at **http://localhost:5173**

### 3. Build for production

```bash
npm run build
npm run preview
```

---

## 🔐 Login Credentials

| Field | Value |
|-------|-------|
| Username | `testuser` |
| Password | `Test123` |

---

## 📱 Application Routes

| Route | Page | Auth Required |
|-------|------|--------------|
| `/login` | Login Form | ❌ |
| `/list` | Employee Table | ✅ |
| `/details` | Employee Details + Camera | ✅ |
| `/photo-result` | Captured Photo | ✅ |
| `/chart` | Salary Bar Chart | ✅ |
| `/map` | Employee City Map | ✅ |

---

## 📂 Project Structure

```
src/
 ├── components/
 │   ├── CameraCapture.jsx   # Camera modal (getUserMedia)
 │   ├── DarkModeToggle.jsx  # Light/Dark switcher
 │   ├── LoadingSpinner.jsx  # Animated spinner
 │   ├── Navbar.jsx          # Top navigation bar
 │   ├── Pagination.jsx      # Smart pagination
 │   └── ProtectedRoute.jsx  # Auth guard
 ├── context/
 │   └── AuthContext.jsx     # Global auth + employee state
 ├── pages/
 │   ├── LoginPage.jsx       # Login form
 │   ├── ListPage.jsx        # Employee table
 │   ├── DetailsPage.jsx     # Employee details
 │   └── PhotoResultPage.jsx # Photo display
 ├── charts/
 │   └── ChartPage.jsx       # Salary bar chart
 ├── map/
 │   └── MapPage.jsx         # Interactive map
 ├── services/
 │   └── api.js              # Axios API layer
 ├── App.jsx
 ├── main.jsx
 └── index.css               # Complete design system
```

---

## 🎥 Recording a Screen Demo

### Option A: Windows built-in (Win+G)
1. Press **Win + G** to open Xbox Game Bar
2. Click **Record** (or Win+Alt+R)
3. Navigate through the app
4. Stop recording → saved to `Videos/Captures`

### Option B: OBS Studio (recommended)
1. Download [OBS Studio](https://obsproject.com/)
2. Add **Display Capture** or **Window Capture** source
3. Set scene → Start Recording
4. Demo all screens: Login → List → Filter → Detail → Camera → Chart → Map

### Demo Script
1. Open `http://localhost:5173`
2. Attempt login with wrong creds → show error
3. Login with `testuser` / `Test123`
4. Search for an employee → show real-time filter
5. Sort by salary column
6. Navigate pages with pagination
7. Click a row → show detail page
8. Click "Capture Photo" → allow camera → capture
9. Show photo result page → retake → back to list
10. Click "Salary Chart" → show bar chart
11. Click "View Map" → show city markers → click a marker
12. Toggle dark/light mode

---

## 🌐 API Reference

**POST** `https://backend.jotish.in/backend_dev/gettabledata.php`

```json
{
  "username": "test",
  "password": "123456"
}
```

---

## 🚀 Deployment

### Vercel (recommended)
```bash
npm install -g vercel
vercel --prod
```

### Netlify
```bash
npm run build
# Drag dist/ folder to netlify.app
```

> **Note**: For Vercel/Netlify with React Router, create a `vercel.json`:
> ```json
> { "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }] }
> ```
