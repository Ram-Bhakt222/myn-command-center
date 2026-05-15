@echo off
REM Weekly MYN audit push - 2026-05-05
set PATH=C:\Program Files\Git\cmd;%PATH%
cd /d "C:\Users\ram\Desktop\Command Center\myn-command-center"
git add scott-hoffman-knowledge-base.html
git commit -m "Weekly audit update 2026-05-05 - walking yoga + healthcare cost spike refresh"
git push origin main
echo.
echo === Push complete ===
