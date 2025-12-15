# Books Shop API

A robust RESTful API for a Books Shop, built with **Hono.js**, **Drizzle ORM**, and **TypeScript**. This project follows a Feature-based MVC architecture and emphasizes clean code, validation, and comprehensive testing.

## Tech Stack
- **Framework:** [Hono.js](https://hono.dev/) (Fast, lightweight web standard)
- **Language:** TypeScript
- **Database:** PostgreSQL
- **ORM:** [Drizzle ORM](https://orm.drizzle.team/)
- **Caching & Auth Storage:** Redis
- **Validation:** Zod
- **Testing:** Vitest
- **Linting & Formatting:** ESLint & Prettier
- **Containerization:** Docker & Docker Compose

##  Features

###  Authentication (Auth Module)
- Login with **Username** or **Email**.
- JWT Tokens stored and managed in **Redis** (White/Blacklisting).
- **Forget Password:** Simulates sending a static OTP (`123456`).
- **Reset Password:** Verify OTP and set a new password.
- **Logout:** Invalidates the session in Redis.

###  User Profile (User Module)
- View and Edit user profile details.
- Change Password (Authenticated).

###  Books Management (Book Module)
- **Public:** List all books with Pagination, Search, and Sorting (A-Z / Z-A).
- **Details:** Fetch book details including Relations (Author, Category, Tags).
- **My Books:** - CRUD operations for authenticated users (Manage own books only).
  - Search and Sort specific to the user's collection.

###  Relations
- **Category:** One-to-Many (A book belongs to one category).
- **Author:** One-to-Many (A book belongs to one author).
- **Tags:** Many-to-Many (Books can have multiple tags).

## Project Structure (Feature-based MVC)
The project is organized by features (modules) rather than technical layers, making it scalable and easy to maintain.

```text
src/
├── config/             # Environment & DB Configuration
├── middlewares/             # Shared utilities, middlewares, and guards
│   ├── authMiddleware.ts    # Auth & Error handling middlewares
│   |        
├── modules/            # Feature Modules
│   ├── auth/           # Login, Register, Password Reset
│   │   ├── auth.controller.ts
│   │   ├── auth.service.ts
│   │   └── auth.schema.ts (Zod)
│   ├── users/          # Profile management
│   └── books/          # Books CRUD & Logic
├── db/                 # Drizzle Schema & Migrations
│   ├── schema.ts
│   └── migrations/
├── index.ts            # App Entry Point
└── ...