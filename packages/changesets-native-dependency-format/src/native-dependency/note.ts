import { resolveIOSDependency } from './ios'
import { resolveAndroidDependency } from './android'

export type NativePlatformDefinition = { displayName: string; versionRange: string }

function formatter(platforms: NativePlatformDefinition[]) {
  let result = `### Supported Native SDK Version Range\n\n`

  result += platforms
    .map(({ displayName, versionRange }) => {
      return `* ${displayName} Version Range: **\`${versionRange}\`**`
    })
    .join('\n')

  return result
}

export async function generateNativeDepsNote(androidPath: string, iosPodspecPath: string) {
  const platformVersions: NativePlatformDefinition[] = [
    {
      displayName: 'Fingerprint iOS SDK',
      versionRange: await resolveIOSDependency({
        displayName: 'Fingerprint iOS SDK',
        dependencyName: 'FingerprintPro',
        podSpecPath: iosPodspecPath,
      }),
    },

    {
      displayName: 'Fingerprint Android SDK',
      versionRange: await resolveAndroidDependency({
        path: androidPath,
        displayName: 'Fingerprint Android SDK',
        gradleTaskName: 'printFingerprintNativeSDKVersion',
      }),
    },
  ]

  return formatter(platformVersions)
}
