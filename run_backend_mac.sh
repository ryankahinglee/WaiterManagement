#!/bin/bash

cd backend/backend_setup/

# This shell script is used for running the backend
# This is ran in the root directory of the project
# Note: Need to be in a bash terminal


    if [ "$1" = "run" ]; then
        # Start the Django development server
        echo "Starting server..."
        python3 manage.py runserver || exit 1
    fi

set -e

# Adjusting UTF

fixturesFile="fixtures.json"

# Check if it exists
if [ ! -f "$fixturesFile" ]; then
    echo "Error: '$fixturesFile' not found."
    exit 1
fi

echo "Clearing database"
python3 manage.py flush || { echo "Clearing database via flush failed"; exit 1; }

# Migration
echo "Running migrations..."
python3 manage.py migrate || { echo "Migration failed"; exit 1; }

# Loading database
echo "Loading database..."
python3 manage.py loaddata fixtures.json || { echo "Loading database failed"; exit 1; }

# Running server
echo "Starting server... "
python3 manage.py runserver || exit 1
