import { resolveIOSDependency } from './ios'
import { resolveAndroidDependency } from './android'

export type NativePlatformDefinition = { displayName: string; versionRange: string }

export type AndroidNoteOptions = { path: string; gradleTaskName: string }
export type IOSNoteOptions = { podspecPath: string; dependencyName: string }

function formatter(platforms: NativePlatformDefinition[]) {
  let result = `### Supported Native SDK Version Range\n\n`

  result += platforms
    .map(({ displayName, versionRange }) => {
      return `* ${displayName} Version Range: **\`${versionRange}\`**`
    })
    .join('\n')

  return result
}

export async function generateNativeDepsNote(android: AndroidNoteOptions, ios: IOSNoteOptions) {
  const platformVersions: NativePlatformDefinition[] = [
    {
      displayName: 'Fingerprint iOS SDK',
      versionRange: await resolveIOSDependency({
        displayName: 'Fingerprint iOS SDK',
        dependencyName: ios.dependencyName,
        podSpecPath: ios.podspecPath,
      }),
    },

    {
      displayName: 'Fingerprint Android SDK',
      versionRange: await resolveAndroidDependency({
        path: android.path,
        displayName: 'Fingerprint Android SDK',
        gradleTaskName: android.gradleTaskName,
      }),
    },
  ]

  return formatter(platformVersions)
}
