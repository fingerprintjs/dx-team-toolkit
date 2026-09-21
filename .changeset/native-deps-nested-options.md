---
'@fingerprintjs/changesets-native-dependency-format': major
---

Group native platform options and make the Android Gradle task and iOS dependency name configurable. `androidPath` becomes `android.path`, `iosPodspecPath` becomes `ios.podspecPath`, and the previously hard-coded `printFingerprintNativeSDKVersion` task and `FingerprintPro` dependency are now set via `android.gradleTaskName` and `ios.dependencyName`.
