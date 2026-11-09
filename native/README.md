# DealPilot Android & iOS

These apps are thin shells around the live site at [https://www.dealpilot.co.in](https://www.dealpilot.co.in). They do **not** rebuild Next.js and they are **not** part of the Vercel deploy (`npm run build` at the repo root is unchanged).

There is a separate Expo prototype in `/mobile`. This folder is the store-ready wrapper of the current web app.

## One-time setup

```bash
cd native
npm install
npx cap add android
npx cap add ios
npx cap sync
```

Install [Android Studio](https://developer.android.com/studio) for APKs. Install full **Xcode** from the App Store for iOS (Command Line Tools alone cannot archive an IPA).

## Android APK

```bash
cd native
npx cap sync android
npx cap open android
```

In Android Studio: **Build → Build Bundle(s) / APK(s) → Build APK(s)**. The debug APK is under `android/app/build/outputs/apk/debug/`.

For Play Store, use **Build → Generate Signed Bundle / APK** and create a keystore you keep private.

## iOS

```bash
cd native
npx cap sync ios
npx cap open ios
```

In Xcode: pick a simulator or your iPhone, then **Product → Archive** for TestFlight / App Store. You need an Apple Developer account ($99/year) to install on a physical device outside a simulator.

## What stays on the web

Sign-in, proposals, contracts, Stripe, and Google auth all run on the website. A store update is only needed when you change this native shell (icon, splash, bundle id), not when you ship a Vercel web change.

Google sign-in can be blocked inside an in-app browser. Email sign-up works. If Google is required in the stores, we add native Google Sign-In later.
