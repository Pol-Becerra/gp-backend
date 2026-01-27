# Guía PyMES

Plataforma de gestión de PYMES, Negocios y Profesionales.

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Styling:** Tailwind CSS + ShadcnUI
- **Database & Auth:** Supabase (PostgreSQL + GoTrue)
- **Charts:** Recharts
- **Deployment:** Docker for Dokploy

## Getting Started

### 1. Clone and Install

```bash
npm install
```

### 2. Configure Supabase

1. Create a project at [supabase.com](https://supabase.com)
2. Copy `.env.example` to `.env.local` and fill in your credentials:

```bash
cp .env.example .env.local
```

### 3. Setup Database (Self-hosted on Dokploy)

1. Access your Supabase Studio at your domain (provided in your Dokploy config).
2. Go to the **SQL Editor**.
3. Execute `supabase/schema.sql` to create the tables, types, and RLS policies.
4. Register a user in the application (go to `/register`).
5. Execute `supabase/seed.sql` to populate the application with sample data (PyMES, Categories, etc.).

> [!NOTE]
> Since you are using a self-hosted instance, ensure the `API_EXTERNAL_URL` in your Supabase config matches the `NEXT_PUBLIC_SUPABASE_URL` in your `.env.local`.

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Project Structure

```
/
├── src/
│   ├── app/
│   │   ├── (auth)/          # Login/Register pages
│   │   ├── (dashboard)/     # Protected dashboard pages
│   │   └── actions/         # Server Actions
│   ├── components/
│   │   ├── ui/              # ShadcnUI components
│   │   ├── dashboard/       # Dashboard components
│   │   ├── forms/           # Form components
│   │   └── shared/          # Shared components
│   └── lib/
│       ├── supabase/        # Supabase clients
│       └── utils.ts         # Utilities
├── supabase/
│   ├── schema.sql           # Database schema
│   └── seed.sql             # Sample data
└── Dockerfile               # Docker for Dokploy
```

## Features

- ✅ Authentication (Email/Password)
- ✅ Dashboard with charts
- ✅ CRUD for Entities (PyMES, Businesses, Professionals)
- ✅ Nested Categories
- ✅ Contacts Management
- ✅ Configuration Page (Settings)
- ✅ Automatic Audit Logging
- ✅ Row Level Security (RLS)
- ✅ Dark Theme UI

## Deployment (Dokploy)

1. Push your code to a Git repository
2. In Dokploy, create a new application
3. Set environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
4. Deploy!
