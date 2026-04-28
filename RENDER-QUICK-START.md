# 🎯 Quick Deploy to Render - 5 Minute Setup

**Panduan cepat deploy backend ke Render**. Untuk guide lengkap, lihat [RENDER-DEPLOYMENT-GUIDE.md](./RENDER-DEPLOYMENT-GUIDE.md)

---

## ⚡ TL;DR - 5 Langkah

```
1. Sign up Render (GitHub)
2. Create Web Service → Connect repo
3. Set environment variables
4. Deploy
5. Update Vercel frontend URL
```

**Total waktu: ~5-10 menit (build time ~5 min)**

---

## 📝 Detailed Steps

### 1️⃣ Create Render Account (1 min)

```
https://render.com → Sign up with GitHub
```

---

### 2️⃣ Create Web Service (2 min)

```
Dashboard → New + → Web Service
Connect Repository: Kadalzz/Edu_Project_LMS
Branch: main
```

**Configuration:**
```yaml
Name: lms-backend
Region: Singapore
Runtime: Docker
Dockerfile Path: ./Dockerfile
Plan: Free
```

---

### 3️⃣ Set Environment Variables (2 min)

Copy dari [.env.template](./.env.template) atau gunakan ini:

**Required (10 variables):**
```env
NODE_ENV=production
PORT=3001
DATABASE_URL=postgresql://neondb_owner:npg_0iTkjcsdhuV4@ep-soft-block-a1hhgzhl-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require
JWT_SECRET=GENERATE_NEW_32_CHARS_STRING
JWT_REFRESH_SECRET=GENERATE_NEW_32_CHARS_STRING
R2_ACCOUNT_ID=7b5877f76482243000a276c4e4892d2
R2_ACCESS_KEY_ID=707832ab9d7cd0571bb22d27cdce8106
R2_SECRET_ACCESS_KEY=a1591e39158ee052c65e056605717577f5c72D41cd611d2e043e2ab56de9c1f8
R2_BUCKET_NAME=lms-abk-storage
R2_PUBLIC_URL=https://7b5877f76482243000a276c4e4892d2.r2.cloudflarestorage.com
NEXT_PUBLIC_APP_URL=https://your-app.vercel.app
```

> ⚠️ **WAJIB**: Generate JWT secrets baru! Jangan pakai yang ada di guide.

**Generate JWT Secret:**
```powershell
# PowerShell
-join ((65..90) + (97..122) + (48..57) | Get-Random -Count 32 | % {[char]$_})
```

---

### 4️⃣ Deploy (5-10 min)

```
Click "Create Web Service"
Monitor build logs
Wait for status: "Live" (hijau)
```

**Get Backend URL:**
```
Format: https://lms-backend-xxxx.onrender.com
```

**Test Health:**
```bash
curl https://lms-backend-xxxx.onrender.com/health
# Expected: {"status":"ok"}
```

---

### 5️⃣ Update Frontend (1 min)

**Vercel Dashboard:**
```
Settings → Environment Variables
Edit: NEXT_PUBLIC_API_URL

New value: https://lms-backend-xxxx.onrender.com/graphql

Save → Redeploy
```

---

## ✅ Verification

### Backend
```bash
# Health
https://lms-backend-xxxx.onrender.com/health

# GraphQL Playground
https://lms-backend-xxxx.onrender.com/graphql
```

### Frontend
```
1. Open https://your-app.vercel.app
2. Login: guru1@lms.test / password123
3. Dashboard loads ✓
4. No console errors ✓
```

---

## 🐛 Common Issues

### Build Failed
**Check:** Dockerfile path correct (./Dockerfile)

### Database Connection Error
**Check:** DATABASE_URL has ?sslmode=require

### CORS Error
**Check:** NEXT_PUBLIC_APP_URL matches Vercel URL

### 404 on /health
**Wait:** Cold start takes 20-30s after sleep

---

## 📚 Next Steps

- [ ] Update README dengan production URLs
- [ ] Setup database backup (Neon)
- [ ] Configure custom domain (optional)
- [ ] Setup monitoring alerts
- [ ] Test all features in production

---

## 🆘 Need Help?

- **Full Guide**: [RENDER-DEPLOYMENT-GUIDE.md](./RENDER-DEPLOYMENT-GUIDE.md)
- **Env Variables**: [.env.template](./.env.template)
- **Render Logs**: Dashboard → Logs
- **Check Health**: `/health` endpoint

---

**Good luck! 🚀**
