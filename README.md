# LMS untuk Anak Berkebutuhan Khusus

Learning Management System yang dirancang khusus untuk anak dengan hambatan intelektual.

## Tech Stack

- **Frontend**: Next.js 14 (App Router) + TypeScript + TailwindCSS + shadcn/ui
- **Backend**: NestJS + Prisma ORM + GraphQL
- **Database**: Neon.tech (PostgreSQL)
- **Cache**: Upstash (Redis)
- **Storage**: Cloudflare R2
- **Auth**: Supabase Auth
- **Email**: Resend
- **Monorepo**: Turborepo + pnpm workspaces

## Project Structure

```
apps/
  frontend/       # Next.js application
  backend/        # NestJS API
packages/
  database/       # Prisma schema & client
  types/          # Shared TypeScript types
  ui/             # Shared UI components
```

## Getting Started

### Prerequisites

- Node.js >= 18
- pnpm >= 8

### Installation

```bash
# Install dependencies
pnpm install

# Setup environment variables
cp .env.example .env
# Edit .env with your actual credentials

# Generate Prisma Client
pnpm db:generate

# Push database schema
pnpm db:push

# Start development servers
pnpm dev
```

### Development

```bash
# Run all apps in dev mode
pnpm dev

# Run specific app
pnpm --filter @lms/frontend dev
pnpm --filter @lms/backend dev

# Database commands
pnpm db:studio       # Open Prisma Studio
pnpm db:migrate      # Run migrations
pnpm db:generate     # Generate Prisma Client
pnpm db:push         # Push schema to database
```

## Features (Fase 1 - MVP)

- ✅ Authentication & Role Management (Teacher, Student-Parent)
- ✅ Content Management (Video, PDF, Images)
- ✅ Quiz System (Multiple Choice with Auto-grading)
- ✅ Task Analysis (Step-by-step with Photo + Video submission)
- ✅ Progress Tracking with Level/XP System
- ✅ Teacher Notes & Daily Reports
- ✅ Dashboard Enhancements (Parent view, Pending grading, Recent grades)
- ✅ Media Upload & Management (Cloudflare R2, Image/Video library)
- ✅ Email Notifications
- ✅ Responsive Design with Basic Accessibility

## Target Users (Pilot)

- 1 Guru
- 4 Siswa (Student-Parent combined accounts)
- 1 Classroom

## Deployment

### Production Deployment

**Recommended Stack:**
- **Backend**: [Render](https://render.com) (Free tier, stable)
- **Frontend**: [Vercel](https://vercel.com) (Free tier)
- **Database**: [Neon](https://neon.tech) PostgreSQL (Free,永久)
- **Storage**: [Cloudflare R2](https://cloudflare.com/r2) (Free tier)

### Quick Deploy (5 minutes)

```bash
# 1. Deploy backend to Render
See: RENDER-QUICK-START.md

# 2. Deploy frontend to Vercel
vercel --prod
```

For the Vercel project settings, keep the repository root as the project root and use the build command from `vercel.json`. Set these environment variables in Vercel:

- `NEXT_PUBLIC_API_URL` = your Railway backend base URL, for example `https://your-backend.up.railway.app`
- `NEXT_PUBLIC_APP_URL` = your Vercel domain, for example `https://your-project.vercel.app`

### Documentation

- 📖 **[Render Quick Start](./RENDER-QUICK-START.md)** - 5 minute setup
- 📖 **[Render Full Guide](./RENDER-DEPLOYMENT-GUIDE.md)** - Comprehensive guide
- 📖 **[Environment Variables](..env.template)** - All required env vars
- 📖 **[Railway Guide](./DEPLOYMENT-GUIDE.md)** - Alternative (legacy)

### Total Cost: **Rp 0/month** ✨

## License

Private - Educational Use Only
