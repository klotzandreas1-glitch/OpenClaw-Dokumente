#!/bin/bash
# DATEV Jahresabschluss-Prüfer – Startskript

# API-Key hier eintragen (einmalig):
ANTHROPIC_API_KEY="sk-ant-HIER-IHREN-KEY-EINTRAGEN"

# ─── Ab hier nichts ändern ────────────────────────────────────────────────────
cd "$(dirname "$0")"

if [[ "$ANTHROPIC_API_KEY" == *"HIER-IHREN"* ]]; then
  echo ""
  echo "⚠️  Bitte zuerst den Anthropic API-Key in start.sh eintragen!"
  echo "   Zeile 4: ANTHROPIC_API_KEY=\"sk-ant-...\""
  echo ""
  echo "   API-Key erhalten unter: https://console.anthropic.com"
  echo ""
  read -p "Trotzdem starten (nur regelbasierte Prüfung)? [j/N] " antwort
  if [[ "$antwort" != "j" && "$antwort" != "J" ]]; then
    exit 1
  fi
fi

export ANTHROPIC_API_KEY

echo ""
echo "✅ Pakete werden geprüft..."
pip install -r requirements.txt -q

echo ""
echo "🚀 App startet auf http://localhost:8000"
echo "   Browser öffnen und loslegen!"
echo "   (Beenden mit Strg+C)"
echo ""

python3 main.py
