@echo off
title Mord im Server-Raum
cd /d "%~dp0"
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0server.ps1"
if errorlevel 1 (
  echo.
  echo Der lokale Server konnte nicht starten. Die Website wird direkt geoeffnet.
  start "" "%~dp0index.html"
  pause
)
