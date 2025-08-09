#!/bin/bash

echo "🚀 Setting up News & Announcement System for Attendance Portal"
echo "================================================================"

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: Please run this script from the root directory of the project"
    exit 1
fi

echo "📦 Installing server dependencies..."
cd server
npm install

echo "📦 Installing client dependencies..."
cd ../client
npm install

echo "🔧 Setting up environment variables..."
cd ../server
if [ ! -f ".env" ]; then
    echo "📝 Creating .env file..."
    cp env.example .env
    echo "⚠️  Please update the .env file with your MongoDB connection string and JWT secret"
    echo "   - MONGODB_URI=your_mongodb_connection_string"
    echo "   - JWT_SECRET=your_jwt_secret"
else
    echo "✅ .env file already exists"
fi

echo "🌱 Setting up database..."
echo "⚠️  Make sure MongoDB is running and you have at least one admin user in the database"
echo "   Run the following command to seed the database with sample news:"
echo "   cd server && npm run seed:news"

echo ""
echo "🎯 Next Steps:"
echo "1. Update server/.env with your database credentials"
echo "2. Start the server: cd server && npm run dev"
echo "3. Start the client: cd client && npm start"
echo "4. Seed the database: cd server && npm run seed:news"
echo "5. Access the news system at /news (public) and /admin/news (admin)"
echo ""
echo "✅ News system setup complete!"
echo "📚 See NEWS_SYSTEM.md for detailed documentation" 