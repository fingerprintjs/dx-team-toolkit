---
'@fingerprintjs/changesets-native-dependency-format': minor
---

Group native platform options and make the Android Gradle task and iOS dependency name configurable. `androidPath` becomes `android.path`, `iosPodspecPath` becomes `ios.podspecPath`. The Gradle task and iOS dependency name are now configurable via `android.gradleTaskName` and `ios.dependencyName`, both optional and defaulting to the previous hard-coded values (`printFingerprintNativeSDKVersion` and `FingerprintPro`).
