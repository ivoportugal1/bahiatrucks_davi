@echo off
cd /d "C:\Users\User\bahiatrucks_davi\fidelizarei"

REM Terminal 1 - Backend
start cmd /k "cd backend && npm start"

REM Espera 5 segundos
timeout /t 5

REM Terminal 2 - Admin
start cmd /k "cd admin && npm run dev"

REM Abre navegador
timeout /t 3
start http://localhost:3001

echo.
echo ========================================
echo Backend rodando em: http://localhost:3000
echo Admin rodando em: http://localhost:3001
echo ========================================
