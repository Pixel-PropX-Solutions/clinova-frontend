# Clinova

A multi-tenant clinic management frontend built with Next.js (App Router), TypeScript, Material UI, React Query, and Zustand.

The app supports:

- Role-based access (Admin and Clinic User)
- Clinic onboarding and status management
- OPD registration and repeat-patient lookup
- Visit history and visit-level deletion
- Analytics dashboard with date-range filtering
- PDF/parchi generation using HTML templates
- Clinic profile and template settings

## Tech Stack

- Next.js 15 (App Router)
- React 19 + TypeScript
- Material UI (MUI)
- TanStack React Query
- Zustand (persisted auth state)
- Axios
- Recharts
- React Date Range + date-fns
- React Toastify
- Puppeteer Core + Sparticuz Chromium (for server-side PDF rendering route)

## Project Structure

```text
src/
	app/
		page.tsx                         # Login entry route
		admin/                           # Admin area (clinic + template management)
		dashboard/                       # Clinic user area
			patients/                      # OPD form, patient list, patient profile
			settings/                      # Profile, templates, security
		api/pdf/route.ts                 # Next API route: HTML -> PDF
	hooks/api/                         # API domain hooks (auth, patients, visits, etc.)
	lib/                               # Axios client, PDF helpers, Mongo helper
	store/authStore.ts                 # Zustand auth state with local persistence
	providers/query-provider.tsx       # React Query provider
	context/auth.tsx                   # App auth bootstrap + route guarding
```

## Routing Overview

- `/` -> login page
- `/admin` -> clinics management
- `/admin/templates` -> template management
- `/dashboard` -> analytics and export actions
- `/dashboard/patients` -> OPD registration and print flow
- `/dashboard/patients/list` -> paginated/sortable patient listing
- `/dashboard/patients/[id]` -> patient profile + visit history
- `/dashboard/settings` -> clinic profile, template default, password updates

## Authentication and Authorization Flow

- Login uses `POST /auth/login`.
- Access token is stored in Zustand (persisted in `auth-storage`).
- Axios request interceptor injects `Authorization: Bearer <token>`.
- On `401`, Axios response interceptor attempts `POST /auth/refresh`.
- If refresh fails, user is logged out and redirected to `/`.
- Root auth provider redirects based on role:
  - `admin` -> `/admin`
  - clinic user -> `/dashboard`

## Backend API Dependencies

This frontend expects a backend API available at `NEXT_PUBLIC_API_URL`.

Endpoints used by the app include:

- Auth
  - `POST /auth/login`
  - `POST /auth/logout`
  - `POST /auth/refresh`
  - `POST /auth/forgot-password`
- Clinics/Admin
  - `GET /clinics/`
  - `POST /clinics/`
  - `PATCH /clinics/{id}`
  - `GET /clinics/{id}/stats`
  - `POST /clinics/{id}/upload-logo`
- Dashboard
  - `GET /dashboard/stats?start_date=&end_date=`
  - Export links opened directly from dashboard:
    - `/export/bills?format=xlsx&start_date=&end_date=`
    - `/export/patients?format=xlsx&start_date=&end_date=`
- Patients and Visits
  - `GET /patients/search?phone=`
  - `POST /patients/`
  - `GET /patients/` (pagination + sorting)
  - `GET /patients/{id}/profile`
  - `POST /visits/`
  - `DELETE /visits/{id}`
- Templates and PDF
  - `GET /templates/`
  - `GET /templates/admin`
  - `POST /templates/admin`
  - `PATCH /templates/admin/{id}`
  - `DELETE /templates/admin/{id}`
  - `GET /pdf/content/{visitId}/{templateId}`
- Clinic Settings
  - `GET /settings/profile`
  - `PATCH /settings/profile`
  - `POST /settings/upload-logo`
  - `POST /settings/change-password`
  - `POST /settings/default-template`

## PDF Generation Flow

Two-step generation is used:

1. Fetch rendered HTML from backend (`/pdf/content/{visitId}/{templateId}`).
2. Send HTML to Next route (`POST /api/pdf`) where Puppeteer generates a PDF blob.

The API route includes local executable fallback paths for Chrome/Edge on Windows development environments.

## Environment Variables

Create `.env.local` in project root:

```bash
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
MONGODB_URI=mongodb://localhost:27017/your-db
```

Notes:

- `NEXT_PUBLIC_API_URL` is required for all API hooks.
- `MONGODB_URI` is required by `src/lib/mongodb.ts` when that helper is used.

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm (recommended, lockfile is `pnpm-lock.yaml`)

### Install

```bash
pnpm install
```

### Run Development Server

```bash
pnpm dev
```

Open http://localhost:3000.

### Build and Start

```bash
pnpm build
pnpm start
```

### Lint

```bash
pnpm lint
```

## Available Scripts

- `dev` -> `next dev --turbopack`
- `build` -> `next build`
- `start` -> `next start`
- `lint` -> `next lint`

## UI and Data Layer Notes

- React Query `staleTime` is set to 1 minute globally.
- React Query Devtools are enabled in the provider.
- Toast notifications are globally mounted in root layout.
- Local fonts (Geist Sans/Mono) are loaded from `src/app/fonts`.

## Known Notes From Current Codebase

- `src/container/DashBoard.tsx` appears to be a legacy/unused dashboard implementation.
- `src/hooks/handleform.tsx` posts to `/api` and may also be legacy.
- Global CSS currently sets only a base body font.

If these files are no longer needed, consider removing or documenting them as legacy modules.

## Deployment

This is a standard Next.js app and can be deployed to any Node-compatible platform (Vercel, self-hosted, containerized runtime, etc.).

Ensure production values for:

- `NEXT_PUBLIC_API_URL`
- `MONGODB_URI` (if used in production runtime)
