#!/bin/bash
# Test the build process locally

echo "==== Testing build process ===="
echo "Building the application..."
npm run build

if [ $? -ne 0 ]; then
  echo "❌ Build failed."
  exit 1
fi

echo "✅ Build completed successfully."
echo "You can now run 'NODE_ENV=production node dist/index.js' to test the production server."
echo "==== Build test finished ===="