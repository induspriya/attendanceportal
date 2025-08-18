# 🚀 Railway Backend Deployment Guide

## 📋 **Step-by-Step Instructions**

### **Step 1: Sign Up for Railway**
1. Go to [railway.app](https://railway.app)
2. Click "Sign Up" and choose "Continue with GitHub"
3. Authorize Railway to access your GitHub account

### **Step 2: Create New Project**
1. Click "New Project"
2. Choose "Deploy from GitHub repo"
3. Select your `attendanceportal` repository
4. Set the **Root Directory** to: `server`

### **Step 3: Set Environment Variables**
1. Go to your project's **Variables** tab
2. Add these environment variables:

```
MONGODB_URI=mongodb+srv://attendanceportal:MysecurePassword123@cluster0.1qfk1tq.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
JWT_SECRET=attendance_portal_super_secure_jwt_secret_key_2025_production
NODE_ENV=production
```

### **Step 4: Deploy**
1. Railway will automatically detect your Node.js app
2. Click "Deploy" 
3. Wait for deployment to complete (usually 2-3 minutes)

### **Step 5: Get Your Backend URL**
1. Once deployed, go to the **Settings** tab
2. Copy your **Domain** (e.g., `https://your-app-name.railway.app`)

### **Step 6: Update Frontend API Calls**
1. Go to your Vercel frontend
2. Update the API base URL to point to your Railway backend
3. Test the connection

## ✅ **What You'll Get**
- **Working Backend**: Full API functionality
- **Database Connection**: MongoDB working perfectly
- **Authentication**: Login/signup working
- **Attendance**: Check-in/check-out working
- **News System**: News updates working
- **CORS Fixed**: Frontend can communicate with backend

## 🔗 **Your Current Setup**
- **Frontend**: ✅ Vercel (Working)
- **Backend**: ❌ Vercel API routes (Not working)
- **Solution**: Deploy backend to Railway

## 🎯 **Why This Works**
- **Railway**: Perfect for Node.js/Express backends
- **Vercel**: Perfect for React frontends
- **Separation**: Each service does what it's best at
- **Reliability**: Much more stable than complex Vercel API setups

## 🚨 **Important Notes**
- Railway has a free tier (500 hours/month)
- Your backend will be accessible via HTTPS
- CORS is already configured for your Vercel frontend
- All your existing API routes will work immediately

## 📞 **Need Help?**
If you encounter any issues during deployment, the error messages will be clear and easy to fix!
