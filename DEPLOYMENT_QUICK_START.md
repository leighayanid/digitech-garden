# Vercel + Neon Deployment - Quick Start Guide

## 🚀 5-Step Deployment Process

### **Step 1: Create Neon Database (5 minutes)**

1. Visit [neon.tech](https://neon.tech) and sign up with GitHub
2. Create new project named "digitech-garden"
3. Copy the connection string from the "Connection string" tab (NOT the pooled one)
4. It looks like: `postgresql://user:password@ep-xxxx.neon.tech/dbname`

---

### **Step 2: Update Local Environment (2 minutes)**

Create a `.env.local` file in your project root:

```bash
DATABASE_URL="postgresql://user:password@ep-xxxx.neon.tech/digitech_garden"
NUXT_SESSION_PASSWORD="$(openssl rand -base64 32)"
```

Run locally to verify:
```bash
npm install
npx prisma migrate deploy
npm run build
npm run preview
```

---

### **Step 3: Push to GitHub (1 minute)**

```bash
git add -A
git commit -m "chore: prepare for Vercel+Neon deployment"
git push origin main
```

---

### **Step 4: Connect to Vercel (3 minutes)**

1. Go to [vercel.com](https://vercel.com) → Sign in with GitHub
2. Click "New Project" → Select `digitech-garden` repository
3. Framework: **Nuxt 4** (auto-detected)
4. Environment Variables:
   - `DATABASE_URL` = Your Neon connection string
   - `NUXT_SESSION_PASSWORD` = Random 32-char string

5. Click "Deploy"

---

### **Step 5: Verify & Test (2 minutes)**

Once deployed:
1. Visit your Vercel deployment URL
2. Test sign-up/login
3. Test creating a note
4. Check Vercel logs for any errors: `Deployments → Click latest → Logs`

---

## 📋 Environment Variables Reference

| Variable | Value | Where to Get |
|----------|-------|--------------|
| `DATABASE_URL` | Connection string from Neon | Neon Dashboard → Connection string |
| `NUXT_SESSION_PASSWORD` | Random 32+ char string | Generate: `openssl rand -base64 32` |
| `OPENAI_API_KEY` | (Optional) Your OpenAI key | openai.com |
| `ANTHROPIC_API_KEY` | (Optional) Your Anthropic key | anthropic.com |

---

## 🔑 Getting Your Neon Connection String

1. Login to [neon.tech](https://neon.tech)
2. Select your project
3. Go to "Connection string" tab
4. Copy the full URL (starts with `postgresql://`)
5. Paste into Vercel environment variables

⚠️ **Important**: Use the standard connection string, NOT the pooled one, because Prisma needs the standard version for migrations.

---

## ✅ Verification Checklist

After deployment, verify:

- [ ] Site loads at Vercel URL
- [ ] Can navigate pages
- [ ] Sign-up/login works
- [ ] Can create notes
- [ ] Database queries work
- [ ] No 500 errors in Vercel logs
- [ ] Search functionality works

---

## 🚨 Common Issues & Fixes

### Issue: "Cannot find module 'prisma'"
**Fix**: Prisma is auto-generated. Just redeploy.

### Issue: Database connection timeout
**Fix**: 
- Verify DATABASE_URL is set in Vercel
- Check Neon connection string is correct
- Use standard connection string (not pooled)

### Issue: 502 Bad Gateway
**Fix**: 
- Check Vercel logs for errors
- Verify all environment variables are set
- Ensure database migrations ran successfully

### Issue: Build takes >60 seconds
**Fix**: Normal for first build. Subsequent deployments are cached and faster.

---

## 📊 What You Get (Free Tier)

| Feature | Limit |
|---------|-------|
| Neon Database | 3GB storage, unlimited ops |
| Vercel Deployments | Unlimited |
| Vercel Functions | 100GB-hrs/month |
| Bandwidth | 100GB/month |
| **Estimated Cost** | **$0/month** |

---

## 🔗 Useful Links

- [Vercel Dashboard](https://vercel.com/dashboard)
- [Neon Dashboard](https://console.neon.tech)
- [Deployment Plan (Full)](./DEPLOYMENT_PLAN.md)
- [Nuxt Docs](https://nuxt.com)
- [Prisma Docs](https://www.prisma.io/docs)

---

## 💡 Pro Tips

1. **Monitor costs**: Both services have free tiers; check dashboards monthly
2. **Database backups**: Neon includes automatic backups (7-day retention)
3. **Staging**: Create another Neon project for staging/testing
4. **Custom domain**: Add in Vercel → Settings → Domains
5. **SSL**: Automatic HTTPS on all Vercel deployments

---

## Need Help?

1. Check Vercel logs: `Deployments → Your deployment → Logs`
2. Check Neon connection: Query a test database in Neon console
3. Test locally first: `npm run build && npm run preview`
4. Review `DEPLOYMENT_PLAN.md` for detailed troubleshooting

