#!/bin/bash

set -e
# Navigate to root of frontend
# Note: Relies on npm
cd frontend/waddlewait/

# Ensure files are up to date
echo "Running installation..."
npm install || { echo "'npm install' failed"; exit 1; }

# Run frontend 

echo "Starting server..."

npm start 