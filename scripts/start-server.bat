@echo off
cd /d "C:\apps\schedule"
set "PATH=C:\Users\wkjne\AppData\Local\Programs\NodeJS;C:\Users\wkjne\AppData\Local\Programs\Git\cmd;%PATH%"

for /f "tokens=5" %%a in ('netstat -aon ^| findstr ":3000" ^| findstr "LISTENING"') do (
    taskkill /F /PID %%a >nul 2>&1
)
timeout /t 2 /nobreak >nul

node node_modules\next\dist\bin\next start -p 3000 > "C:\apps\schedule\server.log" 2>&1
