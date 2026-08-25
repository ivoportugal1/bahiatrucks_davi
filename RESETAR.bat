@echo off
cd /d "C:\Users\User\bahiatrucks_davi\fidelizarei\backend"

echo Resetando banco de dados...
call npx prisma migrate reset --force

echo Compilando backend...
call npm run build

echo.
echo ========================================
echo Banco resetado com sucesso!
echo Execute INICIAR.bat para rodar tudo
echo ========================================
pause
