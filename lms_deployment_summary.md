# LMS ABK - Deployment & System Summary

## Architecture & Infrastructure
- **Backend**: NestJS (Monorepo setup using Turborepo)
- **Frontend**: Next.js (Vercel)
- **Database**: PostgreSQL (Supabase)
- **Hosting (Backend)**: Railway

## Database & Prisma Configuration
- **Supabase Pooler Issue**: Railway deployment blocked on `prisma migrate deploy` due to Supabase connection pooling (port `6543`).
- **Fix**: Updated `schema.prisma` to include `directUrl = env("DIRECT_URL")`. 
- **Railway Env Vars**:
  - `DATABASE_URL`: Uses connection pooling (port `6543`, `pgbouncer=true`).
  - `DIRECT_URL`: Direct connection (port `5432`) without pooling for migrations.
- **Migration Strategy**: Removed `npx prisma migrate deploy` from Dockerfile because Supabase Free Tier limits direct external database connections from cloud platforms like Railway. Migrations MUST be run locally (`npx prisma migrate dev`) and then pushed to GitHub.

## CORS Configuration
- Encountered CSRF & CORS blocking requests from Vercel (`*.vercel.app`).
- **Fix**: Updated `apps/backend/src/main.ts` to dynamically allow all origins ending with `.vercel.app`.
  - `if (origin.endsWith('.vercel.app')) return callback(null, true);`
- Local testing allowed on `http://localhost:3000`.

## User Management & Auth
- **Hash Issue**: Direct SQL inserts for users must use `bcrypt`. Plain text passwords will fail login.
- **Bcrypt Example**: `password123` -> `$2a$10$CkjkydyWGKwD8DogXM/ms.VCPQRYxbSxAoJmwazdw9snzZC2WcTMm`
- Target column in `users` table is `"passwordHash"`.

### Example Insert Query:
```sql
INSERT INTO users (id, email, "passwordHash", role, "teacherName", "isActive", "isVerified", "createdAt", "updatedAt")
VALUES (
  gen_random_uuid(),
  'guru@lms-abk.com',
  '$2a$10$CkjkydyWGKwD8DogXM/ms.VCPQRYxbSxAoJmwazdw9snzZC2WcTMm',
  'TEACHER',
  'Guru Test',
  true,
  true,
  NOW(),
  NOW()
);
```

## Useful URLs
- **Backend Health Check**: `https://edu-project-lms-production.up.railway.app/health`
- **GraphQL Playground**: `https://studio.apollographql.com/sandbox/explorer` (Target endpoint: `https://edu-project-lms-production.up.railway.app/graphql`)
- **Frontend App**: Deploy to Vercel and ensure `NEXT_PUBLIC_API_URL` is set to the Railway GraphQL endpoint.
