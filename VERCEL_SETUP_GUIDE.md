# 🚀 Vercel Deployment Setup Guide

## 📋 **Required Environment Variables**

Set these in your Vercel dashboard under **Settings > Environment Variables**:

### **Essential Variables:**
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/attendance-portal?retryWrites=true&w=majority
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
NODE_ENV=production
```

### **Email Configuration (Optional):**
```
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-email-app-password
```

### **Client Configuration:**
```
CLIENT_URL=https://attendance-portal-rmcxcn8dj-induspriyas-projects.vercel.app
```

---

## 🗄️ **MongoDB Atlas Setup**

### **1. Create MongoDB Atlas Cluster:**
- Go to [MongoDB Atlas](https://cloud.mongodb.com/)
- Create a new cluster (Free tier available)
- Choose your preferred cloud provider and region

### **2. Database Access:**
- Create a database user with read/write permissions
- Username: `attendance-portal-user`
- Password: Generate a strong password
- Role: `Read and write to any database`

### **3. Network Access:**
- Add IP address: `0.0.0.0/0` (allows access from anywhere)
- Or add specific IPs for security

### **4. Connection String:**
- Click "Connect" on your cluster
- Choose "Connect your application"
- Copy the connection string
- Replace `<username>`, `<password>`, and `<dbname>` with your values

**Example:**
```
mongodb+srv://attendance-portal-user:YourPassword123@cluster0.abc123.mongodb.net/attendance-portal?retryWrites=true&w=majority
```

---

## 🔒 **CORS Configuration**

✅ **Already Updated** - Your new Vercel domain has been added to the CORS configuration:
- `https://attendance-portal-rmcxcn8dj-induspriyas-projects.vercel.app`

---

## 📱 **Vercel Dashboard Setup**

### **1. Access Your Project:**
- Go to [Vercel Dashboard](https://vercel.com/dashboard)
- Click on your `attendance-portal` project

### **2. Environment Variables:**
- Go to **Settings > Environment Variables**
- Add each variable from the list above
- Set **Environment** to `Production`
- Click **Save**

### **3. Redeploy:**
- Go to **Deployments**
- Click **Redeploy** on your latest deployment
- This will apply the new environment variables

---

## 🧪 **Testing Your Setup**

### **1. Health Check:**
Visit: `https://attendance-portal-rmcxcn8dj-induspriyas-projects.vercel.app/api/health`

### **2. Environment Check:**
Visit: `https://attendance-portal-rmcxcn8dj-induspriyas-projects.vercel.app/api/env`

### **3. Database Test:**
Visit: `https://attendance-portal-rmcxcn8dj-induspriyas-projects.vercel.app/api/test-db`

---

## ⚠️ **Important Notes**

1. **JWT_SECRET**: Use a strong, random string (at least 32 characters)
2. **MONGODB_URI**: Never commit this to version control
3. **NODE_ENV**: Must be set to `production` for CORS to work properly
4. **Redeploy Required**: Environment variables only take effect after redeployment

---

## 🔄 **After Setup**

1. **Redeploy** your application in Vercel
2. **Test** all API endpoints
3. **Verify** database connection
4. **Check** CORS is working from your frontend

---

## 📞 **Troubleshooting**

### **Common Issues:**
- **CORS Error**: Ensure `NODE_ENV=production` is set
- **Database Connection**: Verify MongoDB URI format and credentials
- **Environment Variables**: Check they're set for Production environment
- **Redeploy**: Variables only apply after redeployment

### **Need Help?**
- Check Vercel deployment logs
- Verify environment variables are set correctly
- Test database connection separately
- Ensure all required variables are present
