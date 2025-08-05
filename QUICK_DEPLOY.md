# Quick Deploy to Vercel 🚀

## Prerequisites
- GitHub account with your code pushed
- Vercel account (free at vercel.com)
- MongoDB Atlas account (free tier available)

## Step 1: Set up MongoDB Atlas (5 minutes)

1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create free account and cluster
3. Create database user (remember username/password)
4. Get connection string
5. Add IP whitelist: `0.0.0.0/0` (allows all IPs)

## Step 2: Deploy to Vercel (3 minutes)

### Option A: GitHub Integration (Recommended)
1. Go to [vercel.com](https://vercel.com)
2. Click "New Project"
3. Import your GitHub repository
4. Configure:
   - **Framework**: Other
   - **Root Directory**: ./
   - **Build Command**: `npm run build`
   - **Output Directory**: `client/build`
   - **Install Command**: `npm run install-all`

### Option B: Vercel CLI
```bash
# Install Vercel CLI
npm i -g vercel

# Login and deploy
vercel login
vercel --prod
```

## Step 3: Configure Environment Variables

In Vercel dashboard → Settings → Environment Variables:

```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/attendance-portal
JWT_SECRET=your-super-secret-key-here
JWT_EXPIRE=7d
NODE_ENV=production
```

## Step 4: Test Your Deployment

1. Visit your Vercel URL
2. Test: `https://your-domain.vercel.app/api/health`
3. Register a new user
4. Test login and features

## Common Issues & Solutions

### Build Fails
- Check Node.js version (should be 18+)
- Verify all dependencies in package.json

### MongoDB Connection Error
- Check MONGODB_URI format
- Verify username/password
- Ensure IP whitelist includes 0.0.0.0/0

### CORS Errors
- Update CORS origins in server/index.js with your Vercel domain
- Redeploy after changes

## Your App is Live! 🎉

Your Attendance Portal is now deployed and accessible worldwide!

**Next Steps:**
- Set up custom domain (optional)
- Configure email for password reset
- Monitor performance in Vercel dashboard 