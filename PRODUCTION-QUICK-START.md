# ⚡ PRODUCTION QUICK START
**Last Updated**: March 12, 2026

---

## 🌐 Service URLs

### Production
- **Frontend**: https://[your-project].vercel.app
- **Backend**: https://[your-service].up.railway.app
- **GraphQL**: https://[your-service].up.railway.app/graphql
- **Health Check**: https://[your-service].up.railway.app/health

### Dashboards
- **Vercel**: https://vercel.com/dashboard
- **Railway**: https://railway.app/dashboard
- **Neon**: https://console.neon.tech

---

## 🚀 Quick Commands

### Test Backend Health
```bash
curl https://[your-service].up.railway.app/health
```

**Expected Response**:
```json
{"status":"ok"}
```

---

### Test GraphQL Endpoint
```bash
curl -X POST https://[your-service].up.railway.app/graphql \
  -H "Content-Type: application/json" \
  -d '{"query":"{ __typename }"}'
```

**Expected Response**:
```json
{"data":{"__typename":"Query"}}
```

---

### Run Database Migrations
```bash
# Set environment variable first
$env:DATABASE_URL="postgresql://..."

# Run migrations
cd packages/database
pnpm prisma migrate deploy
```

---

### Seed Database
```bash
# With DATABASE_URL set
cd packages/database
pnpm prisma db seed
```

---

### Run Automated Tests
```bash
# Update API URL in test file first
node test-day13-14-comprehensive.js
```

**Expected**: 16/16 tests passing ✅

---

## 🔄 Common Tasks

### Deploy Backend
```bash
# Commit and push to trigger Railway deployment
git add .
git commit -m "Update backend"
git push origin main

# Railway auto-deploys from main branch
# Monitor: https://railway.app/dashboard
```

---

### Deploy Frontend
```bash
# Commit and push to trigger Vercel deployment
git add .
git commit -m "Update frontend"
git push origin main

# Vercel auto-deploys from main branch
# Monitor: https://vercel.com/dashboard
```

---

### View Backend Logs (Railway)
1. Go to Railway dashboard
2. Select `edu-lms-backend-prod` service
3. Click "Logs" tab
4. Filter by log level if needed

Or use Railway CLI:
```bash
railway logs
```

---

### View Frontend Logs (Vercel)
1. Go to Vercel dashboard
2. Select project
3. Click "Deployments" → Latest deployment
4. Click "View Function Logs"

Or use Vercel CLI:
```bash
vercel logs
```

---

### Check Database Status (Neon)
1. Go to Neon Console
2. Select `edu-lms-production` project
3. View:
   - CPU usage
   - Storage size
   - Active connections
   - Recent queries

---

### Update Environment Variables

#### Railway
1. Go to Railway dashboard
2. Select service
3. Click "Variables" tab
4. Update variable
5. Click "Deploy" (service restarts automatically)

#### Vercel
1. Go to Vercel dashboard
2. Select project
3. Go to "Settings" → "Environment Variables"
4. Update variable
5. **Important**: Redeploy to apply changes

---

## 🐛 Troubleshooting

### Backend Not Responding

**Symptoms**: Health check fails, 504 errors

**Steps**:
1. Check Railway dashboard for service status
2. View logs for errors
3. Verify environment variables set
4. Check database connection
5. Restart service if needed

---

### Frontend Can't Connect to Backend

**Symptoms**: CORS errors, network errors in browser

**Steps**:
1. Verify `NEXT_PUBLIC_API_URL` is correct
2. Check backend is running (health check)
3. Verify CORS_ORIGIN includes frontend URL
4. Check browser console for detailed error
5. Clear browser cache/cookies

---

### Database Connection Issues

**Symptoms**: `ECONNREFUSED`, timeout errors

**Steps**:
1. Verify `DATABASE_URL` format correct
2. Check Neon project not suspended
3. Test connection with psql:
   ```bash
   psql "postgresql://..."
   ```
4. Verify SSL mode: `?sslmode=require`
5. Check connection limit not exceeded

---

### Deployment Fails

**Railway/Vercel Build Errors**:
1. Check build logs for specific error
2. Verify dependencies in package.json
3. Check build commands correct
4. Verify environment variables set
5. Try local build first

---

## 🔐 Access Credentials

### Admin Accounts
*(To be created during seed on DAY 18)*

- **Admin**: admin@lms-abk.com
- **Teacher 1**: guru@lms-abk.com
- **Teacher 2**: guru2@lms-abk.com
- **Student 1**: siswa1@lms-abk.com
- **Parent 1**: ortu1@lms-abk.com

**Passwords**: Check password manager entry "EDU LMS - User Accounts"

---

## 📊 Monitoring

### Key Metrics to Watch

| Metric | Target | Alert When |
|--------|--------|------------|
| Uptime | 99%+ | < 99% |
| Error Rate | < 1% | > 5% |
| Response Time | < 300ms | > 1s |
| Page Load | < 2s | > 5s |

### Tools
- **Uptime**: UptimeRobot (free tier)
- **Errors**: Sentry (free tier)
- **Performance**: Lighthouse CI
- **Logs**: Railway/Vercel built-in

---

## 🆘 Emergency Contacts

### Service Issues
- **Railway Support**: https://railway.app/support
- **Vercel Support**: https://vercel.com/support
- **Neon Support**: https://neon.tech/docs

### Documentation
- **Deployment Guide**: `DEPLOYMENT-CHECKLIST.md`
- **Environment Variables**: `ENVIRONMENT-VARIABLES.md`
- **Setup Guide**: `DAY16-SETUP-GUIDE.md`
- **Week 4 Plan**: `WEEK4-PRODUCTION-DEPLOYMENT.md`

---

## 🔄 Rollback Procedure

### Quick Rollback

#### Railway (Backend)
```bash
# In Railway dashboard:
# 1. Go to Deployments
# 2. Find last working deployment
# 3. Click "Redeploy"
```

#### Vercel (Frontend)
```bash
# In Vercel dashboard:
# 1. Go to Deployments
# 2. Find last working deployment
# 3. Click "Promote to Production"
```

#### Database (Neon)
```bash
# In Neon Console:
# 1. Go to Backup & Recovery
# 2. Select point-in-time
# 3. Click "Restore"
# 4. Takes 5-10 minutes
```

---

## 📝 Useful Links

### Production Services
- Frontend: [Update after deployment]
- Backend: [Update after deployment]
- GraphQL Playground: Disabled (use GraphQL clients)

### Development
- GitHub Repo: https://github.com/[org]/EDU_PROJECT_LMS
- Local Frontend: http://localhost:3000
- Local Backend: http://localhost:3001

### Documentation
- Main README: `README.md`
- API Docs: [To be added DAY 17]
- User Guides: [To be added DAY 17]

---

## ⚡ Quick Wins

### Performance Tips
1. Enable Vercel CDN for static assets
2. Use connection pooling (already enabled)
3. Add database indexes for common queries
4. Enable browser caching
5. Optimize images

### Security Checklist
- ✅ HTTPS everywhere
- ✅ Strong JWT secret (64+ chars)
- ✅ CORS configured (not `*`)
- ✅ GraphQL playground disabled
- ✅ Rate limiting enabled
- ✅ Environment variables secured

---

**Need help?** Check `DEPLOYMENT-CHECKLIST.md` for detailed steps.

*Last updated: March 12, 2026*
