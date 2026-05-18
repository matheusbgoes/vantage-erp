@echo off
setlocal enableextensions enabledelayedexpansion

echo ====================================================
echo   Iniciando o Ecossistema Vantage ERP (Localhost)
echo ====================================================

if not exist "%JAVA_HOME%\bin\java.exe" (
  if exist "C:\Program Files\Java\jdk-21.0.10\bin\java.exe" (
    set "JAVA_HOME=C:\Program Files\Java\jdk-21.0.10"
  )
)
set "PATH=%JAVA_HOME%\bin;%PATH%"

:: Entra na pasta exata do backend e roda com o Maven Wrapper
cd /d "%~dp0backend\erp"
start "Vantage ERP Backend" cmd /k "echo Iniciando o Backend (Java)... && .\mvnw.cmd clean spring-boot:run"

:: Aguarda 3 segundos para o processo do Java se estabilizar antes do Frontend
timeout /t 3 /nobreak > nul

:: Entra na pasta do frontend e roda o React (Vite)
cd /d "%~dp0frontend"
start "Vantage ERP Frontend" cmd /k "echo Iniciando o Frontend (React)... && npm run dev"

exit /b
