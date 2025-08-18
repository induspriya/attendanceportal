#!/bin/bash

echo "🚀 Forcing Vercel Redeployment..."

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI not found. Installing..."
    npm install -g vercel
fi

# Clear Vercel cache
echo "🧹 Clearing Vercel cache..."
vercel --clear-cache

# Build the project
echo "📦 Building project..."
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Build successful!"
else
    echo "❌ Build failed!"
    exit 1
fi

# Force redeploy to Vercel
echo "🌐 Force redeploying to Vercel..."
vercel --prod --force

echo "🎉 Force redeployment complete!"
echo ""
echo "📋 Next steps:"
echo "1. Check Vercel dashboard for deployment status"
echo "2. Test the new endpoints:"
echo "   - /api/health"
echo "   - /api/test-deployment"
echo "3. Verify environment variables are set"
echo "4. Test database connection"
