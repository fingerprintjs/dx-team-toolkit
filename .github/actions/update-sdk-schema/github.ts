import { Octokit } from '@octokit/rest'
import * as unzipper from 'unzipper'
import { getChangesetScope, replacePackageName } from './changesets'
import * as path from 'path'

type Release = Awaited<ReturnType<Octokit['repos']['getReleaseByTag']>>['data']
type ReleaseAsset = Release['assets'][number]

export function findAsset(name: string, release: Release) {
  const result = release.assets.find((asset) => asset.name === name)

  if (!result) {
    throw new Error(`Cannot find ${name} in the release`)
  }

  return result
}

export async function downloadAsset(url: string) {
  const response = await fetch(url)

  return Buffer.from(await response.arrayBuffer())
}

export async function getReleaseNotes(
  releaseNotesAsset: ReleaseAsset,
  ignoredScopes: string[],
  packageName: string
): Promise<Map<string, string>> {
  // Map of changeset file name and contents
  const changesets = new Map<string, string>()

  const releaseNotesZip = await downloadAsset(releaseNotesAsset.browser_download_url)
  const contents = await unzipper.Open.buffer(releaseNotesZip)

  for (const file of contents.files) {
    const content = await file.buffer()
    const str = content.toString('utf-8')
    const scope = getChangesetScope(str)

    if (!scope || !ignoredScopes.includes(scope)) {
      const fileName = path.basename(file.path)

      changesets.set(fileName, replacePackageName(str, packageName))
    }
  }

  return changesets
}
