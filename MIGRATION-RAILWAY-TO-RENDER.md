# 🔄 Migration Guide: Railway → Render

**Panduan migrate backend dari Railway ke Render tanpa downtime.**

---

## 🤔 Kenapa Migrate?

Railway free tier bermasalah:
- ❌ Build sering timeout/fail
- ❌ Service restart tiba-tiba
- ❌ Monorepo + Docker tidak stabil
- ❌ Limited build minutes di free tier

Render lebih stabil:
- ✅ Build success rate tinggi
- ✅ Docker & monorepo native support
- ✅ 500 build minutes/bulan
- ✅ Auto-deploy reliable
- ✅ Predictable sleep behavior

---

## 📋 Pre-Migration Checklist

- [ ] Backup environment variables dari Railway
- [ ] Catat Railway service URL (untuk rollback jika perlu)
- [ ] Generate JWT secrets baru untuk Render
- [ ] Frontend di Vercel masih jalan (tidak akan terpengaruh)
- [ ] Database Neon masih jalan (tidak akan terpengaruh)

---

## 🎯 Migration Steps (Zero Downtime)

### Step 1: Backup Railway Config (5 min)

```bash
# Simpan semua environment variables dari Railway
Railway Dashboard → Your Service → Variables

Copy semua values ke file lokal (jangan commit!):
- DATABASE_URL
- JWT_SECRET (akan diganti baru)
- JWT_REFRESH_SECRET (akan diganti baru)
- R2_* variables (semua)
- NEXT_PUBLIC_APP_URL
```

**Backup Railway URLs:**
```
Backend URL: https://your-app.railway.app
Health: https://your-app.railway.app/health
GraphQL: https://your-app.railway.app/graphql
```

---

### Step 2: Deploy to Render (10 min)

Ikuti guide lengkap: **[RENDER-QUICK-START.md](./RENDER-QUICK-START.md)**

**TL;DR:**
```
1. Sign up Render with GitHub
2. New Web Service → Connect repo
3. Configure:
   - Name: lms-backend
   - Region: Singapore
   - Runtime: Docker
   - Dockerfile: ./Dockerfile
   - Plan: Free

4. Add environment variables (same as Railway, EXCEPT):
   - Generate NEW JWT_SECRET
   - Generate NEW JWT_REFRESH_SECRET
   
5. Deploy → Wait ~5-10 min

6. Get new URL: https://lms-backend-xxxx.onrender.com
```

---

### Step 3: Verify Render Deployment (5 min)

**Test Backend:**
```bash
# Health check
curl https://lms-backend-xxxx.onrender.com/health
# Expected: {"status":"ok"}

# GraphQL playground
# Open in browser: https://lms-backend-xxxx.onrender.com/graphql

# Test query (paste di playground):
query {
  users {
    id
    email
    role
  }
}
```

**Jika ada error:**
- Check Render logs: Dashboard → Logs
- Verify environment variables: Dashboard → Environment
- Check DATABASE_URL correct: Test dengan prisma studio local

---

### Step 4: Update Frontend (2 min)

**Vercel Dashboard:**
```
1. Go to project settings
2. Environment Variables
3. Edit: NEXT_PUBLIC_API_URL
   
   Old: https://your-app.railway.app/graphql
   New: https://lms-backend-xxxx.onrender.com/graphql

4. Save
5. Trigger redeploy: Deployments → ... → Redeploy
```

**Wait for Vercel redeploy (~2 min)**

---

### Step 5: Update Backend CORS (1 min)

**Render Dashboard:**
```
Environment → Edit NEXT_PUBLIC_APP_URL

Make sure value matches Vercel URL:
NEXT_PUBLIC_APP_URL=https://your-app.vercel.app

Save → Auto redeploy
```

---

### Step 6: Test Production (5 min)

**Frontend Test:**
```
1. Open https://your-app.vercel.app
2. Login: guru1@lms.test / password123
3. Verify dashboard loads
4. Check browser console - no errors
5. Test features:
   - View classrooms
   - View students
   - Create assignment
   - Upload file (R2 test)
   - Submit assignment
   - Grade assignment
```

**Backend Test:**
```bash
# Test all major endpoints via GraphQL playground
https://lms-backend-xxxx.onrender.com/graphql

# Test queries:
- users
- classrooms
- subjects
- assignments
- submissions
```

---

### Step 7: Monitor for 24 Hours

**Keep Railway running selama 24 jam** untuk rollback insurance:
```
Day 1-2: Monitor Render stability
- Check logs for errors
- Monitor response times
- Verify auto-deploy works
- Test cold start behavior

If stable after 24h → Safe to delete Railway service
If issues → Rollback to Railway (change Vercel URL back)
```

---

### Step 8: Cleanup Railway (Optional)

Setelah yakin Render stabil (24-48 jam):

```
Railway Dashboard → Your Service → Settings → Delete Service

⚠️ PASTIKAN:
- Frontend sudah 100% point ke Render
- Render service running dengan baik
- Tidak ada user complain
```

---

## 🔄 Rollback Plan (Jika Ada Masalah)

Jika Render bermasalah, rollback ke Railway:

### Emergency Rollback (5 min)

```
1. Vercel Dashboard → Environment Variables
   Edit NEXT_PUBLIC_API_URL:
   Change back to: https://your-app.railway.app/graphql

2. Redeploy Vercel

3. Verify Railway still running:
   curl https://your-app.railway.app/health

4. Test frontend → should work with Railway again

5. Fix Render issues:
   - Check logs
   - Fix environment variables
   - Redeploy
   - Test again

6. Switch back to Render when ready
```

---

## 📊 Comparison: Railway vs Render

| Feature | Railway | Render |
|---------|---------|--------|
| Free tier stability | ⚠️ Unstable | ✅ Stable |
| Docker support | ⚠️ Basic | ✅ Native |
| Monorepo support | ⚠️ Tricky | ✅ Native |
| Build minutes | Limited | 500/month |
| Cold start | ~30s | ~20-30s |
| Auto-deploy | ✅ Yes | ✅ Yes |
| Logs | ✅ Good | ✅ Good |
| Custom domain | ✅ Yes | ✅ Yes |
| Region options | ⚠️ Limited | ✅ Many |
| Free tier sleeps | Sometimes | After 15 min |

**Winner: Render** ✅

---

## 💡 Tips for Smooth Migration

1. **Migrate di off-peak hours** (malam/weekend kalau possible)
2. **Test Render thorougly** sebelum switch frontend
3. **Keep Railway running** 24-48 jam untuk safety net
4. **Monitor logs** closely setelah migration
5. **Inform users** jika ada planned maintenance window

---

## 🔐 Security Notes

**WAJIB Generate JWT Secrets Baru:**
```powershell
# Generate di PowerShell:
-join ((65..90) + (97..122) + (48..57) | Get-Random -Count 32 | % {[char]$_})

Run 2x untuk JWT_SECRET dan JWT_REFRESH_SECRET
```

**Kenapa ganti JWT secrets:**
- Security best practice saat migrate
- Invalidate all old tokens (forced re-login)
- Fresh start di environment baru

**After migration:**
- Users perlu login ulang (expected)
- Session cookies cleared
- Tokens invalidated

---

## 📞 Support

**Render Issues:**
- Docs: https://render.com/docs
- Support: support@render.com
- Community: https://community.render.com

**Database Issues:**
- Neon Console: https://console.neon.tech
- Check Neon service status

**Frontend Issues:**
- Vercel Dashboard → Logs
- Check NEXT_PUBLIC_API_URL correct

---

## ✅ Post-Migration Checklist

24 hours after migration:

- [ ] Render service stable (no crashes)
- [ ] Frontend loading correctly
- [ ] No CORS errors
- [ ] Database connection stable
- [ ] File uploads working (R2)
- [ ] All features tested
- [ ] No user complaints
- [ ] Auto-deploy working
- [ ] Logs clean
- [ ] Response times acceptable

If all checked → **Safe to delete Railway service** 🎉

---

## 🎓 Lessons Learned

**Why Railway Failed:**
- Free tier too restrictive for Docker monorepos
- Build system not optimized for complex setups
- Frequent service interruptions

**Why Render Works:**
- Built for Docker from ground up
- Better resource allocation on free tier
- More predictable behavior
- Better monorepo support

**For future projects:**
- Use Render for Docker-based backends
- Use Vercel for Next.js frontends
- Use Neon for PostgreSQL
- Use Cloudflare R2 for storage

**Total cost: Rp 0** ✨

---

**Migration complete! 🚀**
