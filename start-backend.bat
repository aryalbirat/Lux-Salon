@echo off
echo Installing backend dependencies...
cd backend
npm install
echo.
echo Seeding the database with initial data...
npm run seed
echo.
echo Starting the backend server...
npm run dev
