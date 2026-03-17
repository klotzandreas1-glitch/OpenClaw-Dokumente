#!/bin/bash
# Deepgram Transcription Script

API_KEY="5fe34cb415ff8736386cc2acf07fc31b61fe3500"

if [ -z "$1" ]; then
    echo "Usage: $0 <audio_file>"
    exit 1
fi

AUDIO_FILE="$1"

curl -s -X POST \
  --header "Authorization: Token $API_KEY" \
  --header "Content-Type: audio/wav" \
  --data-binary "@$AUDIO_FILE" \
  "https://api.deepgram.com/v1/listen?model=nova-2&punctuate=true&language=de"
