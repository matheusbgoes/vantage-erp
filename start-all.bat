@echo off
start cmd /k "cd backend/erp && mvn spring-boot:run"
start cmd /k "cd frontend && npm run dev"
