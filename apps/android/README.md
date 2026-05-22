# Save47 Android (TWA)

The Android app is a Trusted Web Activity wrapping the Save47 PWA at
`https://save47.com`. Bubblewrap converts `twa-manifest.json` into a
buildable Android project, then Gradle produces a signed APK.

## Build the APK locally

Prerequisites:
- Java 17+
- Android SDK + build-tools 34
- `npm i -g @bubblewrap/cli`

Steps:

```bash
cd apps/android
bubblewrap init --manifest=twa-manifest.json    # generates Android project (first time only)
bubblewrap update                                # whenever twa-manifest.json changes
bubblewrap build                                 # produces app-release-signed.apk
```

The first `init` will prompt to create or use an existing `android.keystore`.
**Keep that keystore safe and committed nowhere — losing it means you can't
ship updates under the same package id.**

## Update the asset links file

For TWAs to render fullscreen (no browser chrome), the host site must serve
`/.well-known/assetlinks.json` proving ownership of the package. After
generating a keystore, run:

```bash
bubblewrap fingerprint generate
```

…and copy the generated `assetlinks.json` to
`apps/web/public/.well-known/assetlinks.json`.

## CI

A GitHub Actions workflow at `.github/workflows/android.yml` builds and
signs the APK on every release tag using a base64-encoded keystore stored
in repo secrets (`ANDROID_KEYSTORE_B64`, `ANDROID_KEYSTORE_PASSWORD`,
`ANDROID_KEY_ALIAS`, `ANDROID_KEY_PASSWORD`).
