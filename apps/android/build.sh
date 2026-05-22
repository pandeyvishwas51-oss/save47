#!/usr/bin/env bash
# Local APK build helper. Requires: bubblewrap, Java 17+, Android SDK.
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "${SCRIPT_DIR}"

if ! command -v bubblewrap >/dev/null 2>&1; then
  echo "bubblewrap not found. Install it with: npm i -g @bubblewrap/cli" >&2
  exit 1
fi

if [[ ! -f "./android.keystore" ]]; then
  echo "[save47] No keystore found at ./android.keystore"
  echo "[save47] Generating a new one (you will be prompted for passwords)..."
  bubblewrap init --manifest=twa-manifest.json
else
  bubblewrap update
fi

bubblewrap build

# Stage the APK where the web app expects it for direct download.
WEB_PUBLIC="${SCRIPT_DIR}/../web/public/downloads"
mkdir -p "${WEB_PUBLIC}"
cp -f app-release-signed.apk "${WEB_PUBLIC}/save47-latest.apk"
echo "[save47] APK staged at ${WEB_PUBLIC}/save47-latest.apk"
