# Deployment Guide - Attendance Portal on Vercel

## Prerequisites

1. **MongoDB Atlas Account**: Set up a MongoDB Atlas cluster
2. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)
3. **GitHub Account**: Your code should be on GitHub

## Step 1: Set up MongoDB Atlas

1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a new cluster (free tier is fine)
3. Create a database user with read/write permissions
4. Get your connection string
5. Add your IP address to the whitelist (or use 0.0.0.0/0 for all IPs)

## Step 2: Prepare Environment Variables

Create these environment variables in Vercel:

### Required Environment Variables:
```
MONGODB_URI=mongodb+srv://your-username:your-password@your-cluster.mongodb.net/attendance-portal
JWT_SECRET=your-super-secret-jwt-key-here
JWT_EXPIRE=7d
NODE_ENV=production
```

### Optional Environment Variables (for email functionality):
```
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
```

## Step 3: Deploy to Vercel

### Option A: Deploy via Vercel CLI

1. Install Vercel CLI:
```bash
npm i -g vercel
```

2. Login to Vercel:
```bash
vercel login
```

3. Deploy:
```bash
vercel --prod
```

### Option B: Deploy via GitHub Integration

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Click "New Project"
4. Import your GitHub repository
5. Configure the project:
   - **Framework Preset**: Other
   - **Root Directory**: ./
   - **Build Command**: `npm run build`
   - **Output Directory**: client/build
   - **Install Command**: `npm run install-all`

## Step 4: Configure Environment Variables in Vercel

1. Go to your Vercel project dashboard
2. Navigate to Settings → Environment Variables
3. Add all the environment variables listed in Step 2
4. Redeploy the project

## Step 5: Update CORS Configuration

After deployment, update the CORS origins in `server/index.js`:

```javascript
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://your-actual-vercel-domain.vercel.app']
    : ['http://localhost:3000'],
  credentials: true
}));
```

## Step 6: Test the Deployment

1. Visit your Vercel URL
2. Test the health endpoint: `https://your-domain.vercel.app/api/health`
3. Test user registration and login
4. Test all major features

## Troubleshooting

### Common Issues:

1. **Build Failures**:
   - Check that all dependencies are in package.json
   - Ensure Node.js version is 18+ in Vercel settings

2. **MongoDB Connection Issues**:
   - Verify MONGODB_URI is correct
   - Check IP whitelist in MongoDB Atlas
   - Ensure database user has correct permissions

3. **CORS Errors**:
   - Update CORS origins with your actual Vercel domain
   - Check that credentials are properly configured

4. **API Routes Not Working**:
   - Verify vercel.json configuration
   - Check that server/index.js is the main entry point

### Vercel Configuration Files:

- `vercel.json`: Main configuration
- `package.json`: Root package with build scripts
- `client/package.json`: Frontend configuration
- `server/package.json`: Backend configuration

## Post-Deployment

1. **Set up Custom Domain** (optional):
   - Go to Vercel project settings
   - Add your custom domain
   - Update CORS origins accordingly

2. **Monitor Performance**:
   - Use Vercel Analytics
   - Monitor MongoDB Atlas metrics
   - Set up error tracking

3. **Backup Strategy**:
   - Enable MongoDB Atlas backups
   - Consider database migrations strategy

## Security Considerations

1. **Environment Variables**: Never commit sensitive data
2. **JWT Secret**: Use a strong, unique secret
3. **MongoDB**: Use connection string with username/password
4. **CORS**: Only allow necessary origins
5. **Rate Limiting**: Consider adding rate limiting for production

## Support

If you encounter issues:
1. Check Vercel deployment logs
2. Verify environment variables
3. Test API endpoints individually
4. Check MongoDB Atlas connection 