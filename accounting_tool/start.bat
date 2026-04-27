@echo off
title DATEV Jahresabschluss-Prüfer

:: API-Key hier eintragen (einmalig):
set ANTHROPIC_API_KEY=sk-ant-HIER-IHREN-KEY-EINTRAGEN

:: ─────────────────────────────────────────────────────────
echo.
echo  ===================================================
echo   DATEV Jahresabschluss-Prüfer wird gestartet...
echo  ===================================================
echo.

:: Prüfen ob Python installiert ist
python --version >nul 2>&1
if errorlevel 1 (
    echo  FEHLER: Python nicht gefunden!
    echo.
    echo  Bitte Python installieren unter:
    echo  https://www.python.org/downloads/
    echo.
    echo  Wichtig: "Add Python to PATH" ankreuzen!
    pause
    exit /b 1
)

:: Pakete installieren
echo  Pakete werden installiert...
pip install -r requirements.txt -q

echo.
echo  App startet auf: http://localhost:8000
echo.
echo  Jetzt Browser öffnen und http://localhost:8000 aufrufen!
echo  (Fenster offen lassen - Beenden mit Strg+C)
echo.

:: Browser automatisch öffnen
timeout /t 2 /nobreak >nul
start http://localhost:8000

:: App starten
python main.py

pause
