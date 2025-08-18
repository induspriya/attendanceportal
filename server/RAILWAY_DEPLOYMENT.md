# 🚀 Railway Deployment Guide for Attendance Portal Backend

## 📋 Prerequisites
1. **Railway Account**: Sign up at [railway.app](   https://railway.app)
2. **GitHub Repository**: Your backend code should be in a Git repository
3. **MongoDB Atlas**: Cloud database (free tier available)

## 🎯 Step-by-Step Deployment

### 1. Prepare Your Repository
```bash
# Make sure all changes are committed
git add .
git commit -m "Prepare for Railway deployment"
git push origin main
```

### 2. Deploy to Railway

#### Option A: Deploy via Railway Dashboard
1. Go to [railway.app](https://railway.app) and sign in
2. Click "New Project"
3. Choose "Deploy from GitHub repo"
4. Select your repository
5. Railway will automatically detect it's a Node.js app

#### Option B: Deploy via Railway CLI
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login to Railway
railway login

# Initialize Railway project
railway init

# Deploy
railway up
```

### 3. Configure Environment Variables
In Railway dashboard, go to your project → Variables tab and add:

```env
# Required Variables
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/attendance-portal
JWT_SECRET=your-super-secret-jwt-key-here
NODE_ENV=production
PORT=5001

# Optional Variables
ALLOWED_ORIGINS=https://attendance-portal-deploy-ja2xug007-induspriyas-projects.vercel.app,https://attendance-portal-deploy.vercel.app
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
```

### 4. Get Your Backend URL
After deployment, Railway will provide a URL like:
`https://your-app-name-production.up.railway.app`

### 5. Update Frontend Configuration
Update your Vercel environment variables:
```env
REACT_APP_API_URL=https://your-app-name-production.up.railway.app/api
```

## 🔧 Troubleshooting

### Common Issues:
1. **Build Failures**: Check Railway logs for dependency issues
2. **Environment Variables**: Ensure all required vars are set
3. **Port Issues**: Railway sets PORT automatically
4. **Database Connection**: Verify MongoDB URI is correct

### Health Check:
Your backend includes a health check endpoint:
`https://your-app-name-production.up.railway.app/api/health`

## 📊 Monitoring
- **Logs**: View real-time logs in Railway dashboard
- **Metrics**: Monitor CPU, memory, and network usage
- **Deployments**: Track deployment history and rollbacks

## 🔄 Continuous Deployment
Railway automatically redeploys when you push to your main branch.

## 💰 Pricing
- **Free Tier**: $5 credit monthly
- **Pay-as-you-go**: $0.000463 per second of runtime
- **Pro Plan**: $20/month for unlimited usage

## 🎉 Success!
Once deployed, your frontend will be able to communicate with your backend without CORS issues!
