@echo off
setlocal enableextensions enabledelayedexpansion
cd /d "%~dp0backend\erp"
start "Vantage ERP Backend" cmd /k "..\mvnw.cmd spring-boot:run"
cd /d "%~dp0frontend"
start "Vantage ERP Frontend" cmd /k "npm run dev"
exit /b
