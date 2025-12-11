# Vercel + Neon Deployment Plan

## Overview
This document outlines the complete deployment strategy for Digitech Garden using Vercel (frontend + serverless functions) and Neon (PostgreSQL database).

---

## Phase 1: Database Setup (Neon)

### Step 1: Create Neon Account & Database
1. Go to [neon.tech](https://neon.tech)
2. Sign up with GitHub (recommended)
3. Create a new project: "digitech-garden"
4. Choose region closest to your users
5. Copy the connection string (looks like: `postgresql://user:password@host/dbname`)

### Step 2: Update Local Environment
1. Create `.env.local` in your project root:
```bash
DATABASE_URL="postgresql://user:password@neon-host/digitech_garden"
NUXT_SESSION_PASSWORD="your-secret-key-here-generate-random-string-32-chars"
```

2. Install dependencies and run migrations:
```bash
npm install
npx prisma migrate deploy
```

3. Verify connection:
```bash
npx prisma db push
```

### Step 3: Environment File for Neon
- **Connection pooling**: Neon provides a pooled connection string (use the "Connection string" from Neon dashboard, not pooled one for migrations)
- **Free tier includes**: Up to 3 projects, 1GB storage, unlimited reads/writes

---

## Phase 2: Vercel Deployment Preparation

### Step 1: Prepare Project Structure
Your project already has the right structure. Verify:
- ✅ `nuxt.config.ts` - configured correctly
- ✅ `server/api/` - API routes ready
- ✅ `prisma/schema.prisma` - database schema defined
- ✅ `package.json` - all dependencies listed

### Step 2: Create vercel.json Configuration
This file tells Vercel how to build and run your app:

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": ".output/public",
  "env": {
    "NUXT_SESSION_PASSWORD": "@neon_session_password",
    "DATABASE_URL": "@neon_database_url"
  },
  "functions": {
    "api/**": {
      "maxDuration": 60
    }
  }
}
```

### Step 3: Update nuxt.config.ts (if needed)
Ensure production settings:
```typescript
export default defineNuxtConfig({
  // ... existing config
  nitro: {
    prerender: {
      crawlLinks: false,
      routes: ['/sitemap.xml', '/robots.txt'],
    },
    alias: {
      '#lib': fileURLToPath(new URL('./lib', import.meta.url)),
    },
  },
})
```

### Step 4: Build Verification
Test locally:
```bash
npm run build
npm run preview
```

---

## Phase 3: GitHub & Vercel Connection

### Step 1: Push to GitHub
```bash
git add .
git commit -m "chore: prepare for Vercel deployment"
git push origin main
```

### Step 2: Connect Vercel Project
1. Go to [vercel.com](https://vercel.com)
2. Sign in with GitHub
3. Click "New Project"
4. Select your `digitech-garden` repository
5. Framework: **Nuxt**
6. Build Command: `npm run build`
7. Output Directory: `.output/public`
8. Install Command: `npm install`

### Step 3: Add Environment Variables
In Vercel Project Settings → Environment Variables:

```
DATABASE_URL = postgresql://user:password@host/dbname
NUXT_SESSION_PASSWORD = your-random-secret-key
```

**IMPORTANT**: Use the non-pooled connection string from Neon for compatibility with Prisma.

---

## Phase 4: Database Migration in Production

### Step 1: Run Migrations on Vercel
After first deploy, run migrations:
```bash
# Option 1: Via Vercel CLI
vercel env pull
npx prisma migrate deploy

# Option 2: Create a migration job (add to package.json)
"postinstall": "nuxt prepare && prisma generate"
```

### Step 2: Verify Database Connection
- Check Vercel logs for database connection errors
- Test API endpoints that use database

---

## Phase 5: Testing & Verification

### Checklist
- [ ] Neon database created and tested locally
- [ ] Local environment variables configured
- [ ] Project builds successfully (`npm run build`)
- [ ] Preview works locally (`npm run preview`)
- [ ] GitHub repository is up to date
- [ ] Vercel project connected to GitHub
- [ ] Environment variables set in Vercel
- [ ] Database migrations run successfully
- [ ] API routes working in production
- [ ] Authentication system functional
- [ ] Database queries working correctly

### Testing in Production
1. Visit your Vercel deployment URL
2. Test sign-up/login flow
3. Create/read/update notes
4. Test search and graph features
5. Check server logs in Vercel dashboard

---

## Important Configuration Notes

### Prisma + Vercel
- Prisma Client is automatically generated during build
- Include `prisma generate` in build process (already in `postinstall`)
- Use standard connection string (not pooled) for migrations

### Session Management
- `NUXT_SESSION_PASSWORD` must be a strong random string (32+ characters)
- Generate with: `openssl rand -base64 32`
- Same key used across all instances

### Environment Variables Priority
1. Vercel environment variables (highest)
2. `.env.production` (if exists)
3. `.env` (local development)

---

## Neon + Vercel Cost Analysis

### Free Tier Limits
| Service | Limit |
|---------|-------|
| Neon Projects | 3 |
| Neon Storage | 3GB (can request upgrade) |
| Vercel Deployments | Unlimited |
| Vercel Serverless Functions | 100GB-hrs/month |
| Vercel Bandwidth | 100GB/month |

**Estimated Cost**: $0/month (within free tier)

---

## Troubleshooting

### Database Connection Timeout
- Verify DATABASE_URL environment variable is set
- Check Neon dashboard for IP restrictions
- Ensure Vercel region is selected

### Prisma Migration Failures
- Run `npx prisma db push` locally first
- Check migration lock file isn't corrupt
- Review Neon connection string format

### Build Failures
- Check `npm run build` works locally
- Verify all environment variables are set
- Check Node version compatibility (use Node 18+)

### Slow Deployments
- Vercel builds are cached after first deployment
- Subsequent deployments should be faster
- Monitor Vercel analytics dashboard

---

## Post-Deployment Steps

1. **Enable HTTPS**: Automatic on Vercel
2. **Set up monitoring**: Use Vercel Analytics
3. **Configure backups**: Neon provides automatic backups
4. **Domain setup**: Add custom domain in Vercel settings
5. **SSL certificate**: Automatic on Vercel
6. **CDN**: Enabled by default on Vercel

---

## Quick Reference

**Deployment Checklist**:
```bash
# 1. Local testing
npm install
npx prisma migrate deploy
npm run build
npm run preview

# 2. Push to GitHub
git push origin main

# 3. In Vercel dashboard
# - Connect GitHub repo
# - Set environment variables
# - Deploy

# 4. Verify production
# - Test API endpoints
# - Check database queries
# - Monitor logs
```

---

## Resources

- [Vercel Nuxt Deployment](https://vercel.com/guides/nuxt-3)
- [Neon PostgreSQL](https://neon.tech/docs)
- [Prisma on Vercel](https://www.prisma.io/docs/guides/deployment/deployment-guides/deploying-to-vercel)
- [Nuxt Deployment](https://nuxt.com/docs/getting-started/deployment)
