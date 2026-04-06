# ✨ Kudos Board

> A full-stack anonymous compliment board — create your page, share the link, and let people tell you how great you are.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Node](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen)
![React](https://img.shields.io/badge/react-18.3-61DAFB?logo=react)
![MongoDB](https://img.shields.io/badge/mongodb-mongoose-47A248?logo=mongodb)

---

## 📖 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [API Reference](#-api-reference)
- [Role-Based Access Control](#-role-based-access-control)
- [Security](#-security)
- [Screenshots](#-screenshots)
- [Future Enhancements](#-future-enhancements)
- [License](#-license)

---

## 🌟 Overview

**Kudos Board** lets anyone create a personal public page at `/u/:username`. Visitors can drop anonymous compliments without signing up. The board owner logs in to moderate their feed — pinning favourites, hiding messages they don't want public, or deleting them entirely.

```
Visitor → kudos.app/u/alex → sends anonymous kudos
Alex    → kudos.app/dashboard → reads, pins, hides, manages
```

---

## ✅ Features

| Feature | Description |
|---|---|
| **User Authentication** | JWT-based register/login with bcryptjs password hashing |
| **Dynamic User Routes** | Every user gets `/u/:username` — same component, role-aware rendering |
| **Anonymous Kudos** | No account needed to send. IPs are one-way HMAC-hashed, never stored raw |
| **RBAC** | Three-tier permission model enforced server-side *and* client-side |
| **Moderation Tools** | Pin ⭐, hide 👁️, delete 🗑️ — all with optimistic UI updates |
| **Rate Limiting** | 10 kudos / 10 min per IP on submissions; 200 req / 15 min globally |
| **XSS Sanitization** | HTML-entity encoding on all user input before DB write |
| **Profile Customisation** | Display name, bio, and avatar accent colour, persisted via API |
| **Responsive UI** | Mobile-first Tailwind layout with custom sand/ember/ink/gold palette |
| **Real-Time Ready** | Architecture designed for Socket.IO extension without restructuring |

---

## 🛠 Tech Stack

### Backend

| Package | Version | Purpose |
|---|---|---|
| `express` | ^4.18 | HTTP server and REST API routing |
| `mongoose` | ^8.0 | MongoDB ODM — User and Kudos schemas |
| `jsonwebtoken` | ^9.0 | JWT generation and verification |
| `bcryptjs` | ^2.4 | Password hashing (12 salt rounds) |
| `express-rate-limit` | ^7.1 | Request throttling per route |
| `helmet` | ^7.1 | Secure HTTP response headers |
| `cors` | ^2.8 | CORS scoped to frontend origin |
| `validator` | ^13.11 | Server-side email and string validation |
| `dotenv` | ^16.3 | `.env` variable loading |

### Frontend

| Package | Version | Purpose |
|---|---|---|
| `react` | ^18.3 | Component-based UI |
| `react-router-dom` | ^6.26 | Client-side routing |
| `axios` | ^1.7 | HTTP client with JWT interceptors |
| `react-hot-toast` | ^2.4 | Toast notifications |
| `lucide-react` | ^0.383 | Icon library |
| `tailwindcss` | ^3.4 | Utility-first CSS with custom theme |
| `vite` | ^5.3 | Dev server + production bundler |

---

## 📁 Project Structure

```
kudos-board/
│
├── backend/
│   ├── server.js                  # Express entry point, MongoDB connect, middleware
│   ├── .env.example               # Environment variable template
│   │
│   ├── models/
│   │   ├── User.js                # Schema: username, email, password, avatarColor
│   │   └── Kudos.js               # Schema: recipient, message, emoji, pin, hide, ipHash
│   │
|   ├── controllers/
|   |   ├── authController.js      # Controller for the authentication - login , register , profile , me
|   |   ├── userController.js      # Controller for the user 
|   |`  ├── kudosController.js     # Controller for the kudos 
|   |  
│   ├── routes/
│   │   ├── auth.js                # POST /register /login  GET /me  PATCH /profile
│   │   ├── users.js               # GET /users/:username  GET /users/:username/stats
│   │   └── kudos.js               # GET POST PATCH DELETE per username
│   │
│   ├── middleware/
│   │   └── auth.js                # protect · optionalAuth · isOwner
│   │
│   └── utils/
│       └── sanitize.js            # HTML entity encoder + HMAC IP hasher
│
└── frontend/
    ├── index.html
    ├── vite.config.js             # Proxies /api → http://localhost:5000
    ├── tailwind.config.js         # Custom theme: sand, ember, ink, gold
    │
    └── src/
        ├── main.jsx
        ├── App.jsx                # Router, provider tree, route guards
        │
        ├── context/
        │   ├── AuthContext.jsx    # User auth state — single source of truth
        │   ├── KudosContext.jsx   # Kudos data, send, moderate, filter, stats
        │   └── AppContext.jsx     # UI only — toast and modal state
        │
        ├── pages/
        │   ├── Home.jsx           # Landing page
        │   ├── Auth.jsx           # Login / Register (mode prop)
        │   ├── Board.jsx          # Public board + owner moderation view
        │   └── Dashboard.jsx      # Owner dashboard: stats, profile, kudos
        │
        ├── components/
        │   ├── Layout/
        │   │   ├── Navbar.jsx
        │   │   └── Footer.jsx
        │   ├── Kudos/
        │   │   ├── KudoCard.jsx   # Single kudo card with moderation controls
        │   │   ├── KudoList.jsx   # Pure render list — receives pre-filtered kudos
        │   │   └── KudoForm.jsx   # Anonymous send form — calls props.onSend()
        │   └── Ui/
        │       ├── Button.jsx
        │       ├── Card.jsx
        │       ├── Input.jsx
        │       ├── Textarea.jsx
        │       ├── Avatar.jsx
        │       ├── Toggle.jsx
        │       ├── EmojiPicker.jsx
        │       ├── Toast.jsx
        │       └── Modal.jsx
        │
        ├── service/
        │   └── api.js             # authService · userService · kudosService
        │
        ├── constants/
        │   └── index.js           # COLORS, EMOJIS, initialKudos
        │
        └── utils/
            └── helper.js          # generateId, formatDate, etc.
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** v18 or higher
- **MongoDB** running locally on port `27017`, or a [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) connection string
- **npm** v9 or higher

### Installation

**1. Clone the repo**

```bash
git clone https://github.com/Mehulposh/kudos-board.git
cd kudos-board
```

**2. Set up the backend**

```bash
cd backend
npm install
cp .env.example .env
# Open .env and fill in your values (see Environment Variables below)
npm run dev
# Server running at http://localhost:5000
```

**3. Set up the frontend**

```bash
# In a new terminal
cd frontend
npm install
npm run dev
# App running at http://localhost:5173
```

> Vite proxies all `/api` requests to `http://localhost:5000` automatically — no CORS issues in development.

---

## 🔐 Environment Variables

Create a `.env` file in the `backend/` directory. Use `.env.example` as a template.

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/kudos-board
JWT_SECRET=replace_this_with_a_long_random_string
JWT_EXPIRES_IN=7d
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

| Variable | Required | Description |
|---|---|---|
| `PORT` | No (default 5000) | Express server port |
| `MONGODB_URI` | ✅ Yes | MongoDB connection string |
| `JWT_SECRET` | ✅ Yes | Secret for signing JWTs — keep this private |
| `JWT_EXPIRES_IN` | No (default 7d) | Token expiry duration |
| `NODE_ENV` | No | Set to `production` to suppress error stack traces |
| `FRONTEND_URL` | ✅ Yes | CORS allowed origin |

---

## 📡 API Reference

All endpoints are prefixed with `/api`. Protected routes require `Authorization: Bearer <token>`.

### Auth — `/api/auth`

| Method | Endpoint | Auth | Body | Description |
|---|---|---|---|---|
| `POST` | `/auth/register` | None | `{ name, username, email, password }` | Register. Returns token + user |
| `POST` | `/auth/login` | None | `{ email, password }` | Login. Returns token + user |
| `GET` | `/auth/me` | Bearer | — | Returns current authenticated user |
| `PATCH` | `/auth/profile` | Bearer | `{ displayName?, bio?, avatarColor?, isPublic? }` | Update profile |

### Users — `/api/users`

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/users/:username` | Optional | Public profile + `isOwner` flag |
| `GET` | `/users/:username/stats` | Optional | `{ total, pinned, hidden, thisWeek }` |

### Kudos — `/api/kudos`

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/kudos/:username` | Optional | Paginated kudos. Hidden only returned for owner |
| `POST` | `/kudos/:username` | None | Send a kudo. Body: `{ message, emoji, senderNickname }` |
| `PATCH` | `/kudos/:username/:id/pin` | Bearer | Toggle pin on a kudo |
| `PATCH` | `/kudos/:username/:id/hide` | Bearer | Toggle hide on a kudo |
| `DELETE` | `/kudos/:username/:id` | Bearer | Permanently delete a kudo |

### Response shape

```json
// POST /api/kudos/:username — success
{
  "message": "Kudos sent! 🎉",
  "kudo": {
    "_id": "...",
    "emoji": "🌟",
    "message": "You are amazing!",
    "senderNickname": "Anonymous",
    "isPinned": false,
    "isHidden": false,
    "createdAt": "2024-01-15T10:30:00.000Z"
  }
}

// Error
{ "error": "Message must be at least 5 characters." }

// Rate limit (HTTP 429)
{ "error": "Too many kudos posted. Please wait a bit!" }
```

---

## 🔒 Role-Based Access Control

| Action | Guest | Authenticated Owner |
|---|---|---|
| View public board | ✅ | ✅ |
| Send anonymous kudo | ✅ | ✅ |
| View hidden kudos | ❌ | ✅ |
| Pin / unpin a kudo | ❌ | ✅ |
| Hide / show a kudo | ❌ | ✅ |
| Delete a kudo | ❌ | ✅ |
| Edit profile & bio | ❌ | ✅ |
| Toggle board visibility | ❌ | ✅ |

Enforcement is **dual-layer**:
- **Server**: `protect`, `optionalAuth`, and `isOwner` middleware on every Express route
- **Client**: `isOwner` flag from the board load response controls what React renders

---

## 🛡 Security

- **Passwords** — bcryptjs with 12 salt rounds. The `password` field is `select: false` in Mongoose — never returned in queries.
- **JWT** — signed with `JWT_SECRET`, expires in 7 days. Verified by the `protect` middleware on every protected request.
- **XSS** — all user-submitted text is HTML-entity-encoded server-side before writing to MongoDB.
- **IP Privacy** — sender IPs are converted to a one-way HMAC-SHA256 hash before storage. Raw IPs are never persisted or returned.
- **Rate Limiting** — global limiter (200 req / 15 min) + tight post limiter (10 req / 10 min) on the anonymous submission endpoint.
- **Helmet** — sets `Content-Security-Policy`, `X-Frame-Options`, `X-Content-Type-Options`, and other headers on every response.
- **CORS** — restricted to `FRONTEND_URL` only. Credentials included for cookie support.
- **Input Validation** — `validator` and Mongoose schema constraints server-side; HTML5 `required`, `minLength`, `maxLength` client-side.

---

## 🖼 Screenshots

| Page | Description |
|---|---|
| `/` | Landing page with animated hero card stack |
| `/register` | Split-panel sign-up with live username preview |
| `/u/:username` | Public board with send form, masonry kudos grid |
| `/dashboard` | Owner dashboard — stats, moderation, profile settings |

---

## 🔭 Future Enhancements

- [ ] **Real-time notifications** — Socket.IO push when a new kudo arrives on an open board
- [ ] **Email digest** — daily or weekly summary sent to the board owner
- [ ] **Reactions** — emoji reactions on existing kudos without posting a full message
- [ ] **Board themes** — owners choose from multiple colour themes for their public page
- [ ] **Kudo collections** — group and label pinned kudos into named sections
- [ ] **Admin dashboard** — platform-level moderation view for flagged content
- [ ] **OAuth login** — Sign in with Google or GitHub

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).

---

<div align="center">
  <p>Made with 💛 · <strong>Kudos Board</strong> · v1.0.0</p>
</div>
