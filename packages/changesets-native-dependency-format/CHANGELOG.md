# @fingerprintjs/changesets-native-dependency-format

## 0.2.0

### Minor Changes

- Group native platform options and make the Android Gradle task and iOS dependency name configurable. `androidPath` becomes `android.path`, `iosPodspecPath` becomes `ios.podspecPath`. The Gradle task and iOS dependency name are now configurable via `android.gradleTaskName` and `ios.dependencyName`, both optional and defaulting to the previous hard-coded values (`printFingerprintNativeSDKVersion` and `FingerprintPro`). ([2c98142](https://github.com/fingerprintjs/dx-team-toolkit/commit/2c98142099692fd38ed8296890dd288a39cc7ab5))

## 0.1.0

### Minor Changes

- Initial release ([29ab76e](https://github.com/fingerprintjs/dx-team-toolkit/commit/29ab76e66feb647f9cfb1aafb814881c7ef981bf))
