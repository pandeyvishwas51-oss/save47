#!/bin/sh
set -e

# Decode YouTube cookies from base64 env var if present.
# This lets us store cookies as a Railway env var without needing a volume mount.
if [ -n "$YTDLP_COOKIES_B64" ]; then
  echo "$YTDLP_COOKIES_B64" | base64 -d > /tmp/cookies.txt
  export YTDLP_COOKIES_FILE=/tmp/cookies.txt
  echo "[entrypoint] YouTube cookies decoded to /tmp/cookies.txt"
fi

exec node dist/index.js
