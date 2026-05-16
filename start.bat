@echo off
echo Starting Vantage ERP - Backend and Frontend
echo.

REM Copy .env.example to .env if it doesn't exist
if not exist "frontend\.env" (
    echo Creating .env file from .env.example...
    copy "frontend\.env.example" "frontend\.env" >nul
    echo .env file created successfully.
    echo.
)

echo Starting Backend (Spring Boot)...
start "Vantage ERP Backend" cmd /k "cd backend\erp && mvn spring-boot:run"

echo Waiting 5 seconds for backend to initialize...
timeout /t 5 /nobreak >nul

echo Starting Frontend (React/Vite)...
start "Vantage ERP Frontend" cmd /k "cd frontend && npm run dev"

echo.
echo Both services are starting in separate windows.
echo Backend: http://localhost:8080
echo Frontend: http://localhost:5173
echo API URL configured: http://localhost:8080/api (from frontend/.env)
echo.
echo Press any key to close this window (services will continue running)...
pause >nul
