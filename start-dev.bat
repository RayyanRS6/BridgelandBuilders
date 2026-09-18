@echo off
title Bridgeland Builders - local dev server
cd /d "%~dp0"

echo ==================================================
echo   Bridgeland Builders - local development server
echo ==================================================
echo.
echo Syncing dependencies (needed once after recent changes)...
call npm install --no-audit --no-fund
if errorlevel 1 (
  echo.
  echo npm install failed. Check that Node.js is installed.
  pause
  exit /b 1
)

echo.
echo Starting the site at http://localhost:5173
echo Pages to check: /book-online  /blog  /services
echo.
echo Leave this window open. Press Ctrl+C to stop the server.
echo.
call npm run dev

pause
