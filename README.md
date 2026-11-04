# CareerBridge — Full-Stack Career & Recruitment Platform

[![Node.js Version](https://img.shields.io/badge/Node.js-18%2B-green.svg)](https://nodejs.org/)
[![React Version](https://img.shields.io/badge/React-19.x-blue.svg)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-6.x-purple.svg)](https://vitejs.dev/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-14%2B-336791.svg)](https://www.postgresql.org/)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-4.x-38B2AC.svg)](https://tailwindcss.com/)

**CareerBridge** is a modern, enterprise-ready full-stack job portal and talent acquisition platform. It seamlessly connects candidates, recruiters, and platform administrators through a unified design system, role-based workflows, and a RESTful API backed by PostgreSQL.

---

## Table of Contents

1. [Platform Overview & Key Capabilities](#platform-overview--key-capabilities)
2. [Role-Based Architecture](#role-based-architecture)
   - [Candidate Experience](#1-candidate-experience)
   - [Recruiter Portal](#2-recruiter-portal)
   - [Super Admin Panel](#3-super-admin-panel)
3. [Design System & Branding](#design-system--branding)
4. [Technology Stack](#technology-stack)
5. [Repository Structure](#repository-structure)
6. [Getting Started & Local Setup](#getting-started--local-setup)
   - [Prerequisites](#prerequisites)
   - [1. Backend Setup & Database Initialization](#1-backend-setup--database-initialization)
   - [2. Frontend Setup](#2-frontend-setup)
   - [3. Running the Complete Application](#3-running-the-complete-application)
7. [Environment Variables Reference](#environment-variables-reference)
8. [Administrative Access & Security Architecture](#administrative-access--security-architecture)
9. [Complete API Endpoints Reference](#complete-api-endpoints-reference)
10. [Quality Assurance & Verification](#quality-assurance--verification)

---

## Platform Overview & Key Capabilities

- **Zero Demo Data Constraint**: Every statistic, requisition, applicant record, and user profile displayed on the web interface is fetched directly from the PostgreSQL database.
- **Enterprise Authentication & RBAC**: Stateless JSON Web Token (JWT) verification with strict role-level authorization middleware (`candidate`, `recruiter`, `admin`).
- **Unified Visual Identity**: Seamless transition between the public landing page, candidate workspace, recruiter management portal, and administration dashboard.
- **Cloud Document & Asset Management**: Secure resume uploads and company logo storage powered by ImageKit.
- **Application & Candidate Pipeline**: End-to-end recruitment lifecycle from job posting and search discovery to candidate submission and status updates.

---

## Role-Based Architecture

### 1. Candidate Experience
- **Public Discovery**: Search and filter live requisitions on the landing page by keyword, location, and employment type.
- **Candidate Workspace (`/dashboard` or `/candidate/dashboard`)**:
  - Live metric cards (Total Applications, Reviewing, Shortlisted).
  - Search and filter jobs in real time with immediate keyword matching.
  - One-click application modal with custom cover letter submission.
  - Application history tracking.

### 2. Recruiter Portal
- **Recruiter Workspace (`/recruiter/dashboard` or `/recruiter`)**:
  - Setup and management of verified Company Profiles (name, website, location, industry, description).
  - Job Requisition Management: Post new openings, edit active positions, and delete closed requisitions.
  - Pipeline Analytics: Real-time count of active openings and applicant dossiers.
  - Review candidate applications and change applicant statuses (Applied, Reviewing, Shortlisted, Rejected, Accepted).

### 3. Super Admin Panel
- **Administrative Governance (`/admin/dashboard` or `/admin`)**:
  - **Designated Access Only**: Admin status is not open for public registration; it is tied exclusively to the designated administrative email (`admin@careerbridge.com`).
  - **User Account Management**: Audit candidates, recruiters, and admins with detailed role badges, registration dates, and account standing.
  - **Account Restriction**: Suspend (block) or restore (unblock) user access immediately. Self-blocking protection prevents admins from locking their own accounts.
  - **Requisition Moderation**: Inspect job requisition details and delete non-compliant postings globally across all companies.
  - **Platform Diagnostics**: Live backend API connection monitor and real-time security integrity diagnostics.

---

## Design System & Branding

Both the public landing experience and the authenticated workspaces adhere to the CareerBridge design system:

| Design Token | Value | Usage |
| :--- | :--- | :--- |
| **Primary Accent** | `#FF5A0A` / `#FF5C00` | CareerBridge Brand Orange (CTAs, active pills, badges, highlights) |
| **Primary Dark** | `#080D1C` | Near-black/navy (Headings, primary buttons, brand text) |
| **Main Background** | `#FFFFFF` | Clean card surfaces, landing hero, and modals |
| **App Background** | `#F8FAFC` / `#F8FAFF` | Subtle blue-gray canvas for candidate, recruiter & admin dashboards |
| **Secondary Text** | `#64748B` | Slate gray for descriptions, metadata, and subtitles |
| **Borders** | `#E2E8F0` / `slate-200` | Subtle, accessible card borders and dividers |
| **Typography** | `Plus Jakarta Sans`, sans-serif | Modern geometric typography with standardized weights |
| **Border Radius** | `rounded-2xl`, `rounded-3xl`, `rounded-full` | Friendly, modern rounded card and button geometry |

---

## Technology Stack

### Frontend
- **Framework**: React 19 + Vite 6
- **Styling**: Tailwind CSS v4 + PostCSS
- **Routing**: React Router v7 (`react-router-dom`)
- **Icons**: Lucide React
- **HTTP Client**: Native fetch with centralized API client & cookie/Bearer auth support

### Backend
- **Runtime**: Node.js (CommonJS)
- **Framework**: Express 5
- **Database**: PostgreSQL with `pg` connection pool
- **Authentication**: `jsonwebtoken` (JWT) + `bcryptjs` password hashing
- **Security & Headers**: `helmet`, `cors`, `express-rate-limit`
- **File Uploads**: `multer` + `@imagekit/nodejs` SDK
- **Logging**: `morgan`

---

## Repository Structure

```text
Career-Bridge/
├── README.md                      # Complete project documentation (Root)
│
├── backend/                       # Express RESTful API server
│   ├── README.md                  # Dedicated backend architecture documentation
│   ├── server.js                  # Application entry point (initializes DB and starts HTTP server)
│   ├── package.json               # Backend dependencies and scripts
│   ├── .env                       # Backend environment configuration
│   └── src/
│       ├── app.js                 # Express app configuration, middleware, and route mounting
│       ├── config/
│       │   ├── db.js              # PostgreSQL client connection pool
│       │   └── init_db.js         # DDL migrations and Super Admin auto-seeding
│       ├── controllers/           # Request handlers and business logic
│       │   ├── admincontroller.js
│       │   ├── applicationcontroller.js
│       │   ├── authcontroller.js
│       │   ├── candidatecontroller.js
│       │   ├── companycotroller.js
│       │   └── jobcontroller.js
│       ├── middleware/            # Auth, RBAC, rate-limiting, error & upload handlers
│       ├── models/                # Direct PostgreSQL data access layer
│       ├── routes/                # Modular Express route definitions
│       ├── services/              # Third-party integrations (ImageKit)
│       └── validators/            # Joi/custom request payload validators
│
└── frontend/                      # React SPA client
    ├── index.html                 # HTML shell with CareerBridge favicon
    ├── vite.config.js             # Vite configuration with `/api` proxy
    ├── package.json               # Frontend dependencies and scripts
    ├── .env                       # Frontend environment configuration
    └── src/
        ├── App.jsx                # Route registry & role-based DashboardRouter
        ├── main.jsx               # React DOM root entry
        ├── context/
        │   └── AuthContext.jsx    # Session state, login, register, and logout
        ├── services/
        │   └── api.js             # Centralized API service methods (Auth, Jobs, Admin, etc.)
        ├── pages/
        │   ├── LandingPage.jsx        # Public home & job search discovery
        │   ├── SignInPage.jsx         # Authentication portal with Admin helper
        │   ├── SignUpPage.jsx         # Candidate & Recruiter registration
        │   ├── CandidateDashboard.jsx # Candidate workspace
        │   ├── RecruiterDashboard.jsx # Recruiter hiring portal
        │   └── AdminDashboard.jsx     # Super Admin governance workspace
        └── components/
            ├── admin/             # Admin sidebar, navbar, tables & moderation modals
            ├── candidate/         # Profile management & application components
            ├── common/            # Reusable BrandLogo and UI utilities
            ├── dashboard/         # Stats cards, job cards, apply modal
            ├── layout/            # Public Header Navbar & Footer
            └── recruiter/         # Job creation modal, company profile modal, applicant lists
```

---

## Getting Started & Local Setup

### Prerequisites
- **Node.js**: `v18.x` or later (tested on v20 and v24)
- **npm**: `v9.x` or later
- **PostgreSQL**: `v14.x` or higher running locally or hosted on Cloud (e.g. Supabase, Neon)

---

### 1. Backend Setup & Database Initialization

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure your `backend/.env` file:
   ```env
   PORT=3000
   DB_HOST=localhost
   DB_PORT=5432
   DB_USER=postgres
   DB_PASSWORD=your_postgres_password
   DB_NAME=career_bridge_db

   JWT_SECRET=your_super_secret_jwt_key
   IMAGEKIT_PRIVATE_KEY=your_imagekit_private_key
   NODE_ENV=development

   # Designated Super Admin Credentials
   ADMIN_EMAIL=admin@careerbridge.com
   ADMIN_PASSWORD=Admin@123
   ADMIN_NAME=Platform Admin
   ```

4. Create the PostgreSQL database (if not already created):
   ```sql
   CREATE DATABASE career_bridge_db;
   ```

5. Run database schema initialization and seed the default Super Admin:
   ```bash
   node src/config/init_db.js
   ```
   *Output: `Database tables verified/created successfully.` and `Default admin user initialized successfully (admin@careerbridge.com)`.*

6. Start the backend development server:
   ```bash
   npm run dev
   # Server runs on http://localhost:3000
   ```

---

### 2. Frontend Setup

1. Open a new terminal and navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Verify your `frontend/.env` file:
   ```env
   VITE_API_URL=http://localhost:3000/api
   VITE_BACKEND_URL=http://localhost:3000
   ```

4. Start the Vite development server:
   ```bash
   npm run dev
   # Vite development server runs at http://localhost:5173
   ```

---

### 3. Running the Complete Application

Open your browser and visit:
- **Landing Page**: [http://localhost:5173](http://localhost:5173)
- **Sign In Page**: [http://localhost:5173/signin](http://localhost:5173/signin)
- **Sign Up Page**: [http://localhost:5173/signup](http://localhost:5173/signup)

---

## Administrative Access & Security Architecture

### Why Admin Is Not a Public Signup Option
In accordance with production security standards, the public registration page (`/signup`) only allows users to register as a **Candidate** or a **Recruiter**. General visitors cannot select the "Admin" role or elevate their own privileges.

### Default Super Admin Credentials
The database initialization script automatically provisions the platform administrator:

| Attribute | Value |
| :--- | :--- |
| **Email** | `admin@careerbridge.com` |
| **Password** | `Admin@123` |
| **Role** | `admin` |
| **Workspace URL** | `/admin/dashboard` |

> **Pro Tip**: On the Sign In page (`/signin`), you can click the **"admin@careerbridge.com"** quick-fill button to populate the credentials immediately for evaluation.

### Administrative Capabilities
1. **User Account Moderation**:
   - Filter users by role (`Candidate`, `Recruiter`, `Admin`) and status (`Active`, `Blocked`).
   - Inspect complete user profiles and timestamps.
   - Block / Unblock accounts with instant session invalidation.
   - Self-blocking guard: Active administrators cannot suspend their own account.
2. **Requisition Moderation**:
   - Audit all jobs published across any verified recruiter or organization.
   - Inspect compensation, required skill stacks, and complete descriptions.
   - Delete inappropriate or expired listings with permanent cascading database cleanup.

---

## Complete API Endpoints Reference

Base URL: `http://localhost:3000/api`

### Authentication (`/api/auth`)
| Method | Endpoint | Protected | Role | Description |
| :--- | :--- | :---: | :---: | :--- |
| `POST` | `/auth/register` | No | Public | Register new Candidate or Recruiter (Admin email auto-assigned) |
| `POST` | `/auth/login` | No | Public | Authenticate user, set HTTP cookie & return JWT token |
| `GET` | `/auth/me` | Yes | Any | Return profile of the currently authenticated user |
| `POST` | `/auth/logout` | Yes | Any | Clear session cookie and invalidate client state |

### Candidate Profile (`/api/candidate`)
| Method | Endpoint | Protected | Role | Description |
| :--- | :--- | :---: | :---: | :--- |
| `GET` | `/candidate/getprofile` | Yes | `candidate` | Fetch authenticated candidate's profile |
| `POST` | `/candidate/createprofile`| Yes | `candidate` | Create new candidate profile with bio, skills & experience |
| `PUT` | `/candidate/updateprofile`| Yes | `candidate` | Update existing profile |
| `POST` | `/candidate/uploadresume` | Yes | `candidate` | Upload PDF/DOCX resume file to ImageKit storage |

### Company Management (`/api/company`)
| Method | Endpoint | Protected | Role | Description |
| :--- | :--- | :---: | :---: | :--- |
| `GET` | `/company/getcompany` | Yes | `recruiter` | Fetch company profile linked to the recruiter |
| `POST` | `/company/createcompany` | Yes | `recruiter` | Register organization details and upload company logo |
| `PUT` | `/company/updatecompany` | Yes | `recruiter` | Update organization profile |

### Job Postings (`/api/jobs`)
| Method | Endpoint | Protected | Role | Description |
| :--- | :--- | :---: | :---: | :--- |
| `GET` | `/jobs/getalljobs` | No | Public | Fetch all published requisitions with company metadata |
| `GET` | `/jobs/getjob/:id` | No | Public | Fetch details for a specific requisition |
| `POST` | `/jobs/createjob` | Yes | `recruiter` | Publish a new job opening |
| `PUT` | `/jobs/updateajob/:id` | Yes | `recruiter` | Update an existing job opening |
| `DELETE` | `/jobs/deletejob/:id` | Yes | `recruiter` | Delete job requisition |

### Applications (`/api/applications`)
| Method | Endpoint | Protected | Role | Description |
| :--- | :--- | :---: | :---: | :--- |
| `POST` | `/applications/applyforjob`| Yes | `candidate` | Submit job application with cover letter |
| `GET` | `/applications/myapplication`| Yes | `candidate`| List candidate's submitted applications |
| `GET` | `/applications/job/:id` | Yes | `recruiter` | View all applicants for a specific requisition |
| `PUT` | `/applications/:id/status`| Yes | `recruiter` | Update applicant status (e.g. `shortlisted`, `rejected`) |

### Administration (`/api/admin`)
| Method | Endpoint | Protected | Role | Description |
| :--- | :--- | :---: | :---: | :--- |
| `GET` | `/admin/users` | Yes | `admin` | List all platform users with role and standing |
| `GET` | `/admin/users/:id` | Yes | `admin` | Fetch user profile details by ID |
| `PUT` | `/admin/users/:id/block` | Yes | `admin` | Suspend user account (prevents login) |
| `PUT` | `/admin/users/:id/unblock` | Yes | `admin` | Restore suspended user account |
| `GET` | `/admin/jobs` | Yes | `admin` | List all platform jobs across all recruiters |
| `DELETE` | `/admin/jobs/:id` | Yes | `admin` | Permanently remove job posting |

---

## Quality Assurance & Verification

- **Frontend Linter**: `npm run lint --prefix "frontend"` verifies code health with 0 errors.
- **Production Build**: `npm run build --prefix "frontend"` creates optimized production bundles.
- **Database Schema**: Guaranteed data integrity through foreign-key cascades across users, files, candidate profiles, companies, jobs, and applications.
