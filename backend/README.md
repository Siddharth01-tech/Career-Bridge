# Career Bridge - Backend API

RESTful API backend for the **Career Bridge** job portal platform. Built with Node.js, Express, and PostgreSQL, providing secure authentication, role-based access control, file storage, job management, candidate applications, and administrative moderation.

---

## Table of Contents

- [Features](#features)
- [Architecture & Tech Stack](#architecture--tech-stack)
- [Database Schema](#database-schema)
- [Folder Structure](#folder-structure)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Environment Variables](#environment-variables)
  - [Installation](#installation)
  - [Database Initialization](#database-initialization)
  - [Running the Server](#running-the-server)
- [API Documentation](#api-documentation)
  - [Base URL](#base-url)
  - [Authentication & User Routes (`/api/auth`)](#authentication--user-routes-apiauth)
  - [Candidate Profile Routes (`/api/candidate`)](#candidate-profile-routes-apicandidate)
  - [Company Routes (`/api/company`)](#company-routes-apicompany)
  - [Job Routes (`/api/jobs`)](#job-routes-apijobs)
  - [Application Routes (`/api/applications`)](#application-routes-apiapplications)
  - [Admin Routes (`/api/admin`)](#admin-routes-apiadmin)
- [Error Handling & Security](#error-handling--security)
- [Scripts](#scripts)

---

## Features

- **Authentication & RBAC:**
  - JWT-based authentication via `Authorization: Bearer <token>` or cookies.
  - Role-based authorization supporting `candidate`, `recruiter`, and `admin`.
  - Rate limiting on sensitive endpoints (e.g. login and registration) to prevent brute force attacks.
  - Password hashing with `bcryptjs`.
- **Candidate Profiles:**
  - Profile creation and updates with education, skills array, experience, location, bio, and phone.
  - Resume upload to ImageKit cloud storage.
- **Company & Recruiter Management:**
  - Company profile setup with details, website, industry, and logo uploads.
  - Restricted to users with the `recruiter` role.
- **Job Postings:**
  - Full CRUD lifecycle for job listings.
  - Filterable and searchable job queries.
  - Salary range, required skills, experience level, and deadline tracking.
- **Applications:**
  - Job application submission linking candidate resume and cover letters.
  - Tracking application statuses (`applied`, etc.).
- **Admin Management:**
  - Moderate users (view, block, unblock accounts).
  - Review and remove inappropriate job listings.
- **Automated Database Setup:**
  - Automatic table creation and verification on application startup (`init_db.js`).

---

## Architecture & Tech Stack

- **Runtime:** Node.js (CommonJS)
- **Framework:** Express.js 5
- **Database:** PostgreSQL (with `pg` Connection Pool)
- **Authentication:** JSON Web Tokens (`jsonwebtoken`) & `bcryptjs`
- **File Upload & Cloud Storage:** Multer (memory storage) & ImageKit (`@imagekit/nodejs`)
- **Security & Utilities:** `cors`, `helmet`, `express-rate-limit`, `dotenv`, `morgan`

---

## Database Schema

The database automatically initializes the following relational tables on server startup:

1. **`users`**:
   - `id`, `name`, `email` (unique), `password_hash`, `role` (`candidate` | `recruiter` | `admin`), `is_blocked`, `created_at`, `updated_at`.
2. **`files`**:
   - `id`, `user_id`, `file_name`, `file_type`, `file_size`, `file_url`, `storage_public_id`, `created_at`.
3. **`candidate_profiles`**:
   - `id`, `user_id` (unique), `phone`, `skills` (`TEXT[]`), `education`, `experience`, `location`, `bio`, `resume_id` (FK to `files`), timestamps.
4. **`companies`**:
   - `id`, `recruiter_id` (unique), `company_name`, `description`, `website`, `location`, `industry`, `logo_id` (FK to `files`), timestamps.
5. **`jobs`**:
   - `id`, `recruiter_id`, `company_id`, `title`, `description`, `location`, `job_type`, `salary_min`, `salary_max`, `skills` (`TEXT[]`), `experience`, `deadline`, timestamps.
6. **`applications`**:
   - `id`, `job_id`, `candidate_id`, `resume_id`, `cover_letter`, `status`, timestamps.

---

## Folder Structure

```text
backend/
├── src/
│   ├── app.js                   # Express application setup & route mounting
│   ├── config/
│   │   ├── db.js                # PostgreSQL connection pool configuration
│   │   └── init_db.js           # DDL queries for automatic database schema setup
│   ├── controllers/
│   │   ├── admincontroller.js
│   │   ├── applicationcontroller.js
│   │   ├── authcontroller.js
│   │   ├── candidatecontroller.js
│   │   ├── companycotroller.js
│   │   └── jobcontroller.js
│   ├── middleware/
│   │   ├── authmiddleware.js     # JWT token extraction and verification
│   │   ├── errormiddleware.js    # Global error handlers
│   │   ├── ratelimitmiddleware.js# IP rate limiting
│   │   ├── rolemiddleware.js     # RBAC role verification
│   │   └── uploadmiddleware.js   # Multer file upload handlers (resume / logo)
│   ├── models/                  # Database query models
│   ├── routes/                  # Express route definitions
│   ├── services/
│   │   └── storageservice.js    # ImageKit upload integration
│   └── validators/              # Request payload validation middleware
├── .env                         # Environment variables (git-ignored)
├── package.json
└── server.js                    # Entry point; boots DB and starts HTTP server
```

---

## Getting Started

### Prerequisites

- **Node.js** (v18 or higher recommended)
- **PostgreSQL** instance running locally or on the cloud
- **ImageKit Account** (for file uploads)

### Environment Variables

Create a `.env` file in the `backend/` directory:

```env
# Server
PORT=5000
NODE_ENV=development

# PostgreSQL Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=your_postgres_password
DB_NAME=career_bridge_db

# Authentication
JWT_SECRET=your_super_secret_jwt_key

# ImageKit Storage
IMAGEKIT_PRIVATE_KEY=your_imagekit_private_key
```

### Installation

Navigate to the `backend` directory and install dependencies:

```bash
cd backend
npm install
```

### Database Initialization

Tables are automatically verified and created when the backend starts up via `server.js`.

To run schema initialization independently:

```bash
node src/config/init_db.js
```

### Running the Server

- **Development Mode (with auto-restart via nodemon):**
  ```bash
  npm run dev
  ```
- **Production Mode:**
  ```bash
  npm start
  ```

Once running, the API will be available at `http://localhost:5000`.

---

## API Documentation

### Base URL

```text
http://localhost:5000
```

### Authentication Header

For protected endpoints, include the JWT token in the `Authorization` header:

```http
Authorization: Bearer <your_jwt_token>
```

---

### Authentication & User Routes (`/api/auth`)

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/api/auth/register` | Public | Register a new user (`candidate`, `recruiter`, or `admin`). |
| `POST` | `/api/auth/login` | Public | Authenticate user credentials and receive a JWT. |
| `GET` | `/api/auth/me` | Authenticated | Retrieve current authenticated user details. |
| `POST` | `/api/auth/logout` | Authenticated | Log out user and invalidate session/token cookie. |

**Example Register Request Body:**
```json
{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "password": "strongPassword123",
  "role": "candidate"
}
```

---

### Candidate Profile Routes (`/api/candidate`)

> Requires authentication with role `candidate`.

| Method | Endpoint | Content-Type | Description |
|---|---|---|---|
| `POST` | `/api/candidate/createprofile` | `multipart/form-data` | Create candidate profile with optional resume file (`resume`). |
| `GET` | `/api/candidate/getprofile` | — | Fetch profile details of the current candidate. |
| `PUT` | `/api/candidate/updateprofile` | `multipart/form-data` | Update candidate profile details or upload new resume. |

**Form Fields:**
- `phone` (string)
- `skills` (comma-separated string or array)
- `education` (string)
- `experience` (integer in years)
- `location` (string)
- `bio` (string)
- `resume` (file: pdf/doc/docx)

---

### Company Routes (`/api/company`)

> Requires authentication with role `recruiter`.

| Method | Endpoint | Content-Type | Description |
|---|---|---|---|
| `POST` | `/api/company/createcompany` | `multipart/form-data` | Create company profile with optional logo file (`logo`). |
| `GET` | `/api/company/getcompany` | — | Fetch profile of the logged-in recruiter's company. |
| `PUT` | `/api/company/updatecompany` | `multipart/form-data` | Update company profile details or logo. |

**Form Fields:**
- `companyName` (required string)
- `description` (string)
- `website` (string)
- `location` (string)
- `industry` (string)
- `logo` (image file)

---

### Job Routes (`/api/jobs`)

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/jobs/getalljob` | Public | List and search all active job posts. |
| `GET` | `/api/jobs/getajob/:id` | Public | Retrieve a single job post by ID. |
| `POST` | `/api/jobs/createjob` | Recruiter | Create a new job listing under recruiter's company. |
| `PUT` | `/api/jobs/updateajob/:id` | Recruiter | Update an existing job post owned by the recruiter. |
| `DELETE`| `/api/jobs/deletejob/:id` | Recruiter | Delete an existing job post owned by the recruiter. |

**Example Create Job Payload:**
```json
{
  "companyId": 1,
  "title": "Full Stack Engineer",
  "description": "Looking for a skilled developer proficient in React and Node.js.",
  "location": "Remote",
  "jobType": "Full-Time",
  "salaryMin": 60000,
  "salaryMax": 90000,
  "skills": ["React", "Node.js", "PostgreSQL"],
  "experience": 2,
  "deadline": "2026-12-31"
}
```

---

### Application Routes (`/api/applications`)

> Requires authentication with role `candidate`.

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/api/applications/applyforjob` | Candidate | Submit an application for a specified `jobId`. |
| `GET` | `/api/applications/myapplication` | Candidate | View all applications submitted by current candidate. |

**Example Apply Payload:**
```json
{
  "jobId": 1,
  "coverLetter": "I am excited to apply for this position..."
}
```

---

### Admin Routes (`/api/admin`)

> Requires authentication with role `admin`.

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/admin/users` | List all users with filtering/pagination. |
| `GET` | `/api/admin/users/:id` | Retrieve user profile by user ID. |
| `PUT` | `/api/admin/users/:id/block` | Block a user from logging in or performing actions. |
| `PUT` | `/api/admin/users/:id/unblock` | Unblock a previously blocked user account. |
| `GET` | `/api/admin/jobs` | Retrieve all jobs for administrative review. |
| `DELETE`| `/api/admin/jobs/:id` | Remove any job post violating platform guidelines. |

---

## Error Handling & Security

- **CORS:** Configured to accept authorized local frontend connections with credentials support.
- **Rate Limiting:** Prevents brute force attempts on sensitive authentication endpoints (`authLimiter`).
- **Validation:** All incoming requests are validated through custom middleware before reaching controllers.
- **Account Status Verification:** Blocked user accounts are rejected automatically during authentication.
- **Standardized Error Responses:** Responses return JSON with meaningful HTTP status codes (`400`, `401`, `403`, `404`, `500`).

---

## Scripts

| Script | Command | Description |
|---|---|---|
| `start` | `npm start` | Runs server with Node.js in production. |
| `dev` | `npm run dev` | Runs server with `nodemon` for active live reloading. |

