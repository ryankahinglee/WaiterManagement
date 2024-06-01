# capstone-project-3900h11a_chunkypenguins

# Frontend Setup

Our frontend server relies on using npm and nodeJS

You can check if you have these installed by running

- npm -v
- node —version

Tested npm version: 8.15

Tested node version: v16.17.1   

Installation manual: https://docs.npmjs.com/downloading-and-installing-node-js-and-npm

# Backend Setup

Our backend server relies on python

You can check if you have this installed by running

- python —version

Tested python version: 3.10.1

Official python installation: https://www.python.org/downloads/

Steps after installation:

1. Install pip via https://pip.pypa.io/en/stable/installation/
    
    Verify installation via pip —version
    
2. Navigate to backend root directory via \backend\backend_setup

3. Install Django via pip install django
    
    Check that it is installed via python -m django --version
    
    If Django does not allow version to check, an override must be done via
    
    pip install --force-reinstall django
    
    Check version again afterwards with python -m django --version

4. Install django corheaders via "pip install django-cors-headers"
Use “pip list” to verify installation

5. Install django restframework via "pip install djangorestframework"
Use pip list to verify

6. Install jwt via "pip install PyJWT"
Use pip list to verify

7. Install Pillow via "python -m pip install Pillow"

8. Install Postgre va https://www.postgresql.org/download/windows/
Press yes (Install all additionals)
When quered on password, type “admin” for both
Select port number 8080
Hit Next and install
Do not select (Open stackbuilder on exit)

9. Install psycog2-binary via "pip install psycopg2-binary"

10. Issues: If a port number issue arises

- Open [settings.py](http://settings.py) in backend\backend_setup\waddleWait
- Change Port number in DATABASES to 8080

## Running frontend and backend

### Backend
When running the shell script, two options can be used

1. ./run_backend.sh
This will clear the database and load in default values from a preset database
When prompted to clear the database, type “yes”, this allows for a full reset/clear of any existing data

Additonally, another script ./run_backend_mac.sh has been provided
This command is to be used if the above command fails to work. All python calls are changed from "python" to "python3" for mac

2. ./run_backend.sh run
This is used when running the database without reseting or reloading preset data.

Usage:

First time: run step 1

Consecutive use: run step 2

Reseting all data: run step 1

### Frontend

1. Run ./run_frontend, a terminal should appear, followed by a web page

2. If no webpage is shown/the terminal closes, it means the server is already running from your first attempt. Navigate to http://localhost:3000/
