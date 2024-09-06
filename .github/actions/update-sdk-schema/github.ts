import { Octokit } from '@octokit/rest'

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

export async function getReleaseNotes(releaseNotesAsset: ReleaseAsset, ignoredScopes: string[]) {
  let releaseNotes: Array<{
    type: string
    notes: Array<{ note: string; scope: string | null }>
  }> = JSON.parse((await downloadAsset(releaseNotesAsset.browser_download_url)).toString('utf-8'))

  if (ignoredScopes.length > 0) {
    releaseNotes = releaseNotes.map((notes) => ({
      ...notes,
      notes: notes.notes.filter((note) => !note.scope || !ignoredScopes.includes(note.scope)),
    }))
  }

  return releaseNotes
}
