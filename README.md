# Book My Ticket

Book My Ticket is a cinema seat booking platform designed to solve the critical problem of concurrent booking and race conditions in high-traffic ticketing systems. It works by implementing a robust backend architecture using Node.js and Express, where every booking request is processed within an atomic PostgreSQL transaction. By utilizing "SELECT FOR UPDATE" row-level locking, the system ensures that a seat can never be double-booked, even if multiple users attempt to reserve it at the exact same millisecond. The platform provides a secure environment through JWT-based authentication, allowing only registered users to access the booking flow while maintaining a responsive, light-mode frontend for a seamless user experience across all devices.

## Tech Stack
Node.js, Express, PostgreSQL, JWT (JSON Web Token), Bcrypt.js, Dotenv, CORS, Lucide Icons, Vanilla JavaScript, HTML5, CSS3, Docker, Docker Compose

## Features

- User Registration & Login (JWT Auth)
- Protected seat booking (auth required)
- Duplicate seat booking prevention via `SELECT FOR UPDATE` transactions
- Bookings associated with logged-in users
---

## Project Structure

```
book-my-ticket/
├── server.js              # Entry point
├── app.js                 # Express app
├── public/
│   └── index.html         
├── migrations/
│   └── 001_users_and_seats.sql
├── src/
│   ├── common/
│   │   ├── config/db.js           # PostgreSQL pool
│   │   ├── dto/base.dto.js        # Base validation DTO
│   │   ├── middleware/validate.middleware.js
│   │   └── utils/
│   │       ├── api-error.js
│   │       └── api-response.js
│   └── modules/
│       ├── auth/
│       │   ├── dto/register.dto.js
│       │   ├── dto/login.dto.js
│       │   ├── auth.controller.js
│       │   ├── auth.middleware.js
│       │   ├── auth.model.js
│       │   ├── auth.route.js        S
│       │   └── auth.service.js
│       └── seats/
│           ├── dto/book-seat.dto.js
│           ├── seats.controller.js
│           ├── seats.model.js      # SELECT FOR UPDATE transactions
│           ├── seats.route.js      
│           └── seats.service.js
├── .env
└── package.json
```

---

## Setup

### 1. Prerequisites
- Node.js 18+
- PostgreSQL running locally

### 2. Clone & Install

```bash
git clone https://github.com/yourusername/book-my-ticket
cd book-my-ticket
npm install
```

### 3. Configure Environment

```bash
cp .env.example .env
```

Edit `.env`:

```env
PORT=8080
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=your_password
DB_NAME=sql_class_2_db
JWT_SECRET=your_strong_random_secret
JWT_EXPIRES_IN=7d
```

### 4. Run Database Migration

```bash
psql -U postgres -d sql_class_2_db -f migrations/001_users_and_seats.sql
```

### 5. Start the Server

```bash
npm start          # production
npm run dev        # development with nodemon
```

Open: `http://localhost:8080`  
---

## API Reference

### Auth

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/v1/auth/register` | ❌ | Register new user |
| POST | `/api/v1/auth/login` | ❌ | Login, receive JWT |
| GET | `/api/v1/auth/me` | ✅ | Get current user |

### Seats

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/v1/seats` | ❌ | Get all seats |
| PUT | `/api/v1/seats/:id/book` | ✅ | Book a seat |
| GET | `/api/v1/seats/my-bookings` | ✅ | Get user's bookings |

### Legacy (Original endpoints — preserved)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/seats` | Get all seats |
| PUT | `/:id/:name` | Book by name (no auth) |

---

## How Duplicate Booking is Prevented

```sql
BEGIN;
  SELECT * FROM seats WHERE id = $1 AND isbooked = 0 FOR UPDATE;
  -- Row is locked — concurrent requests block here
  -- If no rows: ROLLBACK (seat already taken)
  UPDATE seats SET isbooked = 1, name = $2, user_id = $3 WHERE id = $1;
COMMIT;
```

The `FOR UPDATE` advisory lock ensures that even under concurrent requests, only one transaction can book a seat. The second request will either wait and then see `isbooked = 1`, or fail immediately — no double bookings ever.

---

## Authentication Flow

```
1. POST /api/v1/auth/register  →  Create account
2. POST /api/v1/auth/login     →  Receive JWT token
3. PUT  /api/v1/seats/3/book   →  Authorization: Bearer <token>
```

All protected endpoints require `Authorization: Bearer <your_jwt_token>` in the request header.
