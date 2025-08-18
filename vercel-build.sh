#!/bin/bash

# Install root dependencies
npm install

# Install client dependencies and build
cd client
npm install
npm run build
cd ..

# Copy static files to root of build directory for Vercel
echo "📁 Copying static files for Vercel..."
cp -r client/build/static/* client/build/

# Install server dependencies
cd server
npm install
cd ..

echo "Build completed successfully!" 