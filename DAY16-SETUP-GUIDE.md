# 🚀 DAY 16: PRODUCTION SETUP GUIDE
**Date**: March 12, 2026  
**Duration**: 8 hours  
**Goal**: Configure production environment and database

---

## 📋 Overview

DAY 16 focuses on setting up the production infrastructure:
1. ✅ Neon production database
2. ✅ Railway/Render backend hosting
3. ✅ Vercel frontend hosting
4. ✅ Environment variables documentation

**Expected Outcome**: All services configured and ready for deployment on DAY 18.

---

## ⏱️ Time Breakdown

| Task | Duration | Priority |
|------|----------|----------|
| 1. Neon Database Setup | 2 hours | HIGH |
| 2. Backend Hosting Setup | 2 hours | HIGH |
| 3. Frontend Hosting Setup | 1.5 hours | HIGH |
| 4. Environment Variables | 1.5 hours | HIGH |
| 5. Documentation & Testing | 1 hour | MEDIUM |

**Total**: 8 hours

---

## 🗄️ TASK 1: NEON DATABASE SETUP (2 hours)

### Step 1.1: Create Neon Account (10 min)

1. Go to [https://console.neon.tech](https://console.neon.tech)
2. Sign up with GitHub account (recommended for OAuth)
3. Verify email address
4. Complete onboarding questionnaire

### Step 1.2: Create Production Project (15 min)

1. Click "Create a project"
2. **Project Name**: `edu-lms-production`
3. **Database Name**: `edu_lms_prod`
4. **Region**: Choose closest to your users
   - 🇺🇸 US East (Ohio) - `us-east-2`
   - 🇪🇺 Europe (Frankfurt) - `eu-central-1`
   - 🇸🇬 Asia Pacific (Singapore) - `ap-southeast-1`
5. **Postgres Version**: 15 (latest stable)
6. **Compute Size**: 
   - Free tier: 0.25 vCPU, 1 GB RAM (sufficient for pilot)
   - Upgrade path: Scale during DAY 25 if needed

### Step 1.3: Configure Connection Pooling (10 min)

1. In Neon Console, go to "Connection Details"
2. Enable **Connection Pooling**
3. Note two connection strings:
   - **Pooled** (for Prisma Client): `DATABASE_URL`
   - **Direct** (for Prisma Migrate): `DIRECT_URL`

**Example**:
```
Pooled:  postgresql://user:pass@ep-xxxx-pooler.us-east-2.aws.neon.tech/edu_lms_prod?sslmode=require
Direct:  postgresql://user:pass@ep-xxxx.us-east-2.aws.neon.tech/edu_lms_prod?sslmode=require
```

### Step 1.4: Configure Auto-Suspend (5 min)

1. Go to "Settings" → "Compute"
2. **Auto-suspend delay**: 5 minutes
3. **Auto-start**: Enabled
4. This saves costs during idle periods

### Step 1.5: Enable Point-in-Time Recovery (10 min)

1. Go to "Settings" → "Backup & Recovery"
2. Enable **Point-in-Time Recovery (PITR)**
3. **Retention Period**: 7 days (recommended)
4. This allows restoring database to any point in last 7 days

### Step 1.6: Test Connection (15 min)

**Option A: Using Prisma CLI**
```bash
# In packages/database directory
cd packages/database

# Create temporary .env file
echo 'DATABASE_URL="postgresql://user:pass@host/edu_lms_prod?sslmode=require"' > .env.temp

# Test connection
DATABASE_URL="postgresql://..." pnpm prisma db pull

# Should output: "Introspected X models" or "Database is empty"
```

**Option B: Using psql (if installed)**
```bash
psql "postgresql://user:pass@host/edu_lms_prod?sslmode=require"

# Should connect successfully
# Run: \dt   (to show tables - will be empty)
# Run: \q    (to quit)
```

### Step 1.7: Store Connection Strings (10 min)

1. Copy both connection strings
2. Store in password manager (1Password, LastPass, Bitwarden)
   - Entry name: "EDU LMS Production Database"
   - Fields:
     - `DATABASE_URL` (pooled)
     - `DIRECT_URL` (direct)
     - Neon project ID
     - Neon endpoint ID
3. **NEVER** commit to Git!

### Step 1.8: Create Staging Database (Optional, 25 min)

Repeat steps 1.2-1.7 for staging:
- **Project Name**: `edu-lms-staging`
- **Database Name**: `edu_lms_staging`
- Same configuration as production

**Why staging?**
- Test migrations before production
- Test features with production-like data
- Safe environment for experiments

### ✅ Task 1 Checklist

- [ ] Neon account created and verified
- [ ] Production project created: `edu-lms-production`
- [ ] Connection pooling enabled
- [ ] Both connection strings (pooled + direct) obtained
- [ ] Auto-suspend configured (5 minutes)
- [ ] PITR enabled (7-day retention)
- [ ] Connection tested successfully
- [ ] Credentials stored in password manager
- [ ] (Optional) Staging database created

---

## 🚂 TASK 2: RAILWAY BACKEND SETUP (2 hours)

### Option A: Railway (Recommended)

#### Step 2.1: Create Railway Account (10 min)

1. Go to [https://railway.app](https://railway.app)
2. Sign up with GitHub account
3. Connect Railway to your GitHub repository
4. Verify email address

#### Step 2.2: Create New Project (15 min)

1. Click "New Project"
2. Select "Deploy from GitHub repo"
3. Choose repository: `EDU_PROJECT_LMS`
4. **Service Name**: `edu-lms-backend-prod`
5. Railway will auto-detect the project (may need configuration)

#### Step 2.3: Configure Build Settings (20 min)

1. In Railway dashboard, select your service
2. Go to "Settings" tab
3. Configure:

**Root Directory**: `/` (leave as monorepo root)

**Build Command**:
```bash
cd apps/backend && pnpm install && pnpm build
```

**Start Command**:
```bash
cd apps/backend && pnpm start:prod
```

**Watch Paths**: `apps/backend/**`

#### Step 2.4: Set Environment Variables (30 min)

1. Go to "Variables" tab
2. Click "Add Variable"
3. Add each variable:

```env
NODE_ENV=production
PORT=3001
DATABASE_URL=postgresql://[from-neon-pooled]
DIRECT_URL=postgresql://[from-neon-direct]
JWT_SECRET=[generate-64-char-secret]
JWT_EXPIRATION=24h
CORS_ORIGIN=https://[your-vercel-url].vercel.app
GRAPHQL_PLAYGROUND=false
GRAPHQL_INTROSPECTION=false
LOG_LEVEL=info
```

**Generate JWT_SECRET**:
```powershell
# PowerShell - Run this and copy result
-join ((48..57) + (65..90) + (97..122) | Get-Random -Count 64 | % {[char]$_})
```

4. **Save** each variable
5. Store `JWT_SECRET` in password manager immediately

#### Step 2.5: Configure Health Check (10 min)

1. Go to "Settings" → "Health Check"
2. **Health Check Path**: `/health`
3. **Health Check Timeout**: 30 seconds
4. **Restart Policy**: On failure
5. Enable "Auto-restart on crash"

#### Step 2.6: Configure Custom Domain (Optional, 20 min)

1. Go to "Settings" → "Domains"
2. Click "Generate Domain"
3. Railway provides: `xxx.up.railway.app`
4. (Optional) Add custom domain:
   - Add your domain: `api.edu-lms.com`
   - Configure DNS CNAME record
   - Wait for SSL certificate (automatic)

#### Step 2.7: Deploy (15 min)

1. **DO NOT deploy yet** - wait for DAY 18
2. But you can test the configuration:
   - Click "Deploy" to trigger build
   - Monitor build logs
   - If successful, service will start
   - Test: `curl https://[your-url].up.railway.app/health`
   - Then stop the service (to save resources)

---

### Option B: Render (Alternative)

If you prefer Render over Railway:

#### Step 2.1: Create Render Account

1. Go to [https://render.com](https://render.com)
2. Sign up with GitHub
3. Connect to repository

#### Step 2.2: Create Web Service

1. Click "New +" → "Web Service"
2. Connect repository: `EDU_PROJECT_LMS`
3. **Name**: `edu-lms-backend-prod`
4. **Region**: Choose closest to your users
5. **Branch**: `main`
6. **Root Directory**: `apps/backend`
7. **Runtime**: Node
8. **Build Command**: `pnpm install && pnpm build`
9. **Start Command**: `pnpm start:prod`
10. **Plan**: Free (or Starter $7/month)

#### Step 2.3: Configure Environment

Add same environment variables as Railway (see Step 2.4 above)

#### Step 2.4: Configure Health Check

- **Health Check Path**: `/health`
- Enable auto-deploy on push to main

---

### ✅ Task 2 Checklist

- [ ] Railway/Render account created
- [ ] GitHub repository connected
- [ ] Backend service created
- [ ] Build commands configured
- [ ] All environment variables set (11+ variables)
- [ ] JWT_SECRET generated and stored
- [ ] Health check endpoint configured
- [ ] Service URL obtained
- [ ] (Optional) Custom domain configured
- [ ] Build tested (then stopped to save resources)

---

## 🎨 TASK 3: VERCEL FRONTEND SETUP (1.5 hours)

### Step 3.1: Create Vercel Account (10 min)

1. Go to [https://vercel.com](https://vercel.com)
2. Sign up with GitHub account
3. Authorize Vercel to access repositories
4. Complete onboarding

### Step 3.2: Import Project (15 min)

1. Click "Add New…" → "Project"
2. Import Git Repository: `EDU_PROJECT_LMS`
3. **Framework Preset**: Next.js (auto-detected)
4. **Root Directory**: `apps/frontend`
5. Click "Continue"

### Step 3.3: Configure Build Settings (15 min)

**Build Command**:
```bash
cd apps/frontend && pnpm install && pnpm build
```

**Output Directory**: `apps/frontend/.next`

**Install Command**: `pnpm install`

**Development Command**: `pnpm dev` (optional)

### Step 3.4: Set Environment Variables (25 min)

1. In project settings, go to "Environment Variables"
2. Add variables:

```env
# Required
NEXT_PUBLIC_API_URL=https://[your-railway-url].up.railway.app/graphql
NEXT_PUBLIC_APP_NAME=EDU LMS
NODE_ENV=production

# Optional
NEXT_PUBLIC_APP_URL=https://[your-project].vercel.app
NEXT_PUBLIC_ENABLE_ANALYTICS=false
```

3. **Select Environments**:
   - ✅ Production
   - ✅ Preview
   - ✅ Development

4. Click "Save"

**Important**: You'll update `NEXT_PUBLIC_API_URL` after Railway deployment (DAY 18)

### Step 3.5: Configure Domains (10 min)

1. Go to "Settings" → "Domains"
2. Vercel auto-assigns: `[project-name].vercel.app`
3. (Optional) Add custom domain:
   - Add domain: `edu-lms.com` or `www.edu-lms.com`
   - Configure DNS records
   - Wait for SSL verification (automatic)

### Step 3.6: Deploy to Production (15 min)

1. **DO NOT deploy yet** - wait for DAY 18
2. But verify configuration:
   - Click "Deploy" to test build
   - Monitor build logs
   - Ensure no errors
   - Preview deployment (will have CORS issues until backend deployed)
   - Can delete this test deployment

### Step 3.7: Configure Framework Settings (Optional, 10 min)

1. Go to "Settings" → "Functions"
2. **Function Region**: Same as Railway (e.g., `iad1` for US East)
3. **Serverless Function Timeout**: 10 seconds
4. **Edge Network**: Enabled (CDN for static assets)

### ✅ Task 3 Checklist

- [ ] Vercel account created
- [ ] Project imported from GitHub
- [ ] Build commands configured correctly
- [ ] All environment variables set
- [ ] Production environment selected
- [ ] Project URL obtained
- [ ] (Optional) Custom domain configured
- [ ] Build tested successfully
- [ ] No deployment errors in logs

---

## 📝 TASK 4: ENVIRONMENT DOCUMENTATION (1.5 hours)

### Step 4.1: Create .env.example Files (20 min)

Create template files (without real secrets):

**Root `.env.example`:**
```env
# Database (get from Neon)
DATABASE_URL="postgresql://username:password@host/database?sslmode=require"

# JWT (generate secure secret)
JWT_SECRET="your-64-character-secret-here"
JWT_EXPIRATION="24h"

# Backend
NODE_ENV="production"
PORT=3001
```

**`apps/backend/.env.example`:**
```env
DATABASE_URL="postgresql://..."
DIRECT_URL="postgresql://..."
JWT_SECRET="..."
JWT_EXPIRATION="24h"
NODE_ENV="production"
PORT=3001
CORS_ORIGIN="https://your-frontend.vercel.app"
GRAPHQL_PLAYGROUND=false
LOG_LEVEL="info"
```

**`apps/frontend/.env.example`:**
```env
NEXT_PUBLIC_API_URL="https://your-backend.up.railway.app/graphql"
NEXT_PUBLIC_APP_NAME="EDU LMS"
NODE_ENV="production"
```

**`packages/database/.env.example`:**
```env
DATABASE_URL="postgresql://username:password@host/database?sslmode=require"
```

### Step 4.2: Update .gitignore (10 min)

Ensure `.gitignore` includes:

```gitignore
# Environment variables
.env
.env.local
.env.production
.env.development
.env.test
.env*.local

# Vercel
.vercel

# Railway
.railway

# Sensitive files
*.pem
*.key
credentials.json
```

### Step 4.3: Document Secrets in Password Manager (30 min)

Create entries in 1Password/LastPass/Bitwarden:

**Entry 1: "EDU LMS - Neon Database"**
```
DATABASE_URL (pooled): postgresql://...
DIRECT_URL: postgresql://...
Neon Project ID: xxx-xxx-xxx
Neon Endpoint: ep-xxx-xxx
Region: us-east-2
```

**Entry 2: "EDU LMS - JWT Secret"**
```
JWT_SECRET: [64-char-secret]
JWT_EXPIRATION: 24h
Generated: 2026-03-12
Next Rotation: 2026-06-12
```

**Entry 3: "EDU LMS - Service URLs"**
```
Frontend: https://[project].vercel.app
Backend: https://[project].up.railway.app
GraphQL: https://[project].up.railway.app/graphql
Health: https://[project].up.railway.app/health
```

**Entry 4: "EDU LMS - Admin Credentials"** (will create on DAY 18)
```
Admin Email: admin@lms-abk.com
Admin Password: [secure-password]
Teacher 1: guru@lms-abk.com
Teacher 2: guru2@lms-abk.com
```

### Step 4.4: Create Deployment Checklist (20 min)

See `DEPLOYMENT-CHECKLIST.md` (will create in Task 5)

### Step 4.5: Update ENVIRONMENT-VARIABLES.md (10 min)

Fill in actual values (without committing):

1. Open `ENVIRONMENT-VARIABLES.md`
2. Create a local copy: `ENVIRONMENT-VARIABLES.PROD.md`
3. Fill in real values
4. Add to `.gitignore`:
   ```gitignore
   ENVIRONMENT-VARIABLES.PROD.md
   ```
5. Store this file in password manager as secure note

### ✅ Task 4 Checklist

- [ ] `.env.example` files created (4 files)
- [ ] `.gitignore` updated
- [ ] All secrets documented in password manager (4 entries)
- [ ] Service URLs documented
- [ ] `ENVIRONMENT-VARIABLES.PROD.md` created (local only)
- [ ] No secrets committed to Git (verified)

---

## 📚 TASK 5: FINAL DOCUMENTATION (1 hour)

### Step 5.1: Create Deployment Checklist (20 min)

Create `DEPLOYMENT-CHECKLIST.md`:

```markdown
# Deployment Checklist

## Pre-Deployment
- [ ] Neon database configured
- [ ] Railway backend configured
- [ ] Vercel frontend configured
- [ ] All environment variables set
- [ ] Secrets stored in password manager
- [ ] .env files in .gitignore
- [ ] Build tested locally

## Deployment Day (DAY 18)
- [ ] Run database migrations
- [ ] Deploy backend to Railway
- [ ] Test backend health endpoint
- [ ] Deploy frontend to Vercel
- [ ] Test frontend loads
- [ ] Run comprehensive test suite
- [ ] Fix any issues

## Post-Deployment
- [ ] Monitor error rates
- [ ] Verify all features working
- [ ] Set up monitoring (Sentry)
- [ ] Configure alerts
- [ ] Document any issues
```

### Step 5.2: Create Quick Start Guide (20 min)

Create `PRODUCTION-QUICK-START.md`:

```markdown
# Production Quick Start

## Service URLs
- Frontend: https://[project].vercel.app
- Backend: https://[project].up.railway.app
- GraphQL: https://[project].up.railway.app/graphql
- Health: https://[project].up.railway.app/health

## Common Commands

### Test Backend Health
```bash
curl https://[backend-url]/health
```

### Run Migrations
```bash
DATABASE_URL="..." pnpm prisma migrate deploy
```

### Test GraphQL
```bash
curl -X POST https://[backend-url]/graphql \
  -H "Content-Type: application/json" \
  -d '{"query": "{ __typename }"}'
```

## Emergency Contacts
- Railway Dashboard: https://railway.app/dashboard
- Vercel Dashboard: https://vercel.com/dashboard
- Neon Console: https://console.neon.tech
```

### Step 5.3: Test Local Development (15 min)

Verify local setup still works:

```bash
# Backend
cd apps/backend
pnpm dev

# Should start on http://localhost:3001

# Frontend (new terminal)
cd apps/frontend
pnpm dev

# Should start on http://localhost:3000
```

### Step 5.4: Commit Configuration Files (5 min)

```bash
git add .env.example apps/backend/.env.example apps/frontend/.env.example
git add ENVIRONMENT-VARIABLES.md
git add DAY16-SETUP-GUIDE.md
git add DEPLOYMENT-CHECKLIST.md
git add PRODUCTION-QUICK-START.md
git commit -m "DAY 16: Add production environment configuration"
git push origin main
```

**Verify**: No secrets committed!

---

## ✅ DAY 16 COMPLETION CHECKLIST

### Infrastructure Setup
- [ ] Neon production database created and configured
- [ ] Railway/Render backend service created
- [ ] Vercel frontend project created
- [ ] All environment variables configured
- [ ] Health checks configured
- [ ] Auto-scaling/restart configured

### Security
- [ ] Strong JWT secret generated (64+ chars)
- [ ] All secrets stored in password manager
- [ ] No secrets committed to Git
- [ ] CORS configured correctly
- [ ] SSL/TLS enabled on all services
- [ ] GraphQL playground disabled in production

### Documentation
- [ ] `ENVIRONMENT-VARIABLES.md` created
- [ ] `.env.example` files created (4 files)
- [ ] Secrets documented in password manager
- [ ] Service URLs documented
- [ ] `DEPLOYMENT-CHECKLIST.md` created
- [ ] `PRODUCTION-QUICK-START.md` created

### Testing
- [ ] Database connection tested
- [ ] Build commands tested
- [ ] Local development still works
- [ ] No errors in configuration

### Next Steps
- [ ] Ready for DAY 17 (Documentation)
- [ ] Ready for DAY 18 (Deployment)

---

## 📊 Expected Outcomes

After completing DAY 16, you should have:

1. **Neon Database**: 
   - ✅ Production database ready
   - ✅ Connection pooling enabled
   - ✅ PITR enabled for backups
   - ✅ Credentials stored securely

2. **Railway Backend**:
   - ✅ Service configured
   - ✅ Build/start commands set
   - ✅ 11+ environment variables configured
   - ✅ Health check enabled
   - ✅ Ready to deploy (DAY 18)

3. **Vercel Frontend**:
   - ✅ Project configured
   - ✅ Build settings correct
   - ✅ Environment variables set
   - ✅ Ready to deploy (DAY 18)

4. **Documentation**:
   - ✅ All configuration documented
   - ✅ Secrets safely stored
   - ✅ Deployment checklist ready
   - ✅ Quick start guide created

---

## 🚨 Common Issues & Solutions

### Issue 1: Neon Connection Fails

**Error**: `ECONNREFUSED` or `Connection timeout`

**Solution**:
1. Verify connection string format
2. Ensure `sslmode=require` is present
3. Check Neon project not suspended
4. Try direct connection (non-pooled) for testing

### Issue 2: Railway Build Fails

**Error**: `Command not found` or `ENOENT`

**Solution**:
1. Verify `pnpm` is detected (Railway should auto-detect from `pnpm-lock.yaml`)
2. Check build command has correct path: `cd apps/backend && ...`
3. Ensure `package.json` has `build` script
4. Check Railway logs for specific error

### Issue 3: Vercel Build Fails

**Error**: `Module not found` or build timeout

**Solution**:
1. Verify root directory is `apps/frontend`
2. Check `next.config.js` has correct configuration
3. Ensure all dependencies in `package.json`
4. Increase build timeout if needed (Settings → Functions)

### Issue 4: Environment Variables Not Loading

**Solution**:
1. Verify variable names match exactly (case-sensitive)
2. Check no extra spaces in values
3. Restart service after adding variables
4. For NEXT_PUBLIC_* vars, must redeploy frontend

---

## 🎉 Congratulations!

If all checklists are complete, you've successfully configured the production environment! 🎊

**Time spent**: ~8 hours  
**Progress**: 16/20 days (80% to launch)

**Next**: DAY 17 - Complete user documentation and API docs

---

*Created: March 12, 2026*  
*Last Updated: March 12, 2026*
