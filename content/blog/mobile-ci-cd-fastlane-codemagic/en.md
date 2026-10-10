---
title: CI/CD for Mobile Apps: Automating Builds with Fastlane and Codemagic
description: Automate signing, building, testing and uploading to TestFlight and Google Play with Fastlane and Codemagic, plus build numbers and secrets handling.
summary: Fastlane turns release steps into code (signing, building, testing, store uploads), while Codemagic provides hosted macOS machines and built-in publishing. Teams often combine them, with secrets kept only in encrypted CI variables.
---

## What to automate and with what

A manual mobile release is a dozen steps: bump the build number, sign, build, run tests, upload to TestFlight and Google Play. Each step is a chance to get something wrong. A pipeline does it the same way on every commit or tag.

- **Fastlane** is an open-source tool where releases are described as lanes in a `Fastfile`. It runs locally and on any CI.
- **Codemagic** is a hosted CI/CD service with macOS and Linux machines, a `codemagic.yaml` config, built-in code signing and store publishing. It supports Flutter, React Native and native projects well.

They are not rivals: you can run Fastlane inside Codemagic if your release logic already lives there.

## A typical pipeline

1. Check out code and install dependencies.
2. Run the linter and tests; a failure stops the release.
3. Install certificates and profiles (iOS) or the keystore (Android).
4. Set the build number.
5. Build the `.ipa` and `.aab`.
6. Upload to TestFlight and the Google Play internal track.
7. Notify the team.

## Fastlane: a sample Fastfile

```ruby
default_platform(:ios)

platform :ios do
  lane :beta do
    api_key = app_store_connect_api_key(
      key_id: ENV["ASC_KEY_ID"],
      issuer_id: ENV["ASC_ISSUER_ID"],
      key_content: ENV["ASC_KEY_CONTENT"]
    )
    setup_ci
    match(type: "appstore", readonly: true, api_key: api_key)
    increment_build_number(
      build_number: latest_testflight_build_number(api_key: api_key) + 1
    )
    build_app(scheme: "App", export_method: "app-store")
    upload_to_testflight(api_key: api_key, skip_waiting_for_build_processing: true)
  end
end

platform :android do
  lane :internal do
    gradle(task: "clean bundleRelease")
    upload_to_play_store(track: "internal")
  end
end
```

What matters here:

- **`match`** keeps certificates and profiles in an encrypted private repo or cloud bucket. The whole team and CI share the same ones, which ends "it signs on my machine but not yours".
- **`setup_ci`** creates a temporary keychain on the CI machine.
- An **App Store Connect API key** instead of an Apple ID login means no two-factor prompts in the pipeline.
- On Android, `upload_to_play_store` authenticates with a Google Play service account JSON key.

## Codemagic: a Flutter example

```yaml
workflows:
  ios-testflight:
    integrations:
      app_store_connect: CI key
    environment:
      flutter: stable
      ios_signing:
        distribution_type: app_store
        bundle_identifier: com.example.app
    scripts:
      - name: Dependencies
        script: flutter pub get
      - name: Tests
        script: flutter test
      - name: Signing
        script: xcode-project use-profiles
      - name: Build
        script: |
          flutter build ipa --release \
            --build-number=$BUILD_NUMBER \
            --export-options-plist=/Users/builder/export_options.plist
    artifacts:
      - build/ios/ipa/*.ipa
    publishing:
      app_store_connect:
        auth: integration
        submit_to_testflight: true
```

Codemagic fetches signing files through its App Store Connect integration. For Android, add a `google_play` entry under `publishing` with the service account key and track.

## Versioning

- The **version** (`1.4.0`) is for users. Change it deliberately, by hand or from a tag.
- The **build number** (`CFBundleVersion`, `versionCode`) is a technical counter that must always increase. Let the machine own it.

Reliable sources for the build number:

- the latest number in TestFlight or Google Play, plus one;
- the CI build counter (for example `$BUILD_NUMBER` in Codemagic);
- the commit count, but only if history is never rewritten.

Avoid a build number that someone edits by hand in the repo. It causes merge conflicts and rejected uploads.

## Secrets in the pipeline

Mobile pipelines handle especially valuable files: the Android keystore, the App Store Connect `.p8` key, the `match` passphrase and the Google service account JSON.

- **Never commit** them, not even to a private repo.
- Keep them in **encrypted CI variables**. Store binary files as base64 and decode them during the build.
- Grant **least privilege**: the Play service account only for the apps it needs, the API key only the role it needs.
- Restrict who can trigger release workflows, and never run them on pull requests from forks.
- Keep a **separate backup of the keystore**. If you sign yourself and lose it, updating the app becomes very hard. Play App Signing reduces this risk.

## Common mistakes

- One pipeline for every commit and for releases. Separate verification from publishing.
- Tests run after the store upload instead of before.
- Certificates created by hand on different machines that conflict with each other.
- No dependency caching, so builds take far longer than they should.

## FAQ

### Fastlane or Codemagic: which should I pick?

If you want hosted CI with macOS and no machines to maintain, Codemagic. If your release logic is complex or you already use another CI (GitHub Actions, GitLab CI), Fastlane. Many teams use both.

### Can I build iOS apps without a Mac?

Building for iOS requires macOS and Xcode, but not necessarily your own computer: hosted CI services provide macOS machines.

### How often should builds go to TestFlight?

A good rhythm is a build from the main branch after every merge or on a schedule, and production releases from tags. Testers then always have the current version.
