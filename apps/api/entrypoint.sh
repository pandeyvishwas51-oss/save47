#!/bin/sh
set -e

# Load YouTube/Instagram cookies for yt-dlp from env vars.
# Supports three formats so users can paste however is convenient on Railway:
#   1. YTDLP_COOKIES_B64  — base64-encoded Netscape cookies.txt
#   2. YTDLP_COOKIES      — raw Netscape cookies.txt content (multiline)
#   3. YTDLP_COOKIES_FILE — already a file path (legacy / volume mount)

COOKIES_OUT="/tmp/cookies.txt"
COOKIES_LOADED="no"

if [ -n "$YTDLP_COOKIES_B64" ]; then
  if echo "$YTDLP_COOKIES_B64" | base64 -d > "$COOKIES_OUT" 2>/dev/null; then
    if [ -s "$COOKIES_OUT" ]; then
      export YTDLP_COOKIES_FILE="$COOKIES_OUT"
      COOKIES_LOADED="b64"
    fi
  fi
fi

if [ "$COOKIES_LOADED" = "no" ] && [ -n "$YTDLP_COOKIES" ]; then
  printf '%s\n' "$YTDLP_COOKIES" > "$COOKIES_OUT"
  if [ -s "$COOKIES_OUT" ]; then
    export YTDLP_COOKIES_FILE="$COOKIES_OUT"
    COOKIES_LOADED="raw"
  fi
fi

if [ "$COOKIES_LOADED" = "no" ] && [ -n "$YTDLP_COOKIES_FILE" ]; then
  if [ -f "$YTDLP_COOKIES_FILE" ]; then
    COOKIES_LOADED="file"
  else
    # Value was given but isn't a path — treat as raw content.
    printf '%s\n' "$YTDLP_COOKIES_FILE" > "$COOKIES_OUT"
    if [ -s "$COOKIES_OUT" ]; then
      export YTDLP_COOKIES_FILE="$COOKIES_OUT"
      COOKIES_LOADED="raw-fallback"
    fi
  fi
fi

if [ "$COOKIES_LOADED" != "no" ]; then
  # yt-dlp requires the Netscape header on the very first line.
  # If the file is missing it, prepend it so yt-dlp accepts the file.
  if ! head -n 1 "$YTDLP_COOKIES_FILE" | grep -q "Netscape HTTP Cookie File"; then
    TMP_HDR=$(mktemp)
    {
      echo "# Netscape HTTP Cookie File"
      echo "# This is a generated file!  Do not edit."
      echo ""
      cat "$YTDLP_COOKIES_FILE"
    } > "$TMP_HDR"
    mv "$TMP_HDR" "$YTDLP_COOKIES_FILE"
  fi
  COOKIE_LINES=$(wc -l < "$YTDLP_COOKIES_FILE" 2>/dev/null || echo 0)
  YT_LINES=$(grep -c "youtube\.com" "$YTDLP_COOKIES_FILE" 2>/dev/null || echo 0)
  IG_LINES=$(grep -c "instagram\.com" "$YTDLP_COOKIES_FILE" 2>/dev/null || echo 0)
  echo "[entrypoint] cookies loaded mode=$COOKIES_LOADED path=$YTDLP_COOKIES_FILE lines=$COOKIE_LINES youtube=$YT_LINES instagram=$IG_LINES"
else
  echo "[entrypoint] no cookies configured (set YTDLP_COOKIES_B64 or YTDLP_COOKIES)"
fi

exec node dist/index.js
