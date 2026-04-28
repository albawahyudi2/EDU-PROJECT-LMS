# 🔐 ENVIRONMENT VARIABLES DOCUMENTATION
**Project**: EDU_PROJECT_LMS  
**Last Updated**: March 12, 2026  
**Security Level**: 🔴 CONFIDENTIAL

---

## ⚠️ SECURITY WARNING

**DO NOT** commit this file with real values to Git!  
Store actual secrets in:
- Password manager (1Password, LastPass, Bitwarden)
- Environment variable manager (Doppler, Vault)
- Secure notes

---

## 📋 Environment Configuration Matrix

| Variable | Development | Staging | Production |
|----------|-------------|---------|------------|
| NODE_ENV | development | staging | production |
| Database | Local/Neon Free | Neon Free | Neon Pro |
| Backend Host | localhost:3001 | Railway Staging | Railway Prod |
| Frontend Host | localhost:3000 | Vercel Preview | Vercel Prod |

---

## 🗄️ DATABASE CONFIGURATION

### Neon PostgreSQL Connection

#### Development (Local/Free Tier)
```env
DATABASE_URL="postgresql://username:password@ep-xxxx-xxxx.us-east-2.aws.neon.tech/edu_lms_dev?sslmode=require"
DIRECT_URL="postgresql://username:password@ep-xxxx-xxxx.us-east-2.aws.neon.tech/edu_lms_dev?sslmode=require"
```

#### Staging
```env
DATABASE_URL="postgresql://username:password@ep-xxxx-xxxx.us-east-2.aws.neon.tech/edu_lms_staging?sslmode=require"
DIRECT_URL="postgresql://username:password@ep-xxxx-xxxx.us-east-2.aws.neon.tech/edu_lms_staging?sslmode=require"
```

#### Production
```env
DATABASE_URL="postgresql://username:password@ep-xxxx-xxxx.us-east-2.aws.neon.tech/edu_lms_prod?sslmode=require&connection_limit=10"
DIRECT_URL="postgresql://username:password@ep-xxxx-xxxx.us-east-2.aws.neon.tech/edu_lms_prod?sslmode=require"
```

**Notes**:
- `DATABASE_URL`: Used by Prisma Client (connection pooling)
- `DIRECT_URL`: Used by Prisma Migrate (direct connection)
- `connection_limit=10`: Prevents connection exhaustion on free tier

**How to Get**:
1. Go to [Neon Console](https://console.neon.tech)
2. Create project: `edu-lms-production`
3. Copy connection string from dashboard
4. Replace `[user]:[password]@[endpoint]`

---

## 🔐 AUTHENTICATION & SECURITY

### JWT Configuration

#### Development
```env
JWT_SECRET="dev-secret-key-change-in-production-minimum-32-characters-long"
JWT_EXPIRATION="7d"
```

#### Production
```env
JWT_SECRET="[GENERATE-64-CHAR-RANDOM-STRING]"
JWT_EXPIRATION="24h"
```

**Generate Secure JWT Secret**:
```bash
# PowerShell
-join ((48..57) + (65..90) + (97..122) | Get-Random -Count 64 | % {[char]$_})

# Or use online generator (save immediately to password manager):
# https://randomkeygen.com/ (use "CodeIgniter Encryption Keys")
```

**Requirements**:
- Minimum 32 characters (recommend 64+)
- Mix of uppercase, lowercase, numbers, symbols
- Different secret for each environment
- Never reuse secrets

---

## 🚀 BACKEND CONFIGURATION (NestJS)

### Railway/Render Environment Variables

```env
# ===== NODE ENVIRONMENT =====
NODE_ENV=production

# ===== DATABASE =====
DATABASE_URL="postgresql://[user]:[pass]@[host]/[db]?sslmode=require&connection_limit=10"
DIRECT_URL="postgresql://[user]:[pass]@[host]/[db]?sslmode=require"

# ===== AUTHENTICATION =====
JWT_SECRET="[64-char-secret-from-password-manager]"
JWT_EXPIRATION="24h"

# ===== SERVER CONFIGURATION =====
PORT=3001
HOST=0.0.0.0

# ===== CORS CONFIGURATION =====
CORS_ORIGIN="https://edu-lms-production.vercel.app"
# For multiple origins, separate with comma:
# CORS_ORIGIN="https://edu-lms.vercel.app,https://www.edu-lms.com"

# ===== GRAPHQL CONFIGURATION =====
GRAPHQL_PLAYGROUND=false
# Set to true for staging: GRAPHQL_PLAYGROUND=true
GRAPHQL_INTROSPECTION=false

# ===== LOGGING =====
LOG_LEVEL=info
# Options: error, warn, info, debug

# ===== RATE LIMITING =====
RATE_LIMIT_TTL=60
RATE_LIMIT_MAX=100

# ===== FILE UPLOAD (if using R2) =====
R2_ACCOUNT_ID="[cloudflare-account-id]"
R2_ACCESS_KEY_ID="[r2-access-key]"
R2_SECRET_ACCESS_KEY="[r2-secret-key]"
R2_BUCKET_NAME="edu-lms-uploads"
R2_PUBLIC_URL="https://uploads.edu-lms.com"

# ===== EMAIL (optional - for notifications) =====
SMTP_HOST="smtp.gmail.com"
SMTP_PORT=587
SMTP_USER="noreply@edu-lms.com"
SMTP_PASSWORD="[app-specific-password]"
SMTP_FROM="EDU LMS <noreply@edu-lms.com>"
```

---

## 🎨 FRONTEND CONFIGURATION (Next.js)

### Vercel Environment Variables

```env
# ===== NODE ENVIRONMENT =====
NODE_ENV=production

# ===== API ENDPOINTS =====
NEXT_PUBLIC_API_URL="https://edu-lms-backend-production.up.railway.app/graphql"
NEXT_PUBLIC_WS_URL="wss://edu-lms-backend-production.up.railway.app/graphql"

# For development:
# NEXT_PUBLIC_API_URL="http://localhost:3001/graphql"
# NEXT_PUBLIC_WS_URL="ws://localhost:3001/graphql"

# ===== APPLICATION CONFIGURATION =====
NEXT_PUBLIC_APP_NAME="EDU LMS"
NEXT_PUBLIC_APP_URL="https://edu-lms-production.vercel.app"

# ===== FEATURE FLAGS =====
NEXT_PUBLIC_ENABLE_ANALYTICS=true
NEXT_PUBLIC_ENABLE_SENTRY=true

# ===== ANALYTICS (optional) =====
NEXT_PUBLIC_GA_ID="G-XXXXXXXXXX"
# Or use privacy-friendly alternative:
NEXT_PUBLIC_PLAUSIBLE_DOMAIN="edu-lms.com"

# ===== ERROR TRACKING (optional) =====
NEXT_PUBLIC_SENTRY_DSN="https://xxxx@xxxx.ingest.sentry.io/xxxx"
SENTRY_AUTH_TOKEN="[sentry-auth-token]"

# ===== FILE UPLOAD =====
NEXT_PUBLIC_MAX_FILE_SIZE=10485760
# 10MB in bytes (10 * 1024 * 1024)

NEXT_PUBLIC_ALLOWED_FILE_TYPES="image/jpeg,image/png,image/gif,application/pdf"
```

---

## 🔧 PRISMA CONFIGURATION

### packages/database/.env

```env
# Development
DATABASE_URL="postgresql://username:password@localhost:5432/edu_lms_dev?schema=public"

# Staging (use Neon staging)
DATABASE_URL="postgresql://username:password@ep-xxxx.us-east-2.aws.neon.tech/edu_lms_staging?sslmode=require"

# Production (use Neon production)
DATABASE_URL="postgresql://username:password@ep-xxxx.us-east-2.aws.neon.tech/edu_lms_prod?sslmode=require"
```

---

## 📦 RAILWAY CONFIGURATION

### How to Set Variables in Railway

1. Go to [Railway Dashboard](https://railway.app/dashboard)
2. Select your project: `edu-lms-backend-prod`
3. Go to "Variables" tab
4. Add each variable from "Backend Configuration" section
5. Click "Deploy" to apply changes

### Railway-Specific Variables

```env
# Railway auto-generates these (don't set manually):
RAILWAY_ENVIRONMENT=production
RAILWAY_PROJECT_ID=auto-generated
RAILWAY_SERVICE_ID=auto-generated
RAILWAY_REPLICA_ID=auto-generated

# Set these manually:
PORT=3001
# Railway will expose on their domain
```

### Railway Build Configuration

**Build Command**:
```bash
cd apps/backend && pnpm install && pnpm build
```

**Start Command**:
```bash
cd apps/backend && pnpm start:prod
```

**Root Directory**: `/` (monorepo root)

---

## 🎯 VERCEL CONFIGURATION

### How to Set Variables in Vercel

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your project: `edu-lms-frontend`
3. Go to "Settings" → "Environment Variables"
4. Add each variable from "Frontend Configuration" section
5. Select environments: Production, Preview, Development
6. Click "Save"

### Vercel Build Configuration

**Framework Preset**: Next.js

**Build Command**:
```bash
cd apps/frontend && pnpm install && pnpm build
```

**Output Directory**: `apps/frontend/.next`

**Install Command**: `pnpm install`

**Root Directory**: `/` (monorepo root)

### Vercel-Specific Variables

```env
# Vercel auto-provides these:
VERCEL=1
VERCEL_ENV=production  # or preview, development
VERCEL_URL=auto-generated-url.vercel.app
VERCEL_GIT_COMMIT_SHA=auto-generated
```

---

## 🗂️ FILE STRUCTURE

### Where to Store .env Files

```
EDU_PROJECT_LMS/
├── .env                          # ❌ DON'T commit (in .gitignore)
├── .env.example                  # ✅ Template (safe to commit)
├── .env.local                    # ❌ Local overrides
├── .env.production               # ❌ Production secrets
│
├── apps/
│   ├── backend/
│   │   ├── .env                  # ❌ Backend-specific
│   │   └── .env.example          # ✅ Template
│   │
│   └── frontend/
│       ├── .env.local            # ❌ Frontend-specific
│       └── .env.example          # ✅ Template
│
└── packages/
    └── database/
        ├── .env                  # ❌ Prisma connection
        └── .env.example          # ✅ Template
```

---

## ✅ ENVIRONMENT SETUP CHECKLIST

### Before Deployment

- [ ] All production secrets generated
- [ ] Secrets stored in password manager
- [ ] `.env` files in `.gitignore`
- [ ] `.env.example` files created (no real values)
- [ ] Railway variables configured
- [ ] Vercel variables configured
- [ ] Database connection tested
- [ ] CORS origins correct
- [ ] JWT expiration set to 24h (not 7d)
- [ ] GraphQL playground disabled in production
- [ ] Error tracking configured (Sentry)

### After Deployment

- [ ] Verify backend health: `curl https://backend-url/health`
- [ ] Test GraphQL endpoint with authentication
- [ ] Verify frontend can connect to backend
- [ ] Check CORS working correctly
- [ ] Test file upload (if applicable)
- [ ] Verify email sending (if applicable)
- [ ] Monitor error rates in Sentry
- [ ] Check database connection pool

---

## 🔍 ENVIRONMENT VALIDATION SCRIPT

Create `validate-env.js` to check all required variables:

```javascript
// validate-env.js
const requiredVars = {
  backend: [
    'DATABASE_URL',
    'JWT_SECRET',
    'NODE_ENV',
    'PORT',
    'CORS_ORIGIN'
  ],
  frontend: [
    'NEXT_PUBLIC_API_URL',
    'NEXT_PUBLIC_APP_NAME'
  ]
};

function validateEnv(type) {
  const missing = [];
  const vars = requiredVars[type];
  
  vars.forEach(varName => {
    if (!process.env[varName]) {
      missing.push(varName);
    }
  });
  
  if (missing.length > 0) {
    console.error(`❌ Missing ${type} environment variables:`);
    missing.forEach(v => console.error(`   - ${v}`));
    process.exit(1);
  }
  
  console.log(`✅ All ${type} environment variables present`);
}

// Usage:
// node validate-env.js backend
// node validate-env.js frontend
const type = process.argv[2];
if (!type || !requiredVars[type]) {
  console.error('Usage: node validate-env.js [backend|frontend]');
  process.exit(1);
}

validateEnv(type);
```

**Run before deployment**:
```bash
node validate-env.js backend
node validate-env.js frontend
```

---

## 🚨 SECURITY BEST PRACTICES

### DO ✅
- Use strong, unique secrets (64+ characters)
- Store secrets in password manager immediately
- Use different secrets for each environment
- Rotate secrets quarterly
- Use environment-specific connection strings
- Enable SSL/TLS for database connections
- Set short JWT expiration in production (24h)
- Disable GraphQL playground in production
- Use HTTPS everywhere
- Enable rate limiting
- Monitor for suspicious activity

### DON'T ❌
- Commit `.env` files to Git
- Share secrets via email/Slack
- Reuse secrets across environments
- Use weak/short secrets
- Hardcode secrets in code
- Share production credentials with developers
- Use development secrets in production
- Enable GraphQL playground in production
- Allow CORS from `*` origin
- Ignore security warnings

---

## 📞 TROUBLESHOOTING

### Backend Can't Connect to Database

**Error**: `ECONNREFUSED` or `Connection timeout`

**Solutions**:
1. Check `DATABASE_URL` format is correct
2. Verify Neon project is not suspended
3. Check if IP is whitelisted (Neon allows all by default)
4. Test connection with `psql` or database GUI
5. Verify `sslmode=require` is present

### Frontend Can't Connect to Backend

**Error**: `Network Error` or `Failed to fetch`

**Solutions**:
1. Check `NEXT_PUBLIC_API_URL` is correct
2. Verify backend is running: `curl https://backend-url/health`
3. Check CORS configuration allows frontend origin
4. Verify no typos in URL (trailing slash, http vs https)
5. Check browser console for detailed error

### JWT Token Invalid

**Error**: `Unauthorized` or `Invalid token`

**Solutions**:
1. Verify `JWT_SECRET` matches between backend instances
2. Check token expiration time
3. Clear browser cookies/localStorage
4. Verify backend is using correct secret from env var
5. Check for whitespace in `JWT_SECRET`

### Rate Limit Exceeded

**Error**: `Too Many Requests` (429)

**Solutions**:
1. Increase `RATE_LIMIT_MAX` if needed
2. Adjust `RATE_LIMIT_TTL` window
3. Implement token-based rate limiting
4. Use caching to reduce requests
5. Review client-side request patterns

---

## 📋 QUICK REFERENCE

### Generate Secrets

```powershell
# 64-character random string
-join ((48..57) + (65..90) + (97..122) | Get-Random -Count 64 | % {[char]$_})

# UUID
New-Guid
```

### Test Database Connection

```bash
# Using psql
psql "postgresql://username:password@host/database?sslmode=require"

# Using Prisma
cd packages/database
pnpm prisma db pull
```

### Test Backend Health

```bash
# Local
curl http://localhost:3001/health

# Production
curl https://edu-lms-backend-production.up.railway.app/health
```

### Test GraphQL Endpoint

```bash
curl -X POST https://backend-url/graphql \
  -H "Content-Type: application/json" \
  -d '{"query": "{ __typename }"}'
```

---

## 📝 NOTES

- Update this document when adding new environment variables
- Review and rotate secrets quarterly
- Keep `.env.example` files updated
- Document any environment-specific configurations
- Store backups of production secrets securely

---

**Last Updated**: March 12, 2026  
**Next Review**: June 12, 2026 (3 months)
