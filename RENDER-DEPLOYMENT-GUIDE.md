# 🚀 Render Deployment Guide - LMS ABK Backend

## Kenapa Migrate ke Render?

Railway sering error pada free tier, terutama untuk monorepo & Docker builds. Render menawarkan:
- ✅ Free tier lebih stabil & predictable
- ✅ 500 build minutes/bulan (cukup untuk development)
- ✅ Native support Docker & monorepo
- ✅ Auto-deploy dari GitHub
- ✅ Sleep after 15 min idle (startup < 30 detik)
- ✅ Database external (Neon) tetap bisa dipakai

---

## 📋 Prerequisites

Sebelum mulai, pastikan sudah ada:
- [x] Neon PostgreSQL database (sudah running)
- [x] Cloudflare R2 bucket (sudah configured)
- [x] GitHub repository (pushed & up to date)
- [ ] Render account (gratis, sign up pakai GitHub)

---

## 🎯 Step-by-Step Deployment

### Step 1: Create Render Account

1. Buka https://render.com
2. Click **"Get Started for Free"**
3. Sign up pakai **GitHub account**
4. Authorize Render untuk akses GitHub repository kamu

---

### Step 2: Create New Web Service

#### 2.1 Connect Repository
```
1. Di Render Dashboard, click "New +" → "Web Service"
2. Connect GitHub account (jika belum)
3. Pilih repository: "Kadalzz/Edu_Project_LMS"
4. Click "Connect"
```

#### 2.2 Configure Service Settings
```yaml
Name: lms-backend
Region: Singapore
Branch: main
Runtime: Docker
Dockerfile Path: ./Dockerfile

# PENTING: Biarkan root directory kosong (karena Dockerfile di root)
```

#### 2.3 Select Free Plan
```
Instance Type: Free
- 512 MB RAM
- Shared CPU
- Sleeps after 15 minutes of inactivity
- Restart time: < 30 seconds
```

---

### Step 3: Configure Environment Variables

Di **Environment** tab, tambahkan semua variable berikut:

#### Required Variables

```env
# Node Environment
NODE_ENV=production
PORT=3001

# Database (dari Neon)
DATABASE_URL=postgresql://neondb_owner:npg_0iTkjcsdhuV4@ep-soft-block-a1hhgzhl-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require

# JWT Secrets (GANTI dengan secret baru untuk production!)
JWT_SECRET=your-super-secret-jwt-key-min-32-chars
JWT_REFRESH_SECRET=your-super-secret-refresh-key-min-32-chars

# Cloudflare R2 Storage
R2_ACCOUNT_ID=7b5877f76482243000a276c4e4892d2
R2_ACCESS_KEY_ID=707832ab9d7cd0571bb22d27cdce8106
R2_SECRET_ACCESS_KEY=a1591e39158ee052c65e056605717577f5c72D41cd611d2e043e2ab56de9c1f8
R2_BUCKET_NAME=lms-abk-storage
R2_PUBLIC_URL=https://7b5877f76482243000a276c4e4892d2.r2.cloudflarestorage.com

# Frontend URL (akan diisi setelah deploy Vercel)
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

#### Cara Add Environment Variables
```
1. Scroll ke section "Environment"
2. Click "Add Environment Variable"
3. Masukkan Key & Value
4. Ulangi untuk semua variable di atas
5. Click "Save Changes"
```

#### ⚠️ Security Note
```
JANGAN pakai JWT_SECRET yang ada di deployment guide lama!
Generate secret baru dengan:

# PowerShell
-join ((65..90) + (97..122) + (48..57) | Get-Random -Count 32 | % {[char]$_})

Atau pakai online generator: https://generate-secret.vercel.app/32
```

---

### Step 4: Configure Health Check

```yaml
# Di Render dashboard → Settings → Health & Alerts

Health Check Path: /health
```

Backend kamu sudah punya endpoint `/health` yang return `{"status":"ok"}`.

---

### Step 5: Deploy

```
1. Click "Create Web Service"
2. Render akan otomatis:
   - Clone repository
   - Build Docker image (multi-stage build)
   - Generate Prisma client
   - Run production server
3. Monitor build logs:
   - Tunggu sampai status "Live" (hijau)
   - Build time: ~5-10 menit (pertama kali)
```

#### Build Process yang Terjadi:
```dockerfile
✓ Stage 1: Builder
  ├─ Install pnpm
  ├─ Install dependencies
  ├─ Generate Prisma client
  └─ Build NestJS backend

✓ Stage 2: Production
  ├─ Copy built files
  ├─ Install production deps only
  ├─ Generate Prisma client (production)
  └─ Start application
```

---

### Step 6: Get Backend URL

Setelah deploy sukses:
```
1. Di dashboard, copy service URL
   Format: https://lms-backend-xxxx.onrender.com

2. Test health endpoint:
   https://lms-backend-xxxx.onrender.com/health
   
   Response: {"status":"ok"}

3. Test GraphQL playground:
   https://lms-backend-xxxx.onrender.com/graphql
```

---

### Step 7: Update Frontend Environment

Sekarang update frontend untuk point ke backend Render:

#### 7.1 Update Vercel Environment Variable
```
1. Buka Vercel dashboard
2. Pilih project frontend
3. Settings → Environment Variables
4. Edit NEXT_PUBLIC_API_URL:
   
   NEXT_PUBLIC_API_URL=https://lms-backend-xxxx.onrender.com/graphql

5. Save & redeploy frontend
```

#### 7.2 Update Backend CORS
Backend environment di Render, update:
```env
NEXT_PUBLIC_APP_URL=https://your-app.vercel.app
```

Trigger redeploy backend:
```
Manual Deploy → Deploy latest commit
```

---

## ✅ Verification Checklist

### Backend Health Check
```bash
# Test health endpoint
curl https://lms-backend-xxxx.onrender.com/health

# Expected: {"status":"ok"}
```

### GraphQL API Test
```bash
# Buka di browser
https://lms-backend-xxxx.onrender.com/graphql

# Test query:
query {
  users {
    id
    email
    role
  }
}

# Expected: List of users from Neon database
```

### Database Connection
```bash
# GraphQL query untuk check classroom
query {
  classrooms {
    id
    name
  }
}

# Expected: Kelas 10A muncul (jika sudah seed data)
```

### Frontend Integration
```
1. Buka frontend Vercel URL
2. Login pakai guru1@lms.test / password123
3. Dashboard harus load
4. Check console - tidak ada CORS error
5. Test buat assignment baru
```

---

## 🔄 Auto-Deploy Configuration

Render otomatis deploy setiap kali ada push ke `main` branch:

```yaml
Auto-Deploy: Yes (default)
Branch: main

# Untuk disable auto-deploy:
Settings → Build & Deploy → Auto-Deploy → Off
```

---

## 🐛 Troubleshooting

### Build Failed: "pnpm not found"

**Solusi:** Docker image sudah install pnpm. Cek Dockerfile line:
```dockerfile
RUN npm install -g pnpm@8.15.1
```

### Build Failed: "Prisma Client not generated"

**Solusi:** Cek Dockerfile ada 2x prisma generate:
```dockerfile
# Stage 1: Build time
RUN cd packages/database && pnpm prisma generate

# Stage 2: Production time  
RUN cd packages/database && pnpm prisma generate
```

### Service Sleeps Too Fast

Render free tier sleep after 15 min idle. Untuk keep alive:

**Option 1: Cron Job (External)**
```bash
# Pakai cron-job.org untuk ping /health setiap 10 menit
https://cron-job.org

URL: https://lms-backend-xxxx.onrender.com/health
Schedule: */10 * * * * (every 10 minutes)
```

**Option 2: Upgrade ke Paid Plan**
```
Starter Plan: $7/bulan
- No sleep
- 512 MB RAM
- Persistent
```

### Database Connection Error

**Solusi:** Pastikan DATABASE_URL benar:
```bash
# Test dari local:
$env:DATABASE_URL="your-neon-url"
cd packages/database
npx prisma db pull

# Jika error, check:
1. Neon database masih active
2. Connection string benar
3. ?sslmode=require ada di URL
```

### CORS Error di Frontend

**Solusi:** Pastikan environment variable benar:
```env
# Di Render backend:
NEXT_PUBLIC_APP_URL=https://your-app.vercel.app

# Di Vercel frontend:
NEXT_PUBLIC_API_URL=https://lms-backend-xxxx.onrender.com/graphql
```

Redeploy kedua service setelah update.

---

## 💰 Cost Breakdown

### Render Free Tier
```
✓ Web Service: FREE
  - 750 hours/month (cukup untuk 1 service)
  - 500 build minutes
  - Sleep after 15 min idle
  - Bandwidth: 100 GB/month

✓ Neon Database: FREE (eternal)
  - 0.5 GB storage
  - 3 GB data transfer/month
  - Auto-pause when idle

✓ Cloudflare R2: FREE
  - 10 GB storage/month
  - No egress fees

✓ Vercel Frontend: FREE
  - 100 GB bandwidth/month
  - Unlimited deployments

TOTAL: Rp 0/bulan untuk normal usage
```

---

## 📊 Performance Notes

### Cold Start (After Sleep)
```
First request after sleep: 20-30 seconds
Subsequent requests: < 100ms
```

### Build Time
```
First build: ~5-10 minutes (install all deps)
Incremental builds: ~3-5 minutes (cached layers)
```

### Database Latency
```
Neon Singapore → Render Singapore: ~10-20ms
Very acceptable for production
```

---

## 🔐 Security Checklist

Before go live:
- [ ] Change JWT_SECRET to new random string (min 32 chars)
- [ ] Change JWT_REFRESH_SECRET to new random string
- [ ] Update CORS origin to production frontend URL
- [ ] Enable Render's "Protected" branch (prevent accidental deploys)
- [ ] Set up Neon database backup schedule
- [ ] Add monitoring (Render has built-in metrics)
- [ ] Test error handling & logging

---

## 🎓 Next Steps

1. **Setup Monitoring**
   - Render Dashboard → Metrics
   - Check CPU, Memory, Response time

2. **Configure Custom Domain** (Optional)
   ```
   Render → Settings → Custom Domain
   Add: api.yourdomain.com
   Point CNAME to Render URL
   ```

3. **Setup Alerts**
   ```
   Render → Settings → Notifications
   Add email/Slack untuk service down alerts
   ```

4. **Database Backup**
   ```
   Neon Dashboard → Backups
   Configure daily backup schedule
   ```

---

## 📚 Useful Links

- **Render Docs**: https://render.com/docs
- **Render Docker Guide**: https://render.com/docs/docker
- **Neon Console**: https://console.neon.tech
- **Cloudflare R2**: https://dash.cloudflare.com/r2

---

## 🆘 Need Help?

Jika ada masalah:
1. Check Render logs: Dashboard → Logs
2. Check build logs: Deploy → Build Logs
3. Test health endpoint: `/health`
4. Verify environment variables
5. Check Neon database status

**Common Issues:**
- Build timeout → Optimize Dockerfile (sudah optimized)
- Memory limit → Check memory usage di Metrics
- Database connection → Verify DATABASE_URL
- CORS error → Check NEXT_PUBLIC_APP_URL

---

Good luck! 🚀
