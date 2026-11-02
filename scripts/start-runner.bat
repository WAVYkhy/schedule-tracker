@echo off
cd /d "C:\apps\actions-runner-schedule"
set "PATH=C:\Users\wkjne\AppData\Local\Programs\NodeJS;C:\Users\wkjne\AppData\Local\Programs\Git\cmd;%PATH%"
run.cmd >> "C:\apps\actions-runner-schedule\runner.log" 2>&1
